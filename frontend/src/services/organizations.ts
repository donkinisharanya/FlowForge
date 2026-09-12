import API from "./api"

export async function getOrganizations() {
  const response = await API.get("/organizations")
  return response.data
}

export async function getOrganization(id: string) {
  const response = await API.get(`/organizations/${id}`)
  return response.data
}

export async function createOrganization(
  name: string,
  description = "",
) {
  const response = await API.post("/organizations", {
    name,
    description,
  })

  return response.data
}

export async function updateOrganization(
  id: string,
  data: {
    name?: string
    description?: string
  },
) {
  const response = await API.patch(`/organizations/${id}`, data)
  return response.data
}

export async function deleteOrganization(id: string) {
  const response = await API.delete(`/organizations/${id}`)
  return response.data
}
