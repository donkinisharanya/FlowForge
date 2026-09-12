import { prisma } from "../config/prisma";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

export async function assertOrganizationMember(
  userId: string,
  organizationId: string,
) {
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
      "You are not a member of this organization",
      403,
    );
  }

  return member;
}

export async function assertOrganizationAdmin(
  userId: string,
  organizationId: string,
) {
  const member = await assertOrganizationMember(
    userId,
    organizationId,
  );

  if (member.role !== "OWNER" && member.role !== "ADMIN") {
    throw new AppError(
      "Administrator permission required",
      403,
    );
  }

  return member;
}
