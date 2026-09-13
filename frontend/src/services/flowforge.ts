import API from "./api";

export async function getCurrentUser() {
  const response = await API.get("/auth/me");
  return response.data;
}

export async function getOrganizations() {
  const response = await API.get("/organizations");
  return response.data;
}

export async function createOrganization(name: string) {
  const response = await API.post("/organizations", {
    name,
  });

  return response.data;
}

export async function getProjects(
  organizationId: string,
  search = "",
) {
  const response = await API.get(
    `/projects/organization/${organizationId}`,
    {
      params: {
        page: 1,
        limit: 50,
        ...(search ? { search } : {}),
      },
    },
  );

  return response.data;
}

export async function createProject(
  organizationId: string,
  name: string,
  description?: string,
) {
  const response = await API.post("/projects", {
    organizationId,
    name,
    ...(description ? { description } : {}),
  });

  return response.data;
}

export async function deleteProject(projectId: string) {
  const response = await API.delete(`/projects/${projectId}`);
  return response.data;
}

export async function getTasks(projectId: string) {
  const response = await API.get(`/tasks/project/${projectId}`);
  return response.data;
}

export async function createTask(data: {
  title: string;
  description?: string;
  priority?: string;
  projectId: string;
}) {
  const response = await API.post("/tasks", data);
  return response.data;
}

export async function updateTask(
  taskId: string,
  data: {
    status?: string;
    priority?: string;
    title?: string;
  },
) {
  const response = await API.patch(`/tasks/${taskId}`, data);
  return response.data;
}

export async function deleteTask(taskId: string) {
  const response = await API.delete(`/tasks/${taskId}`);
  return response.data;
}

export async function getMembers(organizationId: string) {
  const response = await API.get(
    `/organization-members/${organizationId}/members`,
  );

  return response.data;
}
