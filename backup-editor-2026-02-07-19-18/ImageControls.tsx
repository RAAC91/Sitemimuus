
import React from 'react';
import { Icons } from './Icons';
import { EditorLayer } from './constants';
import { CollapsibleLayer } from './CollapsibleLayer';

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
}

export const ImageControls: React.FC<ImageControlsProps> = ({
    layers,
    expandedLayerId,
    onExpandLayer,
    onUpdateLayer,
    onAddImage,
    onDeleteLayer,
    isBusy,
    aiPrompt,
    setAiPrompt,
    isAiLoading,
    handleAiGenerate,
    handleAiBackgroundRemoval,
    handleUpload
}) => {
    const imageLayers = layers.filter(l => l.type === 'image' || l.type === 'icon');

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
            {/* UPLOAD IMAGE SECTION */}
            <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Importar Imagem</h4>
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-indigo-400 bg-white/40 rounded-[2rem] cursor-pointer hover:scale-[1.02] transition-all group relative overflow-hidden shadow-inner">
                    <div className="w-12 h-12 rounded-2xl shadow-sm border border-white/50 flex items-center justify-center bg-[#00FF00] text-black transform transition mb-3 group-hover:scale-110 duration-500">
                        <Icons.Upload className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Arraste ou clique aqui</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                </label>
            </div>

            {/* AI GENERATOR SECTION */}
            <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Criação Instantânea</h4>
                <div className="glass-panel p-5 rounded-[2rem] border-white/40 bg-white/40 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <p className="text-[10px] uppercase font-black text-indigo-500 mb-3 flex items-center gap-2">
                        <Icons.Sparkles className="w-3 h-3" />
                        Imaginação Artificial
                    </p>
                    <textarea
                        className="w-full bg-white border border-white/50 rounded-2xl p-4 text-xs mb-4 focus:ring-2 focus:ring-indigo-300 resize-none h-24 text-gray-900 shadow-sm transition-all placeholder:text-gray-300 font-bold"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Ex: Um astronauta de grafite pilotando um skate voador..."
                    />
                    <button
                        onClick={handleAiGenerate}
                        disabled={isAiLoading || !aiPrompt.trim()}
                        className="w-full bg-black text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-800 disabled:opacity-50 transition-all shadow-xl active:scale-95 group flex items-center justify-center gap-2 overflow-hidden"
                    >
                        {isAiLoading ? (
                            <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                        ) : (
                            <Icons.Zap className="w-4 h-4 text-[#00FF00] group-hover:rotate-12 transition-transform" />
                        )}
                        {isAiLoading ? 'Desenhando...' : 'Gerar sticker agora'}
                    </button>
                </div>
            </div>

            {/* LISTA DE IMAGENS COLAPSÁVEIS */}
            {imageLayers.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Suas Imagens ({imageLayers.length})</h4>
                    {imageLayers.map((layer, index) => (
                        <CollapsibleLayer
                            key={layer.id}
                            isOpen={expandedLayerId === layer.id}
                            onToggle={() => onExpandLayer(expandedLayerId === layer.id ? null : layer.id)}
                            title={`Imagem ${index + 1}`}
                            icon={
                                <img
                                    src={layer.content}
                                    alt=""
                                    className="w-full h-full object-cover rounded"
                                />
                            }
                            onDelete={() => onDeleteLayer(layer.id)}
                        >
                            {/* CONTROLES DA IMAGEM */}
                            <div className="space-y-4">


                                {/* Preview */}
                                <div className="w-full h-32 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                                    <img
                                        src={layer.content}
                                        alt="Preview"
                                        className="max-w-full max-h-full object-contain"
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
                                        <span className="font-bold text-slate-600 uppercase tracking-tight text-[10px]">Giro Mágico</span>
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



                                {/* REMOVER FUNDO */}
                                <div className="pt-2">
                                    <button
                                        onClick={() => handleAiBackgroundRemoval(layer.id)}
                                        disabled={isBusy}
                                        className={`w-full px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md group ${layer.isBgClean
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 hover:shadow-lg'
                                            }`}
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            {layer.isBgClean ? '✨ Fundo Removido' : '🪄 Remover Fundo por IA'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </CollapsibleLayer>
                    ))}
                </div>
            )}
        </div>
    );
};
