import { OrganizationRole } from "../../generated/prisma/enums";
import { prisma } from "../../config/prisma";

export async function createOrganization(
  userId: string,
  name: string
) {
  return prisma.organization.create({
    data: {
      id: crypto.randomUUID(),
      name,
      updatedAt: new Date(),
      OrganizationMember: {
        create: {
          id: crypto.randomUUID(),
          userId,
          role: OrganizationRole.OWNER,
        },
      },
    },
    include: {
      OrganizationMember: true,
    },
  });
}

export async function getUserOrganizations(userId: string) {
  return prisma.organization.findMany({
    where: {
      OrganizationMember: {
        some: {
          userId,
        },
      },
    },
    include: {
      OrganizationMember: {
        where: {
          userId,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
