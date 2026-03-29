import React from 'react';
import styles from '../legal.module.css';

export const metadata = {
  title: 'Termeni și Condiții | KiddyShop',
  description: 'Termenii și condițiile de utilizare a website-ului KiddyShop.',
};

export default function TermsPage() {
  return (
    <div className={`container ${styles.legalContainer}`}>
      <h1 className={styles.title}>Termeni și Condiții</h1>
      <div className={styles.content}>
        <p>Bun venit pe KiddyShop.ro. Prin utilizarea acestui website, sunteți de acord cu următorii termeni și condiții impuși de operatorul acestuia.</p>
        
        <h2>1. Definiții și Identificare</h2>
        <p>Vânzător: <strong>MIRACOLE SRL</strong>, cu sediul social în JUD. BRAȘOV, MUN. BRAȘOV, STR. REPUBLICII, NR.56, înregistrată sub nr. J2003001777089, CUI 15733484. Cumpărător: orice persoană fizică sau juridică care plasează o comandă prin intermediul site-ului.</p>
        
        <h2>2. Comenzi și Stocuri</h2>
        <p>Prin plasarea unei comenzi pe site-ul nostru, vă angajați să cumpărați produsele selectate. Ne rezervăm dreptul de a refuza o comandă în cazul în care produsele nu mai sunt în stoc (stoc epuizat la furnizor) sau există erori evidente de preț.</p>
        
        <h2>3. Prețuri și Plată</h2>
        <p>Toate prețurile afișate sunt în Lei (RON) și includ TVA. Plata se poate face ramburs la primirea coletului sau online prin metode securizate. Proprietatea produselor trece la cumpărător doar după achitarea integrală a prețului.</p>
        
        <h2>4. Livrare</h2>
        <p>Livrarea se face prin curier rapid (Fan Courier/Sameday). Termenul mediu de livrare este de 24-72 de ore lucrătoare. Riscul de pierdere a produselor trece la cumpărător în momentul livrării.</p>
        
        <h2>5. Dreptul de Retur</h2>
        <p>Conform OUG 34/2014, aveți dreptul de a returna produsele cumpărate în termen de 14 zile calendaristice de la primire, fără a specifica un motiv. Costul transportului pentru retur va fi suportat de cumpărător, cu excepția produselor defecte.</p>

        <h2>6. Contact</h2>
        <p>Pentru orice întrebări ne puteți contacta la adresa de mail <strong>mariataralunga87@gmail.com</strong>.</p>
        
        <span className={styles.lastUpdated}>Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}</span>
      </div>
    </div>
  );
}
