
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
    isBusy: boolean;
    aiPrompt: string;
    setAiPrompt: (p: string) => void;
    isAiLoading: boolean;
    handleAiGenerate: () => void;
    handleAiBackgroundRemoval: (id: string) => void;
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
    isBusy,
    aiPrompt,
    setAiPrompt,
    isAiLoading,
    handleAiGenerate,
    handleAiBackgroundRemoval,
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
                {/* UPLOAD */}
                {!hideAddSection && (
                    <section className="flex flex-col gap-2">
                        <p className="section-label">Importar Imagem</p>
                        <label className="upload-zone group cursor-pointer">
                            <div className="upload-icon">
                                <Icons.Upload className="w-5 h-5" />
                            </div>
                            <span className="upload-text">Arraste ou clique aqui</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                        </label>
                    </section>
                )}

                {/* AI GENERATOR */}
                {!hideAddSection && (
                    <section className="flex flex-col gap-2">
                        <p className="section-label">Criação Instantânea</p>
                        <div className="ai-generator-card relative rounded-md border border-slate-200/60 bg-slate-50/50 p-3 flex flex-col gap-2">
                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                                <Icons.Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                Gerar com IA
                            </p>

                            <textarea
                                className="w-full bg-white border border-slate-200 rounded-sm p-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300 resize-none h-16 text-slate-700 transition-all placeholder:text-slate-400 shadow-sm"
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                placeholder="Ex: Um astronauta de grafite pilotando um skate voador..."
                            />

                            <button
                                onClick={handleAiGenerate}
                                disabled={isAiLoading || !aiPrompt.trim()}
                                className="ai-generate-btn w-full flex items-center justify-center gap-2 rounded-sm bg-slate-900 text-white px-4 py-2 text-[11px] font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                {isAiLoading ? (
                                    <>
                                        <span className="animate-spin h-3.5 w-3.5 border border-white/30 border-t-white rounded-full" />
                                        Processando...
                                    </>
                                ) : (
                                    <>
                                        <Icons.Zap className="w-3.5 h-3.5" />
                                        Gerar Imagem
                                    </>
                                )}
                            </button>
                        </div>
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
                                                    ? 'bg-indigo-50 border-indigo-300 shadow-sm'
                                                    : 'bg-white/60 border-slate-200/60 hover:border-indigo-200 hover:bg-white/90'
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
                                                            ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' 
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
                            <p className="text-[11px] text-indigo-500 font-bold mt-1 bg-indigo-50 inline-block px-2 py-0.5 rounded-full">
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
                            <span className="section-label mb-0">Tamanho</span>
                            <span className="text-[11px] font-bold text-indigo-500">{Math.round((selectedLayer.size - 1000) / 10)}%</span>
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
                            <p className="section-label mb-0 text-slate-600">Rotação</p>
                            <span className="text-[11px] font-bold text-indigo-500">{selectedLayer.rotation ?? 0}°</span>
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
                            <p className="section-label mb-0 text-slate-600">Opacidade</p>
                            <span className="text-[11px] font-bold text-indigo-500">{Math.round((selectedLayer.opacity ?? 1) * 100)}%</span>
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
                        {/* BG REMOVAL */}
                        {selectedLayer.type === 'image' && (
                            <button
                                onClick={() => handleAiBackgroundRemoval(selectedLayer.id)}
                                disabled={isBusy}
                                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                                    selectedLayer.isBgClean 
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default' 
                                    : 'bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-100/80 hover:border-rose-200 cursor-pointer shadow-sm'
                                }`}
                            >
                                {selectedLayer.isBgClean ? (
                                    <><span>✨</span> Fundo Removido</>
                                ) : (
                                    <>🪄 Remover Fundo</>
                                )}
                            </button>
                        )}
                        
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
