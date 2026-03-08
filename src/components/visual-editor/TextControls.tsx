
import React, { useState, useEffect, useRef } from 'react';
import { EDITOR_COLORS, FONTS, EditorLayer, ICON_CATEGORY_FOLDERS } from './constants';
import { Icons } from './Icons';
import { fetchIconsFromFolder } from '@/services/api/imagekitService';

interface TextControlsProps {
    layers: EditorLayer[];
    expandedLayerId: string | null;
    onExpandLayer: (id: string | null) => void;
    onUpdateLayer: (id: string, updates: Partial<EditorLayer>) => void;
    onAddText: (text: string) => void;
    onDeleteLayer: (id: string) => void;
    activeIconCat: string;
    setActiveIconCat: (c: string) => void;
    ICON_CATEGORIES: Record<string, string[]>;
    onAddIcon: (url: string) => void;
    onNewTextChange?: (text: string) => void;
    isAdmin?: boolean;
    onRecordDefault?: (layer: EditorLayer) => void;
}

export const TextControls: React.FC<TextControlsProps> = ({
    layers,
    expandedLayerId,
    onExpandLayer,
    onUpdateLayer,
    onAddText,
    onDeleteLayer,
    activeIconCat,
    setActiveIconCat,
    ICON_CATEGORIES,
    onAddIcon,
    onNewTextChange,
    isAdmin,
    onRecordDefault
}) => {
    const [newText, setNewText] = useState('');
    const [dynamicIcons, setDynamicIcons] = useState<Record<string, string[]>>({});
    const [loadingIcons, setLoadingIcons] = useState(false);
    const [colorsExpanded, setColorsExpanded] = useState(false);
    // Track which layer is being inline-edited
    const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
    const inlineInputRef = useRef<HTMLInputElement>(null);

    // Load icons dynamically from ImageKit on mount
    useEffect(() => {
        const loadDynamicIcons = async () => {
            setLoadingIcons(true);
            try {
                const loadedIcons: Record<string, string[]> = {};
                for (const [categoryName, folderPath] of Object.entries(ICON_CATEGORY_FOLDERS)) {
                    const icons = await fetchIconsFromFolder(folderPath);
                    if (icons.length > 0) {
                        loadedIcons[categoryName] = icons;
                    }
                }
                setDynamicIcons(loadedIcons);
            } catch (error) {
                console.error('Error loading dynamic icons:', error);
            } finally {
                setLoadingIcons(false);
            }
        };
        loadDynamicIcons();
    }, []);

    // Auto-focus inline input when editing starts
    useEffect(() => {
        if (editingLayerId && inlineInputRef.current) {
            inlineInputRef.current.focus();
            inlineInputRef.current.select();
        }
    }, [editingLayerId]);

    // Merge dynamic icons with fallback
    const displayIcons = Object.keys(ICON_CATEGORIES).reduce((acc, cat) => {
        acc[cat] = (dynamicIcons[cat] && dynamicIcons[cat].length > 0)
            ? dynamicIcons[cat]
            : ICON_CATEGORIES[cat];
        return acc;
    }, {} as Record<string, string[]>);

    const handleAdd = () => {
        if (!newText.trim()) return;
        onAddText(newText);
        setNewText('');
        if (onNewTextChange) onNewTextChange('');
    };

    const handleNewTextChange = (val: string) => {
        setNewText(val);
        if (onNewTextChange) onNewTextChange(val);
    };

    const textLayers = layers.filter(l => l.type === 'text');
    const currentCat = activeIconCat || Object.keys(displayIcons)[0];

    return (
        /* Outer: flex column, 24px (3×8) gap between sections, full height scroll */
        <div className="flex flex-col gap-6 min-h-0">

            {/* ── SECTION: ADD TEXT ── */}
            <div className="flex flex-col gap-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8]">Mensagem</h4>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Escreva algo brilhante..."
                        value={newText}
                        onChange={(e) => handleNewTextChange(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        className="flex-1 min-w-0 bg-white border border-[#e2e8f0] rounded-full px-4 py-2.5 focus:border-indigo-500 outline-none text-sm font-bold text-[#1e293b] transition-all placeholder:text-[#94a3b8] shadow-sm"
                    />
                    <button
                        title="Adicionar texto"
                        onClick={handleAdd}
                        className="w-10 h-10 shrink-0 bg-[#0F172A] rounded-full text-white flex items-center justify-center hover:bg-black transition-colors shadow-md"
                    >
                        <Icons.Plus className="w-4 h-4 stroke-3" />
                    </button>
                </div>
            </div>

            {/* ── SECTION: TEXT LAYERS (Photoshop-style) ── */}
            {textLayers.length > 0 && (
                <div className="flex flex-col gap-2 relative">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8]">
                        Camadas · {textLayers.length}
                    </h4>
                    <div className="flex flex-col gap-1">
                        {textLayers.map((layer, index) => {
                            const isExpanded = expandedLayerId === layer.id;
                            const isEditing = editingLayerId === layer.id;
                            return (
                                    <div key={layer.id} className="relative group">
                                        {/* Container principal clicável */}
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => {
                                                if (!isEditing) onExpandLayer(isExpanded ? null : layer.id);
                                            }}
                                            onKeyDown={(e) => {
                                                if ((e.key === 'Enter' || e.key === ' ') && !isEditing) {
                                                    onExpandLayer(isExpanded ? null : layer.id);
                                                }
                                            }}
                                            className={`flex w-full items-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                                                isExpanded
                                                    ? 'bg-[#00FF00]/10 border-[#00FF00]/40 shadow-sm'
                                                    : 'bg-white/60 border-slate-200/60 hover:border-[#00FF00]/30 hover:bg-white/90'
                                            }`}
                                        >
                                            {/* Layer type icon */}
                                            <div className={`shrink-0 p-1.5 rounded-md transition-colors ${isExpanded ? 'bg-[#00FF00] text-black' : 'bg-slate-100 text-slate-400'}`}>
                                                <Icons.Type className="w-3.5 h-3.5" />
                                            </div>

                                            {/* Inline editable layer name */}
                                            {isEditing ? (
                                                <input
                                                    ref={inlineInputRef}
                                                    type="text"
                                                    title="Editar texto da camada"
                                                    value={layer.content}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => onUpdateLayer(layer.id, { content: e.target.value })}
                                                    onBlur={() => setEditingLayerId(null)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === 'Escape') {
                                                            setEditingLayerId(null);
                                                        }
                                                    }}
                                                    className="flex-1 min-w-0 bg-transparent outline-none text-sm font-bold text-[#1e293b] border-b border-indigo-400 leading-none py-0.5"
                                                />
                                            ) : (
                                                <span
                                                    title="Clique duplo para editar"
                                                    onDoubleClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingLayerId(layer.id);
                                                    }}
                                                    className="flex-1 min-w-0 truncate text-sm font-semibold text-slate-700 cursor-text"
                                                >
                                                    {layer.content || `Texto ${index + 1}`}
                                                </span>
                                            )}

                                            {/* Actions block: Gear + Trash */}
                                            <div className="flex items-center gap-1 shrink-0">
                                                {/* Chevron / settings */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onExpandLayer(isExpanded ? null : layer.id);
                                                    }}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                                                        isExpanded
                                                            ? 'bg-[#00FF00]/20 text-slate-700 hover:bg-[#00FF00]/40'
                                                            : 'text-slate-400 hover:bg-slate-200 group-hover:text-slate-700'
                                                    }`}
                                                    title={isExpanded ? "Fechar ajustes" : "Abrir ajustes"}
                                                >
                                                    {isExpanded
                                                        ? <Icons.X className="w-3.5 h-3.5" />
                                                        : <Icons.Settings className="w-3.5 h-3.5" />
                                                    }
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteLayer(layer.id);
                                                        if (isExpanded) onExpandLayer(null);
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center opacity-100 text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition-all"
                                                    title="Excluir camada"
                                                >
                                                    <Icons.Trash className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                    {/* FLOATING PROPERTIES PANEL */}
                                    {isExpanded && (
                                        <div className="absolute right-[calc(100%+24px)] top-0 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 p-5 z-50 animate-in slide-in-from-right-4 fade-in duration-300">
                                            {/* Panel header */}
                                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-[#00FF00] text-black rounded-lg">
                                                        <Icons.Type className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-800 leading-none">Editar Texto</h3>
                                                        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Ajustes da Camada</p>
                                                    </div>
                                                </div>
                                                <button title="Fechar painel" onClick={() => onExpandLayer(null)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                                    <Icons.X className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                                                {/* Content */}
                                                <div className="flex flex-col gap-2">
                                                    <h4 className="section-label">Conteúdo</h4>
                                                    <input
                                                        type="text"
                                                        title="Conteúdo do texto"
                                                        placeholder="Digite o texto..."
                                                        value={layer.content}
                                                        onChange={(e) => onUpdateLayer(layer.id, { content: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white outline-none font-bold text-slate-700 transition-all placeholder:text-slate-400"
                                                    />
                                                </div>

                                                {/* Size */}
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="section-label !mb-0">Tamanho</h4>
                                                        <span className="value-badge">{layer.size}%</span>
                                                    </div>
                                                    <input type="range" min="10" max="1000" title="Tamanho do texto" value={layer.size}
                                                        onChange={(e) => onUpdateLayer(layer.id, { size: Number(e.target.value) })}
                                                        className="slider-track" />
                                                </div>

                                                {/* Rotation */}
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="section-label !mb-0">Rotação</h4>
                                                        <span className="value-badge">{layer.rotation || 0}°</span>
                                                    </div>
                                                    <input type="range" min="-180" max="180" title="Rotação" value={layer.rotation || 0}
                                                        onChange={(e) => onUpdateLayer(layer.id, { rotation: Number(e.target.value) })}
                                                        className="slider-track" />
                                                </div>

                                                {/* Font */}
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-bold text-slate-600">Fonte</label>
                                                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                                                        {FONTS.map((f) => (
                                                            <button
                                                                key={f.name}
                                                                onClick={() => onUpdateLayer(layer.id, { font: f.family })}
                                                                style={{ fontFamily: f.family }}
                                                                className={layer.font === f.family ? 'font-chip-active' : 'font-chip-idle'}
                                                            >
                                                                {f.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Style */}
                                                <div className="flex flex-col gap-2">
                                                    <h4 className="section-label">Estilo</h4>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => onUpdateLayer(layer.id, { underline: !layer.underline })}
                                                            className={`flex-1 p-2 rounded-lg border transition-all flex items-center justify-center ${layer.underline ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'}`}
                                                            title="Sublinhado">
                                                            <Icons.Underline className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => onUpdateLayer(layer.id, { italic: !layer.italic })}
                                                            className={`flex-1 p-2 rounded-lg border transition-all flex items-center justify-center ${layer.italic ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'}`}
                                                            title="Itálico">
                                                            <Icons.Italic className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => onUpdateLayer(layer.id, { stroke: !layer.stroke })}
                                                            className={`flex-1 p-2 rounded-lg border transition-all flex items-center justify-center ${layer.stroke ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'}`}
                                                            title="Contorno (Stroke)">
                                                            <Icons.Bold className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Color */}
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="section-label !mb-0">Cor</h4>
                                                        <button onClick={() => setColorsExpanded(!colorsExpanded)}
                                                            className="text-indigo-600 hover:text-indigo-700 font-bold text-[10px]">
                                                            {colorsExpanded ? 'Menos ▲' : 'Mais ▼'}
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-7 gap-1.5">
                                                        {EDITOR_COLORS.slice(0, colorsExpanded ? EDITOR_COLORS.length : 7).map((c) => (
                                                            <button
                                                                key={c.name}
                                                                onClick={() => onUpdateLayer(layer.id, { color: c.valor })}
                                                                className={`color-swatch ring-1 ring-slate-200 ${layer.color === c.valor ? 'border-indigo-600 scale-110 shadow-lg ring-2 ring-indigo-100' : 'border-white shadow-sm'}`}
                                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                                style={(c as any).style || { backgroundColor: c.valor }}
                                                                title={c.name}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* ADMIN: RECORD POSITION */}
                                                {isAdmin && onRecordDefault && (
                                                    <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-slate-100">
                                                        <button
                                                            onClick={() => onRecordDefault(layer)}
                                                            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-200 transition-all flex items-center justify-center gap-2 group"
                                                        >
                                                            <Icons.Check className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                            Gravar como Padrão
                                                        </button>
                                                        <p className="text-[9px] text-amber-600 font-bold text-center uppercase tracking-tighter">
                                                            Salva posição, fonte e cor para este produto
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── SECTION: ICON LIBRARY ── */}
            <div className="flex flex-col gap-4 pt-6 mt-2 border-t border-slate-100">
                <h4 className="text-[10px] font-black tracking-[0.2em] text-[#94a3b8] uppercase">Biblioteca</h4>

                {/* Category tabs — horizontal scroll, no clip */}
                <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2">
                    {Object.keys(displayIcons).map(cat => {
                        const isActive = currentCat === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setActiveIconCat(cat)}
                                className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                    isActive
                                        ? 'bg-[#0F172A] border-[#0F172A] text-white shadow-md'
                                        : 'bg-white border-[#e2e8f0] text-[#64748b] hover:bg-slate-50 hover:text-slate-800'
                                }`}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>

                {/* Icon grid */}
                <div className="relative">
                    {loadingIcons && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl">
                            <span className="inline-block animate-spin h-6 w-6 border-2 border-[#0F172A] border-t-transparent rounded-full" />
                        </div>
                    )}
                    <div className="grid grid-cols-4 gap-2">
                        {displayIcons[currentCat]?.map((url: string, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => onAddIcon(url)}
                                className="aspect-square bg-white border border-[#f1f5f9] rounded-xl p-2 shadow-sm hover:shadow-md hover:scale-105 transition-all flex items-center justify-center group"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={url}
                                    crossOrigin="anonymous"
                                    alt="icon"
                                    className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                                />
                            </button>
                        ))}
                        {/* Add placeholder */}
                        <button title="Em breve" className="aspect-square bg-white border-2 border-dashed border-[#e2e8f0] rounded-xl p-2 hover:border-[#94a3b8] transition-colors flex items-center justify-center group">
                            <Icons.Plus className="w-6 h-6 text-[#94a3b8] group-hover:text-[#0F172A] transition-colors" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── SECTION: COLOR PALETTE (below library) ── */}
            <div className="flex flex-col gap-3 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black tracking-[0.2em] text-[#94a3b8] uppercase">Paleta de Cores</h4>
                    <button
                        onClick={() => setColorsExpanded(!colorsExpanded)}
                        className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 transition-colors"
                    >
                        {colorsExpanded ? 'Menos ▲' : 'Mais ▼'}
                    </button>
                </div>
                <div className="grid grid-cols-8 gap-2">
                    {EDITOR_COLORS.slice(0, colorsExpanded ? EDITOR_COLORS.length : 16).map((c) => (
                        <button
                            key={c.name}
                            onClick={() => {
                                const targetId = expandedLayerId || (layers.length > 0 ? layers[layers.length - 1].id : null);
                                if (targetId) {
                                    onUpdateLayer(targetId, { color: c.valor });
                                }
                            }}
                            className="aspect-square w-8 h-8 rounded-lg border-2 border-white shadow-sm hover:scale-110 hover:shadow-md transition-all ring-1 ring-slate-200"
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            style={(c as any).style || { backgroundColor: c.valor }}
                            title={c.name}
                        />
                    ))}
                </div>
            </div>

        </div>
    );
};
