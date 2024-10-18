import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

const Admin: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`w-64 bg-green-500 text-white ${isSidebarOpen ? 'block' : 'hidden'} transition-all duration-300`}>
        <div className="p-4 text-lg font-bold">Dashboard</div>
        <nav className="mt-4">
          <ul>
            <li className="px-4 py-2 hover:bg-green-600">
              <Link to="/">Home</Link>
            </li>
            <li className="px-4 py-2 hover:bg-green-600">
              <Link to="/category">Category</Link>
            </li>
            <li className="px-4 py-2 hover:bg-green-600">
              <Link to="/user">User</Link>
            </li>
            <li className="px-4 py-2 hover:bg-green-600">
              <Link to="/allorders">All Orders</Link>
            </li>
            <li className="px-4 py-2 hover:bg-green-600">
              <Link to="/finance">Revenue</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 p-6 bg-gray-100 ${isSidebarOpen ? 'ml-64' : ''}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center">
            <button className="mr-4 bg-blue-500 text-white px-4 py-2 rounded">New</button>
            <div className="relative">
              <button className="bg-gray-500 text-white px-4 py-2 rounded">Settings</button>
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs">5</span>
            </div>
            <button onClick={toggleSidebar} className="ml-4 bg-gray-700 text-white px-4 py-2 rounded">
              {isSidebarOpen ? 'Hide' : 'Show'} Sidebar
            </button>
          </div>
        </div>

        {/* Main Outlet */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <Outlet /> {/* Render các trang con tại đây */}
        </div>
      </div>
    </div>
  );
};

export default Admin;
