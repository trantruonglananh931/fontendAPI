import React, { createContext, useState, ReactNode } from "react";
import { CartItem } from "../Models/CartItem";

interface CartContextType {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

// Giả sử bạn tạo ra giá trị mặc định
const defaultValue: CartContextType = {
  cartItems: [],
  setCartItems: () => {}
};

export const CartContext = createContext<CartContextType>(defaultValue);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(JSON.parse(localStorage.getItem("cart") || "[]"));
  return (
    <CartContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};
