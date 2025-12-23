import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

function ChartComponent({ sortedTransactions }) {
  const labels = sortedTransactions.map((t) => t.date);

  const incomeData = sortedTransactions.map((t) =>
    t.type === "income" ? Number(t.amount) : 0
  );

  const expenseData = sortedTransactions.map((t) =>
    t.type === "expense" ? Number(t.amount) : 0
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        borderColor: "#2ecc71",
        backgroundColor: "rgba(46, 204, 113, 0.2)",
        tension: 0.3,
      },
      {
        label: "Expense",
        data: expenseData,
        borderColor: "#e74c3c",
        backgroundColor: "rgba(231, 76, 60, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "300px", padding: "1rem 2rem" }}>
      <Line data={data} options={options} />
    </div>
  );
}

export default ChartComponent;

