import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import styles from '../legal.module.css';

export const metadata = {
  title: 'Contact | KiddyShop',
  description: 'Contactează reba KiddyShop pentru orice întrebări sau suport.',
};

export default function ContactPage() {
  return (
    <div className={`container ${styles.legalContainer}`}>
      <h1 className={styles.title}>Contact</h1>
      <div className={styles.content}>
        <p>Suntem aici să te ajutăm! Ne poți contacta prin oricare dintre metodele de mai jos sau folosind formularul de contact.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={20} color="var(--color-turquoise)" /> Email
            </h3>
            <p>mariataralunga87@gmail.com</p>
          </div>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={20} color="var(--color-turquoise)" /> Telefon
            </h3>
            <p>07xx xxx xxx</p>
          </div>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} color="var(--color-turquoise)" /> Adresă
            </h3>
            <p>STR. REPUBLICII, NR.56, MIRACOLE SRL, BRAȘOV</p>
          </div>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} color="var(--color-turquoise)" /> Program
            </h3>
            <p>Luni - Vineri: 09:00 - 18:00</p>
          </div>
        </div>

        <div style={{ marginTop: '4rem', padding: '2rem', backgroundColor: 'var(--color-white)', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ marginTop: 0 }}>Trimite-ne un mesaj</h2>
          <form style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input type="text" placeholder="Numele tău" style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-gray-200)' }} />
              <input type="email" placeholder="Email" style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-gray-200)' }} />
            </div>
            <input type="text" placeholder="Subiect" style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-gray-200)' }} />
            <textarea placeholder="Mesajul tău..." rows={5} style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-gray-200)', fontFamily: 'inherit' }}></textarea>
            <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }}>Trimite Mesaj</button>
          </form>
        </div>
      </div>
    </div>
  );
}
