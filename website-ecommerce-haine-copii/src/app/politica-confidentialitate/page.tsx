import React from 'react';
import styles from '../legal.module.css';

export const metadata = {
  title: 'Politică de Confidențialitate | KiddyShop',
  description: 'Cum protejăm și folosim datele tale personale la KiddyShop.',
};

export default function PrivacyPage() {
  return (
    <div className={`container ${styles.legalContainer}`}>
      <h1 className={styles.title}>Politică de Confidențialitate</h1>
      <div className={styles.content}>
        <p>Protecția datelor dumneavoastră este prioritară pentru noi la KiddyShop. Această politică explică modul în care colectăm și folosim informațiile dumneavoastră.</p>
        
        <h2>1. Date Colectate</h2>
        <p>Colectăm numele, adresa de email, numărul de telefon și adresa de livrare pentru a procesa comenzile dumneavoastră.</p>
        
        <h2>2. Scopul Prelucrării</h2>
        <p>Datele sunt folosite exclusiv pentru: procesarea comenzilor, livrarea produselor, comunicarea cu clienții și, dacă v-ați abonat, trimiterea de newslettere.</p>
        
        <h2>3. Securitate</h2>
        <p>Folosim măsuri de securitate moderne pentru a proteja informațiile dumneavoastră împotriva accesului neautorizat.</p>
        
        <h2>4. Drepturile Dumneavoastră</h2>
        <p>Aveți dreptul de a solicita accesul la datele dumneavoastră personnel, rectificarea sau ștergerea acestora în orice moment, printr-un mail la adresa de contact.</p>
        
        <span className={styles.lastUpdated}>Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}</span>
      </div>
    </div>
  );
}
