import { defineCollection, z, type Collection } from "@nuxt/content";
import { asRobotsCollection } from "@nuxtjs/robots/content";
import { asSitemapCollection } from "@nuxtjs/sitemap/content";

const commonCollection = (collection: Collection<Zod.ZodRawShape>): Collection<Zod.ZodRawShape> => {
  return defineCollection(asRobotsCollection(asSitemapCollection(collection)));
};

const commonSchema = {
  title: z.string(),
  date: z.string().datetime(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().default(false),
};

export const collections = {
  content: commonCollection({
    type: "page",
    source: "*.md",
  }),
  blog: commonCollection({
    type: "page",
    source: "./blog/**/*.md",
    schema: z.object({
      ...commonSchema,
      slug: z.string(),
      subtitle: z.string(),
      location: z.string().default("San Francisco, CA"),
    }),
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
      link: z.string().optional(),
      linkText: z.string().optional(),
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
      location: z.string(),
      link: z.string().optional(),
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
      link: z.string().optional(),
    }),
  }),
  trips: commonCollection({
    type: "page",
    source: "./trips/**/*.md",
    schema: z.object({
      ...commonSchema,
    }),
  }),
};
