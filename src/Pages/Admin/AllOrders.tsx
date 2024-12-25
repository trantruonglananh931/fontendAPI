import React, { useEffect, useState, useCallback } from "react"; 
import axios from "axios";
import { OrderItem, OrderDetailItem } from "../../Models/OrderItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
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
  const { user } = useAuth(); 
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get("/v5/Api/Order/Admin");
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
      alert("Trạng thái đơn hàng đã được cập nhật thành công!");
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
    "Mã đơn hàng",
    "Ngày đặt hàng",
    "Giá tiền",
    "Sđt",
    "Địa chỉ",
    "Thanh toán",
    "Trạng thái",
    "Thay đổi TT",
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
      <div className="max-w-screen-xl mx-auto bg-white shadow-md rounded-sm overflow-hidden mb-5 mt-5">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr className="text-gray-700">
                {headers.map((header, index) => (
                  <th key={index} className="border border-gray-300 p-2 text-left text-xs ">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className = "bg-white divide-y divide-gray-200 text-xs">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="text-center py-4 text-gray-600">
                    Đang tải...
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-100 transition duration-150">
                    <td className="border border-gray-300 p-2">{order.id}</td>
                    <td className="border border-gray-300 p-2">{new Date(order.date).toLocaleString()}</td>
                    <td className="border border-gray-300 p-2">{order.totalPrice}đ</td>
                    <td className="border border-gray-300 p-2">{order.phone}</td>
                    <td className="border border-gray-300 p-2">{order.address}</td>
                    <td className="border border-gray-300 p-2">{order.methodOfPayment}</td>
                    <td className="border border-gray-300 p-2">{order.stateOrder}</td>
                    
                    <td className="border border-gray-300 p-2 flex">
                     
                      {/* Cập nhật trạng thái đơn hàng */}
                      {order.stateOrder === "Hủy đơn hàng" ? (
                        <button className="px-1 py-1 bg-gray-500 text-white cursor-not-allowed" disabled>
                          Đã hủy
                        </button>
                      ) : order.stateOrder === "Đã xác nhận" ? (
                        <button 
                          className="px-1 py-1 bg-blue-500 text-white"
                          onClick={() => changeOrderStatus(order.id, 3)}
                        >
                          Đang giao
                        </button>
                      ) : order.stateOrder === "Đang giao hàng" ? (
                        <button className="px-4 py-2 bg-gray-500 text-white cursor-not-allowed" disabled>
                          Đang vận chuyển
                        </button>
                      ) : (
                        order.stateOrder === "Đang xác nhận" && (
                          <>
                            <button 
                              className="px-1 py-1 bg-blue-500 text-white"
                              onClick={() => changeOrderStatus(order.id, 2)}
                            >
                              Xác nhận
                            </button>
                            <button 
                              className="px-1 py-1 bg-red-500 text-white ml-2"
                              onClick={() => changeOrderStatus(order.id, 5)}
                            >
                              Hủy
                            </button>
                          </>
                        )
                      )}
                    </td>
                    <td className="border border-gray-300 p-2">
                    <button
                        className="text-blue-600 hover:text-blue-700 transition duration-200"
                        onClick={() => fetchOrderDetails(order.id)}
                      >
                      <FontAwesomeIcon icon={faEye}  /> {/* Icon mắt */}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showDetails && <OrderDetail orderDetails={orderDetails} closeDetails={closeDetails} />}
    </>
  );
};

export default AllOrders;
