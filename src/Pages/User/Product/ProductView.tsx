import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Product } from "../../../Models/Product";
import Carousel from "../../../Components/Carousel/Carousel";
import Pagination from "../../../Components/Pagination/Pagination";
import Footer from "../../../Components/Footer/Footer";
import Navbar from "../../../Components/Navbar/Navbar";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

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
  const [scrollTop, setScrollTop] = useState(0);
  const [isScroll,setIsScroll] = useState(false);
  useEffect(() =>{
    AOS.init(); 
  },[])

  useEffect(() => {

  scrollTop >= 500 ?setIsScroll(false):setIsScroll(true);
   const handleScroll = () => {
    setScrollTop(window.scrollY)
   };
   console.log(scrollTop)
    window.addEventListener('scroll',handleScroll);
    return () =>{
      window.removeEventListener('scroll',handleScroll);
    }
    
  },[scrollTop]
  )

  const handleScroll = () =>{
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/v2/api/Product", {
          params: {
            IsDecsendingByPrice: sortOrder,
            categoryId: selectedCategory, 
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
  }, [sortOrder, selectedCategory]);


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

  

  const handleDetail = (id: string) => {
    navigate(`/product/${id}`);
  };


  const handleFindSimilar = (image: string) => {
    if (!image) {
      alert("Không tìm thấy ảnh sản phẩm!");
      return;
    }
    navigate(`/similar-products`, { state: { image } });
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

  return (
    <div className="w-full relative"
  //  data-aos="fade-up"
    >
      <Navbar />
      <div className="container mx-auto p-4">
        <Carousel />
 
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
  {/* Giá từ */}
  <div className="flex items-center gap-2"
     data-aos="fade-down"
     data-aos-duration="1000"
     >
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
  <div className="flex items-center gap-2"
  data-aos="fade-down"
  data-aos-duration="1000"
  >
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


    <div className="flex items-center gap-4"
      data-aos="fade-down"
      data-aos-duration="1000"
      >
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
        <option value="asc">Giá giảm dần</option>
        <option value="desc">Giá tăng dần</option>
      </select>
    </div>
  </div>
        </div>
        <ul className="grid grid-cols-2 lg:grid-cols-5 gap-3 product-container transition-opacity duration-300"
              data-aos="fade-down"
              data-aos-duration="1000"
          >
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <li key={index} className="animate-pulse border-2 rounded-lg bg-gray-200 h-48"></li>
              ))
            : currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <li
                    id={`product-${product.id}`}
                    key={product.id}
                    className="product relative group border-2 border-transparent hover:border-green-500 transform transition-transform duration-300 shadow-sm hover:shadow-lg"
                  >
                    {/* Ảnh sản phẩm và thông tin */}
                    <div
                      onClick={() => handleDetail(product.id)}
                      className=" cursor-pointer"
                    >
                      <img
                        src={product.image}
                        alt={product.productName}
                        className="w-full h-150 object-cover"
                        loading="lazy"
                      />
                      <div className="mt-2 ml-2">
                        <h2 className="truncate">{product.productName}</h2>
                        <p className="text-red-500 text-base font-semibold">{product.price}đ</p>
                        <p className="text-gray-600">{product.categoryId}</p>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 px-1 py-1 similar hidden  group-hover:block  ">
                        <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFindSimilar(product.image); 
                              }}
                              className="bg-green-500 text-white w-full mt-2 px-4 py-2 "
                              >
                              Tìm sản phẩm tương tự
                            </button>

                    </div>
                    </div>

                    
                    {/* Nút Find Similar */}
                  
                  </li>
                ))
              ) : (
                <p>Đang tải ...</p>
              )}
        </ul>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <div className="w-full mb-2 border-t-2 border-gray-600 scale-125 my-2"></div>
        <div className="w-full mt-6 ">
          <div>
            <Link to="/product">
                <img className="" src="/images/Footer/khach-hang-muc-tieu-cua-yody.png" alt="Lỗi"/>
            </Link>
          </div>

        </div>
        <div 
        data-aos="fade-up"
        data-aos-duration="1000"
        >
        <Footer />
        </div>
       
                  
        {isScroll || (
          <div className="fixed"
            style={{bottom:"11px",right:"9px"}}
             onClick={handleScroll}
           >
          <svg className="h-10 w-10 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="16 12 12 8 8 12" />
            <line x1="12" y1="16" x2="12" y2="8" />
          </svg>
           </div>)
        }
        </div>
    </div>
  );
};

export default ProductView;
