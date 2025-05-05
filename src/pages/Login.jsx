"use client"

import { useState } from "react"
import { useNavigate} from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { FiAlertCircle } from "react-icons/fi"
import "../styles/auth.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login, error } = useAuth()
  const navigate = useNavigate()

  const validateEmail = (email) => {
    if (!email.endsWith("rnit.rw")) {
      setEmailError("Email must end with rnit.rw domain")
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

    // Validate email format
    if (!validateEmail(email)) {
      return
    }

    try {
      setLoading(true)
      const user = await login(email, password)

      // Redirect based on user role
      if (user.role === "customer_relations_officer") {
        navigate("/dashboard")
      } else if (user.role === "complaints_handler") {
        navigate("/dashboard")
      } else if (user.role === "admin") {
        navigate("/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Login to your account</h2>
            <p>Enter your credentials to access the system</p>
          </div>

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
                placeholder="username@rnit.rw"
                required
              />
              {emailError && <div className="invalid-feedback">{emailError}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="button" disabled={loading || emailError}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? Please contact your administrator.</p>
            
          </div>

          
        </div>
      </div>
    </div>
  )
}

export default Login
