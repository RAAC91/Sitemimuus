"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BackgroundEffects } from "@/components/ui/background-effects";
// import Header from "@/components/layout/Header";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (error) throw error;
      
      toast.success("Conta criada! Verifique seu email.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;
  const isDark = resolvedTheme === 'dark';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 antialiased transition-colors duration-500 relative overflow-hidden`}>
      {/* Header removed - provided by layout */}
      <BackgroundEffects />
      
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <main className="w-full max-w-5xl transition-transform hover:scale-[1.01] hover:-translate-y-1 duration-300 ease-out z-10">
        <div className={`rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex flex-col md:flex-row-reverse min-h-[640px] backdrop-blur-2xl ${
          isDark
            ? 'bg-[#0f172a]/60 border border-white/10'
            : 'bg-white/40 border border-white/50'
        }`}>
          {/* Right Side (Register Form) - Inverted order for visual interest */}
          <div className="flex-1 p-8 md:p-14 flex flex-col justify-center">
            <div className="mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF9E9E] to-[#FF8080] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF9E9E]/30 mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h1 className={`text-3xl md:text-4xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Crie sua conta
              </h1>
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                Junte-se a milhares de criadores e personalize sua rotina.
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Nome Completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-3.5 rounded-lg outline-none transition-all ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white focus:bg-white/10 focus:border-[#FF9E9E]/50' 
                      : 'bg-white/50 border-gray-200 text-gray-900 focus:bg-white/80 focus:border-[#FF9E9E]'
                  } border focus:ring-4 focus:ring-[#FF9E9E]/10 placeholder:text-gray-500`}
                  placeholder="Seu Nome"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3.5 rounded-lg outline-none transition-all ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white focus:bg-white/10 focus:border-[#FF9E9E]/50' 
                      : 'bg-white/50 border-gray-200 text-gray-900 focus:bg-white/80 focus:border-[#FF9E9E]'
                  } border focus:ring-4 focus:ring-[#FF9E9E]/10 placeholder:text-gray-500`}
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Senha</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3.5 rounded-lg outline-none transition-all ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white focus:bg-white/10 focus:border-[#FF9E9E]/50' 
                      : 'bg-white/50 border-gray-200 text-gray-900 focus:bg-white/80 focus:border-[#FF9E9E]'
                  } border focus:ring-4 focus:ring-[#FF9E9E]/10 placeholder:text-gray-500`}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl shadow-[#FF9E9E]/20 hover:shadow-[#FF9E9E]/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                } bg-gradient-to-r from-[#FF9E9E] to-[#FF8080]`}
              >
                {loading ? (
                   <div className="flex items-center justify-center gap-2">
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     <span>Criando...</span>
                   </div>
                ) : (
                  "Começar Agora"
                )}
              </button>
            </form>
            
            <p className={`mt-8 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Já tem uma conta?{" "}
              <a href="/login" className="text-[#FF9E9E] font-bold hover:underline">
                Fazer Login
              </a>
            </p>
          </div>

          {/* Left Side (Hero Image) */}
          <div className={`flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden backdrop-blur-md ${
            isDark ? 'bg-gray-900/40' : 'bg-white/20'
          }`}>
             {/* Background Orbs */}
            <div className={`absolute -top-24 -left-24 w-64 h-64 blur-3xl rounded-full ${
              isDark ? 'bg-indigo-500/10' : 'bg-[#ddd6fe]/40'
            }`} />
            <div className={`absolute -bottom-24 -right-24 w-64 h-64 blur-3xl rounded-full ${
              isDark ? 'bg-teal-500/10' : 'bg-[#dcfce7]/40'
            }`} />

            <div className="relative z-10 text-center max-w-sm">
              <div className="mb-12 relative inline-block">
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse" />
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6-kA_EdQ4ho12OqQnyWvdYh7yXItuWoCzIleV19RCKq9o2wCYvcgqOjZTPlStLeCeYgD2TFLuh223Tic_lzsw3HSezyYRK7JJBiO3_0y34QgjIthTj_XTunkL9b_j1Sx8PHfqmsj8uYC_8nDKH5WPKQh2_FF1tEadNrmmawS3rl6OHf8mLOJ8yus2b03-WolLU-OKx7Vj18LB5k61NuZ_qlEId8adPL92lFQOcCWCWJSNs4pa4iMjr8x5wHcjDiMTvyugUwIhpriC"
                  alt="Garrafa Personalizada"
                  className="w-64 h-80 object-cover rounded-3xl shadow-2xl relative z-10 transform -rotate-3 hover:rotate-0 transition-transform duration-500 scale-x-[-1]" 
                />
              </div>

              <h2 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Sua Marca Pessoal
              </h2>
              <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Qualidade premium, design exclusivo e sustentabilidade em cada gole. Personalize agora.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
