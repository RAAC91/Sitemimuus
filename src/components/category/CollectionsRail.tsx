"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Using real product images as placeholders for categories
const collections = [
  { id: 1, name: "Animes", image: "/products/pink-punk.png", color: "#FFF0F5" },
  { id: 2, name: "Religiosas", image: "/products/cyan-pop.png", color: "#F0F9FF" },
  { id: 3, name: "Florais", image: "/products/yellow.png", color: "#FFFBEB" },
  { id: 4, name: "Nomes", image: "/products/pink-punk.png", color: "#FAF5FF" },
  { id: 5, name: "Signos", image: "/products/cyan-pop.png", color: "#F7FEE7" },
  { id: 6, name: "Minimalista", image: "/products/yellow.png", color: "#F9FAFB" },
];

export function CollectionsRail() {
  return (
    <section className="py-12 w-full flex flex-col items-center">
      <div className="flex items-center gap-2 mb-8 opacity-60 hover:opacity-100 transition-opacity cursor-pointer group">
        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-brand-black">
          Navegar por Coleção
        </h3>
        <ArrowRight className="w-3 h-3 -translate-x-1 group-hover:translate-x-0 transition-transform" />
      </div>
      
      <div className="w-full overflow-hidden">
        <div className="flex justify-center gap-6 px-6 overflow-x-auto pb-8 scrollbar-hide min-w-full">
          {collections.map((collection) => (
            <motion.div
              key={collection.id}
              whileHover={{ y: -8 }}
              className="group relative cursor-pointer"
            >
              {/* Card Container */}
              <div 
                className="w-[160px] h-[200px] rounded-[2rem] relative overflow-hidden transition-all duration-500 shadow-sm group-hover:shadow-glow"
                style={{ backgroundColor: collection.color }}
              >
                  {/* Background Decoration */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Image */}
                  <img 
                    src={collection.image} 
                    alt={collection.name}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-auto object-contain transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3"
                  />

                  {/* Hover Reveal OVerlay */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                     <span className="text-white text-xs font-bold tracking-wider uppercase opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
                       Ver Tudo
                     </span>
                  </div>
              </div>
              
              {/* Label outside */}
              <p className="mt-4 text-center text-sm font-semibold text-brand-black group-hover:text-brand-pink transition-colors">
                {collection.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
