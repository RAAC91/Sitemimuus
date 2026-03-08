"use client";

import { useAuth } from "@/providers/AuthProvider";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Home, 
  User, 
  ShoppingBag, 
  Droplets, 
  Crown,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export default function CustomerNav() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const isAdmin = user?.email?.toLowerCase().trim() === 'rueliton.andrade@gmail.com';

  const navItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/garrafas-personalizadas", label: "Criar Garrafa", icon: Droplets },
    { href: "/produtos", label: "Produtos", icon: ShoppingBag },
    { href: "/conta", label: "Minha Conta", icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1115]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-linear-to-br from-brand-cyan to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-brand-cyan/20 group-hover:shadow-brand-cyan/40 transition">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-heading font-extrabold text-white hidden sm:block">
              Mimuus
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    isActive
                      ? "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                href="/x7z-4dm1n-P4n3l"
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 transition-all ml-2"
              >
                <Crown className="w-4 h-4" />
                <span className="text-sm">Admin</span>
              </Link>
            )}

            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all ml-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sair</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0f1115] border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
                    isActive
                      ? "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                href="/x7z-4dm1n-P4n3l"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20"
              >
                <Crown className="w-5 h-5" />
                <span>Admin</span>
              </Link>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair da Conta</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
