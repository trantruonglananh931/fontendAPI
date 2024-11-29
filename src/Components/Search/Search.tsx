import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useAuth } from "../../Context/useAuth";
import { Product} from "../../Models/Product";
import { useNavigate } from "react-router-dom";
import Carousel from "../../Components/Carousel/Carousel";
import Pagination from "../../Components/Pagination/Pagination";
import Footer from "../../Components/Footer/Footer";
import Navbar from "../../Components/Navbar/Navbar";

const SearchPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<boolean | null>(null); 
  const location = useLocation();
  const { user } = useAuth(); 
  const token = user?.token;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: string; categorName: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | "">("");
  const navigate = useNavigate();
  const [minPrice, setMinPrice] = useState<number | "">(0);
  const [maxPrice, setMaxPrice] = useState<number | "">(0);
  const productsPerPage = 10;



  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query') || '';
    setSearchTerm(query);
    fetchProducts(query);
  }, [location.search, sortOrder]);

  const fetchProducts = async (query: string) => {
    try {
      const response = await axios.get(`/v2/api/Product?productName=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*',
        }
      });

      if (response.data && response.data.data) {
        let fetchedProducts = response.data.data;

        if (sortOrder !== null) {
          fetchedProducts = fetchedProducts.sort((a: Product, b: Product) =>
            sortOrder ? a.price - b.price : b.price - a.price
          );
        }

        setProducts(fetchedProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
    }
  };
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


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(searchTerm.trim());
  };



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
                  const value = e.target.value === "" ? "" : +e.target.value;
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
                  const value = e.target.value === "" ? "" : +e.target.value;
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
  
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <li
                key={product.id}
                className="cursor-pointer"
                onClick={() => handleDetail(product.id)}
              >
                <img
                  src={product.image}
                  alt={product.productName}
                  className="w-full h-150 object-cover"
                />
                <div className="mt-4">
                  <h2 className="text-l">{product.productName}</h2>
                  <p className="text-red-600 font-semibold text-xl">{product.price}đ</p>
                </div>
              </li>
            ))
          ) : (
            <p>Không tìm thấy sản phẩm.</p>
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

export default SearchPage;
