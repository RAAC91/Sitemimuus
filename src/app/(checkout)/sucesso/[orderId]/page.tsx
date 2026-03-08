'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, QrCode, Copy } from 'lucide-react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cartStore';

export default function SuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const [pixData, setPixData] = useState<{ qr_code: string; qr_code_base64: string } | null>(null);
  const { clearCart } = useCartStore();

  useEffect(() => {
    // Clear cart after successful checkout redirect
    clearCart();
    
    // Verifica se existe intenção de PIX na sessão
    const qrCodeBase64 = sessionStorage.getItem('mp_pix_qr');
    const qrCodeText = sessionStorage.getItem('mp_pix_code');

    if (qrCodeBase64 && qrCodeText) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setPixData({ qr_code: qrCodeText, qr_code_base64: qrCodeBase64 });
      // Limpa para evitar reexibir em refreshs futuros
      sessionStorage.removeItem('mp_pix_qr');
      sessionStorage.removeItem('mp_pix_code');
    } else {
      // Confetti apenas para pagamentos aprovados (Stripe via Success URL redirect)
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, []);

  const handleCopyPix = () => {
    if (pixData?.qr_code) {
      navigator.clipboard.writeText(pixData.qr_code);
      toast.success('Código PIX copiado!');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        
        {pixData ? (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8 relative"
          >
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse opacity-50" />
            <QrCode className="w-12 h-12 text-blue-600 stroke-[3]" />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 relative"
          >
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
            <Check className="w-12 h-12 text-green-600 stroke-[3]" />
          </motion.div>
        )}

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-black text-zinc-900 mb-4 tracking-tight"
        >
          {pixData ? 'Complete seu Pagamento' : 'Pedido Confirmado!'}
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-zinc-500 mb-8 text-lg"
        >
          {pixData 
            ? `Seu pedido #${orderId} foi reservado. Escaneie o QR Code ou copie a linha digitável para finalizar a compra.`
            : `Obrigado por sua compra. Seu pedido #${orderId} foi recebido e já estamos preparando tudo.`}
        </motion.p>

        {pixData ? (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100"
          >
             <div className="flex justify-center mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
               <Image 
                 src={`data:image/png;base64,${pixData.qr_code_base64}`} 
                 alt="QR Code PIX" 
                 width={200} 
                 height={200}
                 className="rounded-lg"
               />
             </div>
             
             <button 
               onClick={handleCopyPix}
               className="w-full flex items-center justify-center gap-2 bg-brand-pink text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all active:scale-95"
             >
               <Copy className="w-4 h-4" />
               Copiar Código PIX (Copia e Cola)
             </button>
             <p className="text-xs text-zinc-400 mt-4">Assim que pago, seu pedido será aprovado automaticamente.</p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100"
          >
            <div className="flex items-center justify-center gap-3 text-sm text-zinc-600 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Status: <strong>Pagamento Aprovado</strong>
            </div>
            <p className="text-xs text-zinc-400">Você receberá atualizações por e-mail.</p>
          </motion.div>
        )}

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          {!pixData && (
             <Link 
               href={`/minha-conta/pedidos/${orderId}`}
               className="block w-full bg-brand-pink text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-brand-pink/20 hover:scale-[1.02] active:scale-95"
             >
               Acompanhar Pedido
             </Link>
          )}
          
          <Link 
            href="/produtos" 
            className={`block w-full font-bold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-95 ${
              pixData ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-gray-100 text-zinc-900 hover:bg-gray-200'
            }`}
          >
            Continuar Comprando
          </Link>
          
          <Link 
            href="/" 
            className="block w-full text-zinc-500 font-medium hover:text-brand-pink transition-colors py-2"
          >
            Voltar para Início
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
