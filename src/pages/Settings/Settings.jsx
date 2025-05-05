"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { changePassword } from '../../services/userService'; 
import Sidebar from "../../components/common/Sidebar"

import { Lock,Eye, EyeOff, User, Mail, Building, Shield } from "lucide-react"
import "./Settings.css"

const Settings = () => {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState("password")

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }
  const validatePasswordForm = () => {
    const newErrors = {}

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required"
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters"
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password"
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (!validatePasswordForm()) {
      return
    }

    setIsSubmitting(true)
    setSuccessMessage("")

    try {
      
      await changePassword(passwordData.currentPassword, passwordData.newPassword)

      setSuccessMessage("Password updated successfully!")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      setErrors({
        submit: error.message || "Failed to update password. Please try again.",
      })
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
  const getDashboardTitle = () => {
    switch (currentUser?.role) {
      case "admin":
        return "Admin Dashboard"
      case "customer_relations_officer":
        return "Customer Relations Officer Dashboard"
      case "complaints_handler":
        return "Complaints Handler Dashboard"
      default:
        return "Dashboard"
    }
  }
  return (
    <div className="settings-container">
        <Sidebar/>
      <div className="settings-header">
      
        <h2>Account Settings</h2>
      </div>

      <div className="settings-content">
        <div className="settings-tabs">
          <button
            className={`tab-button ${activeTab === "password" ? "active" : ""}`}
            onClick={() => setActiveTab("password")}
          >
            Password
          </button>
          <button
            className={`tab-button ${activeTab === "account" ? "active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            Account Info
          </button>
        </div>

        <div className="settings-tab-content">
          {activeTab === "password" && (
            <div className="password-settings">
              <div className="card">
                <div className="card-header">
                  <h3>Change Password</h3>
                </div>
                <div className="card-body">
                  {successMessage && <div className="alert alert-success">{successMessage}</div>}

                  {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

                  <form onSubmit={handlePasswordSubmit}>
                    <div className="form-group">
                      <label htmlFor="currentPassword" className="form-label">
                        Current Password
                      </label>
                      <div className="password-input-container">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          id="currentPassword"
                          name="currentPassword"
                          className={`form-control ${errors.currentPassword ? "is-invalid" : ""}`}
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                        >
                          {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.currentPassword && <div className="invalid-feedback">{errors.currentPassword}</div>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="newPassword" className="form-label">
                        New Password
                      </label>
                      <div className="password-input-container">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          id="newPassword"
                          name="newPassword"
                          className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          aria-label={showNewPassword ? "Hide password" : "Show password"}
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm New Password
                      </label>
                      <div className="password-input-container">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="account-settings">
              <div className="card">
                <div className="card-header">
                  <h3>Account Information</h3>
                </div>
                <div className="card-body">
                  <div className="account-info">
                    <div className="info-item">
                      <div className="info-label">
                        <User size={18} />
                        <span>Name</span>
                      </div>
                      <div className="info-value">{currentUser.name}</div>
                    </div>

                    <div className="info-item">
                      <div className="info-label">
                        <Mail size={18} />
                        <span>Email</span>
                      </div>
                      <div className="info-value">{currentUser.email}</div>
                    </div>

                    <div className="info-item">
                      <div className="info-label">
                        <Shield size={18} />
                        <span>Role</span>
                      </div>
                      <div className="info-value">{getRoleName(currentUser.role)}</div>
                    </div>

                    <div className="info-item">
                      <div className="info-label">
                        <Building size={18} />
                        <span>Department</span>
                      </div>
                      <div className="info-value">{currentUser.department}</div>
                    </div>
                    <div className="info-item">
              <div className="info-label">
                <Lock size={18} />
                <span>Password</span>
              </div>
              <div className="info-value">
                {showPassword ? currentUser.password : ""} {/* Show/hide password */}
                <button onClick={togglePasswordVisibility}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
                  </div>

                  
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
