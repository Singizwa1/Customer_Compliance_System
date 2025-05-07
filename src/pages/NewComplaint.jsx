import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import { createComplaint } from "../services/complaintService";
import { FiImage, FiFileText, FiPaperclip } from "react-icons/fi";
import { toast } from "react-toastify";
import "../styles/complaints.css";
import CustomerInfo from "./NewComplaint/CustomerInfo";
import ComplaintDetails from "./NewComplaint/ComplaintDetails";
import ResolutionAttempt from "./NewComplaint/ResolutionAttempt";
import FormActions from "./NewComplaint/FormAction";

const NewComplaint = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    channel: "Phone",
    inquiryType: "Technical Issue",
    customerInquiryType: "",
    details: "",
    attemptedResolution: false,
    resolutionDetails: "",
    forwardTo: "",
  });

  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForwardOptions, setShowForwardOptions] = useState(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "Customer phone is required";
    } else if (!/^\d+$/.test(formData.customerPhone.trim())) {
      newErrors.customerPhone = "Telephone number must contain only numbers";
    }

    if (!formData.details.trim()) {
      newErrors.details = "Complaint details are required";
    }

    const resolutionGiven = formData.attemptedResolution && formData.resolutionDetails.trim();

    if (formData.attemptedResolution && !formData.resolutionDetails.trim()) {
      newErrors.resolutionDetails = "Resolution details are required when attempted resolution is checked";
    }

    if (!resolutionGiven && !formData.forwardTo) {
      newErrors.forwardTo = "Provide a resolution or select a department to forward to";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getDepartmentForInquiry = (inquiryType) => {
    switch (inquiryType) {
      case "Technical Issue":
      case "Forgotten Password":
        return { id: "2", name: "IT Department" };
      case "Payment Delay":
      case "Financial Transaction":
        return { id: "3", name: "Funds Administration" };
      case "Repurchase Issue":
      case "Financial Approval":
        return { id: "4", name: "Finance & Accounting" };
      default:
        return { id: "2", name: "IT Department" };
    }
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      const removed = prev.find((a) => a.id === id);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return filtered;
    });
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) return <FiImage className="file-icon image-icon" />;
    if (fileType.includes("pdf")) return <FiFileText className="file-icon pdf-icon" />;
    return <FiPaperclip className="file-icon file-icon" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleAttemptedResolutionChange = (e) => {
    const isChecked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      attemptedResolution: isChecked,
    }));
    setShowForwardOptions(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const department = getDepartmentForInquiry(formData.inquiryType);
      const resolutionGiven = formData.attemptedResolution && formData.resolutionDetails.trim();

      const complaintData = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        channel: formData.channel,
        inquiryType: formData.inquiryType,
        details: formData.details,
        attemptedResolution: formData.attemptedResolution,
        resolutionDetails: formData.resolutionDetails,
        forwardTo: resolutionGiven ? null : formData.forwardTo || department.name,
        status: resolutionGiven ? "Resolved" : "Pending",
        submittedBy: currentUser?.email || "Unknown",
      };

      const files = attachments.map((att) => att.file);

      await createComplaint(complaintData, files);
      toast.success("Complaint registered successfully!");
      setTimeout(() => navigate("/complaints"), 2000);
    } catch (error) {
      console.error("Create complaint error:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        toast.error(`Failed to register complaint: ${error.response.data.error || 'Unknown error'}`);
      } else {
        toast.error(error.message || "Failed to register complaint");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Header title="Register New Complaint" />
        <main className="dashboard-main">
          <div className="new-complaint-container">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit} className="complaint-form">
                  <CustomerInfo
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                  />
                  <ComplaintDetails
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                    attachments={attachments}
                    setAttachments={setAttachments}
                    removeAttachment={removeAttachment}
                    getFileIcon={getFileIcon}
                    formatFileSize={formatFileSize}
                  />
                  <ResolutionAttempt
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                    handleAttemptedResolutionChange={handleAttemptedResolutionChange}
                    showForwardOptions={showForwardOptions}
                  />
                  <FormActions isSubmitting={isSubmitting} navigate={navigate} />
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewComplaint;
