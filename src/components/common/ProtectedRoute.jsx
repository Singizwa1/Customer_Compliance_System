"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import Loader from "./Loader"

const ProtectedRoute = ({ children, roles = [] }) => {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return <Loader />
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  // If roles are specified, check if user has required role
  if (roles.length > 0 && !roles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
