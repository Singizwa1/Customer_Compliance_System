import React, { useRef, useEffect } from "react";
import { FiPaperclip, FiX } from "react-icons/fi";
import "../../styles/Complaintdetails.css";


const ComplaintDetails = ({
  formData,
  errors,
  handleChange,
  attachments,
  setAttachments,
  removeAttachment,
  getFileIcon,
  formatFileSize,
}) => {
  const fileInputRef = useRef(null);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      attachments.forEach((att) => {
        if (att.previewUrl) URL.revokeObjectURL(att.previewUrl);
      });
    };
  }, [attachments]);

  // Handle file upload
  const onFilesSelected = (e) => {
    const files = Array.from(e.target.files);

    const newAttachments = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      file,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  return (
    <div className="form-section">
      <h3 className="section-title">Complaint Details</h3>

      {/* Inquiry Type - Free Text Input */}
      <div className="form-group">
        <label htmlFor="inquiryType" className="form-label">
          Inquiry Type *
        </label>
        <input
          type="text"
          id="inquiryType"
          name="inquiryType"
          className={`form-control ${errors.inquiryType ? "is-invalid" : ""}`}
          value={formData.inquiryType}
          onChange={handleChange}
          placeholder="Enter inquiry type (e.g., Technical Issue)"
        />
        {errors.inquiryType && (
          <div className="invalid-feedback">{errors.inquiryType}</div>
        )}
      </div>

      {/* Complaint Details */}
      <div className="form-group">
        <label htmlFor="details" className="form-label">
          Complaint Details *
        </label>
        <textarea
          id="details"
          name="details"
          rows="4"
          className={`form-control ${errors.details ? "is-invalid" : ""}`}
          value={formData.details}
          onChange={handleChange}
        ></textarea>
        {errors.details && (
          <div className="invalid-feedback">{errors.details}</div>
        )}
      </div>

      {/* Proof of Inquiry / Attachments */}
      <div className="form-group">
        <label className="form-label">Proof of Inquiry</label>
        <div className="file-upload-container">
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFilesSelected}
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            style={{ display: "none" }}
            id="file-upload-input"
          />
          <button
            type="button"
            className="btn-attach"
            onClick={() => fileInputRef.current?.click()}
          >
            <FiPaperclip /> Attach Files
          </button>
          <span className="file-hint">Upload images, PDFs, or documents</span>
        </div>

        {/* Attachment Preview List */}
        {attachments.length > 0 && (
          <div className="attachment-list">
            {attachments.map((attachment, index) => (
              <div key={`${attachment.id}-${index}`} className="attachment-item">
                <div className="attachment-preview">
                  {attachment.previewUrl ? (
                    <img src={attachment.previewUrl} alt={attachment.name} />
                  ) : (
                    <div className="attachment-icon">
                      {getFileIcon(attachment.type)}
                    </div>
                  )}
                </div>
                <div className="attachment-info">
                  <div className="attachment-name">{attachment.name}</div>
                  <div className="attachment-size">
                    {formatFileSize(attachment.size)}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => removeAttachment(attachment.id)}
                  aria-label="Remove attachment"
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetails;