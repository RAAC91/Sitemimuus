import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './Icons';
import { BottlePreview } from './BottlePreview';
import { EditorLayer } from './constants';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';

interface DebugPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    sku: string;
    lidColor: string;
    layers: EditorLayer[];
    onConfirmCapture?: () => void;
}

export const DebugPreviewModal: React.FC<DebugPreviewModalProps> = ({ isOpen, onClose, sku, lidColor, layers, onConfirmCapture }) => {
    // Ref para captura local de teste (opcional, se quiser testar download direto)
    const previewRef = React.useRef<HTMLDivElement>(null);

    const handleDownloadTest = async () => {
        if (!previewRef.current) return;
        try {
            const dataUrl = await toPng(previewRef.current, { pixelRatio: 2, fontEmbedCSS: '' });
            const link = document.createElement('a');
            link.download = 'debug-capture.png';
            link.href = dataUrl;
            link.click();
            toast.success("Download de teste iniciado");
        } catch (err) {
            console.error(err);
            toast.error("Erro no download de teste");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-8"
                >
                    <div className="bg-white rounded-3xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
                        
                        {/* DEBUG DATA OVERLAY */}
                        <div className="absolute top-20 left-4 bg-black/80 text-green-400 p-4 text-xs font-mono rounded z-[100] max-w-xs overflow-auto max-h-60 pointer-events-none">
                             <strong>DEBUG INFO:</strong><br/>
                             SKU: {sku}<br/>
                             Layers Count: {layers.length}<br/>
                             <pre>{JSON.stringify(layers.map(l => ({ id: l.id, type: l.type, visible: l.visible })), null, 2)}</pre>
                        </div>

                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                            <div>
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-wide">
                                    Preview de Captura
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Verifique se a personalização está correta antes de salvar.
                                </p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                                <Icons.X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 bg-gray-50 relative flex items-center justify-center overflow-hidden p-8">
                            <div 
                                className="relative shadow-2xl rounded-[3rem] overflow-hidden bg-white border border-gray-200"
                                style={{ width: 'auto', height: 'auto', padding: '20px' }} 
                            >
                                {/* 
                                    CRITICAL FIX: 
                                    The Bottle Engine (matrix3d) is calibrated for a specific height (~484px).
                                    We MUST render the BottlePreview at this native height for layers to align.
                                    We use the zoom prop to make it visually larger without breaking the internal matrix math.
                                */}
                                <div style={{ height: '484px', width: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }} ref={previewRef}>
                                    <BottlePreview 
                                        sku={sku} 
                                        lidColor={lidColor}
                                        layers={layers} 
                                        selectedLayerId={null} 
                                        isBusy={false}
                                        onUndo={()=>{}} 
                                        onRedo={()=>{}} 
                                        onReset={()=>{}} 
                                        canUndo={false} 
                                        canRedo={false}
                                        onSelectLayer={()=>{}} 
                                        onUpdateLayer={()=>{}} 
                                        zoom={1.5} // Visually scale up (484px * 1.5 = 726px)
                                        hideCanvasBackground={true} 
                                        hideUI={true}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3 z-10">
                            <button 
                                onClick={handleDownloadTest}
                                className="px-6 py-3 rounded-lg border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                            >
                                Testar Download (Local)
                            </button>
                            <button 
                                onClick={onConfirmCapture}
                                className="px-8 py-3 rounded-lg bg-emerald-500 text-white font-bold hover:bg-emerald-600 shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-2"
                            >
                                <Icons.Check className="w-5 h-5" />
                                Tudo Certo, Capturar!
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
