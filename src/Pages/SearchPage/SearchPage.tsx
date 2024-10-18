import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';


type Product = {
  id: string;
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
  const [sortOrder, setSortOrder] = useState<boolean | null>(null); 
  const location = useLocation();

  const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRyYW50cnVvbmdsYW5hbmgwQGdtQUlMLkNPTSIsImdpdmVuX25hbWUiOiJzdHJpbmcxMiIsIm5iZiI6MTcyOTIzMjU3MywiZXhwIjoxNzI5ODM3MzczLCJpYXQiOjE3MjkyMzI1NzMsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTI0NiIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTI0NiJ9.9PCXyZrBKxF_GFvllrK7O7f9TfCxaXFEwvhU7XJ1nzqJMYLMEfwDAxD_Gs9bLABcXXnyivISsx3ySXfnUoJmvg";

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query') || '';
    setSearchTerm(query);
    fetchProducts(query);
  }, [location.search, sortOrder]);

  const fetchProducts = async (query: string) => {
    try {
      const response = await axios.get(`/v2/api/Product?productName=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*',
        }
      });

      if (response.data && response.data.data) {
        let fetchedProducts = response.data.data;


        if (sortOrder !== null) {
          fetchedProducts = fetchedProducts.sort((a: Product, b: Product) =>
            sortOrder ? a.price - b.price : b.price - a.price
          );
        }

        setProducts(fetchedProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(searchTerm.trim());
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'asc') {
      setSortOrder(true);
    } else if (value === 'desc') {
      setSortOrder(false);
    } else {
      setSortOrder(null);
    }
  };

  const handleDetail = (productId: string) => {
    alert(`View details of product with ID: ${productId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        
        <select
          onChange={handleSortChange}
          value={sortOrder === null ? "none" : sortOrder ? "asc" : "desc"}
          className="py-2 px-4 border border-gray-300 rounded-lg"
        >
          <option value="none">Sort by Price</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <li
              key={product.id}
              className="cursor-pointer"
              onClick={() => handleDetail(product.id)}
            >
              <img
                src={product.image}
                alt={product.productName}
                className="w-full h-150 object-cover"
              />
              <div className="mt-4">
                <h2 className="text-l">{product.productName}</h2>
                <p className="text-gray-800 font-semibold">${product.price}</p>
                <p className="text-gray-600">{product.categoryName}</p>
              </div>
            </li>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </ul>
    </div>
  );
};

export default SearchPage;
