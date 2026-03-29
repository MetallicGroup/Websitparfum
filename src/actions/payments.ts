"use server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as any,
});

export async function createPaymentIntent(amount: number) {
  try {
    // Amount is in cents for Stripe (e.g. 100.00 Lei = 10000 cents)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "ron",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return { 
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id 
    };
  } catch (error) {
    console.error("Stripe error:", error);
    throw new Error("Eroare la generarea plății.");
  }
}
