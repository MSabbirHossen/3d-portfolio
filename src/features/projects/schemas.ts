import { z } from "zod";

export const projectStatusSchema = z.enum(["draft", "published", "archived"]);

export const projectSchema = z.object({
  id: z.string(),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  title: z.string().min(2).max(120),
  category: z.string().min(2).max(60),
  summary: z.string().min(10).max(300),
  description: z.string().min(20),
  role: z.string().min(2).max(60),
  period: z.string().min(2).max(40),
  featured: z.boolean().default(false),
  featuredOrder: z.number().int().min(1).max(99).optional(),
  status: projectStatusSchema.default("draft"),
  technologies: z.array(z.string()).min(1),
  architecture: z.array(z.string()).default([]),
  challenges: z.array(z.string()).default([]),
  lessonsLearned: z.array(z.string()).default([]),
  futureImprovements: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  apiEndpoints: z.array(z.string()).default([]),
  githubUrl: z.string().url(),
  liveUrl: z.string().url().optional().nullable(),
  coverMediaUrl: z.string().optional().nullable(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const createProjectDtoSchema = projectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProjectDtoSchema = createProjectDtoSchema.partial();

export const projectFilterSchema = z.object({
  category: z.string().optional(),
  featured: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  status: projectStatusSchema.optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  page: z.coerce.number().int().min(1).default(1),
});
