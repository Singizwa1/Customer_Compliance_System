import React from "react";

const SummaryStats = ({ total, resolved, pending, }) => {
  return (
    <div className="report-summary">
      <div className="summary-card">
        <div className="summary-title">Total Complaints:</div>
        <div className="summary-value">{total}</div>
      </div>
      <div className="summary-card">
        <div className="summary-title">Handled Complaints:</div>
        <div className="summary-value">{resolved}</div>
      </div>
      <div className="summary-card">
        <div className="summary-title">Pending Complaints:</div>
        <div className="summary-value">{pending}</div>
      </div>
      
    </div>
  );
};

export default SummaryStats;