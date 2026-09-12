import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(2, "Task title must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  dueDate: z.string().datetime().optional(),
  projectId: z.string().uuid("Invalid project ID"),
  assigneeId: z.string().uuid("Invalid assignee ID").optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  dueDate: z.string().datetime().optional(),
  assigneeId: z.string().uuid("Invalid assignee ID").optional(),
});

export const taskIdSchema = z.object({
  id: z.string().uuid("Invalid task ID"),
});

export const projectIdSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
});
