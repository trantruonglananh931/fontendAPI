import React, { useEffect, useState } from "react";
import axios from "axios";

type OrderItem = {
  id: number;
  date: string;
  totalPrice: number;
  address: string;
  stateOrder: string;
  stateTransport: string;
};

type OrderDetailItem = {
  quantity: number;
  price: number;
  productName: string;
};

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
        console.log("Dữ liệu phản hồi:", response.data);
        if (response.data.status) {
          setOrders(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải danh sách đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const fetchOrderDetails = async (Id: number) => {
    try {
      const response = await axios.get(`/v5/Api/Order/${Id}`);
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

  if (loading) return <div className="text-center text-xl">Đang tải...</div>;
  if (error) return <div className="text-red-500 text-center text-lg">{error}</div>;

  return (
    <div className="max-w-screen-xl mx-auto p-6 bg-white ">
      {orders.length === 0 ? (
        <div className="text-center text-lg text-gray-600">Bạn chưa có đơn hàng nào.</div>
      ) : (
        <table className="w-full text-left border border-gray-200  overflow-hidden">
          <thead className="bg-gray-100">
            <tr className="text-gray-700">
              <th className="py-3 px-4">ID Đơn Hàng</th>
              <th className="py-3 px-4">Ngày Đặt Hàng</th>
              <th className="py-3 px-4">Tổng Giá</th>
              <th className="py-3 px-4">Địa Chỉ</th>
              <th className="py-3 px-4">Trạng Thái Đơn</th>
              <th className="py-3 px-4">Trạng Thái Vận Chuyển</th>
              <th className="py-3 px-4">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4 text-gray-800">{order.id}</td>
                <td className="py-4 px-4 text-gray-800">{new Date(order.date).toLocaleString()}</td>
                <td className="py-4 px-4 text-gray-800">{order.totalPrice}đ</td>
                <td className="py-4 px-4 text-gray-800">{order.address}</td>
                <td className="py-4 px-4 text-gray-800">{order.stateOrder}</td>
                <td className="py-4 px-4 text-gray-800">{order.stateTransport}</td>
                <td className="py-4 px-4">
                  <button
                    className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition duration-200"
                    onClick={() => fetchOrderDetails(order.id)}
                  >
                    Chi Tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showDetails && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition duration-200"
              onClick={closeDetails}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-2xl font-semibold mb-4">Chi Tiết Đơn Hàng</h3>
            <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr className="text-gray-700">
                  <th className="py-3 px-4">Tên Sản Phẩm</th>
                  <th className="py-3 px-4">Số Lượng</th>
                  <th className="py-3 px-4">Giá</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.map((detail, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-800">{detail.productName}</td>
                    <td className="py-4 px-4 text-gray-800">{detail.quantity}</td>
                    <td className="py-4 px-4 text-gray-800">{detail.price}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryOrders;
