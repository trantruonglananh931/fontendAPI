import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate,useLocation  } from 'react-router-dom';
import Slidebar from "../../Components/Slidebar/Sliderbar";
import AdminNavbar from "../../Components/Navbar/AdminNavbar";
import { useAuth } from "../../Context/useAuth";
import Finance from "../../Pages/Admin/Finance";

const Admin: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation(); 

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  const [tabs, setTabs] = useState([
    { key: 'Finance', label:'Thống kê' , component: <Finance/> },
  ]);  // Tab mặc định
  const [activeTab, setActiveTab] = useState("Finance");
  const addTab = (key: string, label: string, component: JSX.Element) => {
  
    if (!tabs.some((tab) => tab.key === key)) {
      setTabs([...tabs, { key, label, component }]);
    }
    setActiveTab(key);
  };

  const closeTab = (key: string) => {
    setTabs(tabs.filter((tab) => tab.key !== key));
    if (activeTab === key && tabs.length > 1) {
      setActiveTab(tabs[0].key);  // Chuyển sang tab đầu tiên nếu tab hiện tại bị đóng
    }
  };
  // const isProductUpdate = location.pathname.includes('/admin/product/update');

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Slidebar isOpen={isSidebarOpen} addTab={addTab}  />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Admin Navbar with Sidebar Toggle */}
        <AdminNavbar toggleSidebar={toggleSidebar} />
         {/* Thanh tab ngang */}
         <div className="bg-gray-200 p-2">
          <div className="whitespace-nowrap overflow-x-auto space-x-4  w-full scroll-auto">
            {tabs.map((tab) => (
              <div
                key={tab.key}
                className={`cursor-pointer px-4 py-2 rounded max-w-60 truncate relative inline-block scroll-auto ${activeTab === tab.key ? 'bg-blue-500 text-white' : 'text-gray-800 hover:bg-blue-100'}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                {/* Xóa tab */}
                <span 
                  className={`ml-2 text-sm  cursor-pointer hover:text-red-600 font-bold size-3 absolute right-0 top-3 ${activeTab === tab.key ? `text-black` :` text-gray-500`}`}
                  onClick={(e) => {
                    e.stopPropagation(); // Ngừng sự kiện click để tránh chuyển tab khi đóng tab
                    closeTab(tab.key);
                  }}
                >
                  X
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 w-full">
        
         {tabs.find((tab) => tab.key === activeTab)?.component}
        <div>
         
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;
