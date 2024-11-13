import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Product } from "../../../Models/Product";
import Footer from "../../../Components/Footer/Footer";
import Pagination from "../../../Components/Pagination/Pagination";
import Navbar from "../../../Components/Navbar/Navbar";
const ProductCategoryView: React.FC = () => {
  const { categoryId } = useParams(); 
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/v2/api/Product", {
          params: {
            categoryId: categoryId, 
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

    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId]);

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
      <ul className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {Array.isArray(currentProducts) && currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <li
              key={product.id}
              className="cursor-pointer border-2 border-transparent hover:border-green-500 transform hover:scale-105 transition-all duration-200"
            >
              <img
                src={product.image}
                alt={product.productName}
                className="w-full h-150 object-cover"
              />
              <div className="mt-2 ml-2">
                <h2 className="text-base">{product.productName}</h2>
                <p className="text-red-500 text-base font-semibold">{product.price}đ</p>
                <p className="text-gray-600">{product.categoryName}</p>
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
      
      <Footer />
    </div>
    </div>
  );
};

export default ProductCategoryView;
