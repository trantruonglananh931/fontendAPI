import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import axios from "axios";
import { CartItem, CartItem_ } from "../../../Models/CartItem";
import { NewOrder } from "../../../Models/OrderItem";
import Navbar from "../../../Components/Navbar/Navbar";
const Checkout: React.FC = () => {
  const [address, setAddress] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); 
  const location = useLocation();

  useEffect(() => {
    const selectedCartItems = location.state?.selectedCartItems || [];
    setSelectedItems(selectedCartItems);
  }, [location.state]);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."; 
      for (const product of selectedItems) {
        const cartItem: CartItem_ = {
          ProductId: String(product.productId),
          productName: product.productName,
          price: product.price,
          Quantity: product.quantity,
        };
        try {
          await axios.post("/v2/api/Product/sessions", cartItem, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
          alert(`Không thể thêm sản phẩm ${product.productName} vào giỏ hàng.`);
        }
      }
  
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
        // Xóa các sản phẩm đã chọn khỏi giỏ hàng trong localStorage
        const updatedCart = (JSON.parse(localStorage.getItem("cart") || "[]") as CartItem[]).filter(
          (item) => !selectedItems.some((selected) => selected.productId === item.productId)
        );
        
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        
        alert("Đơn hàng đã được tạo thành công!");
        navigate("/history-orders");
      } else {
        setError(response.data.message || "Không thể tạo đơn hàng.");
      }
    } catch (error) {
      console.error("Lỗi trong quá trình thanh toán:", error);
      setError("Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="w-full">
      <Navbar/>
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h3 className="text-xl font-semibold mb-2">Sản phẩm đã chọn</h3>
      <div className="mb-4">
        {selectedItems.map((item) => (
          <div key={item.productId} className="flex justify-between items-center mb-2">
            <div>
              <img src={item.image} alt={item.productName} className="w-20 h-24 mr-4" />
              <span>{item.productName} (x{item.quantity})</span>
            </div>
            <span>{item.price * item.quantity}đ</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between font-bold mb-4">
        <span>Tổng cộng:</span>
        <span>{calculateTotal()}đ</span>
      </div>

      <div className="mb-4">
        <label className="block text-lg mb-2">Địa chỉ giao hàng:</label>
        <textarea
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-lg mb-2">Phương thức thanh toán:</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={paymentMethodId}
          onChange={(e) => setPaymentMethodId(Number(e.target.value))}
        >
          <option value={1}>Thanh toán khi nhận hàng</option>
          <option value={2}>PayPal</option>
        </select>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        className="px-6 py-3 bg-green-500 text-white text-xl rounded-lg shadow-md hover:bg-green-600 transition-colors"
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? "Đang xử lý..." : "Đặt hàng"}
      </button>
    </div>
    </div>
  );

};

export default Checkout;
