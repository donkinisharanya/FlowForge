import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import {
  createOrganizationController,
  getUserOrganizationsController,
} from "./organization.controller";

const router = Router();

router.post(
  "/",
  requireAuth,
  createOrganizationController
);

router.get(
  "/",
  requireAuth,
  getUserOrganizationsController
);

export default router;
