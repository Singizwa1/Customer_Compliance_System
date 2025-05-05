"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Header from "../components/common/Header"
import Sidebar from "../components/common/Sidebar"
import Loader from "../components/common/Loader"
import ForwardComplaintModal from "../components/complaints/ForwardComplaintModal"
import { getComplaintById, updateComplaint } from "../services/complaintService"
import { FiArrowLeft, FiPaperclip, FiFile, FiFileText, FiImage } from "react-icons/fi"
import { toast } from "react-toastify"
import moment from "moment"
import "../styles/complaints.css"

const ComplaintDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("")
  const [resolution, setResolution] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForwardModal, setShowForwardModal] = useState(false)

  useEffect(() => {
    fetchComplaint()
  }, [id])

  const fetchComplaint = async () => {
    try {
      setLoading(true)
      const data = await getComplaintById(id)
      setComplaint(data)
      setStatus(data.status)
      setResolution(data.resolution || "")
    } catch (error) {
      console.error("Failed to fetch complaint:", error)
      toast.error("Failed to load complaint details")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (status === "Resolved" && !resolution.trim()) {
      toast.error("Please provide resolution details before marking as resolved")
      return
    }

    try {
      setIsSubmitting(true)
      await updateComplaint(id, { status, resolution })
      toast.success("Complaint updated successfully")
      fetchComplaint() 
    } catch (error) {
      console.error("Failed to update complaint:", error)
      toast.error("Failed to update complaint")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFileIcon = (fileType) => {
    if (fileType && fileType.startsWith("image/")) {
      return <FiImage />
    } else if (fileType && fileType.includes("pdf")) {
      return <FiFileText />
    } else {
      return <FiFile />
    }
  }

  const canUpdateStatus = () => {
    if (currentUser.role === "admin") return true
    if (currentUser.role === "complaints_handler" && complaint.assigned_to === currentUser.id) return true
    return false
  }

  const canForwardComplaint = () => {
    return currentUser.role === "customer_relations_officer" && complaint.status === "Pending"
  }

  if (loading) {
    return <Loader />
  }

  if (!complaint) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <Header title="Complaint Not Found" />
          <main className="dashboard-main">
            <div className="not-found-message">
              <h2>Complaint Not Found</h2>
              <p>The complaint you're looking for doesn't exist or you don't have permission to view it.</p>
              <button className="btn btn-primary" onClick={() => navigate("/complaints")}>
                Back to Complaints
              </button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <Header title="Complaint Details" />

        <main className="dashboard-main">
          <div className="complaint-detail-header">
            <button className="btn btn-back" onClick={() => navigate("/complaints")}>
              <FiArrowLeft />
              <span>Back to Complaints</span>
            </button>

            <div className="complaint-id-status">
              <h2>Complaint {complaint.id}</h2>
              <span className={`status-badge ${complaint.status.toLowerCase().replace(" ", "-")}`}>
                {complaint.status}
              </span>
            </div>
          </div>

          <div className="complaint-detail-content">
            <div className="complaint-section card">
              <div className="card-header">
                <h3>Customer Information</h3>
              </div>
              <div className="card-body">
                <div className="detail-row">
                  <div className="detail-label"> Customer Name:</div>
                  <div className="detail-value">{complaint.customer_name}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Telephone Number:</div>
                  <div className="detail-value">{complaint.customer_phone}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Contact Channel:</div>
                  <div className="detail-value">{complaint.channel}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Date Reported:</div>
                  <div className="detail-value">{moment(complaint.date).format("MMMM D, YYYY h:mm A")}</div>
                </div>
              </div>
            </div>

            <div className="complaint-section card">
              <div className="card-header">
                <h3>Complaint Details</h3>
              </div>
              <div className="card-body">
                <div className="detail-row">
                  <div className="detail-label">Inquiry Type:</div>
                  <div className="detail-value">{complaint.inquiry_type}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Inquiry Details:</div>
                  <div className="detail-value">{complaint.details}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Assigned To:</div>
                  <div className="detail-value">
                    {complaint.assignedToUser ? (
                      <span className="assigned-badge">
                        {complaint.assignedToUser.department} ({complaint.assignedToUser.name})
                      </span>
                    ) : (
                      <span className="unassigned-badge">Unassigned</span>
                    )}
                  </div>
                </div>

                {complaint.attachments && complaint.attachments.length > 0 && (
                  <div className="detail-row">
                    <div className="detail-label">Attachments:</div>
                    <div className="detail-value">
                      <div className="attachments-list">
                        {complaint.attachments.map((attachment, index) => (
                          <a
                            key={index}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="attachment-item"
                          >
                            <div className="attachment-icon">{getFileIcon(attachment.type)}</div>
                            <div className="attachment-name">{attachment.name}</div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {complaint.attempted_resolution && (
                  <div className="detail-row">
                    <div className="detail-label">Resolution Attempt:</div>
                    <div className="detail-value">{complaint.resolution_details}</div>
                  </div>
                )}
              </div>
            </div>

            {canUpdateStatus() && (
              <div className="complaint-section card">
                <div className="card-header">
                  <h3>Update Status</h3>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="status">Status</label>
                      <select
                        id="status"
                        className="form-control"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={complaint.status === "Resolved"}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="resolution">Resolution Details</label>
                      <textarea
                        id="resolution"
                        className="form-control"
                        rows="4"
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        disabled={complaint.status === "Resolved"}
                        placeholder={
                          status === "Resolved"
                            ? "Please provide resolution details"
                            : "Optional for in-progress complaints"
                        }
                      ></textarea>
                    </div>

                    {complaint.status !== "Resolved" && (
                      <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                          {isSubmitting ? "Updating..." : "Update Complaint"}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}

            {canForwardComplaint() && (
              <div className="complaint-actions">
                <button className="btn btn-forward" onClick={() => setShowForwardModal(true)}>
                  <FiPaperclip />
                  <span>Forward to Another Department</span>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {showForwardModal && (
        <ForwardComplaintModal
          complaint={complaint}
          onClose={() => setShowForwardModal(false)}
          onForward={fetchComplaint}
        />
      )}
    </div>
  )
}

export default ComplaintDetail
