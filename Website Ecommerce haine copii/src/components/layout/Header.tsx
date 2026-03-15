"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, User } from 'lucide-react';
import styles from './Header.module.css';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { itemCount } = useCart();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        
        {/* Mobile Menu Icon */}
        <button className={styles.mobileMenuBtn}>
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Kiddy</span>
          <span className={styles.logoAccent}>Shop</span>
          <div className={`${styles.logoDecoration} playful-shape`}></div>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          <Link href="/shop" className={styles.navLink}>Produse</Link>
          <Link href="/shop?category=haine" className={styles.navLink}>Haine</Link>
          <Link href="/shop?category=jucarii" className={styles.navLink}>Jucării</Link>
          <Link href="/shop?category=bebe" className={styles.navLink}>Bebe</Link>
        </nav>

        {/* Action Icons */}
        <div className={styles.actions}>
          <button className={styles.iconBtn} aria-label="Caută">
            <Search size={22} />
          </button>
          
          <Link href="/admin" className={styles.iconBtn} aria-label="Contul meu">
            <User size={22} />
          </Link>
          
          <Link href="/cart" className={styles.cartBtn} aria-label="Coș cumpărături">
            <ShoppingCart size={22} />
            {isClient && itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
          </Link>
        </div>

      </div>
    </header>
  );
}
