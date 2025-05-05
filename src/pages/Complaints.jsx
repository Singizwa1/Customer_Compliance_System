"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Header from "../components/common/Header"
import Sidebar from "../components/common/Sidebar"
import Loader from "../components/common/Loader"
import { getComplaints} from "../services/complaintService"
import { FiSearch, FiFilter, FiEye, FiPlus } from "react-icons/fi"
import "../styles/complaints.css"

const Complaints = () => {
  const { currentUser } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [filteredComplaints, setFilteredComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchComplaints()
  }, [])

  useEffect(() => {
    filterComplaints()
  }, [complaints, statusFilter, searchTerm])

  const fetchComplaints = async () => {
    try {
      setLoading(true)
      const data = await getComplaints()
      setComplaints(data)
      setFilteredComplaints(data)
    } catch (error) {
      console.error("Failed to fetch complaints:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterComplaints = () => {
    let result = [...complaints]

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((complaint) => complaint.status === statusFilter)
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (complaint) =>
          complaint.customer_name.toLowerCase().includes(term) ||
          complaint.inquiry_type.toLowerCase().includes(term) ||
          complaint.details.toLowerCase().includes(term),
      )
    }

    setFilteredComplaints(result)
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <Header title="Complaints Management" />

        <main className="dashboard-main">
          <div className="complaints-header">
            <div className="search-filter-container">
              <div className="search-container">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-container">
                <FiFilter className="filter-icon" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            {currentUser.role === "customer_relations_officer" && (
              <Link to="/new" className="btn btn-primary">
                <FiPlus />
                <span>New Complaint</span>
              </Link>
            )}
          </div>

          <div className="complaints-table-container">
            <table className="complaints-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer Name</th>
                  <th> Inquiry Type</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No complaints found
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((complaint) => (
                    <tr key={complaint.id}>
                      <td>#{complaint.id}</td>
                      <td>{complaint.customer_name}</td>
                      <td>{complaint.inquiry_type}</td>
                      <td>{new Date(complaint.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${complaint.status.toLowerCase().replace(" ", "-")}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td> {complaint.assignedToUser.department} ({complaint.assignedToUser.name})</td>
                      <td>
                        <Link to={`/complaints/${complaint.id}`} className="btn btn-sm btn-view">
                          <FiEye />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Complaints
