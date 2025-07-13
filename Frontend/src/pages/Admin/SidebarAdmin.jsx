import React from 'react';
import {
  FaHome,
  FaBriefcase,
  FaUser,
  FaBuilding,
  FaChartBar,
  FaSignOutAlt,
  FaChevronRight,
  FaUserShield,
  FaBell,
  FaCog
} from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router';

const SidebarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/');
  };

  const menuItems = [
    { to: '/admin/home', label: 'Dashboard', icon: <FaHome className="text-black" /> },
    { to: '/admin/newregister', label: 'New Registrations', icon: <FaBriefcase className="text-black" /> },
    { to: '/admin/users', label: 'User Management', icon: <FaUser className="text-black" /> },
    { to: '/admin/employe', label: 'Employers', icon: <FaBuilding className="text-black" /> },
    { to: '/admin/analyst', label: 'Analytics', icon: <FaChartBar className="text-black" /> },
  ];

  return (
    <aside className="relative h-screen w-72 flex-shrink-0 overflow-hidden bg-white shadow-2xl border-r border-gray-200">
      {/* Sidebar header with notification */}
      <div className="p-6 flex flex-col border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FaUserShield className="text-indigo-600 text-2xl mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">
              <span className="text-indigo-600">Admin</span> Dashboard
            </h1>
          </div>
          <div className="relative">
            <FaBell className="text-gray-500 text-xl cursor-pointer hover:text-indigo-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">3</span>
          </div>
        </div>
        
        {/* User profile */}
       
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map(({ to, label, icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                  location.pathname === to
                    ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className={`mr-3 ${location.pathname === to ? 'text-indigo-600' : 'text-gray-600'}`}>
                  {icon}
                </span>
                <span className="font-medium flex-grow">{label}</span>
                <FaChevronRight className={`text-xs ${location.pathname === to ? 'text-indigo-600' : 'text-gray-400'}`} />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center p-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all duration-300 shadow hover:shadow-md"
        >
          <FaSignOutAlt className="mr-2" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default SidebarAdmin;