import { prisma } from "../../config/prisma";
import {
  assertOrganizationMember,
  AppError,
} from "../../utils/authorization";
import {
  getCache,
  setCache,
  deleteCacheByPattern,
} from "../../utils/cache";
import {
  organizationProjectsCacheKey,
} from "../../utils/cache-keys";

type ProjectListResult = {
  projects: Awaited<ReturnType<typeof prisma.project.findMany>>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export async function createProject(
  userId: string,
  organizationId: string,
  name: string,
  description?: string,
) {
  await assertOrganizationMember(userId, organizationId);

  const project = await prisma.project.create({
    data: {
      id: crypto.randomUUID(),
      name,
      description,
      organizationId,
      updatedAt: new Date(),
    },
  });

  await deleteCacheByPattern(
    `projects:${organizationId}:*`,
  );

  return project;
}

export async function getOrganizationProjects(
  userId: string,
  organizationId: string,
  page = 1,
  limit = 20,
  search?: string,
): Promise<ProjectListResult> {
  await assertOrganizationMember(userId, organizationId);

  const cacheKey = organizationProjectsCacheKey(
    organizationId,
    page,
    limit,
    search ?? "",
  );

  const cached =
    await getCache<ProjectListResult>(cacheKey);

  if (cached) {
    return cached;
  }

  const skip = (page - 1) * limit;

  const where = {
    organizationId,
    ...(search
      ? {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : {}),
  };

  const [projects, total] = await prisma.$transaction([
    prisma.project.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.project.count({
      where,
    }),
  ]);

  const result: ProjectListResult = {
    projects,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };

  await setCache(cacheKey, result, 60);

  return result;
}

export async function getProjectById(
  userId: string,
  projectId: string,
) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  await assertOrganizationMember(
    userId,
    project.organizationId,
  );

  return project;
}

export async function updateProject(
  userId: string,
  projectId: string,
  name?: string,
  description?: string,
) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  await assertOrganizationMember(
    userId,
    project.organizationId,
  );

  const updatedProject = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      updatedAt: new Date(),
    },
  });

  await deleteCacheByPattern(
    `projects:${project.organizationId}:*`,
  );

  return updatedProject;
}

export async function deleteProject(
  userId: string,
  projectId: string,
) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  await assertOrganizationMember(
    userId,
    project.organizationId,
  );

  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });

  await deleteCacheByPattern(
    `projects:${project.organizationId}:*`,
  );
}
