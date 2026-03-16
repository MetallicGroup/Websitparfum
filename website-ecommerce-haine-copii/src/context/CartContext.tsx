"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string; // the product id + variation string concatenated for uniqueness
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variation?: string;
  maxStock: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load from local storage
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setIsMounted(true);
    const storedCart = localStorage.getItem("clothing_store_cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (err) {
        console.error("Failed to parse cart", err);
      }
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("clothing_store_cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === newItem.id);
      if (existingItem) {
        // limit to stock
        const potentialQuantity = existingItem.quantity + newItem.quantity;
        const boundedQuantity = Math.min(potentialQuantity, existingItem.maxStock);
        
        return prev.map((item) =>
          item.id === newItem.id ? { ...item, quantity: boundedQuantity } : item
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(quantity, item.maxStock) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
