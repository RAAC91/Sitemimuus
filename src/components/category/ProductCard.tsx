import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Palette, ShoppingCart, Star, ChevronLeft, ChevronRight, Share2 } from "lucide-react"

import { useCartStore } from "@/store/cartStore"
import { useProductDisplay } from "@/contexts/ProductDisplayContext"

import { Product } from "@/types";
import Image from "next/image";
import imageKitLoader from "@/lib/imagekit-loader";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { config } = useProductDisplay();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const galleryImages = product.images || (product.image ? [product.image] : []);
  const hasMultipleImages = galleryImages.length > 1;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: crypto.randomUUID(),
      productId: product.id.toString(), // Use id as productId
      name: product.name,
      price: product.price,
      quantity: 1,
      thumbnail: product.image || '',
    } as any); // temporary bypass for store item type

    toast.success(`${product.name} adicionado!`, {
        style: { background: 'var(--color-brand-black)', color: 'white', border: 'none' },
        duration: 2000,
    });
  };

  const handleCustomize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productId = product.id;
    router.push(`/editor?productId=${productId}`);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Fallback URL if we are running locally without full paths
    const url = `${window.location.origin}/produtos/${product.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `mimuus. | ${product.name}`,
          text: `Confira ${product.name} na mimuus. - sua garrafa de luxo.`,
          url: url,
        });
      } catch (err) {
        // user cancelled or share failed, fallback to copy
        console.log('Share error:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copiado para a área de transferência!", {
        style: { background: 'var(--color-brand-black)', color: 'white', border: 'none' },
      });
    }
  };

  return (
    <Link href={`/produtos/${product.id}`} className="block h-full"> 
    <motion.article
      whileHover={{ y: -8 }}
      className="relative group p-3 md:p-4 transition-all duration-500 cursor-pointer overflow-visible h-full rounded-[1.5rem] md:rounded-[2rem] bg-white/40 backdrop-blur-md border border-white/50 hover:shadow-xl hover:shadow-brand-pink/5"
    >
      {/* Image Container with Soft Pastel Background */}
      <div className="mb-4 relative aspect-[4/5] flex items-center justify-center p-6 rounded-[2rem] bg-white/50 group-hover:bg-white/80 transition-colors duration-500 overflow-hidden border border-white/60">
        
        {/* Gallery Progress Indicators */}
        {hasMultipleImages && (
          <div className="absolute top-4 inset-x-6 h-1 flex gap-1 z-20">
            {galleryImages.map((_, idx) => (
              <div 
                key={idx}
                className={`h-full flex-1 rounded-full bg-gray-200 overflow-hidden transition-all duration-300`}
              >
                <div 
                  className={`h-full bg-brand-black/20 transition-all duration-300 ${idx === currentImageIndex ? 'w-full' : 'w-0'}`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Gallery Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-md hover:bg-white/60 text-brand-black opacity-0 group-hover:opacity-100 transition-all duration-300 z-30"
              title="Imagem anterior"
            >
              <ChevronLeft className="w-5 h-5 ml-[-1px]" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-md hover:bg-white/60 text-brand-black opacity-0 group-hover:opacity-100 transition-all duration-300 z-30"
              title="Próxima imagem"
            >
              <ChevronRight className="w-5 h-5 mr-[-1px]" />
            </button>
          </>
        )}

        {/* Badges - Minimalist Pastel */}
        {product.badge && (
          <span
            className="absolute top-6 left-6 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-full z-20 bg-white/90 backdrop-blur-md text-brand-black shadow-sm border border-gray-100"
          >
            {product.badge}
          </span>
        )}

        {/* Product Image */}
        <div className="relative w-full h-full flex items-center justify-center">
            {galleryImages.length > 0 ? (
              <Image
                src={galleryImages[currentImageIndex]}
                alt={product.name}
                fill
                loader={imageKitLoader}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain p-2 transition-all duration-700 ease-out scale-[1.05] pastel-image-filter z-10"
                style={{
                  transform: `scale(${config.zoom}) translateX(${config.xPosition}%) translateY(${config.yPosition}%) rotate(${config.rotation}deg)`,
                }}
              />
            ) : (
               <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300 text-xs text-center border-4 border-dashed border-gray-100 rounded-[2rem]">
                  <p className="px-4 font-bold uppercase tracking-widest opacity-50">Sem Imagem</p>
               </div>
            )}
            
            {/* Soft Shadow */}
            <div className="absolute bottom-2 w-2/3 h-4 bg-black/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>

        {/* Quick Actions - Floating pills */}
        <div className="absolute bottom-4 inset-x-4 translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500 z-30 flex gap-2">
             <button 
                onClick={handleShare}
                className="w-10 py-3 bg-white text-brand-black rounded-full hover:bg-gray-50 transition-all shadow-md hover:shadow-lg border border-gray-100 flex items-center justify-center"
                title="Compartilhar Garrafa"
             >
                <Share2 className="w-3.5 h-3.5" />
             </button>
             <button 
                onClick={handleCustomize}
                className="flex-1 py-3 bg-white text-brand-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-gray-50 transition-all shadow-md hover:shadow-lg border border-gray-100 flex items-center justify-center gap-2"
             >
                <Palette className="w-3.5 h-3.5" />
                Personalizar
             </button>
             <button 
                onClick={handleAddToCart}
                className="w-10 py-3 bg-brand-black text-white rounded-full hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                title="Adicionar ao Carrinho"
             >
                <ShoppingCart className="w-3.5 h-3.5" />
             </button>
        </div>
      </div>

      <div className="space-y-1.5 px-2 text-center transition-all duration-500">
        <div>
            <h3 className="text-base font-bold text-brand-black tracking-tight group-hover:text-brand-pink transition-colors line-clamp-1">
                {product.name}
            </h3>
            {product.tagline && (
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-0.5 truncate">
                {product.tagline}
                </p>
            )}
        </div>

        {/* Review Stars */}
        <div className="flex items-center justify-center gap-1 py-1">
            <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill={i < 5 ? "currentColor" : "none"} className={i < 5 ? "text-yellow-400" : "text-gray-200"} />
                ))}
            </div>
            <span className="text-[10px] font-semibold text-gray-400">({0})</span>
        </div>

        <div className="pt-1 flex items-center justify-center gap-2 transition-all">
            <span className="text-lg font-bold text-brand-black">R$ {product.price.toFixed(2)}</span>
             {product.oldPrice && (
            <span className="text-xs font-medium text-gray-300 line-through decoration-1">
                R$ {product.oldPrice.toFixed(2)}
            </span>
            )}
        </div>
      </div>
    </motion.article>
    </Link>
  );
}

