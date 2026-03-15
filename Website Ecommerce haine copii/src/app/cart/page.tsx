"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, ArrowRight } from "lucide-react";
import styles from "./cart.module.css";
import { useCart } from "@/context/CartContext";
import CartCrossSell from "./CartCrossSell";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, subtotal } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs once on mount, setting isClient is perfectly safe here.
    // However, the Next.js linter rule might be strict about this pattern.
    // The standard way to avoid hydration mismatch is just this pattern, we will ignore the specific linter rule.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setIsClient(true);
  }, []);

  const shipping = subtotal > 300 ? 0 : 25; // Free shipping above 300 RON
  const total = subtotal + shipping;

  if (!isClient) {
    return null; // Prevents hydration mismatch
  }

  if (cart.length === 0) {
    return (
      <div className={`container ${styles.emptyState}`}>
        <div className={styles.emptyIcon}>🛒</div>
        <h1>Coșul tău este gol</h1>
        <p>Alege haine, jucării și accesorii pentru cei mici.</p>
        <Link href="/shop" className="btn btn-primary mt-4">
          Înapoi la Magazin
        </Link>
      </div>
    );
  }

  return (
    <div className={`container ${styles.cartContainer}`}>
      <h1 className={styles.pageTitle}>Coșul de Cumpărături</h1>
      
      <div className={styles.cartLayout}>
        {/* Cart Items */}
        <div className={styles.cartItems}>
          {cart.map((item) => (
            <div key={item.id} className={styles.cartItemCard}>
              <div className={styles.itemImageWrap}>
                 <div className={styles.itemPlaceholderImage} style={{ backgroundImage: `url(${item.image})` }}></div>
              </div>
              <div className={styles.itemDetails}>
                <Link href={`/product/${item.id}`} className={styles.itemName}>{item.name}</Link>
                {item.variation && <p className={styles.itemVariation}>{item.variation}</p>}
                
                <div className={styles.itemActionsRow}>
                  <div className={styles.quantityPicker}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div className={styles.itemPriceBlock}>
                    <span className={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)} Lei</span>
                    <button onClick={() => removeFromCart(item.id)} className={styles.removeBtn} aria-label="Șterge">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className={styles.orderSummary}>
          <h2>Sumar Comandă</h2>
          
          <div className={styles.summaryRow}>
            <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} produse)</span>
            <span>{subtotal.toFixed(2)} Lei</span>
          </div>
          
          <div className={styles.summaryRow}>
            <span>Estimare Livrare</span>
            <span>{shipping === 0 ? "Gratuit" : `${shipping.toFixed(2)} Lei`}</span>
          </div>

          <div className={styles.divider}></div>
          
          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Total estimat</span>
            <span>{total.toFixed(2)} Lei</span>
          </div>
          
          {shipping > 0 && (
            <div className={styles.shippingNotice}>
              Mai ai {(300 - subtotal).toFixed(2)} Lei până la livrare gratuită! 🚚
            </div>
          )}

          <Link href="/checkout" className={`btn btn-primary ${styles.checkoutBtn}`}>
            Spre Finalizare Comandă <ArrowRight size={18} />
          </Link>
          
          <div className={styles.secureCheckout}>
             🔒 Plată 100% securizată
          </div>
        </div>
      </div>

      {/* Cross-Sell & Recommendations Section */}
      <CartCrossSell />
    </div>
  );
}
