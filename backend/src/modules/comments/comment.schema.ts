import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().min(1).max(5000),
});

export const commentIdSchema = z.object({
  id: z.string().uuid("Invalid comment ID"),
});

export const taskIdSchema = z.object({
  taskId: z.string().uuid("Invalid task ID"),
});
