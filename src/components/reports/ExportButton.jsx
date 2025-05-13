
import React from "react";
import { AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai"; 
import { exportToExcel, exportToPDF } from "../../utils/exportReport";

const ExportButtons = ({ data }) => {
  const handleExport = (type) => {
    if (!Array.isArray(data) || data.length === 0) {
      alert("No data available to export.");
      return;
    }

    if (type === "excel") {
      exportToExcel(data, "Weekly Complaint Report");
    } else if (type === "pdf") {
      exportToPDF(data, "Weekly Complaint Report");
    }
  };

  return (
    <div className="export-buttons" style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
      <button 
        onClick={() => handleExport("excel")} 
        className="btn btn-success"
        disabled={!data || data.length === 0}
      >
        <AiOutlineFileExcel style={{ marginRight: "5px" }} />
        Export to Excel
      </button>
      <button 
        onClick={() => handleExport("pdf")} 
        className="btn btn-danger"
        disabled={!data || data.length === 0}
      >
        <AiOutlineFilePdf style={{ marginRight: "5px" }} />
        Export to PDF
      </button>
    </div>
  );
};

export default ExportButtons;