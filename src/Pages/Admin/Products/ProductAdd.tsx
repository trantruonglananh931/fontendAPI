import React, { useState, useEffect, useRef } from "react";
 import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import { useAuth } from "../../../Context/useAuth";
import { NewProduct } from "../../../Models/Product";

const ProductAdd: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const [product, setProduct] = useState<NewProduct>({
    productName: "",
    quantitySellSucesss: 0,
    description: "",
    Image: null,
    quantityStock: 0,
    price: 0,
    categoryId: "",
    imageUrls: [],
    sizeDetails: Array.from({ length: 7 }, (_, index) => ({
      sizeId: index + 8, 
      quantity: 0,        
    })),
  });
  const token = user?.token;
  const mainImageInputRef = useRef<HTMLInputElement | null>(null);
  const subImagesInputRef = useRef<HTMLInputElement | null>(null);
  const [categories, setCategories] = useState<{ id: string; categorName: string }[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const sizeMapping: { [key: number]: string } = {
    8: "XXS",
    9: "XS",
    10: "S",
    11: "M",
    12: "L",
    13: "XL",
    14: "XXL",
  };
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/v4/api/Category',{
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*',
          }
        });
        if (response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          console.error("Dữ liệu danh mục không phải là một mảng", response.data);
          setCategories([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);


  const calculateTotalQuantity = (sizeDetails: { sizeId: number; quantity: number }[]) => {
    return sizeDetails.reduce((total, size) => total + size.quantity, 0);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: name === "quantityStock" || name === "price" ? +value : value,
    });
  };

  const handleSizeDetailChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: "quantity"
  ) => {
    const updatedSizeDetails = [...product.sizeDetails];
    updatedSizeDetails[index][field] = Math.max(+e.target.value, 0);

    const totalQuantity = calculateTotalQuantity(updatedSizeDetails);

    setProduct({
      ...product,
      sizeDetails: updatedSizeDetails,
      quantityStock: totalQuantity, // Cập nhật tổng số lượng
    });
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setProduct((prev) => ({
        ...prev,
        Image: files[0], // Lưu file ảnh chính vào state
      }));
    }
  };
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, isMainImage: boolean = false) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const formData = new FormData();
  
      newFiles.forEach(file => {
        formData.append("files", file);
      });
  
      try {
        const response = await axios.post("/v2/api/images", formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          params: { isMainImage },
        });
        
        if (response.data.urls) {
          if (isMainImage) {
            setProduct(prev => ({ ...prev, Image: response.data.urls[0] }));
          } else {
            setProduct(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ...response.data.urls] }));
          }
        }
        
      } catch (error) {
        console.error("Lỗi khi tải lên hình ảnh:", error);
        alert("Không thể tải lên hình ảnh.");
      }
    }
  };

  const removeImageUrl = (index: number) => {
    setProduct(prev => {
      const updatedImageUrls = prev.imageUrls.filter((_, idx) => idx !== index);
      return { ...prev, imageUrls: updatedImageUrls };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product.productName || product.productName.length < 5 || product.productName.length > 100) {
      alert("Tên sản phẩm không hợp lệ. Nó phải có độ dài từ 5 đến 100 ký tự.");
      return;
    }
  
    if (!product.description) {
      alert("Mô tả không được để trống.");
      return;
    }
  
    if (!product.Image) {
      alert("Hình ảnh chính là bắt buộc.");
      return;
    }
  
    if (product.sizeDetails.every(size => size.quantity <= 0)) {
      alert("Ít nhất một kích thước cần có số lượng lớn hơn 0.");
      return;
    }

    const productData = {
      productName: product.productName,
      quantitySellSucesss: product.quantitySellSucesss,
      description: product.description,
      Image: product.Image,
      quantityStock: product.quantityStock,
      price: product.price,
      categoryId: product.categoryId,
      imageUrls: product.imageUrls,
      sizeDetails: product.sizeDetails,
    };

    try {
      await axios.post(
        "/v2/api/Product",
        productData,{
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });

      alert("Sản phẩm đã được thêm thành công!");
      setProduct({
        productName: "",
        quantitySellSucesss: 0,
        description: "",
        Image: null,
        quantityStock: 0,
        price: 0,
        categoryId: "",
        imageUrls: [],
        sizeDetails: Array.from({ length: 7 }, (_, index) => ({
          sizeId: index + 8,
          quantity: 0, 
        })),
      });
      if (mainImageInputRef.current) {
        mainImageInputRef.current.value = "";
      }
      if (subImagesInputRef.current) {
        subImagesInputRef.current.value = "";
      }

      navigate("/admin/productlist");
    } catch (error: any) {
      console.error("Lỗi khi thêm sản phẩm:", error.response?.data);
      if (error.response && error.response.data && error.response.data.errors) {
        alert("Không thể thêm sản phẩm: " + JSON.stringify(error.response.data.errors));
      } else {
        alert("Không thể thêm sản phẩm: " + (error.message || "Lỗi không xác định"));
      }
    }
  };

  return (
    <div className="  p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Thêm Sản Phẩm Mới</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-gray-700 font-semibold mb-2">Tên sản phẩm</label>
            <input
              type="text"
              name="productName"
              value={product.productName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700 font-semibold mb-2">Mô tả</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>
  
        <div className="flex space-x-4">
          <div className="w-1/2">
          <label className="block text-gray-700 font-semibold mb-2">Chọn hình ảnh phụ</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageChange(e)}
              ref={subImagesInputRef}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="w-1/2">
          <label className="block text-gray-700 font-semibold mb-2">Chọn hình ảnh chính</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleMainImageChange(e)}
              ref={mainImageInputRef}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
           
          </div>
        </div>
  
        <div className="mt-6">
          <h2 className=" text-lg ">Hình ảnh phụ:</h2>
          <ul>
            {product.imageUrls.map((url, index) => (
              <li key={index} className=" text-gray-700">
                <span>{url}</span>
                <button type="button" onClick={() => removeImageUrl(index)} className="ml-2 text-red-500 hover:underline">
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        </div>
  
        <div className="flex space-x-4">
          <div className="w-1/3">
            <label className="block text-gray-700 font-semibold mb-2">Giá</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              min="0"
              required
            />
          </div>
          <div className="w-1/3">
            <label className="block text-gray-700 font-semibold mb-2">Số lượng kho</label>
            <input
              type="number"
              name="quantityStock"
              value={product.quantityStock}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>
          <div className="w-1/3">
            <label className="block text-gray-700 font-semibold mb-2">Danh mục</label>
            <select
              name="categoryId"
              value={product.categoryId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categorName}
                </option>
              ))}
            </select>
          </div>
        </div>
  
        <div className="mt-6">
  
          <div className="flex items-center space-x-6">
          <h2 className="text-lg font-semibold">Thông tin Size</h2>
            {product.sizeDetails.map((sizeDetail, index) => (
              <div key={index} className="flex items-center space-x-2">
                {/* Tên size */}
                <label className="text-sm font-semibold text-gray-700">{sizeMapping[sizeDetail.sizeId]} : </label>
                {/* Ô nhập số lượng */}
                <input
                  type="number"
                  name={`quantity_${sizeDetail.sizeId}`}
                  value={sizeDetail.quantity}
                  onChange={(e) => handleSizeDetailChange(e, index, "quantity")}
                  className="w-16 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-center"
                  placeholder="0"
                  min="0"
                />
              </div>
            ))}
          </div>
        </div>

  
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
        >
          Thêm sản phẩm
        </button>
      </form>
    </div>
  );
  
};

export default ProductAdd;