import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { fetchCategoryCounts } from "../api/taskAPI";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CategoryChart: React.FC = () => {
  const [data, setData] = useState<{ _id: string; count: number }[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchCategoryCounts();
        setData(res);
      } catch (e) {
        console.error(e);
        alert("Failed to load category data");
      }
    };
    load();
  }, []);

  const chartData = {
    labels: data.map((d) => d._id),
    datasets: [
      {
        label: "Tasks by Category",
        data: data.map((d) => d.count),
        backgroundColor: 'rgba(96, 165, 250, 0.8)', // Tailwind blue-400
hoverBackgroundColor: 'rgba(59, 130, 246, 1)', // Tailwind blue-500

    borderRadius: 6,
    barThickness: 32,

      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
  <div className="max-w-md w-full mx-auto bg-white rounded-2xl p-4 shadow-lg">
    <h2 className="text-xl font-semibold text-center mb-4 text-gray-900">
      Tasks by Category
    </h2>
    <div className="h-64">
      <Bar data={chartData} options={chartOptions} />
    </div>
  </div>
);

};

export default CategoryChart;
