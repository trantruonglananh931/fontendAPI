import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../Context/useAuth";
import { Product } from "../../../Models/Product";
import Navbar from "../../../Components/Navbar/Navbar";

const AdminProductAdm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`/v2/api/Product/${id}`);
        setProduct(response.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };
    fetchProductDetail();
  }, [id]);

  if (!product) {
    return <div className="text-center">Đang tải...</div>;
  }

  return (
    <div className="w-full bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-screen-xl mx-auto p-8 bg-white mt-6">
        <h1 className="text-3xl font-sans text-gray-800 mb-4">{product.productName}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-red-600 text-2xl font-semibold mb-6">{product.price}đ</p>

        <div className="mt-6">
          <h2 className="text-2xl font-sans text-gray-700">Danh sách hình ảnh</h2>
          <div className="flex space-x-4 mt-4 overflow-x-auto">
            {product.listStringImage.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Hình ảnh sản phẩm ${index + 1}`}
                className="w-40 h-60 object-cover border border-gray-300 rounded-md shadow-md transform transition-transform hover:scale-105"
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-sans text-gray-700">Kích thước và số lượng</h2>
          <div className="grid grid-cols-7 gap-4 mt-4">
            {product.sizeDetails.map((sizeDetail, index) => (
              <div key={index} className="border rounded-md p-4 bg-gray-50 shadow-sm flex flex-col items-center">
                <p className="font-sans">{sizeDetail.sizeName}</p>
                <p className="text-gray-600">{sizeDetail.quantity} còn lại</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-sans text-gray-700">Danh sách bình luận</h2>
          {product.messageDetails?.map((messageDetail, index) => (
            <div key={index} className="border-b border-gray-300 mb-4 pb-2">
              <p className="font-sans text-gray-800">{messageDetail.userName}</p>
              <p className="text-sm text-gray-600">{new Date(messageDetail.time).toLocaleString()}</p>
              <p className="text-gray-700">{messageDetail.message}</p>
              {messageDetail.image && (
                <img
                  src={messageDetail.image}
                  alt={messageDetail.userName}
                  className="w-24 h-24 object-cover rounded-md mt-2"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProductAdm;
