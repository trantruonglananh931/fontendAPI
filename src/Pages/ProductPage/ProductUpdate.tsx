import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

type UpdateProduct = {
  id: string;
  productName: string;
  description: string;
  image: string;
  quantityStock: number;
  price: number;
  categoryId: string;
};

const ProductUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const [product, setProduct] = useState<UpdateProduct>({
    id: "",
    productName: "",
    description: "",
    image: "",
    quantityStock: 0,
    price: 0,
    categoryId: "",
  });
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."; 

      try {
        const response = await axios.get(`/v2/api/Product/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

     
        if (response.data && response.data.data) {
          setProduct(response.data.data);
        } else {
          console.error("Product data is not available");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("/v4/api/Category");
        if (response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data); 
        } else {
          console.error("Categories data is not an array");
          setCategories([]); 
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."; 

    try {
      await axios.put(
        `/v2/api/Product`, 
        product,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      alert("Product updated successfully!");
      navigate("/product"); 
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update the product.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Update Product</h1>
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
          <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
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
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-black font-semibold mb-2">Category</label>
          <select
            name="categoryId"
            value={product.categoryId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-black"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option className="text-black" key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-black font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductUpdate;
