"use client";

import React, { useState, useEffect } from "react";
import { DownloadCloud, X } from "lucide-react";
import { importEmagProducts, getPublicIP } from "@/actions/emag";
import { Category } from "@prisma/client";

interface EmagImportModalProps {
  onClose: () => void;
  categories: Category[];
}

export default function EmagImportModal({ onClose, categories }: EmagImportModalProps) {
  const [ip, setIp] = useState<string>("Se încarcă...");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  useEffect(() => {
    getPublicIP().then(setIp).catch(() => setIp("Eroare la preluare"));
  }, []);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsImporting(true);
    setMessage(null);

    const result = await importEmagProducts(username, password, categoryId);
    
    setIsImporting(false);

    if (result.success) {
      setMessage({ type: "success", text: `Import finalizat cu succes! S-au importat ${result.count} produse din eMAG.` });
      // Clear form on success
      setUsername("");
      setPassword("");
    } else {
      setMessage({ type: "error", text: result.error || "Eroare necunoscută." });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <DownloadCloud size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Sincronizare eMAG</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleImport} className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
            <p className="font-semibold mb-1">Pasul 1: Confirmă Adresa IP</p>
            <p className="opacity-90 leading-relaxed mb-2">
              Pentru ca eMAG să ne permită accesul, trebuie să adaugi adresa IP a acestui site în contul tău eMAG (<strong>Contul Meu &rarr; Date Tehnice &rarr; Adrese IP</strong>).
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="font-mono text-base font-bold bg-white px-3 py-1.5 rounded border border-blue-200 shadow-sm text-blue-900 select-all">
                {ip}
              </span>
              <span className="text-xs opacity-75">(Apasă pentru selectare)</span>
            </div>
          </div>

          <div className="space-y-4">
             <p className="font-semibold text-gray-800 text-sm">Pasul 2: Date de Autentificare</p>
             
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">
                 Utilizator API eMAG
               </label>
               <input
                 type="text"
                 required
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 placeholder="ex: api-user@magazinul-meu.ro"
                 className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">
                 Parolă
               </label>
               <input
                 type="password"
                 required
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                 placeholder="Nu o vom salva în baza noastră de date"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">
                 Salvează produsele în categoria:
               </label>
               <select
                 required
                 value={categoryId}
                 onChange={(e) => setCategoryId(e.target.value)}
                 className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
               >
                 {categories.map(cat => (
                   <option key={cat.id} value={cat.id}>{cat.name}</option>
                 ))}
               </select>
             </div>
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              <p className="font-semibold">{message.type === 'success' ? 'Succes!' : 'Eroare:'}</p>
              <p>{message.text}</p>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors"
              disabled={isImporting}
            >
              Închide
            </button>
            <button
              type="submit"
              disabled={isImporting}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
               {isImporting ? (
                 <>
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   Se importă...
                 </>
               ) : (
                 'Începe Sincronizarea'
               )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
