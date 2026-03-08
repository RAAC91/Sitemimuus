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
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white/90 dark:bg-slate-900/95 backdrop-blur-3xl z-[1000] flex flex-col shadow-2xl transition-all border-l border-white/50 dark:border-slate-800"
          >
            {/* Header */}
            <div className="px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-pastelPink to-pastelLavender flex items-center justify-center text-accentPink shadow-sm">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Sua Sacola</h2>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
                </div>
              </div>
              <button 
                onClick={closeCart}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-pastelPink/20 dark:hover:bg-slate-800 smooth-transition text-slate-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                        <ShoppingBag size={48} className="text-gray-300" />
                        <p className="text-lg font-medium text-gray-400">Sua sacola está vazia</p>
                        <button onClick={closeCart} className="text-accentPink font-bold hover:underline">
                        Começar a comprar
                        </button>
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="pastel-gradient-border rounded-4xl p-6 shadow-xl smooth-transition hover:shadow-2xl">
                            <div className="flex gap-8">
                                <div className="relative w-24 aspect-9/16 shrink-0">
                                    <div className="relative w-full h-full rounded-lg overflow-hidden bg-white dark:bg-slate-800 border border-white/20 shadow-md">
                                        {item.thumbnail ? (
                                            <img 
                                                alt={item.name} 
                                                className="w-full h-full object-cover scale-105 pastel-image-filter" 
                                                src={item.thumbnail} 
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 animate-pulse" />
                                        )}

                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight line-clamp-1">{item.name}</h3>
                                        <p className="text-slate-400 font-semibold text-xs mt-1">
                                            {item.customization?.text ? `"${item.customization.text}"` : 'Sem personalização'}
                                        </p>
                                        
                                        {/* Admin Calibration Button */}
                                        {isAdmin && (
                                            <button 
                                                onClick={() => setCalibratingItem(item)}
                                                className="mt-2 text-[10px] uppercase font-bold text-accentPurple hover:text-accentPink flex items-center gap-1"
                                            >
                                                <Settings size={12} />
                                                Calibrar
                                            </button>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                            R$ {item.price.toFixed(2)}
                                        </div>
                                        <div className="flex items-center w-fit bg-pastelSky/30 dark:bg-slate-800/50 rounded-2xl p-1 border border-white/40 dark:border-slate-700/50">
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/90 dark:bg-slate-700 text-slate-500 hover:text-accentPink smooth-transition shadow-sm disabled:opacity-50"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="px-4 font-bold text-slate-700 dark:text-slate-200 text-sm">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/90 dark:bg-slate-700 text-slate-500 hover:text-accentPink smooth-transition shadow-sm"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => removeItem(item.id)}
                                            className="text-xs text-slate-400 hover:text-red-400 font-bold uppercase tracking-wide"
                                        >
                                            Remover
                                        </button>
                                    </div>
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


