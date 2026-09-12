import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import {
  createTaskController,
  getTasksController,
  getTaskController,
  updateTaskController,
  deleteTaskController,
} from "./task.controller";

const router = Router();

router.post(
  "/",
  requireAuth,
  createTaskController
);

router.get(
  "/project/:projectId",
  requireAuth,
  getTasksController
);

router.get(
  "/:id",
  requireAuth,
  getTaskController
);

router.patch(
  "/:id",
  requireAuth,
  updateTaskController
);

router.delete(
  "/:id",
  requireAuth,
  deleteTaskController
);

export default router;
