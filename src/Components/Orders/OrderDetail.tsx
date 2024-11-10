// src/components/OrderDetail.tsx
import React from 'react';
import { OrderDetailItem } from '../../Models/OrderItem';

interface OrderDetailProps {
  orderDetails: OrderDetailItem[];
  closeDetails: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ orderDetails, closeDetails }) => {
  return (
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
        <h3 className="text-2xl font-semibold mb-4">Chi tiết đơn hàng</h3>
        <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr className="text-gray-700">
              <th className="py-3 px-4">Tên sản phẩm</th>
              <th className="py-2 px-4">Số lượng</th>
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
  );
};

export default OrderDetail;
