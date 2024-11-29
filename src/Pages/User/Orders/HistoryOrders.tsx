import React, { useEffect, useState } from "react";
import axios from "axios";
import { OrderItem, OrderDetailItem } from "../../../Models/OrderItem";
import Table from "../../../Components/Table/Table";
import { FaEye } from "react-icons/fa"; 
import OrderDetail from "../../../Components/Orders/OrderDetail";
import Navbar from "../../../Components/Navbar/Navbar";

const HistoryOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetailItem[]>([]);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/v5/Api/Order");
        setOrders(response.data.status ? response.data.data : []);
      } catch {
        setError("Có lỗi xảy ra khi tải danh sách đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const headers = [
    "ID đơn hàng",
    "Thời gian đặt hàng",
    "Tổng tiền",
    "Số điện thoại, địa chỉ",
    "Trạng thái",

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
      setError("Có lỗi xảy ra khi tải chi tiết đơn hàng.");
    }
  };

  const closeDetails = () => {
    setShowDetails(false);
    setOrderDetails([]);
  };

  return (
    <div className="w-full">
      <Navbar />
      {loading ? (
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
                <td className="py-4 px-4">{order.id}</td>
                <td className="py-4 px-4">{new Date(order.date).toLocaleString()}</td>
                <td className="py-4 px-4">{order.totalPrice}đ</td>
                <td className="py-4 px-4">{order.address}</td>
                <td className="py-4 px-4">{order.stateOrder}</td>
            
                <td className="py-4 px-4">
                  <button
                    className="text-blue-600 hover:text-blue-700 transition duration-200"
                    onClick={() => fetchOrderDetails(order.id)}
                  >
                    <FaEye size={20} /> {/* Icon mắt */}
                  </button>
                </td>
              </>
            )}
            emptyMessage="Bạn chưa có đơn hàng nào."
          />
          {showDetails && <OrderDetail orderDetails={orderDetails} closeDetails={closeDetails} />}
        </>
      )}
    </div>
  );
};

export default HistoryOrders;
