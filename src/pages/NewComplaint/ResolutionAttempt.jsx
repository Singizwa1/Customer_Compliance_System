import React from "react";

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
        <>
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
              placeholder="Describe the resolution attempt"
            ></textarea>
            {errors.resolutionDetails && (
              <div className="invalid-feedback">{errors.resolutionDetails}</div>
            )}
          </div>

          <div className="form-group">
            <div className="form-check">
              <input
                type="checkbox"
                id="markResolved"
                name="status"
                className="form-check-input"
                checked={formData.status === "Resolved"}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "status",
                      value: e.target.checked ? "Resolved" : "",
                    },
                  })
                }
              />
              <label htmlFor="markResolved" className="form-check-label">
                Mark complaint as resolved
              </label>
            </div>
          </div>
        </>
      )}

      {showForwardOptions && formData.status !== "Resolved" && (
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
          {errors.forwardTo && (
            <div className="invalid-feedback">{errors.forwardTo}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResolutionAttempt;
