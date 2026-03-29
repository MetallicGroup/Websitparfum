"use server";

import { prisma } from "@/lib/prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginCustomer(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Te rugăm să introduci e-mailul și parola." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.role !== "USER") {
      return { success: false, error: "Cont neexistent sau invalid." };
    }

    // During auto-creation, password was set to "USER-{phone}"
    if (user.password !== password) {
      return { success: false, error: "Parolă incorectă." };
    }

    const cookieStore = await cookies();
    cookieStore.set("customer_session", user.id, {
      secure: true,
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Eroare la autentificare." };
  }
}

export async function logoutCustomer() {
  const cookieStore = await cookies();
  cookieStore.delete("customer_session");
  redirect("/");
}

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("customer_session")?.value;
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true }
    });
    return user;
  } catch {
    return null;
  }
}

export async function getCustomers() {
  try {
    const customers = await prisma.user.findMany({
      where: { role: "USER" },
      include: {
        _count: {
          select: { orders: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return { success: true, data: customers };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return { success: false, error: "Nu am putut încărca lista de clienți." };
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id }
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Nu am putut șterge utilizatorul." };
  }
}
