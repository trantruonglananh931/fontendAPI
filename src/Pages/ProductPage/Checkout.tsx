import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

type CartItem = {
  productId: number;
  productName: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
};

type NewOrder = {
  address: string;
  methodOfPaymentId: number;
  stateOrderId: number;
  stateTransportId: number;
};

const Checkout: React.FC = () => {
  const [address, setAddress] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); 

  const fetchCartItems = async () => {
    try {
      const response = await axios.get("/v2/api/Product/GetAllSessions");
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

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null); 

    try {
      const newOrder: NewOrder = {
        address,
        methodOfPaymentId: paymentMethodId,
        stateOrderId: 1,
        stateTransportId: 1,
      };

      const response = await axios.post("/v5/Api/Order", newOrder, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.status || response.data.Status) { 
        alert("Order created successfully!");
        navigate("/history-orders"); 
      } else {
        setError(response.data.message || "Failed to create order.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      setError("An error occurred during checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Hiển thị giỏ hàng */}
      <h3 className="text-xl font-semibold mb-2">Shopping Cart</h3>
      <div className="mb-4">
        {cartItems.map((item) => (
          <div key={item.productId} className="flex justify-between items-center mb-2">
            <div>
              <img src={item.image} alt={item.productName} className="w-20 h-24 mr-4" />
              <span>{item.productName} (x{item.quantity})</span>
            </div>
            <span>${item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between font-bold mb-4">
        <span>Total:</span>
        <span>${calculateTotal()}</span>
      </div>

      <div className="mb-4">
        <label className="block text-lg mb-2">Shipping Address:</label>
        <textarea
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-lg mb-2">Payment Method:</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={paymentMethodId}
          onChange={(e) => setPaymentMethodId(Number(e.target.value))}
        >
          <option value={1}>Credit Card</option>
          <option value={2}>PayPal</option>
        </select>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        className="px-6 py-3 bg-green-500 text-white text-xl rounded-lg shadow-md hover:bg-green-600 transition-colors"
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
};

export default Checkout;
