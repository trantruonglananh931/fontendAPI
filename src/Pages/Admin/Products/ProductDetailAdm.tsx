import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../Context/useAuth";
import { Product } from "../../../Models/Product";
import Navbar from "../../../Components/Navbar/Navbar";

const AdminProductAdm: React.FC<{ id1: string }> = ({ id1 }) => {
  const id = id1;
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
    return <div className="flex justify-center items-center min-h-screen text-lg font-semibold">Đang tải...</div>;
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen">

      <div className="container mx-auto p-2">
        <div className="bg-white shadow-md rounded-sm text-black p-6">
          <h1 className="text-3xl font-bold  mb-4">Thông tin sản phẩm : {product.productName}</h1>
          <p className="text-xl mb-4">Mô tả : {product.description}</p>
          <p className="text-xl mb-4">Danh mục : {product.categoryName}</p>
          <p className="text-xl mb-4">Giá : {product.price}đ</p>

          <div className="mt-2">
            <h2 className="text-xl text-gray-700 mb-2">Hình ảnh sản phẩm : </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.listStringImage?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Hình ảnh sản phẩm ${index + 1}`}
                  className="w-46 rounded-sm shadow-lg "
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Kích thước & số lượng</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-7 ">
              {product.sizeDetails?.map((sizeDetail, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-sm shadow-md text-center">
                  <p className="text-l font-semibold text-gray-800">{sizeDetail.sizeName}</p>
                  <p className="text-sm text-gray-600">Còn {sizeDetail.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Danh sách bình luận</h2>
            <div className="space-y-6">
              {product.messageDetails?.map((messageDetail, index) => (
                <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-md">
                  <p className="font-semibold text-gray-800">{messageDetail.userName}</p>
                  <p className="text-sm text-gray-500">{new Date(messageDetail.time).toLocaleString()}</p>
                  <p className="text-gray-700 mt-2">{messageDetail.message}</p>
                  {messageDetail.image && (
                    <img
                      src={messageDetail.image}
                      alt={messageDetail.userName}
                      className="w-24 h-24 object-cover rounded-md mt-4"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductAdm;
