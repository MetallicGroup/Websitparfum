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

export async function fetchEmagProducts(username: string, password: string) {
  const hash = Buffer.from(`${username}:${password}`).toString("base64");
  
  // LOG the IP used for THIS specific request to help debugging
  let currentIp = "unknown";
  try {
    const ipRes = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipRes.json();
    currentIp = ipData.ip;
  } catch (e) {}

  console.log(`[eMAG Debug] Attempting API call from IP: ${currentIp}`);

  const response = await fetch(`${EMAG_API_URL}/product_offer/read`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${hash}`,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    },
    body: JSON.stringify({
      data: {
        currentPage: 1,
        itemsPerPage: 1000
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
    if (error.message && error.message.includes("403")) {
       return { success: false, error: `Eroare 403 (Acces Interzis). Mesaj eMAG: ${error.message}. Asigură-te că IP-ul de mai sus este EXACT cel din eMAG și că ai dat Save.` };
    }
    if (error.message && error.message.includes("IP")) {
       return { success: false, error: `${error.message}. Te rugăm să verifici dacă acest IP este adăugat în eMAG la secțiunea 'IP-uri valide API'.` };
    }
    
    return { success: false, error: error.message || "Eroare internă. Verifică log-urile." };
  }
}
