import React from 'react';
import { Link, useNavigate } from 'react-router';
import { 
  FaHome, 
  FaBriefcase, 
  FaUser, 
  FaSearch, 
  FaBell, 
  FaFileAlt,
  FaSignOutAlt,
  FaChevronRight
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const UserSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('userToken');
    navigate('/');
  };

  // Active link simulation (you can replace with actual route matching)
  const isActive = (path) => window.location.pathname === path;

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      className="fixed left-0 top-0 h-screen w-60 bg-gradient-to-b from-blue-50 to-white shadow-xl p-6 flex flex-col space-y-2 z-50"
    >
      {/* Logo/Brand Section */}
      <div className="flex items-center space-x-3 mb-10 pl-2">
        <div className="p-3 bg-blue-600 rounded-lg shadow-md">
          <FaBriefcase className="text-2xl text-white" />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          JobSeeker Pro
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 flex flex-col space-y-1">
        {[
         
          { path: '/user/alljobs', icon: <FaSearch />, label: 'Browse Jobs' },
          { path: '/user/applications', icon: <FaFileAlt />, label: 'Applications' },
          { path: '/user/profile', icon: <FaUser />, label: 'Profile' },
          { path: '/user/notification', icon: <FaBell />, label: 'Notifications' },
        ].map((item) => (
          <motion.div 
            key={item.path}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={item.path}
              className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
              <FaChevronRight className={`text-sm ${
                isActive(item.path) ? 'text-white' : 'text-gray-400'
              }`} />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Logout Button */}
      <motion.div
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogout}
        className="mt-auto mb-4 p-3 rounded-xl flex items-center space-x-3 text-red-600 hover:bg-red-50 cursor-pointer transition-colors duration-300"
      >
        <FaSignOutAlt className="text-lg" />
        <span className="font-medium">Logout</span>
      </motion.div>

      {/* User Profile Mini Card (optional) */}
      <div className="border-t border-gray-200 pt-4 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
          U
        </div>
        <div>
          <p className="font-medium text-gray-800">User Name</p>
          <p className="text-xs text-gray-500">Premium Member</p>
        </div>
      </div>
    </motion.div>
  );
};

export default UserSidebar;