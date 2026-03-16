import React from "react";
import { prisma } from "@/lib/prisma/client";
import AdminProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });
  
  const categories = await prisma.category.findMany();

  return (
    <AdminProductsClient initialProducts={products} categories={categories} />
  );
}
