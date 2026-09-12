import API from "./api"

export async function getComments(taskId: string) {
  const response = await API.get(`/comments/task/${taskId}`)
  return response.data
}

export async function createComment(content: string, taskId: string) {
  const response = await API.post(`/comments/task/${taskId}`, {
    content,
  })

  return response.data
}

export async function deleteComment(id: string) {
  const response = await API.delete(`/comments/${id}`)
  return response.data
}
