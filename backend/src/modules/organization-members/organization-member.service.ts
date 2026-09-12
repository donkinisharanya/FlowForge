import { prisma } from "../../config/prisma";
import {
  assertOrganizationAdmin,
  assertOrganizationMember,
  AppError,
} from "../../utils/authorization";
import { AddMemberInput } from "./organization-member.schema";

export const addMember = async (
  organizationId: string,
  currentUserId: string,
  data: AddMemberInput,
) => {
  await assertOrganizationAdmin(
    currentUserId,
    organizationId,
  );

  const user = await prisma.user.findUnique({
    where: {
      id: data.userId,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
  });

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  const existingMember =
    await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: data.userId,
          organizationId,
        },
      },
    });

  if (existingMember) {
    throw new AppError(
      "User is already a member of this organization",
      409,
    );
  }

  return prisma.organizationMember.create({
    data: {
      id: crypto.randomUUID(),
      userId: data.userId,
      organizationId,
      role: data.role ?? "MEMBER",
    },
    include: {
      User: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const getOrganizationMembers = async (
  organizationId: string,
  currentUserId: string,
) => {
  await assertOrganizationMember(
    currentUserId,
    organizationId,
  );

  return prisma.organizationMember.findMany({
    where: {
      organizationId,
    },
    include: {
      User: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      joinedAt: "asc",
    },
  });
};

export const removeMember = async (
  organizationId: string,
  currentUserId: string,
  userId: string,
) => {
  await assertOrganizationAdmin(
    currentUserId,
    organizationId,
  );

  const member = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  if (!member) {
    throw new AppError(
      "Organization member not found",
      404,
    );
  }

  if (member.role === "OWNER") {
    throw new AppError(
      "Organization owner cannot be removed",
      403,
    );
  }

  return prisma.organizationMember.delete({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });
};
