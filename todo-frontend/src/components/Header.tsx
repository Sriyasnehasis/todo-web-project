// src/components/Header.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => (
  <header className="bg-slate-900 text-white border-b border-slate-700 shadow-sm">
    <nav className="max-w-7xl mx-auto px-4 py-1 flex justify-between items-center h-[60px]">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img
          src="/Habit Trackerlogo.png"
          alt="Habit Tracker Logo"
          className="w-30 h-28 sm:w-30 sm:h-28 invert"
        />
        
      </div>

      {/* Nav Links */}
      <div className="space-x-4 text-sm sm:text-base">
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            isActive ? 'text-blue-400 font-semibold' : 'text-gray-300 hover:text-blue-300'
          }
        >
          Tasks
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? 'text-blue-400 font-semibold' : 'text-gray-300 hover:text-blue-300'
          }
        >
          Dashboard
        </NavLink>
        <NavLink to="/login" className="text-green-300 hover:text-green-400">
          Login
        </NavLink>
        <NavLink to="/register" className="text-yellow-300 hover:text-yellow-400">
          Register
        </NavLink>
      </div>
    </nav>
    <div className="w-full h-[1px] bg-slate-700 opacity-50" />
  </header>
);

export default Header;
