"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, Trash2 } from "lucide-react";
import styles from "../../app/(shop)/shop/shop.module.css";
import { Category } from "@prisma/client";

export default function ShopSidebar({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get("category") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentMinAge = searchParams.get("minAge") || "";
  const currentMaxAge = searchParams.get("maxAge") || "";

  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);

  const ageFilters = [
    { label: "0-2 ani", min: 0, max: 24 },
    { label: "3-6 ani", min: 36, max: 72 },
    { label: "7-10 ani", min: 84, max: 120 },
    { label: "11-14 ani", min: 132, max: 168 },
  ];

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/shop?${params.toString()}`);
  };

  const handlePriceApply = () => {
    updateFilters({ minPrice, maxPrice });
  };

  const handleAgeClick = (min: number, max: number) => {
    if (currentMinAge === min.toString() && currentMaxAge === max.toString()) {
      updateFilters({ minAge: null, maxAge: null });
    } else {
      updateFilters({ minAge: min.toString(), maxAge: max.toString() });
    }
  };

  const clearFilters = () => {
    router.push("/shop");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.filterHeader}>
        <h2>Filtre</h2>
        <button onClick={clearFilters} className="text-gray-400 hover:text-red-500 transition-colors" title="Șterge filtre">
          <Trash2 size={18} />
        </button>
      </div>

      <div className={styles.filterGroup}>
        <h3 className={styles.filterTitle}>Categorii</h3>
        <ul className={styles.filterList}>
          <li>
            <button 
              onClick={() => updateFilters({ category: null })}
              className={!currentCategory ? styles.activeFilter : ""}
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', padding: '0.5rem 0' }}
            >
              Toate Produsele
            </button>
          </li>
          {categories.map(cat => (
            <li key={cat.id}>
              <button 
                onClick={() => updateFilters({ category: cat.slug })}
                className={currentCategory === cat.slug ? styles.activeFilter : ""}
                style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', padding: '0.5rem 0' }}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.filterGroup}>
        <h3 className={styles.filterTitle}>Vârstă</h3>
        <ul className={styles.filterList}>
          {ageFilters.map((age, idx) => (
            <li key={idx}>
              <label className="flex items-center gap-2 cursor-pointer py-1">
                <input 
                  type="checkbox" 
                  checked={currentMinAge === age.min.toString() && currentMaxAge === age.max.toString()}
                  onChange={() => handleAgeClick(age.min, age.max)}
                /> 
                {age.label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.filterGroup}>
        <h3 className={styles.filterTitle}>Preț (Lei)</h3>
        <div className={styles.priceInputs}>
          <input 
            type="number" 
            placeholder="Min" 
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span>-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <button 
          className={`btn btn-secondary ${styles.filterApplyBtn}`}
          onClick={handlePriceApply}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          Aplică
        </button>
      </div>
    </aside>
  );
}
