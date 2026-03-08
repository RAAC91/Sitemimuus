"use client";

import { useTheme } from "next-themes";
import { BackgroundEffects } from "@/components/ui/background-effects";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";

import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function PoliticasPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, []);

  if (!mounted) return null;
  const isDark = resolvedTheme === 'dark';

  return (
    <div className={`min-h-screen relative p-4 transition-colors duration-500 overflow-hidden`}>
      <Header />
      <BackgroundEffects />
      
      <div className="fixed top-24 right-6 z-50">
        <ThemeToggle />
      </div>

      <main className="max-w-4xl mx-auto pt-32 pb-16 relative z-10 font-sans">
        <div className={`rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-xl transition-colors duration-500 ${
            isDark 
              ? 'bg-[#0f172a]/70 border border-white/10 text-gray-300' 
              : 'bg-white/60 border border-white/50 text-gray-700'
        }`}>
          <h1 className={`text-4xl md:text-5xl font-bold mb-12 text-center tracking-tight ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Políticas e Termos
          </h1>

          <div className="max-w-4xl mx-auto px-6">
            <Breadcrumb 
              items={[{ label: "POLÍTICAS" }]} 
              className="mb-8"
            />
          </div>

          <div className="space-y-12">
            <section>
              <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-500 text-sm">01</span>
                Política de Privacidade
              </h2>
              <div className="space-y-4 leading-relaxed pl-11">
                <p>
                  A Mimuus respeita sua privacidade. Coletamos apenas informações necessárias para 
                  processar seus pedidos e melhorar sua experiência.
                </p>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-white/5' : 'bg-indigo-50'}`}>
                  <p><strong>Dados coletados:</strong> Nome, email, endereço de entrega, informações de pagamento.</p>
                </div>
                <p>
                  <strong>Uso dos dados:</strong> Processamento de pedidos, comunicação sobre entregas, 
                  melhorias no serviço. Seus dados nunca serão compartilhados com terceiros sem seu consentimento.
                </p>
              </div>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                <span className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-500 text-sm">02</span>
                Termos de Uso
              </h2>
              <div className="space-y-4 leading-relaxed pl-11">
                <p>
                  Ao usar o site da Mimuus, você concorda com nossos termos de uso.
                </p>
                <ul className="list-disc pl-5 space-y-2 marker:text-teal-500">
                  <li><strong>Produtos:</strong> Todos os produtos são vendidos conforme descrição. Cores podem variar ligeiramente devido a configurações de tela.</li>
                  <li><strong>Personalização:</strong> Designs personalizados são de responsabilidade do cliente. Não nos responsabilizamos por erros de digitação ou escolhas de design feitas pelo usuário.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                <span className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-500 text-sm">03</span>
                Trocas e Devoluções
              </h2>
              <div className="space-y-4 leading-relaxed pl-11">
                <p>
                  Você tem <strong>30 dias</strong> para solicitar troca ou devolução de produtos com defeito.
                </p>
                <div className={`p-4 rounded-lg border-l-4 border-rose-500 ${isDark ? 'bg-rose-500/10' : 'bg-rose-50'}`}>
                  <p className="font-semibold mb-1">Atenção aos Produtos Personalizados</p>
                  <p className="text-sm">
                    Não aceitamos trocas ou devoluções de produtos personalizados (com nome, logo, etc.), exceto em caso comprovado de defeito de fabricação.
                  </p>
                </div>
                <p>
                  <strong>Como solicitar:</strong> Entre em contato pelo email <a href="mailto:contato@mimuus.com.br" className="text-rose-500 hover:underline">contato@mimuus.com.br</a> com número do pedido e fotos do produto.
                </p>
              </div>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500 text-sm">04</span>
                Política de Envio
              </h2>
              <div className="space-y-4 leading-relaxed pl-11">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div className={`p-4 rounded-lg text-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <div className="text-2xl mb-2">🚚</div>
                    <div className="font-bold mb-1">Prazo</div>
                    <div className="text-sm opacity-80">5 a 15 dias úteis</div>
                  </div>
                  <div className={`p-4 rounded-lg text-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <div className="text-2xl mb-2">📦</div>
                    <div className="font-bold mb-1">Frete</div>
                    <div className="text-sm opacity-80">Calculado no checkout</div>
                  </div>
                  <div className={`p-4 rounded-lg text-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <div className="text-2xl mb-2">🔍</div>
                    <div className="font-bold mb-1">Rastreio</div>
                    <div className="text-sm opacity-80">Enviado por email</div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className={`mt-16 pt-8 border-t text-center ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            <p className="text-sm opacity-60">
              Mimuus © {new Date().getFullYear()}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
