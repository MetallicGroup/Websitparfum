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
export async function importEmagProducts(username: string, password: string) {
  try {
    if (!username || !password) {
      return { success: false, error: "Te rog completează datele eMAG." };
    }

    // LOG the IP used for THIS specific request to help debugging
    let currentIp = "unknown";
    try {
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipRes.json();
      currentIp = ipData.ip;
      console.log(`[eMAG Debug] Starting import from IP: ${currentIp}`);
    } catch (e) {}

    // Fetch local categories for auto-mapping
    const localCategories = await prisma.category.findMany();
    const mapCategory = (productName: string) => {
      const name = productName.toLowerCase();
      // Expanded keyword matching for Romanian market
      if (name.match(/jucar|lego|plus|puzzle|interactiv|pupa|masinuta|papusa|robot|joc/)) return localCategories.find(c => c.slug === 'jucarii')?.id;
      if (name.match(/rochi|fust|balet|printesa/)) return localCategories.find(c => c.slug === 'rochii-fetite')?.id;
      if (name.match(/comple|set|trening|pijama|tricou|pantaloni|geaca|haina/)) return localCategories.find(c => c.slug === 'haine')?.id;
      if (name.match(/bebe|scutec|luni|nou-nascut|body|salopeta|biberon|suzeta/)) return localCategories.find(c => c.slug === 'bebe')?.id;
      if (name.match(/accesor|caciul|manus|fular|soset|bentita|agrafa|ghiozdan|rucsac/)) return localCategories.find(c => c.slug === 'accesorii')?.id;
      
      // Look for age-based categories if they exist (e.g. "0-3 luni")
      if (name.match(/0-3 luni|3-6 luni|6-9 luni/)) return localCategories.find(c => c.slug === 'bebe')?.id;
      
      // Default fallback
      return localCategories.find(c => c.slug === 'haine')?.id || localCategories[0]?.id;
    };

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

    // DEBUG: dump the first product to the console so we can see the exact eMAG JSON structure
    console.log("[DEBUG eMAG] Sample Product 0:", JSON.stringify(allEmagProducts[0], null, 2));

    let importCount = 0;
    let missingImagesIds: string[] = [];
    
    for (const emagProduct of allEmagProducts) {
      // Only accept genuine part number keys or product IDs, never legacy sequential offer IDs
      const emagId = String(emagProduct.part_number_key || emagProduct.product_id || "");
      if (!emagId || emagId.length < 5) continue;

      const stock = parseInt(emagProduct.general_stock || "0", 10);
      const price = parseFloat(emagProduct.sale_price || "0");
      const name = emagProduct.name || emagProduct.product?.name || "Produs eMAG";
      const description = emagProduct.description || emagProduct.product?.description || "";
      
      console.log(`[eMAG Debug] Processing product: ${name} (ID: ${emagProduct.part_number_key || emagProduct.product_id})`);
      
      // Auto-map category
      const mappedCategoryId = mapCategory(name) || localCategories[0]?.id;
      if (!mappedCategoryId) continue;
      
      // Skip image extraction as requested by the user for manual management
      const imageList: string[] = [];

      // UPSERT logic: New products get no images, existing ones stay as they are if they have images?
      // Actually, the user said "incarc produsele ... fara nici o poza", usually implies new ones.
      // If updating, I'll keep existing images to avoid data loss, but for NEW ones it's empty.
      
      const existingProduct = await (prisma.product as any).findUnique({
        where: { emagId: emagId }
      });

      if (existingProduct) {
        await (prisma.product as any).update({
          where: { emagId: emagId },
          data: {
            name,
            description,
            price,
            stock,
            categoryId: mappedCategoryId,
            updatedAt: new Date()
          }
        });
      } else {
        await (prisma.product as any).create({
          data: {
            emagId,
            name,
            slug: generateSlug(name),
            description,
            price,
            stock,
            categoryId: mappedCategoryId,
            images: JSON.stringify([]),
            variations: JSON.stringify([]),
            minAge: 0,
            maxAge: 168,
            isPopular: false,
            isNew: true
          }
        });
      }
      importCount++;
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");

    return { 
      success: true, 
      count: importCount, 
      missingImagesIds: Array.from(new Set(missingImagesIds)) 
    };

  } catch (error: any) {
    console.error("eMAG import error:", error);
    return { success: false, error: error.message || "Eroare internă." };
  }
}

export async function syncEmagImagesBatch(username: string, password: string, productIds: string[]) {
  try {
    if (!productIds || productIds.length === 0) return { success: true };
    
    let syncedCount = 0;
    
    // Secure Scraper using direct search lookup (eMAG API excludes images for attached offers)
    for (const pnk of productIds) {
      if (!pnk || pnk.length < 5) continue; // Skip numeric legacy offer IDs completely
      
      try {
        const response = await fetch(`https://www.emag.ro/search/${pnk}`, {
           headers: {
             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
           },
           redirect: "follow",
           cache: "no-store"
        });
        
        // CRITICAL FIX: Only scrape if eMAG search engine redirected accurately to the expected product
        if (response.ok && response.url.includes(pnk)) {
           const html = await response.text();
           const match = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
           if (match && match[1] && match[1].includes('http') && !match[1].includes('placeholder')) {
              await (prisma.product as any).updateMany({
                where: { emagId: pnk },
                data: { images: JSON.stringify([match[1]]) }
              });
              syncedCount++;
           }
        }
      } catch (err) {
         console.error(`[eMAG Scraper] Failed to fetch image for: ${pnk}`, err);
      }
    }

    return { success: true, count: syncedCount };

  } catch(err) {
    console.error("Batch image sync error:", err);
    return { success: false };
  }
}

