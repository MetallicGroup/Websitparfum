import React from 'react';
import styles from '../legal.module.css';

export const metadata = {
  title: 'Întrebări Frecvente (FAQ) | KiddyShop',
  description: 'Răspunsuri la cele mai frecvente întrebări despre produsele și serviciile KiddyShop.',
};

export default function FAQPage() {
  const faqs = [
    {
      q: "Cum pot anula o comandă?",
      a: "Puteți anula o comandă contactându-ne telefonic sau prin email în maxim 2 ore de la plasare."
    },
    {
      q: "Produsele sunt în stoc?",
      a: "Toate produsele care pot fi adăugate în coș sunt în stoc și gata de expediere."
    },
    {
      q: "Pot plăti la livrare?",
      a: "Da, acceptăm plata ramburs la curier pentru orice comandă."
    },
    {
      q: "Cum aflu mărimea potrivită?",
      a: "Fiecare produs are specificații privind vârsta recomandată. Dacă aveți dubii, ne puteți contacta pentru măsurători exacte."
    }
  ];

  return (
    <div className={`container ${styles.legalContainer}`}>
      <h1 className={styles.title}>Întrebări Frecvente (FAQ)</h1>
      <div className={styles.content}>
        {faqs.map((faq, index) => (
          <div key={index} style={{ marginBottom: '2rem' }}>
            <h3 style={{ borderBottom: '1px solid var(--color-gray-200)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
              {faq.q}
            </h3>
            <p>{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
