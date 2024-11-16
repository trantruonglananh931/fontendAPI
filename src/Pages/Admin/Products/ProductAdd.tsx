import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import { NewProduct } from "../../../Models/Product";

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
    sizeDetails: Array.from({ length: 7 }, (_, index) => ({
      sizeId: index + 1,  // Mặc định sizeId từ 1 đến 7
      quantity: 0,        // Mặc định quantity là 0
    })),
  });

  const [categories, setCategories] = useState<{ id: string; categoryName: string }[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const sizeMapping: { [key: number]: string } = {
    1: "XXS",
    2: "XS",
    3: "S",
    4: "M",
    5: "L",
    6: "XL",
    7: "XXL",
  };
  
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

  // Tính tổng số lượng từ sizeDetails
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
    updatedSizeDetails[index][field] = Math.max(+e.target.value, 0); // Đảm bảo min = 0

    const totalQuantity = calculateTotalQuantity(updatedSizeDetails);

    setProduct({
      ...product,
      sizeDetails: updatedSizeDetails,
      quantityStock: totalQuantity, // Cập nhật tổng số lượng
    });
  };
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, isMainImage: boolean = false) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const formData = new FormData();
  
      newFiles.forEach(file => {
        formData.append("files", file); // Thêm các file vào FormData
      });
  
      try {
        // Gửi hình ảnh lên API
        const response = await axios.post("/v2/api/images", formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          params: { isMainImage },
        });
        
        if (response.data.urls) {
          // Cập nhật sản phẩm với URL hình ảnh trả về
          if (isMainImage) {
            setProduct(prev => ({ ...prev, image: response.data.urls[0] }));
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

    const productData = {
      productName: product.productName,
      quantitySellSucesss: product.quantitySellSucesss,
      description: product.description,
      image: product.image,
      quantityStock: product.quantityStock,
      price: product.price,
      categoryId: product.categoryId,
      imageUrls: product.imageUrls,
      sizeDetails: product.sizeDetails,
    };

    const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...";

    try {
      await axios.post(
        "/v2/api/Product",
        productData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert("Sản phẩm đã được thêm thành công!");
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

        {/* Hình ảnh */}
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

        {/* Số lượng và Size */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Thông tin Size</h2>
          {product.sizeDetails.map((sizeDetail, index) => (
            <div key={index} className="flex space-x-4 mb-4">
              <input
                type="text"
                name="sizeId"
                value={sizeMapping[sizeDetail.sizeId]} // Hiển thị tên size tương ứng
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Size"
              />
              <input
                type="number"
                name="quantity"
                value={sizeDetail.quantity}
                onChange={(e) => handleSizeDetailChange(e, index, "quantity")}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Số lượng"
                required
              />
            </div>
          ))}
        </div>


        <div className="flex space-x-4">
        <div className="w-1/2">
          <label className="block text-gray-700 font-semibold mb-2">Giá</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            min="0" // Đảm bảo giá trị >= 0
            required
          />
        </div>

          <div className="w-1/2">
            <label className="block text-gray-700 font-semibold mb-2">Số lượng kho</label>
            <input
              type="number"
              name="quantityStock"
              value={product.quantityStock}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>
        </div>
        <div>
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
                {category.categoryName}
              </option>
            ))}
          </select>
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
