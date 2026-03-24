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

export async function fetchEmagProducts(username: string, password: string, page: number = 1) {
  const hash = Buffer.from(`${username}:${password}`).toString("base64");
  
  // LOG the IP used for THIS specific request to help debugging
  let currentIp = "unknown";
  try {
    const ipRes = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipRes.json();
    currentIp = ipData.ip;
  } catch (e) {}

  console.log(`[eMAG Debug] Page ${page}: Attempting API call from IP: ${currentIp}`);

  const response = await fetch(`${EMAG_API_URL}/product_offer/read`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${hash}`,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    },
    body: JSON.stringify({
      data: {
        currentPage: page,
        itemsPerPage: 100
      }
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[eMAG Debug] API Error ${response.status} Body:`, errorText);
    throw new Error(`eMAG API HTTP Error: ${response.status} (IP: ${currentIp})`);
  }

  const data = await response.json();

  if (data.isError) {
    console.error(`[eMAG Debug] API Business Error:`, data.messages);
    throw new Error(`eMAG API Error: ${JSON.stringify(data.messages)}`);
  }

  return {
    results: data.results || [],
    pagination: data.results?.pagination || { currentPage: page, itemsPerPage: 100, totalItems: 0 }
  };
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

    let allEmagProducts: any[] = [];
    let currentPage = 1;
    let hasMore = true;
    const maxPages = 15; // Set a safety limit to avoid timeout

    // 1. Fetch products from eMAG page by page
    while (hasMore && currentPage <= maxPages) {
      const { results } = await fetchEmagProducts(username, password, currentPage);
      
      if (Array.isArray(results) && results.length > 0) {
        allEmagProducts = [...allEmagProducts, ...results];
        
        // If we got 100 products, there might be more on the next page
        if (results.length === 100) {
          currentPage++;
        } else {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    }

    if (allEmagProducts.length === 0) {
      return { success: false, error: "Nu s-au găsit produse în contul eMAG, sau datele introduse sunt greșite." };
    }

      // 2. Map products to local schema
    let importCount = 0;
    
    for (const emagProduct of allEmagProducts) {
      const stock = parseInt(emagProduct.general_stock || "0", 10);
      const price = parseFloat(emagProduct.sale_price || "0");
      const name = emagProduct.name || "Produs eMAG Necunoscut";
      const description = emagProduct.description || "";
      
      let imageList: string[] = [];
      
      // Robust Image Extraction
      // 1. Check top-level images array
      if (emagProduct.images && Array.isArray(emagProduct.images)) {
        imageList = emagProduct.images.map((img: any) => {
          if (typeof img === 'string') return img;
          return img.url || img.url_id || null;
        }).filter(Boolean);
      }

      // 2. Check nested product.images (sometimes eMAG wraps details)
      if (imageList.length === 0 && emagProduct.product?.images && Array.isArray(emagProduct.product.images)) {
        imageList = emagProduct.product.images.map((img: any) => {
          if (typeof img === 'string') return img;
          return img.url || img.url_id || null;
        }).filter(Boolean);
      }

      // 3. Last resort fallback
      if (imageList.length === 0) {
        imageList = ["/placeholder-toy.png"];
        console.warn(`[eMAG Debug] No images found for product: ${name}. Structure:`, JSON.stringify(emagProduct).slice(0, 500));
      }

      // Use upsert or find first to avoid duplicates if possible, 
      // but for simplicity and speed in this context we use create.
      // We generate a unique slug which helps.
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
    
    if (error.message && error.message.includes("403")) {
       return { success: false, error: `Eroare 403 (Acces Interzis). Mesaj eMAG: ${error.message}. Asigură-te că IP-ul de mai sus este EXACT cel din eMAG și că ai dat Save.` };
    }
    if (error.message && error.message.includes("IP")) {
       return { success: false, error: `${error.message}. Te rugăm să verifici dacă acest IP este adăugat în eMAG la secțiunea 'IP-uri valide API'.` };
    }
    
    return { success: false, error: error.message || "Eroare internă. Verifică log-urile." };
  }
}
