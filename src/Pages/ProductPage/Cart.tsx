import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type CartItem = {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  image: string;
};

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  const saveCartToLocalStorage = (items: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (storedCart.length > 0) {
      setCartItems(storedCart);
    } else {
      const fetchCartItems = async () => {
        try {
          const response = await axios.get("/v2/api/Product/GetAllSessions");
          const data = response.data.data;
          if (Array.isArray(data)) {
            setCartItems(data);
            saveCartToLocalStorage(data);
          } else {
            console.error("Dữ liệu không phải là một mảng:", data);
            setCartItems([]);
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error);
        }
      };
      fetchCartItems();
    }
  }, []);

  const handleQuantityChange = (productId: number, change: number) => {
    const updatedItems = cartItems.map((item) =>
      item.productId === productId
        ? { ...item, quantity: Math.max(item.quantity + change, 1) }
        : item
    );
    setCartItems(updatedItems);
    saveCartToLocalStorage(updatedItems);
  };

  const handleRemoveFromCart = async (productId: number) => {
    try {
      await axios.delete(`/v2/api/Product/Remove/${productId}`);
      
      const updatedItems = cartItems.filter((item) => item.productId !== productId);
      setCartItems(updatedItems);
      
      saveCartToLocalStorage(updatedItems); 
      
      alert("Sản phẩm đã được xóa khỏi giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    }
  };

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cartItems.length > 0) {
      navigate("/checkout", { state: { totalAmount } });
    } else {
      alert("Không có sản phẩm trong giỏ hàng");
    }
  };

  if (cartItems.length === 0) {
    return <div className="text-center text-2xl text-gray-700">Giỏ hàng của bạn đang trống</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto p-6 bg-white">
      <table className="w-full text-left border-separate border-spacing-4 table-auto">
        <thead>
          <tr className="text-black-500">
            <th className="w-1/2 text-left">Sản phẩm</th>
            <th className="w-1/6 text-center">Giá bán</th>
            <th className="w-1/6 text-center">Số lượng</th>
            <th className="w-1/6 text-center">Tổng giá</th>
            <th className="w-1/6 text-center"></th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.productId} className="border-b">
              <td className="flex items-center space-x-4">
                <img src={item.image} alt={item.productName} className="w-28 h-32 rounded-lg" />
                <div>
                  <h2 className="text-lg font-semibold">{item.productName}</h2>
                </div>
              </td>
              <td className="text-center text-lg text-gray-800">{item.price}đ</td>
              <td className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.productId, -1)}
                    className="px-2 py-1 bg-gray-300 rounded-lg"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.productId, 1)}
                    className="px-2 py-1 bg-gray-300 rounded-lg"
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="text-center text-lg text-gray-800">{(item.price * item.quantity)}đ</td>
              <td className="text-center">
                <button
                  onClick={() => handleRemoveFromCart(item.productId)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-lg font-medium">
          <a href="#" className="text-blue-600 hover:underline">Xem tất cả voucher</a>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-semibold">
            Tổng giá trị: <span className="text-blue-600">{totalAmount}đ</span>
          </div>
          <div className="mt-1">
            <button
              className="px-6 py-3 bg-green-500 text-white text-xl rounded-lg shadow-md hover:bg-green-600 transition-colors"
              onClick={handleCheckout}
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
