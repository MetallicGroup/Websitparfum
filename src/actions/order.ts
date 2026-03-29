"use server";

import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";
import { sendOrderConfirmationEmail, sendAdminOrderAlert } from "./email";

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
  paymentIntentId?: string | null;
};

export async function createOrder(data: OrderData) {
  try {
    const { customerInfo, shippingMethod, paymentMethod, items, subtotal, shippingCost, total } = data;
    const shippingAddress = `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.county}`;

    // 1. Check/Create User automatically
    let userId = null;
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: customerInfo.email }
      });
      
      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Create new user for this customer
        const newUser = await prisma.user.create({
          data: {
            email: customerInfo.email,
            name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            password: `USER-${customerInfo.phone}`, // Temp password
            role: "USER"
          }
        });
        userId = newUser.id;
      }
    } catch (userError) {
      console.error("Auto-account error (non-blocking):", userError);
      // Continue without userId if account creation fails
    }

    // 2. Transaction to create order and decrement stock
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: userId,
          customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          customerAddress: shippingAddress,
          status: data.paymentIntentId ? "PROCESSING" : "PENDING",
          paymentMethod: data.paymentMethod,
          deliveryMethod: data.shippingMethod,
          subtotal: data.subtotal,
          shippingCost: data.shippingCost,
          total: data.total,
          stripePaymentIntentId: data.paymentIntentId,
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

      // Update stock for each product
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return newOrder;
    });

    // 2. Trigger Email Notifications (Simulated/Async)
    const orderForEmail = {
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      total: order.total
    };
    
    // Non-blocking trigger
    sendOrderConfirmationEmail(orderForEmail).catch(error => 
      console.error("Failed to send customer confirmation:", error)
    );
    sendAdminOrderAlert(orderForEmail).catch(error => 
      console.error("Failed to send admin alert:", error)
    );

    revalidatePath("/admin/orders");
    
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Eroare la crearea comenzii:", error);
    return { success: false, error: "Eroare la procesarea comenzii în baza de date." };
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
