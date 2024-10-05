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

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/v4/api/Category");
        if (response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          console.error("Categories data is not an array", response.data);
          setCategories([]); 
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
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


  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  
  const addImageUrl = () => {
    if (imageUrl) {
      setProduct((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, imageUrl],
      }));
      setImageUrl(""); 
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      productName: product.productName,
      quantitySellSucesss: product.quantitySellSucesss,
      description: product.description,
      image: product.image, // Hình ảnh chính
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
      alert("Product added successfully!");
      navigate("/product"); 
    } catch (error: any) {
      console.error("Error adding product:", error.response?.data || error.message);
      alert("Failed to add the product: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Product Name</label>
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
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        
       
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Main Image URL</label>
          <input
            type="text"
            name="image"
            value={product.image}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        
       
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Quantity in Stock</label>
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
          <label className="block text-gray-700 font-semibold mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            min={0} // Đặt giá trị tối thiểu là 0
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        
        {/* Danh mục sản phẩm */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Category</label>
          <select
            name="categoryId"
            value={product.categoryId}
            onChange={handleChange}
            className="w-full p-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>
        
        {/* URL hình ảnh phụ */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Additional Image URLs</label>
          <input
            type="text"
            value={imageUrl}
            onChange={handleImageUrlChange}
            placeholder="Enter image URL"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={addImageUrl}
            className="mt-2 bg-green-500 text-white font-semibold py-1 px-4 rounded-lg hover:bg-green-600"
          >
            Add Image
          </button>
          <ul className="mt-2">
            {product.imageUrls.map((url, index) => (
              <li key={index} className="text-gray-600">{url}</li>
            ))}
          </ul>
        </div>
        
        {/* Nút thêm sản phẩm */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductAdd;
