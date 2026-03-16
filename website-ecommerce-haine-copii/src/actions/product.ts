"use server"

import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";

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

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string, 10);
    const categoryId = formData.get("categoryId") as string;
    const minAge = parseInt(formData.get("minAge") as string, 10) || 0;
    const maxAge = parseInt(formData.get("maxAge") as string, 10) || 168; // default to 14 years
    
    // In a real app we'd upload images to S3/Cloudinary and store URLs. Here we mock.
    const imagesArray = ["/placeholder-toy.png", "/placeholder-clothes.png"]; 
    const imagesStr = JSON.stringify(imagesArray);

    if (!name || !price || isNaN(price) || !categoryId) {
      return { success: false, error: "Date obligatorii lipsă." };
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        stock,
        categoryId,
        minAge,
        maxAge,
        images: imagesStr,
        variations: JSON.stringify([]), // Empty for now
        isPopular: false,
        isNew: true
      }
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true, data: newProduct };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Eroare la crearea produsului." };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id }
    });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Eroare la ștergerea produsului." };
  }
}
