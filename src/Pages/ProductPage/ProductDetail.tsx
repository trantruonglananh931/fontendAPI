import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

type Product = {
  id: string;
  productName: string;
  quantitySellSucesss: number;
  description: string;
  image: string;
  quantityStock: number;
  price: number;
  categoryName: string;
  listStringImage: string[];
};

type CartItem = {
  ProductId: string;
  productName: string;
  price: number;
  Quantity: number;
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageList, setImageList] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchProductDetail = async () => {
      const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."; 

      try {
        const response = await axios.get(`/v2/api/Product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedProduct = response.data.data;
        const fullImageList = [fetchedProduct.image, ...fetchedProduct.listStringImage];
        setProduct(fetchedProduct);
        setImageList(fullImageList);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProductDetail();
  }, [id]);

  if (!product) {
    return <div className="text-center">Loading...</div>;
  }

  const handleAddToCart = async () => {
    const cartItem: CartItem = {
      ProductId: product.id,
      productName: product.productName,
      price: product.price,
      Quantity: quantity,
    };
    try {
      const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."; 

      await axios.post("/v2/api/Product/sessions", cartItem, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("Product has been added to cart!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg ">
      <div className="flex flex-col lg:flex-row items-stretch">
        {/* Hình ảnh phụ bên trái */}
        <div className="w-full lg:w-1/12 flex flex-col space-y-2 mb-4 lg:mb-0">
          {imageList.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Product thumbnail ${index + 1}`}
              className={`w-20 h-30 object-cover cursor-pointer ${
                currentImageIndex === index
                  ? "border-2 border-blue-600"
                  : "border border-gray-300"
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>

        {/* Ảnh lớn */}
        <div className="relative w-full lg:w-1/2 flex items-center justify-center">
          <img
            src={imageList[currentImageIndex]}
            alt={`Product image ${currentImageIndex + 1}`}
            className="w-full h-[700px] object-cover shadow-md"
          />
          
        </div>

        {/* Chi tiết sản phẩm */}
        <div className="lg:ml-6 w-full lg:w-1/2 space-y-4">
          <h1 className="text-2xl font-bold">{product.productName}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-gray-800 text-3xl font-semibold">${product.price}</p>
          <p className="text-gray-600">Đã bán: {product.quantitySellSucesss}</p>

          {/* Số lượng sản phẩm */}
          <div className="flex items-center space-x-6">
            <label className="text-lg">Số lượng:</label>
            <div className="flex items-center border rounded-md">
              <button
                className="px-4 py-3 "
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              >
                -
              </button>
              <span className="px-4">{quantity}</span> {/* Chỉ hiển thị số lượng */}
              <button
                className="px-4 py-3 "
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>

            {/* Nút thêm vào giỏ hàng */}
            <div className="ml-4">
              <button
                onClick={handleAddToCart}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Thêm vào giỏ
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            
            <button className="bg-orange-500 text-white px-56 py-3 rounded-lg hover:bg-orange-600 transition-colors">
              Mua ngay
            </button>
          </div>

          {/* Phương thức thanh toán */}
          <div className="flex items-center space-x-4 mt-6">
            <img src="https://cdn.tgdd.vn/2020/04/GameApp/image-180x180.png" alt="ZaloPay" className="w-12" />
            <img src="https://d-russia.ru/wp-content/uploads/2014/05/visa-mastercard.jpg" alt="Visa" className="w-12" />
            
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
