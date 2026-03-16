"use server"

import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";
import Papa from "papaparse";

export async function importProductsCSV(csvText: string, categoryIdMapping: Record<string, string>) {
  try {
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
      console.error("CSV Parsing errors:", parsed.errors);
      return { success: false, error: "Eroare la citirea fișierului CSV." };
    }

    interface CSVRow {
      Name?: string;
      Description?: string;
      Price?: string;
      Stock?: string;
      CategoryName?: string;
      MinAge?: string;
      MaxAge?: string;
      ImageUrl?: string;
      [key: string]: string | undefined;
    }

    const rows = parsed.data as CSVRow[];

    // Data Format Expected in CSV:
    // Name, Description, Price, Stock, CategoryName, MinAge, MaxAge, ImageUrl
    
    let importedCount = 0;
    
    // We use a transaction or simple batch inserts
    // Note: SQLite has a variable limit per query. For 1000+ files, chunking is safer.
    
    const CHUNK_SIZE = 100;
    for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
      const chunk = rows.slice(i, i + CHUNK_SIZE);
      
      const newProducts = chunk.map((row) => {
        const catName = row.CategoryName?.trim() || "Uncategorized";
        // Map category name to ID or use a default
        const cId = categoryIdMapping[catName] || Object.values(categoryIdMapping)[0];
        
        const name = row.Name || "Produs Necunoscut";
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + Date.now().toString() + Math.floor(Math.random() * 1000);
        
        return {
          name,
          slug,
          description: row.Description || "",
          price: parseFloat(row.Price || "0") || 0,
          stock: parseInt(row.Stock || "0", 10) || 0,
          categoryId: cId,
          minAge: parseInt(row.MinAge || "0", 10) || 0,
          maxAge: parseInt(row.MaxAge || "168", 10) || 168,
          images: JSON.stringify(row.ImageUrl ? [row.ImageUrl] : ["/placeholder-toy.png"]),
          variations: JSON.stringify([]),
          isPopular: false,
          isNew: true
        };
      });

      await prisma.product.createMany({
        data: newProducts,
      });
      importedCount += newProducts.length;
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true, count: importedCount };
  } catch (error) {
    console.error("Error importing products:", error);
    return { success: false, error: "Eroare internă la import." };
  }
}
