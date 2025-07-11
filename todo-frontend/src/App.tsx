// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import TasksPage from './pages/TasksPage';
import DashboardPage from './pages/DashboardPage';
import Header from './components/Header';
import Login from "./pages/Login";
import Register from "./pages/Register";


const App: React.FC = () => (
  <BrowserRouter>
   <Header />
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<div className="p-4">Page not found</div>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      

    </Routes>
  </BrowserRouter>
);

export default App;
