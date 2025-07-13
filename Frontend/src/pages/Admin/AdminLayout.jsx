import React, { useState } from "react";
import { Outlet } from "react-router";
import HeaderAdmin from "./HeaderAdmin";
import SidebarAdmin from "./SidebarAdmin";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      {isSidebarOpen && <SidebarAdmin isOpen={isSidebarOpen} />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <HeaderAdmin
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
