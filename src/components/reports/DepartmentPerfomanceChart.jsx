// src/pages/reports/DepartmentPerformanceChart.jsx
import React from "react"
import { Bar } from "react-chartjs-2"

const DepartmentPerformanceChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.department),
    datasets: [{
      label: "Resolution Rate (%)",
      data: data.map(item => item.resolution_rate),
      backgroundColor: "rgba(54, 162, 235, 0.7)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1
    }]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Department Performance (Resolution Rate)" }
    },
    scales: {
      y: { beginAtZero: true, max: 100 }
    }
  }

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default DepartmentPerformanceChart