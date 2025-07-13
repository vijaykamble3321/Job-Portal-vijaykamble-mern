import React, { useState } from 'react';
import { Outlet } from 'react-router';
import UserSidebar from './UserSidebar';
import UserHeader from './UserHeader';

const UserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed h-full bg-white shadow-md transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <UserSidebar isOpen={isSidebarOpen} />
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <UserHeader 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen} 
        />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
