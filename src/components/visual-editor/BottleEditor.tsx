
"use client"

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { generateStickerDesign, removeImageBackground } from '@/services/ai/gemini';
import { SKUS, ICON_CATEGORIES, EDITOR_COLORS, FONTS, type EditorLayer, MOBILE_DEFAULTS } from './constants';
import { Icons } from './Icons';
import { useEditorHistory } from './useEditorHistory';
import { BottlePreview } from './BottlePreview';
import { MobileBottlePreview } from './MobileBottlePreview';
import { TextControls } from './TextControls';
import { ImageControls } from './ImageControls';
import { BottleColorPicker } from './BottleColorPicker';
import ProductRegistrationModal from '../admin/ProductRegistrationModal';
import { CaptureCalibrationModal, CaptureConfig } from './CaptureCalibrationModal';
import { useAuth } from '@/providers/AuthProvider';
import { useAdmin } from '@/hooks/useAdmin';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { toCanvas } from 'html-to-image';
import { createProduct } from '@/actions/admin-actions';
import { getProductById } from '@/actions/product-actions';
import { ShowcaseModal } from './ShowcaseModal';
import { DebugPreviewModal } from './DebugPreviewModal';
// useLayerPositionFallback removed
import { CartItem } from '@/types';
import { useCartStore } from '@/store/cartStore';
// Duplicate import removed
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// GAMIFICATION
import { useGamification } from '@/context/GamificationContext';
import { XPBar } from '../gamification/XPBar';
import { XPToast } from '../gamification/XPToast';



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
    const router = useRouter();

    const handleBack = () => {
        if (onBack) onBack();
        else router.back();
    };
    
    // --- STATE ---
    const [sku, setSku] = useState<string>(() => {
        // Initial SKU safety check
        if (initialSku && SKUS[initialSku]) return initialSku;
        return 'Branco';
    });
    const [lidColor] = useState<string>('#000000');
    const [layers, setLayers] = useState<EditorLayer[]>([]);
    const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
    const [activeIconCat, setActiveIconCat] = useState(() => Object.keys(ICON_CATEGORIES)[0] ?? '');
    const [isBusy, setIsBusy] = useState(false);
    const [draftText, setDraftText] = useState('');
    const [showShowcase, setShowShowcase] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [generatedPreview] = useState<string | null>(null);
    const [activeMobileTab, setActiveMobileTab] = useState<'color' | 'material' | 'stamps' | 'text' | 'summary' | 'icons' | null>('color');
    
    // POSITION CALIBRATION - Separate positions for each layer type
    const isMobileViewport = () =>
        typeof window !== 'undefined' && window.innerWidth < 1024;

    const [defaultTextPosition, setDefaultTextPosition] = useState<{ x: number; y: number }>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('mimuus_default_position_text');
            // Mobile calibration (2025-03): HD canvas x=60%, y=45% aligns with the
            // visual center of the bottle body in the 390×390 aspect-square preview.
            // (Left edge ≈39%, center ≈60%, right edge ≈81% of the 2754px HD canvas.)
            if (isMobileViewport()) return { x: MOBILE_DEFAULTS.TEXT.x, y: MOBILE_DEFAULTS.TEXT.y };
            return saved ? JSON.parse(saved) : { x: 39, y: 50 };
        }
        return { x: 39, y: 50 };
    });
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [defaultImagePosition, setDefaultImagePosition] = useState<{ x: number; y: number }>(() => {
        if (typeof window !== 'undefined') {
            if (isMobileViewport()) return { x: MOBILE_DEFAULTS.IMAGE.x, y: MOBILE_DEFAULTS.IMAGE.y }; // Mobile calibrated center
            const saved = localStorage.getItem('mimuus_default_position_image');
            return saved ? JSON.parse(saved) : { x: 50, y: 70 };
        }
        return { x: 50, y: 70 };
    });

    const [defaultImageScale, setDefaultImageScale] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            if (isMobileViewport()) return MOBILE_DEFAULTS.IMAGE.scale;
            const saved = localStorage.getItem('mimuus_default_scale_image');
            return saved ? JSON.parse(saved) : 1;
        }
        return 1;
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [defaultImageRotation, setDefaultImageRotation] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            if (isMobileViewport()) return MOBILE_DEFAULTS.IMAGE.rotation;
            const saved = localStorage.getItem('mimuus_default_rotation_image');
            return saved ? JSON.parse(saved) : 0;
        }
        return 0;
    });
    
    const [defaultIconPosition, setDefaultIconPosition] = useState<{ x: number; y: number }>(() => {
        if (typeof window !== 'undefined') {
            if (isMobileViewport()) return { x: MOBILE_DEFAULTS.ICON.x, y: MOBILE_DEFAULTS.ICON.y }; // Mobile calibrated center
            const saved = localStorage.getItem('mimuus_default_position_icon');
            return saved ? JSON.parse(saved) : { x: 63.1, y: 17.4 };
        }
        return { x: 63.1, y: 17.4 };
    });
    const [defaultIconSize, setDefaultIconSize] = useState(() => {
        if (typeof window !== 'undefined') {
            // On mobile scale down for the 1:1 square preview
            if (isMobileViewport()) return Number(MOBILE_DEFAULTS.ICON.scale) * 100;
            const saved = localStorage.getItem('mimuus_default_size_icon');
            return saved ? Number(saved) : 116;
        }
        return 116;
    });
    const [defaultIconRotation, setDefaultIconRotation] = useState(() => {
        if (typeof window !== 'undefined') {
            // On mobile apply the calibrated rotation
            if (isMobileViewport()) return MOBILE_DEFAULTS.ICON.rotation;
            const saved = localStorage.getItem('mimuus_default_rotation_icon');
            return saved ? Number(saved) : -90;
        }
        return -90;
    });
    const [showCalibration, setShowCalibration] = useState(false);
    
    // ADMIN FLOW - New simplified approach
    const [showCapturePreview, setShowCapturePreview] = useState(false);
    const [showDebugPreview, setShowDebugPreview] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [adminPreviewImage, setAdminPreviewImage] = useState<string | null>(null);

    // AUTH
    const { user } = useAuth();
    const { isAdmin: isSystemAdmin } = useAdmin();
    const isAdmin = isAdminProp || isSystemAdmin;
    
    // Silent admin detection — no visible indicators
    React.useEffect(() => {
        if (user?.email && isAdmin) {
            // Admin features are silently available
        }
    }, [user, isAdmin]);

    // Recalculate text position when viewport changes (e.g. orientation flip)
    React.useEffect(() => {
        const handleResize = () => {
            setDefaultTextPosition(prev => {
                const mobile = isMobileViewport();
                if (mobile && prev.y > 80) return { x: 60, y: 45 }; // Mobile calibrated center
                if (!mobile && prev.y < 80) return { x: 50, y: 90 };
                return prev;
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Mobile scroll container ref
    const mobileScrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to relevant section when a layer is selected on mobile
    useEffect(() => {
        if (!selectedLayerId || !mobileScrollRef.current) return;
        if (typeof window === 'undefined' || window.innerWidth >= 1024) return;
        const layer = layers.find(l => l.id === selectedLayerId);
        if (!layer) return;
        const sectionId = layer.type === 'text' ? 'mobile-section-text' : 'mobile-section-images';
        const section = document.getElementById(sectionId);
        if (section && mobileScrollRef.current) {
            const scrollTop = section.offsetTop - 12;
            mobileScrollRef.current.scrollTo({ top: scrollTop, behavior: 'smooth' });
        }
    }, [selectedLayerId, layers]);

    // GAMIFICATION
    const { addXP } = useGamification();
    const { addItem } = useCartStore();

    // Load Design logic
    React.useEffect(() => {
        if (productId) {
            const loadDesign = async () => {
                setIsBusy(true);
                try {
                    const product = await getProductById(productId);
                    if (product && product.metadata) {
                        if (Array.isArray(product.metadata.layers)) {
                             setLayers(product.metadata.layers);
                        }
                        if (product.metadata.sku && typeof product.metadata.sku === 'string') {
                             setSku(product.metadata.sku);
                        }
                        if (product.metadata.layers) {
                             toast.success("Design carregado com sucesso!");
                        }
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
        setShowCapturePreview(true); // Show preview modal first!
    };

    const handleConfirmCapture = async (config: CaptureConfig) => {
        setIsBusy(true);
        const toastId = toast.loading('Capturando...');

        const originalSrcs = new Map<HTMLImageElement, string>();
        try {
            // Target the VISIBLE preview modal element
            const captureElement = document.getElementById('capture-preview-target');
            if (!captureElement) throw new Error('Preview não encontrado');

            // Pre-load ALL fonts before capture so html-to-image can embed them correctly.
            // Without this, CSS variable fonts (--font-*) may not be resolved in the canvas.
            try {
                await document.fonts.ready;
                const fontFaces = Array.from(document.fonts);
                await Promise.all(fontFaces.map(f => f.load().catch(() => null)));
            } catch {
                // Font pre-loading is best-effort; continue even if it partially fails
            }

            // Extra delay after font pre-load to ensure render is fully settled
            await new Promise(r => setTimeout(r, 500));

            // Capture the visible element with the configured dimensions.
            // Note: fontEmbedCSS is intentionally NOT set to '' — we let html-to-image
            // embed fonts automatically so custom fonts appear in the captured image.
            // Pre-convert all external <img> to inline base64 data URLs.
            // This prevents tainted canvas (cross-origin) AND avoids the
            // html-to-image cacheBust bug that corrupts blob: URLs with ?timestamp.
            const imgElements = Array.from(captureElement.querySelectorAll('img')) as HTMLImageElement[];

            await Promise.all(
                imgElements.map(async (img) => {
                    const src = img.getAttribute('src') || '';
                    if (!src || src.startsWith('data:')) return;
                    try {
                        const res = await fetch(src, { mode: 'cors', cache: 'force-cache' });
                        if (!res.ok) return;
                        const blob = await res.blob();
                        // Convert blob → base64 data URL (html-to-image skips data: URLs entirely)
                        const dataUrlInline = await new Promise<string>((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = () => resolve(reader.result as string);
                            reader.onerror = reject;
                            reader.readAsDataURL(blob);
                        });
                        originalSrcs.set(img, src);
                        img.src = dataUrlInline;
                        // Wait for browser to decode the new src
                        await new Promise<void>((resolve) => {
                            if (img.complete) { resolve(); return; }
                            img.onload = () => resolve();
                            img.onerror = () => resolve();
                        });
                    } catch {
                        // Fetch failed — leave original src (best-effort)
                    }
                })
            );

            const canvas = await toCanvas(captureElement, {
                pixelRatio: 2,
                backgroundColor: '#ffffff',
                // cacheBust removido: corrompía blob/data URLs ao adicionar ?timestamp
                width: config.width,
                height: config.height,
                // skipFonts: evita SecurityError ao tentar ler cssRules de
                // stylesheets cross-origin (Google Fonts). Fontes já foram
                // pré-carregadas acima via document.fonts.ready.
                skipFonts: true,
            });



            // Tenta obter o DataURL, se falhar, provavelmente é Tainted Canvas
            let dataUrl;
            try {
                dataUrl = canvas.toDataURL('image/png', 1.0);
            } catch (e) {
                console.error("Erro ao gerar DataURL (Provável Tainted Canvas):", e);
                // Tente novamente sem CORS como fallback, ou avise o usuário
                throw new Error("Falha de segurança na imagem. Tente recarregar a página.");
            }

            // Close preview modal and open registration modal
            setShowCapturePreview(false);
            setAdminPreviewImage(dataUrl);
            setShowAdminModal(true);
            toast.success('Capturado!', { id: toastId });
        } catch (err) {
            console.error('ERRO NA CAPTURA:', err);
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
            toast.error(`Erro: ${errorMessage}. Tente novamente ou contate o suporte if persists.`, { id: toastId });
            setShowCapturePreview(false);
        } finally {
            // Restore original img srcs no matter what
            originalSrcs.forEach((src, img) => { img.src = src; });
            setIsBusy(false);
        }
    };


    // Keyboard Shortcuts & Paste Handling
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

        const handlePaste = (e: ClipboardEvent) => {
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    if (blob) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                            if (ev.target?.result) {
                                addLayer({
                                    id: uuidv4(), type: 'image', visible: true, content: ev.target.result as string,
                                    size: 1000, rotation: 0, x: defaultImagePosition.x, y: defaultImagePosition.y, mode: 'center'
                                });
                                toast.success('Imagem colada com sucesso!');
                            }
                        };
                        reader.readAsDataURL(blob);
                        e.preventDefault();
                        break;
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('paste', handlePaste);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('paste', handlePaste);
        };
    }, [selectedLayerId, clipboard, layers, deleteLayer, addLayer, defaultImagePosition]);

    const handleAddText = (text: string) => {
        const defaultColor = ['Branco', 'Lilás'].includes(sku) ? '#000000' : '#FFFFFF';
        addLayer({
            id: uuidv4(), type: 'text', visible: true, content: text,
            font: 'Montserrat', color: defaultColor, size: 200, rotation: -90, x: defaultTextPosition.x, y: defaultTextPosition.y
        });
        setDraftText('');
    };

    const handleAddImage = (img: string) => {
        addLayer({
            id: uuidv4(), type: 'image', visible: true, content: img,
            size: 1000, rotation: 0, x: defaultImagePosition.x, y: defaultImagePosition.y, mode: 'center'
        });
    };

    const handleAddIcon = (url: string) => {
        addLayer({
            id: uuidv4(), type: 'icon', visible: true, content: url, size: defaultIconSize, rotation: defaultIconRotation, x: defaultIconPosition.x, y: defaultIconPosition.y
        });
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => { if (ev.target?.result) handleAddImage(ev.target.result as string); };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleAddToCart = async () => {
        setIsBusy(true);
        const toastId = toast.loading('Gerando preview do seu design...');
        
        const originalSrcs = new Map<HTMLImageElement, string>();
        try {
            // Pre-load fonts
            try {
                await document.fonts.ready;
                const fontFaces = Array.from(document.fonts);
                await Promise.all(fontFaces.map(f => f.load().catch(() => null)));
            } catch { /* best effort */ }

            const getVal = (key: string, def: string) => {
                return localStorage.getItem(`mimuus_capture_${sku}_${key}`) || 
                       localStorage.getItem(`mimuus_capture_${key}`) || 
                       def;
            };

            const config = {
                width: parseInt(getVal('width', '800')),
                height: parseInt(getVal('height', '1000')),
                margin: parseFloat(getVal('margin', '0')),
                zoom: parseFloat(getVal('zoom', '1.2')),
                yPosition: parseFloat(getVal('y_position', '50')),
            };

            // Capture the hidden checkout preview
            let previewUrl = SKUS[sku].img;

            // Give it a tiny bit of time to ensure it's in the DOM properly if just rendered
            await new Promise(r => setTimeout(r, 200));
            
            const captureElement = document.getElementById('checkout-capture-target');
            if (captureElement) {
                // Convert images to base64 to avoid CORS/tainted canvas
                const imgElements = Array.from(captureElement.querySelectorAll('img')) as HTMLImageElement[];
                await Promise.all(
                    imgElements.map(async (img) => {
                        const src = img.getAttribute('src') || '';
                        if (!src || src.startsWith('data:')) return;
                        try {
                            const res = await fetch(src, { mode: 'cors', cache: 'force-cache' });
                            if (!res.ok) return;
                            const blob = await res.blob();
                            const dataUrlInline = await new Promise<string>((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onload = () => resolve(reader.result as string);
                                reader.onerror = reject;
                                reader.readAsDataURL(blob);
                            });
                            originalSrcs.set(img, src);
                            img.src = dataUrlInline;
                            await new Promise<void>((resolve) => {
                                if (img.complete) { resolve(); return; }
                                img.onload = () => resolve();
                                img.onerror = () => resolve();
                            });
                        } catch { /* best effort */ }
                    })
                );

                const canvas = await toCanvas(captureElement, {
                    pixelRatio: 2,
                    backgroundColor: '#ffffff',
                    width: config.width,
                    height: config.height,
                    skipFonts: true,
                });
                previewUrl = canvas.toDataURL('image/png', 0.9);
            }

            // Restore original srcs
            originalSrcs.forEach((src, img) => {
                img.src = src;
            });


            const fontsUsed = layers
                .filter(l => l.type === 'text' && l.font)
                .map(l => l.font)
                .filter((value, index, self) => self.indexOf(value) === index);

            const item: CartItem = {
                id: uuidv4(),
                productId: sku,
                name: `Garrafa ${sku}`,
                image: SKUS[sku].img, 
                thumbnail: previewUrl,
                price: 89.90,
                quantity: 1,
                customization: { 
                    layers, 
                    previewImage: previewUrl,
                    uploadedImage: layers.find(l => l.type === 'image')?.content,
                    textFont: fontsUsed.join(', '), // Save used fonts
                    backgroundColor: SKUS[sku].color // Save base color
                }
            };

            if (onAddToCart) {
                onAddToCart(item);
            } else {
                addItem(item);
                // Trigger Share Modal after adding to store directly
                setShowShareModal(true);
            }
            
            toast.success("Adicionado ao carrinho!", { id: toastId });
            // Don't show showcase immediately if we want to ask for share
            // setShowShowcase(true); 
        } catch (error) {
            console.error("Erro ao adicionar ao carrinho:", error);
            toast.error("Erro ao gerar design. Tente novamente.", { id: toastId });
        } finally {
            setIsBusy(false);
        }
    };

    // Derived: which type is the selected layer?
    const selectedLayer = layers.find(l => l.id === selectedLayerId) ?? null;
    const isPanelLeft  = selectedLayer?.type === 'image' || selectedLayer?.type === 'icon';
    const isPanelRight = selectedLayer?.type === 'text';

    return (
        <div className="editor-shell text-slate-800 h-[100dvh] w-full flex flex-col overflow-hidden relative font-sans selection:bg-[#FF4586] selection:text-white z-50 overscroll-contain">
            <span className="hidden lg:contents"><XPToast /></span>

            {/* Header */}
            <header className="h-14 editor-header border-b border-slate-200 flex justify-between items-center px-4 lg:px-6 z-50 relative shrink-0">
                {/* LEFT: Back + Logo + Nav */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <button onClick={handleBack} title="Voltar" className="p-1.5 rounded-[8px] hover:bg-slate-100 transition-colors text-slate-500">
                            <Icons.ArrowLeft className="w-4 h-4" />
                        </button>
                        <Link href="/" className="text-xl font-black tracking-tight text-slate-900 shrink-0">
                            mi<span className="text-[#FF4586]">mu</span>us<span className="text-[#00C9D4]">.</span>
                        </Link>
                        <span className="text-[9px] font-black uppercase text-[#FF4586] bg-[#FF4586]/10 border border-[#FF4586]/20 px-2 py-0.5 rounded-[4px] tracking-widest hidden sm:inline">Studio</span>
                    </div>

                    {/* Nav menus */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {[
                            { name: 'INÍCIO', href: '/' },
                            { name: 'PRODUTOS', href: '/produtos' },
                            { name: 'SOBRE', href: '/sobre' },
                        ].map(item => (
                            <a key={item.href} href={item.href} className="text-[11px] font-bold tracking-widest uppercase text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-[8px] transition-colors">
                                {item.name}
                            </a>
                        ))}
                    </nav>
                </div>

                {/* RIGHT: Actions */}
                <div className="flex items-center gap-1.5 lg:gap-2">
                    {isAdmin && (
                        <>
                            <button onClick={() => setShowDebugPreview(true)} className="hidden lg:flex items-center justify-center w-8 h-8 rounded-[8px] bg-slate-100 hover:bg-slate-200 transition-all" title="Debug PDF">
                                <Icons.Eye className="w-4 h-4 text-slate-400" />
                            </button>
                            <button onClick={() => setShowCalibration(!showCalibration)} className="hidden lg:flex items-center justify-center w-8 h-8 rounded-[8px] bg-slate-100 hover:bg-slate-200 transition-all" title="Monitor">
                                <Icons.Settings className={`w-4 h-4 ${showCalibration ? 'text-[#FF4586]' : 'text-slate-400'}`} />
                            </button>
                        </>
                    )}
                    <div className="h-4 w-px bg-slate-200 hidden sm:block mx-1"></div>
                    <button onClick={() => undo(s => { setSku(s.sku); setLayers(s.layers); setSelectedLayerId(s.selectedLayerId); })} disabled={!canUndo} className="p-1.5 rounded-[8px] hover:bg-slate-100 transition-colors text-slate-400 disabled:opacity-30" title="Desfazer">
                        <Icons.Undo className="w-4 h-4" />
                    </button>
                    <button onClick={() => redo(s => { setSku(s.sku); setLayers(s.layers); setSelectedLayerId(s.selectedLayerId); })} disabled={!canRedo} className="p-1.5 rounded-[8px] hover:bg-slate-100 transition-colors text-slate-400 disabled:opacity-30" title="Refazer">
                        <Icons.Redo className="w-4 h-4" />
                    </button>
                    <button onClick={() => { if (window.confirm('Limpar tudo?')) { setLayers([]); setSelectedLayerId(null); } }} className="p-2 rounded-xl bg-red-50 border border-red-100 hover:bg-red-100 hover:border-red-200 shadow-sm transition-colors text-red-500 hover:text-red-600 active:scale-95" title="Limpar tudo">
                        <Icons.Trash className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-px bg-slate-200 hidden sm:block mx-1"></div>
                    <div className="hidden lg:block"><XPBar /></div>
                    {isAdmin && (
                        <button onClick={handleAdminClick} disabled={isBusy} className="hidden lg:flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-3 py-1.5 rounded-[8px] font-bold uppercase tracking-wider text-[10px] hover:bg-emerald-500/20 transition-all">
                            <Icons.Save className="w-3 h-3" /> Salvar
                        </button>
                    )}
                    <button onClick={handleAddToCart} disabled={isBusy} className="btn-gradient text-white px-4 py-2 rounded-[8px] font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 border border-[#FF4586]">
                        <Icons.ShoppingBag className="w-4 h-4" />
                        <span className="hidden sm:inline">Comprar</span>
                    </button>
                </div>
            </header>

            {/* ================================================================
                MOBILE EDITOR — True Tab UI (lg:hidden)
                Desktop layout untouched below in <main>
            ================================================================ */}
            {(() => {
                const selectedLayer = layers.find(l => l.id === selectedLayerId) ?? null;

                // Active tab: 'color' | 'images' | 'text' | 'cta'
                const mobileTab = activeMobileTab === 'color' || activeMobileTab === 'stamps' ? 'color'
                    : activeMobileTab === 'text' ? 'text'
                    : activeMobileTab === 'icons' ? 'icons'
                    : activeMobileTab === 'summary' ? 'cta'
                    : activeMobileTab === 'material' ? 'images'
                    : 'color';

                const setTab = (t: typeof activeMobileTab) => setActiveMobileTab(t);

                return (
                <div className="lg:hidden flex-1 flex flex-col overflow-hidden">

                    {/* ── Sticky bottle preview ─────────────── */}
                    <div className="shrink-0 w-full aspect-square relative overflow-hidden bg-transparent">
                        <MobileBottlePreview
                            sku={sku} lidColor={lidColor} layers={layers}
                            selectedLayerId={selectedLayerId} isBusy={isBusy}
                            onSelectLayer={handleSelectLayer} onUpdateLayer={updateLayer}
                            draftText={draftText} draftTextPosition={defaultTextPosition}
                        />
                    </div>

                    {/* ── Tab nav ────────────────────────────── */}
                    <div className="shrink-0 flex border-b border-slate-100 bg-white shadow-sm z-10 overflow-x-auto hide-scrollbar">
                        {([
                            { id: 'color',  label: 'Cor',     icon: <Icons.Palette className="w-3.5 h-3.5 text-white" />, grad: 'from-[#FF4586] to-[#FF8C42]', active: 'text-[#FF4586]' },
                            { id: 'text',   label: 'Texto',   icon: <Icons.Type    className="w-3.5 h-3.5 text-white" />, grad: 'from-rose-400 to-orange-400',    active: 'text-rose-500' },
                            { id: 'material', label: 'Imagem',  icon: <Icons.Layers  className="w-3.5 h-3.5 text-white" />, grad: 'from-indigo-500 to-blue-600',   active: 'text-indigo-500' },
                            { id: 'icons',  label: 'Ícones',  icon: <Icons.Star    className="w-3.5 h-3.5 text-white" />, grad: 'from-amber-400 to-orange-500',   active: 'text-amber-500' },
                            { id: 'summary', label: 'Comprar', icon: <Icons.ShoppingBag className="w-3.5 h-3.5 text-white" />, grad: 'from-emerald-400 to-teal-500', active: 'text-emerald-600' },
                        ] as const).map(tab => {
                            const isActive = mobileTab === (tab.id === 'material' ? 'images' : tab.id === 'summary' ? 'cta' : tab.id);
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setTab(tab.id as typeof activeMobileTab)}
                                    className={`flex-1 min-w-[70px] flex flex-col items-center gap-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors active:bg-slate-50 border-b-2 ${isActive ? `${tab.active} border-current` : 'text-slate-400 border-transparent'}`}
                                >
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center bg-linear-to-br ${tab.grad} ${!isActive ? 'opacity-50' : ''}`}>
                                        {tab.icon}
                                    </div>
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Scrollable Main Area (Mobile) */}
                    <div ref={mobileScrollRef} className="flex-1 min-h-0 overflow-y-auto bg-white overscroll-contain" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
                        {/* Tab Content */}
                        {/* TAB: Cor da Garrafa */}
                        {mobileTab === 'color' && (
                            <div className="px-4 pt-5 pb-8">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Escolha a cor da garrafa</p>
                                <BottleColorPicker selectedSku={sku} onSelectSku={setSku} />
                            </div>
                        )}

                        {/* TAB: Arte & Imagens */}
                        {mobileTab === 'images' && (
                            <div className="pt-5 pb-8 flex flex-col gap-4">
                                {layers.filter(l => l.type === 'image').length > 0 && (
                                    <div className="px-4 flex flex-col gap-2">
                                        <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">Camadas de Imagem</p>
                                        {layers.filter(l => l.type === 'image').map(layer => (
                                            <div
                                                key={layer.id}
                                                onClick={() => handleSelectLayer(layer.id === selectedLayerId ? null : layer.id)}
                                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                                                    layer.id === selectedLayerId
                                                        ? 'bg-indigo-50 border-indigo-300 shadow-sm'
                                                        : 'bg-white border-slate-200 hover:border-slate-300'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0 border border-indigo-200 overflow-hidden">
                                                        <img src={layer.content} alt="img" className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700">Imagem selecionada</span>
                                                </div>
                                                <button
                                                    onClick={e => { e.stopPropagation(); deleteLayer(layer.id); if (selectedLayerId === layer.id) handleSelectLayer(null); }}
                                                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 border border-red-100 shadow-sm active:scale-95 hover:bg-red-100 hover:border-red-200 transition-all font-bold"
                                                    title="Excluir camada"
                                                >
                                                    <Icons.Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Inline image adjustments — shown only when an image is selected */}
                                {selectedLayer && selectedLayer.type === 'image' && (
                                    <div className="mx-4 rounded-2xl bg-indigo-50 border border-indigo-200 p-4 flex flex-col gap-4">
                                        <div className="flex items-center gap-3">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={selectedLayer.content} alt="" className="w-9 h-9 rounded-xl object-contain bg-white border border-indigo-200 p-1 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest leading-none">Ajustes</p>
                                                <p className="text-[10px] text-indigo-500 font-bold mt-0.5">Imagem</p>
                                            </div>
                                            <button title="Desselecionar" onClick={() => handleSelectLayer(null)}
                                                className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 shadow-sm active:scale-95 hover:bg-red-100 hover:text-red-500 hover:border-red-200 transition-all flex items-center justify-center text-indigo-600 font-bold">
                                                <Icons.X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="h-px bg-indigo-200" />
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex justify-between">
                                                <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Escala</span>
                                                <span className="text-[11px] font-bold text-indigo-500">{Math.round((selectedLayer.size - 1000) / 10)}%</span>
                                            </div>
                                            <input type="range" min="-100" max="100" value={(selectedLayer.size - 1000) / 10}
                                                title="Escala" className="slider-track-dark"
                                                onChange={e => updateLayer(selectedLayer.id, { size: (Number(e.target.value) * 10) + 1000 })} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex justify-between">
                                                <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Rotação</span>
                                                <span className="text-[11px] font-bold text-indigo-500">{selectedLayer.rotation ?? 0}°</span>
                                            </div>
                                            <input type="range" min="-180" max="180" value={selectedLayer.rotation ?? 0}
                                                title="Rotação" className="slider-track-dark"
                                                onChange={e => updateLayer(selectedLayer.id, { rotation: Number(e.target.value) })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex justify-between">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Altura ↕</span>
                                                    <span className="text-[10px] font-bold text-indigo-400">{Math.round((selectedLayer.scaleY ?? 1) * 100) - 100}%</span>
                                                </div>
                                                <input type="range" min="-100" max="100" value={Math.round((selectedLayer.scaleY ?? 1) * 100) - 100}
                                                    title="Esticar altura" className="slider-track-dark"
                                                    onChange={e => updateLayer(selectedLayer.id, { scaleY: Math.max(0.1, (Number(e.target.value) + 100) / 100) })} />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex justify-between">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Largura ↔</span>
                                                    <span className="text-[10px] font-bold text-indigo-400">{Math.round((selectedLayer.scaleX ?? 1) * 100) - 100}%</span>
                                                </div>
                                                <input type="range" min="-100" max="100" value={Math.round((selectedLayer.scaleX ?? 1) * 100) - 100}
                                                    title="Esticar largura" className="slider-track-dark"
                                                    onChange={e => updateLayer(selectedLayer.id, { scaleX: Math.max(0.1, (Number(e.target.value) + 100) / 100) })} />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => updateLayer(selectedLayer.id, { isMirrored: !selectedLayer.isMirrored })}
                                                className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors">
                                                Espelhar
                                            </button>
                                            <button title="Remover camada" onClick={() => { deleteLayer(selectedLayer.id); handleSelectLayer(null); }}
                                                className="py-2.5 px-4 flex items-center justify-center rounded-xl bg-red-100 border border-red-200 text-red-600 text-xs font-bold hover:bg-red-200 shadow-sm active:scale-95 transition-all">
                                                <Icons.Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div className="px-4">
                                    <ImageControls
                                        layers={layers} expandedLayerId={selectedLayerId} onExpandLayer={handleSelectLayer}
                                        onUpdateLayer={updateLayer} onAddImage={handleAddImage} onDeleteLayer={deleteLayer}
                                        handleUpload={handleUpload} hideAddSection={false}
                                    />
                                </div>
                            </div>
                        )}

                        {/* TAB: Ícones */}
                        {mobileTab === 'icons' && (
                            <div className="pt-5 pb-8 flex flex-col gap-6">
                                {/* Lista de Ícones */}
                                {layers.filter(l => l.type === 'icon').length > 0 && (
                                    <div className="px-4 flex flex-col gap-2">
                                        <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">Camadas de Ícones</p>
                                        {layers.filter(l => l.type === 'icon').map(layer => (
                                            <div
                                                key={layer.id}
                                                onClick={() => handleSelectLayer(layer.id === selectedLayerId ? null : layer.id)}
                                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                                                    layer.id === selectedLayerId
                                                        ? 'bg-amber-50 border-amber-300 shadow-sm'
                                                        : 'bg-white border-slate-200 hover:border-slate-300'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 border border-amber-200 overflow-hidden p-1.5">
                                                        <img src={layer.content} alt="img" className="w-full h-full object-contain" />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700">Ícone selecionado</span>
                                                </div>
                                                <button
                                                    onClick={e => { e.stopPropagation(); deleteLayer(layer.id); if (selectedLayerId === layer.id) handleSelectLayer(null); }}
                                                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 border border-red-100 shadow-sm active:scale-95 hover:bg-red-100 hover:border-red-200 transition-all font-bold"
                                                    title="Excluir camada"
                                                >
                                                    <Icons.Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Ajustes do Ícone Selecionado */}
                                {selectedLayer && selectedLayer.type === 'icon' && (
                                    <div className="mx-4 rounded-2xl bg-amber-50 border border-amber-200 p-4 flex flex-col gap-4">
                                        <div className="flex items-center gap-3">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={selectedLayer.content} alt="" className="w-9 h-9 rounded-xl object-contain bg-white border border-amber-200 p-1 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest leading-none">Ajustes</p>
                                                <p className="text-[10px] text-amber-600 font-bold mt-0.5">Ícone</p>
                                            </div>
                                            <button title="Desselecionar" onClick={() => handleSelectLayer(null)}
                                                className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 shadow-sm active:scale-95 hover:bg-red-100 hover:text-red-500 hover:border-red-200 transition-all flex items-center justify-center text-amber-600 font-bold">
                                                <Icons.X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="h-px bg-amber-200" />
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex justify-between">
                                                <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Escala</span>
                                                <span className="text-[11px] font-bold text-amber-600">{Math.round((selectedLayer.size - 1000) / 10)}%</span>
                                            </div>
                                            <input type="range" min="-100" max="100" value={(selectedLayer.size - 1000) / 10}
                                                title="Escala" className="slider-track-dark"
                                                onChange={e => updateLayer(selectedLayer.id, { size: (Number(e.target.value) * 10) + 1000 })} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex justify-between">
                                                <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Rotação</span>
                                                <span className="text-[11px] font-bold text-amber-600">{selectedLayer.rotation ?? 0}°</span>
                                            </div>
                                            <input type="range" min="-180" max="180" value={selectedLayer.rotation ?? 0}
                                                title="Rotação" className="slider-track-dark"
                                                onChange={e => updateLayer(selectedLayer.id, { rotation: Number(e.target.value) })} />
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <button onClick={() => updateLayer(selectedLayer.id, { isMirrored: !selectedLayer.isMirrored })}
                                                className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors">
                                                Espelhar
                                            </button>
                                            <button title="Remover camada" onClick={() => { deleteLayer(selectedLayer.id); handleSelectLayer(null); }}
                                                className="py-2.5 px-4 flex items-center justify-center rounded-xl bg-red-100 border border-red-200 text-red-600 text-xs font-bold hover:bg-red-200 shadow-sm active:scale-95 transition-all">
                                                <Icons.Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* ── Icon Library ── */}
                                <div className="px-4 flex flex-col gap-4">
                                    <p className="text-[10px] font-black tracking-[0.2em] text-[#94a3b8] uppercase">Adicionar ícone</p>
                                    <div className="flex gap-3 overflow-x-auto pb-1">
                                        {Object.keys(ICON_CATEGORIES).map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setActiveIconCat(cat)}
                                                className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                                                    activeIconCat === cat
                                                        ? 'bg-[#0F172A] border-[#0F172A] text-white shadow-md'
                                                        : 'bg-white border-[#e2e8f0] text-[#64748b]'
                                                }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-5 gap-2">
                                        {(ICON_CATEGORIES[activeIconCat] ?? []).map((url: string, idx: number) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleAddIcon(url)}
                                                className="aspect-square bg-white border border-[#f1f5f9] rounded-xl p-2 shadow-sm hover:shadow-md hover:scale-105 transition-all flex items-center justify-center"
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={url} crossOrigin="anonymous" alt="icon" className="w-full h-full object-contain opacity-70 hover:opacity-100 transition-opacity" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: Texto */}
                        {activeMobileTab === 'text' && (
                            <div className="px-4 pt-5 pb-8 flex flex-col gap-4">
                                {/* ── Add text field ─────────────────────── */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Escreva um texto..."
                                        value={draftText}
                                        onChange={e => setDraftText(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter' && draftText.trim()) { handleAddText(draftText); } }}
                                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-rose-400 transition-colors placeholder:font-normal placeholder:text-slate-400"
                                    />
                                    <button
                                        onClick={() => draftText.trim() && handleAddText(draftText)}
                                        disabled={!draftText.trim()}
                                        className="shrink-0 w-10 h-10 rounded-xl bg-linear-to-br from-rose-400 to-orange-400 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform disabled:opacity-40"
                                        title="Adicionar texto"
                                    >
                                        <Icons.Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* ── Text layer list ─────────────────────── */}
                                {layers.filter(l => l.type === 'text').length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Camadas de texto</p>
                                        {layers.filter(l => l.type === 'text').map(layer => (
                                            <div
                                                key={layer.id}
                                                onClick={() => handleSelectLayer(layer.id === selectedLayerId ? null : layer.id)}
                                                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                                                    layer.id === selectedLayerId
                                                        ? 'bg-rose-50 border-rose-300 shadow-sm'
                                                        : 'bg-white border-slate-200 hover:border-slate-300'
                                                }`}
                                            >
                                                <div className="w-7 h-7 rounded-lg bg-linear-to-br from-rose-400 to-orange-400 flex items-center justify-center shrink-0">
                                                    <Icons.Type className="w-3.5 h-3.5 text-white" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={layer.content}
                                                    aria-label="Editar texto da camada"
                                                    onClick={e => e.stopPropagation()}
                                                    onChange={e => setLayers(prev => prev.map(l => l.id === layer.id ? { ...l, content: e.target.value } : l))}
                                                    className="flex-1 min-w-0 bg-transparent text-sm font-bold text-slate-700 outline-none focus:bg-white focus:px-1.5 focus:rounded-lg transition-all"
                                                />
                                                <button
                                                    onClick={e => { e.stopPropagation(); setLayers(prev => prev.filter(l => l.id !== layer.id)); if (selectedLayerId === layer.id) handleSelectLayer(null); }}
                                                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 border border-red-100 shadow-sm active:scale-95 hover:bg-red-100 hover:border-red-200 transition-all font-bold"
                                                    title="Excluir camada"
                                                >
                                                    <Icons.Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* ── Adjustment panel ─────────────────────── */}
                                {selectedLayer && selectedLayer.type === 'text' && (
                                    <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 flex flex-col gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-linear-to-br from-rose-400 to-orange-400 shrink-0">
                                                <Icons.Type className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <p className="flex-1 text-[11px] font-black text-slate-700 uppercase tracking-widest">Ajustes</p>
                                            <button title="Fechar" onClick={() => handleSelectLayer(null)}
                                                className="w-8 h-8 rounded-full bg-rose-100 border border-rose-200 shadow-sm active:scale-95 hover:bg-red-100 hover:text-red-500 hover:border-red-200 transition-all flex items-center justify-center text-rose-600 font-bold">
                                                <Icons.X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="h-px bg-rose-200" />

                                        {/* Content */}
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Texto</span>
                                            <input type="text" placeholder="Conteúdo..."
                                                value={selectedLayer.content}
                                                onChange={e => updateLayer(selectedLayer.id, { content: e.target.value })}
                                                className="w-full bg-white border border-rose-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-rose-400 transition-colors" />
                                        </div>

                                        {/* Size */}
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex justify-between">
                                                <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Tamanho</span>
                                                <span className="text-[11px] font-bold text-rose-500">{selectedLayer.size}%</span>
                                            </div>
                                            <input type="range" min="10" max="1000" value={selectedLayer.size}
                                                title="Tamanho" className="slider-track-dark"
                                                onChange={e => updateLayer(selectedLayer.id, { size: Number(e.target.value) })} />
                                        </div>

                                        {/* Rotation */}
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex justify-between">
                                                <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Rotação</span>
                                                <span className="text-[11px] font-bold text-rose-500">{selectedLayer.rotation ?? 0}°</span>
                                            </div>
                                            <input type="range" min="-180" max="180" value={selectedLayer.rotation ?? 0}
                                                title="Rotação" className="slider-track-dark"
                                                onChange={e => updateLayer(selectedLayer.id, { rotation: Number(e.target.value) })} />
                                        </div>

                                        {/* Style buttons */}
                                        <div className="flex gap-2">
                                            <button onClick={() => updateLayer(selectedLayer.id, { underline: !selectedLayer.underline })}
                                                className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 ${selectedLayer.underline ? 'bg-rose-100 border-rose-300 text-rose-500' : 'bg-white border-slate-200 text-slate-500'}`}
                                                title="Sublinhado"><Icons.Underline className="w-3.5 h-3.5" /> U</button>
                                            <button onClick={() => updateLayer(selectedLayer.id, { italic: !selectedLayer.italic })}
                                                className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 ${selectedLayer.italic ? 'bg-rose-100 border-rose-300 text-rose-500' : 'bg-white border-slate-200 text-slate-500'}`}
                                                title="Itálico"><Icons.Italic className="w-3.5 h-3.5" /> I</button>
                                            <button onClick={() => updateLayer(selectedLayer.id, { stroke: !selectedLayer.stroke })}
                                                className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 ${selectedLayer.stroke ? 'bg-rose-100 border-rose-300 text-rose-500' : 'bg-white border-slate-200 text-slate-500'}`}
                                                title="Contorno"><Icons.Bold className="w-3.5 h-3.5" /> B</button>
                                            <button title="Remover" onClick={() => { deleteLayer(selectedLayer.id); handleSelectLayer(null); }}
                                                className="py-2.5 px-4 flex items-center justify-center rounded-xl bg-red-100 border border-red-200 text-red-600 text-xs font-bold hover:bg-red-200 shadow-sm active:scale-95 transition-all">
                                                <Icons.Trash className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Color */}
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Cor</span>
                                            <div className="grid grid-cols-8 gap-2">
                                                {EDITOR_COLORS.slice(0, 16).map((c) => (
                                                    <button key={c.name}
                                                        onClick={() => updateLayer(selectedLayer.id, { color: c.valor })}
                                                        className={`w-8 h-8 rounded-full border-2 transition-all ${selectedLayer.color === c.valor ? 'border-rose-400 scale-110 shadow-md' : 'border-slate-200 hover:scale-105'}`}
                                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                        style={(c as any).style || { backgroundColor: c.valor }}
                                                        title={c.name}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Font */}
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Fonte</span>
                                            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                                                {FONTS.map((f) => (
                                                    <button key={f.name}
                                                        onClick={() => updateLayer(selectedLayer.id, { font: f.family })}
                                                        style={{ fontFamily: f.family }}
                                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${selectedLayer.font === f.family ? 'bg-rose-50 border-rose-300 text-rose-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                                                    >{f.name}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── Empty state ────────────────────────── */}
                                {layers.filter(l => l.type === 'text').length === 0 && (
                                    <p className="text-center text-[11px] text-slate-400 font-bold py-4">
                                        Adicione um texto acima para começar
                                    </p>
                                )}
                            </div>
                        )}

                        {/* TAB: Comprar */}
                        {activeMobileTab === 'summary' && (
                            <div className="px-4 py-6">
                                <div className="rounded-3xl bg-linear-to-br from-slate-50 to-white border border-slate-200/60 p-5 text-center shadow-sm">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Seu design está pronto!</p>
                                    <p className="font-black text-2xl text-slate-900 mb-1">
                                        R$ {SKUS[sku]?.price?.toFixed(2).replace('.', ',') ?? '89,90'}
                                    </p>
                                    <p className="text-[11px] text-slate-400 mb-5">Frete grátis acima de R$&nbsp;199</p>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isBusy}
                                        className="w-full btn-gradient text-white py-4 rounded-2xl font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50"
                                    >
                                        <Icons.ShoppingBag className="w-5 h-5" />
                                        Adicionar ao Carrinho
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Safe area */}
                        <div className="h-6" />

                        {/* Portal container for Debug Tools (Dev Only) */}
                        <div id="debug-container-mobile" />
                    </div>
                </div>
                );
            })()}

            {/* Main Area — DESKTOP ONLY (hidden on mobile) */}
            <main className="flex-1 hidden lg:grid lg:grid-cols-12 lg:gap-4 lg:p-4 overflow-hidden relative">


                {/* LEFT Sidebar — Text & Icons */}
                <aside className={`lg:col-span-2 editor-sidebar rounded-[8px] p-4 flex-col lg:h-full overflow-hidden relative z-20 ${activeMobileTab === 'text' ? 'flex absolute inset-x-3 top-3 bottom-19 lg:static' : 'hidden lg:flex'}`}>
                    <div className="flex items-center gap-2.5 mb-5 shrink-0">
                        <div className="w-6 h-6 rounded-[6px] bg-linear-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white shadow">
                            <Icons.Type className="w-3 h-3" />
                        </div>
                        <h2 className="font-black text-[11px] uppercase tracking-widest text-slate-600">Texto & Ícones</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                        <TextControls
                            layers={layers} expandedLayerId={selectedLayerId} onExpandLayer={handleSelectLayer}
                            onUpdateLayer={updateLayer} onAddText={handleAddText} onDeleteLayer={deleteLayer}
                            activeIconCat={activeIconCat} setActiveIconCat={setActiveIconCat}
                            ICON_CATEGORIES={ICON_CATEGORIES} onAddIcon={handleAddIcon} onNewTextChange={setDraftText}
                        />
                    </div>
                    <button className="lg:hidden mt-3 shrink-0 w-full py-2.5 bg-slate-100 rounded-[8px] font-bold text-slate-600 border border-slate-200 text-sm" onClick={() => setActiveMobileTab(null)}>Fechar</button>
                </aside>

                {/* CENTER — Preview + Floating Property Panels */}
                <section className="flex-1 min-h-0 w-full lg:col-span-8 flex flex-col lg:items-center lg:justify-center relative">

                    {/* Admin Monitor */}
                    {isAdmin && showCalibration && selectedLayerId && layers.find(l => l.id === selectedLayerId) && (
                        <div className="absolute top-4 right-4 bg-[#0F172A]/95 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-xl z-50 text-xs w-44 font-mono">
                            <h3 className="font-bold text-slate-200 mb-2 border-b border-white/10 pb-2">Monitor</h3>
                            {(() => {
                                const al = layers.find(l => l.id === selectedLayerId)!;
                                return (
                                    <>
                                        <div className="space-y-1 text-slate-400 mb-3">
                                            <div className="flex justify-between"><span>X:</span><span className="text-slate-200">{al.x.toFixed(1)}%</span></div>
                                            <div className="flex justify-between"><span>Y:</span><span className="text-slate-200">{al.y.toFixed(1)}%</span></div>
                                            <div className="flex justify-between"><span>Size:</span><span className="text-slate-200">{al.size.toFixed(0)}</span></div>
                                            {al.rotation !== undefined && <div className="flex justify-between"><span>Rot:</span><span className="text-slate-200">{al.rotation.toFixed(0)}°</span></div>}
                                        </div>
                                        <button onClick={() => {
                                            setDefaultIconPosition({ x: al.x, y: al.y });
                                            localStorage.setItem('mimuus_default_position_icon', JSON.stringify({ x: al.x, y: al.y }));
                                            setDefaultIconSize(al.size);
                                            localStorage.setItem('mimuus_default_size_icon', al.size.toString());
                                            setDefaultIconRotation(al.rotation || 0);
                                            localStorage.setItem('mimuus_default_rotation_icon', (al.rotation || 0).toString());
                                            toast.success("Padrão atualizado!");
                                        }} className="w-full bg-white/10 text-white rounded-lg py-1.5 font-bold hover:bg-white/20 transition-colors text-[10px]">
                                            Gravar Posição
                                        </button>
                                    </>
                                );
                            })()}
                        </div>
                    )}



                    {/* Preview */}
                    <div className="w-full flex flex-col relative min-h-0 lg:flex-1 lg:gap-2">
                        {/* Bottle color selector — desktop only; mobile uses the bottom tab panel */}
                        <div className="shrink-0 w-full hidden lg:flex items-center justify-center py-2" data-html2canvas-ignore>
                            <BottleColorPicker selectedSku={sku} onSelectSku={setSku} />
                        </div>
                        {/* Preview — desktop: height-constrained square; mobile: full-width 1:1 */}
                        <div className="w-full min-h-0 lg:flex-1 lg:flex lg:items-center lg:justify-center">
                            {/* Desktop wrapper keeps square within available height */}
                            <div className="hidden lg:block aspect-square h-full max-h-full max-w-full relative">
                                {/* Property Panels docked to the bottle (16px gap) */}
                                {/* Removed floating Property Panels */}
                                <BottlePreview
                                    sku={sku} lidColor={lidColor} layers={layers} selectedLayerId={selectedLayerId} isBusy={isBusy}
                                    onUndo={() => {}} onRedo={() => {}} onReset={() => {}}
                                    canUndo={canUndo} canRedo={canRedo} onSelectLayer={handleSelectLayer} onUpdateLayer={updateLayer}
                                    draftText={draftText} draftTextPosition={defaultTextPosition}
                                />
                            </div>
                            {/* Mobile wrapper — full-width square, no height constraint */}
                            <div className="lg:hidden w-full aspect-square">
                                <BottlePreview
                                    sku={sku} lidColor={lidColor} layers={layers} selectedLayerId={selectedLayerId} isBusy={isBusy}
                                    onUndo={() => {}} onRedo={() => {}} onReset={() => {}}
                                    canUndo={canUndo} canRedo={canRedo} onSelectLayer={handleSelectLayer} onUpdateLayer={updateLayer}
                                    draftText={draftText} draftTextPosition={defaultTextPosition}
                                />
                            </div>
                        </div>
                    </div>
                </section>


                {/* RIGHT Sidebar — Images & Assets */}
                <aside className={`lg:col-span-2 editor-sidebar rounded-[8px] p-4 flex-col lg:h-full overflow-hidden relative z-20 ${activeMobileTab === 'stamps' ? 'flex absolute inset-x-3 top-3 bottom-19 lg:static' : 'hidden lg:flex'}`}>
                    <div className="flex items-center gap-2.5 mb-5 shrink-0">
                        <div className="w-6 h-6 rounded-[6px] bg-linear-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow">
                            <Icons.Image className="w-3 h-3" />
                        </div>
                        <h2 className="font-black text-[11px] uppercase tracking-widest text-slate-600">Imagens</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-4">
                        <ImageControls
                            layers={layers} expandedLayerId={selectedLayerId} onExpandLayer={handleSelectLayer}
                            onUpdateLayer={updateLayer} onAddImage={handleAddImage} onDeleteLayer={deleteLayer}
                            handleUpload={handleUpload} hideAddSection={false}
                        />
                    </div>
                    <button className="lg:hidden mt-3 shrink-0 w-full py-2.5 bg-slate-100 rounded-xl font-bold text-slate-600 border border-slate-200 text-sm" onClick={() => setActiveMobileTab(null)}>Fechar</button>
                </aside>

            </main>



            {/* Modals and Overlays */}
            <ShowcaseModal isOpen={showShowcase} onClose={() => setShowShowcase(false)} onConfirm={() => setShowShowcase(false)} sku={sku} lidColor={lidColor} />

            {isAdmin && (
                <CaptureCalibrationModal 
                    isOpen={showCapturePreview} onClose={() => setShowCapturePreview(false)} onConfirmCapture={handleConfirmCapture}
                    sku={sku} lidColor={lidColor} layers={layers} isBusy={isBusy} defaultTextPosition={defaultTextPosition}
                />
            )}

            {isAdmin && (
                <DebugPreviewModal 
                    isOpen={showDebugPreview} 
                    onClose={() => setShowDebugPreview(false)} 
                    sku={sku} 
                    lidColor={lidColor} 
                    layers={layers} 
                />
            )}

            <AnimatePresence>
                {showAdminModal && (
                    <ProductRegistrationModal 
                        onClose={() => setShowAdminModal(false)}
                        onSave={async (data) => {
                            toast.loading("Salvando...");
                            try {
                                const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                                const res = await createProduct({
                                    name: data.name, slug: slug, description: data.description, base_price: parseFloat(data.price),
                                    category_id: data.category_id, tags: data.tags, images: data.previewImage ? [data.previewImage] : [],
                                    metadata: { layers: layers.map(l => ({ ...l, id: uuidv4() })), sku, capturedAt: new Date().toISOString() }
                                });
                                toast.dismiss();
                                if (res.success) { setShowAdminModal(false); toast.success("Sucesso!"); }
                                else toast.error("Erro: " + res.error);
                            } catch (error) {
                                console.error(error);
                                toast.error("Erro ao salvar produto");
                            }
                        }}
                        initialData={{ name: `Garrafa ${sku} Custom`, price: SKUS[sku]?.price || 89.90, color: SKUS[sku]?.color }}
                        previewImage={adminPreviewImage || SKUS[sku]?.img} 
                    />
                )}
            </AnimatePresence>

            <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Compartilhar Template?</DialogTitle>
                        <DialogDescription>
                            Salve seu design como template para outros usuários. Você ganha <span className="text-brand-primary font-bold">50 Pontos</span> se alguém usar!
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center py-4">
                        <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-100 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            {SKUS[sku] && <img src={generatedPreview || SKUS[sku].img} className="w-full h-full object-cover" alt="Preview"/>}
                        </div>
                    </div>
                    <DialogFooter className="flex gap-2 sm:justify-center">
                        <Button variant="outline" onClick={() => { setShowShareModal(false); setShowShowcase(true); }}>Não, obrigado</Button>
                        <Button className="bg-brand-primary text-white" onClick={() => {
                            toast.success("Template compartilhado! +10xp"); addXP(10, 'Compartilhamento de Template');
                            setShowShareModal(false); setShowShowcase(true);
                        }}>Compartilhar e Ganhar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1, pointerEvents: 'none', opacity: 0 }}>
                {(() => {
                    const getVal = (key: string, def: string) => {
                        if (typeof window === 'undefined') return def;
                        return localStorage.getItem(`mimuus_capture_${sku}_${key}`) || localStorage.getItem(`mimuus_capture_${key}`) || def;
                    };
                    return (
                        <div id="checkout-capture-target" style={{ 
                                width: `${parseInt(getVal('width', '800'))}px`, height: `${parseInt(getVal('height', '1000'))}px`, 
                                padding: `${parseFloat(getVal('margin', '0'))}px`,
                                backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                            }}>
                            <BottlePreview
                                sku={sku} lidColor={lidColor} layers={layers} selectedLayerId={null} isBusy={false}
                                onUndo={() => {}} onRedo={() => {}} onReset={() => {}} canUndo={false} canRedo={false} onSelectLayer={() => {}} onUpdateLayer={() => {}}
                                draftText="" draftTextPosition={defaultTextPosition}
                                zoom={parseFloat(getVal('zoom', '1.2'))} yOffset={(parseFloat(getVal('y_position', '50')) - 50) * 3}
                                hideCanvasBackground={true} hideUI={true}
                            />
                        </div>
                    );
                })()}
            </div>

        </div>
    );
};
