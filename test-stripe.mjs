import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

async function test() {
  console.log("Testing Stripe PaymentIntent creation with explicit 'card'...");
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 9500, // 95.00 RON
      currency: "ron",
      payment_method_types: ["card"],
    });
    console.log("SUCCESS! PaymentIntent ID:", paymentIntent.id);
    console.log("Client Secret:", paymentIntent.client_secret);
  } catch (err) {
    console.error("STRIPE API ERROR:");
    console.error(err.message || err);
  }
  process.exit(0);
}

test();
