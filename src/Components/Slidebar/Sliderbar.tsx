// Sidebar.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
}

const Slidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className={`w-52 bg-green-500 text-white ${isOpen ? 'block' : 'hidden'} transition-all duration-300`}>
      
      <ul className="space-y-2 mt-14 text-xl pt-4">
        <li>
          <button onClick={() => handleNavigation('/admin/productlist')} className="w-full text-left p-2 hover:bg-green-600">
            Sản phẩm
          </button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/admin/category')} className="w-full text-left p-2 hover:bg-green-600">
            Danh mục
          </button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/admin/user')} className="w-full text-left p-2 hover:bg-green-600">
            Người dùng
          </button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/admin/orders')} className="w-full text-left p-2 hover:bg-green-600">
            Tất cả đơn hàng
          </button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/admin/finance')} className="w-full text-left p-2 hover:bg-green-600">
            Doanh thu
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Slidebar;
