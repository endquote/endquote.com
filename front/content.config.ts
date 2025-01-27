import { defineCollection, defineCollectionSource, z, type Collection } from "@nuxt/content";
import { asRobotsCollection } from "@nuxtjs/robots/content";
import { asSitemapCollection } from "@nuxtjs/sitemap/content";
import { PrismaClient } from "@prisma/client";

const commonCollection = (collection: Collection<Zod.ZodRawShape>): Collection<Zod.ZodRawShape> => {
  return defineCollection(asRobotsCollection(asSitemapCollection(collection)));
};

const commonSchema = {
  title: z.string(),
  date: z.string().date(),
  tags: z.array(z.string()).optional(),
  location: z.string().optional(),
  link: z.string().optional(),
  linkText: z.string().optional(),
};

const prisma = new PrismaClient();
// https://content.nuxt.com/docs/advanced/custom-source
const tripSource = defineCollectionSource({
  getKeys: async () => {
    const trips = await prisma.trip.findMany({ select: { eqId: true } });
    return trips.map((trip) => `${trip.eqId}.json`);
  },
  getItem: async (key: string) => {
    const trip = await prisma.trip.findFirst({
      where: { eqId: parseInt(key) },
      select: {
        start: true,
        checkins: {
          select: {
            date: true,
            venue: { select: { eqId: true, name: true, lat: true, lng: true } },
          },
          orderBy: { date: "asc" },
        },
      },
    });
    if (!trip) {
      return "";
    }
    trip.start *= 1000;
    trip.checkins.forEach((c) => (c.date *= 1000));
    return JSON.stringify(trip);
  },
});

export const collections = {
  content: commonCollection({
    type: "page",
    source: "*.md",
  }),
  projects: commonCollection({
    type: "page",
    source: "./projects/**/*.md",
    schema: z.object({
      ...commonSchema,
      subtitle: z.string().optional(),
      role: z.string(),
      client: z.string().optional(),
      clientLink: z.string().optional(),
      technologies: z.array(z.string()).optional(),
      gallery: z.array(z.string()).optional(),
      video: z.boolean().default(false),
      skip: z.number().default(0),
      audio: z.boolean().default(false),
      contributions: z.array(z.enum(["engineering", "design", "management"])).optional(),
    }),
  }),
  roles: commonCollection({
    type: "page",
    source: "./roles/**/*.md",
    schema: z.object({
      ...commonSchema,
      company: z.string(),
      end: z.string().date().optional(),
      context: z.array(z.enum(["business", "personal", "educational", "volunteer"])).optional(),
    }),
  }),
  honors: defineCollection({
    type: "page",
    source: "./honors/**/*.md",
    schema: z.object({
      ...commonSchema,
      role: z.string(),
      company: z.string(),
    }),
  }),
  awards: defineCollection({
    type: "data",
    source: "./awards/**/*.yaml",
    schema: z.object({
      ...commonSchema,
      company: z.string(),
      project: z.string(),
    }),
  }),
  trips: defineCollection({
    type: "data",
    source: tripSource,
    schema: z.object({
      start: z.date(),
      checkins: z.array(
        z.object({
          eqId: z.number(),
          date: z.date(),
          venue: z.object({ name: z.string(), lat: z.number(), lng: z.number() }),
        }),
      ),
    }),
  }),
};
