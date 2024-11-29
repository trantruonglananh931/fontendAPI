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
  const [categories, setCategories] = useState<{ id: string; categorName: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | "">("");

  const [minPrice, setMinPrice] = useState<number | "">(0);
  const [maxPrice, setMaxPrice] = useState<number | "">(0);
  const productsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/v2/api/Product", {
          params: {
            IsDecsendingByPrice: sortOrder,
            categoryId: selectedCategory, // Thêm tham số categoryId
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
  }, [sortOrder, selectedCategory]); // Thêm selectedCategory vào dependency array

   // Fetch categories
   useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/v4/api/Category");
        if (response.data && response.data.data) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách loại sản phẩm:", error);
      }
    };
    fetchCategories();
  }, []);

  

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

  // Handle filtering by price
  const filterByPrice = (products: Product[]) => {
    return products.filter((product) => {
      const price = product.price;
      return (
        (minPrice ? price >= minPrice : true) && 
        (maxPrice ? price <= maxPrice : true)
      );
    });
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
  const filteredProducts = filterByPrice(products);
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="w-full">
      <Navbar />
      <div className="container mx-auto p-4">
        <Carousel />
 
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
  {/* Giá từ */}
  <div className="flex items-center gap-2">
    <label htmlFor="minPrice" className="text-gray-600 font-medium">
      Giá từ:
    </label>
    <input
      type="number"
      id="minPrice"
      value={minPrice === 0 ? "" : minPrice}
      onChange={(e) => {
        const value = e.target.value === "" ? "" : +e.target.value; // Chỉnh sửa ở đây
        if (value === "" || (typeof value === "number" && value >= 0)) {
          setMinPrice(value);
        }
      }}
      placeholder="Giá"
      className="w-28 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
  </div>

  {/* Giá đến */}
  <div className="flex items-center gap-2">
    <label htmlFor="maxPrice" className="text-gray-600 font-medium">
      Giá đến:
    </label>
    <input
      type="number"
      id="maxPrice"
      value={maxPrice === 0 ? "" : maxPrice}
      onChange={(e) => {
        const value = e.target.value === "" ? "" : +e.target.value; // Chỉnh sửa ở đây
        if (value === "" || (typeof value === "number" && value >= 0)) {
          setMaxPrice(value);
        }
      }}
      placeholder="Giá"
      className="w-28 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
  </div>
</div>


    <div className="flex items-center gap-4">
      {/* Lọc theo danh mục */}
      <div className="flex items-center gap-2">
        <label htmlFor="category" className="text-gray-600 font-medium">
          Danh mục:
        </label>
        <select
          id="category"
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
          className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Tất cả</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.categorName}
            </option>
          ))}
        </select>
    </div>

    {/* Sắp xếp theo giá */}
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-gray-600 font-medium">
        Sắp xếp:
      </label>
      <select
        id="sort"
        onChange={handleSortChange}
        value={sortOrder === null ? "none" : sortOrder ? "asc" : "desc"}
        className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="none">Mặc định</option>
        <option value="asc">Giá giảm dần</option>
        <option value="desc">Giá tăng dần</option>
      </select>
    </div>
  </div>
 

        </div>
        <ul className="grid grid-cols-2 lg:grid-cols-5 gap-3 product-container transition-opacity duration-300">
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <li key={index} className="animate-pulse border-2 rounded-lg bg-gray-200 h-48"></li>
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
