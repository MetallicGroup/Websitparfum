import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "./products";

const DISCOUNT_STORAGE_KEY = "luxe_parfum_discount";

type CartItem = Product & { quantity: number };

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  discountedTotal: number;
  discountAmount: number;
  hasDiscount: boolean;
  applyDiscount: () => void;
  shippingCost: number;
  grandTotal: number;
  itemsCount: number;
  shippingThreshold: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasDiscount, setHasDiscount] = useState(false);
  const SHIPPING_THRESHOLD = 250;
  const SHIPPING_COST = 19.99;
  const DISCOUNT_PERCENT = 0.05;

  useEffect(() => {
    const savedDiscount = localStorage.getItem(DISCOUNT_STORAGE_KEY);
    if (savedDiscount === "true") {
      setHasDiscount(true);
    }
  }, []);

  const applyDiscount = () => {
    setHasDiscount(true);
    localStorage.setItem(DISCOUNT_STORAGE_KEY, "true");
  };

  const addToCart = (product: Product) => {
    setItems(current => {
      const existing = current.find(item => item.id === product.id);
      if (existing) {
        return current.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });

    // TikTok Pixel - AddToCart Event
    if (typeof window !== 'undefined' && (window as any).ttq) {
      (window as any).ttq.track('AddToCart', {
        content_id: product.id,
        content_name: product.name,
        content_type: 'product',
        price: product.price,
        currency: 'RON',
        quantity: 1,
      });
    }

    // Facebook Pixel - AddToCart Event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'AddToCart', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: product.price,
        currency: 'RON',
      });
    }

    // Track cart add for visitor tracking
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent("cart-add"));
    }
  };

  const removeFromCart = (id: string) => {
    setItems(current => current.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(current => 
      current.map(item => item.id === id ? { ...item, quantity } : item)
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = hasDiscount ? total * DISCOUNT_PERCENT : 0;
  const discountedTotal = total - discountAmount;
  const shippingCost = discountedTotal >= SHIPPING_THRESHOLD ? 0 : (discountedTotal > 0 ? SHIPPING_COST : 0);
  const grandTotal = discountedTotal + shippingCost;
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      discountedTotal,
      discountAmount,
      hasDiscount,
      applyDiscount,
      shippingCost,
      grandTotal,
      itemsCount,
      shippingThreshold: SHIPPING_THRESHOLD
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
