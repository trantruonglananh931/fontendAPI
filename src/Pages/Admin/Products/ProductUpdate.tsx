import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Product } from "../../../Models/Product"; 
import { useAuth } from "../../../Context/useAuth";

const ProductUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const token = user?.token;
  const [product, setProduct] = useState<Product>({
    id: "",
    productName: "",
    description: "",
    image: "",
    quantityStock: 0,
    price: 0,
    categoryId: "",
    listStringImage: [],
    sizeDetails: Array.from({ length: 7 }, (_, index) => ({
      sizeId: index + 8, 
      sizeName: "Test",
      quantity: 0,        
    })),
  });
  const [categories, setCategories] = useState<{ id: string; categorName: string }[]>([]);
  const [loading, setLoading] = useState(true);
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
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/v2/api/Product/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data && response.data.data) {
          const fetchedData = response.data.data;
          setProduct(prev => ({
            ...prev,
            ...fetchedData,
            sizeDetails: fetchedData.sizeDetails && fetchedData.sizeDetails.length > 0 
              ? fetchedData.sizeDetails 
              : Array.from({ length: 7 }, (_, index) => ({
                  sizeId: index + 8,
                  quantity: 0,
                })),
          }));

          
        } else {
          console.error("Dữ liệu sản phẩm không khả dụng");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };
    
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/v4/api/Category");
        if (response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          console.error("Dữ liệu danh mục không phải là một mảng");
          setCategories([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    fetchCategories();
  }, [id, token, user?.role, navigate]);

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
            setProduct(prev => ({ ...prev, image: response.data.urls[0] }));
          } else {
            setProduct(prev => ({ ...prev, listStringImage: [...prev.listStringImage, ...response.data.urls] }));
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
      const updatedImageUrls = prev.listStringImage.filter((_, idx) => idx !== index);
      return { ...prev, listStringImage: updatedImageUrls };
    });
  };

  const handleSizeDetailChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedSizes = [...product.sizeDetails];
    updatedSizes[index].quantity = Math.max(+e.target.value, 0); 

    const totalQuantity = updatedSizes.reduce((sum, size) => sum + size.quantity, 0);
    
    setProduct({ 
      ...product, 
      sizeDetails: updatedSizes,
      quantityStock: totalQuantity,
    });
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Thông tin sản phẩm sau khi nhấn submit:", product);

    try {
      await axios.put(
        `/v2/api/Product`,
        product,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: '*/*',
          },
        }
      );
      alert("Cập nhật sản phẩm thành công!");
      navigate("/admin/productlist");
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      alert("Cập nhật sản phẩm thất bại.");
    }
  };

  if (loading) {
    return <p>Đang tải...</p>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg ">
      <h1 className="text-2xl font-bold mb-6">Cập nhật sản phẩm</h1>
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
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-gray-700 font-semibold mb-2">Chọn hình ảnh chính</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, true)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <div className="mt-2">
              {product.image && (
                <>
                  <img src={product.image} alt="Hình ảnh chính" className="w-40 h-45 object-cover border border-gray-300 rounded-md" />
                  <p className="text-gray-600 mt-1">{product.image}</p> {/* Hiển thị đường link hình ảnh chính */}
                </>
              )}
            </div>
          </div>
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700 font-semibold mb-2">Chọn hình ảnh phụ</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageChange(e)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <div className="mt-2">
              <ul>
                {Array.isArray(product.listStringImage) && product.listStringImage.map((url, index) => (
                  <li key={index} className="text-gray-700 flex items-center">
                    <img src={url} alt={`Hình ảnh phụ ${index + 1}`} className="w-20 h-25 mt-2 object-cover border border-gray-300 rounded-md mr-2" />
                    <span>{url}</span>
                    <button type="button" onClick={() => removeImageUrl(index)} className="ml-2 text-red-500 hover:underline">
                      Xóa
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
          <h2 className="text-lg font-semibold">Thông tin Size</h2>
          <div className="flex items-center space-x-6">
            {Array.isArray(product.sizeDetails) && product.sizeDetails.map((sizeDetails, index) => (
              <div key={index} className="flex items-center space-x-2">
                <label className="text-sm font-semibold text-gray-700">{sizeMapping[sizeDetails.sizeId]}:</label>
                <input
                  type="number"
                  value={sizeDetails.quantity !=0 ? sizeDetails.quantity : 0 }  
                  onChange={(e) => handleSizeDetailChange(e, index)}
                  className="w-16 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-center"
                  placeholder="0"
                  min="0"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-black font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Cập nhật sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductUpdate;
