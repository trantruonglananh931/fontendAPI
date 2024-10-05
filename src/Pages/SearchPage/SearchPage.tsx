import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

type Product = {
  productId: number;
  productName: string;
  quantitySellSucesss: number;
  description: string;
  image: string;
  quantityStock: number;
  price: number;
  categoryName: string;
};

const SearchPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query') || '';
    setSearchTerm(query);
    fetchProducts(query);
  }, [location.search]);

  const fetchProducts = async (query: string) => {
    try {
      const response = await axios.get<Product[]>(`/v2/api/Product?productName=${encodeURIComponent(query)}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(searchTerm.trim());
  };



  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
      
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.length > 0 ? (
          products.map(product => (
            <li key={product.productId} className="border rounded-lg shadow-md p-4 bg-white">
            <img
              src={product.image}
              alt={product.productName}
              className="w-full h-64 object-cover rounded-t-lg"
            />
            <div className="mt-4">
              <h2 className="text-xl font-bold">{product.productName}</h2>
              <p className="text-gray-600">Quantity Sold: {product.quantitySellSucesss}</p>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-gray-800 font-semibold">${product.price}</p>
              <p className="text-gray-600">{product.categoryName}</p>
            </div>
            
          </li>
          ))
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </ul>
      
    </div>
    </div>
  );
};

export default SearchPage;
