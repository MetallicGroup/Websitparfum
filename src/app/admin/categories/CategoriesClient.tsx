"use client";

import React, { useState } from "react";
import { Plus, Trash2, Search, X, Save } from "lucide-react";
import styles from "../admin.module.css";
import { createCategory, deleteCategory } from "@/actions/category";

export default function CategoriesClient({ initialCategories }: { initialCategories: any[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Ești sigur că vrei să ștergi categoria "${name}"? Această acțiune nu șterge produsele, dar le va lăsa fără categorie.`)) return;
    
    const result = await deleteCategory(id);
    if (result.success) {
      setCategories(categories.filter(c => c.id !== id));
    } else {
      alert("Eroare la ștergere.");
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Gestionare Categorii</h1>
        <button 
          className="btn btn-primary flex items-center gap-2"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} />
          Adaugă Categorie
        </button>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <div className={styles.searchWrap}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Caută categorie..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Nume</th>
              <th>Slug</th>
              <th>Tip</th>
              <th>Descriere</th>
              <th className="text-right">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((cat) => (
              <tr key={cat.id}>
                <td className="font-bold">{cat.name}</td>
                <td className="text-gray-500 text-sm">{cat.slug}</td>
                <td>
                   <span className="px-2 py-1 bg-gray-100 rounded-md text-xs uppercase font-bold text-gray-600">
                     {cat.type}
                   </span>
                </td>
                <td className="text-sm text-gray-500 max-w-xs truncate">{cat.description || "-"}</td>
                <td className="text-right">
                  <div className={styles.actionBtns}>
                    <button 
                      className={styles.actionBtn} 
                      onClick={() => handleDelete(cat.id, cat.name)}
                      title="Șterge"
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">Nu au fost găsite categorii.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isAddModalOpen && (
        <AddCategoryModal 
          onClose={() => setIsAddModalOpen(false)} 
          onSuccess={() => window.location.reload()} 
        />
      )}
    </div>
  );
}

function AddCategoryModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createCategory(formData);
    setLoading(false);
    if (res.success) {
      onSuccess();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">Categorie Nouă</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Nume Categorie*</label>
            <input type="text" name="name" required className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-turquoise" placeholder="ex: Haine, Jucării..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Tip (Internal Label)*</label>
            <input type="text" name="type" required className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-turquoise" placeholder="ex: shop, info..." defaultValue="shop" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Descriere (Scoptional)</label>
            <textarea name="description" rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-turquoise resize-none" placeholder="O scurtă descriere a categoriei..."></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50">Anulează</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-turquoise text-white rounded-lg font-medium hover:opacity-90 transition-all flex items-center gap-2">
              {loading ? "Se salvează..." : <><Save size={18} /> Salvează</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
