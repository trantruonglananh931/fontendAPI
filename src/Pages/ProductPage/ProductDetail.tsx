import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

type Product = {
  id: string;
  productName: string;
  quantitySellSucesss: number;
  description: string;
  image: string;
  quantityStock: number;
  price: number;
  categoryName: string;
  listStringImage: string[];
};

type CartItem = {
  ProductId: string;
  productName: string;
  price: number;
  Quantity: number;
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageList, setImageList] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchProductDetail = async () => {
      const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...";

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
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProductDetail();
  }, [id]);

  if (!product) {
    return <div className="text-center">Loading...</div>;
  }

  const handleAddToCart = async () => {
    const cartItem: CartItem = {
      ProductId: product.id,
      productName: product.productName,
      price: product.price,
      Quantity: quantity,
    };
    try {
      const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...";

      await axios.post("/v2/api/Product/sessions", cartItem, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("Product has been added to the cart!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-6 bg-white ">
      <div className="flex flex-col lg:flex-row items-stretch">
        {/* Left Thumbnail Images */}
        <div className="w-full lg:w-1/12 flex flex-col space-y-2 mb-4 lg:mb-0">
          {imageList.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Product thumbnail ${index + 1}`}
              className={`w-20 h-30 object-cover cursor-pointer ${
                currentImageIndex === index
                  ? "border-2 border-blue-600"
                  : "border border-gray-300"
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>

        {/* Large Image */}
        <div className="relative w-full lg:w-1/2 flex items-center justify-center">
          <img
            src={imageList[currentImageIndex]}
            alt={`Product image ${currentImageIndex + 1}`}
            className="w-full h-[700px] object-cover shadow-md"
          />
        </div>

        {/* Product Details */}
        <div className="lg:ml-6 w-full lg:w-1/2 space-y-4">
          <h1 className="text-2xl font-bold">{product.productName}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-red-600 text-3xl font-semibold">${product.price}</p>
          <p className="text-gray-600">Sold: {product.quantitySellSucesss}</p>

          {/* Product Quantity */}
          <div className="flex items-center space-x-6">
            <label className="text-lg">Quantity:</label>
            <div className="flex items-center border rounded-md">
              <button
                className="px-4 py-3"
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                className="px-4 py-3"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <div className="ml-4">
              <button
                onClick={handleAddToCart}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <button className="bg-orange-500 text-white px-56 py-3 rounded-lg hover:bg-orange-600 transition-colors">
              Buy Now
            </button>
          </div>

          {/* Payment Methods */}
        <div className="flex flex-col items-center ">
          <div className="flex items-center justify-center space-x-4">
            <img src="https://cdn.tgdd.vn/2020/04/GameApp/image-180x180.png" alt="ZaloPay" className="w-12" />
            <img src="https://d-russia.ru/wp-content/uploads/2014/05/visa-mastercard.jpg" alt="Visa" className="w-12" />
            <img src="https://cdn.coin68.com/uploads/2019/01/The%CC%89-Mastercard-la%CC%80-gi%CC%80-Nhu%CC%9B%CC%83ng-tho%CC%82ng-tin-ca%CC%82%CC%80n-thie%CC%82%CC%81t-ve%CC%82%CC%80-Mastercard.png" alt="MasterCard" className="w-12" />
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp1v7T287-ikP1m7dEUbs2n1SbbLEqkMd1ZA&s" alt="VNPAY" className="w-12" />
            <img src="https://cdn.tgdd.vn/2020/03/GameApp/Untitled-2-200x200.jpg" alt="MoMo" className="w-12" />
          </div>
          
          {/* Ensure safe and secure payments message */}
          <p className="mt-2 text-center text-xs text-gray-600">
            Ensure safe and secure payments
          </p>
        </div>



          {/* Payment Information */}
          <div className="mt-4 text-gray-600">
      
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li className="flex items-center">
                <img src="https://cdn-icons-png.flaticon.com/128/5074/5074275.png" alt="Free Shipping" className="w-6 h-6 mr-2" />
                Free Shipping: Orders from $99
              </li>
              <li className="flex items-center">
                <img src="https://cdn-icons-png.flaticon.com/128/7602/7602640.png" alt="Delivery Time" className="w-6 h-6 mr-2" />
                Delivery: 3 - 5 days nationwide
              </li>
              <li className="flex items-center">
                <img src="https://cdn-icons-png.flaticon.com/128/3917/3917307.png" alt="Return Policy" className="w-6 h-6 mr-2" />
                Free returns within 7 days
              </li>
              <li className="flex items-center">
                <img src="https://cdn-icons-png.flaticon.com/128/7653/7653263.png" alt="Discount" className="w-6 h-6 mr-2" />
                Use discount codes at checkout
              </li>
              <li className="flex items-center">
                <img src="https://cdn-icons-png.flaticon.com/128/3917/3917579.png" alt="Security" className="w-6 h-6 mr-2" />
                Information security and encryption
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
