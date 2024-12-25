import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { Product } from "../../Models/Product";

const SimilarProductsView: React.FC = () => {
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  const location = useLocation();
  const { image } = location.state || {}; 
  useEffect(() => {
    if (!image) {
      setError("Không tìm thấy thông tin ảnh sản phẩm. Vui lòng quay lại và thử lại.");
      setIsLoading(false);
      return;
    }

    const fetchSimilarProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(image, { responseType: "blob" });
        const file = new File([response.data], "product-image.jpg", {
          type: response.headers["content-type"],
        });
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await axios.post("http://127.0.0.1:5000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (uploadResponse.data && Array.isArray(uploadResponse.data.productIds)) {
          const productIds = uploadResponse.data.productIds;

          const similarProductsResponse = await axios.post(
            "/v2/api/Product/GetListSameProduct",
            { productIds }
          );

          if (similarProductsResponse.data && similarProductsResponse.data.products) {
            setSimilarProducts(similarProductsResponse.data.products);
          } else {
            setError("Không tìm thấy sản phẩm tương tự.");
          }
        } else {
          setError("Không tìm thấy sản phẩm tương tự.");
        }
      } catch (error) {
        console.error("Lỗi khi tìm sản phẩm tương tự:", error);
        setError("Đã xảy ra lỗi khi tải sản phẩm.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [image]);

  if (error) {
    return (
      <div className="w-full relative">
        <Navbar />
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Lỗi</h1>
          <p>{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Sản phẩm tương tự</h1>
        {isLoading ? (
          <p>Đang tải...</p>
        ) : (
          <ul className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {similarProducts.map((product) => (
              <li
                key={product.id}
                className="border-2 border-transparent hover:border-green-500 transform transition-transform duration-300 shadow-sm hover:shadow-lg"
              >
                <img
                  src={product.image}
                  alt={product.productName}
                  className="w-full h-150 object-cover"
                />
                <div className="mt-2 ml-2">
                  <h2 className="text-base">{product.productName}</h2>
                  <p className="text-red-500 text-base font-semibold">{product.price}đ</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SimilarProductsView;
