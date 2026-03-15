"use client";

import React, { useState } from "react";
import { Upload, Plus, Search, Edit2, Trash2, DownloadCloud } from "lucide-react";
import styles from "../admin.module.css";
import { importProductsCSV } from "@/actions/import";
import { deleteProduct } from "@/actions/product";
import EmagImportModal from "@/components/admin/EmagImportModal";

import { Product, Category } from "@prisma/client";

type ProductWithCategory = Product & { category?: Category | null };

export default function AdminProductsClient({ initialProducts, categories }: { initialProducts: ProductWithCategory[], categories: Category[] }) {
  const [products, setProducts] = useState<ProductWithCategory[]>(initialProducts);
  const [isImporting, setIsImporting] = useState(false);
  const [isEmagModalOpen, setIsEmagModalOpen] = useState(false);
  
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.name] = cat.id;
    return acc;
  }, {} as Record<string, string>);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const result = await importProductsCSV(text, categoryMap);
      
      if (result.success) {
        alert(`Import finalizat! Au fost adăugate ${result.count} produse.`);
        window.location.reload();
      } else {
        alert("Eroare la import: " + result.error);
      }
    } catch {
      alert("A apărut o eroare la citirea fișierului.");
    } finally {
      setIsImporting(false);
      e.target.value = ""; // reset input
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Ești sigur că vrei să ștergi acest produs?")) return;
    
    // Optimistic UI update
    const previousProducts = [...products];
    setProducts(products.filter(p => p.id !== id));
    
    const result = await deleteProduct(id);
    if (!result.success) {
      alert(result.error);
      setProducts(previousProducts); // revert on failure
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Gestionare Produse</h1>
        <div className="flex gap-4">
          <button 
             className="btn flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-all shadow-sm"
             onClick={() => setIsEmagModalOpen(true)}
          >
            <DownloadCloud size={18} />
            Importă eMAG
          </button>
          <label className="btn btn-secondary flex items-center gap-2 cursor-pointer">
            <Upload size={18} />
            {isImporting ? "Se importă..." : "Importă CSV"}
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} disabled={isImporting} style={{display: 'none'}} />
          </label>
          <button className="btn btn-primary flex items-center gap-2" onClick={() => alert('Partea de adăugare complexă se continuă în implementările viitoare, poți folosi Import CSV momentan.')}>
            <Plus size={18} />
            Adaugă Produs Nou
          </button>
        </div>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Caută produse..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-pill focus:border-turquoise focus:outline-none"
              style={{ paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', borderRadius: '9999px', border: '1px solid var(--color-gray-200)' }}
            />
          </div>
          <p className="text-sm text-gray-500 font-semibold">{products.length} produse în total</p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Imagine</th>
                <th>Nume Produs</th>
                <th>Categorie</th>
                <th>Preț (Lei)</th>
                <th>Stoc</th>
                <th>Status</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const imgs = JSON.parse(p.images || "[]");
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-gray-100)', borderRadius: 'var(--border-radius-sm)', backgroundSize: 'cover', backgroundImage: `url(${imgs[0] || '/placeholder.jpg'})` }}></div>
                    </td>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.category?.name || "N/A"}</td>
                    <td>{p.price.toFixed(2)}</td>
                    <td>{p.stock}</td>
                    <td>
                      {p.stock > 0 ? (
                        <span className={`${styles.badgeStatus} ${styles.statusShipped}`}>Activ</span>
                      ) : (
                        <span className={`${styles.badgeStatus} ${styles.statusCancelled}`}>Epuizat</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button className={styles.actionBtn} aria-label="Editează" onClick={() => alert('Funcționalitatea de edit va fi adăugată. Momentan șterge și adaugă csv.')}><Edit2 size={16} /></button>
                        <button className={`${styles.actionBtn} ${styles.deleteHover}`} aria-label="Șterge" onClick={() => handleDelete(p.id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {products.length === 0 && (
                <tr>
                   <td colSpan={7} style={{textAlign: "center", padding: "3rem", color: "var(--color-text-muted)"}}>
                      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
                         <Upload size={48} style={{opacity: 0.2}} />
                         <p>Nu există produse în baza de date.</p>
                         <p style={{fontSize: '0.875rem'}}>Folosește butonul <strong>Importă CSV</strong> pentru a adăuga +1000 produse instantaneu.</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isEmagModalOpen && (
        <EmagImportModal 
          categories={categories} 
          onClose={() => {
             setIsEmagModalOpen(false);
             // Since we might have imported products, doing a simple reload is best to refresh the SSR list.
             // Normally router.refresh() is better if we hook it up, but reload guarantees fresh data here.
             window.location.reload(); 
          }} 
        />
      )}
    </div>
  );
}
