"use client";

import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowRight, Settings, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { CaptureCalibrationModal, CaptureConfig } from "../visual-editor/CaptureCalibrationModal";
import { toCanvas } from "html-to-image";
import { CartItem } from "@/types";
import { useAdmin } from "@/hooks/useAdmin";
import { useRouter } from "next/navigation";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, updateItemThumbnail, total } = useCartStore();
  const { isAdmin } = useAdmin();
  const router = useRouter();
  const [isLoading] = useState(false);
  const [calibratingItem, setCalibratingItem] = useState<CartItem | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isGift, setIsGift] = useState(false);

  // Prevent scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const totalPrice = total();

  const handleConfirmCalibration = async (config: CaptureConfig) => {
    if (!calibratingItem) return;
    
    setIsCapturing(true);
    try {
      const captureElement = document.getElementById('capture-preview-target');
      if (captureElement) {
        const canvas = await toCanvas(captureElement, {
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          width: config.width,
          height: config.height,
          fontEmbedCSS: ''
        });
        const newThumbnail = canvas.toDataURL('image/png', 0.9);
        updateItemThumbnail(calibratingItem.id, newThumbnail);
        setCalibratingItem(null);
      }
    } catch (error) {
      console.error("Error recalibrating capture:", error);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white/95 dark:bg-slate-900/98 backdrop-blur-3xl z-[1000] flex flex-col shadow-2xl border-l border-white/50 dark:border-slate-800"
            style={{ height: '100dvh' }}
          >
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-pastelPink to-pastelLavender flex items-center justify-center text-accentPink shadow-sm">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">Sua Sacola</h2>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{items.length} {items.length === 1 ? 'item' : 'itens'}</span>
                </div>
              </div>
              <button 
                onClick={closeCart}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 space-y-3" style={{ WebkitOverflowScrolling: 'touch' }}>
                {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 py-16">
                        <ShoppingBag size={40} className="text-gray-300" />
                        <p className="text-base font-medium text-gray-400">Sua sacola está vazia</p>
                        <button onClick={closeCart} className="text-accentPink font-bold hover:underline text-sm">
                            Começar a comprar
                        </button>
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="flex gap-3">
                                {/* Thumbnail */}
                                <div className="relative w-16 shrink-0" style={{ aspectRatio: '9/16' }}>
                                    <div className="relative w-full h-full rounded-md overflow-hidden bg-slate-50 dark:bg-slate-700">
                                        {item.thumbnail ? (
                                            <img 
                                                alt={item.name} 
                                                className="w-full h-full object-cover" 
                                                src={item.thumbnail} 
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-200 animate-pulse" />
                                        )}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 flex flex-col gap-2 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold text-slate-800 dark:text-white leading-tight line-clamp-2">{item.name}</h3>
                                            <p className="text-slate-400 font-medium text-[11px] mt-0.5 line-clamp-1">
                                                {item.customization?.text ? `"${item.customization.text}"` : 'Personalizado'}
                                            </p>
                                        </div>
                                        {/* Delete button */}
                                        <button 
                                            onClick={() => removeItem(item.id)}
                                            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            title="Remover item"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-base font-bold text-slate-800 dark:text-slate-100">
                                            R$ {item.price.toFixed(2)}
                                        </div>
                                        {/* Quantity controls */}
                                        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/50 rounded-xl p-1">
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-slate-600 text-slate-500 hover:text-accentPink transition-colors shadow-sm disabled:opacity-40"
                                                title="Diminuir quantidade"
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="w-6 text-center font-bold text-slate-700 dark:text-slate-200 text-sm">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-slate-600 text-slate-500 hover:text-accentPink transition-colors shadow-sm"
                                                title="Aumentar quantidade"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Admin Calibration Button — desktop only */}
                                    {isAdmin && (
                                        <button 
                                            onClick={() => setCalibratingItem(item)}
                                            className="hidden md:flex text-[10px] uppercase font-bold text-accentPurple hover:text-accentPink items-center gap-1 w-fit"
                                        >
                                            <Settings size={10} />
                                            Calibrar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Calibration Modal */}
            {calibratingItem && (
               <CaptureCalibrationModal
                 isOpen={!!calibratingItem}
                 onClose={() => setCalibratingItem(null)}
                 onConfirmCapture={handleConfirmCalibration}
                 sku={calibratingItem.productId}
                 lidColor={(calibratingItem.customization?.backgroundColor as string) || '#ffffff'}
                 layers={(calibratingItem.customization?.layers as any) || []}
                 isBusy={isCapturing}
                 defaultTextPosition={{ x: 0, y: 0 }}
               />
            )}

            {/* Footer */}
            {items.length > 0 && (
                <div className="pastel-gradient-border rounded-t-5xl p-6 shadow-xl space-y-8 bg-white dark:bg-slate-900 border-t border-white/50">
                    
                    {/* Gift Option */}
                    <div 
                        onClick={() => setIsGift(!isGift)}
                        className={`p-5 border rounded-[2rem] flex gap-4 items-center group cursor-pointer smooth-transition ${isGift ? 'bg-pastelLavender/40 border-accentPurple' : 'bg-pastelLavender/20 border-white dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800'}`}
                    >
                        <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl shadow-sm flex items-center justify-center shrink-0 text-accentPurple">
                            <ArrowRight className={`w-6 h-6 transition-transform ${isGift ? '-rotate-90' : 'rotate-0'}`} />
                        </div>
                        <div className="flex-1">
                            <p className="text-base font-bold text-slate-700 dark:text-slate-200">Embalagem presente?</p>
                            <p className="text-xs text-slate-400 font-semibold">{isGift ? 'Adicionado com carinho!' : 'Adicione um toque especial.'}</p>
                        </div>
                        {isGift && <div className="w-4 h-4 rounded-full bg-accentPurple" />}
                    </div>

                    <div className="space-y-6 px-2">
                        {/* Shipping Hidden as requested */}
                        {/* <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Frete Estimado</span>
                            <span className="text-[10px] text-white font-bold bg-accentBlue dark:bg-blue-600 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">Grátis</span>
                        </div> */}

                        <div className="flex justify-between items-end">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Total do Pedido</span>
                            <div className="text-right">
                                <span className="text-4xl font-black text-slate-800 dark:text-white">R$ {totalPrice.toFixed(2)}</span>
                                <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-widest">
                                    Até 3x de R$ {(totalPrice / 3).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleCheckout}
                        disabled={isLoading}
                        className="w-full pastel-button-gradient hover:opacity-90 text-white font-bold py-5 px-8 rounded-3xl shadow-2xl soft-glow-pastel smooth-transition flex items-center justify-center gap-4 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <span className="tracking-widest text-lg">{isLoading ? "Processando..." : "Finalizar Compra"}</span>
                        {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-2 smooth-transition" />}
                    </button>
                    
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-widest pt-4 border-t border-slate-100 dark:border-slate-800">
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-accentPink animate-pulse"></span>
                            Sessão Ativa
                        </span>
                        <div className="flex items-center gap-1">
                            <Settings className="w-3 h-3" />
                            <span>Pagamento Seguro Stripe</span>
                        </div>
                    </div>
                </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}


