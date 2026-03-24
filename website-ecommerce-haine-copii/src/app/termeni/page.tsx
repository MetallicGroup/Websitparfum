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
        <p>Bun venit pe KiddyShop.ro. Prin utilizarea acestui website, sunteți de acord cu următorii termeni și condiții.</p>
        
        <h2>1. Definiții</h2>
        <p>Vânzător: KiddyShop, cu sediul în București. Cumpărător: orice persoană fizică sau juridică care plasează o comandă.</p>
        
        <h2>2. Comenzi</h2>
        <p>Prin plasarea unei comenzi pe site-ul nostru, vă angajați să cumpărați produsele selectate. Ne rezervăm dreptul de a refuza o comandă în cazul în care produsele nu mai sunt în stoc sau există erori de preț.</p>
        
        <h2>3. Prețuri și Plată</h2>
        <p>Toate prețurile afișate sunt în Lei (RON) și includ TVA. Plata se poate face online cu cardul sau ramburs la primirea coletului.</p>
        
        <h2>4. Livrare</h2>
        <p>Termenul mediu de livrare este de 24-48 de ore lucrătoare. Costul transportului este afișat în coșul de cumpărături înainte de finalizarea comenzii.</p>
        
        <h2>5. Dreptul de Retur</h2>
        <p>Conform legislației în vigoare, aveți dreptul de a returna produsele cumpărate în termen de 14 zile calendaristice de la primire, fără a specifica un motiv.</p>
        
        <span className={styles.lastUpdated}>Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}</span>
      </div>
    </div>
  );
}
