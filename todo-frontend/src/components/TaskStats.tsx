import React, { useEffect, useState } from 'react';
import { fetchTaskStats } from '../api/taskAPI';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskStats: React.FC = () => {
  const [stats, setStats] = useState<{ total: number; completed: number; pending: number } | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchTaskStats();
        setStats(data);
      } catch (e) {
        console.error(e);
        alert("Failed to load task stats");
      }
    };
    loadStats();
  }, []);

  if (!stats) return <div>Loading stats...</div>;

  const chartData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [stats.completed, stats.pending],
        backgroundColor: ["#60a5fa", "#9ca3af"],
        hoverBackgroundColor: ["#3b82f6", "#6b7280"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4 text-center max-w-sm mx-auto">
    <h2 className="text-xl font-bold mb-4 text-gray-900">Task Summary</h2>

      <Pie data={chartData} />
    </div>
  );
};

export default TaskStats;
