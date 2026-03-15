"use server"

import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";

// eMAG API Rate Limits: max 3 requests per second for non-orders
const EMAG_API_URL = "https://marketplace-api.emag.ro/api-3";

/**
 * Helper to fetch the server's public IP
 */
export async function getPublicIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip as string;
  } catch (error) {
    console.error("Failed to get public IP", error);
    return "Unknown IP";
  }
}

/**
 * Core function to fetch products from eMAG
 */
export async function fetchEmagProducts(username: string, password: string) {
  const hash = Buffer.from(`${username}:${password}`).toString("base64");
  
  const response = await fetch(`${EMAG_API_URL}/product_offer/read`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${hash}`
    },
    body: JSON.stringify({
      data: {
        currentPage: 1,
        itemsPerPage: 100 // We can paginate later if there are more than 100 products
      }
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`eMAG API HTTP Error: ${response.status}`);
  }

  const data = await response.json();

  if (data.isError) {
    throw new Error(`eMAG API Error: ${JSON.stringify(data.messages)}`);
  }

  return data.results || [];
}

function generateSlug(name: string) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") 
    + "-" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
}

/**
 * Action to trigger the import
 */
export async function importEmagProducts(username: string, password: string, categoryId: string) {
  try {
    if (!username || !password || !categoryId) {
      return { success: false, error: "Te rog completează toate câmpurile." };
    }

    // 1. Fetch products from eMAG
    const emagProducts = await fetchEmagProducts(username, password);

    if (!Array.isArray(emagProducts) || emagProducts.length === 0) {
      return { success: false, error: "Nu s-au găsit produse în contul eMAG, sau datele introduse sunt greșite." };
    }

    // 2. Map products to local schema
    let importCount = 0;
    
    // Process in batches or all at once depending on volume
    for (const emagProduct of emagProducts) {
      // Basic validation: ensure we only import active/valid products if wanted?
      // eMAG returns 'status': 1 (active)
      // eMAG stock is 'general_stock'
      
      const stock = parseInt(emagProduct.general_stock || "0", 10);
      const price = parseFloat(emagProduct.sale_price || "0");
      const name = emagProduct.name || "Produs eMAG Necunoscut";
      const description = emagProduct.description || "";
      
      // Images come as an array of objects
      let imageList = ["/placeholder-toy.png"];
      if (emagProduct.images && Array.isArray(emagProduct.images) && emagProduct.images.length > 0) {
          imageList = emagProduct.images.map((img: any) => img.url).filter(Boolean);
      }

      await prisma.product.create({
        data: {
          name,
          slug: generateSlug(name),
          description,
          price,
          stock,
          categoryId,
          images: JSON.stringify(imageList),
          variations: JSON.stringify([]),
          minAge: 0,
          maxAge: 168,
          isPopular: false,
          isNew: true
        }
      });
      importCount++;
    }

    // 3. Revalidate cache
    revalidatePath("/admin/products");
    revalidatePath("/shop");

    return { success: true, count: importCount };

  } catch (error: any) {
    console.error("eMAG import error details:", error);
    
    // Check if it's an IP whitelist error or Auth error based on eMAG standard msg
    if (error.message && error.message.includes("IP")) {
       return { success: false, error: "Adresa IP a serverului nostru nu este adăugată în eMAG la secțiunea 'IP-uri valide API'." };
    }
    if (error.message && error.message.includes("hash") || error.message.includes("Authorization")) {
       return { success: false, error: "Date de autentificare incorecte (Utilizator / Parolă)." };
    }
    
    return { success: false, error: error.message || "Eroare internă. Verifică log-urile." };
  }
}
