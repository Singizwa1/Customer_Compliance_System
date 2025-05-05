"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import Header from "../components/common/Header"
import Sidebar from "../components/common/Sidebar"
import Loader from "../components/common/Loader"
import { getComplaints } from "../services/complaintService"
import { FiClock, FiRefreshCw, FiCheckCircle, FiBarChart2 } from "react-icons/fi"
import "../styles/dashboard.css"

const Dashboard = () => {
  const { currentUser } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    resolved: 0,
    total: 0,
  })

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      setLoading(true)
      const data = await getComplaints()
      setComplaints(data)

      // Calculate statistics
      const pending = data.filter((c) => c.status === "Pending").length
      const inProgress = data.filter((c) => c.status === "In Progress").length
      const resolved = data.filter((c) => c.status === "Resolved").length

      setStats({
        pending,
        inProgress,
        resolved,
        total: data.length,
      })
    } catch (error) {
      console.error("Failed to fetch complaints:", error)
    } finally {
      setLoading(false)
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

  if (loading) {
    return <Loader />
  }

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <Header title={getDashboardTitle()} />

        <main className="dashboard-main">
          <div className="dashboard-summary">
            <div className="summary-card pending-card">
              <div className="summary-icon">
                <FiClock size={24} />
              </div>
              <div className="summary-content">
                <h3 >Pending</h3>
                <div className="summary-count">{stats.pending}</div>
                <div className="summary-percentage">
                  {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}% of total
                </div>
              </div>
            </div>

            <div className="summary-card progress-card">
              <div className="summary-icon">
                <FiRefreshCw size={24} />
              </div>
              <div className="summary-content">
                <h3>In Progress</h3>
                <div className="summary-count">{stats.inProgress}</div>
                <div className="summary-percentage">
                  {stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}% of total
                </div>
              </div>
            </div>

            <div className="summary-card resolved-card">
              <div className="summary-icon">
                <FiCheckCircle size={24} />
              </div>
              <div className="summary-content">
                <h3>Resolved</h3>
                <div className="summary-count">{stats.resolved}</div>
                <div className="summary-percentage">
                  {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% of total
                </div>
              </div>
            </div>

            <div className="summary-card total-card">
              <div className="summary-icon">
                <FiBarChart2 size={24} />
              </div>
              <div className="summary-content">
                <h3>Total</h3>
                <div className="summary-count">{stats.total}</div>
                <div className="summary-percentage">All complaints</div>
              </div>
            </div>
          </div>

          <div className="recent-complaints">
            <div className="section-header">
              <h2>Recent Complaints</h2>
            </div>

            <div className="complaints-table-container">
              <table className="complaints-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer Name</th>
                    <th>Telephone number</th>
                    <th>Inquiry Type</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No complaints found
                      </td>
                    </tr>
                  ) : (
                    complaints.slice(0, 5).map((complaint) => (
                      <tr key={complaint.id}>
                        <td>#{complaint.id}</td>
                        <td>{complaint.customer_name}</td>
                        <td>{complaint.customer_phone}</td>
                        <td>{complaint.inquiry_type}</td>

                        <td>{new Date(complaint.date).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge ${complaint.status.toLowerCase().replace(" ", "-")}`}>
                            {complaint.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
