import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";

const HeaderAdmin = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo or Branding */}
      <div className="flex items-center space-x-3">
        
        <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">
          Admin Dashboard
        </h1>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-lg mx-10">
        <input
          type="text"
          placeholder="Search jobs, candidates, employers..."
          className="w-full pl-4 pr-12 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm transition duration-200 text-sm"
        />
        <span className="absolute right-4 top-2.5 text-gray-400 pointer-events-none">
          🔍
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <div className="relative">
          <button className="text-gray-600 hover:text-indigo-500 transition duration-200">
            <FaBell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 animate-ping">
              3
            </span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5">
              3
            </span>
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <FaUserCircle className="h-8 w-8 text-indigo-600 group-hover:scale-105 transition-transform duration-200" />
          <span className="text-base font-medium text-gray-800 group-hover:text-indigo-600">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
