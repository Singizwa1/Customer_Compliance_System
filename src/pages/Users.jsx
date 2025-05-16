"use client"

import { useState, useEffect } from "react"
import Header from "../components/common/Header"
import Sidebar from "../components/common/Sidebar"
import Loader from "../components/common/Loader"
import { getUsers, createUser, updateUser, deleteUser } from "../services/userService"
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi"
import { toast } from "react-toastify"
import "../styles/global.css"

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer_relations_officer",
    department: "Customer Relations",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await getUsers()
      setUsers(data)
    } catch (error) {
      console.error("Failed to fetch users:", error)
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))


    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!formData.email.endsWith("gmail.com")) {
      newErrors.email = "Email must end with gmail.com domain"
    }

    if (!editingUser && !formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (!editingUser && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddClick = () => {
    setEditingUser(null)
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "customer_relations_officer",
      department: "Customer Relations",
    })
    setShowModal(true)
  }

  const handleEditClick = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      department: user.department,
    })
    setShowModal(true)
  }

  const handleDeleteClick = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId)
        toast.success("User deleted successfully")
        fetchUsers()
      } catch (error) {
        console.error("Failed to delete user:", error)
        toast.error("Failed to delete user")
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)

      if (editingUser) {
        // Update existing user
        const userData = { ...formData }
        if (!userData.password) {
          delete userData.password // Don't update password if not provided
        }
        await updateUser(editingUser.id, userData)
        toast.success("User updated successfully")
      } else {
        // Create new user
        await createUser(formData)
        toast.success("User created successfully")
      }

      setShowModal(false)
      fetchUsers()
    } catch (error) {
      console.error("Failed to save user:", error)
      toast.error(error.message || "Failed to save user")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRoleName = (role) => {
    switch (role) {
      case "customer_relations_officer":
        return "Customer Relations Officer"
      case "complaints_handler":
        return "Complaints Handler"
      case "admin":
        return "Admin"
      default:
        return role
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <Header title="User Management" />

        <main className="dashboard-main">
          <div className="users-header">
            <h2>Manage Users</h2>
            <button className="btn btn-primary" onClick={handleAddClick}>
              <FiPlus />
              <span>Add New User</span>
            </button>
          </div>

          <div className="users-table-container">
          <table className="data-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
      <th>Department</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {users.length === 0 ? (
      <tr className="no-data">
        <td colSpan="6">No users found</td>
      </tr>
    ) : (
      users.map((user) => (
        <tr key={user.id}>
          <td>{user.id}</td>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{getRoleName(user.role)}</td>
          <td>{user.department}</td>
          <td>
            <div className="action-buttons">
              <button className="btn btn-sm btn-edit" onClick={() => handleEditClick(user)}>
                <FiEdit2 />
              </button>
              <button className="btn btn-sm btn-delete" onClick={() => handleDeleteClick(user.id)}>
                <FiTrash2 />
              </button>
            </div>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>

          </div>
        </main>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{editingUser ? "Edit User" : "Add New User"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <FiX />
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    {editingUser ? "Password (leave blank to keep current)" : "Password"}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select
                    id="role"
                    name="role"
                    className="form-control"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="customer_relations_officer">Customer Relations Officer</option>
                    <option value="complaints_handler">Complaints Handler</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <select
                    id="department"
                    name="department"
                    className="form-control"
                    value={formData.department}
                    onChange={handleInputChange}
                  >
                    <option value="Customer Relations">Customer Relations</option>
                    <option value="IT Department">IT Department</option>
                    <option value="Funds Administration">Funds Administration</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={isSubmitting}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingUser ? "Update User" : "Add User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users
