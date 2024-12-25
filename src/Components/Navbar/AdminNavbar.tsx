import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { useAuth } from '../../Context/useAuth';

interface AdminNavbarProps {
  toggleSidebar: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ toggleSidebar }) => {
  const { logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  return (
    <div className="bg-black text-white p-4 flex justify-between items-center shadow-lg">
      {/* Sidebar Toggle Icon */}
      <FaBars 
        className="cursor-pointer text-2xl hover:text-gray-400 transition duration-300"
        onClick={toggleSidebar}
      />
      
      {/* Title */}
      <div className="text-2xl font-bold ml-4 tracking-wide">
        ADMIN
      </div>
  
      {/* Navbar Links */}
      <div className="flex space-x-6">
        {/* <Link to="/admin/change-password" className="hover:text-gray-300 transition duration-300">
          Thay đổi mật khẩu
        </Link> */}
        {/* <Link to="/admin/settings" className="hover:text-gray-300 transition duration-300">
          Cài đặt
        </Link> */}
        <button 
          onClick={handleLogout} 
          className="bg-gray-600 px-4 py-2 rounded-sm hover:bg-red-700 transition duration-300"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
