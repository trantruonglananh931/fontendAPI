import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../Context/useAuth";
import { Product } from "../../../Models/Product";
import { addMessage } from "../../../Models/Message";
import { CartItem } from "../../../Models/CartItem";
import PaymentMethods from "../../../Components/Payment/PaymentMethods"; // Import component PaymentMethods
import Navbar from "../../../Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageList, setImageList] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null); // Add selected size state
  const [sizeStock, setSizeStock] = useState<number>(0); // Add state for selected size stock
  const [message, setMessage] = useState<string>('');  // Lưu tin nhắn
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);  // Lưu các file hình ảnh
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);  // Lưu các URL hình ảnh đã tải lên
  const { user } = useAuth(); 
  
  const navigate = useNavigate();
  const token = user?.token;
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Trạng thái lưu hình ảnh được chọn

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl); 
  };

  const handleCloseModal = () => {
    setSelectedImage(null); 
  };

  const saveCartToLocalStorage = (items: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
  };

  useEffect(() => {
    const fetchProductDetail = async () => {
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
        if (fetchedProduct.sizeDetails && fetchedProduct.sizeDetails.length > 0) {
          // Set initial size and stock based on the first available size
          setSelectedSize(fetchedProduct.sizeDetails[0].sizeName);
          setSizeStock(fetchedProduct.sizeDetails[0].quantity);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };
    fetchProductDetail();
  }, [id]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (storedCart.length > 0) {
      setCartItems(storedCart);
    }
  }, []);

  const handleSizeChange = (size: string) => {
    const selectedSizeDetail = product?.sizeDetails?.find((s) => s.sizeName === size);
    if (selectedSizeDetail) {
      setSelectedSize(size);
      setSizeStock(selectedSizeDetail.quantity);
      setQuantity(1); // Reset quantity to 1 when size is changed
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate('/login'); // Chuyển hướng đến trang đăng nhập
      return;
    }
    if (!selectedSize) {
      return alert("Vui lòng chọn kích thước sản phẩm!");
    }
  
    const selectedSizeDetail = product?.sizeDetails?.find(
      (size) => size.sizeName === selectedSize
    );
  
    if (!selectedSizeDetail) {
      return alert("Kích thước không hợp lệ!");
    }
  
    if (quantity > selectedSizeDetail.quantity) {
      setQuantity(selectedSizeDetail.quantity);
      return alert(`Số lượng vượt quá giới hạn. Chỉ còn ${selectedSizeDetail.quantity}`);
    }
  
    const newItem: CartItem = {
      productId: product?.id!,
      productName: product?.productName!,
      image: product?.image!,
      price: product?.price!,
      quantity,
      sizeDetails: product?.sizeDetails || [],
      selectedSize,
    };
  
    const existingIndex = cartItems.findIndex(
      (item) => item.productId === product?.id && item.selectedSize === selectedSize
    );
  
    const updatedCart =
      existingIndex === -1
        ? [...cartItems, newItem]
        : cartItems.map((item, index) =>
            index === existingIndex
              ? { ...item, quantity: Math.min(item.quantity + quantity, selectedSizeDetail.quantity) }
              : item
          );
  
    setCartItems(updatedCart);
    saveCartToLocalStorage(updatedCart);
    alert("Sản phẩm đã được thêm vào giỏ hàng!");
  };
  
  const handleSubmitReview = async (e: React.FormEvent) => {

    if (!user) {
      alert("Vui lòng đăng nhập để gửi đánh giá!");
      navigate('/login');
      return;
    }
    
    e.preventDefault();
  
    try {
      let imageUrls: string[] = [];
  
      if (imageFiles) {
        const formData = new FormData();
        Array.from(imageFiles).forEach((file) => formData.append("files", file));
        
        try {
          const uploadResponse = await axios.post(`/v2/api/images/rateProduct`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          imageUrls = uploadResponse.data?.urls || [];
        } catch (error) {
          console.error("Lỗi tải ảnh:", error);
          alert("Không thể tải ảnh lên. Vui lòng thử lại!");
          return;
        }
      }
 
      const newAddMessage = {
        message: message,
        Image: imageUrls.join(","), 
      };
  
      const reviewResponse = await axios.post(
        `/v2/api/Product/addMessage/${id}`, 
        null, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: newAddMessage, 
        }
      );
  
      alert("Đánh giá đã được gửi thành công!");
      window.location.reload();
      
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      alert("Không thể gửi đánh giá.");
    }
  };
  
  if (!product) {
    return <div className="text-center">Đang tải...</div>;
  }

  return (
    <div className="w-full">
      <Navbar />
      <div className="max-w-screen-xl mx-auto p-6 bg-white">
        
        <div className="flex flex-col lg:flex-row items-start space-x-8">
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
              className="w-full h-3/4 object-cover shadow-md"
            />
          </div>
          
          
  
          {/* Thông tin sản phẩm */}
          <div className="lg:ml-6 w-full lg:w-1/2 space-y-4">
            <h1 className="text-2xl font-bold">{product.productName}</h1>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-red-600 text-3xl font-semibold">{product.price}đ</p>
  
            <div className="flex flex-col space-y-4">
              <p className="font-semibold">Chọn kích thước:</p>
              <div className="flex flex-wrap gap-2">
                {product.sizeDetails?.map((size, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2 border rounded-md cursor-pointer text-center ${selectedSize === size.sizeName ? "border-green-500 bg-green-100" : "border-gray-300"}`}
                    onClick={() => handleSizeChange(size.sizeName)}
                    style={{ width: "80px" }}
                  >
                    <p className="font-bold text-sm">{size.sizeName}</p>
                    <p className="text-gray-600 text-xs">{size.quantity} còn lại</p>
                  </div>
                ))}
              </div>
  
              {sizeStock > 0 ? (
                <>
                  <p className="font-semibold mt-4">Chọn số lượng:</p>
                  <div className="flex items-center space-x-4">
                    <button
                      className="px-4 py-2 bg-gray-100 rounded-md border border-gray-300"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                    >
                      <span className="text-lg font-bold">-</span>
                    </button>
                    <p className="text-lg font-semibold">{quantity}</p>
                    <button
                      className="px-4 py-2 bg-gray-100 rounded-md border border-gray-300"
                      onClick={() => setQuantity((prev) => Math.min(sizeStock, prev + 1))}
                      disabled={quantity >= sizeStock}
                    >
                      <span className="text-lg font-bold">+</span>
                    </button>
  
                    {/* Nút thêm vào giỏ hàng */}
                    <button
                      onClick={handleAddToCart}
                      className="px-5 py-3 bg-yellow-500 text-white font-medium rounded-md"
                    >
                      Thêm vào giỏ hàng
                    </button>
  
                   
                    <button
                      className="px-5 py-3 bg-orange-500 text-white font-medium rounded-md"
                    >
                      Mua ngay
                    </button> 
                  </div>
                </>
              ) : (
                <p className="text-red-500 mt-4">Size này đã hết hàng.</p>
              )}
            </div>

            
  
            {/* Sử dụng PaymentMethods component */}
            <PaymentMethods />
  
            
          </div>
        </div>
        <div className="flex space-x-8">
        {/* Cột bên trái: Form nhập bình luận */}
        <div className="w-1/2 mt-12">
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-green-700 text-lg font-semibold">Nội dung bình luận</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                placeholder="Chia sẻ trải nghiệm của bạn..."
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-green-700">Chọn hình ảnh</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImageFiles(e.target.files)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />

              {/* Hiển thị ảnh xem trước */}
              {imageFiles && (
                <div className="flex gap-4 mt-4">
                  {Array.from(imageFiles).map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Ảnh ${index + 1}`}
                      className="w-30 h-20 object-cover border border-gray-300 rounded-sm"
                    />
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg">
              Gửi bình luận
            </button>
          </form>
        </div>

        {/* Cột bên phải: Danh sách đánh giá */}
        <div className="pl-16 w-1/2 mt-12 ">
          <div className=" font-semibold text-green-600 text-lg">Bình luận</div>
          {product?.messageDetails?.map((messageDetail, index) => (
            <div key={index} className="border-b border-gray-300 ">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-semibold">{messageDetail.userName}</p>
                  <p className="text-sm text-gray-600">{new Date(messageDetail.time).toLocaleString()}</p>
                  <img
                    src={messageDetail.image || "/default-avatar.jpg"}
                    alt={messageDetail.userName}
                    className="w-20 h-20 cursor-pointer"
                    onClick={() => handleImageClick(messageDetail.image)} 
                  />
                </div>
              </div>
              <p className="mb-6 mt-1">{messageDetail.message}</p>
            </div>
          ))}

          {/* Hiển thị modal khi có hình ảnh được chọn */}
          {selectedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="relative bg-white p-4">
                <button
                  onClick={handleCloseModal}
                  className="absolute top-2 right-2 text-white bg-gray-500 rounded-sm p-3"
                >
                  X
                </button>
                <img
                  src={selectedImage}
                  alt="Expanded view"
                  className="max-w-full max-h-[80vh] object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      </div>
    </div>
  );
  
};

export default ProductDetail;
