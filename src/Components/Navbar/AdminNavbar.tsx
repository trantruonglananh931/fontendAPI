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
    <div className="bg-green-700 text-white p-4 flex justify-between items-center">
      {/* Sidebar Toggle Icon */}
      <FaBars 
        className="cursor-pointer text-2xl"
        onClick={toggleSidebar}
      />
      
      {/* Title */}
      <div className="text-xl font-semibold ml-4">ADMIN</div>

      {/* Navbar Links */}
      <div className="flex space-x-4">
        {/* <Link to="/admin/change-password" className="hover:text-gray-300">
          Thay đổi mật khẩu
        </Link> */}
        {/* <Link to="/admin/settings" className="hover:text-gray-300">
          Cài đặt
        </Link> */}
        <button onClick={handleLogout} className="hover:text-gray-300">
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
