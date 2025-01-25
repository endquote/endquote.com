import { defineCollection, z, type Collection } from "@nuxt/content";
import { asRobotsCollection } from "@nuxtjs/robots/content";
import { asSitemapCollection } from "@nuxtjs/sitemap/content";

const pageCollection = (collection: Collection<Zod.ZodRawShape>): Collection<Zod.ZodRawShape> => {
  return defineCollection(asRobotsCollection(asSitemapCollection(collection)));
};

const schema = {
  title: z.string(),
  date: z.string().date(),
  tags: z.array(z.string()).optional(),
  location: z.string().optional(),
  link: z.string().optional(),
  linkText: z.string().optional(),
};

export const collections = {
  content: pageCollection({
    type: "page",
    source: "*.md",
  }),
  projects: pageCollection({
    type: "page",
    source: "./projects/**/*.md",
    schema: z.object({
      ...schema,
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
  roles: pageCollection({
    type: "page",
    source: "./roles/**/*.md",
    schema: z.object({
      ...schema,
      company: z.string(),
      end: z.string().date().optional(),
      context: z.array(z.enum(["business", "personal", "educational", "volunteer"])).optional(),
    }),
  }),
  honors: defineCollection({
    type: "page",
    source: "./honors/**/*.md",
    schema: z.object({
      ...schema,
      role: z.string(),
      company: z.string(),
    }),
  }),
  awards: defineCollection({
    type: "data",
    source: "./awards/**/*.yaml",
    schema: z.object({
      ...schema,
      company: z.string(),
      project: z.string(),
    }),
  }),
};
