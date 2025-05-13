
import React from "react"
import { Line } from "react-chartjs-2"

const MonthlyTrendChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [{
      label: "Number of Complaints",
      data: data.map(item => item.count),
      fill: false,
      backgroundColor: "rgba(75, 192, 192, 0.7)",
      borderColor: "rgba(75, 192, 192, 1)",
      tension: 0.1
    }]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Monthly Complaint Trend" }
    }
  }

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  )
}

export default MonthlyTrendChart