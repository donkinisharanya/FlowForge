import API from "./api"

export async function getTasks(projectId: string) {
  const response = await API.get(`/tasks/project/${projectId}`)
  return response.data
}

export async function getTask(id: string) {
  const response = await API.get(`/tasks/${id}`)
  return response.data
}

export async function createTask(
  title: string,
  projectId: string,
  priority = "MEDIUM",
) {
  const response = await API.post("/tasks", {
    title,
    projectId,
    priority,
  })

  return response.data
}

export async function updateTask(id: string, data: any) {
  const response = await API.patch(`/tasks/${id}`, data)
  return response.data
}

export async function deleteTask(id: string) {
  const response = await API.delete(`/tasks/${id}`)
  return response.data
}
