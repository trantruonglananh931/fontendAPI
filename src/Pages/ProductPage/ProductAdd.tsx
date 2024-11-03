import React, { useState, useEffect } from "react";  
import { useNavigate } from "react-router-dom";
import axios from "axios";

type NewProduct = {
  productName: string;
  quantitySellSucesss: number;
  description: string;
  image: string;   
  quantityStock: number;
  price: number;
  categoryId: string;
  imageUrls: string[]; 
};

const ProductAdd: React.FC = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<NewProduct>({
    productName: "",
    quantitySellSucesss: 0,
    description: "",
    image: "",
    quantityStock: 0,
    price: 0,
    categoryId: "", 
    imageUrls: [],
  });

  const [categories, setCategories] = useState<{ id: string; categoryName: string }[]>([]); 
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/v4/api/Category");
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: name === "quantityStock" || name === "price" ? +value : value, 
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, isMainImage: boolean = false) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);

      if (isMainImage) {
        const mainImageFile = newFiles[0];
        const mainImageUrl = await convertToBase64(mainImageFile).then(base64 => `/images/imgProductMain/${mainImageFile.name}`);
        setProduct(prev => ({ ...prev, image: mainImageUrl }));
      } else {
        const supplementaryImageUrls = await Promise.all(
          newFiles.map(file => convertToBase64(file).then(base64 => `/images/imgProducts/${file.name}`))
        );
        setProduct(prev => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...supplementaryImageUrls],
        }));
      }
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Hàm để xóa hình ảnh phụ
  const removeImageUrl = (index: number) => {
    setProduct(prev => {
      const updatedImageUrls = prev.imageUrls.filter((_, idx) => idx !== index);
      return { ...prev, imageUrls: updatedImageUrls };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const productData = {
      productName: product.productName,
      quantitySellSucesss: product.quantitySellSucesss,
      description: product.description,
      image: product.image,
      quantityStock: product.quantityStock,
      price: product.price,
      categoryId: product.categoryId,
      imageUrls: product.imageUrls,
    };
  
    const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."; 
  
    try {
      await axios.post(
        "/v2/api/Product",
        productData,
        {
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
          }
        }
      );
      alert("Sản phẩm đã được thêm thành công!");
      navigate("/product"); 
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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Thêm Sản Phẩm Mới</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
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
        
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Mô tả</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Chọn Hình Ảnh Chính</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, true)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Chọn Hình Ảnh Phụ</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageChange(e)} 
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Display selected image URLs with remove option */}
        <div className="mt-6">
          <h2 className="text-lg ">Hình ảnh phụ:</h2>
          <ul>
            {product.imageUrls.map((url, index) => (
              <li key={index} className="flex justify-between items-center text-gray-700">
                <span>{url}</span>
                <button type="button" onClick={() => removeImageUrl(index)} className="text-red-500 hover:underline">
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Số lượng tồn kho</label>
          <input
            type="number"
            name="quantityStock"
            value={product.quantityStock}
            onChange={handleChange}
            min={1} 
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Giá</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            min={0} 
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Danh mục</label>
          <select
            name="categoryId"
            value={product.categoryId}
            onChange={handleChange}
            className="w-full p-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Chọn danh mục</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.categoryName}</option>
            ))}
          </select>
        </div>
        
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
          Thêm Sản Phẩm
        </button>
      </form>
    </div>
  );
};

export default ProductAdd;
