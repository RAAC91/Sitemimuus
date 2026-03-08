"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  ShoppingBag, 
  Palette, 
  ShoppingCart, 
  User as UserIcon 
} from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";

const NAV_ITEMS = [
  { name: "Início", path: "/", icon: Home },
  { name: "Produtos", path: "/produtos", icon: ShoppingBag },
  { name: "Criar", path: "/editor", icon: Palette, primary: true },
  { name: "Carrinho", path: "#cart", icon: ShoppingCart, isCart: true },
  { name: "Perfil", path: "/conta", icon: UserIcon },
];

export function MobileNavbar() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCartStore();

  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 z-100 pb-safe">
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.5 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[2.5rem] p-2 shadow-2xl shadow-black/10 flex items-center justify-between"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
          const Icon = item.icon;
          
          if (item.primary) {
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className="relative -top-6 group"
              >
                <div className="bg-linear-to-br from-brand-pink to-rose-400 p-4 rounded-full shadow-lg shadow-brand-pink/40 ring-4 ring-white dark:ring-slate-950 transition-transform group-hover:scale-110 active:scale-95 group-active:-translate-y-1">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-brand-pink uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.name}
                </span>
              </Link>
            );
          }

          const handleClick = (e: React.MouseEvent) => {
            if (item.isCart) {
              e.preventDefault();
              openCart();
            }
          };

          return (
            <Link 
              key={item.name} 
              href={item.path}
              onClick={handleClick}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-full transition-all duration-300 relative ${
                isActive ? "text-brand-pink" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : ""}`} />
                {item.isCart && itemCount() > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-pink text-white text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse">
                    {itemCount()}
                  </span>
                )}
              </div>
              <span className={`text-[9px] font-bold mt-1 uppercase tracking-tighter transition-all ${
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
              }`}>
                {item.name}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-brand-pink/5 rounded-full -z-10"
                />
              )}
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
