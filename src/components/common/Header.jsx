"use client"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import NotificationBell from "./NotificationBell"
import { FiLogOut, FiUser } from "react-icons/fi"

const Header = ({ title }) => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  return (
    <header className="app-header">
      <div className="header-title">
        <h1>{title}</h1>
      </div>

      {currentUser && (
        <div className="header-actions">
          <NotificationBell />

          <div className="user-dropdown">
            <button className="user-dropdown-btn">
              <FiUser />
              <span>{currentUser.name}</span>
            </button>

            <div className="user-dropdown-content">
              <div className="user-info">
                <p className="user-name">{currentUser.name}</p>
                <p className="user-role">{currentUser.role.replace(/_/g, " ")}</p>
                <p className="user-department">{currentUser.department}</p>
              </div>

              <div className="dropdown-divider"></div>

              <button className="logout-btn" onClick={handleLogout}>
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
