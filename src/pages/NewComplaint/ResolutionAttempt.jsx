import React from "react";
import { FiAlertCircle } from "react-icons/fi";

const ResolutionAttempt = ({
  formData,
  errors,
  handleChange,
  handleAttemptedResolutionChange,
  showForwardOptions,
}) => {
  return (
    <div className="form-section">
      <h3 className="section-title">Resolution Attempt</h3>
      <div className="form-group">
        <div className="form-check">
          <input
            type="checkbox"
            id="attemptedResolution"
            name="attemptedResolution"
            className="form-check-input"
            checked={formData.attemptedResolution}
            onChange={handleAttemptedResolutionChange}
          />
          <label htmlFor="attemptedResolution" className="form-check-label">
            I have attempted to resolve this complaint
          </label>
        </div>
      </div>
      {formData.attemptedResolution && (
        <div className="form-group">
          <label htmlFor="resolutionDetails" className="form-label">
            Resolution Details *
          </label>
          <textarea
            id="resolutionDetails"
            name="resolutionDetails"
            rows="3"
            className={`form-control ${errors.resolutionDetails ? "is-invalid" : ""}`}
            value={formData.resolutionDetails}
            onChange={handleChange}
            placeholder="Describe what steps you've taken to resolve this complaint and why it needs to be forwarded"
          ></textarea>
          {errors.resolutionDetails && <div className="invalid-feedback">{errors.resolutionDetails}</div>}
        </div>
      )}
      {showForwardOptions && (
        <div className="form-group forward-section">
          <label htmlFor="forwardTo" className="form-label">
            Forward to Department *
          </label>
          <select
            id="forwardTo"
            name="forwardTo"
            className={`form-control ${errors.forwardTo ? "is-invalid" : ""}`}
            value={formData.forwardTo}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            <option value="IT Department">IT Department</option>
            <option value="Funds Administration">Funds Administration</option>
            <option value="Finance & Accounting">Finance & Accounting</option>
          </select>
          {errors.forwardTo && <div className="invalid-feedback">{errors.forwardTo}</div>}
          <div className="forward-info">
            <p>
              <strong>Department Responsibilities:</strong>
            </p>
            <ul>
              <li>
                <strong>IT Department:</strong> Handles forgotten passwords and technical issues
              </li>
              <li>
                <strong>Funds Administration:</strong> Handles payment delays and financial transactions
              </li>
              <li>
                <strong>Finance & Accounting:</strong> Handles repurchase issues and financial approvals
              </li>
            </ul>
            <div className="info-note">
              <FiAlertCircle className="icon-inline" />
              <span>Forwarding will notify the appropriate department to handle this complaint.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResolutionAttempt;