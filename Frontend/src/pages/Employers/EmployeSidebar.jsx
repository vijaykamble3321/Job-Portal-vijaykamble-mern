import React from 'react';
import { Link, useNavigate } from 'react-router';
import { 
  FiHome, 
  FiBriefcase, 
  FiUsers, 
  FiBarChart2, 
  FiSettings,
  FiLogOut,
  FiUser,
  FiPlusSquare,
  FiMail,
  FiPhone
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const EmployerSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Authentication cleanup logic here
    navigate('/');
  };

  const menuItems = [
   
    { path: "/employer/register", icon: <FiBriefcase size={18} />, label: "Register" },
    { path: "/employer/application", icon: <FiUsers size={18} />, label: "Applicants" },
    { path: "/employer/analytics", icon: <FiBarChart2 size={18} />, label: "Analytics" },
    { path: "/employer/createjob", icon: <FiPlusSquare size={18} />, label: "Post New Job", highlight: true },
  ];

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 p-6 flex flex-col"
      style={{ boxShadow: "8px 0 32px rgba(0, 0, 0, 0.04)" }}
    >
      {/* Brand Logo */}
      <div className="mb-10 px-2">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
            <FiBriefcase className="text-white" size={18} />
          </div>
          <div>
            <span className="text-xl font-semibold text-gray-800">TalentSync</span>
            <p className="text-xs text-gray-400">Employer Portal</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1.5">
        {menuItems.map((item, index) => (
          <motion.div 
            key={index}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 
                ${item.highlight ? 
                  'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 font-medium border border-indigo-100 shadow-sm' : 
                  'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              <span className={`${item.highlight ? 'text-indigo-500' : 'text-gray-500'}`}>
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
              {item.highlight && (
                <span className="ml-auto w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              )}
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto space-y-5 pt-4 border-t border-gray-200">
        {/* Settings */}
        <motion.div 
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Link
            to="/employer/settings"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
          >
            <FiSettings size={18} className="text-gray-500" />
            <span className="text-sm">Settings</span>
          </Link>
        </motion.div>

  

        {/* Logout */}
        <motion.div 
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400 }}
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 cursor-pointer"
        >
          <FiLogOut size={18} className="text-gray-500 group-hover:text-red-500" />
          <span className="text-sm">Logout</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmployerSidebar;