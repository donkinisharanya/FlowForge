import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import {
  addMemberController,
  getMembersController,
  removeMemberController,
} from "./organization-member.controller";

const router = Router();

router.post(
  "/:organizationId/members",
  requireAuth,
  addMemberController,
);

router.get(
  "/:organizationId/members",
  requireAuth,
  getMembersController,
);

router.delete(
  "/:organizationId/members/:userId",
  requireAuth,
  removeMemberController,
);

export default router;