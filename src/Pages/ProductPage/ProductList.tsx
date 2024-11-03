import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 

type Product = {
  id: string;
  productName: string;
  quantitySellSucesss: number;
  description: string;
  image: string;
  quantityStock: number;
  price: number;
  categoryId: string;
  imageUrls: string[];
};

type Slide = {
  imageUrl: string;
  link: string;
};

const slides: Slide[] = [
  {
    imageUrl: "/images/caurousel/m1acnkuz77djwysa293cta1800x833.webp",
    link: "/collection/summer2024.html",
  },
  {
    imageUrl: "/images/caurousel/m1h7ajcd0sottxawyzu9a_Heroweb.webp",
    link: "/collection/winter2024",
  },
  {
    imageUrl: "/images/caurousel/m1ra3e0i7won6u05a1qJ1800x833.webp",
    link: "/collection/winter2024",
  },
  {
    imageUrl: "/images/caurousel/m1h5t6esl6r65pev2xp1800x833b.webp",
    link: "/collection/winter2024",
  },
];

const Carousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? slides.length - 1 : prevSlide - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === slides.length - 1 ? 0 : prevSlide + 1
    );
  };

  const handleClickSlide = () => {
    navigate(slides[currentSlide].link);
  };

  return (
    <div className="relative w-full h-[700px] mb-8">
      <img
        src={slides[currentSlide].imageUrl}
        alt="hình ảnh carousel"
        className="w-full h-full object-cover cursor-pointer"
        onClick={handleClickSlide}
      />

      <button
        onClick={handlePrevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 text-black p-3 rounded-full"
      >
        &lt;
      </button>
      <button
        onClick={handleNextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 text-black p-3 rounded-full"
      >
        &gt;
      </button>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 mx-2 rounded-full ${
              currentSlide === index ? "bg-white" : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortOrder, setSortOrder] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 8; 
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
          setTotalProducts(response.data.data.length); // Cập nhật tổng số sản phẩm
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

  const handleUpdate = (id: string) => {
    navigate(`/product/update/${id}`);
  };

  const handleAddNewProduct = () => {
    navigate("/product/add");
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


  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);


  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <div className="container mx-auto p-4">
      <Carousel />

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleAddNewProduct}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Thêm sản phẩm mới
        </button>
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

      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.isArray(currentProducts) && currentProducts.length > 0 ? (
          currentProducts.map((product) => (
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
                <p className="text-red-500 text-lg font-semibold">{product.price}đ</p>
                <p className="text-gray-600">{product.categoryId}</p>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdate(product.id);
                  }}
                  className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
                >
                  Cập nhật
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(product.id);
                  }}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>Không tìm thấy sản phẩm nào.</p>
        )}
      </ul>


      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-300 mx-72 text-black font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 flex items-center"
        >
          <FaChevronLeft />
        </button>
        <span className="mx-4">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-gray-300 mx-72 text-black font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 flex items-center"
        >
          <FaChevronRight /> 
        </button>
      </div>


    </div>
  );
};

export default ProductList;
