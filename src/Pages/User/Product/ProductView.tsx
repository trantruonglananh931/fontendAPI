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
  const [isLoading, setIsLoading] = useState(true);
  const productsPerPage = 10;
  const navigate = useNavigate();

  // Fetch products on mount or sort order change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [sortOrder]);

  // Handle delete product
  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa?");
    if (!isConfirmed) return;

    const productToRemove = document.getElementById(`product-${id}`);
    if (productToRemove) {
      productToRemove.classList.add("opacity-0", "translate-x-10");
      setTimeout(async () => {
        try {
          await axios.delete(`/v2/api/Product/${id}`);
          setProducts(products.filter((product) => product.id !== id));
          alert("Xóa sản phẩm thành công!");
        } catch (error) {
          console.error("Lỗi khi xóa sản phẩm:", error);
          alert("Xóa sản phẩm thất bại.");
        }
      }, 300); // Wait for animation to finish before updating state
    }
  };

  // Handle product detail navigation
  const handleDetail = (id: string) => {
    navigate(`/product/${id}`);
  };

  // Handle finding similar products
  const handleFindSimilar = (id: string) => {
    alert(`Tìm sản phẩm tương tự cho sản phẩm ${id}`);
  };

  // Handle sorting
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

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const productContainer = document.querySelector(".product-container");
    if (productContainer) {
      productContainer.classList.add("opacity-0");
      setTimeout(() => productContainer.classList.remove("opacity-0"), 300);
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <div className="w-full">
      <Navbar />
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
        <ul className="grid grid-cols-2 lg:grid-cols-5 gap-3 product-container transition-opacity duration-300">
        {isLoading
        ? Array.from({ length: 10 }).map((_, index) => (
            <li
              key={index}
              className="animate-pulse border-2 rounded-lg bg-gray-200 h-48"
            ></li>
          ))
        : currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <li
                id={`product-${product.id}`}
                key={product.id}
                className="relative border-2 border-transparent hover:border-green-500 transform transition-transform duration-300 shadow-sm hover:shadow-lg"
              >
                {/* Ảnh sản phẩm và thông tin */}
                <div
                  onClick={() => handleDetail(product.id)}
                  className="cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-full h-150 object-cover"
                  />
                  <div className="mt-2 ml-2">
                    <h2 className="text-base">{product.productName}</h2>
                    <p className="text-red-500 text-base font-semibold">{product.price}đ</p>
                    <p className="text-gray-600">{product.categoryId}</p>
                  </div>
                </div>
                {/* Nút Find Similar */}
                <div className="absolute bottom-0 left-0 right-0 px-1 py-1 group">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFindSimilar(product.id);
                  }}
                  className="bg-green-500 text-white w-full mt-2 px-4 py-2 group-hover:block hidden hover:bg-green-600 transition duration-300"
                >
                  Tìm sản phẩm tương tự
                </button>
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

export default ProductView;
