import React, { useState } from 'react'
import EmployeSidebar from './EmployeSidebar';
import EmployeHeader from './EmployeHeader';
import { Outlet } from 'react-router';

const EmployeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="flex ">
      <EmployeSidebar isOpen={isSidebarOpen} />

      <div className="flex-1 ">
        <EmployeHeader
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
        />

        <main
          className={`p-20 transition-all duration-300  ${
            isSidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};


export default EmployeLayout
