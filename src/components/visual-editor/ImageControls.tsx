
import React from 'react';
import { Icons } from './Icons';
import { EditorLayer } from './constants';

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
    const selectedLayer = imageLayers.find(l => l.id === expandedLayerId) ?? null;
    const isAdjustOpen = selectedLayer !== null;

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
                                const isSelected = selectedLayer?.id === layer.id;
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
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>

            {/* ─────────────────────────────────────────── */}
            {/* PANEL 2 — ADJUST (FLOATING)                 */}
            {/* ─────────────────────────────────────────── */}
            {isAdjustOpen && selectedLayer && (
                <div className="hidden lg:flex absolute left-full top-0 ml-6 w-[320px] max-h-full overflow-y-auto custom-scrollbar glass-panel rounded-xl p-5 flex-col gap-5 z-50 shadow-2xl animate-in slide-in-from-left-4 fade-in duration-300 border border-slate-200/50">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shrink-0 shadow-sm bg-slate-50 p-1 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={selectedLayer.content} alt="preview" className="max-w-full max-h-full object-contain drop-shadow-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-black text-slate-800 uppercase tracking-widest leading-none">Propriedades</p>
                            <p className="text-[11px] text-[#FF3E00] font-bold mt-1 bg-[#FF3E00]/5 inline-block px-2 py-0.5 rounded-full">
                                {selectedLayer?.type === 'icon' ? 'Ícone Selecionado' : 'Imagem Selecionada'}
                            </p>
                        </div>
                        <button
                            title="Fechar Propriedades"
                            onClick={() => onExpandLayer(null)}
                            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center shrink-0 text-slate-500"
                        >
                            <Icons.X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-100" />

                    {/* SIZE */}
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between">
                            <span className="section-label mb-0!">Tamanho</span>
                            <span className="text-[11px] font-bold text-[#FF3E00]">{Math.round((selectedLayer.size - 1000) / 10)}%</span>
                        </div>
                        <input
                            type="range" min="-100" max="100"
                            title="Escala da camada"
                            value={(selectedLayer.size - 1000) / 10}
                            onChange={(e) => onUpdateLayer(selectedLayer.id, { size: (Number(e.target.value) * 10) + 1000 })}
                            className="slider-track"
                        />
                    </div>

                    {/* ROTATION */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <p className="section-label mb-0! text-slate-600">Rotação</p>
                            <span className="text-[11px] font-bold text-[#FF3E00]">{selectedLayer.rotation ?? 0}°</span>
                        </div>
                        <input
                            type="range" min="-180" max="180"
                            title="Rotação da camada"
                            value={selectedLayer.rotation ?? 0}
                            onChange={(e) => onUpdateLayer(selectedLayer.id, { rotation: Number(e.target.value) })}
                            className="slider-track"
                        />
                    </div>

                    {/* OPACITY */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <p className="section-label mb-0! text-slate-600">Opacidade</p>
                            <span className="text-[11px] font-bold text-[#FF3E00]">{Math.round((selectedLayer.opacity ?? 1) * 100)}%</span>
                        </div>
                        <input
                            type="range" min="0" max="100"
                            title="Opacidade da camada"
                            value={Math.round((selectedLayer.opacity ?? 1) * 100)}
                            onChange={(e) => onUpdateLayer(selectedLayer.id, { opacity: Number(e.target.value) / 100 })}
                            className="slider-track"
                        />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-col gap-2 mt-2">

                        
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => onUpdateLayer(selectedLayer.id, { isMirrored: !selectedLayer.isMirrored })}
                                className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                            >
                                Espelhar
                            </button>
                            <button
                                onClick={() => {
                                    // Hacky duplication via updateLayer + random ID offset in parent is hard, so we just emit update?
                                    // Actually there is no simple duplicate injected. To keep it simple, let's skip for now or trigger delete.
                                    onExpandLayer(null);
                                }}
                                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-900 border border-slate-900 text-white rounded-xl text-[11px] font-bold shadow-sm transition-all"
                            >
                                Concluído
                            </button>
                        </div>
                        <button
                            onClick={() => { onDeleteLayer(selectedLayer.id); onExpandLayer(null); }}
                            className="w-full mt-2 py-2 text-rose-500 text-[11px] font-bold hover:bg-rose-50 rounded-lg transition-colors"
                        >
                            Excluir Camada
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
