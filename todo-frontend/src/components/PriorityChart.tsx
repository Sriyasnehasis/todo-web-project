import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { fetchTaskStatsByPriority } from "../api/taskAPI";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PriorityChart: React.FC = () => {
  const [stats, setStats] = useState<{ high: number; medium: number; low: number } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTaskStatsByPriority();
        setStats(data);
      } catch (e) {
        console.error(e);
        alert("Failed to load priority data");
      }
    };
    load();
  }, []);

  if (!stats) return <div>Loading priority chart...</div>;

  const data = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        data: [stats.high, stats.medium, stats.low],
        backgroundColor: ["#3b82f6", "#60a5fa", "#93c5fd"],
        hoverBackgroundColor:["#2563eb", "#3b82f6", "#60a5fa"],
        borderColor: "#fff",
        borderWidth: 1,
        borderRadius: 3,
        cutout: "65%",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: { size: 14 },
          color: "#374151", // gray-700
        },
      },
      tooltip: {
        bodyFont: { size: 14 },
        backgroundColor: "#111827", // gray-900
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm mx-auto my-4">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
        Tasks by Priority
      </h2>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default PriorityChart;
