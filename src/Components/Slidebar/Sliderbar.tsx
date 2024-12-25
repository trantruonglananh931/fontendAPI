// Sidebar.tsx
import React from 'react';
import { DropDownFC } from '../DropDown/DropDownFC';
import { useNavigate } from 'react-router-dom';
import { FaCartShopping } from "react-icons/fa6";
import { CgViewMonth } from "react-icons/cg";
import { TbCategoryFilled } from "react-icons/tb";
import { FaUser } from "react-icons/fa6";
import { FaChartSimple } from "react-icons/fa6";
import ProductList from '../../Pages/Admin/Products/ProducList';
import ProductAdd from '../../Pages/Admin/Products/ProductAdd';
import CategoryList from '../../Pages/Admin/CategoryList';
import UserList from "../../Pages/Admin/UserList";
import AllOrders from "../../Pages/Admin/AllOrders";
import Finance from "../../Pages/Admin/Finance";

interface SidebarProps {
  isOpen: boolean;
  addTab: (key: string, label: string, component: JSX.Element) => void;
}

const Slidebar: React.FC<SidebarProps> = ({ isOpen,addTab  }) => {
  const navigate = useNavigate();

  const handleNavigation = (label: string, key: string,component :JSX.Element) => {
    // navigate(path);
    addTab(key, label, component);
  };

  const menu = [
    {
       menuItem: <button onClick={() => handleNavigation('Danh sách sản phẩm', 'ProductList',<ProductList addTab={addTab}/>)} className="w-full  text-nowrap  text-left p-2 hover:bg-blue-50  hover:text-black text-gray-200 " style={{ fontSize:"15px"}}>
        Danh sách sản phẩm
      </button>

    },
    {      
      menuItem: <button onClick={() => handleNavigation( 'Thêm sản phẩm mới', 'ProductAdd',<ProductAdd/>)} className=" w-full text-nowrap  text-left p-2 hover:bg-blue-50  hover:text-black text-gray-200" style={{ fontSize:"15px"}}>
      Thêm sản phẩm mới
    </button>
    }
   ]

   const menu1 = [
    {
       menuItem: <button onClick={() => handleNavigation( 'Danh sách danh mục', 'CategoryList',<CategoryList/>)} className="w-full text-nowrap text-left p-2 hover:bg-blue-50  hover:text-black text-gray-200" style={{ fontSize:"15px"}}>
        Danh sách danh mục
      </button>

    },
    // {      
    //   menuItem: <button onClick={() => handleNavigation('/admin/category')} className=" w-full text-nowrap  text-left p-2 hover:bg-blue-50  hover:text-black" style={{ fontSize:"15px"}}>
    //   Thêm danh mục mới
    // </button>
    // }
   ]

   const menu2 = [
    {
       menuItem: <button onClick={() => handleNavigation('Danh sách người dùng', 'UserList',<UserList/>)} className="w-full text-nowrap text-left p-2 hover:bg-blue-50  hover:text-black text-gray-200" style={{ fontSize:"15px"}}>
        Danh sách người dùng
      </button>

    }
   ]

   const menu3 = [
    {
       menuItem: <button onClick={() => handleNavigation('Danh sách đơn hàng', 'AllOrders',<AllOrders/>)} className="w-full text-nowrap text-left p-2 hover:bg-blue-50  hover:text-black text-gray-200" style={{ fontSize:"15px"}}>
        Danh sách đơn hàng
      </button>

    }
   ]

    const menu4 = [
      {
         menuItem: <button onClick={() => handleNavigation( 'Thống kê', 'Finance',<Finance/>)} className="w-full text-nowrap text-left p-2 hover:bg-blue-50  hover:text-black text-gray-200" style={{ fontSize:"15px"}}>
          Thống kê doanh số
        </button>
  
      }
     ]


     return (
      <div
        className={`w-64 bg-gray-600 text-white ${
          isOpen ? 'block' : 'hidden'
        } transition-all duration-300 shadow-lg`}
      >
        <div className="flex items-center justify-center py-2">
          <img
            src="https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-Yody.png"
            alt="Logo"
            className="w-24 h-16 object-contain"
          />
        </div>
    
        {/* Sidebar Menu */}
        <ul className="space-y-4 text-base pt-2 px-4">
          <li className="group">
            <DropDownFC
              trigger={
                <button className="flex items-center gap-3 text-white hover:text-blue-400 transition duration-200">
                  <CgViewMonth className="text-l text-gray-500 group-hover:text-blue-600" />
                  Quản Lí Sản phẩm
                </button>
              }
              menu={menu}
            />
          </li>
    
          <li className="group">
            <DropDownFC
              trigger={
                <button className="flex items-center gap-3 text-white hover:text-blue-400 transition duration-200">
                  <TbCategoryFilled className="text-l text-gray-500 group-hover:text-blue-600" />
                  Quản Lí Danh mục
                </button>
              }
              menu={menu1}
            />
          </li>
    
          <li className="group">
            <DropDownFC
              trigger={
                <button className="flex items-center gap-3 text-white hover:text-blue-400 transition duration-200">
                  <FaUser className="text-l text-gray-500 group-hover:text-blue-600" />
                  Quản Lí Người dùng
                </button>
              }
              menu={menu2}
            />
          </li>
    
          <li className="group">
            <DropDownFC
              trigger={
                <button className="flex items-center gap-3 text-white hover:text-blue-400 transition duration-200">
                  <FaCartShopping className="text-l text-gray-500 group-hover:text-blue-600" />
                  Quản Lí Đơn Hàng
                </button>
              }
              menu={menu3}
            />
          </li>
    
          <li className="group">
            <DropDownFC
              trigger={
                <button className="flex items-center gap-3 text-white hover:text-blue-400 transition duration-200">
                  <FaChartSimple className="text-l text-gray-500 group-hover:text-blue-600" />
                  Thống Kê Đơn Hàng
                </button>
              }
              menu={menu4}
            />
          </li>
        </ul>
      </div>
    );
    
    
  };    
export default Slidebar;
