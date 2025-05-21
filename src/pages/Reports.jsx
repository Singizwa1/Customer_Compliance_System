"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Loader from "../components/common/Loader";
import {
  getComplaintsByCategory,
  getResolutionTimeByDepartment,
  getComplaintStatusDistribution,
  getMonthlyComplaintTrend,
  getDepartmentPerformance,
  getWeeklyComplaints,
} from "../services/reportService";

import ComplaintsByCategory from "../components/reports/ComplaintsByCategory";
import ResolutionTimeChart from "../components/reports/ResolutionTimeChart";
import StatusDistributionChart from "../components/reports/StatusDistributionChart";
import MonthlyTrendChart from "../components/reports/MonthlyTrendChart";
import DepartmentPerformanceChart from "../components/reports/DepartmentPerfomanceChart";
import WeeklyComplaintsTable from "../components/reports/WeeklyComplaintsTable";
import SummaryStats from "../components/reports/SummaryStats";
import ExportButtons from "../components/reports/ExportButton";
import { useAuth } from "../contexts/AuthContext";
import { FiFilter } from "react-icons/fi";
import { toast } from "react-toastify";
import "../styles/reports.css";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState("complaintsByCategory");
  const [dateRange, setDateRange] = useState("week");
  const [exportableData, setExportableData] = useState([]);
  const [reportData, setReportData] = useState({
    complaintsByCategory: [],
    resolutionTimeByDepartment: [],
    complaintStatusDistribution: [],
    monthlyComplaintTrend: [],
    departmentPerformance: [],
    WeeklyComplaintsTable: [],
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  useEffect(() => {
    fetchWeeklyComplaints(dateRange);
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [categoryData, resolutionTimeData, statusData, trendData, performanceData, weeklyData] =
        await Promise.all([
          getComplaintsByCategory(),
          getResolutionTimeByDepartment(),
          getComplaintStatusDistribution(),
          getMonthlyComplaintTrend(),
          getDepartmentPerformance(),
          getWeeklyComplaints(),
        ]);

      setReportData((prev) => ({
        ...prev,
        complaintsByCategory: categoryData,
        resolutionTimeByDepartment: resolutionTimeData,
        complaintStatusDistribution: statusData,
        monthlyComplaintTrend: trendData,
        departmentPerformance: performanceData,
        WeeklyComplaintsTable: weeklyData,
      }));
    } catch (error) {
      console.error("Failed to fetch report data:", error);
      toast.error("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyComplaints = async (dateRange) => {
    try {
      const data = await getWeeklyComplaints(dateRange);
      setReportData((prev) => ({
        ...prev,
        WeeklyComplaintsTable: data,
      }));
    } catch (err) {
      console.error("Failed to fetch weekly complaints:", err);
      toast.error("Failed to load weekly complaints");
    }
  };

  const renderChart = () => {
    switch (reportType) {
      case "complaintsByCategory":
        return <ComplaintsByCategory data={reportData.complaintsByCategory} />;
      case "resolutionTimeByDepartment":
        return <ResolutionTimeChart data={reportData.resolutionTimeByDepartment} />;
      case "complaintStatusDistribution":
        return <StatusDistributionChart data={reportData.complaintStatusDistribution} />;
      case "monthlyComplaintTrend":
        return <MonthlyTrendChart data={reportData.monthlyComplaintTrend} />;
      case "departmentPerformance":
        return <DepartmentPerformanceChart data={reportData.departmentPerformance} />;
      default:
        return <div>Select a report type</div>;
    }
  };

  const totalComplaints = reportData.complaintStatusDistribution.reduce(
    (sum, item) => sum + item.count,
    0
  );
  const resolvedCount =
    reportData.complaintStatusDistribution.find((i) => i.status === "Resolved")?.count || 0;
  const pendingCount =
    reportData.complaintStatusDistribution.find((i) => i.status === "Pending")?.count || 0;
  const avgResolutionTime =
    reportData.resolutionTimeByDepartment.length > 0
      ? Math.round(
          reportData.resolutionTimeByDepartment.reduce((sum, i) => sum + i.averageHours, 0) /
            reportData.resolutionTimeByDepartment.length
        ) + "h"
      : "N/A";

  if (loading) return <Loader />;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Header title="Reports & Analytics" />
        <main className="dashboard-main">
          <div className="reports-header">
            <div className="report-filters">
              <div className="filter-group">
                <label htmlFor="report-type">
                  <FiFilter className="filter-icon" /> Report Type:
                </label>
                <select
                  id="report-type"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="complaintsByCategory">Complaints by Category</option>
                  <option value="resolutionTimeByDepartment">
                    Resolution Time by Department
                  </option>
                  <option value="complaintStatusDistribution">
                    Complaint Status Distribution
                  </option>
                  <option value="monthlyComplaintTrend">Monthly Complaint Trend</option>
                  <option value="departmentPerformance">Department Performance</option>
                </select>
              </div>
             
            </div>

          
            <ExportButtons data={exportableData} />
          </div>

          <div className="report-content">
            {renderChart()}
            <SummaryStats
              total={totalComplaints}
              resolved={resolvedCount}
              pending={pendingCount}
              avgResolutionTime={avgResolutionTime}
            />
            
            <WeeklyComplaintsTable onExportDataChange={setExportableData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;