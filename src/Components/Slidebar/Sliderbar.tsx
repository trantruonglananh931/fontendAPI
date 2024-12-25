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

  const handleNavigation = (path: string,label: string, key: string,component :JSX.Element) => {
    navigate(path);
    addTab(key, label, component);
  };

  const menu = [
    {
       menuItem: <button onClick={() => handleNavigation('/admin/productlist','Danh sách sản phẩm', 'ProductList',<ProductList/>)} className="w-full  text-nowrap  text-left p-2 hover:bg-blue-50  hover:text-black " style={{ fontSize:"15px"}}>
        Danh sách sản phẩm
      </button>

    },
    {      
      menuItem: <button onClick={() => handleNavigation("/admin/product/add", 'Thêm sản phẩm mới', 'ProductAdd',<ProductAdd/>)} className=" w-full text-nowrap  text-left p-2 hover:bg-blue-50  hover:text-black" style={{ fontSize:"15px"}}>
      Thêm sản phẩm mới
    </button>
    }
   ]

   const menu1 = [
    {
       menuItem: <button onClick={() => handleNavigation('/admin/category', 'Danh sách danh mục', 'CategoryList',<CategoryList/>)} className="w-full text-nowrap text-left p-2 hover:bg-blue-50  hover:text-black" style={{ fontSize:"15px"}}>
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
       menuItem: <button onClick={() => handleNavigation('/admin/user', 'Danh sách người dùng', 'UserList',<UserList/>)} className="w-full text-nowrap text-left p-2 hover:bg-blue-50  hover:text-black" style={{ fontSize:"15px"}}>
        Danh sách người dùng
      </button>

    }
   ]

   const menu3 = [
    {
       menuItem: <button onClick={() => handleNavigation('/admin/orders', 'Danh sách đơn hàng', 'AllOrders',<AllOrders/>)} className="w-full text-nowrap text-left p-2 hover:bg-blue-50  hover:text-black" style={{ fontSize:"15px"}}>
        Danh sách đơn hàng
      </button>

    }
   ]

    const menu4 = [
      {
         menuItem: <button onClick={() => handleNavigation('/admin/finance', 'Thống kê', 'Finance',<Finance/>)} className="w-full text-nowrap text-left p-2 hover:bg-blue-50  hover:text-black" style={{ fontSize:"15px"}}>
          Thống kê doanh số
        </button>
  
      }
     ]


     return (
      <div className={`w-64 bg-green-600 text-white ${isOpen ? 'block' : 'hidden'} transition-all duration-300 `}>
        <ul className="space-y-3 mt-16 text-sm pt-4 ml-3" style={{ fontSize: "18px" }}>
          <li>
            <DropDownFC
              trigger={<button className='font-sans hover:text-sky-950 flex items-center mb-2'><CgViewMonth className="mr-2" />Quản Lí Sản phẩm</button>}
              menu={menu}
            />
          </li>
          <li>
            <DropDownFC
              trigger={<button className='font-sans hover:text-sky-950 flex items-center mb-2'><TbCategoryFilled className="mr-2" />Quản Lí Danh mục</button>}
              menu={menu1}
            />
          </li>
          <li>
            <DropDownFC
              trigger={<button className='font-sans hover:text-sky-950 flex items-center mb-2'><FaUser className="mr-2" />Quản Lí Người dùng</button>}
              menu={menu2}
            />
          </li>
          <li>
            <DropDownFC
              trigger={<button className='font-sans hover:text-sky-950 flex items-center mb-2'><FaCartShopping className="mr-2" />Quản Lí Đơn Hàng</button>}
              menu={menu3}
            />
          </li>
          <li>
            <DropDownFC
              trigger={<button className='font-sans hover:text-sky-950 flex items-center mb-2 '><FaChartSimple className="mr-2" />Thống kê đơn hàng</button>}
              menu={menu4}
            />
          </li>
        </ul>
      </div>
    );
  };    
export default Slidebar;
