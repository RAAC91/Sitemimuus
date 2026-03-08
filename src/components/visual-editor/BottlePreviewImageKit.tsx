"use client";

import React, { useState, useMemo } from 'react';
import { EditorLayer } from './constants';
import { Icons } from './Icons';
import { getHydraProductionUrl } from '@/lib/hydra-engine';

interface BottlePreviewImageKitProps {
    sku: string;
    layers: EditorLayer[];
    selectedLayerId: string | null;
    onUndo: () => void;
    onRedo: () => void;
    onReset: () => void;
    canUndo: boolean;
    canRedo: boolean;
    zoom?: number;
    hideCanvasBackground?: boolean;
    hideUI?: boolean;
}

export const BottlePreviewImageKit: React.FC<BottlePreviewImageKitProps> = ({
    sku,
    layers,
    onUndo,
    onRedo,
    onReset,
    canUndo,
    canRedo,
    zoom: zoomProp,
    hideCanvasBackground = false,
    hideUI = false
}) => {
    const [zoomLevel, setZoomLevel] = useState(1.1);
    const [transformOrigin, setTransformOrigin] = useState('50% 50%');
    const [isInspectMode, setIsInspectMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isZoomed = (zoomProp || zoomLevel) > 1.1;

    // Gerar URL do ImageKit sempre que sku ou layers mudarem
    const hydraUrl = useMemo(() => {
        return getHydraProductionUrl(sku, layers);
    }, [sku, layers]);

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 4));
    const handleZoomOut = () => {
        const next = Math.max(zoomLevel - 0.5, 0.5);
        setZoomLevel(next);
        if (next <= 1.1) setTransformOrigin('50% 50%');
    };
    const handleZoomReset = () => {
        setZoomLevel(1.1);
        setTransformOrigin('50% 50%');
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isInspectMode && isZoomed) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setTransformOrigin(`${x}% ${y}%`);
        }
    };

    const handleClick = () => {
        if (isZoomed) {
            handleZoomReset();
            setIsInspectMode(false);
        }
    };

    return (
        <div className="relative h-full flex flex-col">
            {/* Zoom Controls - Bottom Left */}
            {!hideUI && (
                <div data-html2canvas-ignore className="absolute bottom-8 left-8 z-40 flex gap-1 p-1 bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl">
                    <button
                        onClick={handleZoomOut}
                        disabled={zoomLevel <= 0.5}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-white hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90 text-gray-500"
                        title="Zoom Out"
                    >
                        <Icons.Minus className="w-5 h-5" />
                    </button>
                    <div className="px-4 flex items-center justify-center min-w-[70px]">
                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none">
                            {Math.round(zoomLevel * 100)}%
                        </span>
                    </div>
                    <button
                        onClick={handleZoomIn}
                        disabled={zoomLevel >= 4}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-white hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90 text-gray-500"
                        title="Zoom In"
                    >
                        <Icons.Plus className="w-5 h-5" />
                    </button>
                </div>
            )}

            <div className="flex-1 relative w-full h-full bg-[#F8FAFC] rounded-[4rem] shadow-inner flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1.5px,transparent_1.5px)] bg-size-[40px_40px] opacity-40 pointer-events-none"></div>

                {!hideUI && (
                    <div data-html2canvas-ignore className="absolute top-8 right-8 z-40 flex flex-col gap-3">
                        <button 
                            onClick={onReset} 
                            disabled={layers.length === 0} 
                            className="w-12 h-12 glass-panel border-white/40 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-white hover:scale-110 disabled:opacity-40 disabled:hover:scale-100 transition-all shadow-xl rounded-2xl" 
                            title="Limpar Tudo"
                        >
                            <Icons.Trash className="w-5 h-5" />
                        </button>
                        <div className="w-12 h-[2px] bg-white/30 my-1 mx-auto rounded-full"></div>
                        <button
                            onClick={() => {
                                if (isInspectMode || isZoomed) {
                                    handleZoomReset();
                                    setIsInspectMode(false);
                                } else {
                                    setIsInspectMode(true);
                                    setZoomLevel(2.5);
                                    setTransformOrigin('50% 50%');
                                }
                            }}
                            className={`w-12 h-12 glass-panel border-white/40 flex items-center justify-center transition-all shadow-xl rounded-2xl ${isInspectMode || isZoomed ? 'bg-black text-[#00FF00] scale-110' : 'text-gray-400 hover:text-black hover:bg-white'}`}
                            title="Modo de Inspeção (Zoom)"
                        >
                            <Icons.Search className="w-5 h-5" />
                        </button>
                        <div className="w-12 h-[2px] bg-white/30 my-1 mx-auto rounded-full"></div>
                        <button 
                            onClick={onUndo} 
                            disabled={!canUndo} 
                            className="w-12 h-12 glass-panel border-white/40 flex items-center justify-center text-gray-400 hover:text-black hover:bg-white hover:scale-110 disabled:opacity-40 disabled:hover:scale-100 transition-all shadow-xl rounded-2xl" 
                            title="Desfazer"
                        >
                            <Icons.Undo className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={onRedo} 
                            disabled={!canRedo} 
                            className="w-12 h-12 glass-panel border-white/40 flex items-center justify-center text-gray-400 hover:text-black hover:bg-white hover:scale-110 disabled:opacity-40 disabled:hover:scale-100 transition-all shadow-xl rounded-2xl" 
                            title="Refazer"
                        >
                            <Icons.Redo className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <div
                    className={`relative w-full h-full max-h-full overflow-hidden flex items-center justify-center transition-colors duration-500 ${hideCanvasBackground ? 'bg-transparent' : 'bg-[#fcfcfc]'}`}
                    onMouseMove={handleMouseMove}
                    onClick={handleClick}
                    style={{
                        transform: `scale(${zoomProp || zoomLevel})`,
                        transformOrigin: transformOrigin,
                        transition: (zoomProp !== undefined) ? 'none' : 'transform 450ms cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: isInspectMode ? 'zoom-in' : (isZoomed ? 'zoom-out' : 'default')
                    }}
                >
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-50">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                        </div>
                    )}
                    
                    {/* Imagem do ImageKit gerada pela Hydra Engine */}
                    <img
                        src={hydraUrl}
                        alt="Preview da Garrafa"
                        className="h-full w-auto object-contain select-none"
                        crossOrigin="anonymous"
                        draggable={false}
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                            console.error('[BottlePreviewImageKit] Erro ao carregar imagem:', hydraUrl);
                            setIsLoading(false);
                        }}
                    />
                </div>
            </div>

            {!hideUI && (
                <p data-html2canvas-ignore className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-bold">
                    Dê zoom fora da área de edição para ver detalhes
                </p>
            )}
        </div>
    );
};
