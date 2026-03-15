"use server"

import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" }
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Nu am putut încărca categoriile." };
  }
}

export async function createCategory(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const description = formData.get("description") as string | null;

    if (!name || !type) {
      return { success: false, error: "Numele și tipul sunt obligatorii." };
    }

    // generating a simple slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
        type,
        description,
      }
    });

    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    return { success: true, data: newCategory };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Eroare la crearea categoriei." };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id }
    });
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Eroare la ștergerea categoriei." };
  }
}
