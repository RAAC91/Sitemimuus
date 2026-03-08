"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // Trigger confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden text-center p-12"
      >
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
           <Check size={48} className="text-green-600" strokeWidth={3} />
        </div>

        <h1 className="text-3xl font-black text-brand-black mb-2">
            Pedido Confirmado!
        </h1>
        <p className="text-gray-500 mb-8 max-w-xs mx-auto">
            Obrigado por comprar na Mimuus. Enviamos um email com os detalhes do seu pedido.
        </p>

        {mounted && sessionId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-100">
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">ID do Pedido</span>
               <code className="text-sm font-mono text-brand-black bg-white px-2 py-1 rounded border">
                 {sessionId.slice(0, 18)}...
               </code>
            </div>
        )}

        <div className="space-y-3">
            <Link 
              href="/conta" 
              className="block w-full py-4 bg-brand-black text-white rounded-lg font-bold tracking-wide hover:bg-gray-900 transition-colors"
            >
               ACOMPANHAR PEDIDO
            </Link>
            
            <Link 
              href="/produtos" 
              className="block w-full py-4 bg-white border border-gray-200 text-brand-black rounded-lg font-bold tracking-wide hover:bg-gray-50 transition-colors"
            >
               VOLTAR PARA A LOJA
            </Link>
        </div>
      </motion.div>

      <div className="mt-8 flex items-center gap-2 text-gray-400 text-sm">
         <ShoppingBag size={16} />
         <span>Precisa de ajuda? <a href="/faq" className="underline hover:text-brand-pink">Acesse o FAQ</a></span>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400">
          <span className="loading loading-spinner loading-lg"></span>
       </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
