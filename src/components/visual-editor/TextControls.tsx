
import React, { useState, useEffect, useRef } from 'react';
import { EDITOR_COLORS, FONTS, EditorLayer, ICON_CATEGORY_FOLDERS } from './constants';
import { Icons } from './Icons';
import { fetchIconsFromFolder } from '@/services/api/imagekitService';
import { motion, AnimatePresence } from 'framer-motion';

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
    /** When true, hides the icon library section (used in mobile Texto tab) */
    hideIconLib?: boolean;
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
    hideIconLib = false
}) => {
    const [newText, setNewText] = useState('');
    const [dynamicIcons, setDynamicIcons] = useState<Record<string, string[]>>({});
    const [loadingIcons, setLoadingIcons] = useState(false);
    const [colorsExpanded, setColorsExpanded] = useState(false);
    // Track which layer is being inline-edited
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                        className="flex-1 min-w-0 bg-white border border-[#e2e8f0] rounded-full px-4 py-2.5 focus:border-[#FF3E00] outline-none text-sm font-bold text-[#1e293b] transition-all placeholder:text-[#94a3b8] shadow-sm"
                    />
                    <motion.button
                        title="Adicionar texto"
                        onClick={handleAdd}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={newText.trim() ? {
                            scale: [1, 1.05, 1],
                            boxShadow: [
                                "0px 4px 6px rgba(0,0,0,0.1)",
                                "0px 8px 15px rgba(255, 62, 0, 0.4)",
                                "0px 4px 6px rgba(0,0,0,0.1)"
                            ]
                        } : { scale: 1 }}
                        transition={newText.trim() ? {
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        } : { duration: 0.2 }}
                        className={`w-10 h-10 shrink-0 rounded-full text-white flex items-center justify-center transition-colors shadow-md ${
                            newText.trim() ? 'bg-[#FF3E00] hover:bg-[#E63700]' : 'bg-[#0F172A] hover:bg-black'
                        }`}
                    >
                        <Icons.Plus className="w-4 h-4 stroke-3" />
                    </motion.button>
                </div>
            </div>

            {/* ── SECTION: TEXT LAYERS (Photoshop-style) ── */}
            {textLayers.length > 0 && (
                <div className="hidden lg:flex flex-col gap-2 relative">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8]">
                        Camadas · {textLayers.length}
                    </h4>
                    <div className="flex flex-col gap-1.5">
                        <AnimatePresence mode="popLayout">
                            {textLayers.map((layer, index) => {
                                const isExpanded = expandedLayerId === layer.id;
                                return (
                                    <motion.div 
                                        key={layer.id} 
                                        layout
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                        transition={{ 
                                            type: "spring",
                                            stiffness: 350,
                                            damping: 25,
                                            delay: index * 0.05
                                        }}
                                        className="relative group"
                                    >
                                        <div
                                            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer group-hover:shadow-lg ${
                                                isExpanded 
                                                ? 'bg-white border-[#FF3E00] shadow-[0_8px_30px_rgb(255,62,0,0.1)]' 
                                                : 'bg-white/50 border-slate-100 hover:border-slate-300 hover:bg-white'
                                            }`}
                                            onClick={() => onExpandLayer(isExpanded ? null : layer.id)}
                                        >
                                            <div className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-lg transition-colors ${
                                                isExpanded ? 'bg-[#FF3E00] text-white' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                                <Icons.Type className="w-4 h-4" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <input
                                                    className={`w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0 ${
                                                        isExpanded ? 'text-slate-900' : 'text-slate-600'
                                                    }`}
                                                    title="Texto da camada"
                                                    value={layer.content}
                                                    onChange={(e) => onUpdateLayer(layer.id, { content: e.target.value })}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>

                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    title="Excluir camada"
                                                    onClick={(e) => { e.stopPropagation(); onDeleteLayer(layer.id); }}
                                                    className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors flex items-center justify-center"
                                                >
                                                    <Icons.Trash className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* INLINE PROPERTIES PANEL */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div 
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="w-full mt-2 bg-slate-50 rounded-xl border border-slate-200 p-4 z-10 overflow-hidden"
                                                >
                                                    
                                                    {/* Panel header */}
                                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-[#FF3E00]/10 text-[#FF3E00] rounded-lg">
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
                                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:border-[#FF3E00] focus:bg-white outline-none font-bold text-slate-700 transition-all placeholder:text-slate-400"
                                                            />
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

                                                        {/* Size */}
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex justify-between items-center">
                                                                <h4 className="section-label mb-0!">Tamanho</h4>
                                                                <span className="value-badge">{layer.size}%</span>
                                                            </div>
                                                            <input type="range" min="10" max="1000" title="Tamanho do texto" value={layer.size}
                                                                onChange={(e) => onUpdateLayer(layer.id, { size: Number(e.target.value) })}
                                                                className="slider-track" />
                                                        </div>

                                                        {/* Rotation */}
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex justify-between items-center">
                                                                <h4 className="section-label mb-0!">Rotação</h4>
                                                                <span className="value-badge">{layer.rotation || 0}°</span>
                                                            </div>
                                                            <input type="range" min="-180" max="180" title="Rotação" value={layer.rotation || 0}
                                                                onChange={(e) => onUpdateLayer(layer.id, { rotation: Number(e.target.value) })}
                                                                className="slider-track" />
                                                        </div>

                                                        {/* Style */}
                                                        <div className="flex flex-col gap-2">
                                                            <h4 className="section-label">Estilo</h4>
                                                            <div className="flex gap-2">
                                                                <button onClick={() => onUpdateLayer(layer.id, { underline: !layer.underline })}
                                                                    className={`flex-1 p-2 rounded-lg border transition-all flex items-center justify-center ${layer.underline ? 'bg-[#FF3E00] text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'}`}
                                                                    title="Sublinhado">
                                                                    <Icons.Underline className="w-4 h-4" />
                                                                </button>
                                                                <button onClick={() => onUpdateLayer(layer.id, { italic: !layer.italic })}
                                                                    className={`flex-1 p-2 rounded-lg border transition-all flex items-center justify-center ${layer.italic ? 'bg-[#FF3E00] text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'}`}
                                                                    title="Itálico">
                                                                    <Icons.Italic className="w-4 h-4" />
                                                                </button>
                                                                <button onClick={() => onUpdateLayer(layer.id, { stroke: !layer.stroke })}
                                                                    className={`flex-1 p-2 rounded-lg border transition-all flex items-center justify-center ${layer.stroke ? 'bg-[#FF3E00] text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'}`}
                                                                    title="Contorno (Stroke)">
                                                                    <Icons.Bold className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Color */}
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex justify-between items-center">
                                                                <h4 className="section-label mb-0!">Cor</h4>
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
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* ── SECTION: ICON LIBRARY ── */}
            {!hideIconLib && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4 pt-6 mt-2 border-t border-slate-100"
                >
                    <h4 className="text-[10px] font-black tracking-[0.2em] text-[#94a3b8] uppercase">Biblioteca</h4>

                    {/* Category tabs — horizontal scroll, no clip */}
                    <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2">
                        {Object.keys(displayIcons).map(cat => {
                            const isActive = currentCat === cat;
                            return (
                                <motion.button
                                    key={cat}
                                    layout
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveIconCat(cat)}
                                    className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                        isActive
                                            ? 'bg-[#0F172A] border-[#0F172A] text-white shadow-md'
                                            : 'bg-white border-[#e2e8f0] text-[#64748b] hover:bg-slate-50 hover:text-slate-800'
                                    }`}
                                >
                                    {cat}
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Icon grid */}
                    <div className="relative">
                        <AnimatePresence>
                            {loadingIcons && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl"
                                >
                                    <span className="inline-block animate-spin h-6 w-6 border-2 border-[#0F172A] border-t-transparent rounded-full" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <motion.div 
                            layout
                            className="grid grid-cols-4 gap-2"
                        >
                            <AnimatePresence mode="popLayout">
                                {displayIcons[currentCat]?.map((url: string, idx: number) => (
                                    <motion.button
                                        key={url} // Using URL as key for unique identity
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onAddIcon(url)}
                                        className="aspect-square bg-white border border-[#f1f5f9] rounded-xl p-2 shadow-sm hover:shadow-md transition-all flex items-center justify-center group"
                                    >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={url}
                                                crossOrigin="anonymous"
                                                alt={`Icone ${idx}`}
                                                className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                                            />
                                    </motion.button>
                                ))}
                            </AnimatePresence>
                            
                            <motion.button 
                                layout
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                title="Em breve" 
                                className="aspect-square bg-white border-2 border-dashed border-[#e2e8f0] rounded-xl p-2 hover:border-[#94a3b8] transition-colors flex items-center justify-center group"
                            >
                                <Icons.Plus className="w-6 h-6 text-[#94a3b8] group-hover:text-[#0F172A] transition-colors" />
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            )}

        </div>
    );
};
