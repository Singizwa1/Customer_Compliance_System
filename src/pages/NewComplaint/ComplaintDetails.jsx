import React, { useRef, useEffect } from "react";
import { FiPaperclip, FiX } from "react-icons/fi";

const ComplaintDetails = ({
  formData,
  errors,
  handleChange,
  handleFileUpload,
  attachments,
  setAttachments,
  removeAttachment,
  getFileIcon,
  formatFileSize,
}) => {
  const fileInputRef = useRef(null);

  // Cleanup for object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      attachments.forEach((att) => {
        if (att.previewUrl) {
          URL.revokeObjectURL(att.previewUrl);
        }
      });
    };
  }, [attachments]);

  // Handle file input changes
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

      <div className="form-group">
        <label htmlFor="inquiryType" className="form-label">
          Inquiry Type
        </label>
        <select
          id="inquiryType"
          name="inquiryType"
          className="form-control"
          value={formData.inquiryType}
          onChange={handleChange}
        >
          <option value="Technical Issue">Technical Issue</option>
          <option value="Forgotten Password">Forgotten Password</option>
          <option value="Payment Delay">Payment Delay</option>
          <option value="Financial Transaction">Financial Transaction</option>
          <option value="Repurchase Issue">Repurchase Issue</option>
          <option value="Financial Approval">Financial Approval</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {formData.inquiryType === "Other" && (
        <div className="form-group">
          <label htmlFor="customerInquiryType" className="form-label">
            Enter New Inquiry Type *
          </label>
          <input
            type="text"
            id="customerInquiryType"
            name="customerInquiryType"
            className={`form-control ${errors.customerInquiryType ? "is-invalid" : ""}`}
            value={formData.customerInquiryType}
            onChange={handleChange}
            placeholder="Specify the new inquiry type"
          />
          {errors.customerInquiryType && (
            <div className="invalid-feedback">{errors.customerInquiryType}</div>
          )}
        </div>
      )}

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
        {errors.details && <div className="invalid-feedback">{errors.details}</div>}
      </div>

      {/* Proof of Inquiry / Attachments */}
      <div className="form-group">
        <label className="form-label">Proof of Inquiry</label>
        <div className="file-upload-container">
          <div className="file-upload-button">
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFilesSelected}
              multiple
              className="file-input"
              accept="image/*,.pdf,.doc,.docx,.txt"
              style={{ display: "none" }}
            />
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <FiPaperclip />
              Attach Files
            </button>
            <span className="file-upload-hint">
              Upload images, PDFs, or documents as proof
            </span>
          </div>
        </div>

        {attachments.length > 0 && (
          <div className="attachments-list">
            {attachments.map((attachment, index) => (
              <div key={`${attachment.id}-${index}`} className="attachment-item">
                <div className="attachment-preview">
                  {attachment.previewUrl ? (
                    <img
                      src={attachment.previewUrl}
                      alt={attachment.name}
                      className="attachment-image"
                    />
                  ) : (
                    <div className="attachment-icon">{getFileIcon(attachment.type)}</div>
                  )}
                </div>
                <div className="attachment-info">
                  <div className="attachment-name">{attachment.name}</div>
                  <div className="attachment-size">{formatFileSize(attachment.size)}</div>
                </div>
                <button
                  type="button"
                  className="attachment-remove"
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
