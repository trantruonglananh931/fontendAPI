import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../Context/useAuth";
import { CartItem, CartItem_ } from "../../../Models/CartItem";
import { NewOrder } from "../../../Models/OrderItem";
import Navbar from "../../../Components/Navbar/Navbar";

const Checkout: React.FC = () => {
  const [address, setAddress] = useState<string>(""); 
  const [phone, setPhone] = useState<string>(""); 
  const [paymentMethodId, setPaymentMethodId] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = user?.token;
  const location = useLocation();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Vui lòng đăng nhập để tiếp tục.");
          return;
        }

        const response = await axios.get("/v3/api/user/GetCurrentUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status) {
          const data = response.data.data;
          setPhone(data.phone || ""); 
          setAddress(data.address || ""); 
        } else {
          setError("Không thể tải thông tin người dùng.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        setError("Đã xảy ra lỗi khi lấy thông tin người dùng.");
      }
    };

    fetchUserData();
  }, []);

  // Lấy sản phẩm đã chọn từ state
  useEffect(() => {
    const selectedCartItems = location.state?.selectedCartItems || [];
    setSelectedItems(selectedCartItems);
  }, [location.state]);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      for (const product of selectedItems) {
        const sizeDetail = product.sizeDetails.find(
          (detail) => detail.sizeName === product.selectedSize
        );

        const cartItem: CartItem_ = {
          productId: String(product.productId),
          quantity: product.quantity,
          price: product.price,
          sizeId: sizeDetail?.sizeId || 0,
        };

        try {
          await axios.post("/v2/api/Product/sessions", cartItem, {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "*/*",
            },
          });
        } catch (error) {
          console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
          alert(`Không thể thêm sản phẩm ${product.productName} vào giỏ hàng.`);
        }
      }

      const newOrder: NewOrder = {
        address,
        phone, 
        methodOfPaymentId: paymentMethodId,
        stateOrderId: 1,
        stateTransportId: 1,
        
      };

      const response = await axios.post("/v5/Api/Order", newOrder, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Payload gửi đến API:", newOrder);

      if (response.data.status || response.data.Status) {
        const updatedCart = (JSON.parse(localStorage.getItem("cart") || "[]") as CartItem[]).filter(
          (item) => !selectedItems.some((selected) => selected.productId === item.productId)
        );

        localStorage.setItem("cart", JSON.stringify(updatedCart));

        alert("Đặt hàng thành công!");
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
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-sm mt-2 mb-2">
        <h3 className="text-2xl text-center font-semibold mb-2">THANH TOÁN ĐƠN HÀNG </h3>
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

        <div className="flex justify-between font-bold text-xl mb-2">
          <span></span>
          <span>Tổng tiền : {calculateTotal()}đ</span>
        </div>

        <div className="mb-2">
        <div className="flex justify-between items-center mb-2">
          <label className="text-lg">Số điện thoại :</label>
          <p
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate(`/user/updateadpadp/${user?.userName}`)}
          >
            Cập nhật thông tin
          </p>
        </div>
        <textarea
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={phone}
          onChange={(e) => setPhone(e.target.value)} 
          required
        />
      </div>

        <div className="mb-2">
        <div className="flex justify-between items-center mb-2">
          <label className="text-lg">Địa chỉ giao hàng:</label>
         
        </div>
        <textarea
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={address}
          onChange={(e) => setAddress(e.target.value)} 
          required
        />
      </div>



      <div className="container mx-auto pb-4">
      <div className="mb-4">
        <label className="block text-lg mb-2">Phương thức thanh toán:</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={paymentMethodId}
          onChange={(e) => setPaymentMethodId(Number(e.target.value))}
        >
          <option value={1}>Thanh toán khi nhận hàng</option>
          <option value={2}>Chuyển khoản</option>
        </select>
      </div>

      {paymentMethodId === 2 && (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Thông tin chuyển khoản</h2>
          <p className="mb-2">
            <strong>Ngân hàng:</strong> Vietcombank
          </p>
          <p className="mb-2">
            <strong>Số tài khoản:</strong> 0123456789
          </p>
          <p className="mb-2">
            <strong>Chủ tài khoản:</strong> Nguyễn Văn A
          </p>
          <p className="text-sm text-gray-600">
            Vui lòng ghi rõ nội dung chuyển khoản: <strong>[Sđt + Địa chỉ]</strong>
          </p>
          <p className="text-sm text-gray-600">
            Đơn hàng sẽ được xác nhận trong vòng từ 1 giờ đến 3 giờ . Thời gian làm việc từ 8:00 - 20:00 hàng ngày. 
          </p>
          <p className="text-sm text-gray-600">
            Mọi thắc mắc xin liên lạc hoặc nhắn tin <strong>Zalo : 03266389248</strong> 
          </p>
        </div>
      )}

      {paymentMethodId === 1 && (
        <div className="mt-4 p-4 bg-green-50 border border-green-300 rounded-lg">
          <p className="text-lg">
            Bạn đã chọn phương thức <strong>Thanh toán khi nhận hàng</strong>. Đơn hàng sẽ được giao đến địa chỉ của bạn và bạn sẽ thanh toán trực tiếp cho nhân viên giao hàng.
          </p>
        </div>
      )}
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
