import API from "./api"

export async function getOrganizationMembers(organizationId: string) {
  const response = await API.get(
    `/organization-members/${organizationId}/members`,
  )

  return response.data
}

export async function addOrganizationMember(
  organizationId: string,
  userId: string,
  role = "MEMBER",
) {
  const response = await API.post(
    `/organization-members/${organizationId}/members`,
    {
      userId,
      role,
    },
  )

  return response.data
}

export async function removeOrganizationMember(
  organizationId: string,
  userId: string,
) {
  const response = await API.delete(
    `/organization-members/${organizationId}/members/${userId}`,
  )

  return response.data
}
