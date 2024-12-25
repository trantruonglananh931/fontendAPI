import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../Context/useAuth";
import { Product } from "../../../Models/Product";
import { addMessage } from "../../../Models/Message";
import { CartItem } from "../../../Models/CartItem";
import PaymentMethods from "../../../Components/Payment/PaymentMethods"; 
import Navbar from "../../../Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageList, setImageList] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null); 
  const [sizeStock, setSizeStock] = useState<number>(0); 
  const [message, setMessage] = useState<string>('');  
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);  
  const { user } = useAuth(); 
  
  const navigate = useNavigate();
  const token = user?.token;
  const [selectedImage, setSelectedImage] = useState<string | null>(null); 

  const handleImageClick = (imageUrl?: string) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
    }
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
      setQuantity(1); 
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate('/login'); 
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

  const handleBuyNow = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để tiếp tục!");
      navigate("/login");
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
      return alert(
        `Số lượng vượt quá giới hạn. Chỉ còn ${selectedSizeDetail.quantity}`
      );
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
  
    navigate("/checkout", { state: { selectedCartItems: [newItem] } });
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
        Image: imageUrls.length > 0 ? imageUrls.join(",") : "",
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
                    <p className="text-gray-600 text-xs">Còn {size.quantity} </p>
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
                      onClick={handleBuyNow}
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
          
        <div className="mt-10 ml-32 w-full">
          {/* Form để gửi bình luận */}
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-green-700 text-lg font-semibold">Nội dung bình luận</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-180 mt-2 p-2 border border-gray-300 rounded-lg"
                placeholder="Chia sẻ trải nghiệm của bạn..."
                required
              />
            </div>

            <div>
              {/* <label className="block font-semibold text-green-700">Chọn hình ảnh</label> */}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImageFiles(e.target.files)}
                className="w-180 p-2 border border-gray-300 rounded-lg"
              />
               <button type="submit" className="ml-4 w-20 bg-blue-500 text-white py-3 rounded-lg">
              Gửi
            </button>

              {/* Hiển thị hình ảnh xem trước chỉ khi có tệp được chọn */}
              {imageFiles && imageFiles.length > 0 && (
                <div className="flex flex-col gap-4 mt-4 w-20 h-24">
                  {Array.from(imageFiles).map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Ảnh ${index + 1}`}
                      className="w-full object-cover border border-gray-300 rounded-sm"
                    />
                  ))}
                </div>
              )}
             
            </div>

            
          </form>

          {/* Phần bình luận */}
          <div className="mt-12">
            <div className="font-semibold text-green-600 text-lg">Danh sách bình luận</div>
            {product?.messageDetails?.map((messageDetail, index) => (
              <div key={index} className="border-b border-gray-300 mb-4">
                <div>
                  <p className="font-semibold mt-2">{messageDetail.userName}</p>
                  <p className="text-sm text-blue-600">
                    {new Date(messageDetail.time).toLocaleString()}
                  </p>
                </div>
                <p className="mb-1 mt-1">{messageDetail.message}</p>
                {messageDetail.image && (
                  <img
                    src={messageDetail.image}
                    alt={messageDetail.userName}
                    className="w-24 h-28 cursor-pointer mb-2"
                    onClick={() => handleImageClick(messageDetail.image)}
                  />
                )}
              </div>
            ))}

            {/* Hiển thị modal khi một hình ảnh được chọn */}
            {selectedImage && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="relative bg-white ">
                  <button
                    onClick={handleCloseModal}
                    className="absolute top-2 right-2 text-white bg-gray-500 rounded-sm p-1"
                  >
                    X
                  </button>
                  <img
                    src={selectedImage}
                    alt="Ảnh phóng to"
                    className="max-w-full max-h-[80vh] object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      </div>
    </div>
  );
  
};

export default ProductDetail;
