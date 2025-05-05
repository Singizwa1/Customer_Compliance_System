"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { login, getCurrentUser, logout } from "../services/authService"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token")
    if (token) {
      fetchCurrentUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchCurrentUser = async () => {
    try {
      const userData = await getCurrentUser()
      setCurrentUser(userData)
    } catch (err) {
      console.error("Failed to fetch current user:", err)
      localStorage.removeItem("token")
    } finally {
      setLoading(false)
    }
  }

  const loginUser = async (email, password) => {
    try {
      setError(null)
      const { token, user } = await login(email, password)
      localStorage.setItem("token", token)
      setCurrentUser(user)
      return user
    } catch (err) {
      setError(err.message || "Failed to login")
      throw err
    }
  }

  const logoutUser = async () => {
    try {
      await logout()
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      localStorage.removeItem("token")
      setCurrentUser(null)
    }
  }

  const value = {
    currentUser,
    loading,
    error,
    login: loginUser,
    logout: logoutUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
