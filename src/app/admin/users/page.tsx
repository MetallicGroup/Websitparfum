import React from "react";
import { getCustomers } from "@/actions/customer-auth";
import UsersClient from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const res = await getCustomers();
  const customers = res.success ? res.data : [];

  return (
    <UsersClient initialUsers={customers as any[]} />
  );
}
