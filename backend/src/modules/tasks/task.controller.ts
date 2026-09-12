import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware";

import {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
} from "./task.service";

import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  projectIdSchema,
} from "./task.schema";

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

export const createTaskController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const parsed = createTaskSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid task data",
        errors: parsed.error.flatten(),
      });
    }

    const task = await createTask(
      parsed.data.title,
      parsed.data.description,
      parsed.data.priority,
      parsed.data.dueDate
        ? new Date(parsed.data.dueDate)
        : undefined,
      parsed.data.projectId,
      req.userId,
      parsed.data.assigneeId,
    );

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task failed:", error);

    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create task",
    });
  }
};

export const getTasksController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const parsed = projectIdSchema.safeParse({
      projectId: String(req.params.projectId),
    });

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
        errors: parsed.error.flatten(),
      });
    }

    const tasks = await getTasksByProject(
      parsed.data.projectId,
      req.userId,
    );

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("Get tasks failed:", error);

    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get tasks",
    });
  }
};

export const getTaskController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const parsed = taskIdSchema.safeParse({
      id: String(req.params.id),
    });

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
        errors: parsed.error.flatten(),
      });
    }

    const task = await getTaskById(
      parsed.data.id,
      req.userId,
    );

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Get task failed:", error);

    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get task",
    });
  }
};

export const updateTaskController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const idParsed = taskIdSchema.safeParse({
      id: String(req.params.id),
    });

    if (!idParsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
        errors: idParsed.error.flatten(),
      });
    }

    const dataParsed = updateTaskSchema.safeParse(req.body);

    if (!dataParsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid task data",
        errors: dataParsed.error.flatten(),
      });
    }

    const task = await updateTask(
      idParsed.data.id,
      req.userId,
      {
        title: dataParsed.data.title,
        description: dataParsed.data.description,
        status: dataParsed.data.status,
        priority: dataParsed.data.priority,
        dueDate: dataParsed.data.dueDate
          ? new Date(dataParsed.data.dueDate)
          : undefined,
        assigneeId: dataParsed.data.assigneeId,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task failed:", error);

    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update task",
    });
  }
};

export const deleteTaskController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const parsed = taskIdSchema.safeParse({
      id: String(req.params.id),
    });

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
        errors: parsed.error.flatten(),
      });
    }

    await deleteTask(
      parsed.data.id,
      req.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task failed:", error);

    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete task",
    });
  }
};
