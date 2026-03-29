"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, User } from 'lucide-react';
import styles from './Header.module.css';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { itemCount } = useCart();
  const [isClient, setIsClient] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        
        <div className="flex items-center gap-4">
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
        </div>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input 
              type="text" 
              placeholder="Caută hăinuțe sau jucării..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchBtn}>
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          <Link href="/shop" className={styles.navLink}>Produse</Link>
          <Link href="/shop?category=haine" className={styles.navLink}>Haine</Link>
          <Link href="/shop?category=bebe" className={styles.navLink}>Bebe</Link>
          <Link href="/shop?category=jucarii" className={styles.navLink}>Jucării</Link>
        </nav>

        {/* Action Icons */}
        <div className={styles.actions}>
          <button className={`${styles.iconBtn} lg:hidden`} aria-label="Caută">
            <Search size={22} />
          </button>
          
          <Link href="/contul-meu" className={styles.iconBtn} aria-label="Contul meu">
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
