import React, { useEffect, useState, useCallback } from "react"; 
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

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get("/v5/Api/Order");
      const data = response.data.status ? response.data.data : [];
      setOrders(data);
    } catch {
      setError("Đã xảy ra lỗi khi tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const changeOrderStatus = async (orderId: string, newStatusId: number) => {
    try {
      await axios.get(`/v5/Api/Order/ChangeOrderStatus`, {
        params: {
          Id: orderId,
          OrderStatusId: newStatusId,
        },
      });
     
      fetchOrders(); 
      // Cập nhật lại danh sách đơn hàng
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, stateOrder: newStatusId.toString()} : order 
      );
      setOrders(updatedOrders);
      
    } catch (error) {
      alert("Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.");
      console.error(error);
    }
    
  };

  const headers = [
    "ID đơn hàng",
    "Thời gian",
    "Giá tiền",
    "Sđt",
    "Địa chỉ",
    "Trạng thái",
    "",
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
                <td className="py-4 px-4">{order.phone}</td>
                <td className="py-4 px-4">{order.address}</td>
                <td className="py-4 px-4">{order.stateOrder}</td>
                <td className="py-4 px-4">
                {/* Cập nhật trạng thái đơn hàng */}
                {order.stateOrder === "Hủy đơn hàng" ? (
                  <button className="px-4 py-2 bg-gray-500 text-white cursor-not-allowed" disabled>
                    Đã bị hủy
                  </button>
                ) : order.stateOrder === "Đang xác nhận" || order.stateOrder === "Đã xác nhận" ? (
                  <>
                    <button
                      className="px-2 py-2 bg-red-500 text-white"
                      onClick={() => changeOrderStatus(order.id, 5)}
                    >
                      Hủy
                    </button>
                  </>
                ) : order.stateOrder === "Đang vận chuyển" ? (
                  <button
                    className="px-2 py-2 bg-green-500 text-white"
                    onClick={() => changeOrderStatus(order.id, 4)}
                  >
                    Đã nhận hàng
                  </button>
                ) : (
                  order.stateOrder === "4" && (
                    <button className="px-4 py-2 bg-gray-500 text-white cursor-not-allowed" disabled>
                      Đã nhận hàng
                    </button>
                  )
                )}
              </td>

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
