import { z } from "zod";

export const addMemberSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  role: z.enum(["ADMIN", "MEMBER"]).optional(),
});

export const organizationMemberParamsSchema = z.object({
  organizationId: z.string().uuid("Invalid organization ID"),
  userId: z.string().uuid("Invalid user ID").optional(),
});

export type AddMemberInput = z.infer<typeof addMemberSchema>;
