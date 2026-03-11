import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ENGINE_CONFIG, SKUS, EditorLayer } from './constants';

interface MobileBottlePreviewProps {
    sku: string;
    lidColor?: string;
    layers: EditorLayer[];
    selectedLayerId: string | null;
    isBusy: boolean;
    onSelectLayer: (id: string | null) => void;
    onUpdateLayer: (id: string, updates: Partial<EditorLayer>) => void;
    draftText?: string;
    draftTextPosition?: { x: number; y: number };
}

const BASE_HEIGHT = 484; // The native engine layout height assumption

export const MobileBottlePreview: React.FC<MobileBottlePreviewProps> = ({
    sku,
    lidColor,
    layers,
    selectedLayerId,
    isBusy,
    onSelectLayer,
    onUpdateLayer,
    draftText,
    draftTextPosition
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const renderScaleRef = useRef(1);
    const [responsiveScale, setResponsiveScale] = useState(1);
    const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);

    // --- DEBUG HUD STATE ---
    const [showDebug, setShowDebug] = useState(false);
    const [debugMaskColor, setDebugMaskColor] = useState('rgba(255, 0, 0, 0.4)');
    
    const handleLogPositions = () => {
        const logData = layers.map(l => `ID: ${l.id} | Type: ${l.type} | X: ${l.x.toFixed(2)}% | Y: ${l.y.toFixed(2)}% | Rot: ${l.rotation}° | Scale: ${l.size}%`);
        const message = `--- LAYER POSITIONS ---\n` + logData.join('\n');
        console.log(message);
        alert('Posições atuais copiadas para o Console!\n\n' + message);
    };

    /**
     * Compute scale so the bottle bounding box fits nicely on mobile.
     */
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                // Determine scale based on container height vs base layout
                const rect = entry.contentRect;
                const baseScale = rect.height / BASE_HEIGHT;
                
                // Keep some padding for UI
                const finalScale = baseScale * 0.95;
                setResponsiveScale(finalScale);
                renderScaleRef.current = finalScale;
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const handleContainerTouchStart = () => {
        onSelectLayer(null);
    };

    const handleLayerTouchStart = (e: React.TouchEvent, layerId: string) => {
        e.stopPropagation();
        onSelectLayer(layerId);
        setDraggingLayerId(layerId);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!draggingLayerId) return;
        const touch = e.touches[0];
        
        // Find layer position in percentage using screen coordinates mapped to the engine layout
        // Mobile simple dragging calculation
        const engineContainer = document.getElementById('mobile-engine-container')?.getBoundingClientRect();
        if (engineContainer) {
            // Find relative raw pixels from engine top-left
            const rawX = touch.clientX - engineContainer.left;
            const rawY = touch.clientY - engineContainer.top;
            
            // Map to the 0-100% percentage system used in the designer
            let xPct = (rawX / engineContainer.width) * 100;
            let yPct = (rawY / engineContainer.height) * 100;
            
            xPct = Math.max(0, Math.min(100, xPct));
            yPct = Math.max(0, Math.min(100, yPct));
            
            onUpdateLayer(draggingLayerId, { x: xPct, y: yPct });
        }
    };

    const handleTouchEnd = () => {
        setDraggingLayerId(null);
    };

    return (
        <div 
            ref={containerRef}
            className="w-full h-full relative flex items-center justify-center overflow-hidden bg-transparent"
            onTouchStart={handleContainerTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* DEBUG HUD PORTAL OR FALLBACK */}
            {typeof document !== 'undefined' && document.getElementById('debug-container-mobile') ? createPortal(
                <div className="w-full bg-slate-50 border-t border-slate-200 p-4 flex flex-col gap-3 text-sm pointer-events-auto shadow-[inset_0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setShowDebug(!showDebug); }}
                        className="bg-black text-white px-4 py-3 rounded-xl text-xs font-bold w-full transition-colors focus:outline-none focus:ring-2 focus:ring-black/50"
                    >
                        {showDebug ? 'Ocultar Debug da Matriz' : '🛠 Mostrar Debug da Matriz'}
                    </button>
                    {showDebug && (
                        <div className="flex flex-col gap-3 mt-1">
                            <h3 className="font-bold text-gray-800 border-b pb-2">Ferramentas de Debug</h3>
                            
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-600">Cor da Máscara:</label>
                                <input 
                                    type="text" 
                                    value={debugMaskColor}
                                    onChange={(e) => setDebugMaskColor(e.target.value)}
                                    className="border rounded px-2 py-2 text-xs w-full font-mono bg-white text-black"
                                />
                            </div>

                            <div className="bg-blue-50 text-blue-800 p-2 rounded text-xs leading-relaxed">
                                Arraste os textos/imagens para a posição correta. Reposicionado abaixo dos ajustes para não cobrir a garrafa.
                            </div>

                            <button 
                                onClick={handleLogPositions}
                                className="bg-green-600 active:bg-green-700 text-white font-bold py-3 px-3 rounded-xl text-xs transition-colors shadow-sm"
                            >
                                📋 Gravar Posições Originais
                            </button>
                        </div>
                    )}
                </div>,
                document.getElementById('debug-container-mobile')!
            ) : (
                /* Fallback caso falhe ao achar o portal - Mantém o floating original */
                <>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setShowDebug(!showDebug); }}
                        className="absolute top-4 right-4 z-[9999] bg-black/50 hover:bg-black text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm transition-colors pointer-events-auto"
                    >
                        {showDebug ? 'Ocultar Debug' : '🛠 Debug Matriz'}
                    </button>

                    {showDebug && (
                        <div 
                            className="absolute top-14 right-4 z-[9999] bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-gray-200 w-64 flex flex-col gap-3 text-sm pointer-events-auto"
                            onTouchStart={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="font-bold text-gray-800 border-b pb-2">Ferramentas de Debug</h3>
                            
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-600">Cor da Máscara:</label>
                                <input 
                                    type="text" 
                                    value={debugMaskColor}
                                    onChange={(e) => setDebugMaskColor(e.target.value)}
                                    className="border rounded px-2 py-1 text-xs w-full font-mono bg-gray-50 text-black"
                                />
                            </div>

                            <div className="bg-blue-50 text-blue-800 p-2 rounded text-xs leading-relaxed">
                                Arraste os textos/imagens para a posição correta.
                            </div>

                            <button 
                                onClick={handleLogPositions}
                                className="bg-green-600 active:bg-green-700 text-white font-bold py-2 px-3 rounded text-xs transition-colors shadow-sm"
                            >
                                📋 Gravar Posições Originais
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* The Scaled World */}
            <div 
                className="relative flex items-center justify-center border-2 border-red-500/50"
                style={{
                    width: `${BASE_HEIGHT * (ENGINE_CONFIG.hdWidth / ENGINE_CONFIG.hdHeight)}px`,
                    height: `${BASE_HEIGHT}px`,
                    transform: `scale(${responsiveScale})`,
                    transformOrigin: 'center center',
                    willChange: 'transform'
                }}
            >
                {/* DEBUG LABEL */}
                <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] px-1 z-50 pointer-events-none">BASE WORLD</div>
                {/* 1. Mockup Image */}
                <img
                    src={SKUS[sku] ? SKUS[sku].mockup : ''}
                    className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none z-10"
                    crossOrigin="anonymous"
                    alt="Bottle Mockup"
                    draggable={false}
                />

                {/* 2. Lid Color Overlay */}
                {lidColor && (
                    <div 
                        className="absolute inset-0 z-11 pointer-events-none"
                        style={{
                            backgroundColor: lidColor,
                            WebkitMaskImage: `url(${SKUS[sku]?.mockup})`,
                            maskImage: `url(${SKUS[sku]?.mockup})`,
                            WebkitMaskSize: 'contain',
                            maskSize: 'contain',
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                            maskPosition: 'center',
                            clipPath: 'inset(0 0 88% 0)',
                            mixBlendMode: lidColor === '#ffffff' ? 'screen' : 'multiply',
                            opacity: lidColor === '#000000' ? 0 : 0.85
                        }}
                    />
                )}

                {/* 3. The Print Mask */}
                <div
                    className="absolute inset-0 z-20 border-2 border-blue-500/50"
                    style={{
                        WebkitMaskImage: ENGINE_CONFIG.maskUrl,
                        maskImage: ENGINE_CONFIG.maskUrl,
                        WebkitMaskSize: 'contain',
                        maskSize: 'contain',
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                        maskPosition: 'center',
                        pointerEvents: 'none',
                    }}
                >
                    {showDebug && (
                        <div 
                            className="absolute inset-0 pointer-events-none mix-blend-multiply"
                            style={{ backgroundColor: debugMaskColor }}
                        />
                    )}
                    <div className="w-full h-full relative pointer-events-auto">
                        <div className="absolute top-4 left-0 bg-blue-500 text-white text-[10px] px-1 z-50 pointer-events-none">MASK CONTAINER</div>
                        {/* HD Engine Translation Context */}
                        <div
                            className="absolute left-0 top-0 border-2 border-green-500/50"
                            style={{
                                transform: ENGINE_CONFIG.matrix3d,
                                transformOrigin: '0px 0px',
                                width: `${BASE_HEIGHT * (ENGINE_CONFIG.hdWidth / ENGINE_CONFIG.hdHeight)}px`,
                                height: `${BASE_HEIGHT}px`,
                            }}
                        >
                            <div className="absolute top-8 left-0 bg-green-500 text-white text-[10px] px-1 z-50 pointer-events-none">TRANSLATION X/Y</div>
                            
                            <div
                                id="mobile-engine-container"
                                className="absolute border-2 border-yellow-500/50"
                                style={{
                                    width: ENGINE_CONFIG.hdWidth,
                                    height: ENGINE_CONFIG.hdHeight,
                                    transform: `scale(${ENGINE_CONFIG.displayScale})`,
                                    transformOrigin: 'left top',
                                    willChange: 'transform',
                                }}
                            >
                                <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] px-1 z-50 pointer-events-none">ENGINE ({ENGINE_CONFIG.hdWidth}x{ENGINE_CONFIG.hdHeight})</div>
                                <div className="absolute w-full h-[1px] bg-yellow-500/30 top-1/2 left-0 pointer-events-none z-0"></div>
                                <div className="absolute h-full w-[1px] bg-yellow-500/30 left-1/2 top-0 pointer-events-none z-0"></div>
                                
                                {/* LABELS FOR DEBUGGING */}
                                {showDebug && (
                                    <>
                                        {/* X Axis */}
                                        <div className="absolute top-0 bottom-0 left-1/2 w-[8px] -ml-[4px] bg-red-500/50 z-0 pointer-events-none" />
                                        {/* Y Axis */}
                                        <div className="absolute left-0 right-0 top-1/2 h-[8px] -mt-[4px] bg-red-500/50 z-0 pointer-events-none" />
                                        {/* Labels */}
                                        <div className="absolute top-4 left-4 text-red-500 text-[120px] font-bold z-0 pointer-events-none">0,0</div>
                                        <div className="absolute bottom-4 right-4 text-red-500 text-[120px] font-bold z-0 pointer-events-none">100,100</div>
                                    </>
                                )}

                                {layers.map((layer) => {
                                    if (!layer.visible) return null;
                                    const isSelected = selectedLayerId === layer.id;

                                    if (layer.type === 'text') {
                                        return (
                                            <div
                                                key={layer.id}
                                                onTouchStart={(e) => handleLayerTouchStart(e, layer.id)}
                                                onClick={(e) => e.stopPropagation()}
                                                style={{
                                                    position: 'absolute',
                                                    left: `${layer.x}%`,
                                                    top: `${layer.y}%`,
                                                    transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
                                                    transformOrigin: 'center center',
                                                    zIndex: isSelected ? 150 : 100,
                                                    pointerEvents: 'auto',
                                                    border: '2px solid transparent',
                                                    backgroundColor: 'transparent',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontFamily: layer.font,
                                                        fontSize: `${(['Great Vibes', 'Loverine-otf'].includes(layer.font || '') ? 280 : 180) * (layer.size / 100)}px`,
                                                        whiteSpace: 'nowrap',
                                                        color: layer.color || '#000000',
                                                        WebkitTextStroke: layer.stroke ? `12px ${layer.color === '#FFFFFF' ? '#000000' : '#FFFFFF'}` : '0px',
                                                        textShadow: layer.glow ? `0 0 40px ${layer.color}` : 'none',
                                                        opacity: layer.opacity ?? 1,
                                                        fontStyle: layer.italic ? 'italic' : 'normal',
                                                        textDecoration: layer.underline ? 'underline' : 'none',
                                                    }}
                                                >
                                                    {layer.content}
                                                </span>
                                                {/* Contorno para indicar seleção */}
                                                {isSelected && (
                                                    <div className="absolute inset-[-10px] border-4 border-dashed border-[#00FF00] rounded-xl pointer-events-none animate-pulse opacity-50 shadow-[0_0_20px_rgba(0,255,0,0.3)]"></div>
                                                )}
                                            </div>
                                        );
                                    }

                                    if (layer.type === 'image' || layer.type === 'icon') {
                                        return (
                                            <div
                                                key={layer.id}
                                                onTouchStart={(e) => handleLayerTouchStart(e, layer.id)}
                                                onClick={(e) => e.stopPropagation()}
                                                style={{
                                                    position: 'absolute',
                                                    left: `${layer.x}%`,
                                                    top: `${layer.y}%`,
                                                    transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
                                                    transformOrigin: 'center center',
                                                    zIndex: isSelected ? 150 : 100,
                                                    pointerEvents: 'auto',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: layer.type === 'image' ? `${800 * (layer.size / 100)}px` : `${400 * (layer.size / 100)}px`,
                                                        height: layer.type === 'image' ? `${800 * (layer.size / 100)}px` : `${400 * (layer.size / 100)}px`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    {layer.content && (
                                                        <img
                                                            src={layer.content}
                                                            crossOrigin="anonymous"
                                                            className="w-full h-full"
                                                            style={{
                                                                objectFit: layer.mode === 'tile' ? 'cover' : 'contain',
                                                                opacity: layer.opacity ?? 1,
                                                                transform: `scaleX(${layer.scaleX || 1}) scaleY(${layer.scaleY || 1})`,
                                                                mixBlendMode: layer.isBgClean ? 'multiply' : 'normal',
                                                                filter: layer.color ? `drop-shadow(0 0 10px ${layer.color})` : 'none',
                                                                pointerEvents: 'none'
                                                            }}
                                                            alt="Layer"
                                                            draggable={false}
                                                        />
                                                    )}
                                                </div>
                                                {isSelected && (
                                                    <div className="absolute inset-[-10px] border-4 border-dashed border-[#00FF00] rounded-xl pointer-events-none animate-pulse opacity-50 shadow-[0_0_20px_rgba(0,255,0,0.3)]"></div>
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                })}

                                {/* Draft text em tempo real */}
                                {draftText && draftTextPosition && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: `${draftTextPosition.x}%`,
                                            top: `${draftTextPosition.y}%`,
                                            transform: `translate(-50%, -50%)`,
                                            zIndex: 200,
                                            pointerEvents: 'none',
                                            padding: '8px',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: 'var(--font-marvel)',
                                                fontSize: `180px`,
                                                whiteSpace: 'nowrap',
                                                color: '#000000',
                                                opacity: 0.5,
                                            }}
                                        >
                                            {draftText}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
