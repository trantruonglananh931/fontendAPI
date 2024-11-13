import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../../../Models/CartItem";
import Navbar from "../../../Components/Navbar/Navbar";


const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  const saveCartToLocalStorage = (items: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");

      if (storedCart.length > 0) {
        setCartItems(storedCart);
      } else {
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
      }
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = (productId: string, change: number) => {
    const updatedItems = cartItems.map((item) =>
      item.productId === productId
        ? { ...item, quantity: Math.max(item.quantity + change, 1) }
        : item
    );

    setCartItems(updatedItems);
    saveCartToLocalStorage(updatedItems);
  };

  const handleRemoveFromCart = (productId: string) => {
    const updatedItems = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updatedItems);
    saveCartToLocalStorage(updatedItems);
    alert("Sản phẩm đã được xóa khỏi giỏ hàng!");
  };

  const handleSelectItem = (productId: string) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.productId));
    }
    setSelectAll(!selectAll);
  };

  const handleCheckout = () => {
    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.includes(item.productId)
    );

    if (selectedCartItems.length > 0) {
      navigate("/checkout", { state: { selectedCartItems } });
    } else {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
    }
  };

  const totalAmount = cartItems
    .filter((item) => selectedItems.includes(item.productId))
    .reduce((total, item) => total + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return <div className="text-center text-2xl text-gray-700 p-4">Giỏ hàng của bạn đang trống</div>;
  }

  return (
    <div className="w-full">
      <Navbar/>
    <div className="max-w-screen-xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      
      <table className="w-full text-left border-separate border-spacing-4 table-auto">
        <thead className="">
          <tr className="text-gray-700">
            <th className="w-1/12 text-center">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
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
              <td className="text-center">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.productId)}
                  onChange={() => handleSelectItem(item.productId)}
                />
              </td>
              <td className="flex items-center space-x-4 py-4">
                <img src={item.image} alt={item.productName} className="w-28 h-32" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{item.productName}</h2>
                </div>
              </td>
              <td className="text-center text-lg text-gray-800">{item.price}đ</td>
              <td className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.productId, -1)}
                    className="px-3 py-1 bg-gray-300 rounded-lg transition hover:bg-gray-400"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 text-lg font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.productId, 1)}
                    className="px-3 py-1 bg-gray-300 rounded-lg transition hover:bg-gray-400"
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="text-center text-lg text-gray-800">{item.price * item.quantity}đ</td>
              <td className="text-center">
                <button
                  onClick={() => handleRemoveFromCart(item.productId)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end items-center mt-6 border-t pt-4 space-x-4">
        <div className="text-xl font-bold text-green-500">Tổng cộng: {totalAmount}đ</div>
        <button
          onClick={handleCheckout}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all"
        >
          Thanh toán
        </button>
      </div>

    </div>
    </div>
  );
  
};

export default Cart;
