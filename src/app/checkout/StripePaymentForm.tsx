"use client";

import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import styles from "./checkout.module.css";

export default function StripePaymentForm({ 
  onSuccess, 
  totalAmount 
}: { 
  onSuccess: (paymentIntentId: string) => void, 
  totalAmount: number 
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "A apărut o eroare la procesarea plății.");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent.id);
    }
  };

  return (
    <div className={styles.stripeForm}>
      <PaymentElement />
      {errorMessage && <div className={styles.errorAlert}>{errorMessage}</div>}
      <button 
        type="button" 
        onClick={handleSubmit}
        disabled={isProcessing || !stripe}
        className={`btn btn-primary ${styles.placeOrderBtn}`}
        style={{ marginTop: '1.5rem', width: '100%' }}
      >
        {isProcessing ? "Se procesează plata..." : `Plătește ${totalAmount.toFixed(2)} Lei`}
      </button>
    </div>
  );
}
