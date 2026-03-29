"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAdmin(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const envUser = process.env.ADMIN_USER || "admin";
  const envPass = process.env.ADMIN_PASS || "admin123";

  if (username === envUser && password === envPass) {
    const cookieStore = await cookies();
    // Use a more complex session value or a simple signed token if needed
    cookieStore.set("admin_session", "authenticated_secure_v1", { 
      secure: true,
      httpOnly: true, 
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 // 24 hours
    });
    // Redirect to admin dashboard
    redirect("/admin");
  } else {
    return { success: false, error: "Nume de utilizator sau parolă incorecte." };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/login-admin");
}
