import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Decorative Wave */}
      <div className={styles.waveContainer}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={styles.wave}>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.85,116.1,195.4,97.74,238.45,85.52,282.84,67.63,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className={`container ${styles.footerContent}`}>
        <div className={styles.grid}>
          
          {/* Brand & About */}
          <div className={styles.column}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoText}>Kiddy</span>
              <span className={styles.logoAccent}>Shop</span>
            </Link>
            <p className={styles.description}>
              Haine, jucării și accesorii premium pentru cei mici. Calitate și zâmbete în fiecare colet!
            </p>
            <div className={styles.social}>
              <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.column}>
            <h3 className={styles.heading}>Magazin</h3>
            <ul className={styles.links}>
              <li><Link href="/shop?category=haine">Haine Copii</Link></li>
              <li><Link href="/shop?category=jucarii">Jucării</Link></li>
              <li><Link href="/shop?category=bebe">Pentru Bebeluși</Link></li>
              <li><Link href="/shop?isNew=true">Noutăți</Link></li>
              <li><Link href="/shop?isPopular=true">Bestsellers</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className={styles.column}>
            <h3 className={styles.heading}>Suport Clienți</h3>
            <ul className={styles.links}>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/livrare">Livrare și Returnare</Link></li>
              <li><Link href="/faq">Întrebări Frecvente</Link></li>
              <li><Link href="/termeni">Termeni și Condiții</Link></li>
              <li><Link href="/politica-confidentialitate">Politică de Confidențialitate</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.column}>
            <h3 className={styles.heading}>Contact</h3>
            <ul className={styles.contactList}>
              <li><MapPin size={18} /> Str. Principală Nr. 1, București</li>
              <li><Phone size={18} /> 07xx xxx xxx</li>
              <li><Mail size={18} /> contact@kiddyshop.ro</li>
            </ul>
            <div className={styles.trustBadges}>
              {/* Trust badge placeholders */}
              <div className={styles.badge}>Plăți Sigure</div>
              <div className={styles.badge}>Livrare Rapidă</div>
            </div>
          </div>

        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} KiddyShop. Toate drepturile rezervate.</p>
        </div>
      </div>
    </footer>
  );
}
