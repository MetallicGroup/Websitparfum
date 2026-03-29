"use client";

import React, { useState } from "react";
import { Category } from "@prisma/client";
import { X, Upload, Plus, Trash2 } from "lucide-react";
import { uploadImage } from "@/actions/product";

export default function AddProductModal({ 
  categories, 
  onClose,
  onAdd
}: { 
  categories: Category[]; 
  onClose: () => void;
  onAdd: (data: any) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: categories[0]?.id || "",
    sku: "",
    sizeCm: "",
    minAge: "0",
    maxAge: "24",
  });
  const [variations, setVariations] = useState<{ size: string; stock: number }[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      const res = await uploadImage(formData);
      if (res.success && res.url) {
        setImages(prev => [...prev, res.url!]);
      } else {
        alert("Eroare la încărcarea imaginii: " + res.error);
      }
    }
    setUploading(false);
    e.target.value = ""; // reset
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const totalStock = variations.reduce((acc, v) => acc + v.stock, 0);
      await onAdd({ 
        ...formData, 
        images, 
        variations: JSON.stringify(variations),
        stock: variations.length > 0 ? totalStock.toString() : formData.stock 
      });
      onClose();
    } catch (error) {
      console.error(error);
      alert("A apărut o eroare la adăugarea produsului.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold">Adaugă Produs Nou</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors hidden sm:block">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="add-product-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nume Produs *</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-turquoise"
                placeholder="Ex: Rochiță Prințesă"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">SKU (Cod Intern)</label>
                <input 
                  type="text" 
                  name="sku" 
                  value={formData.sku} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-turquoise"
                  placeholder="Ex: cb259"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Categorie *</label>
                <select 
                  name="categoryId" 
                  value={formData.categoryId} 
                  onChange={handleChange} 
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-turquoise bg-white"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Preț (Lei) *</label>
                <input 
                  type="number" 
                  step="0.01"
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-turquoise"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Stoc Total (Se calculează automat din variante) *</label>
                <input 
                  type="number" 
                  name="stock" 
                  value={variations.length > 0 ? variations.reduce((acc, v) => acc + v.stock, 0) : formData.stock} 
                  onChange={handleChange} 
                  required 
                  disabled={variations.length > 0}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-turquoise bg-gray-50"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-800">Variante Mărimi & Stocuri</label>
                <button 
                  type="button" 
                  onClick={() => setVariations([...variations, { size: "", stock: 0 }])}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Plus size={14} /> Adaugă Variantă
                </button>
              </div>
              
              {variations.length > 0 ? (
                <div className="space-y-2">
                  {variations.map((v, idx) => (
                    <div key={idx} className="flex gap-2 items-end">
                      <div className="flex-[2]">
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Mărime (ex: 80cm)</label>
                        <input 
                          type="text" 
                          value={v.size} 
                          onChange={(e) => {
                            const newVar = [...variations];
                            newVar[idx].size = e.target.value;
                            setVariations(newVar);
                          }}
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                          placeholder="Mărime"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Stoc</label>
                        <input 
                          type="number" 
                          value={v.stock} 
                          onChange={(e) => {
                            const newVar = [...variations];
                            newVar[idx].stock = parseInt(e.target.value) || 0;
                            setVariations(newVar);
                          }}
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setVariations(variations.filter((_, i) => i !== idx))}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">Nu ai adăugat nicio mărime specifică încă.</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mărime (CM)</label>
                <input 
                  type="text" 
                  name="sizeCm" 
                  value={formData.sizeCm} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-turquoise"
                  placeholder="Ex: 80cm - 86cm"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Vârstă Min (Luni)</label>
                  <input 
                    type="number" 
                    name="minAge" 
                    value={formData.minAge} 
                    onChange={handleChange} 
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-turquoise"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Vârstă Max (Luni)</label>
                  <input 
                    type="number" 
                    name="maxAge" 
                    value={formData.maxAge} 
                    onChange={handleChange} 
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-turquoise"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Imagini Produs</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                {images.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg border border-gray-100 overflow-hidden bg-gray-50 group">
                    <img src={url} alt="Produs" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                
                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-turquoise hover:bg-turquoise/5 transition-all text-gray-400 hover:text-turquoise">
                  {uploading ? (
                    <div className="w-6 h-6 border-2 border-turquoise border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Upload size={24} />
                      <span className="text-[10px] font-bold">Adaugă</span>
                    </>
                  )}
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Descriere</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-turquoise"
              ></textarea>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
          <button 
            type="button"
            onClick={onClose} 
            className="px-6 py-2.5 rounded-pill font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Anulează
          </button>
          <button 
            type="submit"
            form="add-product-form"
            disabled={loading}
            className="px-6 py-2.5 rounded-pill font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Se salvează..." : "Salvează Produsul"}
          </button>
        </div>
      </div>
    </div>
  );
}
