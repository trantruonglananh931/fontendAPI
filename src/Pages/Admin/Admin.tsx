import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FaBars } from 'react-icons/fa'; 
import Slidebar from "../../Components/Slidebar/Sliderbar";

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
        <FaBars
          className="cursor-pointer text-2xl ml-4 mt-4"
          onClick={toggleSidebar}
        />  

        <div className="p-4 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;
