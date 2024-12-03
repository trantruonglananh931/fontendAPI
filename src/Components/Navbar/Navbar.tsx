import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "./logo.png";
import { useAuth } from "../../Context/useAuth";
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa'; 
import { FaFacebook, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

interface Props {}

const Navbar: React.FC<Props> = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      navigate("/product");
    } else {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    if (isLoggedIn()) {
      setMenuOpen(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!location.pathname.startsWith("/search")) {
      setSearchQuery(""); 
    }
  }, [location.pathname]);

  return (
    <nav className="relative w-full p-2 bg-green-500 shadow-md sticky top-0 z-50 px-32 text-white">
      <div className="flex items-center text-lg justify-between"> 
        <div className="flex items-center space-x-6">
          <Link to="/product">
            <img src={logo} alt="Logo" className="h-14" />
          </Link>
          
          

          <div>
            <p>Liên hệ chúng tôi</p>
            <div className="flex space-x-4 ">
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
          <Link to="/ai1">
            Gợi ý trang phục
          </Link>
          <div className="flex space-x-6">
            <Link to="/product" className="hover:text-blue-600 font-extrabold text-white"></Link>
          </div>
        </div>

        <div>
        <form onSubmit={handleSearch} className="flex flex-grow items-center text-black">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 mr-16 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
            />
          </form>
          
        </div>


        <div className="flex items-center space-x-6">
          {isLoggedIn() && ( 
            <div className="relative">
              <Link to="/cart" className="hover:text-blue-600 flex items-center">
                <FaShoppingCart className="text-2xl" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 text-xs bg-red-600 rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          )}

          {isLoggedIn() ? (
            <div className="hidden lg:flex items-center space-x-6">
              <div className="relative flex items-start">
                <button onClick={() => setMenuOpen(!menuOpen)}>
                  <FaUserCircle className="text-2xl hover:text-blue-600" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white text-green-700 border rounded-lg shadow-lg z-10 text-lg">
                    <Link to={`/user/${user?.userName}`} className="block px-4 py-2 hover:bg-gray-100">
                      Hồ sơ
                    </Link>
                    <Link to={`/user/update/${user?.userName}`} className="block px-4 py-2 hover:bg-gray-100">
                      Cập nhật hồ sơ
                    </Link>
                    <Link to="/change-password" className="block px-4 py-2 hover:bg-gray-100">
                      Đổi mật khẩu
                    </Link>
                    <Link to="/history-orders" className="block px-4 py-2 hover:bg-gray-100">
                      Lịch sử đơn hàng
                    </Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex items-center space-x-6 font-bold text-white">
              <Link to="/login" className="hover:text-blue-600">Đăng nhập</Link>
              <Link to="/register" className="px-5 py-2 font-bold rounded text-white bg-blue-500 hover:bg-blue-600">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
