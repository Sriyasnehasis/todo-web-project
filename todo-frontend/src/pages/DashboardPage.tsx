import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskStats from '../components/TaskStats';
import CategoryChart from "../components/CategoryChart";
import PriorityChart from "../components/PriorityChart";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login?reason=auth");

    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <CategoryChart />
        <TaskStats />
        <PriorityChart />
      </div>
    </div>
  );
};

export default DashboardPage;
