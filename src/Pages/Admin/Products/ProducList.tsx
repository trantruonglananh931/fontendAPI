import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Product } from "../../../Models/Product";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/v2/api/Product");
        if (response.data && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa?");
    if (!isConfirmed) return;

    try {
      await axios.delete(`/v2/api/Product/${id}`);
      setProducts(products.filter((product) => product.id !== id));
      alert("Xóa sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert("Xóa sản phẩm thất bại.");
    }
  };

  const handleDetail = (id: string) => {
    navigate(`/product/${id}`);
  };

  const handleUpdate = (id: string) => {
    navigate(`/product/update/${id}`);
  };

  const handleAddNewProduct = () => {
    navigate("/product/add");
  };

  return (
    <div>
      <button onClick={handleAddNewProduct} className="bg-green-500 text-white py-2 px-4 rounded-sm hover:bg-green-600 mb-4">
        Thêm sản phẩm mới
      </button>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Mã sản phẩm</th>
            <th className="py-2 px-4 border">Tên sản phẩm</th>
            <th className="py-2 px-4 border">Giá</th>
            <th className="py-2 px-4 border">Xem trước</th>
            <th className="py-2 px-4 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id} onClick={() => handleDetail(product.id)} className="cursor-pointer">
                <td className="py-2 px-4 border">{product.id}</td>
                <td className="py-2 px-4 border">{product.productName}</td>
                <td className="py-2 px-4 border">{product.price}đ</td>
                <td className="py-2 px-4 border">
                  <img src={product.image} alt={product.productName} className="w-16 h-16 object-cover" />
                </td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdate(product.id);
                    }}
                    className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 mr-2"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(product.id);
                    }}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4">
                Không tìm thấy sản phẩm nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
