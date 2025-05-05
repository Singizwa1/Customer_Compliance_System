"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { getNotifications, markAllAsRead, markAsRead } from "../services/notificationService"
import { useAuth } from "./AuthContext"

const NotificationContext = createContext()

export const useNotifications = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { currentUser } = useAuth()

  useEffect(() => {
    if (currentUser) {
      fetchNotifications()
    } else {
      setNotifications([])
      setUnreadCount(0)
    }
  }, [currentUser])

  const fetchNotifications = async () => {
    if (!currentUser) return

    try {
      setLoading(true)
      const data = await getNotifications()
      setNotifications(data)
      setUnreadCount(data.filter((n) => !n.read).length)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error(`Failed to mark notification ${id} as read:`, error)
    }
  }

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAllAsRead: handleMarkAllAsRead,
    markAsRead: handleMarkAsRead,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
