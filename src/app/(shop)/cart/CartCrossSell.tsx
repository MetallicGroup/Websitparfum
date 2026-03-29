"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getRecommendedProducts } from "@/actions/cross-sell";
import { useCart } from "@/context/CartContext";
import { Product } from "@prisma/client";
import { Plus } from "lucide-react";
import AddToCartModal from "@/components/cart/AddToCartModal";

export default function CartCrossSell() {
  const { cart, addToCart } = useCart();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState<{ isOpen: boolean; productId: string; productName: string }>({
    isOpen: false,
    productId: "",
    productName: "",
  });

  useEffect(() => {
    async function fetchRecommended() {
      setIsLoading(true);
      const productIds = cart.map((item) => item.productId);
      const result = await getRecommendedProducts(productIds, 4);
      if (result.success && result.data) {
        setRecommendations(result.data);
      }
      setIsLoading(false);
    }
    fetchRecommended();
  }, [cart]);

  if (isLoading) {
    return (
      <div className="mt-12 mb-8 text-center text-gray-400 animate-pulse">
        Se caută recomandări pentru tine...
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  const handleQuickAdd = (product: Product) => {
    const images = JSON.parse(product.images || "[]");
    const mainImage = images.length > 0 ? images[0] : "/placeholder.jpg";

    // Default variations handle for quick add. If they require sizes, we add standard/first size or prompt.
    // Simplifying: we just add with no variation if none is strictly selected here.
    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: mainImage,
      maxStock: product.stock,
    });

    setModalState({
      isOpen: true,
      productId: product.id,
      productName: product.name,
    });
  };

  return (
    <div className="mt-16 mb-8 w-full border-t border-gray-100 pt-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800" style={{ fontFamily: "var(--font-heading)" }}>
        Completări perfecte pentru comanda ta
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {recommendations.map((product) => {
          const images = JSON.parse(product.images || "[]");
          const mainImage = images.length > 0 ? images[0] : "/placeholder.jpg";

          return (
            <div
              key={product.id}
              className="group relative flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <Link href={`/product/${product.id}`} className="aspect-[4/5] overflow-hidden bg-gray-50 relative">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${mainImage})` }}
                />
                {product.isNew && (
                  <span className="absolute top-2 left-2 bg-turquoise text-white text-xs font-bold px-2 py-1 rounded">
                    Nou
                  </span>
                )}
              </Link>

              <div className="p-4 flex flex-col flex-grow">
                <Link
                  href={`/product/${product.id}`}
                  className="font-semibold text-gray-800 line-clamp-2 mb-1 hover:text-turquoise transition-colors"
                >
                  {product.name}
                </Link>
                <div className="flex-grow"></div>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-gray-900">{product.price.toFixed(2)} Lei</span>
                  <button
                    onClick={() => handleQuickAdd(product)}
                    className="bg-gray-100 hover:bg-turquoise hover:text-white text-gray-600 p-2 rounded-full transition-colors focus:outline-none"
                    aria-label="Adaugă rapid în coș"
                    title="Adaugă în coș"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AddToCartModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        productName={modalState.productName}
        productId={modalState.productId}
      />
    </div>
  );
}
