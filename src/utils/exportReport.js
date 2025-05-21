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
  const doc = new jsPDF({ unit: "pt", format: "a4" });

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
  const logoWidth = 50;
  const logoHeight = 30;
  const marginLeft = 40;
  const marginTop = 30;
  const marginRight = 40;

  // Add logo on left top
  doc.addImage(logoBase64, "PNG", marginLeft, marginTop, logoWidth, logoHeight);

  // Title text on the same line as logo, vertically centered with logo
  const titleY = marginTop + logoHeight / 2 + 5;
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 96);
  doc.setFont(undefined, "bold");
  const titleX = marginLeft + logoWidth + 10;
  doc.text("RWANDA National Investment Trust Ltd", titleX, titleY);


  const secondLineY = marginTop + logoHeight + 20;

  
  doc.setFontSize(12);
  doc.setFont(undefined, "normal");
  doc.text("Customer Complaints Report", marginLeft, secondLineY);

  
  const generatedOnText = `Generated on: ${formatDate(new Date())}`;
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getTextWidth(generatedOnText);
  const xRight = pageWidth - marginRight - textWidth;
  doc.text(generatedOnText, xRight, secondLineY);

  
  const startY = secondLineY + 20;

  const usablePageWidth = pageWidth - marginLeft - marginRight;

  const colWidths = {
    0: usablePageWidth * 0.10,  
    1: usablePageWidth * 0.18,  
    2: usablePageWidth * 0.14,  
    3: usablePageWidth * 0.10,  
    4: usablePageWidth * 0.14,  
    5: usablePageWidth * 0.10,  
    6: usablePageWidth * 0.24,  
  };

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: startY,
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      halign: "center",
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: {
      0: { cellWidth: colWidths[0], halign: "center" },
      1: { cellWidth: colWidths[1], halign: "left" },
      2: { cellWidth: colWidths[2], halign: "left" },
      3: { cellWidth: colWidths[3], halign: "center" },
      4: { cellWidth: colWidths[4], halign: "left" },
      5: { cellWidth: colWidths[5], halign: "center" },
      6: { cellWidth: colWidths[6], halign: "left" },
    },
    margin: { left: marginLeft, right: marginRight },
  });

  doc.save(`${filename}.pdf`);
};
