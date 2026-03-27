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
        itemsPerPage: 100,
        with_product: 1 // Request product details including images
      }
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`eMAG API HTTP Error: ${response.status}`);
  }

  const data = await response.json();

  if (data.isError) {
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

    // LOG the IP used for THIS specific request to help debugging
    let currentIp = "unknown";
    try {
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipRes.json();
      currentIp = ipData.ip;
      console.log(`[eMAG Debug] Starting import from IP: ${currentIp}`);
    } catch (e) {}

    let allEmagProducts: any[] = [];
    let currentPage = 1;
    let hasMore = true;
    const maxPages = 20; 

    while (hasMore && currentPage <= maxPages) {
      const { results } = await fetchEmagProducts(username, password, currentPage);
      
      if (Array.isArray(results) && results.length > 0) {
        allEmagProducts = [...allEmagProducts, ...results];
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
      return { success: false, error: "Nu s-au găsit produse în contul eMAG." };
    }

    let importCount = 0;
    
    for (const emagProduct of allEmagProducts) {
      const emagId = String(emagProduct.id || emagProduct.product_id || "");
      if (!emagId) continue;

      const stock = parseInt(emagProduct.general_stock || "0", 10);
      const price = parseFloat(emagProduct.sale_price || "0");
      const name = emagProduct.name || emagProduct.product?.name || "Produs eMAG";
      const description = emagProduct.description || emagProduct.product?.description || "";
      
      let imageList: string[] = [];
      
      // Exhaustive Image Extraction
      const extractFrom = (obj: any) => {
        if (!obj) return [];
        if (Array.isArray(obj)) return obj.map(img => {
          if (typeof img === "string") return img;
          return img.url || img.url_id || null;
        }).filter(Boolean);
        if (typeof obj === "object") return [obj.url || obj.url_id].filter(Boolean);
        return [];
      };

      // 1. Check top-level images
      imageList = [...imageList, ...extractFrom(emagProduct.images)];
      
      // 2. Check nested product.images
      if (emagProduct.product?.images) {
        imageList = [...imageList, ...extractFrom(emagProduct.product.images)];
      }

      // 3. Check variants for images (Crucial for Fashion)
      if (emagProduct.product?.variants && Array.isArray(emagProduct.product.variants)) {
        for (const variant of emagProduct.product.variants) {
           imageList = [...imageList, ...extractFrom(variant.images)];
        }
      }

      // 4. Check media
      if (emagProduct.product?.media?.images) {
         imageList = [...imageList, ...extractFrom(emagProduct.product.media.images)];
      }

      // 5. Check attachments
      if (emagProduct.attachments) {
         imageList = [...imageList, ...extractFrom(emagProduct.attachments)];
      }

      // De-duplicate URLs
      imageList = [...new Set(imageList)].filter(url => typeof url === "string" && url.startsWith("http"));

      // Fallback
      if (imageList.length === 0) {
        imageList = ["/placeholder-toy.png"];
      }

      // UPSERT logic to avoid duplicates and update images
      // Using type casting as a temporary workaround for lint errors if types haven't refreshed
      await (prisma.product as any).upsert({
        where: { emagId: emagId },
        update: {
          name,
          description,
          price,
          stock,
          images: JSON.stringify(imageList),
          updatedAt: new Date()
        },
        create: {
          emagId,
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

    revalidatePath("/admin/products");
    revalidatePath("/shop");

    return { success: true, count: importCount };

  } catch (error: any) {
    console.error("eMAG import error:", error);
    return { success: false, error: error.message || "Eroare internă." };
  }
}
