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

  const navigate = useNavigate();
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  
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
        },
      });
  
      if (response.data && response.data.data) {
        let fetchedProducts = response.data.data;
  
        if (sortOrder !== null) {
          fetchedProducts = fetchedProducts.sort((a: Product, b: Product) =>
            sortOrder ? a.price - b.price : b.price - a.price
          );
        }
  
        if (minPrice !== null) {
          fetchedProducts = fetchedProducts.filter((product: Product) => product.price >= minPrice);
        }
        if (maxPrice !== null) {
          fetchedProducts = fetchedProducts.filter((product: Product) => product.price <= maxPrice);
        }
  
        setProducts(fetchedProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
    }
  };
  
  useEffect(() => {
    fetchProducts(searchTerm.trim());
  }, [minPrice, maxPrice]);
  
  const handleDetail = (id: string) => {
    navigate(`/product/${id}`);
  };

  const handleFindSimilar = (id: string) => {
    alert(`Tìm sản phẩm tương tự cho sản phẩm ${id}`);
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

  const filterByPrice = (products: Product[]) => {
    return products.filter((product) => {
      const price = product.price;
      return (
        (minPrice ? price >= minPrice : true) && 
        (maxPrice ? price <= maxPrice : true)
      );
    });
  };

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
    const formattedQuery = searchTerm.trim().replace(/\s+/g, "+");
    fetchProducts(formattedQuery);
  };
  

  const handleMinPriceChange = (value: string) => {
    const price = value ? Math.max(0, parseFloat(value)) : null;
    setMinPrice(price);
  };
  
  const handleMaxPriceChange = (value: string) => {
    const price = value ? Math.max(0, parseFloat(value)) : null;
    setMaxPrice(price);
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
                value={minPrice !== null ? minPrice : ''}
                onChange={(e) => handleMinPriceChange(e.target.value)}
                min="0"
                className="w-28 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Giá"
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
                value={maxPrice !== null ? maxPrice : ''}
                onChange={(e) => handleMaxPriceChange(e.target.value)}
                min="0"
                className="w-28 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Giá"
              />
            </div>
          </div>
  
          <div className="flex items-center gap-4">
          
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
                <option value="asc">Giá tăng dần</option>
                <option value="desc">Giá giảm dần</option>
              </select>
            </div>
          </div>
        </div>
  
        <ul className="grid grid-cols-2 lg:grid-cols-5 gap-3 product-container transition-opacity duration-300">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <li
                key={product.id}
                className="cursor-pointer relative border-2 border-transparent hover:border-green-500 transform transition-transform duration-300 shadow-sm hover:shadow-lg "
                onClick={() => handleDetail(product.id)}
              >
                <img
                  src={product.image}
                  alt={product.productName}
                  className="w-full h-150 object-cover "
                />
                <div className="mt-2 ml-2">
                  <h2 className="text-base">{product.productName}</h2>
                  <p className="text-red-500 text-base font-semibold">{product.price}đ</p>
                  <p className="text-gray-600">{product.categoryId}</p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 px-1 py-1 group ">
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
