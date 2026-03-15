"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Check, X, Loader2 } from "lucide-react";
import styles from "./addToCartModal.module.css";
import { getRecommendedProducts } from "@/actions/cross-sell";
import { useCart } from "@/context/CartContext";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productId: string;
}

export default function AddToCartModal({ isOpen, onClose, productName, productId }: AddToCartModalProps) {
  const { addToCart } = useCart();
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setLoading(true);
      
      const fetchCrossSell = async () => {
        const res = await getRecommendedProducts([productId], 2);
        if (res.success) {
          setRecommended(res.data);
        }
        setLoading(false);
      };
      
      fetchCrossSell();
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen, productId]);

  if (!isOpen) return null;

  const handleDimmerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleUpsellAdd = (prod: any) => {
    const images = JSON.parse(prod.images || "[]");
    addToCart({
      id: prod.id,
      productId: prod.id,
      name: prod.name,
      price: prod.price,
      quantity: 1,
      image: images[0] || "/placeholder.jpg",
      maxStock: prod.stock
    });
    alert(`Ai adăugat ${prod.name} în coș!`);
  };

  return (
    <div className={styles.overlay} onClick={handleDimmerClick}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Închide"><X size={24} /></button>
        
        <div className={styles.header}>
          <div className={styles.successIcon}>
            <Check size={32} />
          </div>
          <h2 className={styles.title}>Produs Adăugat!</h2>
          <p className={styles.subtitle}><strong>{productName}</strong> a fost pus în coșul tău.</p>
          
          <div className={styles.actions}>
            <button className={`btn ${styles.btnShopping}`} onClick={onClose}>Continuă cumpărăturile</button>
            <Link href="/cart" className={`btn ${styles.btnCart}`}>Mergi în coș</Link>
          </div>
        </div>

        <div className={styles.upsellSection}>
          <h3 className={styles.upsellTitle}>Completarea perfectă a comenzii:</h3>
          {loading ? (
            <div className={styles.loader}><Loader2 size={32} /></div>
          ) : recommended.length > 0 ? (
            <div className={styles.upsellGrid}>
              {recommended.map((prod) => {
                const images = JSON.parse(prod.images || "[]");
                return (
                  <div key={prod.id} className={styles.upsellCard}>
                    <div className={styles.upsellImg} style={{ backgroundImage: `url(${images[0]})` }} />
                    <div className={styles.upsellName}>{prod.name}</div>
                    <div className={styles.upsellBottom}>
                      <span className={styles.upsellPrice}>{prod.price.toFixed(2)} Lei</span>
                      <button className={styles.upsellAdd} aria-label="Adaugă rapid" onClick={() => handleUpsellAdd(prod)}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className={styles.subtitle}>Nu avem sugestii momentan.</p>
          )}
        </div>
      </div>
    </div>
  );
}
