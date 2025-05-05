"use client"

import { useState } from "react"
import { FiBell } from "react-icons/fi"
import { useNotifications } from "../../contexts/NotificationContext"
import moment from "moment"

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications()

  const toggleNotifications = () => {
    setIsOpen(!isOpen)
    if (!isOpen && unreadCount > 0) {
      markAllAsRead()
    }
  }

  const handleNotificationClick = (id) => {
    if (!notifications.find((n) => n.id === id).read) {
      markAsRead(id)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "assignment":
        return <span className="notification-icon assignment">📋</span>
      case "update":
        return <span className="notification-icon update">🔄</span>
      case "resolution":
        return <span className="notification-icon resolution">✅</span>
      default:
        return <span className="notification-icon">📢</span>
    }
  }

  return (
    <div className="notification-container">
      <button className="notification-bell" onClick={toggleNotifications}>
        <FiBell />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? "unread" : ""}`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{moment(notification.created_at).fromNow()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
