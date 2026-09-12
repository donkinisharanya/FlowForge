import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().optional(),
  organizationId: z.string().uuid("Invalid organization ID"),
});

export const updateProjectSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
});

export const projectIdSchema = z.object({
  id: z.string().uuid("Invalid project ID"),
});
