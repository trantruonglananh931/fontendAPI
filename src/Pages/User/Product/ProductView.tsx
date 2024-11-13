import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Product } from "../../../Models/Product";
import Carousel from "../../../Components/Carousel/Carousel";
import Pagination from "../../../Components/Pagination/Pagination";
import Footer from "../../../Components/Footer/Footer";
import Navbar from "../../../Components/Navbar/Navbar";

const ProductView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortOrder, setSortOrder] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/v2/api/Product", {
          params: {
            IsDecsendingByPrice: sortOrder,
          },
        });

        if (response.data && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
          setTotalProducts(response.data.data.length);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    fetchProducts();
  }, [sortOrder]);

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

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "asc") {
      setSortOrder(true);
    } else if (value === "desc") {
      setSortOrder(false);
    } else {
      setSortOrder(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <div className="w-full">
    <Navbar/>
    
    <div className="container mx-auto p-4">
  
      <Carousel />

      <div className="flex justify-between items-center mb-6">
        <select
          onChange={handleSortChange}
          value={sortOrder === null ? "none" : sortOrder ? "asc" : "desc"}
          className="py-2 px-4 border border-gray-300 rounded-lg"
        >
          <option value="none">Sắp xếp theo giá</option>
          <option value="asc">Cao đến Thấp</option>
          <option value="desc">Thấp đến Cao</option>
        </select>
      </div>

      <ul className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {Array.isArray(currentProducts) && currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <li
              key={product.id}
              className="cursor-pointer border-2 border-transparent hover:border-green-500 transform hover:scale-105 transition-all duration-200"
              onClick={() => handleDetail(product.id)}
            >
              <img
                src={product.image}
                alt={product.productName}
                className="w-full h-150 object-cover"
              />
              <div className="mt-2 ml-2">
                <h2 className="text-base ">{product.productName}</h2>
                <p className="text-red-500 text-base font-semibold">{product.price}đ</p>
                <p className="text-gray-600">{product.categoryId}</p>
              </div>
             
            </li>
          ))
        ) : (
          <p>Không tìm thấy sản phẩm nào.</p>
        )}
      </ul>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
        <Footer/>
    </div>
    </div>
    
  );
};

export default ProductView;
