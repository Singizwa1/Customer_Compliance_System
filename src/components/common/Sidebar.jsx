"use client"
import { NavLink } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import {FiHome,FiList,FiPlusCircle, FiUsers,FiBarChart2,FiSettings,} from "react-icons/fi"
  
const Sidebar = () => {
  const { currentUser } = useAuth()

  const getNavItems = () => {
    const items = []
    items.push(
      {
        to: "/dashboard",
        icon: <FiHome />,
        label: "Dashboard",
        roles: ["admin", "customer_relations_officer", "complaints_handler"],
      },
      {
        to: "/complaints",
        icon: <FiList />,
        label: "Complaints",
        roles: ["admin", "customer_relations_officer", "complaints_handler"],
      }
    )

    if (currentUser.role === "customer_relations_officer") {
      items.push({
        to: "/new",
        icon: <FiPlusCircle />,
        label: "New Complaint",
        roles: ["customer_relations_officer"],
      })
    }

    if (
      currentUser.role === "customer_relations_officer" ||
      currentUser.role === "complaints_handler"
    ) {
      items.push({
        to: "/settings",
        icon: <FiSettings />,
        label: "Settings",
        roles: ["customer_relations_officer", "complaints_handler"],
      })
    }

    // Admin-specific items
    if (
      currentUser.role === "admin" ||
      currentUser.role === "customer_relations_officer"
    ) {
      items.push(
        {
          to: "/users",
          icon: <FiUsers />,
          label: "Users",
          roles: ["admin"],
        },
        {
          to: "/reports",
          icon: <FiBarChart2 />,
          label: "Reports",
          roles: ["admin", "customer_relations_officer"], 
        }
      )
    }

  
    return items.filter((item) => item.roles.includes(currentUser.role))
  }

  const navItems = getNavItems()

  return (
    <div className="sidebar">
      <div className="sidebar-header"></div>

      <div className="sidebar-user">
        <div className="user-avatar">{currentUser?.name.charAt(0)}</div>
        <div className="user-info">
          <p className="user-name">{currentUser?.name}</p>
          <p className="user-role">{currentUser?.department}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink to={item.to} className={({ isActive }) => (isActive ? "active" : "")}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
