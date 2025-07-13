import React from 'react';
import { FaSearch, FaBell, FaUserCircle, FaBriefcase, FaHome } from 'react-icons/fa';
import { motion } from 'framer-motion';

const EmployeHeader = () => {
  return (
    <header className="bg-white shadow-md p-4 fixed w-full top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <FaBriefcase className="text-2xl text-blue-500" />
            <span className="text-xl font-bold text-gray-800">JobPortal</span>
          </motion.div>
          <nav className="hidden md:flex items-center space-x-6">
            
         
          </nav>
        </div>

        {/* Search Bar */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-96"
        >
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search jobs..."
            className="ml-2 bg-transparent outline-none w-full"
          />
        </motion.div>

        {/* User Actions */}
        <div className="flex items-center space-x-6">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative cursor-pointer"
          >
            <FaBell className="text-2xl text-gray-700" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
              3
            </span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer"
          >
            <FaUserCircle className="text-2xl text-gray-700" />
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default EmployeHeader;