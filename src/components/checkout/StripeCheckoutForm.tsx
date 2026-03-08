'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function StripeCheckoutForm({ orderId, total, onSuccess }: { orderId: string; total: number; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/sucesso/${orderId}?provider=stripe`,
      },
      // Note: we are redirecting here, so we might not even hit the lines below if it succeeds immediately
      // But we will if it's an async payment method or if it errors out immediately
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        toast.error(error.message);
      } else {
        toast.error('Ocorreu um erro inesperado ao processar seu pagamento.');
      }
      setIsLoading(false);
    } else {
      // In case the payment doesn't redirect immediately (some async methods)
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-100 dark:border-white/10 shadow-sm">
        <PaymentElement 
          options={{
            layout: 'tabs',
            paymentMethodOrder: ['card'],
          }} 
        />
      </div>
      
      <button 
        disabled={isLoading || !stripe || !elements} 
        id="submit"
        className="w-full bg-brand-pink text-white py-4 rounded-lg font-bold hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-pink/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span id="button-text">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processando...
            </div>
          ) : (
             `Pagar ${formatPrice(total)}`
          )}
        </span>
      </button>

      <div className="text-center text-xs text-gray-500 mt-4 font-medium flex items-center justify-center gap-1">
        <span className="text-gray-400">🔒</span> Pagamento seguro processado por Stripe
      </div>
    </form>
  );
}
