import React from "react";
import { getCategories } from "@/actions/category";
import CategoriesClient from "./CategoriesClient";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const res = await getCategories();
  const categories = res.success ? res.data : [];

  return (
    <CategoriesClient initialCategories={categories as any[]} />
  );
}
