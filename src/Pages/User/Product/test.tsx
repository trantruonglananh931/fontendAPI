import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Product } from "../../../Models/Product";
import { CartItem } from "../../../Models/CartItem";
import PaymentMethods from "../../../Components/Payment/PaymentMethods"; // Import component PaymentMethods

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageList, setImageList] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Lưu giỏ hàng vào LocalStorage
  const saveCartToLocalStorage = (items: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
  };

  // Lấy sản phẩm từ API
  useEffect(() => {
    const fetchProductDetail = async () => {
      const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."; // Cập nhật token nếu cần
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
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };
    fetchProductDetail();
  }, [id]);

  // Cập nhật giỏ hàng từ LocalStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (storedCart.length > 0) {
      setCartItems(storedCart);
    }
  }, []);

  // Thêm sản phẩm vào giỏ hàng
  const handleAddToCart = () => {
    const existingItemIndex = cartItems.findIndex(item => item.productId === product?.id);
    let updatedItems: CartItem[];

    if (existingItemIndex === -1) {
      // Nếu sản phẩm chưa có trong giỏ, thêm mới
      const newCartItem: CartItem = {
        productId: product?.id!,
        productName: product?.productName!,
        price: product?.price!,
        quantity: quantity,
      };
      updatedItems = [...cartItems, newCartItem];
    } else {
      // Nếu sản phẩm đã có, chỉ cập nhật số lượng
      updatedItems = cartItems.map(item =>
        item.productId === product?.id ? { ...item, quantity: item.quantity + quantity } : item
      );
    }

    // Cập nhật giỏ hàng và lưu vào LocalStorage
    setCartItems(updatedItems);
    saveCartToLocalStorage(updatedItems);
    
    alert("Sản phẩm đã được thêm vào giỏ hàng!");
  };

  if (!product) {
    return <div className="text-center">Đang tải...</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto p-6 bg-white">
      <div className="flex flex-col lg:flex-row items-stretch">
        {/* Hình ảnh thu nhỏ bên trái */}
        <div className="w-full lg:w-1/12 flex flex-col space-y-2 mb-4 lg:mb-0">
          {imageList.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Hình thu nhỏ sản phẩm ${index + 1}`}
              className={`w-20 h-30 object-cover cursor-pointer ${currentImageIndex === index ? "border-2 border-green-600" : "border border-gray-300"}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>

        {/* Hình ảnh lớn */}
        <div className="relative w-full lg:w-1/2 flex items-center justify-center">
          <img
            src={imageList[currentImageIndex]}
            alt={`Hình sản phẩm ${currentImageIndex + 1}`}
            className="w-full h-[700px] object-cover shadow-md"
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div className="lg:ml-6 w-full lg:w-1/2 space-y-4">
          <h1 className="text-2xl font-bold">{product.productName}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-red-600 text-3xl font-semibold">{product.price}đ</p>
          <p className="text-gray-600">Đã bán: {product.quantitySellSucesss}</p>

          {/* Số lượng sản phẩm */}
          <div className="flex items-center space-x-6">
            <label className="text-lg">Số lượng:</label>
            <div className="flex items-center border rounded-md">
              <button
                className="px-4 py-3"
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                className="px-4 py-3"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>

            <div className="ml-4">
              <button
                onClick={handleAddToCart}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <button className="bg-orange-500 text-white px-56 py-3 rounded-lg hover:bg-orange-600 transition-colors">
              Mua ngay
            </button>
          </div>

          {/* Sử dụng PaymentMethods component */}
          <PaymentMethods />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
