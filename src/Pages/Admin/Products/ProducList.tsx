import React, { useEffect, useState } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Product } from "../../../Models/Product";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../Context/useAuth";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const token = user?.token;

  useEffect(() => {
    // Check if the user is an admin
    if (user?.role !== "Admin") {
      navigate("/product"); // Redirect to another page if not admin
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get('/v2/api/Product',{
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*',
          }
        });
        
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
  }, [user, navigate]); 

  const handleDelete = async (id: string, image: string, listStringImage?: string[]) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa?");
    if (!isConfirmed) return;
  
    try {
      // Xóa sản phẩm
      await axios.delete(`/v2/api/Product/${id}`);
  
      // Xóa hình ảnh chính
      const imageName = image.split('/').pop();
      console.log('imageName:', imageName);
      if (imageName) {
        await axios.delete(`/v2/api/images?imageName=${encodeURIComponent(imageName)}&isMainImage=true`);
      }
  
      // Xóa các hình ảnh phụ
      if (listStringImage && listStringImage.length > 0) {
        for (let img of listStringImage) {
          const imageNameInList = img.split('/').pop();
          const deleteImageResponse = await axios.delete(`/v2/api/images?imageName=${encodeURIComponent(imageNameInList!)}&isMainImage=false`);
        }
      }
  
      // Cập nhật lại danh sách sản phẩm
      setProducts(products.filter((product) => product.id !== id));
      alert("Xóa sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm hoặc hình ảnh:", error);
      alert("Xóa sản phẩm thất bại.");
    }
  };
  
  
  const handleDetail = (id: string) => {
    navigate(`/product/${id}`);
  };

  const handleUpdate = (id: string) => {
    navigate(`/admin/product/update/${id}`);
  };


  return (
    <div>
      <table className="min-w-full bg-white">
        <thead>
          <tr className=" bg-gray-100">
            <th className="w-2/12 py-2 px-2 border ">Mã sản phẩm</th>
            <th className="w-2/12 py-2 px-2 border ">Tên sản phẩm</th>
            <th className="w-2/12 py-2 px-2 border text-center">Giá</th>
            <th className="w-1/12 py-2 px-2 border text-center">Xem trước</th>
            <th className="w-2/12 py-2 px-2 border text-center">Số lượng đã bán</th>
            <th className="w-2/12 py-2 px-2 border text-center">Số lượng trong kho</th>
            <th className="w-2/12 py-2 px-2 border text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id} onClick={() => handleDetail(product.id)} className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer">
                <td className="w-2/12 py-2 px-2 border ">{product.id}</td>
                <td className="w-2/12 py-2 px-2 border ">{product.productName}</td>
                <td className="w-2/12 py-2 px-2 border text-center">{product.price}đ</td>
                <td className="w-1/12 py-2 px-2 border text-center">
                  <img src={product.image} alt={product.productName} className="w-16 h-16 object-cover" />
                </td>
                <td className="w-2/12 py-2 px-2 border text-center">{product.quantitySellSucesss}</td>
                <td className="w-2/12 py-2 px-2 border text-center">{product.quantityStock}</td>
                <td className="w-2/12 py-2 px-2 border text-center">
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
                      handleDelete(product.id, product.image, product.listStringImage || []);
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
              <td colSpan={7} className="text-center py-4">
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
