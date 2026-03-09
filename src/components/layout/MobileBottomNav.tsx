"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Package, Palette, User, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/providers/AuthProvider";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { label: "Início", icon: Home, path: "/" },
  { label: "Produtos", icon: Package, path: "/produtos" },
  { label: "Personalizar", icon: Palette, path: "/editor", highlight: true },
  { label: "Conta", icon: User, path: "/conta" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, openCart } = useCartStore();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Hide on editor pages (they have their own mobile UI)
  if (pathname?.includes("/editor")) return null;

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname?.startsWith(path);

  const handleAccountClick = () => {
    router.push(user ? "/conta" : "/login");
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="bg-white/95 dark:bg-slate-900/98 backdrop-blur-2xl border-t border-slate-100 dark:border-slate-800 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around px-2">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                title={item.label}
                className={`relative flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-w-[56px] transition-colors ${
                  item.highlight
                    ? "text-brand-pink"
                    : active
                    ? "text-brand-pink"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {item.highlight ? (
                  <div className="w-12 h-12 -mt-5 mb-0.5 rounded-2xl bg-gradient-to-br from-brand-pink to-[#ff7eb3] flex items-center justify-center shadow-lg shadow-brand-pink/40">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="relative">
                    <item.icon className="w-5 h-5" />
                    {active && (
                      <motion.div
                        layoutId="mobile-nav-indicator"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-pink"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </div>
                )}
                <span className="text-[9px] font-bold uppercase tracking-wide">
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Cart button */}
          <button
            onClick={openCart}
            title="Carrinho"
            className="relative flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-w-[56px] text-slate-400 dark:text-slate-500 transition-colors"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              <AnimatePresence>
                {mounted && itemCount() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-brand-pink text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full"
                  >
                    {itemCount()}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wide">Sacola</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
