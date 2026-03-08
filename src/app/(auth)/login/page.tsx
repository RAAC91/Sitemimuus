"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BackgroundEffects } from "@/components/ui/background-effects";
import { toast } from "sonner";
import { ADMIN_EMAILS } from "@/lib/constants";

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    if (error) {
      const messages: Record<string, string> = {
        auth_exchange_failed: "Falha na autenticação com Google. Tente novamente.",
        no_code: "Código de autenticação não encontrado.",
      };
      toast.error(messages[error] ?? `Erro na autenticação: ${error}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (user) {
      if (user.email && ADMIN_EMAILS.includes(user.email)) {
        router.push("/x7z-4dm1n-P4n3l");
      } else {
        router.push("/");
      }
    }
  }, [user, router]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Informe seu e-mail para recuperar a senha.");
      return;
    }
    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      toast.success("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
      setShowReset(false);
      setResetEmail("");
    } catch (err) {
      console.error("Reset error:", err);
      toast.error("Erro ao enviar e-mail de recuperação. Tente novamente.");
    } finally {
      setResetLoading(false);
    }
  };

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 antialiased transition-colors duration-500 relative overflow-hidden">
      <BackgroundEffects />

      <main className="w-full max-w-5xl transition-transform hover:scale-[1.01] hover:-translate-y-1 duration-300 ease-out z-10">
        <div
          className={`rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex flex-col md:flex-row min-h-[640px] backdrop-blur-2xl ${
            isDark
              ? "bg-[#0f172a]/60 border border-white/10"
              : "bg-white/40 border border-white/50"
          }`}
        >
          {/* Left Side — Form */}
          <div className="flex-1 p-8 md:p-14 flex flex-col justify-center">
            <div className="mb-10">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF9E9E] to-[#FF8080] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF9E9E]/30 mb-6">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
              </div>
              <h1 className={`text-3xl md:text-4xl font-semibold mb-2 ${isDark ? "text-white" : "text-gray-800"}`}>
                Bem-vindo de volta
              </h1>
              <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                Entre com sua conta para continuar.
              </p>
            </div>

            {/* Password Recovery Modal inline */}
            {showReset ? (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
                  Recuperar Senha
                </h2>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Insira seu e-mail e enviaremos um link para redefinir sua senha.
                </p>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className={`w-full px-4 py-3 rounded-lg outline-none transition-all ${
                    isDark
                      ? "bg-white/5 border border-white/10 text-white focus:border-brand-pink/50 focus:ring-2 focus:ring-brand-pink/20"
                      : "bg-gray-50 border border-gray-200 text-gray-900 focus:border-brand-pink/50 focus:ring-2 focus:ring-brand-pink/20"
                  }`}
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReset(false)}
                    className={`flex-1 py-3 rounded-lg font-bold transition-all border ${
                      isDark ? "border-white/20 text-white hover:bg-white/10" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-brand-pink to-brand-cyan hover:opacity-90 transition-all shadow-lg shadow-brand-pink/20 disabled:opacity-50"
                  >
                    {resetLoading ? "Enviando..." : "Enviar link"}
                  </button>
                </div>
              </form>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
                  const password = (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value;

                  try {
                    const { error } = await supabase.auth.signInWithPassword({ email, password });
                    if (error) throw error;
                    toast.success("Login realizado com sucesso!");
                    router.refresh();
                  } catch (err) {
                    console.error("Login error:", err);
                    toast.error("Credenciais incorretas. Verifique e-mail e senha.");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="seu@email.com"
                    className={`w-full px-4 py-3 rounded-lg outline-none transition-all ${
                      isDark
                        ? "bg-white/5 border border-white/10 text-white focus:border-brand-pink/50 focus:ring-2 focus:ring-brand-pink/20"
                        : "bg-gray-50 border border-gray-200 text-gray-900 focus:border-brand-pink/50 focus:ring-2 focus:ring-brand-pink/20"
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`} htmlFor="password">
                      Senha
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowReset(true)}
                      className="text-xs text-brand-pink hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
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
                  className="w-full py-3.5 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-brand-pink to-brand-cyan hover:opacity-90 transition-all shadow-lg shadow-brand-pink/20 active:scale-[0.98] mt-2 disabled:opacity-60"
                >
                  {loading ? "Entrando..." : "Entrar"}
                </button>
              </form>
            )}

            <p className={`mt-10 text-center text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Ao continuar, você concorda com nossos{" "}
              <a href="/termos" className="text-[#FF9E9E] font-semibold hover:underline">
                Termos de Serviço
              </a>{" "}
              e{" "}
              <a href="/privacidade" className="text-[#FF9E9E] font-semibold hover:underline">
                Política de Privacidade
              </a>
              .
            </p>

            <p className={`mt-4 text-center text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Não tem uma conta?{" "}
              <a href="/cadastro" className="text-[#FF9E9E] font-semibold hover:underline">
                Criar conta
              </a>
            </p>
          </div>

          {/* Right Side — Hero */}
          <div
            className={`flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden backdrop-blur-md ${
              isDark ? "bg-gray-900/40" : "bg-white/20"
            }`}
          >
            <div className={`absolute -top-24 -right-24 w-64 h-64 blur-3xl rounded-full ${isDark ? "bg-teal-500/10" : "bg-[#dcfce7]/40"}`} />
            <div className={`absolute -bottom-24 -left-24 w-64 h-64 blur-3xl rounded-full ${isDark ? "bg-indigo-500/10" : "bg-[#ddd6fe]/40"}`} />

            <div className="relative z-10 text-center max-w-sm">
              <div className="mb-12 relative inline-block">
                <div className="absolute inset-0 bg-[#FF9E9E]/20 blur-2xl rounded-full animate-pulse" />
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6-kA_EdQ4ho12OqQnyWvdYh7yXItuWoCzIleV19RCKq9o2wCYvcgqOjZTPlStLeCeYgD2TFLuh223Tic_lzsw3HSezyYRK7JJBiO3_0y34QgjIthTj_XTunkL9b_j1Sx8PHfqmsj8uYC_8nDKH5WPKQh2_FF1tEadNrmmawS3rl6OHf8mLOJ8yus2b03-WolLU-OKx7Vj18LB5k61NuZ_qlEId8adPL92lFQOcCWCWJSNs4pa4iMjr8x5wHcjDiMTvyugUwIhpriC"
                  alt="Garrafa Personalizada"
                  className="w-64 h-80 object-cover rounded-3xl shadow-2xl relative z-10 transform rotate-3 hover:rotate-0 transition-transform duration-500"
                />
              </div>

              <h2 className={`text-2xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-800"}`}>
                Seu Estilo, Hidratado.
              </h2>
              <p className={`mb-8 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Crie uma garrafa térmica de luxo que é unicamente sua. Escolha suas cores, texturas e gravação.
              </p>

              <div
                className={`p-4 rounded-2xl text-left flex items-center gap-4 shadow-lg max-w-[280px] mx-auto backdrop-blur-2xl ${
                  isDark ? "bg-white/5 border border-white/20" : "bg-white/40 border border-white/20"
                }`}
              >
                <div className="flex -space-x-2">
                  {[
                    "AB6AXuBNHBZdtnwkcENeE6t8fkKvCmej5PjUoCVBKgNwnotHGvVxnuZztHOlzuTTrg-C-KT0kuRXJcOeNcKUOiRo8su5sd8NWAe3jrhlrj2V9C3y9w0ZSi8eAP1dYM_CocWfr1_GX-Xyy03wg3ErfFvkiNAld1fy3dYfdPqwXKYmf18w57FAcY0C_2Bw0bmwFEdg6SOaDWjx8LOf1s7gn_8SVUUMr3onm1aJSqaQXvOHMwjkpRomZt9sa1UFf9rQ-39Q8T8ed_U5u0f_LxG0",
                    "AB6AXuA-8aUAohTGpNPkvzDz5_5jSajqpp1bMW6IYTyjozxSazgSzsRov81bHeIPox3Ze54KSgjmQPoDp6_3W5a8llYTmDoW7PINYm14ff6kRZUjzEGV10qeC6ghqQKeAxGypCjJeXdQMZNrOrZcBavCNQnUyfSjk3WT-ZRpKZK7MhyyEAMdduXau_Gf9JDarFvGAXaMbRX0eCaTZFUWImST7j0461f4WG4B7lREsSjPPdas6c2SxMLgweM1JyoDOxwvCvYGZydpqTE8zBXv",
                    "AB6AXuCtBdlRX4XWsekkJb2sQao22eDHiZh2ZeHOuAO6vDyhJiwSpeuY216OhfiKDDCjvUd3LmxUDWt8ZKwg3GThtnBYJjMSBcz6q0fTx-g6tpVUEeQquVR1cc0fEVTcdp7z0JiqDXYohqFuwVAj6K-r7ws9hPD5N31NC7_74XmCvHi7j92vO2A-a1w_YIiQ1WJ7brFfhXcimg_l3TDO-tVHiU5gSAU7nXlSzw25xU3PdRVJdmLsJJYfUYey0sXGfSi7zDO9adQkWzhoyso0",
                  ].map((id, i) => (
                    <img
                      key={i}
                      src={`https://lh3.googleusercontent.com/aida-public/${id}`}
                      alt={`User ${i + 1}`}
                      className={`w-8 h-8 rounded-full border-2 ${isDark ? "border-gray-800" : "border-white"}`}
                    />
                  ))}
                </div>
                <p className={`text-[10px] md:text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Junte-se a 10k+ criadores fazendo sua garrafa perfeita hoje.
                </p>
              </div>
            </div>

            <div className="absolute bottom-10 flex gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF9E9E]" />
              <span className={`w-2 h-2 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-300"}`} />
              <span className={`w-2 h-2 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-300"}`} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
