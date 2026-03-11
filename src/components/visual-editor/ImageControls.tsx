import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { Icons } from './Icons';
import { EditorLayer } from './constants';
import { removeImageBackground } from '@/actions/image-actions';
import { toast } from 'sonner';

interface ImageControlsProps {
    layers: EditorLayer[];
    expandedLayerId: string | null;
    onExpandLayer: (id: string | null) => void;
    onUpdateLayer: (id: string, updates: Partial<EditorLayer>) => void;
    onAddImage: (img: string) => void;
    onDeleteLayer: (id: string) => void;
    handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    hideAddSection?: boolean;
    onlyShowSelected?: boolean;
}

export const ImageControls: React.FC<ImageControlsProps> = ({
    layers,
    expandedLayerId,
    onExpandLayer,
    onUpdateLayer,
    onDeleteLayer,
    handleUpload,
    hideAddSection = false,
}) => {
    const imageLayers = layers.filter(l => l.type === 'image' || l.type === 'icon');
    const [removingBgId, setRemovingBgId] = useState<string | null>(null);
    const [bgStatus, setBgStatus] = useState<Record<string, 'success' | 'error' | undefined>>({});

    const handleRemoveBackground = async (e: React.MouseEvent, layer: EditorLayer) => {
        e.stopPropagation();
        if (!layer.content || removingBgId) return;

        try {
            setRemovingBgId(layer.id);
            setBgStatus(prev => ({ ...prev, [layer.id]: undefined }));
            toast.loading("Removendo fundo da imagem...", { id: `remove-bg-${layer.id}` });
            
            const result = await removeImageBackground(layer.content);
            
            if (result.success && result.url) {
                onUpdateLayer(layer.id, { content: result.url, isBgClean: true });
                setBgStatus(prev => ({ ...prev, [layer.id]: 'success' }));
                toast.success("Fundo removido com sucesso!", { id: `remove-bg-${layer.id}` });
                
                // Limpa o estado de sucesso visual após 2.5s
                setTimeout(() => {
                    setBgStatus(prev => ({ ...prev, [layer.id]: undefined }));
                }, 2500);
            } else {
                setBgStatus(prev => ({ ...prev, [layer.id]: 'error' }));
                throw new Error(result.error || "Erro desconhecido");
            }
        } catch (error: any) {
            console.error("Error removing background:", error);
            setBgStatus(prev => ({ ...prev, [layer.id]: 'error' }));
            toast.error("Erro ao remover fundo: " + error.message, { id: `remove-bg-${layer.id}` });
            
            // Limpa o estado de erro visual após 2.5s
            setTimeout(() => {
                setBgStatus(prev => ({ ...prev, [layer.id]: undefined }));
            }, 2500);
        } finally {
            setRemovingBgId(null);
        }
    };

    return (
        <div className="flex flex-col gap-5 relative">
            {/* ─────────────────────────────────────────── */}
            {/* PANEL 1 — GALLERY                           */}
            {/* ─────────────────────────────────────────── */}
            <div className="w-full flex flex-col gap-5">
                {/* UPLOAD SECTION — Design 2026 (Refined) */}
                {!hideAddSection && (
                    <section className="flex flex-col gap-3">
                        <p className="section-label-dark">Importar Design</p>
                        <label className="group relative flex flex-col items-center justify-center w-full min-h-[160px] cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed border-slate-200 bg-white shadow-xs transition-all duration-500 hover:border-solid hover:border-[#FF3E00]/50 hover:shadow-2xl hover:shadow-[#FF3E00]/10 hover:-translate-y-1">
                            {/* Animated Background Gradient */}
                            <div className="absolute inset-0 bg-radial-at-tr from-[#FF3E00]/5 via-transparent to-rose-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            
                            <div className="relative z-10 flex flex-col items-center gap-4">
                                {/* Elevated Icon Container */}
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg border border-slate-100 group-hover:shadow-[#FF3E00]/20 group-hover:scale-110 transition-all duration-500">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-[#FF3E00] to-[#E63700] shadow-inner">
                                        <Icons.Upload className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                                
                                <div className="text-center px-4">
                                    <h4 className="text-xs font-black uppercase tracking-[0.15em] text-slate-800 group-hover:text-[#FF3E00] transition-colors">
                                        Carregar Imagem
                                    </h4>
                                    <p className="mt-1.5 text-[10px] font-bold text-slate-400 leading-relaxed">
                                        Arraste o arquivo ou <span className="text-[#FF3E00] underline decoration-[#FF3E00]/20 underline-offset-4">clique aqui</span>
                                        <br />
                                        <span className="opacity-70">Suporta apenas JPG, PNG ou Colar (Ctrl+V)</span>
                                    </p>
                                </div>
                            </div>

                            <input type="file" className="hidden" aria-label="Carregar Imagem" accept="image/*" onChange={handleUpload} />
                            
                            {/* Design 2026: Animated corner borders */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-transparent group-hover:border-[#FF3E00] transition-all duration-500 rounded-tl-3xl" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-transparent group-hover:border-[#FF3E00] transition-all duration-500 rounded-tr-3xl" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-transparent group-hover:border-[#FF3E00] transition-all duration-500 rounded-bl-3xl" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-transparent group-hover:border-[#FF3E00] transition-all duration-500 rounded-br-3xl" />
                        </label>
                    </section>
                )}



                {/* LAYERS LIST — Photoshop style */}
                {imageLayers.length > 0 && (
                    <section className="hidden lg:flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <p className="section-label">Camadas</p>
                            <span className="text-[10px] font-black text-slate-400 tabular-nums">{imageLayers.length}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            {imageLayers.map((layer, idx) => {
                                const isSelected = expandedLayerId === layer.id;
                                const layerLabel = layer.type === 'icon'
                                    ? `Ícone ${idx + 1}`
                                    : `Imagem ${idx + 1}`;
                                return (
                                    <div key={layer.id} className="group relative">
                                        {/* Container principal de toda a camada */}
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => onExpandLayer(isSelected ? null : layer.id)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    onExpandLayer(isSelected ? null : layer.id);
                                                }
                                            }}
                                            className={`flex w-full items-center gap-2 px-2 py-2 rounded-lg border transition-all cursor-pointer ${
                                                isSelected
                                                    ? 'bg-[#FF3E00]/5 border-[#FF3E00]/30 shadow-sm'
                                                    : 'bg-white/60 border-slate-200/60 hover:border-[#FF3E00]/20 hover:bg-white/90'
                                            }`}
                                        >
                                            {/* Thumbnail */}
                                            <div className="w-8 h-8 shrink-0 rounded-md overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center shadow-sm">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={layer.content}
                                                    alt=""
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>

                                            {/* Layer name */}
                                            <span className="flex-1 min-w-0 truncate text-xs font-semibold text-slate-700">
                                                {layerLabel}
                                            </span>

                                            {/* Actions div - inner container to group buttons */}
                                            <div className="flex items-center gap-1 shrink-0">
                                                {/* Gear / Close icon - using same logic as text but visually embedded */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onExpandLayer(isSelected ? null : layer.id);
                                                    }}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                                                        isSelected 
                                                            ? 'bg-[#FF3E00]/10 text-[#FF3E00] hover:bg-[#FF3E00]/20' 
                                                            : 'text-slate-400 group-hover:text-slate-700 hover:bg-slate-200'
                                                    }`}
                                                    title={isSelected ? "Fechar ajustes" : "Abrir ajustes"}
                                                >
                                                    {isSelected
                                                        ? <Icons.X className="w-3.5 h-3.5" />
                                                        : <Icons.Settings className="w-3.5 h-3.5" />
                                                    }
                                                </button>

                                                {/* Delete - always visible now and inside the layer container */}
                                                <button
                                                    onClick={(e) => { 
                                                        e.stopPropagation();
                                                        onDeleteLayer(layer.id); 
                                                        if (isSelected) onExpandLayer(null); 
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center opacity-100 text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition-all"
                                                    title="Excluir camada"
                                                >
                                                    <Icons.Trash className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* INLINE PROPERTIES PANEL */}
                                        <AnimatePresence>
                                            {isSelected && (
                                                <motion.div 
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="w-full mt-2 bg-slate-50 rounded-xl border border-slate-200 p-4 z-10 overflow-hidden"
                                                >
                                                    {/* Header */}
                                                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                                                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shrink-0 shadow-sm bg-white p-1 flex items-center justify-center">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={layer.content} alt="preview" className="max-w-full max-h-full object-contain drop-shadow-sm" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[12px] font-black text-slate-800 uppercase tracking-widest leading-none">Propriedades</p>
                                                            <p className="text-[11px] text-[#FF3E00] font-bold mt-1 bg-[#FF3E00]/5 inline-block px-2 py-0.5 rounded-full">
                                                                {layer.type === 'icon' ? 'Ícone Selecionado' : 'Imagem Selecionada'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* COLOR (ICONS ONLY) */}
                                                    {layer.type === 'icon' && (
                                                        <div className="flex flex-col gap-3 mb-4">
                                                            <p className="section-label mb-0! text-slate-600">Cor do Ícone</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {[
                                                                    { label: 'Branco', value: '#FFFFFF', border: 'border-slate-200' },
                                                                    { label: 'Preto', value: '#000000', border: 'border-slate-900' },
                                                                    { label: 'Rosa', value: '#FF4586', border: 'border-[#FF4586]' },
                                                                    { label: 'Ciano', value: '#00C9D4', border: 'border-[#00C9D4]' },
                                                                    { label: 'Ouro', value: '#FFD700', border: 'border-[#FFD700]' },
                                                                ].map(color => (
                                                                    <button
                                                                        key={color.value}
                                                                        onClick={(e) => { e.stopPropagation(); onUpdateLayer(layer.id, { color: color.value }); }}
                                                                        className={`w-8 h-8 rounded-full border-2 transition-all ${layer.color === color.value ? 'scale-110 shadow-md border-indigo-500' : `${color.border} hover:scale-105`}`}
                                                                        style={{ backgroundColor: color.value }}
                                                                        title={color.label}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* SIZE */}
                                                    <div className="flex flex-col gap-3 mb-4">
                                                        <div className="flex justify-between">
                                                            <span className="section-label mb-0!">Tamanho</span>
                                                            <span className="text-[11px] font-bold text-[#FF3E00]">{Math.round((layer.size - 1000) / 10)}%</span>
                                                        </div>
                                                        <input
                                                            type="range" min="-100" max="100"
                                                            title="Tamanho da imagem"
                                                            value={(layer.size - 1000) / 10}
                                                            onChange={(e) => onUpdateLayer(layer.id, { size: (Number(e.target.value) * 10) + 1000 })}
                                                            className="slider-track"
                                                        />
                                                    </div>

                                                    {/* ROTATION */}
                                                    <div className="flex flex-col gap-3 mb-4">
                                                        <div className="flex items-center justify-between">
                                                            <p className="section-label mb-0! text-slate-600">Girar</p>
                                                            <span className="text-[11px] font-bold text-[#FF3E00]">{layer.rotation ?? 0}°</span>
                                                        </div>
                                                        <input
                                                            type="range" min="-180" max="180"
                                                            title="Girar a imagem"
                                                            value={layer.rotation ?? 0}
                                                            onChange={(e) => onUpdateLayer(layer.id, { rotation: Number(e.target.value) })}
                                                            className="slider-track"
                                                        />
                                                    </div>

                                                    {/* STRETCH */}
                                                    <div className="flex flex-col gap-3 mb-4">
                                                        <p className="section-label mb-0! text-slate-600">Esticar Imagem</p>
                                                        
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Para os lados</span>
                                                                <span className="text-[11px] font-bold text-[#FF3E00]">{Math.round((layer.scaleX || 1) * 100)}%</span>
                                                            </div>
                                                            <input
                                                                type="range" min="10" max="300"
                                                                title="Esticar para os lados"
                                                                value={Math.round((layer.scaleX || 1) * 100)}
                                                                onChange={(e) => onUpdateLayer(layer.id, { scaleX: Number(e.target.value) / 100 })}
                                                                className="slider-track"
                                                            />
                                                        </div>

                                                        <div className="flex flex-col gap-2 mt-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Para cima e para baixo</span>
                                                                <span className="text-[11px] font-bold text-[#FF3E00]">{Math.round((layer.scaleY || 1) * 100)}%</span>
                                                            </div>
                                                            <input
                                                                type="range" min="10" max="300"
                                                                title="Esticar para cima/baixo"
                                                                value={Math.round((layer.scaleY || 1) * 100)}
                                                                onChange={(e) => onUpdateLayer(layer.id, { scaleY: Number(e.target.value) / 100 })}
                                                                className="slider-track"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* POSITION */}
                                                    <div className="flex flex-col gap-3 mb-4">
                                                        <p className="section-label mb-0! text-slate-600">Mover Imagem</p>
                                                        
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Esquerda / Direita</span>
                                                                <span className="text-[11px] font-bold text-[#FF3E00]">{Math.round(layer.x)}%</span>
                                                            </div>
                                                            <input
                                                                type="range" min="-100" max="200"
                                                                title="Mover horizontalmente"
                                                                value={layer.x}
                                                                onChange={(e) => onUpdateLayer(layer.id, { x: Number(e.target.value) })}
                                                                className="slider-track"
                                                            />
                                                        </div>

                                                        <div className="flex flex-col gap-2 mt-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Cima / Baixo</span>
                                                                <span className="text-[11px] font-bold text-[#FF3E00]">{Math.round(layer.y)}%</span>
                                                            </div>
                                                            <input
                                                                type="range" min="-100" max="200"
                                                                title="Mover verticalmente"
                                                                value={layer.y}
                                                                onChange={(e) => onUpdateLayer(layer.id, { y: Number(e.target.value) })}
                                                                className="slider-track"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* ACTIONS */}
                                                    <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); onUpdateLayer(layer.id, { isMirrored: !layer.isMirrored }); }}
                                                                className="w-full py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                                                            >
                                                                Espelhar
                                                            </button>
                                                            {layer.type === 'image' && (
                                                                <button
                                                                    onClick={(e) => handleRemoveBackground(e, layer)}
                                                                    disabled={removingBgId === layer.id}
                                                                    className={`w-full py-2 px-3 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all duration-300 relative overflow-hidden group 
                                                                        ${bgStatus[layer.id] === 'success' ? 'bg-emerald-500 text-white border-transparent' : ''}
                                                                        ${bgStatus[layer.id] === 'error' ? 'bg-red-500 text-white border-transparent' : ''}
                                                                        ${!bgStatus[layer.id] && layer.isBgClean ? 'bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 text-fuchsia-600 border-fuchsia-500/30' : ''}
                                                                        ${!bgStatus[layer.id] && !layer.isBgClean ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5' : ''}
                                                                        ${removingBgId === layer.id ? 'opacity-90 cursor-wait pointer-events-none scale-95' : ''}
                                                                    `}
                                                                >
                                                                    {/* Background animado de loading */}
                                                                    {removingBgId === layer.id && (
                                                                        <motion.div
                                                                            animate={{ x: ["-100%", "100%"] }}
                                                                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                                                        />
                                                                    )}

                                                                    {!layer.isBgClean && removingBgId !== layer.id && !bgStatus[layer.id] && (
                                                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                                                    )}
                                                                    {removingBgId === layer.id ? (
                                                                        <>
                                                                            <Loader2 className="w-3.5 h-3.5 relative z-10 animate-[spin_1s_linear_infinite]" />
                                                                            <span className="relative z-10 animate-pulse">Removendo...</span>
                                                                        </>
                                                                    ) : bgStatus[layer.id] === 'success' ? (
                                                                        <>
                                                                            <Icons.Check className="w-3.5 h-3.5 relative z-10 animate-bounce" />
                                                                            <span className="relative z-10">Concluído!</span>
                                                                        </>
                                                                    ) : bgStatus[layer.id] === 'error' ? (
                                                                        <>
                                                                            <Icons.X className="w-3.5 h-3.5 relative z-10 animate-bounce" />
                                                                            <span className="relative z-10">Falhou!</span>
                                                                        </>
                                                                    ) : layer.isBgClean ? (
                                                                        <>
                                                                            <Sparkles className="w-3.5 h-3.5 relative z-10" />
                                                                            <span className="relative z-10">Fundo Removido</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Sparkles className="w-3.5 h-3.5 relative z-10" />
                                                                            <span className="relative z-10 tracking-wide">Remover Fundo <span className="text-[9px] font-black opacity-60 ml-1">AI</span></span>
                                                                        </>
                                                                    )}
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); onExpandLayer(null); }}
                                                                className={`w-full py-2 px-3 bg-slate-800 hover:bg-slate-900 border border-slate-900 text-white rounded-xl text-[11px] font-bold shadow-sm transition-all ${layer.type === 'icon' ? 'col-span-1' : 'col-span-2'}`}
                                                            >
                                                                Concluído
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>


        </div>
    );
};
