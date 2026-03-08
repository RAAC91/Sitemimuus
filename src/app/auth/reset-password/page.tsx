"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Senha redefinida com sucesso! Redirecionando...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      console.error("Password reset error:", err);
      toast.error("Erro ao redefinir senha. O link pode ter expirado.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;
  const isDark = resolvedTheme === "dark";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        className={`w-full max-w-md p-8 rounded-3xl shadow-2xl backdrop-blur-2xl ${
          isDark ? "bg-slate-900/80 border border-white/10 text-white" : "bg-white/80 border border-black/5 text-slate-900"
        }`}
      >
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block hover:scale-105 transition-transform">
            <h1 className="text-3xl font-black mb-2">
              mi<span className="text-brand-pink">mu</span>us<span className="text-brand-cyan">.</span>
            </h1>
          </Link>
          <h2 className="text-xl font-bold mt-6 mb-1">Nova Senha</h2>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Escolha uma senha forte para sua conta.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Nova Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className={`w-full px-4 py-3 rounded-lg outline-none transition-all ${
                isDark
                  ? "bg-white/5 border border-white/10 text-white focus:border-brand-pink/50 focus:ring-2 focus:ring-brand-pink/20"
                  : "bg-gray-50 border border-gray-200 text-gray-900 focus:border-brand-pink/50 focus:ring-2 focus:ring-brand-pink/20"
              }`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Confirmar Senha
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
              className={`w-full px-4 py-3 rounded-lg outline-none transition-all ${
                isDark
                  ? "bg-white/5 border border-white/10 text-white focus:border-brand-pink/50 focus:ring-2 focus:ring-brand-pink/20"
                  : "bg-gray-50 border border-gray-200 text-gray-900 focus:border-brand-pink/50 focus:ring-2 focus:ring-brand-pink/20"
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg font-bold text-white bg-linear-to-r from-brand-pink to-brand-cyan hover:opacity-90 transition-all shadow-lg shadow-brand-pink/20 active:scale-[0.98] disabled:opacity-60 mt-2"
          >
            {loading ? "Salvando..." : "Redefinir Senha"}
          </button>
        </form>
      </div>
    </div>
  );
}
