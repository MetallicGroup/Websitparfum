import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma/client";
import styles from "./shop.module.css";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { Product, Category } from "@prisma/client";

type ProductWithCategory = Product & { category?: Category | null };

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const unresolvedSearchParams = await searchParams;
  const categoryFilter = unresolvedSearchParams.category as string;
  const popularFilter = unresolvedSearchParams.isPopular === "true";
  const newFilter = unresolvedSearchParams.isNew === "true";
  
  // Minimal static data fetch since we assume empty DB for now
  const products = await prisma.product.findMany({
    where: {
      ...(categoryFilter ? { category: { slug: categoryFilter } } : {}),
      ...(popularFilter ? { isPopular: true } : {}),
      ...(newFilter ? { isNew: true } : {}),
    },
    include: { category: true }
  });

  return (
    <div className={`container ${styles.shopLayout}`}>
      
      {/* Sidebar Filters */}
      <aside className={styles.sidebar}>
        <div className={styles.filterHeader}>
          <h2>Filtre</h2>
          <SlidersHorizontal size={20} />
        </div>

        <div className={styles.filterGroup}>
          <h3 className={styles.filterTitle}>Categorii</h3>
          <ul className={styles.filterList}>
            <li>
              <Link href="/shop" className={!categoryFilter ? styles.activeFilter : ""}>
                Toate Produsele
              </Link>
            </li>
            <li>
              <Link href="/shop?category=haine" className={categoryFilter === "haine" ? styles.activeFilter : ""}>
                Haine Copii
              </Link>
            </li>
            <li>
              <Link href="/shop?category=bebe" className={categoryFilter === "bebe" ? styles.activeFilter : ""}>
                Bebeluși (0-2 ani)
              </Link>
            </li>
            <li>
              <Link href="/shop?category=jucarii" className={categoryFilter === "jucarii" ? styles.activeFilter : ""}>
                Jucării
              </Link>
            </li>
            <li>
              <Link href="/shop?category=accesorii" className={categoryFilter === "accesorii" ? styles.activeFilter : ""}>
                Accesorii
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.filterGroup}>
          <h3 className={styles.filterTitle}>Vârstă</h3>
          <ul className={styles.filterList}>
            <li><label><input type="checkbox" /> 0-2 ani</label></li>
            <li><label><input type="checkbox" /> 3-6 ani</label></li>
            <li><label><input type="checkbox" /> 7-10 ani</label></li>
            <li><label><input type="checkbox" /> 11-14 ani</label></li>
          </ul>
        </div>

        <div className={styles.filterGroup}>
          <h3 className={styles.filterTitle}>Preț</h3>
          <div className={styles.priceInputs}>
            <input type="number" placeholder="Min" />
            <span>-</span>
            <input type="number" placeholder="Max" />
          </div>
          <button className={`btn btn-secondary ${styles.filterApplyBtn}`}>Aplică</button>
        </div>
      </aside>

      {/* Main Catalog Area */}
      <main className={styles.catalogArea}>
        <div className={styles.catalogHeader}>
          <h1 className={styles.catalogTitle}>
            {categoryFilter ? `Colecția: ${categoryFilter}` : "Toate Produsele"} 
            <span className={styles.countBadge}>{products.length > 0 ? products.length : 12} produse</span>
          </h1>
          
          <div className={styles.sortContainer}>
            <span className={styles.sortLabel}>Sortează după:</span>
            <div className={styles.sortSelectWrap}>
              <select className={styles.sortSelect}>
                <option>Cele mai noi</option>
                <option>Preț crescător</option>
                <option>Preț descrescător</option>
                <option>Cele mai populare</option>
              </select>
              <ChevronDown size={16} className={styles.sortIcon} />
            </div>
          </div>
        </div>

        <div className={styles.productGrid}>
          {products.length > 0 ? (
            products.map((p) => (
              <ProductCard key={p.id} product={p as ProductWithCategory} />
            ))
          ) : (
            <div className={styles.noProducts}>
              <p>Nu am găsit produse care să corespundă filtrelor tale.</p>
              <Link href="/shop" className="btn btn-secondary mt-2">Resetează Filtrele</Link>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}

function ProductCard({ product }: { product: ProductWithCategory }) {
  const images = JSON.parse(product.images || "[]");
  return (
    <div className={styles.productCard}>
      <Link href={`/product/${product.id}`} className={styles.productImgWrap}>
        <div className={styles.productPlaceholderImg} style={{ backgroundImage: `url(${images[0]})` }}>
          {!images[0] && "Imagine"}
        </div>
        {product.isNew && <span className={styles.badgeNew}>Nou</span>}
      </Link>
      <div className={styles.productInfo}>
        <p className={styles.productCat}>{product.category?.name || "Produs"}</p>
        <Link href={`/product/${product.id}`} className={styles.productName}>
          {product.name}
        </Link>
        <div className={styles.productPriceRow}>
          <span className={styles.productPrice}>{product.price.toFixed(2)} Lei</span>
          <button className={styles.addToCartSmall}>+</button>
        </div>
      </div>
    </div>
  );
}
