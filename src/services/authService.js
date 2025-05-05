import api from "./api"

export const login = async (email, password) => {
  return api.post("/auth/login", { email, password })
}

export const getCurrentUser = async () => {
  return api.get("/auth/me")
}

export const logout = async () => {
  
  return Promise.resolve()
}
