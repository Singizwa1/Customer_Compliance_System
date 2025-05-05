import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import { createComplaint } from "../services/complaintService";
import { FiInfo, FiAlertCircle, FiX, FiPaperclip } from "react-icons/fi";
import { toast } from "react-toastify";
import "../styles/complaints.css";
import CustomerInfo from "./NewComplaint/CustomerInfo";
import ComplaintDetails from "./NewComplaint/ComplaintDetails";
import ResolutionAttempt from "./NewComplaint/ResolutionAttempt";
import FormActions from "./NewComplaint/FormAction";

const NewComplaint = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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
  const [showForwardOptions, setShowForwardOptions] = useState(false);

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
    }
    if (!formData.details.trim()) {
      newErrors.details = "Complaint details are required";
    }
    if (formData.attemptedResolution && !formData.resolutionDetails.trim()) {
      newErrors.resolutionDetails =
        "Resolution details are required when attempted resolution is checked";
    }
    if (showForwardOptions && !formData.forwardTo) {
      newErrors.forwardTo = "Please select a department to forward the complaint to";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getDepartmentForInquiry = (inquiryType) => {
    switch (inquiryType) {
      case "Technical Issue":
      case "Forgotten Password":
        return {
          id: "2",
          name: "IT Department",
        };
      case "Payment Delay":
      case "Financial Transaction":
        return {
          id: "3",
          name: "Funds Administration",
        };
      case "Repurchase Issue":
      case "Financial Approval":
        return {
          id: "4",
          name: "Finance & Accounting",
        };
      default:
        return {
          id: "2",
          name: "IT Department",
        };
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newAttachments = files.map((file) => {
      const isImage = file.type.startsWith("image/");
      const previewUrl = isImage ? URL.createObjectURL(file) : null;
      return {
        id: Date.now() + Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl,
        file,
      };
    });

    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => {
      const filtered = prev.filter((attachment) => attachment.id !== id);
      const removed = prev.find((attachment) => attachment.id === id);
      if (removed && removed.previewUrl) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return filtered;
    });
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) {
      return <span className="file-icon image-icon">📷</span>;
    } else if (fileType.includes("pdf")) {
      return <span className="file-icon pdf-icon">📄</span>;
    } else {
      return <span className="file-icon file-icon">📎</span>;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleAttemptedResolutionChange = (e) => {
    const isChecked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      attemptedResolution: isChecked,
    }));
    if (isChecked) {
      setShowForwardOptions(true);
    } else {
      setShowForwardOptions(false);
      setFormData((prev) => ({
        ...prev,
        forwardTo: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Automatically determine the department based on inquiry type
      const department = getDepartmentForInquiry(formData.inquiryType);

      // Prepare data for API
      const complaintData = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        channel: formData.channel,
        inquiryType: formData.inquiryType,
        details: formData.details,
        attemptedResolution: formData.attemptedResolution,
        resolutionDetails: formData.resolutionDetails,
        forwardTo: showForwardOptions ? formData.forwardTo : department.name, // Auto-forward if not manually selected
      };

      // Extract file objects for upload
      const files = attachments.map((att) => att.file);

      // Submit to API
      await createComplaint(complaintData, files); // Remove 'response' assignment

      toast.success("Complaint registered successfully!");
      setTimeout(() => {
        navigate("/complaints");
      }, 2000);
    } catch (error) {
      console.error("Create complaint error:", error);
      toast.error(error.message || "Failed to register complaint");
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
                  <CustomerInfo formData={formData} errors={errors} handleChange={handleChange} />
                  <ComplaintDetails
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                    handleFileUpload={handleFileUpload}
                    attachments={attachments}
                    removeAttachment={removeAttachment}
                    getFileIcon={getFileIcon}
                    formatFileSize={formatFileSize}
                    getDepartmentForInquiry={getDepartmentForInquiry}
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