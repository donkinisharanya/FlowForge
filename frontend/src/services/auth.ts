import API from "./api"

export async function loginUser(email: string, password: string) {
  const response = await API.post("/auth/login", {
    email,
    password,
  })

  return response.data
}

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const response = await API.post("/auth/register", {
    name,
    email,
    password,
  })

  return response.data
}

export async function getCurrentUser() {
  const response = await API.get("/auth/me")
  return response.data
}
