
import React from "react"
import { Bar } from "react-chartjs-2"

const ResolutionTimeChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.department),
    datasets: [{
      label: "Average Resolution Time (Hours)",
      data: data.map(item => item.averageHours),
      backgroundColor: "rgba(255, 107, 107, 0.7)",
      borderColor: "rgba(255, 107, 107, 1)",
      borderWidth: 1
    }]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Average Resolution Time by Department" }
    }
  }

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default ResolutionTimeChart