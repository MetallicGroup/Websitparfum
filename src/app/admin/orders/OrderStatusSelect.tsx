"use client";

import React, { useState } from "react";
import { updateOrderStatus } from "@/actions/order";

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsUpdating(true);

    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (!result.success) {
        alert("Eroare la actualizarea statusului: " + result.error);
        setStatus(currentStatus); // Revert on failure
      }
    } catch {
      alert("A apărut o eroare necunoscută.");
      setStatus(currentStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isUpdating}
      className={`border border-gray-200 rounded px-2 py-1 text-sm bg-gray-50 focus:border-turquoise focus:outline-none ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <option value="PENDING">În Așteptare</option>
      <option value="IN_PROCESARE">În Procesare</option>
      <option value="SHIPPED">Expediată</option>
      <option value="DELIVERED">Livrată</option>
      <option value="CANCELLED">Anulată</option>
    </select>
  );
}
