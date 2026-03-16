"use client"

import React, { useState, useEffect } from "react";
import { CreditCard, Wallet, Truck, Box } from "lucide-react";
import styles from "./checkout.module.css";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/actions/order";

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const [isClient, setIsClient] = useState(false);

  const [shippingMethod, setShippingMethod] = useState("sameday");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    county: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getShippingCost = () => {
    if (subtotal > 300) return 0;
    if (shippingMethod === 'easybox') return 15;
    if (shippingMethod === 'sameday') return 20;
    return 25;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Coșul este gol!");
      return;
    }
    
    setIsLoading(true);

    try {
      const orderData = {
        customerInfo: formData,
        shippingMethod,
        paymentMethod,
        items: cart,
        subtotal,
        shippingCost: getShippingCost(),
        total: subtotal + getShippingCost()
      };

      const result = await createOrder(orderData);
      
      if (result.success) {
        alert("Comanda a fost plasată cu succes! Vei fi contactat pentru detalii.");
        clearCart();
        window.location.href = "/";
      } else {
        alert("A apărut o eroare la salvarea comenzii: " + result.error);
      }
    } catch {
      alert("A apărut o eroare necunoscută la plasarea comenzii.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) return null;

  if (cart.length === 0) {
    return (
      <div className={`container ${styles.checkoutContainer}`}>
        <h1 className={styles.pageTitle}>Finalizare Comandă</h1>
        <p>Coșul tău este gol. Adaugă produse pentru a continua.</p>
        <Link href="/shop" className="btn btn-primary mt-4">Mergi la Magazin</Link>
      </div>
    );
  }

  return (
    <div className={`container ${styles.checkoutContainer}`}>
      <h1 className={styles.pageTitle}>Finalizare Comandă</h1>

      <div className={styles.checkoutLayout}>
        {/* Left Col: Form fields */}
        <div className={styles.formSection}>
          <form id="checkout-form" onSubmit={handleCheckout} className={styles.checkoutForm}>
            
            {/* 1. Contact Info */}
            <div className={styles.formGroup}>
              <h2 className={styles.sectionHeading}>1. Date de Contact</h2>
              <div className={styles.grid2}>
                <div className={styles.inputWrap}>
                  <label htmlFor="firstName">Prenume</label>
                  <input type="text" id="firstName" name="firstName" required value={formData.firstName} onChange={handleInputChange} />
                </div>
                <div className={styles.inputWrap}>
                  <label htmlFor="lastName">Nume de Familie</label>
                  <input type="text" id="lastName" name="lastName" required value={formData.lastName} onChange={handleInputChange} />
                </div>
                <div className={styles.inputWrap}>
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required value={formData.email} onChange={handleInputChange} />
                </div>
                <div className={styles.inputWrap}>
                  <label htmlFor="phone">Telefon</label>
                  <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className={styles.formGroup}>
              <h2 className={styles.sectionHeading}>2. Adresa de Livrare</h2>
              <div className={styles.inputWrap}>
                <label htmlFor="address">Adresă completă (Strada, număr, bloc, scara, apartament)</label>
                <input type="text" id="address" name="address" required value={formData.address} onChange={handleInputChange} />
              </div>
              <div className={styles.grid2}>
                <div className={styles.inputWrap}>
                   <label htmlFor="city">Oraș</label>
                   <input type="text" id="city" name="city" required value={formData.city} onChange={handleInputChange} />
                </div>
                <div className={styles.inputWrap}>
                   <label htmlFor="county">Județ</label>
                   <input type="text" id="county" name="county" required value={formData.county} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            {/* 3. Delivery Method */}
            <div className={styles.formGroup}>
              <h2 className={styles.sectionHeading}>3. Metodă de Livrare</h2>
              <div className={styles.radioGrid}>
                <label className={`${styles.radioCard} ${shippingMethod === 'sameday' ? styles.activeRadio : ''}`}>
                  <input type="radio" name="shipping" value="sameday" checked={shippingMethod === 'sameday'} onChange={() => setShippingMethod('sameday')} />
                  <div className={styles.radioContent}>
                     <div className={styles.iconBox}><Truck size={24} /></div>
                     <div>
                       <strong>Sameday Courier</strong>
                       <p>Livrare la domiciliu în 24-48h.</p>
                     </div>
                  </div>
                  <span className={styles.shippingPrice}>{subtotal > 300 ? "Gratuit" : "20.00 Lei"}</span>
                </label>
                
                <label className={`${styles.radioCard} ${shippingMethod === 'easybox' ? styles.activeRadio : ''}`}>
                  <input type="radio" name="shipping" value="easybox" checked={shippingMethod === 'easybox'} onChange={() => setShippingMethod('easybox')} />
                  <div className={styles.radioContent}>
                     <div className={styles.iconBox}><Box size={24} /></div>
                     <div>
                       <strong>Easybox</strong>
                       <p>Livrare la cel mai apropiat Easybox.</p>
                     </div>
                  </div>
                  <span className={styles.shippingPrice}>{subtotal > 300 ? "Gratuit" : "15.00 Lei"}</span>
                </label>
                
                <label className={`${styles.radioCard} ${shippingMethod === 'fancourier' ? styles.activeRadio : ''}`}>
                  <input type="radio" name="shipping" value="fancourier" checked={shippingMethod === 'fancourier'} onChange={() => setShippingMethod('fancourier')} />
                  <div className={styles.radioContent}>
                     <div className={styles.iconBox}><Truck size={24} /></div>
                     <div>
                       <strong>Fan Courier</strong>
                       <p>Livrare la domiciliu.</p>
                     </div>
                  </div>
                  <span className={styles.shippingPrice}>{subtotal > 300 ? "Gratuit" : "25.00 Lei"}</span>
                </label>
              </div>
              {subtotal <= 300 && (
                <div style={{marginTop: "10px", fontSize: "0.9rem", color: "#d97706"}}>
                  *Comenzile peste 300 de lei beneficiază de livrare gratuită. Mai ai de adăugat de {(300 - subtotal).toFixed(2)} Lei.
                </div>
              )}
            </div>

            {/* 4. Payment Method */}
            <div className={styles.formGroup}>
              <h2 className={styles.sectionHeading}>4. Metodă de Plată</h2>
              <div className={styles.radioGrid}>
                 <label className={`${styles.radioCard} ${paymentMethod === 'card' ? styles.activeRadio : ''}`}>
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                    <div className={styles.radioContent}>
                      <div className={styles.iconBox}><CreditCard size={24} /></div>
                      <div>
                        <strong>Card Bancar (MOCK)</strong>
                        <p>Simulare tranzacție (Comanda salvată, plata simulată prin bypass)</p>
                      </div>
                    </div>
                 </label>

                 <label className={`${styles.radioCard} ${paymentMethod === 'ramburs' ? styles.activeRadio : ''}`}>
                    <input type="radio" name="payment" value="ramburs" checked={paymentMethod === 'ramburs'} onChange={() => setPaymentMethod('ramburs')} />
                    <div className={styles.radioContent}>
                      <div className={styles.iconBox}><Wallet size={24} /></div>
                      <div>
                        <strong>Ramburs la livrare</strong>
                        <p>Plătești curierului.</p>
                      </div>
                    </div>
                 </label>
              </div>
            </div>

          </form>
        </div>

        {/* Right Col: Summary */}
        <div className={styles.summarySection}>
           <div className={styles.summaryCard}>
              <h2>Sumar Comandă</h2>
              
              <div className={styles.itemsList}>
                 {cart.map(item => (
                   <div key={item.id} className={styles.summaryItem}>
                      <span>{item.quantity}x {item.name} {item.variation && `(${item.variation})`}</span>
                      <span>{(item.quantity * item.price).toFixed(2)} Lei</span>
                   </div>
                 ))}
              </div>

              <div className={styles.divider}></div>
              
              <div className={styles.summaryRow}>
                 <span>Subtotal</span>
                 <span>{subtotal.toFixed(2)} Lei</span>
              </div>
              <div className={styles.summaryRow}>
                 <span>Livrare ({shippingMethod})</span>
                 <span>{getShippingCost() === 0 ? "Gratuit" : `${getShippingCost().toFixed(2)} Lei`}</span>
              </div>

              <div className={styles.divider}></div>
              
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                 <span>Total</span>
                 <span>{(subtotal + getShippingCost()).toFixed(2)} Lei</span>
              </div>

              <button 
                type="submit" 
                form="checkout-form"
                className={`btn btn-primary ${styles.placeOrderBtn}`}
                disabled={isLoading}
              >
                {isLoading ? "Se procesează..." : "Trimite Comanda"}
              </button>

              <div className={styles.termsNotice}>
                Prin plasarea comenzii, ești de acord cu <Link href="/termeni">Termenii și Condițiile</Link>.
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
