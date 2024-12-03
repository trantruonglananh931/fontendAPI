import React, { useEffect, useState } from "react";
import axios from "axios";
import { OrderItem, OrderDetailItem } from "../../Models/OrderItem";
import Table from "../../Components/Table/Table";
import OrderDetail from "../../Components/Orders/OrderDetail";
import { FaEye } from "react-icons/fa"; 
import { useAuth } from "../../Context/useAuth";
import { useNavigate } from "react-router-dom";

const AllOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetailItem[]>([]);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const { user } = useAuth(); // Access user info from context
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "Admin") {
      navigate("/product"); // Or redirect to any other page you prefer
    }
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/v5/Api/Order/Admin");
        setOrders(response.data.status ? response.data.data : []);
      } catch {
        setError("Đã xảy ra lỗi khi tải danh sách đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const headers = [
    "Mã đơn hàng",
    "Ngày đặt hàng",
    "Giá tiền",
    "Số điện thoại, địa chỉ",
    "Trạng thái đơn hàng",

    "Phương thức thanh toán",
    ""
  ];

  const fetchOrderDetails = async (id: string) => {
    try {
      const response = await axios.get(`/v5/Api/Order/${id}`);
      if (response.data.status) {
        setOrderDetails(response.data.data);
        setShowDetails(true);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi tải chi tiết đơn hàng.");
    }
  };

  const closeDetails = () => {
    setShowDetails(false);
    setOrderDetails([]);
  };

  return loading ? (
    <div className="text-center text-xl">Đang tải...</div>
  ) : error ? (
    <div className="text-red-500 text-center text-lg">{error}</div>
  ) : (
    <>
      <Table<OrderItem>
        headers={headers}
        data={orders}
        renderRow={(order: OrderItem) => (
          <>
            <td className="py-2 px-2">{order.id}</td>
            <td className="py-2 px-2">{new Date(order.date).toLocaleString()}</td>
            <td className="py-2 px-2">{order.totalPrice}đ</td>
            <td className="py-2 px-2">{order.address}</td>
            <td className="py-2 px-2">{order.stateOrder}</td>
    
            <td className="py-2 px-2">{order.methodOfPayment}</td>
            <td className="py-2 px-2">
              <button
                className="text-blue-600 hover:text-blue-700 transition duration-200"
                onClick={() => fetchOrderDetails(order.id)}
              >
                <FaEye size={20} /> {/* Icon mắt */}
              </button>
            </td>
          </>
        )}
        emptyMessage="Không có đơn hàng nào."
      />
      {showDetails && <OrderDetail orderDetails={orderDetails} closeDetails={closeDetails} />}
    </>
  );
};

export default AllOrders;
