import React from "react"
import { Bar } from "react-chartjs-2"

const ComplaintsByCategory = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        label: "Number of Complaints",
        data: data.map(item => item.count),
        backgroundColor: "rgba(58, 110, 165, 0.7)",
        borderColor: "rgba(58, 110, 165, 1)",
        borderWidth: 1
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Complaints by Category" }
    },
    scales: {
      x: {
        type: "category", 
        title: {
          display: true,
          text: "Category"
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Complaints"
        }
      }
    }
  }

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default ComplaintsByCategory
