"use server";

import { prisma } from "@/lib/prisma/client";
import { Product } from "@prisma/client";

export async function getRecommendedProducts(cartProductIds: string[], limit: number = 4) {
  try {
    // 1. Fetch the categories of the items currently in the cart
    const cartProducts = await prisma.product.findMany({
      where: {
        id: { in: cartProductIds }
      },
      select: { categoryId: true }
    });

    const categoryIds = cartProducts.map(p => p.categoryId);
    const uniqueCategoryIds = Array.from(new Set(categoryIds));

    // 2. Find other products in those SAME categories, EXCLUDING the ones already in cart
    let recommended: Product[] = [];

    if (uniqueCategoryIds.length > 0) {
      recommended = await prisma.product.findMany({
        where: {
          categoryId: { in: uniqueCategoryIds },
          id: { notIn: cartProductIds },
          stock: { gt: 0 } // only recommend in-stock items
        },
        take: limit,
        orderBy: {
          isPopular: 'desc' // prioritize popular items within the category
        }
      });
    }

    // 3. If we don't have enough recommendations from the same categories (or cart is empty),
    // fill the rest with globally popular products that aren't in the cart.
    if (recommended.length < limit) {
      const remainingNeeded = limit - recommended.length;
      const excludeIds = [...cartProductIds, ...recommended.map(r => r.id)];

      const popularFillers = await prisma.product.findMany({
        where: {
          id: { notIn: excludeIds },
          stock: { gt: 0 }
        },
        take: remainingNeeded,
        orderBy: [
          { isPopular: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      recommended = [...recommended, ...popularFillers];
    }

    return { success: true, data: recommended };
  } catch (error) {
    console.error("Eroare la încarcarea recomandărilor:", error);
    return { success: false, data: [] };
  }
}
