import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logo.png"; 

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};
const getFilename = (prefix, weekLabel) => {
  const label = weekLabel ? `_${weekLabel.replace(/\s+/g, "_")}` : "";
  return `${prefix}${label}`;
};
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

const toBase64 = (url) =>
  fetch(url)
    .then(res => res.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }));

export const exportToPDF = async (data, weekLabel = "") => {
  const doc = new jsPDF();
  const filename = getFilename("Weekly_Complaint_Report", weekLabel);

  const headers = [
     "Date", "Customer Name", "Inquiry Type",
    "Status", "Department", "Resolved Date", "Resolution"
  ];

  const rows = data.map(item => [
    
    formatDate(item.date),
    item.customer_name || "-",
    item.inquiry_type || "-",
    item.status || "-",
    item.assignedToUser?.department || "-",
    formatDate(item.updated_at),
    item.resolution || "-"
  ]);

  const logoBase64 = await toBase64(logo);
  const logoWidth = 25;
  const logoHeight = 15;
  const marginTop = 10;
  const textX = 15 + logoWidth + 5;

  
  doc.addImage(logoBase64, "PNG", 15, marginTop, logoWidth, logoHeight);
  doc.setFontSize(12);
  doc.text("RWANDA National Investment Trust Ltd", textX, marginTop + 10);

  
  doc.setFontSize(14);
  doc.text("Customer Complaints Report", 15, marginTop + logoHeight + 10);
  doc.setFontSize(10);
  doc.text(`Generated on: ${formatDate(new Date())}`, 15, marginTop + logoHeight + 16);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: marginTop + logoHeight + 22,
    theme: "grid",
    styles: { fontSize: 10 },
  });

  doc.save(`${filename}.pdf`);
};
