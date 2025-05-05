import api from "./api"

export const getUsers = async () => {
  return api.get("/users")
}

export const getUserById = async (id) => {
  return api.get(`/users/${id}`)
}

export const createUser = async (userData) => {
  return api.post("/users", userData)
}

export const updateUser = async (id, userData) => {
  return api.put(`/users/${id}`, userData)
}

export const deleteUser = async (id) => {
  return api.delete(`/users/${id}`)
}
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put("/users/change-password", { currentPassword, newPassword })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Failed to change password" }
  }
}
