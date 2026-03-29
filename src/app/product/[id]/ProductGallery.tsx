"use client";

import React, { useState } from "react";
import { Star, Truck, ShieldCheck, Heart, Share2 } from "lucide-react";
import styles from "./product.module.css";
import { Product, Category } from "@prisma/client";
import { useCart } from "@/context/CartContext";
import AddToCartModal from "@/components/cart/AddToCartModal";

type ProductWithCategory = Product & { 
  emagId?: string | null; 
  sku?: string | null;
  sizeCm?: string | null;
  category?: Category | null;
};

export default function ProductGallery({ product }: { product: ProductWithCategory }) {
  const { addToCart } = useCart();
  const images = JSON.parse(product.images || "[]");
  // Default to placeholder if no images exist
  const displayImages = images.length > 0 ? images : ["/placeholder.jpg"];
  const [mainImage, setMainImage] = useState(displayImages[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Safely parse variations or default to empty
  const variations = (() => {
    try {
      const parsed = JSON.parse(product.variations || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  const handleAddToCart = () => {
    if (variations.length > 0 && !selectedSize) {
      alert("Te rugăm să alegi o mărime întâi.");
      return;
    }

    const selectedVar = variations.find((v: any) => v.size === selectedSize);
    const variationLabel = selectedSize ? `Mărime: ${selectedSize}` : undefined;
    const cartItemId = selectedSize ? `${product.id}-${selectedSize}` : product.id;

    addToCart({
      id: cartItemId,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: mainImage,
      variation: variationLabel,
      maxStock: selectedVar ? selectedVar.stock : product.stock
    });

    setIsModalOpen(true);
  };

  return (
    <div className={styles.productLayout}>
      
      {/* L: Image Gallery */}
      <div className={styles.gallerySection}>
        <div className={styles.mainImageWrap}>
           <div className={styles.mainImagePlaceholder} style={{ backgroundImage: `url(${mainImage})` }}>
              {!mainImage.includes("/") && "Imagine Principală"}
           </div>
        </div>
        {displayImages.length > 1 && (
          <div className={styles.thumbnailsWrap}>
            {displayImages.map((img: string, idx: number) => (
              <div 
                key={idx} 
                className={`${styles.thumbnail} ${mainImage === img ? styles.activeThumb : ""}`}
                onClick={() => setMainImage(img)}
                style={{ backgroundImage: `url(${img})` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* R: Product Details */}
      <div className={styles.detailsSection}>
        <div className={styles.categoryBreadcrumb}>
          Acasă / {product.category?.name || "Categorie"} / <span>{product.name}</span>
        </div>
        
        <h1 className={styles.productTitle}>{product.name}</h1>
        
        <div className={styles.reviewSummary}>
          <div className={styles.stars}>
            <Star size={16} fill="#FBBF24" color="#FBBF24" />
            <Star size={16} fill="#FBBF24" color="#FBBF24" />
            <Star size={16} fill="#FBBF24" color="#FBBF24" />
            <Star size={16} fill="#FBBF24" color="#FBBF24" />
            <Star size={16} fill="#FBBF24" color="#FBBF24" />
          </div>
          <span className={styles.reviewCount}>(24 Recenzii)</span>
        </div>

        <div className={styles.priceContainer}>
          <span className={styles.price}>{product.price.toFixed(2)} Lei</span>
          {product.stock > 0 ? (
            <span className={styles.inStock}>În Stoc</span>
          ) : (
             <span className={styles.outOfStock}>Stoc Epuizat</span>
          )}
        </div>

        <p className={styles.descriptionText}>{product.description}</p>

        {variations.length > 0 && (
          <div className={styles.variationsWrap}>
            <h4 className={styles.variationTitle}>Alege Mărimea</h4>
            <div className={styles.sizesGrid}>
              {variations.map((v: {size: string, stock: number}, idx: number) => (
                <button 
                  key={idx}
                  className={`${styles.sizeBtn} ${selectedSize === v.size ? styles.activeSize : ""} ${v.stock <= 0 ? styles.sizeOutOfStock : ""}`}
                  onClick={() => v.stock > 0 && setSelectedSize(v.size)}
                  disabled={v.stock <= 0}
                >
                  {v.size}
                  {v.stock <= 0 && <span style={{fontSize: '8px', display: 'block'}}>Epuizat</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.actionsWrap}>
          <div className={styles.quantityPicker}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
          <button 
            className={`btn btn-primary ${styles.addToCartFullBtn}`}
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            Adaugă în coș
          </button>
          <button className={styles.iconActionBtn} aria-label="Favorite"><Heart size={22} /></button>
          <button className={styles.iconActionBtn} aria-label="Share"><Share2 size={22} /></button>
        </div>

        <div className={styles.trustBox}>
          <div className={styles.trustItem}>
            <Truck size={20} className={styles.trustIcon} />
            <div>
              <strong>Livrare Rapidă</strong>
              <p>În 1-2 zile lucrătoare prin Fan Courier sau Sameday.</p>
            </div>
          </div>
          <div className={styles.trustItem}>
            <ShieldCheck size={20} className={styles.trustIcon} />
            <div>
              <strong>Plată Securizată</strong>
              <p>Card online (Stripe) sau ramburs la primire.</p>
            </div>
          </div>
        </div>

      </div>

      <AddToCartModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={product.name}
        productId={product.id}
      />
    </div>
  );
}
