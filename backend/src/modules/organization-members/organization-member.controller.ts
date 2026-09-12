import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware";

import {
  addMember,
  getOrganizationMembers,
  removeMember,
} from "./organization-member.service";

import {
  addMemberSchema,
  organizationMemberParamsSchema,
} from "./organization-member.schema";

function getErrorStatus(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    return error.statusCode;
  }

  return 400;
}

export const addMemberController = async (
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

    const { organizationId } =
      organizationMemberParamsSchema.parse(req.params);

    const data = addMemberSchema.parse(req.body);

    const member = await addMember(
      organizationId,
      req.userId,
      data,
    );

    return res.status(201).json({
      success: true,
      message: "Member added successfully",
      member,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to add member";

    return res.status(getErrorStatus(error)).json({
      success: false,
      message,
    });
  }
};

export const getMembersController = async (
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

    const { organizationId } =
      organizationMemberParamsSchema.parse(req.params);

    const members = await getOrganizationMembers(
      organizationId,
      req.userId,
    );

    return res.status(200).json({
      success: true,
      members,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to get members";

    return res.status(getErrorStatus(error)).json({
      success: false,
      message,
    });
  }
};

export const removeMemberController = async (
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

    const { organizationId, userId } =
      organizationMemberParamsSchema.parse(req.params);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    await removeMember(
      organizationId,
      req.userId,
      userId,
    );

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to remove member";

    return res.status(getErrorStatus(error)).json({
      success: false,
      message,
    });
  }
};
