import React from 'react';
import styles from '../legal.module.css';

export const metadata = {
  title: 'Livrare și Returnare | KiddyShop',
  description: 'Informații despre metodele de livrare și politica de retur la KiddyShop.',
};

export default function ShippingPage() {
  return (
    <div className={`container ${styles.legalContainer}`}>
      <h1 className={styles.title}>Livrare și Returnare</h1>
      <div className={styles.content}>
        <h2>Metode de Livrare</h2>
        <p>Livrăm oriunde în România folosind următoarele servicii de curierat:</p>
        <ul>
          <li><strong>Sameday Courier:</strong> 20.00 Lei (24-48h)</li>
          <li><strong>Easybox (Sameday):</strong> 15.00 Lei (24-48h)</li>
          <li><strong>Fan Courier:</strong> 25.00 Lei (24h)</li>
        </ul>
        <p><strong>LIVRARE GRATUITĂ</strong> pentru toate comenzile ce depășesc valoarea de 300 Lei!</p>
        
        <h2>Politica de Returnare</h2>
        <p>Dacă nu ești mulțumit de produs, îl poți returna în termen de 14 zile calendaristice de la primire.</p>
        <p>Condiții de retur:</p>
        <ul>
          <li>Produsul trebuie să fie în starea originală, cu etichetele intacte.</li>
          <li>Produsul nu trebuie să prezinte urme de purtare sau spălare.</li>
          <li>Costul transportului pentru retur este suportat de către client, cu excepția cazului în care produsul este defect.</li>
        </ul>
        
        <span className={styles.lastUpdated}>Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}</span>
      </div>
    </div>
  );
}
