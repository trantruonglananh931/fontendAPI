import React, { useEffect, useState } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Product } from "../../../Models/Product";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash ,faEye} from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../../../Context/useAuth";
import ProductUpdate from "../../Admin/Products/ProductUpdate";  
import ProductDetailAdm from "../../Admin/Products/ProductDetailAdm";  
interface handleAddTab {
  // addTab: (key: string, label: string, component: JSX.Element) => void;
  addTab: (key: string, label: string, component: JSX.Element) => void;
}

const ProductList: React.FC<handleAddTab> = ({ addTab  }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const token = user?.token;

  
  const handleNavigation1 = (label: string, key: string,component :JSX.Element) => {
    // navigate(path);
    addTab(key, label, component);
  };

  useEffect(() => {

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

  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa?");
    if (!isConfirmed) return;
  
    try {
      await axios.delete(`/v2/api/Product/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`, 
          'accept': '*/*',
        }
      });
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };
  
  
  const handleDetail = (id: string) => {
    // navigate(`/admin/product/${id}`);
    handleNavigation1('Chi tiết sản phẩm ' + id, 'Chi tiết sản phẩm '+id,<ProductDetailAdm id1={id}/>);
  };

  const handleUpdate = (id: string) => {
    // navigate(`/admin/product/update/${id}`);
    handleNavigation1('Cập nhập sản phẩm ' + id, 'Cập nhập sản phẩm '+id,<ProductUpdate id1={id}/>);
  };


  return (
    <div>
      <table className="min-w-full bg-white text-xs">
        <thead>
          <tr className=" bg-gray-100">
            <th className="w-2/12 py-2 px-2 border ">Mã sản phẩm</th>
            <th className="w-2/12 py-2 px-2 border ">Tên sản phẩm</th>
            <th className="w-2/12 py-2 px-2 border text-center">Giá</th>
            <th className="w-1/12 py-2 px-2 border text-center">Xem trước</th>
            <th className="w-1/12 py-2 px-2 border text-center">Đã bán</th>
            <th className="w-1/12 py-2 px-2 border text-center">Kho</th>
            <th className="w-/12 py-2 px-2 border text-center"></th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100 ">
                <td className="w-2/12 py-2 px-2 border ">{product.id}</td>
                <td className="w-2/12 py-2 px-2 border ">{product.productName}</td>
                <td className="w-2/12 py-2 px-2 border text-center">{product.price}đ</td>
                <td className="w-1/12 py-2 px-2 border text-center">
                  <img src={product.image} alt={product.productName} className="w-16 h-16 object-cover" />
                </td>
                <td className="w-1/12 py-2 px-2 border text-center">{product.quantitySellSucesss}</td>
                <td className="w-1/12 py-2 px-2 border text-center">{product.quantityStock}</td>
                <td className="w-2/12 py-2 px-2 border text-center">
                <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDetail(product.id); 
                    }}
                    className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 mr-2  cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdate(product.id);
                    }}
                    className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 mr-2  cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(product.id);
                    }}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600  cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4">
                Đang tải ...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
