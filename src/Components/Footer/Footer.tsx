import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer: React.FC = () => {

  const handleLoyaltyProgramJoin = () => {
    alert('Cảm ơn bạn đã tham gia chương trình khách hàng thân thiết! Hãy nhập mã NGAYNHAGIAO2024 để nhận ưu đãi 20% với đơn hàng từ 200k trở lên.');
  };

  return (
    <footer className="bg-gray-700 text-gray-800 py-10 mt-10 w-full">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaPhone className="text-white" />
                <span className="text-gray-200">024 999 86 999</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-white" />
                <span className="text-gray-200">chamsockhachhang@cuahang.vn</span>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <a href="https://facebook.com" className="text-gray-200 hover:text-blue-500 transition">
                <FaFacebook className="text-2xl" />
              </a>
              <a href="https://instagram.com" className="text-gray-200 hover:text-pink-500 transition">
                <FaInstagram className="text-2xl" />
              </a>
              <a href="https://youtube.com" className="text-gray-200 hover:text-red-500 transition">
                <FaYoutube className="text-2xl" />
              </a>
            </div>
          </div>

          {/* About STORE */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Về STORE</h3>
            <ul className="space-y-3 text-base">
              <li>
                <a href="/gioi-thieu" className="text-gray-200 hover:text-white transition">Giới thiệu</a>
              </li>
              <li>
                <a href="/tuyen-dung" className="text-gray-200 hover:text-white transition">Tuyển dụng</a>
              </li>
              <li>
                <a href="/tin-tuc" className="text-gray-200 hover:text-white transition">Tin tức</a>
              </li>
              <li>
                <a href="/he-thong-cua-hang" className="text-gray-200 hover:text-white transition">Hệ thống cửa hàng</a>
              </li>
            </ul>
          </div>

          {/* Loyalty Program Join */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Tham gia chương trình khách hàng thân thiết</h3>
            <p className="mb-4 text-gray-300">
              Nhận ưu đãi đặc biệt và thông tin về các chương trình khuyến mãi mỗi tháng.
            </p>
            <button
              onClick={handleLoyaltyProgramJoin}
              className="px-6 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Tham gia ngay
            </button>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-600 mt-8 pt-6 text-center text-gray-300 text-sm">
          <p>© STORE 2024 | Mã số doanh nghiệp: 0801206940</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
