import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F5F5F5] text-[#7F817F] py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Dịch vụ khách hàng */}
          <div>
            <h3 className="text-lg font-bold mb-4">Dịch vụ khách hàng</h3>
            <ul className="space-y-2">
              <li>Chính sách khách hàng thân thiết</li>
              <li>Chính sách đổi trả</li>
              <li>Chính sách bảo mật</li>
              <li>Chính sách sử dụng Cookies</li>
              <li>Chính sách thanh toán, giao nhận</li>
              <li>Chính sách đơn đồng phục</li>
              <li>Hướng dẫn chọn size</li>
              <li>Đăng ký đối tác</li>
            </ul>
          </div>

          {/* Về YODY */}
          <div>
            <h3 className="text-lg font-bold mb-4">Về YODY</h3>
            <ul className="space-y-2">
              <li>Giới thiệu</li>
              <li>Liên hệ</li>
              <li>Tuyển dụng</li>
              <li>Tin tức</li>
              <li>Hệ thống cửa hàng</li>
              <li>Tin khuyến mãi</li>
            </ul>
          </div>

          {/* Địa chỉ liên hệ */}
          <div>
            <h3 className="text-lg font-bold mb-4">YODY lắng nghe bạn</h3>
            <p className="mb-4">
              Chúng tôi luôn trân trọng và mong đợi nhận được mọi ý kiến đóng góp từ khách hàng để có thể nâng cấp trải nghiệm dịch vụ và sản phẩm tốt hơn nữa.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FaPhone />
                <span>Liên hệ đặt hàng: 024 999 86 999</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaPhone />
                <span>Góp ý khiếu nại: 1800 2086</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope />
                <span>Email: chamsockhachhang@yody.vn</span>
              </div>
            </div>
            {/* Social media icons */}
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
        </div>

        {/* Company Information */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p>© CÔNG TY CỔ PHẦN THỜI TRANG YODY</p>
          <p>Mã số doanh nghiệp: 0801206940. Giấy chứng nhận đăng ký doanh nghiệp do Sở Kế hoạch và Đầu tư TP Hải Dương cấp lần đầu ngày 04/03/2017</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
