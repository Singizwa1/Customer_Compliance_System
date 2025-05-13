import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// 🟢 Helper to format date
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

// 🟢 Build filename with optional week header
const getFilename = (prefix, weekLabel) => {
  const label = weekLabel ? `_${weekLabel.replace(/\s+/g, "_")}` : "";
  return `${prefix}${label}`;
};

// ✅ Export to Excel
export const exportToExcel = (data, weekLabel = "") => {
  const mappedData = data.map(item => ({
    ID: item.id,
    Date: formatDate(item.date),
    "Customer Name": item.customer_name || "-",
    "Inquiry Type": item.inquiry_type || "-",
    Status: item.status || "-",
    Department: item.assignedToUser?.department || "-",
    "Resolved Date": formatDate(item.updated_at),
    Resolution: item.resolution || "-"
  }));

  const ws = XLSX.utils.json_to_sheet(mappedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Weekly Complaints");

  const filename = getFilename("Weekly_Complaint_Report", weekLabel);
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

// ✅ Export to PDF
export const exportToPDF = (data, weekLabel = "") => {
  const doc = new jsPDF();
  const headers = [
    "ID",
    "Date",
    "Customer Name",
    "Inquiry Type",
    "Status",
    "Department",
    "Resolved Date",
    "Resolution"
  ];

  const rows = data.map(item => [
    item.id,
    formatDate(item.date),
    item.customer_name || "-",
    item.inquiry_type || "-",
    item.status || "-",
    item.assignedToUser?.department || "-",
    formatDate(item.updated_at),
    item.resolution || "-"
  ]);

  const filename = getFilename("Weekly_Complaint_Report", weekLabel);

  doc.text(filename.replace(/_/g, " "), 14, 15);
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 25,
    theme: "grid",
    styles: { fontSize: 10 },
  });

  doc.save(`${filename}.pdf`);
};
