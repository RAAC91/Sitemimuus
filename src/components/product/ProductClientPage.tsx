"use client";

import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import Image from "next/image";
import imageKitLoader from "@/lib/imagekit-loader";
import { motion, AnimatePresence } from "framer-motion";
import { BackgroundEffects } from "@/components/ui/background-effects";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useTheme } from "next-themes";

interface ProductClientPageProps {
    product: Product;
}

export function ProductClientPage({ product }: ProductClientPageProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const [quantity, setQuantity] = useState(1);
  const [showZoom, setShowZoom] = useState(false);
  const { addItem } = useCartStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const galleryImages = product.images?.length ? product.images : [product.image];
  const activeImage = galleryImages[activeImageIndex];

  const handleAddToCart = () => {
    addItem({
      productId: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: quantity,
      thumbnail: galleryImages[0] || '',
      customization: undefined,
      id: `${product.id}-${Date.now()}`
    } as any);
    toast.success("Adicionado à sacola!");
  };

  const handleCustomize = () => {
    const rawSku = product.metadata?.sku;
    const sku = typeof rawSku === 'string' ? rawSku : 'Branco';
    router.push(`/editor?sku=${encodeURIComponent(sku)}&productId=${product.id}`);
  };

  const handleBuyNow = () => {
    addItem({
      productId: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: quantity,
      thumbnail: galleryImages[0] || '',
      customization: undefined,
      id: `${product.id}-${Date.now()}`
    } as any);
    
    router.push('/checkout');
  };

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="min-h-screen relative overflow-hidden antialiased">
      <BackgroundEffects />
      
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 pt-20 md:pt-32 pb-24 md:pb-12 font-display relative z-10">
          {/* Breadcrumb - Hide on small mobile to save space */}
          <div className="hidden sm:block">
            <Breadcrumb 
                items={[
                    { label: "PRODUTOS", href: "/produtos" },
                    { label: product.name }
                ]}
                className="mb-8 ml-4"
            />
          </div>

          {/* Main Content Card with Glassmorphism */}
          <div className={`rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] backdrop-blur-2xl p-4 md:p-12 lg:p-16 border transition-all duration-500 hover:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.15)] ${
            isDark
              ? 'bg-[#0f172a]/60 border-white/10'
              : 'bg-white/40 border-white/50'
          }`}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-start">
                  {/* LEFT COL: GALLERY */}
                  <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4 md:gap-8 lg:sticky lg:top-24">
                      {/* Main View */}
                      <div className="flex-1">
                          <motion.div 
                              layoutId={`image-${product.id}`}
                              className={`aspect-square md:aspect-4/5 rounded-2xl md:rounded-3xl overflow-hidden relative group cursor-zoom-in border shadow-sm transition-colors duration-500 ${
                                isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-white/20'
                              }`}
                              onClick={() => setShowZoom(true)}
                          >
                              <Image 
                                  src={activeImage || "/placeholder.jpg"} 
                                  alt={product.name}
                                  fill
                                  loader={imageKitLoader}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pastel-image-filter"
                                  priority
                              />
                              
                              {/* Zoom Hint */}
                              <div className="absolute bottom-8 right-8 w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30 border border-white/30">
                                 <span className="text-white font-black text-[10px] tracking-tight">ZOOM</span>
                              </div>

                              {/* Soft Badge */}
                              <div className="absolute top-8 left-8 bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-2 border border-white/30 z-30 shadow-sm">
                                  <span className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-pulse" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">Best Seller</span>
                              </div>
                          </motion.div>
                      </div>
                      
                      {/* Thumbnails (PACCO Style) */}
                      <div className="md:w-24 flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto scrollbar-hide py-2 md:py-1 px-1 md:px-1">
                          {galleryImages.map((img, i) => (
                               <button 
                                  key={i} 
                                  onClick={() => setActiveImageIndex(i)}
                                  className={`shrink-0 w-20 h-20 md:w-full md:h-auto aspect-square rounded-md transition-all duration-300 relative overflow-hidden bg-white/60 backdrop-blur-sm border ${
                                    activeImageIndex === i 
                                      ? 'border-transparent scale-95 ring-[1.5px] ring-zinc-900 ring-offset-2 ring-offset-[#fcfbf9]' 
                                      : isDark ? 'border-white/5 opacity-70 hover:opacity-100' : 'border-zinc-200/50 hover:border-zinc-300 opacity-70 hover:opacity-100'
                                  }`}
                               >
                                  <Image 
                                      fill
                                      loader={imageKitLoader}
                                      className="object-contain p-2" 
                                      src={img || "/placeholder.jpg"} 
                                      alt={`View ${i}`} 
                                  />
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* RIGHT COL: DETAILS */}
                  <div className="lg:col-span-5 space-y-12">
                      <div className="space-y-8">
                          <div className="flex items-center gap-4">
                              <div className="flex text-[#FF9E9E] text-sm gap-0.5">
                                  {[1,2,3,4,5].map(i => (
                                      <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                  ))}
                              </div>
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>128 Reviews Verificados</span>
                          </div>
                          
                          <div className="space-y-4">
                            <h1 className={`text-4xl md:text-6xl font-semibold font-display tracking-tight leading-[1.1] ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                {product.name}
                            </h1>
                            
                            <div className="flex items-baseline gap-6">
                                <p className={`text-3xl md:text-4xl font-semibold tracking-tight ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                    R$ {product.price.toFixed(2)}
                                </p>
                                {product.oldPrice && (
                                     <p className="text-xl text-gray-400/60 line-through font-medium">R$ {product.oldPrice.toFixed(2)}</p>
                                )}
                            </div>
                          </div>
                          
                          <p className={`font-medium leading-relaxed text-lg max-w-md ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                             {product.description || "O presente perfeito para momentos especiais. Personalize com exclusividade e estilo."}
                          </p>
                      </div>


                      {/* "Stories" Style Features (PACCO Reference) */}
                      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 pt-1">
                        {[
                          { icon: '❄️', label: '24h Frio' },
                          { icon: '🔥', label: '12h Quente' },
                          { icon: '💧', label: 'BPA Free' },
                          { icon: '🛡️', label: 'Inox 304' },
                          { icon: '✨', label: 'Premium' },
                        ].map((story, i) => (
                          <div key={i} className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer">
                            <div className={`w-16 h-16 rounded-md flex items-center justify-center text-2xl shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md ring-[1.5px] ring-transparent ring-offset-2 ${
                              isDark 
                                ? 'bg-white/5 border border-white/10 group-hover:ring-white/20 ring-offset-slate-900' 
                                : 'bg-white border border-zinc-100 group-hover:ring-zinc-200 ring-offset-[#fcfbf9] shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                            }`}>
                              {story.icon}
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${
                              isDark ? 'text-gray-500 group-hover:text-white' : 'text-zinc-500 group-hover:text-zinc-900'
                            }`}>
                              {story.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Customization Card - Glass Style */}
                      <div className={`p-8 rounded-[2.5rem] space-y-8 relative overflow-hidden group border transition-all duration-500 ${
                        isDark ? 'bg-white/5 border-white/10' : 'bg-white/50 border-white/20 shadow-sm'
                      }`}>
                          <div className="absolute top-0 right-0 p-32 bg-brand-pink/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-pink/10 transition-colors duration-700" />
                          
                          <div className="relative z-10 flex items-center justify-between">
                              <div className="flex items-center gap-5">
                                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-pink/20 text-white bg-linear-to-br from-[#FF9E9E] to-[#FF8080]`}>
                                      <span className="material-symbols-outlined text-xl">brush</span>
                                  </div>
                                  <div>
                                      <h3 className={`font-semibold text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>Personalizar</h3>
                                      <p className="text-[10px] text-brand-pink font-bold uppercase tracking-widest">Design Exclusivo</p>
                                  </div>
                              </div>
                              <span className="text-[10px] font-bold text-[#FF9E9E] bg-[#FF9E9E]/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-[#FF9E9E]/20">Incluso</span>
                          </div>
                          
                          <button 
                              onClick={handleCustomize}
                              className="relative z-10 w-full py-4 px-8 bg-linear-to-r from-brand-pink to-brand-cyan text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-brand-pink/20 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between group/btn"
                          >
                              <span>Iniciar Personalização</span>
                              <span className="material-symbols-outlined transition-transform group-hover/btn:translate-x-1">rocket_launch</span>
                          </button>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-5">
                          <div className="flex gap-4">
                              {/* Quantity */}
                              <div className={`flex items-center border rounded-2xl h-16 px-3 transition-all ${
                                isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/20'
                              }`}>
                                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-brand-pink transition-colors"><span className="material-symbols-outlined">remove</span></button>
                                  <span className={`font-semibold w-8 text-center text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>{quantity}</span>
                                  <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-brand-pink transition-colors"><span className="material-symbols-outlined">add</span></button>
                              </div>

                              {/* Add to Cart */}
                              <button 
                                  onClick={handleAddToCart}
                                  className={`flex-1 h-16 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 border-2 ${
                                    isDark 
                                      ? 'border-white/10 text-white hover:bg-white hover:text-brand-black shadow-lg shadow-white/5' 
                                      : 'border-brand-black text-brand-black hover:bg-brand-black hover:text-white shadow-xl shadow-brand-black/5'
                                  }`}
                              >
                                  <span className="material-symbols-outlined">shopping_bag</span>
                                  Adicionar à Sacola
                              </button>
                          </div>

                          <button 
                              onClick={handleBuyNow}
                              className={`w-full h-16 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm tracking-widest transition-all shadow-xl active:scale-[0.98] hover:scale-[1.01] ${
                                isDark ? 'bg-white text-brand-black' : 'bg-brand-black text-white'
                              }`}
                          >
                              <span className="material-symbols-outlined">bolt</span>
                              Comprar Agora
                          </button>
                      </div>

                      {/* Trust Badges - Clean */}
                      <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/10">
                           <div className="flex flex-col items-center text-center gap-3">
                               <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-brand-pink/5'}`}>
                                  <span className="material-symbols-outlined text-brand-pink/60">local_shipping</span>
                               </div>
                               <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Frete Grátis</span>
                           </div>
                           <div className="flex flex-col items-center text-center gap-3">
                               <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-brand-pink/5'}`}>
                                  <span className="material-symbols-outlined text-brand-pink/60">verified_user</span>
                               </div>
                               <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Garantia Prata</span>
                           </div>
                           <div className="flex flex-col items-center text-center gap-3">
                               <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-brand-pink/5'}`}>
                                  <span className="material-symbols-outlined text-brand-pink/60">cached</span>
                               </div>
                               <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Troca Fácil</span>
                           </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Reviews Section - Modern Glass Cards */}
          <section className="mt-32 max-w-7xl mx-auto px-4">
               <div className="text-center mb-20">
                  <span className="text-brand-pink font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block">Depoimentos</span>
                  <h2 className={`text-4xl md:text-5xl font-semibold font-display ${isDark ? 'text-white' : 'text-gray-800'}`}>Quem usa Mimuus</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                      <div key={i} className={`p-10 rounded-[2.5rem] backdrop-blur-xl border transition-all duration-500 hover:-translate-y-2 group ${
                        isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 shadow-2xl shadow-black/20' : 'bg-white/60 border-white/50 shadow-xl shadow-gray-200/50'
                      }`}>
                          <div className="flex justify-between items-start mb-8">
                              <div className="flex text-[#FF9E9E]/80 text-sm gap-1">
                                   {[1,2,3,4,5].map(star => <span key={star} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                              </div>
                              <span className="text-[10px] font-bold text-gray-400/50 uppercase tracking-widest">Vendedor Verificado</span>
                          </div>
                          <p className={`font-medium leading-relaxed italic mb-10 text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            &quot;A garrafa é ainda mais linda pessoalmente! O acabamento é perfeito e mantém a água gelada o dia todo.&quot;
                          </p>
                          <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-brand-pink/20 to-brand-cyan/20 flex items-center justify-center font-bold text-brand-pink text-xs backdrop-blur-md border border-white/10">
                                CM
                              </div>
                              <div>
                                  <p className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-brand-black'}`}>Cliente Mimuus</p>
                                  <p className="text-[10px] text-gray-400 font-medium">São Paulo, SP</p>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </section>

          {/* Zoom Modal */}
          <AnimatePresence>
              {showZoom && (
                  <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-100 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
                      onClick={() => setShowZoom(false)}
                  >
                      <button
                          className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                          onClick={() => setShowZoom(false)}
                      >
                          <span className="material-symbols-outlined text-4xl">close</span>
                      </button>

                      <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.95, opacity: 0 }}
                          className="relative w-full h-full flex items-center justify-center"
                      >
                          <Image 
                              src={activeImage || "/placeholder.jpg"} 
                              alt="Zoomed product"
                              fill
                              loader={imageKitLoader}
                              className="object-contain p-4 md:p-8"
                          />
                      </motion.div>
                  </motion.div>
              )}
          </AnimatePresence>
      </main>

      {/* Mobile Sticky Buy Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-white/20 flex gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] pb-safe-bottom">
          <button 
              onClick={handleAddToCart}
              className="flex-1 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-brand-black/10 dark:border-white/10 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest text-brand-black dark:text-white"
          >
              <span className="material-symbols-outlined text-lg">shopping_bag</span>
              Add
          </button>
          <button 
              onClick={handleBuyNow}
              className="flex-[2] h-14 rounded-2xl bg-brand-black text-white flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest shadow-lg shadow-brand-black/20"
          >
              <span className="material-symbols-outlined text-lg">bolt</span>
              Comprar Agora
          </button>
      </div>
    </div>
  );
}
