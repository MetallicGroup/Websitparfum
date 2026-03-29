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
        <p>Protecția datelor dumneavoastră este prioritară pentru noi la KiddyShop (operat de <strong>MIRACOLE SRL</strong>). Această politică explică modul în care colectăm și folosim informațiile dumneavoastră conform GDPR.</p>
        
        <h2>1. Operatorul de Date</h2>
        <p>Operatorul datelor dumneavoastră este <strong>MIRACOLE SRL</strong>, cu sediul în JUD. BRAȘOV, MUN. BRAȘOV, STR. REPUBLICII, NR.56, CUI 15733484.</p>

        <h2>2. Date Colectate</h2>
        <p>Colectăm numele, adresa de email, numărul de telefon și adresa de livrare pentru a procesa comenzile dumneavoastră și pentru a asigura comunicarea necesară livrării.</p>
        
        <h2>3. Scopul Prelucrării</h2>
        <p>Datele sunt folosite exclusiv pentru: procesarea comenzilor, livrarea produselor prin curier (Sameday/Fan Courier), facturare și suport clienți la adresa <strong>mariataralunga87@gmail.com</strong>.</p>
        
        <h2>4. Securitate</h2>
        <p>Folosim măsuri de securitate moderne și criptare SSL pentru a proteja informațiile dumneavoastră împotriva accesului neautorizat.</p>
        
        <h2>5. Drepturile Dumneavoastră</h2>
        <p>Aveți dreptul de a solicita accesul la datele dumneavoastră personale, rectificarea sau ștergerea acestora în orice moment, printr-un mail la adresa <strong>mariataralunga87@gmail.com</strong>.</p>
        
        <span className={styles.lastUpdated}>Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}</span>
      </div>
    </div>
  );
}
