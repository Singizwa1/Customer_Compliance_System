"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi"
import "../styles/auth.css"
import heroImage from "../assets/background.jpeg"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login, error } = useAuth()
  const navigate = useNavigate()

  const validateEmail = (email) => {
    if (!email.endsWith("gmail.com")) {
      setEmailError("Only Gmail addresses are allowed")
      return false
    }
    setEmailError("")
    return true
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    if (value) validateEmail(value)
    else setEmailError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateEmail(email)) return

    try {
      setLoading(true)
      const user = await login(email, password)
      if (["admin", "customer_relations_officer", "complaints_handler"].includes(user.role)) {
        navigate("/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={heroImage} alt="Support" className="login-background" />
       
      </div>

      <div className="login-right">
        <div className="welcome-text">
          <h2>Welcome Back</h2>
          <p>Please sign in to continue</p>
        </div>

        <div className="login-form-container">
          {error && (
            <div className="alert alert-danger">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className={`form-control ${emailError ? "is-invalid" : ""}`}
                value={email}
                onChange={handleEmailChange}
                placeholder="username@gmail.com"
                required
              />
              {emailError && <div className="invalid-feedback">{emailError}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="button" disabled={loading || emailError}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? Contact your administrator.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
