import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import {
  createProjectController,
  getProjectsController,
  getProjectController,
  updateProjectController,
  deleteProjectController,
} from "./project.controller";

const router = Router();

router.post(
  "/",
  requireAuth,
  createProjectController
);

router.get(
  "/organization/:organizationId",
  requireAuth,
  getProjectsController
);

router.get(
  "/:id",
  requireAuth,
  getProjectController
);

router.patch(
  "/:id",
  requireAuth,
  updateProjectController
);

router.delete(
  "/:id",
  requireAuth,
  deleteProjectController
);

export default router;
