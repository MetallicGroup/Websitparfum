"use server";

import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";

type OrderData = {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    county: string;
  };
  shippingMethod: string;
  paymentMethod: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    variation?: string;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
};

export async function createOrder(data: OrderData) {
  try {
    const { customerInfo, shippingMethod, paymentMethod, items, subtotal, shippingCost, total } = data;

    const shippingAddress = `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.county}`;

    await prisma.order.create({
      data: {
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        customerAddress: shippingAddress,
        status: "PENDING",
        paymentMethod: paymentMethod.toUpperCase(), // e.g. "CARD", "RAMBURS"
        deliveryMethod: shippingMethod.toUpperCase(), // e.g. "SAMEDAY", "EASYBOX", "FANCOURIER"
        subtotal: subtotal,
        shippingCost: shippingCost,
        total: total,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            variation: item.variation,
          }))
        }
      }
    });

    revalidatePath("/admin/orders");
    
    return { success: true };
  } catch (error) {
    console.error("Eroare la crearea comenzii:", error);
    return { success: false, error: "Database error." };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
    
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Eroare la actualizarea comenzii:", error);
    return { success: false, error: "Database error." };
  }
}

