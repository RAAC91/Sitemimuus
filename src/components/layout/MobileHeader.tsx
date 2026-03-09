"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Search, User as UserIcon, LogOut, ShoppingBag, Palette, Instagram, Send } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const SOCIAL_LINKS = [
  {
    href: "https://www.instagram.com/mimuus_",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://t.me/mimuus",
    label: "Telegram",
    icon: Send,
  },
];

export default function MobileHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { user, loading } = useAuth();
  const { itemCount, openCart } = useCartStore();
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = searchQuery.trim();
      if (!q) return;
      router.push(`/produtos?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setSearchQuery("");
    },
    [searchQuery, router]
  );

  const isDark = mounted && resolvedTheme === "dark";

  const navItems = [
    { name: "INÍCIO", path: "/" },
    { name: "PRODUTOS", path: "/produtos" },
    { name: "PERSONALIZE", path: "/editor" },
    { name: "SOBRE", path: "/sobre" },
  ];

  if (user?.email && ["renan@mimuus.com", "admin@mimuus.com"].includes(user.email)) {
    navItems.push({ name: "ADMIN \uD83D\uDC51", path: "/x7z-4dm1n-P4n3l" });
  }

  const headerClass = scrolled
    ? isDark
      ? "bg-slate-950/90 backdrop-blur-md border-b border-white/10 shadow-lg"
      : "bg-white/90 backdrop-blur-md border-b border-black/5 shadow-md"
    : isDark
    ? "bg-slate-950/60 backdrop-blur-sm border-b border-white/5"
    : "bg-white/60 backdrop-blur-sm border-b border-black/5 shadow-sm";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 lg:hidden ${headerClass}`}
      >
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className={`p-1 -ml-1 hover:text-brand-pink transition-colors active:scale-95 ${isDark ? "text-white" : "text-slate-900"}`}
              onClick={() => setMobileSidebar(true)}
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="text-xl font-black tracking-tight shrink-0">
              mi<span className="text-brand-pink">mu</span>us<span className="text-brand-cyan">.</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              className={`hover:text-brand-pink transition-colors active:scale-95 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Abrir busca"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={openCart}
              className={`relative hover:text-brand-pink transition-colors active:scale-95 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
              aria-label="Carrinho"
            >
              <ShoppingCart className="w-5 h-5" />
              {mounted && itemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-pink text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white/10 animate-bounce">
                  {itemCount()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expandable */}
        <AnimatePresence>
          {searchOpen && (
            <motion.form
              onSubmit={handleSearch}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`overflow-hidden border-t ${isDark ? "border-white/10 bg-slate-900" : "border-black/5 bg-slate-50"}`}
            >
              <div className="px-4 py-3 flex items-center gap-3">
                <Search className={`w-4 h-4 shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar..."
                  className={`flex-1 bg-transparent border-none outline-none text-sm ${
                    isDark ? "text-white placeholder:text-gray-500" : "text-slate-900 placeholder:text-gray-500"
                  }`}
                />
                <button type="button" onClick={() => { setSearchQuery(""); setSearchOpen(false); }} className="p-1">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {mobileSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebar(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[80] lg:hidden overscroll-contain"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileSidebar && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed inset-y-0 left-0 w-[80vw] max-w-[320px] z-[90] flex flex-col shadow-2xl lg:hidden ${
              isDark ? "bg-slate-950 text-white" : "bg-white text-slate-900"
            }`}
            style={{ WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}
          >
            {/* Sidebar Header */}
            <div className={`px-6 h-16 flex items-center justify-between border-b ${isDark ? 'border-white/10' : 'border-black/5'}`}>
              <span className="font-bold tracking-widest text-xs opacity-50 uppercase">Menu</span>
              <button
                onClick={() => setMobileSidebar(false)}
                className="p-2 -mr-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Area */}
            <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-black/5'}`}>
              {loading ? (
                <div className="w-6 h-6 rounded-full border-2 border-brand-pink border-t-transparent animate-spin" />
              ) : user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    {user.user_metadata?.avatar_url ? (
                      <div className="relative w-10 h-10 shrink-0">
                        <Image src={user.user_metadata.avatar_url} alt="User" fill className="rounded-full object-cover" />
                      </div>
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDark ? "bg-white/10" : "bg-black/5"}`}>
                        <UserIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">Olá,</p>
                      <p className="text-xs opacity-60 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Link href="/conta" onClick={() => setMobileSidebar(false)} className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'}`}>
                      <UserIcon className="w-3.5 h-3.5" />
                      Perfil
                    </Link>
                    <Link href="/conta/pedidos" onClick={() => setMobileSidebar(false)} className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'}`}>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Pedidos
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
                    <UserIcon className="w-6 h-6 opacity-50" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Bem-vindo!</h3>
                    <p className="text-xs opacity-60">Acesse sua conta para ver seus pedidos e designs salvos.</p>
                  </div>
                  <Link
                    href="/login"
                    onClick={() => setMobileSidebar(false)}
                    className="w-full py-3 bg-brand-pink text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-brand-pink/20"
                  >
                    Entrar / Cadastrar
                  </Link>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 overscroll-contain">
              {navItems.map((item) => {
                const isActive = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
                const isPersonalize = item.name === "PERSONALIZE";
                
                if (isPersonalize) {
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMobileSidebar(false)}
                      className={`flex items-center gap-3 p-4 rounded-xl mb-4 transition-all ${
                        isDark 
                          ? 'bg-gradient-to-br from-brand-pink/20 to-transparent border border-brand-pink/20' 
                          : 'bg-gradient-to-br from-brand-pink/10 to-transparent border border-brand-pink/20'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-brand-pink text-white flex items-center justify-center shrink-0">
                        <Palette className="w-4 h-4" />
                      </div>
                      <span className="font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-[#ff7eb3]">
                        {item.name}
                      </span>
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileSidebar(false)}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? isDark ? 'bg-white/10 font-bold' : 'bg-slate-100 font-bold' 
                        : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Footer / Settings */}
            <div className={`p-6 border-t ${isDark ? 'border-white/10' : 'border-black/5'} space-y-6`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase opacity-50 tracking-widest">Tema</span>
                <ThemeToggle />
              </div>

              {user && (
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setMobileSidebar(false);
                    router.push("/");
                    router.refresh();
                  }}
                  className="flex items-center w-full gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-3 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-semibold text-sm">Sair da conta</span>
                </button>
              )}

              <div className="flex justify-center gap-6 pt-2">
                {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`p-2 rounded-full transition-colors hover:text-brand-pink ${
                      isDark ? "bg-white/5" : "bg-black/5"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
