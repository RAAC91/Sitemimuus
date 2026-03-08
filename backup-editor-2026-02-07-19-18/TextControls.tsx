
import React, { useState, useEffect } from 'react';
import { EDITOR_COLORS, FONTS, EditorLayer, ICON_CATEGORY_FOLDERS } from './constants';
import { Icons } from './Icons';
import { fetchIconsFromFolder } from '@/services/api/imagekitService';
import { CollapsibleLayer } from './CollapsibleLayer';

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
    onNewTextChange
}) => {
    const [newText, setNewText] = useState('');
    const [dynamicIcons, setDynamicIcons] = useState<Record<string, string[]>>({});
    const [loadingIcons, setLoadingIcons] = useState(false);
    const [colorsExpanded, setColorsExpanded] = useState(false);

    // Carregar ícones dinamicamente do ImageKit ao montar o componente
    useEffect(() => {
        const loadDynamicIcons = async () => {
            setLoadingIcons(true);
            try {
                const loadedIcons: Record<string, string[]> = {};

                // Carregar ícones de cada categoria
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

    // Combinar ícones dinâmicos com fallback
    const displayIcons = Object.keys(dynamicIcons).length > 0 ? dynamicIcons : ICON_CATEGORIES;

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

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
            {/* ADD NEW TEXT SECTION */}
            <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Studio de Texto</h4>
                <div className="flex gap-2 group">
                    <input
                        type="text"
                        placeholder="Escreva algo brilhante..."
                        value={newText}
                        onChange={(e) => handleNewTextChange(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        className="flex-1 bg-slate-100/80 backdrop-blur-xl border-2 border-slate-200 rounded-[1.5rem] px-5 py-4 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-bold text-slate-800 transition-all shadow-sm placeholder:text-slate-400 hover:border-indigo-300"
                    />
                    <button
                        onClick={handleAdd}
                        className="bg-slate-900 text-white w-14 rounded-[1.2rem] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] hover:bg-black hover:scale-105 transition-all flex items-center justify-center active:scale-95 group-hover:shadow-[0_8px_25px_-4px_rgba(0,0,0,0.4)]"
                    >
                        <Icons.Plus className="w-6 h-6 stroke-[3]" />
                    </button>
                </div>
            </div>

            {/* LISTA DE TEXTOS COLAPSÁVEIS */}
            {textLayers.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Seus Textos ({textLayers.length})</h4>
                    {textLayers.map((layer, index) => (
                        <CollapsibleLayer
                            key={layer.id}
                            isOpen={expandedLayerId === layer.id}
                            onToggle={() => onExpandLayer(expandedLayerId === layer.id ? null : layer.id)}
                            title={layer.content || `Texto ${index + 1}`}
                            onTitleChange={(newVal) => onUpdateLayer(layer.id, { content: newVal })}
                            icon={<Icons.Type className="w-4 h-4" />}
                            onDelete={() => onDeleteLayer(layer.id)}
                        >
                            {/* CONTROLES DO TEXTO */}
                            <div className="space-y-4">


                                {/* Editar Conteúdo */}
                                <div>
                                    <label className="text-xs font-bold text-slate-600 mb-2 block">Conteúdo</label>
                                    <input
                                        type="text"
                                        value={layer.content}
                                        onChange={(e) => onUpdateLayer(layer.id, { content: e.target.value })}
                                        className="w-full bg-slate-100/50 border-2 border-slate-200 rounded-[1rem] px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white outline-none font-bold text-slate-700 transition-all placeholder:text-slate-400 hover:border-indigo-200"
                                    />
                                </div>

                                {/* Tamanho */}
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="font-bold text-slate-600 uppercase tracking-tight text-[10px]">Tamanho</span>
                                        <span className="text-indigo-600 font-black">{layer.size}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10"
                                        max="1000"
                                        value={layer.size}
                                        onChange={(e) => onUpdateLayer(layer.id, { size: Number(e.target.value) })}
                                        className="w-full"
                                    />
                                </div>

                                {/* Rotação */}
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="font-bold text-slate-600 uppercase tracking-tight text-[10px]">Rotação</span>
                                        <span className="text-indigo-600 font-black">{layer.rotation || 0}°</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="-180"
                                        max="180"
                                        value={layer.rotation || 0}
                                        onChange={(e) => onUpdateLayer(layer.id, { rotation: Number(e.target.value) })}
                                        className="w-full"
                                    />
                                </div>

                                {/* Fonte */}
                                <div>
                                    <label className="text-xs font-bold text-slate-600 mb-2 block">Fonte</label>
                                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                                        {FONTS.map((f) => (
                                            <button
                                                key={f.name}
                                                onClick={() => onUpdateLayer(layer.id, { font: f.family })}
                                                style={{ fontFamily: f.family }}
                                                className={`p-2 text-sm rounded-xl border transition-all ${layer.font === f.family
                                                    ? 'border-indigo-600 bg-white text-indigo-600 shadow-sm'
                                                    : 'border-transparent bg-white/50 text-slate-600 hover:border-indigo-100'
                                                    }`}
                                            >
                                                {f.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Estilo */}
                                <div>
                                    <label className="text-xs font-bold text-slate-600 mb-2 block">Estilo</label>
                                    <div className="flex gap-2">
                                        {/* Underline */}
                                        <button
                                            onClick={() => onUpdateLayer(layer.id, { underline: !layer.underline })}
                                            className={`flex-1 p-2 rounded-xl border transition-all flex items-center justify-center ${layer.underline
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'bg-white/50 text-slate-600 hover:bg-white border-transparent'
                                                }`}
                                            title="Sublinhado"
                                        >
                                            <Icons.Underline className="w-4 h-4" />
                                        </button>

                                        {/* Italic */}
                                        <button
                                            onClick={() => onUpdateLayer(layer.id, { italic: !layer.italic })}
                                            className={`flex-1 p-2 rounded-xl border transition-all flex items-center justify-center ${layer.italic
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'bg-white/50 text-slate-600 hover:bg-white border-transparent'
                                                }`}
                                            title="Itálico"
                                        >
                                            <Icons.Italic className="w-4 h-4" />
                                        </button>

                                        {/* Stroke / Outline */}
                                        <button
                                            onClick={() => onUpdateLayer(layer.id, { stroke: !layer.stroke })}
                                            className={`flex-1 p-2 rounded-xl border transition-all flex items-center justify-center ${layer.stroke
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'bg-white/50 text-slate-600 hover:bg-white border-transparent'
                                                }`}
                                            title="Contorno (Stroke)"
                                        >
                                            <Icons.Bold className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Cor */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs font-bold text-slate-600">Cor</label>
                                        <button
                                            onClick={() => setColorsExpanded(!colorsExpanded)}
                                            className="text-indigo-600 hover:text-indigo-700 font-bold text-[10px]"
                                        >
                                            {colorsExpanded ? 'Menos ▲' : 'Mais ▼'}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-7 gap-2">
                                        {EDITOR_COLORS.slice(0, colorsExpanded ? EDITOR_COLORS.length : 7).map((c) => (
                                            <button
                                                key={c.name}
                                                onClick={() => onUpdateLayer(layer.id, { color: c.valor })}
                                                className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ring-1 ring-slate-200 ${layer.color === c.valor
                                                    ? 'border-indigo-600 scale-110 shadow-lg ring-2 ring-indigo-100'
                                                    : 'border-white shadow-sm'
                                                    }`}
                                                style={(c as any).style || { backgroundColor: c.valor }}
                                                title={c.name}
                                            ></button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CollapsibleLayer>
                    ))}
                </div>
            )}

            {/* ÍCONES COLAPSÁVEIS */}
            <div className="space-y-4 pt-6 mt-6 border-t border-white/20">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Biblioteca de Ícones</h4>

                <div className="space-y-3">
                    {loadingIcons && (
                        <div className="text-center py-6 bg-white/30 rounded-2xl border border-white/20">
                            <span className="inline-block animate-spin h-5 w-5 border-3 border-[#00FF00] border-t-white rounded-full"></span>
                        </div>
                    )}
                    {Object.entries(displayIcons).map(([cat, icons]) => (
                        <div key={cat} className="rounded-2xl overflow-hidden glass-panel border-white/30">
                            <button
                                onClick={() => setActiveIconCat(activeIconCat === cat ? '' : cat)}
                                className={`w-full px-5 py-4 flex items-center justify-between transition-all ${activeIconCat === cat ? 'bg-black text-white shadow-xl' : 'hover:bg-white/40 text-gray-700'
                                    }`}
                            >
                                <span className="text-[11px] font-black uppercase tracking-widest">{cat}</span>
                                <Icons.ChevronDown
                                    className={`w-4 h-4 transition-transform duration-300 ${activeIconCat === cat ? 'rotate-180 text-[#00FF00]' : ''}`}
                                />
                            </button>

                            {activeIconCat === cat && (
                                <div className="p-4 grid grid-cols-4 gap-3 bg-white/20">
                                    {(icons as string[]).map((url: string, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => onAddIcon(url)}
                                            className="aspect-square bg-white rounded-xl p-2 hover:bg-[#00FF00]/10 hover:ring-2 ring-[#00FF00] transition-all shadow-sm flex items-center justify-center group"
                                        >
                                            <img src={url} alt="icon" className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};
