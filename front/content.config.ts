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
  tripData: defineCollection({
    type: "page",
    source: defineCollectionSource({
      // https://content.nuxt.com/docs/advanced/custom-source
      getKeys: async () => {
        const trips = await prisma.trip.findMany({ select: { eqId: true } });
        return trips.map((trip) => `${trip.eqId}.json`);
      },
      getItem: async (key: string) => {
        const trip = (await prisma.trip.findFirst({
          where: { eqId: parseInt(key) },
          include: { checkins: { include: { venue: true } }, flights: true },
        }))!;
        return JSON.stringify({
          ...trip,
          // add date-only fields for easier filtering
          startDate: trip.start.toISOString().split("T")[0],
          endDate: trip.end.toISOString().split("T")[0],
        });
      },
    }),
    schema: z.object({
      start: z.string().datetime(),
      startDate: z.string().date(),
      end: z.string().datetime(),
      endDate: z.string().date(),
      checkins: z.array(
        z.object({
          eqId: z.number(),
          date: z.string().datetime(),
          venue: z.object({ name: z.string(), lat: z.number(), lng: z.number() }),
        }),
      ),
      flights: z.array(
        z.object({
          eqId: z.number(),
          date: z.string().datetime(),
          from: z.string(),
          to: z.string(),
        }),
      ),
    }),
  }),
  tripPages: commonCollection({
    type: "page",
    source: "./trips/**/*.md",
    schema: z.object({
      ...commonSchema,
    }),
  }),
};
