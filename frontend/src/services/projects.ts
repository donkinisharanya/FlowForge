import API from "./api"

export async function getProjects() {
  const response = await API.get("/projects")
  return response.data
}

export async function getProject(id: string) {
  const response = await API.get(`/projects/${id}`)
  return response.data
}

export async function createProject(
  name: string,
  organizationId: string,
  description = "",
) {
  const response = await API.post("/projects", {
    name,
    description,
    organizationId,
  })

  return response.data
}

export async function updateProject(
  id: string,
  data: {
    name?: string
    description?: string
  },
) {
  const response = await API.patch(`/projects/${id}`, data)
  return response.data
}

export async function deleteProject(id: string) {
  const response = await API.delete(`/projects/${id}`)
  return response.data
}
