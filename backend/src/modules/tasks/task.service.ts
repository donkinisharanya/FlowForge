import { prisma } from "../../config/prisma";
import {
  assertOrganizationMember,
  AppError,
} from "../../utils/authorization";

type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "DONE";

type TaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

async function getTaskWithOrganization(taskId: string) {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      Project: {
        select: {
          organizationId: true,
        },
      },
    },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
}

async function assertTaskAccess(
  userId: string,
  taskId: string,
) {
  const task = await getTaskWithOrganization(taskId);

  await assertOrganizationMember(
    userId,
    task.Project.organizationId,
  );

  return task;
}

export const createTask = async (
  title: string,
  description: string | undefined,
  priority: TaskPriority | undefined,
  dueDate: Date | undefined,
  projectId: string,
  creatorId: string,
  assigneeId: string | undefined,
) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      id: true,
      organizationId: true,
    },
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  await assertOrganizationMember(
    creatorId,
    project.organizationId,
  );

  if (assigneeId) {
    const assignee = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: assigneeId,
          organizationId: project.organizationId,
        },
      },
    });

    if (!assignee) {
      throw new AppError(
        "Assignee must be a member of the organization",
        400,
      );
    }
  }

  return prisma.task.create({
    data: {
      id: crypto.randomUUID(),
      title,
      description,
      priority,
      dueDate,
      projectId,
      creatorId,
      assigneeId,
      updatedAt: new Date(),
    },
  });
};

export const getTasksByProject = async (
  projectId: string,
  userId: string,
) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      organizationId: true,
    },
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  await assertOrganizationMember(
    userId,
    project.organizationId,
  );

  return prisma.task.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getTaskById = async (
  id: string,
  userId: string,
) => {
  await assertTaskAccess(userId, id);

  return prisma.task.findUnique({
    where: {
      id,
    },
  });
};

export const updateTask = async (
  id: string,
  userId: string,
  data: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: Date;
    assigneeId?: string;
  },
) => {
  const task = await assertTaskAccess(userId, id);

  if (data.assigneeId) {
    const assignee = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: data.assigneeId,
          organizationId: task.Project.organizationId,
        },
      },
    });

    if (!assignee) {
      throw new AppError(
        "Assignee must be a member of the organization",
        400,
      );
    }
  }

  return prisma.task.update({
    where: {
      id,
    },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
};

export const deleteTask = async (
  id: string,
  userId: string,
) => {
  await assertTaskAccess(userId, id);

  await prisma.task.delete({
    where: {
      id,
    },
  });
};
