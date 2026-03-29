"use server"

import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "Nu a fost găsit niciun fișier." };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    if (!supabase) {
      return { success: false, error: "Supabase client is not initialized. Check your environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) in Vercel Dashboard." };
    }

    const { data, error } = await supabase.storage
      .from('kiddyshop') // We'll assume bucket name is 'kiddyshop'
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('kiddyshop')
      .getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error("Error uploading to Supabase Storage:", error);
    return { success: false, error: "Eroare la încărcarea imaginii. Cod: " + (error.message || "Unknown") };
  }
}

export async function getProducts(options?: {
  categoryId?: string;
  isPopular?: boolean;
  take?: number;
  skip?: number;
}) {
  try {
    const { categoryId, isPopular, take, skip } = options || {};
    
    const products = await prisma.product.findMany({
      where: {
        ...(categoryId && { categoryId }),
        ...(isPopular !== undefined && { isPopular }),
      },
      take,
      skip,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "Nu am putut încărca produsele." };
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, reviews: true }
    });
    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: "Nu am putut încărca detaliile produsului." };
  }
}

export async function createFullProduct(data: any) {
  try {
    const { name, description, price, stock, categoryId, minAge, maxAge, sku, sizeCm, images, variations } = data;
    
    if (!name || !price || isNaN(parseFloat(price)) || !categoryId) {
      return { success: false, error: "Date obligatorii lipsă (Nume, Preț, Categorie)." };
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock, 10) || 0;
    const minAgeNum = parseInt(minAge, 10) || 0;
    const maxAgeNum = parseInt(maxAge, 10) || 0;
    
    const imagesArray = Array.isArray(images) && images.length > 0 ? images : ["/placeholder-toy.png"];
    const imagesStr = JSON.stringify(imagesArray);

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);

    const newProduct = await (prisma.product as any).create({
      data: {
        name,
        slug,
        description,
        price: priceNum,
        stock: stockNum,
        categoryId,
        sku: sku || null,
        sizeCm: sizeCm || null,
        minAge: minAgeNum,
        maxAge: maxAgeNum,
        images: imagesStr,
        variations: variations || JSON.stringify([]),
        isPopular: false,
        isNew: true
      }
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true, data: newProduct };
  } catch (error: any) {
    console.error("Error creating product:", error);
    if (error.code === 'P2002') { // Prisma unique constraint violation
      return { success: false, error: "Eroare: SKU-ul sau Slug-ul este deja folosit de alt produs." };
    }
    return { success: false, error: "Eroare la crearea produsului. Fii sigur că SKU-ul este unic." };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id }
    });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Eroare la ștergerea produsului." };
  }
}
export async function updateProduct(id: string, data: any) {
  try {
    const { name, description, price, stock, categoryId, sku, sizeCm, images, variations } = data;
    
    if (!name || !price || isNaN(parseFloat(price)) || !categoryId) {
      return { success: false, error: "Date obligatorii lipsă." };
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock, 10) || 0;
    
    // Use the images array provided or keep the existing one if not provided
    const imagesStr = Array.isArray(images) ? JSON.stringify(images) : undefined;

    console.log(`[Admin Debug] Updating product ${id}:`, { name, priceNum, imagesStr });

    await (prisma.product as any).update({
      where: { id },
      data: {
        name,
        description,
        price: priceNum,
        stock: stockNum,
        categoryId,
        sku: sku || null,
        sizeCm: sizeCm || null,
        ...(imagesStr && { images: imagesStr }),
        ...(variations && { variations }),
        updatedAt: new Date()
      }
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath(`/product/${id}`);
    revalidatePath("/");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error updating product:", error);
    return { success: false, error: "Eroare la actualizarea produsului." };
  }
}
