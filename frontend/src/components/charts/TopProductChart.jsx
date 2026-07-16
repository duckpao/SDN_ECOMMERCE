import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function TopProductChart({ products }) {

  // Lấy Top 5 sản phẩm bán chạy
  const topProducts = [...products]
    .sort((a, b) => b.soldQuantity - a.soldQuantity)
    .slice(0, 5);

  const data = {
    labels: topProducts.map((p) => p.name),
    datasets: [
      {
        label: "Số lượng đã bán",
        data: topProducts.map((p) => p.soldQuantity),
        backgroundColor: "#0d6efd",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}