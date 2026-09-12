import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import {
  createCommentController,
  getCommentsController,
  deleteCommentController,
} from "./comment.controller";

const router = Router();

router.post("/task/:taskId", requireAuth, createCommentController);
router.get("/task/:taskId", requireAuth, getCommentsController);
router.delete("/:id", requireAuth, deleteCommentController);

export default router;
