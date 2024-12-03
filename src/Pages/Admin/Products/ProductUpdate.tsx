import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Product} from "../../../Models/Product";
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
  });
  const [categories, setCategories] = useState<{ id: string; categorName: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is an admin
    if (user?.role !== "Admin") {
      navigate("/product"); // Redirect to another page if not admin
    }
    const fetchProductDetails = async () => {
      const token = user?.token;
      
      try {
        const response = await axios.get(`/v2/api/Product/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data && response.data.data) {
          setProduct(response.data.data);
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
  }, [id]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct((prev) => ({
          ...prev,
          image: reader.result as string, 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
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
          <label className="block text-gray-700 font-semibold mb-2">Chọn hình ảnh</label>
          <input
            type="file"
            accept="image/*" // Chỉ cho phép chọn hình ảnh
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          {product.image && (
            <img
              src={product.image}
              alt="Product Preview"
              className="mt-2 w-28 h-40 object-cover rounded-lg"
            />
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Số lượng trong kho</label>
          <input
            type="number"
            name="quantityStock"
            value={product.quantityStock}
            onChange={handleChange}
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
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-black font-semibold mb-2">Danh mục</label>
          <select
            name="categoryId"
            value={product.categoryId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-black"
            required
          >
            <option value="">Chọn một danh mục</option>
            {categories.map((category) => (
              <option className="text-black" key={category.id} value={category.id}>
                {category.categorName}
              </option>
            ))}
          </select>
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
