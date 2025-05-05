import api from "./api"

export const getNotifications = async () => {
  return api.get("/notifications")
}

export const getUnreadCount = async () => {
  return api.get("/notifications/unread-count")
}

export const markAllAsRead = async () => {
  return api.put("/notifications/read-all")
}

export const markAsRead = async (id) => {
  return api.put(`/notifications/${id}/read`)
}

export const deleteNotification = async (id) => {
  return api.delete(`/notifications/${id}`)
}
