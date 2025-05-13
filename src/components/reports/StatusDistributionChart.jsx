// src/pages/reports/StatusDistributionChart.jsx
import React from "react"
import { Pie } from "react-chartjs-2"

const StatusDistributionChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.status),
    datasets: [{
      label: "Complaint Status Distribution",
      data: data.map(item => item.count),
      backgroundColor: ["rgba(255, 193, 7, 0.7)", "rgba(58, 110, 165, 0.7)", "rgba(40, 167, 69, 0.7)"],
      borderColor: ["rgba(255, 193, 7, 1)", "rgba(58, 110, 165, 1)", "rgba(40, 167, 69, 1)"],
      borderWidth: 1
    }]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Complaint Status Distribution" }
    }
  }

  return (
    <div className="chart-container">
      <Pie data={chartData} options={options} />
    </div>
  )
}

export default StatusDistributionChart