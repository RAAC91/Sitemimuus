"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export function StripePaymentForm({ totalAmount, orderId }: { totalAmount: number, orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Redirect to the dynamic success page using the orderId
        return_url: `${window.location.origin}/sucesso/${orderId}`,
      },
    });

    if (error) {
      setErrorMessage(error.message ?? "An unknown error occurred");
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="text-red-500 text-sm">{errorMessage}</div>
      )}

      <button
        disabled={!stripe || isProcessing}
        type="submit"
        className="w-full bg-black text-white py-4 rounded-lg font-medium tracking-wide hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? "Processando..." : `Pagar R$ ${(totalAmount / 100).toFixed(2).replace('.', ',')}`}
      </button>
    </form>
  );
}
