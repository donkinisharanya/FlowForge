import API from "./api";

export type Project = {
  id: string;
  name: string;
  description?: string | null;
  organizationId: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function getProjects(
  organizationId: string,
  search = "",
): Promise<Project[]> {
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

  return response.data?.projects ?? response.data ?? [];
}

export async function createProject(
  name: string,
  description: string,
  organizationId: string,
) {
  const response = await API.post("/projects", {
    name,
    organizationId,
    ...(description ? { description } : {}),
  });

  return response.data;
}

export async function deleteProject(projectId: string) {
  const response = await API.delete(`/projects/${projectId}`);

  return response.data;
}

export async function getProject(projectId: string) {
  const response = await API.get(`/projects/${projectId}`);

  return response.data;
}
