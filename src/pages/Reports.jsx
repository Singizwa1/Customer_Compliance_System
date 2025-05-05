"use client"

import { useState, useEffect } from "react"
import Header from "../components/common/Header"
import Sidebar from "../components/common/Sidebar"
import Loader from "../components/common/Loader"
import {
  getComplaintsByCategory,
  getResolutionTimeByDepartment,
  getComplaintStatusDistribution,
  getMonthlyComplaintTrend,
  getDepartmentPerformance,
} from "../services/reportService"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js"
import { Bar, Pie, Line } from "react-chartjs-2"
import { FiDownload, FiFilter } from "react-icons/fi"
import { toast } from "react-toastify"
import "../styles/reports.css"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement)

const Reports = () => {
  const [loading, setLoading] = useState(true)
  const [reportType, setReportType] = useState("complaintsByCategory")
  const [dateRange, setDateRange] = useState("week")
  const [reportData, setReportData] = useState({
    complaintsByCategory: [],
    resolutionTimeByDepartment: [],
    complaintStatusDistribution: [],
    monthlyComplaintTrend: [],
    departmentPerformance: [],
  })

  useEffect(() => {
    fetchReportData()
  }, [])

  const fetchReportData = async () => {
    try {
      setLoading(true)

      // Fetch all report data in parallel
      const [categoryData, resolutionTimeData, statusData, trendData, performanceData] = await Promise.all([
        getComplaintsByCategory(),
        getResolutionTimeByDepartment(),
        getComplaintStatusDistribution(),
        getMonthlyComplaintTrend(),
        getDepartmentPerformance(),
      ])

      setReportData({
        complaintsByCategory: categoryData,
        resolutionTimeByDepartment: resolutionTimeData,
        complaintStatusDistribution: statusData,
        monthlyComplaintTrend: trendData,
        departmentPerformance: performanceData,
      })
    } catch (error) {
      console.error("Failed to fetch report data:", error)
      toast.error("Failed to load report data")
    } finally {
      setLoading(false)
    }
  }

  const handleExportReport = () => {
    
    toast.info("Report export functionality would be implemented here")
  }

  const renderChart = () => {
    switch (reportType) {
      case "complaintsByCategory":
        return renderComplaintsByCategoryChart()
      case "resolutionTimeByDepartment":
        return renderResolutionTimeChart()
      case "complaintStatusDistribution":
        return renderStatusDistributionChart()
      case "monthlyComplaintTrend":
        return renderMonthlyTrendChart()
      case "departmentPerformance":
        return renderDepartmentPerformanceChart()
      default:
        return <div>Select a report type</div>
    }
  }

  const renderComplaintsByCategoryChart = () => {
    const data = {
      labels: reportData.complaintsByCategory.map((item) => item.category),
      datasets: [
        {
          label: "Number of Complaints",
          data: reportData.complaintsByCategory.map((item) => item.count),
          backgroundColor: "rgba(58, 110, 165, 0.7)",
          borderColor: "rgba(58, 110, 165, 1)",
          borderWidth: 1,
        },
      ],
    }

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Complaints by Category",
        },
      },
    }

    return (
      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>
    )
  }

  const renderResolutionTimeChart = () => {
    const data = {
      labels: reportData.resolutionTimeByDepartment.map((item) => item.department),
      datasets: [
        {
          label: "Average Resolution Time (Hours)",
          data: reportData.resolutionTimeByDepartment.map((item) => item.averageHours),
          backgroundColor: "rgba(255, 107, 107, 0.7)",
          borderColor: "rgba(255, 107, 107, 1)",
          borderWidth: 1,
        },
      ],
    }

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Average Resolution Time by Department",
        },
      },
    }

    return (
      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>
    )
  }

  const renderStatusDistributionChart = () => {
    const data = {
      labels: reportData.complaintStatusDistribution.map((item) => item.status),
      datasets: [
        {
          label: "Complaint Status Distribution",
          data: reportData.complaintStatusDistribution.map((item) => item.count),
          backgroundColor: ["rgba(255, 193, 7, 0.7)", "rgba(58, 110, 165, 0.7)", "rgba(40, 167, 69, 0.7)"],
          borderColor: ["rgba(255, 193, 7, 1)", "rgba(58, 110, 165, 1)", "rgba(40, 167, 69, 1)"],
          borderWidth: 1,
        },
      ],
    }

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Complaint Status Distribution",
        },
      },
    }

    return (
      <div className="chart-container">
        <Pie data={data} options={options} />
      </div>
    )
  }

  const renderMonthlyTrendChart = () => {
    const data = {
      labels: reportData.monthlyComplaintTrend.map((item) => item.month),
      datasets: [
        {
          label: "Number of Complaints",
          data: reportData.monthlyComplaintTrend.map((item) => item.count),
          fill: false,
          backgroundColor: "rgba(75, 192, 192, 0.7)",
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.1,
        },
      ],
    }

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Monthly Complaint Trend",
        },
      },
    }

    return (
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
    )
  }

  const renderDepartmentPerformanceChart = () => {
    const data = {
      labels: reportData.departmentPerformance.map((item) => item.department),
      datasets: [
        {
          label: "Resolution Rate (%)",
          data: reportData.departmentPerformance.map((item) => item.resolution_rate),
          backgroundColor: "rgba(54, 162, 235, 0.7)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    }

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Department Performance (Resolution Rate)",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    }

    return (
      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>
    )
  }

  if (loading) {
    return <Loader />
  }

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
                  <FiFilter className="filter-icon" />
                  Report Type:
                </label>
                <select
                  id="report-type"
                  className="form-control"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="complaintsByCategory">Complaints by Category</option>
                  <option value="resolutionTimeByDepartment">Resolution Time by Department</option>
                  <option value="complaintStatusDistribution">Complaint Status Distribution</option>
                  <option value="monthlyComplaintTrend">Monthly Complaint Trend</option>
                  <option value="departmentPerformance">Department Performance</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="date-range">Date Range:</label>
                <select
                  id="date-range"
                  className="form-control"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="week">Current Week</option>
                  <option value="month">Current Month</option>
                  <option value="quarter">Current Quarter</option>
                  <option value="year">Current Year</option>
                </select>
              </div>
            </div>

            <button className="btn btn-primary" onClick={handleExportReport}>
              <FiDownload />
              <span>Export Report</span>
            </button>
          </div>

          <div className="report-content">
            {renderChart()}

            <div className="report-summary">
              <div className="summary-card">
                <div className="summary-title">Total Complaints=</div>
                <div className="summary-value">
                  {reportData.complaintStatusDistribution.reduce((sum, item) => sum + item.count, 0)}
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-title">Handled Complaints=   </div>
                <div className="summary-value">
                  {reportData.complaintStatusDistribution.find((item) => item.status === "Resolved")?.count || 0}
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-title">Pending Complaints=   </div>
                <div className="summary-value">
                  {reportData.complaintStatusDistribution.find((item) => item.status === "Pending")?.count || 0}
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-title">Avg. Resolution Time =  </div>
                <div className="summary-value">
                  {reportData.resolutionTimeByDepartment.length > 0
                    ? Math.round(
                        reportData.resolutionTimeByDepartment.reduce((sum, item) => sum + item.averageHours, 0) /
                          reportData.resolutionTimeByDepartment.length,
                      ) + "h"
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Reports
