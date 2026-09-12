import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware";

import {
  createProject,
  getOrganizationProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "./project.service";

import {
  createProjectSchema,
  updateProjectSchema,
  projectIdSchema,
} from "./project.schema";

import { projectListQuerySchema } from "./project.query";
import { AppError } from "../../utils/authorization";

export async function createProjectController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const parsed = createProjectSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid project data",
        errors: parsed.error.flatten(),
      });
    }

    const project = await createProject(
      req.userId,
      parsed.data.organizationId,
      parsed.data.name,
      parsed.data.description,
    );

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create project failed:", error);

    const status =
      error instanceof AppError ? error.statusCode : 500;

    return res.status(status).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create project",
    });
  }
}

export async function getProjectsController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const organizationId = String(req.params.organizationId);

    const query = projectListQuerySchema.safeParse(req.query);

    if (!query.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid project query",
        errors: query.error.flatten(),
      });
    }

    const result = await getOrganizationProjects(
      req.userId,
      organizationId,
      query.data.page,
      query.data.limit,
      query.data.search,
    );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Get projects failed:", error);

    const status =
      error instanceof AppError ? error.statusCode : 500;

    return res.status(status).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get projects",
    });
  }
}

export async function getProjectController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const parsed = projectIdSchema.safeParse({
      id: String(req.params.id),
    });

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await getProjectById(
      req.userId,
      parsed.data.id,
    );

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Get project failed:", error);

    const status =
      error instanceof AppError ? error.statusCode : 500;

    return res.status(status).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get project",
    });
  }
}

export async function updateProjectController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const idParsed = projectIdSchema.safeParse({
      id: String(req.params.id),
    });

    if (!idParsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const dataParsed = updateProjectSchema.safeParse(req.body);

    if (!dataParsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid project data",
        errors: dataParsed.error.flatten(),
      });
    }

    const project = await updateProject(
      req.userId,
      idParsed.data.id,
      dataParsed.data.name,
      dataParsed.data.description,
    );

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Update project failed:", error);

    const status =
      error instanceof AppError ? error.statusCode : 500;

    return res.status(status).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update project",
    });
  }
}

export async function deleteProjectController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const parsed = projectIdSchema.safeParse({
      id: String(req.params.id),
    });

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    await deleteProject(
      req.userId,
      parsed.data.id,
    );

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project failed:", error);

    const status =
      error instanceof AppError ? error.statusCode : 500;

    return res.status(status).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete project",
    });
  }
}
