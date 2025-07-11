import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskList from '../components/TaskList';

const TasksPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login?reason=auth");

    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 w-full min-h-screen bg-slate-50 dark:bg-slate-900">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">My Tasks</h2>
      <div className="w-full max-w-4xl p-6">
        <div className="bg-white dark:bg-slate-800 backdrop-blur-md border border-white/30 shadow-lg rounded-2xl p-6">
          <TaskList />
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
