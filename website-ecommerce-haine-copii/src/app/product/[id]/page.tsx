import React from "react";
import { prisma } from "@/lib/prisma/client";
import ProductGallery from "./ProductGallery";
import styles from "./product.module.css";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const unresolvedParams = await params;
  
  // Try fetching. If fails/not found, mock
  type ProductWithCategoryAndReviews = import("@prisma/client").Product & { 
    emagId?: string | null;
    category?: import("@prisma/client").Category | null;
    reviews?: import("@prisma/client").Review[];
  };

  let product: ProductWithCategoryAndReviews | null = null;
  
  try {
    product = await prisma.product.findUnique({
      where: { id: unresolvedParams.id },
      include: { category: true, reviews: true }
    });
  } catch {
    // Graceful fail to mock down below
  }

  if (!product) {
    // Generate Mock for visual layout purposes if database is empty
    product = {
      id: unresolvedParams.id,
      emagId: null,
      name: "Tricou Bumbac Jucăuș Premium",
      slug: "tricou-mock",
      description: "Un tricou minunat pentru copilul tău, creat din bumbac bio 100%. Oferă respirație liberă pielii și conține un print colorat, perfect pentru zilele de vară pline de energie. Se spală ușor și rezistă la nenumărate aventuri și pete neașteptate.",
      price: 85.00,
      stock: 12,
      category: { id: "mock-cat", name: "Haine Copii", slug: "haine", description: null, type: "PRODUCT", createdAt: new Date(), updatedAt: new Date() },
      categoryId: "mock-cat",
      images: JSON.stringify([]),
      variations: JSON.stringify([]),
      minAge: 2,
      maxAge: 4,
      isPopular: true,
      isNew: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  if (!product) return <div>Produsul nu a fost găsit.</div>;

  return (
    <div className={`container ${styles.pageWrapper}`}>
      <ProductGallery product={product as any} />

      <section className={styles.tabsSection}>
        {/* Simple Tab Headers (visually active first) */}
        <div className={styles.tabHeaders}>
          <button className={`${styles.tabBtn} ${styles.activeTab}`}>Descriere</button>
          <button className={styles.tabBtn}>Recenzii ({product.reviews?.length || 0})</button>
          <button className={styles.tabBtn}>Livrare & Retur</button>
        </div>
        
        <div className={styles.tabContent}>
          <h3 className={styles.contentTitle}>Detalii Produs</h3>
          <p className={styles.contentText}>
            {product.description}
            <br/><br/>
            <strong>Specificații:</strong>
            <ul className={styles.specificationsList}>
              <li>Recomandat pentru vârsta: {product.minAge === 0 && product.maxAge === 0 ? "Toate vârstele" : `${product.minAge} - ${product.maxAge} ani`}</li>
              <li>Material hipoalergenic, potrivit pentru pielea sensibilă.</li>
              <li>Certificare Oeko-Tex Standard 100.</li>
              <li>Design jucăuș cu detalii rezistente la spălare repetată la 40°C.</li>
            </ul>
          </p>
        </div>
      </section>
    </div>
  );
}
