"use client"

import { useState } from "react"
import { updateComplaint } from "../../services/complaintService"
import { FiX, FiServer, FiCreditCard} from "react-icons/fi"
import{FaCalculator} from "react-icons/fa"
import { toast } from "react-toastify"

const ForwardComplaintModal = ({ complaint, onClose, onForward }) => {
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!selectedDepartment) {
      newErrors.department = "Please select a department"
    }

    if (!reason.trim()) {
      newErrors.reason = "Please provide a reason for forwarding"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)

      
      await updateComplaint(complaint.id, {
        forwardTo: selectedDepartment,
        forwardReason: reason,
        status: "Pending", // Reset status when forwarded
      })

      toast.success(`Complaint forwarded to ${selectedDepartment} successfully`)
      onForward() // Refresh the complaint data
      onClose()
    } catch (error) {
      console.error("Failed to forward complaint:", error)
      toast.error("Failed to forward complaint")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Forward Complaint</h2>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Forward to Department</label>
              <select
                className={`form-control ${errors.department ? "is-invalid" : ""}`}
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">Select Department</option>
                <option value="IT Department">IT Department</option>
                <option value="Funds Administration">Funds Administration</option>
                <option value="Finance & Accounting">Finance & Accounting</option>
              </select>
              {errors.department && <div className="invalid-feedback">{errors.department}</div>}
            </div>

            <div className="form-group">
              <label>Reason for Forwarding</label>
              <textarea
                className={`form-control ${errors.reason ? "is-invalid" : ""}`}
                rows="4"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why this complaint needs to be forwarded to another department"
              ></textarea>
              {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
            </div>

            <div className="department-info">
              <p>
                <strong>Department Responsibilities:</strong>
              </p>
              <ul>
                <li>
                  <FiServer className="icon-inline" />
                  <strong>IT Department:</strong> Handles technical issues and forgotten passwords
                </li>
                <li>
                  <FiCreditCard className="icon-inline" />
                  <strong>Funds Administration:</strong> Handles payment delays and financial transactions
                </li>
                <li>
                  <FaCalculator className="icon-inline" />
                  <strong>Finance & Accounting:</strong> Handles repurchase issues and financial approvals
                </li>
              </ul>
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Forwarding..." : "Forward Complaint"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ForwardComplaintModal
