import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F5F5F5] text-[#7F817F] py-8 mt-4">
      <div className="container mx-auto px-6  ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold mb-4">Liên hệ</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FaPhone />
                <span>024 999 86 999</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope />
                <span>chamsockhachhang@cuahang.vn</span>
              </div>
            </div>
           
            <div className="flex space-x-4 mt-4">
              <a href="https://facebook.com" className="text-[#7F817F] hover:text-blue-500">
                <FaFacebook className="text-2xl" />
              </a>
              <a href="https://instagram.com" className="text-[#7F817F] hover:text-pink-500">
                <FaInstagram className="text-2xl" />
              </a>
              <a href="https://youtube.com" className="text-[#7F817F] hover:text-red-500">
                <FaYoutube className="text-2xl" />
              </a>
            </div>
          </div>

         
          <div>
            <h3 className="text-lg font-bold mb-4">Về STORE</h3>
            <ul className="space-y-2 text-base">
              <li>
                <a href="/gioi-thieu" className="text-[#7F817F] hover:underline">Giới thiệu</a>
              </li>
              <li>
                <a href="/tuyen-dung" className="text-[#7F817F] hover:underline">Tuyển dụng</a>
              </li>
              <li>
                <a href="/tin-tuc" className="text-[#7F817F] hover:underline">Tin tức</a>
              </li>
              <li>
                <a href="/he-thong-cua-hang" className="text-[#7F817F] hover:underline">Hệ thống cửa hàng</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Company Information */}
        <div className="border-t border-gray-200 mt-8 pt-4 text-center text-sm ">
          <p>© STORE 2024 | Mã số doanh nghiệp: 0801206940</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
