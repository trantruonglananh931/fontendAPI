import React from "react";
import { FaFacebook, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer: React.FC = () => {
  const handleViewOnMap = () => {
    window.open("https://www.google.com/maps/place/%C4%90%E1%BA%A1i+H%E1%BB%8Dc+Hutech+Khu+E/@10.8550479,106.7805074,17z/data=!3m1!4b1!4m6!3m5!1s0x317527c3debb5aad:0x5fb58956eb4194d0!8m2!3d10.8550427!4d106.785373!16s%2Fg%2F11h2qmtmp7?entry=ttu&g_ep=EgoyMDI0MTEyNC4xIKXMDSoASAFQAw%3D%3D", "_blank");
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
                <a href="/gioi-thieu" className="text-gray-200 hover:text-white transition">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="/tuyen-dung" className="text-gray-200 hover:text-white transition">
                  Tuyển dụng
                </a>
              </li>
              <li>
                <a href="/tin-tuc" className="text-gray-200 hover:text-white transition">
                  Tin tức
                </a>
              </li>
              
            </ul>
          </div>

          {/* Address and Map */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Địa chỉ cửa hàng</h3>
            <p className="mb-4 text-gray-300">
            10/80c Song Hành Xa Lộ Hà Nội, Phường Tân Phú, Quận 9, Hồ Chí Minh. 
            </p>
            <p className="mb-4 text-gray-300">
            MUA NGAY tại cửa hàng để nhận nhiều ưu đãi hấp dẫn!
            </p>
            <button
              onClick={handleViewOnMap}
              className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition flex items-center space-x-2"
            >
              <FaMapMarkerAlt />
              <span>Xem trên bản đồ</span>
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
