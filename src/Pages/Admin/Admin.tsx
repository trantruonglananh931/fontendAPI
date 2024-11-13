import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Slidebar from "../../Components/Slidebar/Sliderbar";
import AdminNavbar from "../../Components/Navbar/AdminNavbar";

const Admin: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Slidebar isOpen={isSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Admin Navbar with Sidebar Toggle */}
        <AdminNavbar toggleSidebar={toggleSidebar} />

        <div className="p-4 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;
