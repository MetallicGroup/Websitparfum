"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Plus, Trash2, Upload } from "lucide-react";
import styles from "../../app/admin/admin.module.css";
import { Category, Product } from "@prisma/client";
import { uploadImage } from "@/actions/product";

interface EditProductModalProps {
  product: Product;
  categories: Category[];
  onClose: () => void;
  onUpdate: (id: string, data: any) => Promise<void>;
}

export default function EditProductModal({ product, categories, onClose, onUpdate }: EditProductModalProps) {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: (product.price || 0).toString(),
    stock: (product.stock || 0).toString(),
    categoryId: product.categoryId,
    sku: (product as any).sku || "",
    sizeCm: (product as any).sizeCm || "",
  });

  const [images, setImages] = useState<string[]>([]);
  const [variations, setVariations] = useState<{ size: string; stock: number }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      setImages(JSON.parse(product.images || "[]"));
    } catch {
      setImages([]);
    }
    try {
      setVariations(JSON.parse((product as any).variations || "[]"));
    } catch {
      setVariations([]);
    }
  }, [product.images, (product as any).variations]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const formDataUpload = new FormData();
      formDataUpload.append("file", files[i]);
      const res = await uploadImage(formDataUpload);
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
    setIsSubmitting(true);
    try {
      const totalStock = variations.length > 0 ? variations.reduce((acc, v) => acc + v.stock, 0) : parseInt(formData.stock);
      await onUpdate(product.id, {
        ...formData,
        images,
        variations: JSON.stringify(variations),
        stock: totalStock.toString()
      });
      onClose();
    } catch (error) {
      console.error(error);
      alert("Eroare la actualizarea produsului.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">Editează Produs</h2>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Nume Produs*</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-turquoise" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Categorie*</label>
              <select 
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-turquoise"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Preț (Lei)*</label>
              <input 
                type="number" 
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-turquoise" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Stoc Total (Automat)*</label>
              <input 
                type="number" 
                name="stock"
                value={variations.length > 0 ? variations.reduce((acc, v) => acc + v.stock, 0) : formData.stock}
                onChange={handleChange}
                required
                disabled={variations.length > 0}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none bg-gray-50 mb-1" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">SKU (Cod Intern)*</label>
              <input 
                type="text" 
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-turquoise" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Mărime (CM)</label>
              <input 
                type="text" 
                name="sizeCm"
                value={formData.sizeCm}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-turquoise" 
              />
            </div>
          </div>

          {/* Variations Section */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-gray-800">Variante Mărimi & Stocuri</label>
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
                      <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Mărime</label>
                      <input 
                        type="text" 
                        value={v.size} 
                        onChange={(e) => {
                          const newVar = [...variations];
                          newVar[idx].size = e.target.value;
                          setVariations(newVar);
                        }}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
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
              <p className="text-xs text-gray-400 italic">Nu ai variabile definite.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Descriere</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-turquoise resize-none"
            ></textarea>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">Imagini Produs</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
              {images.map((url, index) => (
                <div key={index} className="relative group aspect-square rounded-lg border border-gray-100 overflow-hidden bg-gray-50">
                  <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
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

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 bg-gray-50/50 p-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 bg-white transition-colors"
            >
              Anulează
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2 bg-turquoise text-white rounded-lg font-medium hover:bg-turquoise-dark transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? "Se salvează..." : <><Save size={18} /> Salvează Modificările</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
