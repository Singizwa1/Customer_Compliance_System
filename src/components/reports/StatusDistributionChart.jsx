
import React from "react"
import { Pie } from "react-chartjs-2"

const StatusDistributionChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.status),
    datasets: [{
      label: "Complaint Status Distribution",
      data: data.map(item => item.count),
      backgroundColor: ["rgba(0, 128, 0, 1)","rgba(255, 165, 0, 1)", "rgba(52, 152, 219, 1)" ],
      borderColor: ["rgba(0, 128, 0, 1)","rgba(255, 165, 0, 1)", "rgba(52, 152, 219, 1)" ],
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