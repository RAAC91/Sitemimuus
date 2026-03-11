
import React, { useRef, useState } from 'react';
import { ENGINE_CONFIG, SKUS, EditorLayer } from './constants';
import { Icons } from './Icons';

interface BottlePreviewProps {
    sku: string;
    lidColor?: string;
    layers: EditorLayer[];
    selectedLayerId: string | null;
    isBusy: boolean;
    onUndo: () => void;
    onRedo: () => void;
    onReset: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onSelectLayer: (id: string | null) => void;
    onUpdateLayer: (id: string, updates: Partial<EditorLayer>) => void;
    draftText?: string;
    draftTextPosition?: { x: number; y: number };
    zoom?: number;
    yOffset?: number;
    hideCanvasBackground?: boolean;
    hideUI?: boolean;
    // Capture Guide
    showCaptureGuide?: boolean;
    captureSettings?: { x: number; y: number; scale: number; width: number; height: number };
    // Color picker
    selectedSku?: string;
    onSelectSku?: (sku: string) => void;
}

export const BottlePreview: React.FC<BottlePreviewProps> = ({
    sku, lidColor, layers, selectedLayerId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onUndo: _onUndo, onRedo: _onRedo, onReset: _onReset, canUndo: _canUndo, canRedo: _canRedo,
    onSelectLayer, onUpdateLayer,
    draftText = "",
    draftTextPosition = { x: 50, y: 90 },
    zoom: zoomProp,
    yOffset = 0,
    hideCanvasBackground = false,
    hideUI = false,
    showCaptureGuide = false,
    captureSettings,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectedSku: _selectedSku,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSelectSku: _onSelectSku,
}) => {
    const bottleContainerRef = useRef<HTMLDivElement>(null);
    const [zoomLevel, setZoomLevel] = useState(1.1);
    const [transformOrigin, setTransformOrigin] = useState('50% 50%');
    const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);
    const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
    const [mouseDownStart, setMouseDownStart] = useState<{ x: number; y: number } | null>(null);
    const [resizingLayerId, setResizingLayerId] = useState<string | null>(null);
    const [rotatingLayerId, setRotatingLayerId] = useState<string | null>(null);
    const [isInspectMode, setIsInspectMode] = useState(false);

    // --- DEBUG HUD STATE ---
    const [showDebug, setShowDebug] = useState(false);
    const [debugMaskColor, setDebugMaskColor] = useState('rgba(255, 0, 0, 0.4)');
    
    const handleLogPositions = () => {
        const logData = layers.map(l => `ID: ${l.id} | Type: ${l.type} | X: ${l.x.toFixed(2)}% | Y: ${l.y.toFixed(2)}% | Rot: ${l.rotation}° | Scale: ${l.size}%`);
        const message = `--- LAYER POSITIONS ---\n` + logData.join('\n');
        console.log(message);
        alert('Posições atuais copiadas para o Console!\n\n' + message);
    };

    const isZoomed = (zoomProp || zoomLevel) > 1.1;

    const handleContainerMouseDown = (e: React.MouseEvent) => {
        setMouseDownStart({ x: e.clientX, y: e.clientY });
    };

    const handleZoomToggle = (e: React.MouseEvent) => {
        // Prevent zoom when interacting with layers or transforming
        if (draggingLayerId || resizingLayerId || rotatingLayerId) return;

        if (mouseDownStart) {
            const deltaX = Math.abs(e.clientX - mouseDownStart.x);
            const deltaY = Math.abs(e.clientY - mouseDownStart.y);
            if (deltaX > 7 || deltaY > 7) return;
        }

        if (isZoomed) {
             // Click to zoom out ONLY
             handleZoomReset();
             setIsInspectMode(false);
        }
        // Enabled only via Magnifying Glass button as per user request
    };

    const handleZoomReset = () => {
        setZoomLevel(1.1);
        setTransformOrigin('50% 50%');
    };

    const handleLayerMouseDown = (e: React.MouseEvent, layerId: string) => {
        e.preventDefault();
        e.stopPropagation(); // BLOQUEIA o evento de zoom da garrafa ao processar a camada

        if (!draggingLayerId) {
            onSelectLayer(layerId);
        }

        setDraggingLayerId(layerId);
        setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (resizingLayerId || rotatingLayerId) {
            handleTransformMove(e);
            return;
        }

        // NOVO: Seguir o mouse com o transformOrigin se estiver com zoom no modo inspeção
        if (isInspectMode && isZoomed && bottleContainerRef.current) {
            const rect = bottleContainerRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setTransformOrigin(`${x}% ${y}%`);
        }

        if (!draggingLayerId || !dragStart || !bottleContainerRef.current) return;

        const layer = layers.find(l => l.id === draggingLayerId);
        if (!layer) return;

        const rect = bottleContainerRef.current.getBoundingClientRect();
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        const percentX = (deltaX / rect.width) * 100;
        const percentY = (deltaY / rect.height) * 100;

        onUpdateLayer(draggingLayerId, {
            x: Math.max(0, Math.min(100, layer.x + percentX)),
            y: Math.max(0, layer.y + percentY)
        });

        setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setDraggingLayerId(null);
        setResizingLayerId(null);
        setRotatingLayerId(null);
        setDragStart(null);
    };

    // ── Touch handlers for mobile drag ──────────────────────────────────
    const handleLayerTouchStart = (e: React.TouchEvent, layerId: string) => {
        e.stopPropagation();
        const touch = e.touches[0];
        onSelectLayer(layerId);
        setDraggingLayerId(layerId);
        setDragStart({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!draggingLayerId || !dragStart || !bottleContainerRef.current) return;
        const touch = e.touches[0];
        const layer = layers.find(l => l.id === draggingLayerId);
        if (!layer) return;

        const rect = bottleContainerRef.current.getBoundingClientRect();
        const deltaX = touch.clientX - dragStart.x;
        const deltaY = touch.clientY - dragStart.y;

        const percentX = (deltaX / rect.width) * 100;
        const percentY = (deltaY / rect.height) * 100;

        onUpdateLayer(draggingLayerId, {
            x: Math.max(0, Math.min(100, layer.x + percentX)),
            y: Math.max(0, layer.y + percentY)
        });

        setDragStart({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchEnd = () => {
        setDraggingLayerId(null);
        setDragStart(null);
    };



    const handleTransformMove = (e: React.MouseEvent) => {
        if (resizingLayerId && dragStart) {
            const layer = layers.find(l => l.id === resizingLayerId);
            if (!layer) return;
            const deltaY = e.clientY - dragStart.y;
            const sizeChange = -deltaY * 2;
            onUpdateLayer(resizingLayerId, {
                size: Math.max(50, Math.min(2000, layer.size + sizeChange))
            });
            setDragStart({ x: e.clientX, y: e.clientY });
        }

        if (rotatingLayerId && dragStart && bottleContainerRef.current) {
            const layer = layers.find(l => l.id === rotatingLayerId);
            if (!layer) return;
            const rect = bottleContainerRef.current.getBoundingClientRect();
            const centerX = rect.left + (layer.x / 100) * rect.width;
            const centerY = rect.top + (layer.y / 100) * rect.height;
            const angle1 = Math.atan2(dragStart.y - centerY, dragStart.x - centerX);
            const angle2 = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            const deltaAngle = (angle2 - angle1) * (180 / Math.PI);
            onUpdateLayer(rotatingLayerId, {
                rotation: layer.rotation + deltaAngle
            });
            setDragStart({ x: e.clientX, y: e.clientY });
        }
    };

    // DYNAMIC SCALING FOR ZOOM INDEPENDENCE
    // A altura base de 484px vem da transformação do ImageKit na máscara (?tr=h-484).
    // Trabalhamos sempre nesse sistema de 484px de altura e largura proporcional ao hdWidth/hdHeight.
    // Depois, escalamos TANTO o mockup quanto o plano/máscara juntos com responsiveScale,
    // garantindo que o centro da máscara continue sendo o anchor point em qualquer monitor / resolução.
    const [responsiveScale, setResponsiveScale] = useState(1);
    const BASE_HEIGHT = 484;

    React.useLayoutEffect(() => {
        if (!bottleContainerRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { height } = entry.contentRect;
                if (height > 0) {
                    // Escala o sistema base (484px) para caber na altura disponível do container.
                    // Assim, mockup, máscara e plano 3D são escalados em conjunto.
                    setResponsiveScale(height / BASE_HEIGHT);
                }
            }
        });
        resizeObserver.observe(bottleContainerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    return (
        <div className="relative h-full flex flex-col">
            {/* DEBUG HUD TOGGLE */}
            {!hideUI && (
                <button 
                    onClick={() => setShowDebug(!showDebug)}
                    className="absolute top-4 right-4 z-[9999] bg-black/50 hover:bg-black text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm transition-colors"
                >
                    {showDebug ? 'Ocultar Debug' : '🛠 Debug Matriz'}
                </button>
            )}

            {/* DEBUG HUD PANEL */}
            {showDebug && !hideUI && (
                <div className="absolute top-14 right-4 z-[9999] bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-gray-200 w-64 flex flex-col gap-3 text-sm">
                    <h3 className="font-bold text-gray-800 border-b pb-2">Ferramentas de Debug</h3>
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600">Cor da Máscara (fundo):</label>
                        <input 
                            type="text" 
                            value={debugMaskColor}
                            onChange={(e) => setDebugMaskColor(e.target.value)}
                            className="border rounded px-2 py-1 text-xs w-full font-mono bg-gray-50"
                        />
                    </div>

                    <div className="bg-blue-50 text-blue-800 p-2 rounded text-xs leading-relaxed">
                        Arraste os textos/imagens para a posição correta na garrafa. As réguas vermelhas indicam o limite exato do canvas 2D mapeado em 3D.
                    </div>

                    <button 
                        onClick={handleLogPositions}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded text-xs transition-colors shadow-sm"
                    >
                        📋 Gravar Posições Originais (Log)
                    </button>
                </div>
            )}

            {/* Zoom Controls removed as per request */}

            <div className={`flex-1 relative w-full h-full flex items-center justify-center overflow-hidden group bottle-preview-container ${hideCanvasBackground ? '' : 'bg-[#F8FAFC] rounded-[4rem] shadow-inner'}`}>
                {!hideCanvasBackground && (
                    <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1.5px,transparent_1.5px)] bg-size-[40px_40px] opacity-40 pointer-events-none"></div>
                )}

                {/* Color picker moved above preview in BottleEditor */}

                {/* Zoom/Inspect button — bottom left of preview */}
                {!hideUI && (
                    <div data-html2canvas-ignore className="absolute bottom-6 left-6 z-40">
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
                            className={`w-11 h-11 glass-panel border-white/40 flex items-center justify-center transition-all shadow-xl rounded-2xl ${
                                isInspectMode || isZoomed
                                    ? 'bg-black text-[#00FF00] scale-110'
                                    : 'text-gray-400 hover:text-black hover:bg-white'
                            }`}
                            title="Modo de Inspeção (Zoom)"
                        >
                            <Icons.Search className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <div
                    ref={bottleContainerRef}
                    className={`relative w-full h-full max-h-full overflow-hidden bottle-only-capture flex items-center justify-center translate-x-0 transition-colors duration-500 ${hideCanvasBackground ? 'bg-transparent' : 'bg-[#fcfcfc]'}`}
                    onMouseDown={handleContainerMouseDown}
                    onClick={handleZoomToggle}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{
                        transform: `scale(${zoomProp || zoomLevel}) translateY(${yOffset}px)`,
                        transformOrigin: transformOrigin,
                        transition: (zoomProp !== undefined) ? 'none' : 'transform 450ms cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: isInspectMode ? 'zoom-in' : (isZoomed ? 'zoom-out' : 'default')
                    }}
                >
                    {/* Bottle Wrapper - sistema base em px + escala responsiva compartilhada */}
                    <div
                        className="relative flex items-center justify-center"
                        style={{
                            width: `${BASE_HEIGHT * (ENGINE_CONFIG.hdWidth / ENGINE_CONFIG.hdHeight)}px`,
                            height: `${BASE_HEIGHT}px`,
                            transform: `scale(${responsiveScale})`,
                            transformOrigin: 'center center',
                            willChange: 'transform',
                        }}
                    >
                        {/* 1. Mockup Image (define o layout visual da garrafa) */}
                        <img
                            src={SKUS[sku] ? SKUS[sku].mockup : ''}
                            className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none z-10"
                            crossOrigin="anonymous"
                            alt="Bottle Mockup"
                            draggable={false}
                        />

                        {/* lid color overlay (visual representation of lid choice) */}
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
                                    clipPath: 'inset(0 0 88% 0)', // Focus only on the top lid part (approx 12%)
                                    mixBlendMode: lidColor === '#ffffff' ? 'screen' : 'multiply',
                                    opacity: lidColor === '#000000' ? 0 : 0.85
                                }}
                            />
                        )}

                        {/* 2. Máscara + conteúdo – compartilham exatamente o mesmo retângulo do mockup */}
                        <div
                            className="absolute inset-0 z-20"
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
                            <div
                                className="w-full h-full"
                                style={{
                                    pointerEvents: 'auto',
                                    cursor: isInspectMode ? 'inherit' : 'auto',
                                    position: 'relative',
                                }}
                            >
                                {/* Plano HD com matrix3d – coordenadas fixas, escaladas junto com o mockup */}
                                <div
                                    className="absolute left-0 top-0"
                                    style={{
                                        transform: ENGINE_CONFIG.matrix3d,
                                        transformOrigin: '0px 0px',
                                        width: `${BASE_HEIGHT * (ENGINE_CONFIG.hdWidth / ENGINE_CONFIG.hdHeight)}px`,
                                        height: `${BASE_HEIGHT}px`,
                                    }}
                                >
                                    <div
                                        className="absolute"
                                        style={{
                                            width: ENGINE_CONFIG.hdWidth,
                                            height: ENGINE_CONFIG.hdHeight,
                                            transform: `scale(${ENGINE_CONFIG.displayScale})`,
                                            transformOrigin: 'left top',
                                            willChange: 'transform',
                                            ...(showDebug ? { border: '4px solid red' } : {})
                                        }}
                                    >
                                        {/* RULERS FOR DEBUGGING */}
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
                                                        onMouseDown={(e) => handleLayerMouseDown(e, layer.id)}
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
                                                            cursor: draggingLayerId === layer.id ? 'grabbing' : 'grab',
                                                            padding: '8px',
                                                            border: '2px solid transparent',
                                                            borderRadius: '4px',
                                                            backgroundColor: 'transparent',
                                                            transition: draggingLayerId === layer.id ? 'none' : 'all 0.15s ease',
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontFamily: layer.font,
                                                                fontSize: `${(['Great Vibes', 'Loverine-otf'].includes(layer.font || '') ? 280 : 180) * (layer.size / 100)}px`,
                                                                whiteSpace: 'nowrap',
                                                                display: 'block',
                                                                letterSpacing: '-0.02em',
                                                                pointerEvents: 'none',
                                                                userSelect: 'none',
                                                                ...(layer.color === '#C0C0C0'
                                                                    ? {
                                                                          background:
                                                                              'linear-gradient(135deg, #a1a1a1 0%, #ffffff 50%, #a1a1a1 100%)',
                                                                          WebkitBackgroundClip: 'text',
                                                                          WebkitTextFillColor: 'transparent',
                                                                      }
                                                                    : layer.color === '#D4AF37'
                                                                    ? {
                                                                          background:
                                                                              'linear-gradient(135deg, #b8860b 0%, #ffd700 50%, #b8860b 100%)',
                                                                          WebkitBackgroundClip: 'text',
                                                                          WebkitTextFillColor: 'transparent',
                                                                      }
                                                                    : layer.color === '#E0B0FF'
                                                                    ? {
                                                                          background:
                                                                              'linear-gradient(135deg, #ff99cc 0%, #ffffff 50%, #ff99cc 100%)',
                                                                          WebkitBackgroundClip: 'text',
                                                                          WebkitTextFillColor: 'transparent',
                                                                      }
                                                                    : { color: layer.color === 'white' ? 'white' : layer.color }),
                                                                WebkitTextStroke: layer.stroke
                                                                    ? `1px ${
                                                                          layer.color === 'black' || layer.color === '#000000'
                                                                              ? 'white'
                                                                              : 'black'
                                                                      }`
                                                                    : 'none',
                                                                textShadow: layer.glow
                                                                    ? `0 0 30px ${
                                                                          layer.color === 'white'
                                                                              ? 'rgba(255,255,255,0.3)'
                                                                              : 'white'
                                                                      }`
                                                                    : 'none',
                                                                fontStyle: layer.italic ? 'italic' : 'normal',
                                                                textDecoration: layer.underline ? 'underline' : 'none',
                                                            }}
                                                        >
                                                            {layer.font === 'Loverine-otf' ? `(${layer.content})` : layer.content}
                                                        </span>
                                                        {isSelected && (
                                                            <>
                                                                {/* Handles removed as per user request */}
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            }

                                            if (layer.type === 'image' || layer.type === 'icon') {
                                                return (
                                                    <div
                                                        key={layer.id}
                                                        onMouseDown={(e) => handleLayerMouseDown(e, layer.id)}
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
                                                            cursor: draggingLayerId === layer.id ? 'grabbing' : 'grab',
                                                            padding: '8px',
                                                            border: '2px solid transparent',
                                                            borderRadius: '4px',
                                                        }}
                                                    >
                                                        <img
                                                            src={layer.content}
                                                            crossOrigin="anonymous"
                                                            alt=""
                                                            style={{
                                                                width: layer.type === 'image' ? '360px' : '300px',
                                                                transform: `scale(${layer.size / 100}) scaleX(${(layer.scaleX ?? 1) * (layer.isMirrored ? -1 : 1)}) scaleY(${layer.scaleY ?? 1})`,
                                                                mixBlendMode: sku === 'Preto' ? 'screen' : 'multiply',
                                                            }}
                                                        />
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}

                                        {draftText && draftText.trim() && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    left: `${draftTextPosition.x}%`,
                                                    top: `${draftTextPosition.y}%`,
                                                    transform: 'translate(-50%, -50%) rotate(-90deg)',
                                                    opacity: 0.4,
                                                    pointerEvents: 'none',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontFamily: 'Montserrat',
                                                        fontSize: '360px',
                                                        color: 'black',
                                                        whiteSpace: 'nowrap',
                                                        display: 'block',
                                                        letterSpacing: '-0.02em',
                                                        userSelect: 'none',
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
            </div>
            
            {/* Zoom hint removed */}

            {/* CAPTURE GUIDE OVERLAY */}
            {!hideUI && showCaptureGuide && captureSettings && (
                <div 
                    className="absolute top-1/2 left-1/2 border-2 border-red-500 z-50 pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
                    style={{
                        width: `${captureSettings.width}px`,
                        height: `${captureSettings.height}px`,
                        transform: `translate(-50%, -50%) scale(${1 / captureSettings.scale}) translate(${-captureSettings.x}px, ${-captureSettings.y}px)`, // Inverse transform to show what FITS inside
                        // Note: The logic above is tricky. The capture logic applies transform TO the element.
                        // So if we scale UP the element (1.5x), the frame effectively covers LESS content (relative to the element).
                        // If we translate the element X, the frame effectively moves -X relative to the element.
                        // However, here we are inside the container. 
                        // Let's try a simpler approach: Render a frame that represents the "Camera".
                        // If the Camera is 800x1000.
                        transformOrigin: 'center center'
                    }}
                >
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        Área de Captura ({captureSettings.width}x{captureSettings.height})
                    </div>
                </div>
            )}
        </div>
    );
};
