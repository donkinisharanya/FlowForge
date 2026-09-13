import API from "./api";

export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "DONE";

export type TaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  dueDate?: string | null;
  assigneeId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export async function getTasks(projectId: string): Promise<Task[]> {
  const response = await API.get(`/tasks/project/${projectId}`);

  return response.data?.tasks ?? response.data ?? [];
}

export async function createTask(
  title: string,
  projectId: string,
) {
  const response = await API.post("/tasks", {
    title,
    projectId,
  });

  return response.data;
}

export async function updateTask(
  taskId: string,
  data: Partial<{
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    assigneeId: string;
  }>,
) {
  const response = await API.patch(`/tasks/${taskId}`, data);

  return response.data;
}

export async function deleteTask(taskId: string) {
  const response = await API.delete(`/tasks/${taskId}`);

  return response.data;
}
