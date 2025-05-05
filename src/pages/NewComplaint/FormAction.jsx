import React from "react";

const FormActions = ({ isSubmitting, navigate }) => {
  return (
    <div className="form-actions">
      <button type="button" className="btn btn-secondary" onClick={() => navigate("/complaints")}>
        Cancel
      </button>
      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Complaint"}
      </button>
    </div>
  );
};

export default FormActions;