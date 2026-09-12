import { prisma } from "../../config/prisma";
import {
  assertOrganizationMember,
  AppError,
} from "../../utils/authorization";

async function assertTaskAccess(
  userId: string,
  taskId: string,
) {
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

  await assertOrganizationMember(
    userId,
    task.Project.organizationId,
  );

  return task;
}

export const createComment = async (
  content: string,
  taskId: string,
  userId: string,
) => {
  await assertTaskAccess(userId, taskId);

  return prisma.comment.create({
    data: {
      id: crypto.randomUUID(),
      content,
      taskId,
      userId,
      updatedAt: new Date(),
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

export const getCommentsByTask = async (
  taskId: string,
  userId: string,
) => {
  await assertTaskAccess(userId, taskId);

  return prisma.comment.findMany({
    where: {
      taskId,
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
      createdAt: "asc",
    },
  });
};

export const deleteComment = async (
  commentId: string,
  userId: string,
) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      Task: {
        include: {
          Project: {
            select: {
              organizationId: true,
            },
          },
        },
      },
    },
  });

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  await assertOrganizationMember(
    userId,
    comment.Task.Project.organizationId,
  );

  if (comment.userId !== userId) {
    throw new AppError(
      "You can only delete your own comment",
      403,
    );
  }

  return prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
};
