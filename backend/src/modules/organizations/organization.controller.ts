import type { Response } from "express";
import {
  createOrganization,
  getUserOrganizations,
} from "./organization.service";
import { createOrganizationSchema } from "./organization.schema";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware";

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

export async function createOrganizationController(
  req: AuthenticatedRequest,
  res: Response,
) {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const validation = createOrganizationSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid organization data",
      errors: validation.error.flatten(),
    });
  }

  try {
    const organization = await createOrganization(
      req.userId,
      validation.data.name,
    );

    return res.status(201).json({
      success: true,
      message: "Organization created successfully",
      organization,
    });
  } catch (error) {
    console.error("Create organization error:", error);

    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create organization",
    });
  }
}

export async function getUserOrganizationsController(
  req: AuthenticatedRequest,
  res: Response,
) {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const organizations = await getUserOrganizations(req.userId);

    return res.status(200).json({
      success: true,
      organizations,
    });
  } catch (error) {
    console.error("Get organizations error:", error);

    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get organizations",
    });
  }
}
