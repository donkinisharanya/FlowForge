import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware";

import {
  createComment,
  getCommentsByTask,
  deleteComment,
} from "./comment.service";

import {
  createCommentSchema,
  commentIdSchema,
  taskIdSchema,
} from "./comment.schema";

function getErrorStatus(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    return error.statusCode;
  }

  return 500;
}

export async function createCommentController(
  req: AuthenticatedRequest,
  res: Response,
) {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const params = taskIdSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid task ID",
      errors: params.error.flatten(),
    });
  }

  const body = createCommentSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid comment data",
      errors: body.error.flatten(),
    });
  }

  try {
    const comment = await createComment(
      body.data.content,
      params.data.taskId,
      req.userId,
    );

    return res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    console.error("Create comment failed:", error);

    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create comment",
    });
  }
}

export async function getCommentsController(
  req: AuthenticatedRequest,
  res: Response,
) {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const params = taskIdSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid task ID",
      errors: params.error.flatten(),
    });
  }

  try {
    const comments = await getCommentsByTask(
      params.data.taskId,
      req.userId,
    );

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Get comments failed:", error);

    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get comments",
    });
  }
}

export async function deleteCommentController(
  req: AuthenticatedRequest,
  res: Response,
) {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const params = commentIdSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid comment ID",
      errors: params.error.flatten(),
    });
  }

  try {
    await deleteComment(
      params.data.id,
      req.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete comment failed:", error);

    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete comment",
    });
  }
}
