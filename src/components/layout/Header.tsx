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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ADMIN_EMAILS } from "@/lib/constants";

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

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
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

  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);
  const isDark = mounted && resolvedTheme === "dark";

  const navItems = [
    { name: "INÍCIO", path: "/" },
    { name: "PRODUTOS", path: "/produtos" },
    { name: "PERSONALIZE", path: "/editor" },
    { name: "SOBRE", path: "/sobre" },
  ];

  if (isAdmin) {
    navItems.push({ name: "ADMIN 👑", path: "/x7z-4dm1n-P4n3l" });
  }

  const headerClass = scrolled
    ? isDark
      ? "bg-slate-950/80 backdrop-blur-md border border-white/10 shadow-2xl shadow-black/20"
      : "bg-white/80 backdrop-blur-md border border-black/5 shadow-xl shadow-black/5"
    : isDark
    ? "bg-slate-950/40 backdrop-blur-sm border border-white/5"
    : "bg-white/40 backdrop-blur-sm border border-black/5 shadow-sm";

  return (
    <header
      className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 mx-auto max-w-7xl rounded-2xl md:rounded-full ${headerClass}`}
    >
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="text-2xl font-black tracking-tight shrink-0 z-50 hover:scale-105 transition-transform">
            mi<span className="text-brand-pink">mu</span>us<span className="text-brand-cyan">.</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
              const isPersonalize = item.name === "PERSONALIZE";
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={
                    isPersonalize
                      ? "relative overflow-hidden px-4 py-1.5 rounded-full font-black text-white text-xs tracking-widest uppercase transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 bg-gradient-to-r from-brand-pink to-[#ff7eb3] shadow-lg shadow-brand-pink/30 hover:shadow-xl hover:shadow-brand-pink/50 animate-[pulse_3s_ease-in-out_infinite]"
                      : `text-sm font-bold tracking-wide transition-colors uppercase relative group ${
                          isActive
                            ? "text-brand-pink"
                            : isDark
                            ? "text-white hover:text-brand-pink"
                            : "text-slate-900 hover:text-brand-pink"
                        }`
                  }
                >
                  {isPersonalize && <span className="text-sm border-r border-white/20 pr-2 py-0.5">🎨</span>}
                  {item.name}
                  {!isPersonalize && (
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-brand-pink transition-all ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4 md:space-x-5">
            {/* Desktop Search Bar */}
            <form onSubmit={handleSearch} className={`hidden md:flex items-center rounded-full px-3 py-1.5 border transition-all duration-300 group ${
              isDark
                ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                : "bg-white/50 border-black/5 hover:bg-white hover:border-black/10 hover:shadow-sm"
            }`}>
              <Search className={`w-4 h-4 mr-2 shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setSearchQuery("")}
                placeholder="Pesquisar..."
                className={`bg-transparent border-none outline-none text-sm w-32 transition-all group-focus-within:w-48 ${
                  isDark ? "text-white placeholder:text-gray-500" : "text-slate-900 placeholder:text-gray-500"
                }`}
              />
            </form>

            {/* Mobile Search Toggle */}
            <button
              className={`md:hidden hover:text-brand-pink transition-colors hover:scale-110 active:scale-95 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Abrir busca"
              title="Abrir busca"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Auth */}
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-brand-pink border-t-transparent animate-spin" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <div className="hover:ring-2 hover:ring-brand-pink rounded-full transition-all duration-300 cursor-pointer p-0.5">
                    {user.user_metadata?.avatar_url ? (
                      <div className="relative w-8 h-8">
                        <Image src={user.user_metadata.avatar_url} alt="User" fill className="rounded-full object-cover" />
                      </div>
                    ) : (
                      <div className={`p-1.5 rounded-full ${isDark ? "bg-white/10 text-white" : "bg-black/5 text-slate-900"}`}>
                        <UserIcon className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white/90 backdrop-blur-xl border-white/20 shadow-xl rounded-2xl p-2 z-100">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-slate-900">Minha Conta</p>
                      <p className="text-xs leading-none text-slate-500 truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  {isAdmin && (
                    <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-brand-pink/10 focus:text-brand-pink" asChild>
                      <Link href="/x7z-4dm1n-P4n3l" className="flex items-center w-full font-bold text-brand-pink">
                        <span>👑 Painel Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-brand-pink/10 focus:text-brand-pink" asChild>
                    <Link href="/conta" className="flex items-center w-full">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-brand-pink/10 focus:text-brand-pink" asChild>
                    <Link href="/conta/pedidos" className="flex items-center w-full">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span>Meus Pedidos</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-brand-pink/10 focus:text-brand-pink" asChild>
                    <Link href="/editor" className="flex items-center w-full">
                      <Palette className="mr-2 h-4 w-4" />
                      <span>Criar Design</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <DropdownMenuItem
                    className="cursor-pointer rounded-lg text-red-500 focus:bg-red-50 focus:text-red-600"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      router.push("/");
                      router.refresh();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 group ${
                  scrolled
                    ? isDark
                      ? "bg-white/10 hover:bg-white/20 text-white"
                      : "bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-brand-pink/20"
                    : isDark
                    ? "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                    : "bg-white hover:bg-slate-50 text-slate-900 shadow-xl shadow-black/5"
                }`}
              >
                <div className={`p-1 rounded-full ${scrolled && !isDark ? "bg-white/10" : "bg-white/20"} group-hover:bg-brand-pink group-hover:text-white transition-colors`}>
                  <UserIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold tracking-wider uppercase pr-1">Entrar</span>
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={openCart}
              className={`relative group hover:text-brand-pink transition-colors hover:scale-110 active:scale-95 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
              aria-label="Carrinho"
              title="Carrinho"
            >
              <ShoppingCart className="w-5 h-5" />
              {mounted && itemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-pink text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white/10 animate-bounce">
                  {itemCount()}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <div className="border-l pl-4 border-gray-200 dark:border-white/10">
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden hover:text-brand-pink transition-colors ${isDark ? "text-white" : "text-slate-900"}`}
              onClick={() => setMobileMenu(true)}
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (drops below header) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`overflow-hidden md:hidden border-t ${isDark ? "border-white/10" : "border-black/5"}`}
          >
            <div className="px-6 py-3 flex items-center gap-3">
              <Search className={`w-4 h-4 shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar produtos..."
                className={`flex-1 bg-transparent border-none outline-none text-sm ${
                  isDark ? "text-white placeholder:text-gray-500" : "text-slate-900 placeholder:text-gray-500"
                }`}
                autoFocus
              />
              {searchQuery && (
                <button type="button" onClick={() => { setSearchQuery(""); setSearchOpen(false); }}>
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed inset-0 z-100 p-8 flex flex-col ${isDark ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}
          >
            <div className="flex justify-between items-center mb-16">
              <span className="text-3xl font-black tracking-tight">
                mi<span className="text-brand-pink">mu</span>us<span className="text-brand-cyan">.</span>
              </span>
              <button
                onClick={() => setMobileMenu(false)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <nav className="flex flex-col space-y-6">
              {navItems.map((item, i) => {
                const isActive = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
                const isPersonalize = item.name === "PERSONALIZE";
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileMenu(false)}
                    className={
                      isPersonalize
                        ? "text-3xl font-black tracking-tight transition-all text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-[#ff7eb3] flex items-center gap-3 w-fit animate-[pulse_3s_ease-in-out_infinite]"
                        : `text-4xl font-black tracking-tight transition-colors ${
                            isActive ? "text-brand-pink" : "hover:text-brand-pink"
                          }`
                    }
                  >
                    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3">
                      {isPersonalize && <span className="text-2xl grayscale filter drop-shadow-sm">🎨</span>}
                      {item.name}
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-8 border-t border-black/10 dark:border-white/10">
              <p className="text-sm font-medium opacity-50 uppercase tracking-widest mb-4">Siga-nos</p>
              <div className="flex gap-4">
                {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-brand-pink hover:text-white ${
                      isDark ? "bg-white/10 text-white" : "bg-black/5 text-slate-900"
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
    </header>
  );
}
