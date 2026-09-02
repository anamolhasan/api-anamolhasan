import { z } from "zod";

const linkZodSchema = z.object({
  label: z
    .string({ error: "Label is required" })
    .min(1, "Label is required"),
  url: z
    .string({ error: "URL is required" })
    .min(1, "URL is required"),
});

const createProjectZodSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(1, "Title is required")
    .max(100, "Title cannot be more than 100 characters"),
  slug: z.string().optional(),
  shortDescription: z
    .string()
    .max(200, "Short description cannot be more than 200 characters")
    .optional(),
  thumbnail: z.string().optional(),
  category: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.enum(["published", "draft", "archived"]).optional(),
  description: z
    .string({ error: "Description is required" })
    .min(1, "Description is required"),
  images: z
    .array(z.string(), { error: "Please upload at least one image" })
    .min(1, "Please upload at least one image"),
  liveLinks: z.array(linkZodSchema).optional(),
  sourceCodes: z.array(linkZodSchema).optional(),
  technologies: z
    .array(z.string(), { error: "Please add at least one technology" })
    .min(1, "Please add at least one technology"),
});

const updateProjectZodSchema = createProjectZodSchema.partial();

export const ProjectValidation = {
  createProjectZodSchema,
  updateProjectZodSchema,
};
