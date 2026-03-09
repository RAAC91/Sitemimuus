"use client";

import { useState } from "react";
import { ChevronRight, Search, Bell, ChevronDown, Store, Palette, LayoutDashboard, ShoppingCart, Package, Users, Settings, Smartphone, Monitor, ChevronLeft, CloudUpload, History, Eye, ArrowLeft, Menu, GripVertical, Star, Video, HelpCircle } from "lucide-react";
import { Reorder, useDragControls } from "framer-motion";
import { useRouter } from "next/navigation";

const INITIAL_SECTIONS = [
  { id: 'hero', label: 'Hero Banner', icon: LayoutDashboard },
  { id: 'featured', label: 'Destaques', icon: ShoppingCart },
  { id: 'reviews', label: 'Avaliações', icon: Star },
  { id: 'tiktok', label: 'TikTok Shop', icon: Video },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
];

export default function ThemeCustomizerPage() {
  const router = useRouter();
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [logoPosition, setLogoPosition] = useState('Middle center');
  const [isSticky, setIsSticky] = useState(true);
  const [headingText, setHeadingText] = useState('Coleção de Verão');
  const [buttonLabel, setButtonLabel] = useState('Comprar Agora');
  const [sections, setSections] = useState(INITIAL_SECTIONS);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50 -m-8 overflow-hidden">
        {/* Header do Editor de Tema */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-50">
            <div className="flex items-center gap-4">
                <button type="button" onClick={() => router.push('/x7z-4dm1n-P4n3l')} className="flex items-center justify-center p-1.5 hover:bg-gray-100 rounded text-gray-500">
                    <ArrowLeft size={20} />
                </button>
                <div className="h-6 w-[1px] bg-gray-200 mx-1"></div>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                    <h1 className="text-sm font-semibold text-gray-900">Página Inicial</h1>
                    <ChevronDown size={16} className="text-gray-400" />
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveDevice('mobile')}
                        className={`p-1 px-3 transition-colors rounded ${activeDevice === 'mobile' ? 'bg-white shadow-sm text-brand-secondary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Smartphone size={20} />
                    </button>
                    <button 
                         onClick={() => setActiveDevice('desktop')}
                         className={`p-1 px-3 transition-colors rounded ${activeDevice === 'desktop' ? 'bg-white shadow-sm text-brand-secondary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Monitor size={20} />
                    </button>
                </div>
                <div className="h-6 w-[1px] bg-gray-200 mx-1"></div>
                <button className="bg-brand-secondary text-white px-5 py-1.5 text-sm font-medium rounded-lg hover:bg-brand-secondary/90 transition-colors shadow-lg shadow-brand-secondary/20">
                    Salvar Alterações
                </button>
            </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Sidebar de Configuração (Hidden on mobile for now or stacked) */}
            <aside className="w-full lg:w-80 bg-white border-b lg:border-r border-gray-200 flex flex-col overflow-y-auto shrink-0 max-h-[40vh] lg:max-h-full">
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    
                    {/* Seção Header */}
                    <details className="group border-b border-gray-100" open>
                         {/* ... existing header details ... */}
                    </details>

                    <div className="p-4 bg-gray-50 border-b border-gray-100">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Ordem das Seções</h3>
                        <Reorder.Group axis="y" values={sections} onReorder={setSections} className="space-y-2">
                            {sections.map((section) => (
                                <Reorder.Item key={section.id} value={section} className="bg-white border boundary-item border-gray-200 rounded-lg p-3 flex items-center gap-3 cursor-move shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]">
                                    <GripVertical size={16} className="text-gray-400" />
                                    <section.icon size={16} className="text-brand-secondary" />
                                    <span className="text-sm font-medium text-gray-700">{section.label}</span>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    </div>

                    {/* Editor da Seção Selecionada (Ex: Hero) */}
                    <div className="p-4 border-b border-gray-100">
                         <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Editar: Hero Banner</h3>
                         {/* ... existing hero controls ... */}
                    </div>

                </div>
                
                {/* Footer da Sidebar */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <button className="p-2 text-gray-500 hover:text-brand-secondary transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                        <Settings size={14} />
                        Configurações Gerais
                    </button>
                    <div className="flex gap-1">
                        <button className="p-2 text-gray-500 hover:text-brand-secondary transition-colors" title="Histórico">
                            <History size={16} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-brand-secondary transition-colors" title="Preview">
                            <Eye size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Área de Preview */}
            <section className="flex-1 bg-gray-100 p-4 lg:p-8 flex flex-col items-center overflow-y-auto w-full min-h-0">
                <div 
                    className={`bg-white shadow-2xl transition-all duration-300 overflow-hidden flex flex-col shrink-0 ${
                        activeDevice === 'mobile' 
                            ? 'w-[320px] sm:w-[375px] h-[600px] sm:h-[750px] rounded-[2rem] sm:rounded-[3rem] border-[8px] border-gray-900' 
                            : 'w-full max-w-6xl rounded-lg h-[500px] lg:h-full min-h-[500px]'
                    }`}
                >
                    {/* Mockup Content - This would effectively be an iframe or rendered components in a real app */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                        
                        {/* Header Mock */}
                        <div className={`h-16 flex items-center justify-between px-6 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-10 ${isSticky ? '' : 'hidden'}`}>
                            <span className="font-black tracking-tighter text-xl">MIMUUS.</span>
                            <nav className={`flex gap-4 text-xs font-bold uppercase tracking-widest ${activeDevice === 'mobile' ? 'hidden' : ''}`}>
                                <span>Home</span>
                                <span>Produtos</span>
                                <span>Sobre</span>
                            </nav>
                        </div>

                        {/* Drag & Drop Canvas Preview - Dynamically Ordered */}
                        <div className="flex flex-col">
                            {sections.map(section => {
                                if (section.id === 'hero') {
                                    return (
                                        <div key={section.id} className="relative h-[500px] w-full bg-gray-900 flex items-center justify-center text-center p-8 shrink-0">
                                             <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1602143407151-11115cdbf69c?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center" />
                                             <div className="relative z-10 max-w-lg">
                                                 <h2 className="text-white text-5xl font-black mb-4 tracking-tighter leading-tight drop-shadow-lg">{headingText}</h2>
                                                 <p className="text-white/90 text-lg mb-8 font-medium drop-shadow-md">Explore a nova era da personalização.</p>
                                                 <button className="bg-white text-black px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform">
                                                    {buttonLabel}
                                                 </button>
                                             </div>
                                        </div>
                                    );
                                }
                                
                                return (
                                    <div key={section.id} className="p-12 space-y-8 bg-white shrink-0 border-b border-gray-50 last:border-0">
                                        <div className="flex justify-between items-end">
                                             <h3 className="text-2xl font-bold">{section.label}</h3>
                                             <span className="text-sm border-b border-gray-300 cursor-pointer">Ver todos</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[1, 2].map(i => (
                                                <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                                                    <section.icon className="text-gray-300 w-12 h-12 opacity-50" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </div>
            </section>
        </div>
    </div>
  );
}
