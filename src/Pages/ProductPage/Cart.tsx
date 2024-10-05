import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa"; // Trash icon for delete action
import { useNavigate } from "react-router-dom"; // Using useNavigate instead of useHistory

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

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("/v2/api/Product/GetAllSessions");
        console.log("API Response:", response.data); 
        const data = response.data.data; 
        if (Array.isArray(data)) {
          setCartItems(data);
        } else {
          console.error("Data is not an array:", data);
          setCartItems([]); 
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    fetchCartItems();
  }, []);

  const handleQuantityChange = (productId: number, change: number) => {
    const updatedItems = cartItems.map((item) =>
      item.productId === productId
        ? {
            ...item,
            Quantity: Math.max(item.quantity + change, 1), 
          }
        : item
    );
    setCartItems(updatedItems);
  };

  const handleRemoveFromCart = async (productId: number) => {
    try {
      await axios.delete(`/v2/api/Product/Remove/${productId}`);
      setCartItems(cartItems.filter((item) => item.productId !== productId));
      alert("Product removed from cart!");
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cartItems.length > 0) {
      navigate("/checkout");
    } else {
      alert("No items in cart");
    }
  };

  if (cartItems.length === 0) {
    return <div className="text-center text-2xl text-gray-700">Your cart is empty</div>;
  }

  if (cartItems.length === 0) {
    return <div className="text-center text-2xl text-gray-700">Your cart is empty</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <table className="w-full text-left border-separate border-spacing-4 table-auto">
        <thead>
          <tr className="text-black-500">
            <th className="w-1/2 text-left">Product</th>
            <th className="w-1/6 text-center">Unit Price</th>
            <th className="w-1/6 text-center">Quantity</th>
            <th className="w-1/6 text-center">Total Price</th>
            <th className="w-1/6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.productId} className="border-b">
              <td className="flex items-center space-x-4">
                <img src={item.image} alt={item.productName} className="w-24 h-24 rounded-lg" />
                <div>
                  <h2 className="text-lg font-semibold">{item.productName}</h2>
                </div>
              </td>
              <td className="text-center text-lg text-gray-800">${item.price.toFixed(2)}</td>
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
              <td className="text-center text-lg text-gray-800">${(item.price * item.quantity).toFixed(2)}</td>
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
          <a href="#" className="text-blue-600 hover:underline">View all shop vouchers</a>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-semibold">
            Total Amount: <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
          </div>
          <div className="mt-1">
            <button
              className="px-6 py-3 bg-green-500 text-white text-xl rounded-lg shadow-md hover:bg-green-600 transition-colors"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Cart;
