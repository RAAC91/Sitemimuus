
"use client"

import React, { useState, useCallback, useMemo } from 'react';
import { generateStickerDesign, removeImageBackground } from '@/services/ai/gemini';
import { SKUS, ICON_CATEGORIES, EditorLayer } from './constants';
import { Icons } from './Icons';
import { useEditorHistory } from './useEditorHistory';
import { BottlePreview } from './BottlePreview';
import { TextControls } from './TextControls';
import { ImageControls } from './ImageControls';
import { BottleColorPicker } from './BottleColorPicker';
import { ProductRegistrationModal } from '../admin/ProductRegistrationModal';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, ZoomIn } from 'lucide-react';
import { toPng } from 'html-to-image';
import { createProduct } from '@/actions/admin-actions';
import { getProductById } from '@/actions/product-actions';
import { ClickRipple } from '../ui/ClickRipple';
import { ShowcaseModal } from './ShowcaseModal';
import { useLayerPositionFallback } from './useLayerPositionFallback';

// GAMIFICATION
import { useGamification } from '@/context/GamificationContext';
import { XPBar } from '../gamification/XPBar';
import { XPToast } from '../gamification/XPToast';

interface CartItem {
    id: string;
    variantId: string;
    productName: string;
    image: string;
    price: number;
    color: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    customization?: any;
    designId?: string;
}

interface BottleEditorProps {
    onAddToCart?: (item: CartItem) => void;
    onCheckout?: () => void;
    onBack?: () => void;
    onCartOpen?: () => void;
    isAdmin?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialProduct?: any;
    initialSku?: string;
    productId?: string;
}

export const BottleEditor: React.FC<BottleEditorProps> = ({ onAddToCart, onBack, initialSku, isAdmin: isAdminProp, productId }) => {
    
    // --- STATE ---
    const [sku, setSku] = useState<string>(initialSku || 'Branco');
    const [layers, setLayers] = useState<EditorLayer[]>([]);
    const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
    const [activeIconCat, setActiveIconCat] = useState('Vibe');
    const [isBusy, setIsBusy] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [draftText, setDraftText] = useState('');
    const [showShowcase, setShowShowcase] = useState(false);
    
    // ADMIN FLOW
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [adminPreviewImage, setAdminPreviewImage] = useState<string | null>(null);

    // AUTH
    const { user } = useAuth();
    const isAdmin = isAdminProp || user?.email === 'rueliton.andrade@gmail.com';

    // GAMIFICATION
    const { addXP } = useGamification();

    // Load Design logic
    React.useEffect(() => {
        if (productId) {
            const loadDesign = async () => {
                setIsBusy(true);
                try {
                    const product = await getProductById(productId);
                    if (product && product.metadata && product.metadata.layers) {
                         setLayers(product.metadata.layers);
                         toast.success("Design carregado com sucesso!");
                    }
                } catch (error) {
                    console.error("Failed to load design", error);
                    toast.error("Erro ao carregar design.");
                } finally {
                    setIsBusy(false);
                }
            };
            loadDesign();
        }
    }, [productId]);

    // HISTORY
    const currentState = useMemo(() => ({ sku, layers, selectedLayerId }), [sku, layers, selectedLayerId]);
    const { undo, redo, canUndo, canRedo } = useEditorHistory(currentState);


    // FALLBACK AUTOMÁTICO - Corrige layers fora de posição
    // TODO: Mover para depois de updateLayer ser definido
    // useLayerPositionFallback(layers, updateLayer, {
    //     centerX: 50,
    //     centerY: 50,
    //     minX: 5,
    //     maxX: 95,
    //     minY: 5,
    //     maxY: 95
    // });


    // --- FUNÇÕES DE CAMADA ---
    const addLayer = useCallback((layer: EditorLayer) => {
        setLayers(prev => [...prev, layer]);
        setSelectedLayerId(layer.id);
        
        // XP Reward
        if (layer.type === 'text') addXP(50, 'Nova Camada de Texto');
        if (layer.type === 'image') addXP(100, 'Upload de Imagem');
        if (layer.type === 'icon') addXP(30, 'Novo Sticker');
    }, [addXP]);

    const updateLayer = useCallback((id: string, updates: Partial<EditorLayer>) => {
        setLayers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    }, []);

    const deleteLayer = useCallback((id: string) => {
        setLayers(prev => prev.filter(l => l.id !== id));
        if (selectedLayerId === id) setSelectedLayerId(null);
    }, [selectedLayerId]);

    const handleSelectLayer = useCallback((id: string | null) => {
        setSelectedLayerId(id);
    }, []);

    // --- ADMIN ACTIONS ---
    const handleAdminClick = () => {
        if (isBusy) return;
        setSelectedLayerId(null); 
        handleConfirmCapture(); // GO STRAIGHT TO CAPTURE
    };

    const handleConfirmCapture = async () => {
        setIsBusy(true);
        const toastId = toast.loading('Capturando design de alta fidelidade...');

        try {
            // Target the visible preview in the confirmation overlay
            const captureElement = document.getElementById('high-res-capture-target-inner');
            if (!captureElement) throw new Error('Container de captura não encontrado');

            // Wait for any final rendering (textures, fonts, etc)
            await new Promise(r => setTimeout(r, 1000));

            const dataUrl = await toPng(captureElement, {
                quality: 1.0,
                pixelRatio: 2, // 2x resolucao (1600x2000)
                backgroundColor: '#ffffff',
                cacheBust: true,
            });

            setAdminPreviewImage(dataUrl);
            setShowAdminModal(true);
            toast.success('Design capturado!', { id: toastId });
        } catch (err) {
            console.error(err);
            toast.error('Erro na captura. Usando mockup base.', { id: toastId });
            setAdminPreviewImage(SKUS[sku]?.img);
            setShowAdminModal(true);
        } finally {
            setIsBusy(false);
        }
    };

    // Keyboard Shortcuts
    const [clipboard, setClipboard] = useState<EditorLayer | null>(null);
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedLayerId) deleteLayer(selectedLayerId);
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                const layer = layers.find(l => l.id === selectedLayerId);
                if (layer) { setClipboard(layer); toast.success('Copiado!'); }
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
                if (clipboard) {
                    const newLayer = { ...clipboard, id: uuidv4(), x: clipboard.x + 5, y: clipboard.y + 5 };
                    addLayer(newLayer);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedLayerId, clipboard, layers, deleteLayer, addLayer]);

    const handleAddText = (text: string) => {
        const defaultColor = ['Branco', 'Lilás'].includes(sku) ? '#000000' : '#FFFFFF';
        addLayer({
            id: uuidv4(), type: 'text', visible: true, content: text,
            font: 'Montserrat', color: defaultColor, size: 200, rotation: -90, x: 75, y: 90
        });
        setDraftText('');
    };

    const handleAddImage = (img: string) => {
        addLayer({
            id: uuidv4(), type: 'image', visible: true, content: img,
            size: 500, rotation: 0, x: 75, y: 90, mode: 'center'
        });
    };

    const handleAddIcon = (url: string) => {
        addLayer({
            id: uuidv4(), type: 'icon', visible: true, content: url, size: 500, rotation: 0, x: 75, y: 90
        });
    };

    const handleAiGenerate = async () => {
        if (!aiPrompt.trim()) return;
        setIsAiLoading(true);
        try {
            const res = await generateStickerDesign(aiPrompt);
            addLayer({
                id: uuidv4(), type: 'image', visible: true, content: res,
                size: 500, rotation: 0, x: 75, y: 90, mode: 'center', isBgClean: true 
            });
            setAiPrompt('');
            addXP(200, 'Criador IA');
        } catch (error) { console.error(error); alert('Erro IA'); }
        finally { setIsAiLoading(false); }
    };

    const handleAiBackgroundRemoval = async (id: string) => {
        const layer = layers.find(l => l.id === id);
        if (!layer) return;
        setIsBusy(true);
        try {
            const clean = await removeImageBackground(layer.content);
            updateLayer(id, { content: clean, isBgClean: true });
        } catch (error) { console.error(error); }
        finally { setIsBusy(false); }
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => { if (ev.target?.result) handleAddImage(ev.target.result as string); };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart({
                id: uuidv4(), variantId: sku, productName: `Garrafa ${sku}`,
                image: SKUS[sku].img, price: 89.90, color: sku, customization: { layers }
            });
            setShowShowcase(true);
        }
    };

    return (
        <div className="relative h-full w-full overflow-hidden bg-white selection:bg-rose-500 selection:text-white flex flex-row rounded-3xl border border-slate-200 shadow-xl">
            <ClickRipple />
            <XPToast />
            
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#fdf2f8_0%,#ffffff_50%,#f0f9ff_100%)]" />
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/p6-mini.png')]" />
            </div>

            <div className="absolute top-6 left-6 z-50">
                <button onClick={onBack} className="bg-white/70 backdrop-blur-xl border border-white/40 text-slate-700 p-3 rounded-2xl hover:bg-white transition-all shadow-sm">
                    <Icons.ArrowLeft className="w-5 h-5" />
                </button>
            </div>

            <div className="absolute top-6 right-6 z-50">
                <XPBar />
            </div>

            {/* LEFT COL: GALLERY */}
            <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="relative z-30 h-full w-[400px] p-4 flex flex-col pointer-events-none">
               <div className="mt-16 pointer-events-auto flex-1 bg-white/60 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] shadow-xl flex flex-col overflow-hidden">
                    <div className="p-5 border-b border-white/20">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                            <Icons.Image className="w-5 h-5 text-sky-500" /> Galeria Criativa
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <ImageControls
                            layers={layers} expandedLayerId={selectedLayerId} onExpandLayer={handleSelectLayer}
                            onUpdateLayer={updateLayer} onAddImage={handleAddImage} onDeleteLayer={deleteLayer}
                            isBusy={isBusy} aiPrompt={aiPrompt} setAiPrompt={setAiPrompt} isAiLoading={isAiLoading}
                            handleAiGenerate={handleAiGenerate} handleAiBackgroundRemoval={handleAiBackgroundRemoval} handleUpload={handleUpload}
                        />
                    </div>
                </div>
            </motion.div>

            {/* CENTER COL: PREVIEW */}
            <div className="flex-1 h-full relative z-10 flex flex-col items-center p-4">
                <div className="flex-1 w-full flex items-center justify-center relative bg-white/20 rounded-[3.5rem] border border-white/40 backdrop-blur-md overflow-hidden shadow-inner">
                    
                    {/* Floating Color Picker */}
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 z-40">
                        <BottleColorPicker selectedSku={sku} onSelectSku={setSku} vertical />
                    </div>

                    <div className="absolute right-6 bottom-6 z-40">
                        <button className="p-3 bg-white rounded-full shadow-sm text-slate-600 hover:text-rose-500 border border-slate-100">
                             <ZoomIn className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="w-full h-full flex items-center justify-center relative p-8">
                         <BottlePreview
                            sku={sku} layers={layers} selectedLayerId={selectedLayerId} isBusy={isBusy}
                            onUndo={() => undo(s => { setSku(s.sku); setLayers(s.layers); setSelectedLayerId(s.selectedLayerId); })} 
                            onRedo={() => redo(s => { setSku(s.sku); setLayers(s.layers); setSelectedLayerId(s.selectedLayerId); })} 
                            onReset={() => { if (window.confirm('Limpar tudo?')) { setLayers([]); setSelectedLayerId(null); } }}
                            canUndo={canUndo} canRedo={canRedo} onSelectLayer={handleSelectLayer} onUpdateLayer={updateLayer}
                            draftText={draftText} zoom={1.1}
                        />
                    </div>
                </div>
            </div>

            {/* RIGHT COL: STUDIO & COLOR */}
            <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="relative z-30 h-full w-[400px] p-4 flex flex-col pointer-events-none">
                <div className="mt-16 pointer-events-auto flex-1 bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] shadow-xl flex flex-col overflow-hidden mb-3">
                    <div className="p-5 border-b border-slate-100">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                            <Icons.Type className="w-5 h-5 text-rose-500" /> Estúdio de Texto
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                         <TextControls
                            layers={layers} expandedLayerId={selectedLayerId} onExpandLayer={handleSelectLayer}
                            onUpdateLayer={updateLayer} onAddText={handleAddText} onDeleteLayer={deleteLayer}
                            activeIconCat={activeIconCat} setActiveIconCat={setActiveIconCat}
                            ICON_CATEGORIES={ICON_CATEGORIES} onAddIcon={handleAddIcon} onNewTextChange={setDraftText}
                        />
                    </div>
                </div>

                <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-white rounded-[2rem] p-5 shadow-2xl shrink-0">
                    <div className="flex justify-between items-center gap-6">
                        <p className="text-2xl font-black text-slate-800 tracking-tighter">
                            R$ {SKUS[sku]?.price.toFixed(2).replace('.', ',')}
                        </p>
                        <button onClick={handleAddToCart} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg flex items-center gap-2">
                            <Icons.ShoppingBag className="w-4 h-4 text-rose-300" /> Comprar
                        </button>
                    </div>

                    {isAdmin && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                            <button onClick={handleAdminClick} disabled={isBusy} className="w-full bg-emerald-50 text-emerald-700 py-2 rounded-lg font-bold uppercase tracking-wider text-[10px] hover:bg-emerald-100 transition-all flex items-center justify-center gap-2">
                                <Save className="w-3 h-3" /> Salvar Produto
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>

            <ShowcaseModal isOpen={showShowcase} onClose={() => setShowShowcase(false)} onConfirm={() => setShowShowcase(false)} sku={sku} />

            {/* Background Capture Target: Automated High-Fidelity Snapshot (Off-screen & Explicit dimensions) */}
            <div 
                id="high-res-capture-target" 
                className="fixed -left-[8000px] top-0 w-[800px] h-[1000px] bg-white pointer-events-none"
                style={{ zIndex: -1000 }}
            >
                 <div id="high-res-capture-target-inner" className="w-[800px] h-[1000px] bg-white flex items-center justify-center overflow-hidden p-0">
                    <BottlePreview 
                        sku={sku} layers={layers} selectedLayerId={null} isBusy={false}
                        onUndo={()=>{}} onRedo={()=>{}} onReset={()=>{}} canUndo={false} canRedo={false}
                        onSelectLayer={()=>{}} onUpdateLayer={()=>{}} zoom={1.0} hideCanvasBackground hideUI
                    />
                 </div>
            </div>

            <AnimatePresence>
                {showAdminModal && (
                    <ProductRegistrationModal 
                        onClose={() => setShowAdminModal(false)}
                        onSave={async (data) => {
                            toast.loading("Salvando...");
                            const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                            const res = await createProduct({
                                name: data.name, 
                                slug: slug,
                                description: data.description, 
                                base_price: parseFloat(data.price),
                                category: data.category.toLowerCase() as "sports" | "corporate" | "kids" | "events" | "fashion" | "vibrantes" | "classicos"| "pastel",
                                tags: data.tags,
                                images: data.previewImage ? [data.previewImage] : [],
                                metadata: { 
                                    layers: layers.map(l => ({ ...l, id: uuidv4() })), // Unify IDs for new product
                                    sku,
                                    capturedAt: new Date().toISOString()
                                }
                            });
                            toast.dismiss();
                            if (res.success) { setShowAdminModal(false); toast.success("Sucesso!"); }
                            else toast.error("Erro: " + res.error);
                        }}
                        initialData={{ name: `Garrafa ${sku} Custom`, price: SKUS[sku]?.price, color: SKUS[sku]?.color }}
                        previewImage={adminPreviewImage || SKUS[sku]?.img} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
