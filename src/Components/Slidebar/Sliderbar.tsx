// Sidebar.tsx
import React from 'react';
import { DropDownFC } from '../DropDown/DropDownFC';
import { useNavigate } from 'react-router-dom';
import { FaCartShopping } from "react-icons/fa6";
import { CgViewMonth } from "react-icons/cg";
import { TbCategoryFilled } from "react-icons/tb";
import { FaUser } from "react-icons/fa6";
import { FaChartSimple } from "react-icons/fa6";

interface SidebarProps {
  isOpen: boolean;
}

const Slidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const menu = [
    {
       menuItem: <button onClick={() => handleNavigation('/admin/productlist')} className="w-full  text-nowrap  text-left p-2 hover:bg-blue-50  hover:text-black " style={{ fontSize:"15px"}}>
        Danh sách sản phẩm
      </button>

    },
    {      
      menuItem: <button onClick={() => handleNavigation("/admin/product/add")} className=" w-full text-nowrap  text-left p-2 hover:bg-blue-50  hover:text-black" style={{ fontSize:"15px"}}>
      Thêm sản phẩm mới
    </button>
    }
   ]

   const menu1 = [
    {
       menuItem: <button onClick={() => handleNavigation('/admin/category')} className="w-full text-nowrap text-left p-2 hover:bg-blue-50  hover:text-black" style={{ fontSize:"15px"}}>
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
       menuItem: <button onClick={() => handleNavigation('/admin/user')} className="w-full text-nowrap text-left p-2 hover:bg-blue-50  hover:text-black" style={{ fontSize:"15px"}}>
        Danh sách danh mục
      </button>

    }
   ]

   const menu3 = [
    {
       menuItem: <button onClick={() => handleNavigation('/admin/orders')} className="w-full text-nowrap text-left p-2 hover:bg-blue-50  hover:text-black" style={{ fontSize:"15px"}}>
        Danh sách đơn hàng
      </button>

    }
   ]

    const menu4 = [
      {
         menuItem: <button onClick={() => handleNavigation('/admin/finance')} className="w-full text-nowrap text-left p-2 hover:bg-blue-50  hover:text-black" style={{ fontSize:"15px"}}>
          Danh sách danh mục
        </button>
  
      }
     ]


  return (
   
    <div className={`w-52 bg-green-500 text-white ${isOpen ? 'block' : 'hidden'} transition-all duration-300`}>
 
      <ul className="space-y-2 mt-14 text-xl pt-4 ml-3" style={{ fontSize:"18px"}}>
        <li >
            <DropDownFC
            trigger={<button className='font-bold hover:text-red-700 flex'><CgViewMonth />Quản Lí Sản phẩm</button>}
            menu={menu}
          />
        </li>
        <li  >
          {/* <button onClick={() => handleNavigation('/admin/category')} className="w-full text-left p-2 hover:bg-green-600">
            Danh mục
          </button> */}
            <DropDownFC
              trigger={<button className='font-bold  hover:text-red-700 flex'><TbCategoryFilled />Quản Lí Danh mục</button>}
              menu={menu1}
            />
        </li>
        <li>
          <DropDownFC
            trigger={<button className='font-bold  hover:text-red-700 flex'><FaUser />Quản Lí Người dùng</button>}
            menu={menu2}
          />
        </li>
        <li>
          {/* <button onClick={() => handleNavigation('/admin/orders')} className="w-full text-left p-2 hover:bg-green-600">
            Tất cả đơn hàng
          </button> */}
          <DropDownFC
            trigger={<button className='font-bold hover:text-red-700 flex'><FaCartShopping />Quản Lí Đơn Hàng</button>}
            menu={menu3}
          />
        </li>
        <li>

          <DropDownFC
            trigger={<button className='font-bold hover:text-red-700 flex'><FaChartSimple />Thống kê đơn hàng</button>}
            menu={menu4}
          />
        </li>
      </ul>
    </div>
  );
};

export default Slidebar;
