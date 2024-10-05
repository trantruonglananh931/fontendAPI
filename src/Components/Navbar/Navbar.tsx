import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./logo.png";
import { useAuth } from "../../Context/useAuth";
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa'; 

interface Props {}

const Navbar: React.FC<Props> = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0); // Giả sử giỏ hàng có số lượng
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };


  return (
    <nav className="relative container mx-auto p-6">
      <div className="flex items-center text-xl justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/product">
            <img src={logo} alt="Logo" className="h-8" />
          </Link>

          <div className="flex space-x-6">
            <Link to="/product" className="hover:text-blue-600">
              Product
            </Link>
            <Link to="/category" className="hover:text-blue-600">
              Category
            </Link>
            <Link to="/user" className="hover:text-blue-600">
              User
            </Link>
          </div>
          <form onSubmit={handleSearch} className="flex flex-grow items-center">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
            />
          </form>
        </div>

        <div className="flex items-center space-x-6">
          {/* Thêm biểu tượng giỏ hàng */}
          <div className="relative">
            <Link to="/cart" className="hover:text-blue-600">
              <FaShoppingCart className="text-2xl" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 text-xs bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {isLoggedIn() ? (
            <div className="hidden lg:flex items-center space-x-6 text-gray-700">
              <div className="hover:text-blue-600">Welcome, {user?.userName}</div>
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)}>
                  <FaUserCircle className="text-2xl hover:text-blue-600" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border rounded-lg shadow-lg z-10 text-lg">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link to="/change-password" className="block px-4 py-2 hover:bg-gray-100">
                      Change Password
                    </Link>
                    <Link to="/history-orders" className="block px-4 py-2 hover:bg-gray-100">
                      History Orders
                    </Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex items-center space-x-6 text-gray-700">
              <Link to="/login" className="hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/register"
                className="px-8 py-3 font-bold rounded text-white bg-green-500 hover:bg-green-600"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
