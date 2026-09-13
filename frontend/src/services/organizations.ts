import API from "./api";

export type Organization = {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function getOrganizations(): Promise<Organization[]> {
  const response = await API.get("/organizations");

  return response.data?.organizations ?? response.data ?? [];
}

export async function createOrganization(name: string) {
  const response = await API.post("/organizations", {
    name,
  });

  return response.data;
}
