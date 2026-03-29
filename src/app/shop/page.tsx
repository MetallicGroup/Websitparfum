import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma/client";
import styles from "./shop.module.css";
import { ChevronDown } from "lucide-react";
import { Product, Category } from "@prisma/client";
import ShopSidebar from "@/components/shop/ShopSidebar";

type ProductWithCategory = Product & { category?: Category | null };

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const unresolvedSearchParams = await searchParams;
  const categoryFilter = unresolvedSearchParams.category as string;
  const q = unresolvedSearchParams.q as string;
  const minPrice = unresolvedSearchParams.minPrice ? parseFloat(unresolvedSearchParams.minPrice as string) : undefined;
  const maxPrice = unresolvedSearchParams.maxPrice ? parseFloat(unresolvedSearchParams.maxPrice as string) : undefined;
  const minAge = unresolvedSearchParams.minAge ? parseInt(unresolvedSearchParams.minAge as string, 10) : undefined;
  const maxAge = unresolvedSearchParams.maxAge ? parseInt(unresolvedSearchParams.maxAge as string, 10) : undefined;
  const sort = unresolvedSearchParams.sort as string || "newest";

  const popularFilter = unresolvedSearchParams.isPopular === "true";
  const newFilter = unresolvedSearchParams.isNew === "true";
  
  const whereClause = {
    ...(categoryFilter ? { category: { slug: categoryFilter } } : {}),
    ...(popularFilter ? { isPopular: true } : {}),
    ...(newFilter ? { isNew: true } : {}),
    ...(q ? {
      OR: [
        { name: { contains: q } },
        { description: { contains: q } }
      ]
    } : {}),
    ...(minPrice !== undefined || maxPrice !== undefined ? {
      price: {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
      }
    } : {}),
    ...(minAge !== undefined || maxAge !== undefined ? {
      AND: [
        { minAge: { lte: maxAge !== undefined ? maxAge : 999 } },
        { maxAge: { gte: minAge !== undefined ? minAge : 0 } }
      ]
    } : {}),
  };

  const orderBy: any = {};
  if (sort === "price-asc") orderBy.price = "asc";
  else if (sort === "price-desc") orderBy.price = "desc";
  else if (sort === "popular") orderBy.isPopular = "desc";
  else orderBy.createdAt = "desc";

  const products = await prisma.product.findMany({
    where: whereClause,
    include: { category: true },
    orderBy
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div className={`container ${styles.shopLayout}`}>
      
      <ShopSidebar categories={categories} />

      {/* Main Catalog Area */}
      <main className={styles.catalogArea}>
        <div className={styles.catalogHeader}>
          <h1 className={styles.catalogTitle}>
            {categoryFilter ? `Colecția: ${categories.find(c => c.slug === categoryFilter)?.name || categoryFilter}` : q ? `Rezultate: ${q}` : "Toate Produsele"} 
            <span className={styles.countBadge}>{products.length} produse</span>
          </h1>
          
          <div className={styles.sortContainer}>
            <span className={styles.sortLabel}>Sortează după:</span>
            <div className={styles.sortSelectWrap}>
              <select 
                className={styles.sortSelect} 
                defaultValue={sort}
                onChange={`window.location.href='/shop?' + new URLSearchParams({...Object.fromEntries(new URLSearchParams(window.location.search)), sort: event.target.value}).toString()` as any}
              >
                <option value="newest">Cele mai noi</option>
                <option value="price-asc">Preț crescător</option>
                <option value="price-desc">Preț descrescător</option>
                <option value="popular">Cele mai populare</option>
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
