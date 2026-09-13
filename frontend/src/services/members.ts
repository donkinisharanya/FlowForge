import API from "./api";

export type OrganizationMember = {
  id?: string;
  userId: string;
  organizationId?: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
};

export async function getOrganizationMembers(organizationId: string) {
  const response = await API.get(
    `/organization-members/${organizationId}/members`,
  );

  return response.data;
}

export async function addOrganizationMember(
  organizationId: string,
  userId: string,
  role: "ADMIN" | "MEMBER" = "MEMBER",
) {
  const response = await API.post(
    `/organization-members/${organizationId}/members`,
    {
      userId,
      role,
    },
  );

  return response.data;
}

export async function removeOrganizationMember(
  organizationId: string,
  userId: string,
) {
  const response = await API.delete(
    `/organization-members/${organizationId}/members/${userId}`,
  );

  return response.data;
}
