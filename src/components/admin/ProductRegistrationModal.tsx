"use client";

import { useState, useEffect } from "react";
import { X, Plus, Tag, ChevronDown } from "lucide-react";
// We'll use basic UI for now, relying on Tailwind
import { motion } from "framer-motion";
import { getCategories, uploadProductImage } from "@/actions/admin-actions";
import { Category } from "@/types";
import { toast } from "sonner";

interface ProductRegistrationModalProps {
  onClose: () => void;
  onSave: (data: {
    name: string;
    slug: string;
    price: string;
    description: string;
    category_id: string;
    stock: string;
    tags: string[];
    color: string;
    images: string[];
    previewImage?: string;
  }) => void;
  initialData?: {
    id?: string;
    name?: string;
    slug?: string;
    price?: number;
    description?: string;
    category_id?: string;
    color?: string;
    tags?: string[];
    stock?: number;
    images?: string[];
  };
  previewImage?: string;
  // Capture Positioning props
  captureSettings?: {
    x: number;
    y: number;
    scale: number;
    width: number;
    height: number;
  };
  onUpdateCaptureSettings?: (settings: any) => void;
  onTriggerCapture?: () => void;
}

const ProductRegistrationModal: React.FC<ProductRegistrationModalProps> = ({ onClose, onSave, initialData, previewImage, captureSettings, onUpdateCaptureSettings, onTriggerCapture }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isAutoSlug, setIsAutoSlug] = useState(!initialData?.slug);
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [stock, setStock] = useState(initialData?.stock?.toString() || "100");
  const [description, setDescription] = useState(initialData?.description || "");
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [selectedColor, setSelectedColor] = useState(initialData?.color || "#000000"); // Default color
  const [extraImages, setExtraImages] = useState<string[]>(initialData?.images?.filter(img => img !== previewImage) || []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const [tagInput, setTagInput] = useState("");

  // Load categories
  useEffect(() => {
    async function load() {
      const res = await getCategories();
      if (res.success && res.categories) {
        const cats = res.categories as unknown as Category[];
        setCategories(cats);
        if (!categoryId && cats.length > 0) {
          setCategoryId(cats[0].id);
        }
      }
      setLoadingCats(false);
    }
    load();
  }, [categoryId]);

  // Auto-generate slug from name if enabled
  useEffect(() => {
    if (isAutoSlug && name) {
      const generatedSlug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  }, [name, isAutoSlug]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine preview image with extra images for the gallery
    const allImages = previewImage ? [previewImage, ...extraImages] : extraImages;
    
    onSave({
      name,
      slug,
      price,
      description,
      category_id: categoryId,
      stock,
      tags,
      color: selectedColor,
      images: allImages,
      previewImage
    });
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-black rounded-lg flex items-center justify-center text-white shadow-lg">
                <Plus size={20} />
            </div>
            <div>
                <h2 className="text-lg font-black tracking-tight text-gray-900 leading-none">Master Supreme</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">SISTEMA INTEGRADO DE CADASTRO</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:p-10 flex flex-col md:flex-row gap-10">
            {/* Left: Preview & Capture Control */}
            <div className="w-full md:w-80 flex flex-col gap-6">
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Preview da Capa</label>
                    <div className="aspect-3/4 bg-gray-100 rounded-2xl overflow-hidden border-2 border-gray-200 relative group flex items-center justify-center shadow-inner">
                        {previewImage ? (
                            <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-white">
                                <img 
                                    src={previewImage} 
                                    alt="Preview" 
                                    className="object-contain transition-transform duration-200"
                                    style={{
                                        transform: `scale(${captureSettings?.scale || 1}) translate(${captureSettings?.x || 0}px, ${captureSettings?.y || 0}px)`,
                                        transformOrigin: 'center center'
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-3">
                                <div className="w-10 h-10 border-4 border-gray-100 border-t-brand-pink rounded-full animate-spin" />
                                <span className="text-[10px] font-bold uppercase tracking-widest animate-pulse">Capturando...</span>
                            </div>
                        )}
                        <div className="absolute bottom-3 right-3 bg-brand-black/80 text-white text-[8px] font-bold px-2 py-1 rounded backdrop-blur-sm border border-white/20">
                            HQ CAPTURE v2.0
                        </div>
                    </div>
                </div>

                {/* Capture Positioning Controls */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-4">
                    <h3 className="text-[10px] font-black uppercase text-gray-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" /> Calibração de Lente
                    </h3>
                    
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Eixo Horizontal</label>
                                <span className="text-[10px] font-mono text-brand-pink font-bold">{captureSettings?.x}px</span>
                            </div>
                            <input 
                                type="range" min="-200" max="200" step="5"
                                value={captureSettings?.x || 0}
                                onChange={(e) => onUpdateCaptureSettings?.({ ...captureSettings, x: parseInt(e.target.value) })}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Eixo Vertical</label>
                                <span className="text-[10px] font-mono text-brand-pink font-bold">{captureSettings?.y}px</span>
                            </div>
                            <input 
                                type="range" min="-200" max="200" step="5"
                                value={captureSettings?.y || 0}
                                onChange={(e) => onUpdateCaptureSettings?.({ ...captureSettings, y: parseInt(e.target.value) })}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Magnificação</label>
                                <span className="text-[10px] font-mono text-brand-pink font-bold">{(captureSettings?.scale || 1).toFixed(2)}x</span>
                            </div>
                            <input 
                                type="range" min="0.5" max="2.5" step="0.05"
                                value={captureSettings?.scale || 1}
                                onChange={(e) => onUpdateCaptureSettings?.({ ...captureSettings, scale: parseFloat(e.target.value) })}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                            />
                        </div>
                    </div>

                    <button 
                        type="button"
                        onClick={onTriggerCapture}
                        className="w-full bg-white border-2 border-gray-900 text-gray-900 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all shadow-[4px_4px_0px_#ccc] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                        📸 Recapturar Agora
                    </button>
                </div>
            </div>

            {/* Right: Comprehensive Form */}
            <form id="product-form" onSubmit={handleSave} className="flex-1 space-y-8">
                {/* Main Identity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nome Oficial</label>
                        <input
                            type="text"
                            required
                            className="w-full border-2 border-gray-100 rounded-lg px-4 py-3 text-sm focus:border-brand-pink outline-none font-bold text-gray-900 bg-gray-50/50 transition-all focus:bg-white"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ex: Garrafa Mimuus Gold Edition"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">URL Amigável (Slug)</label>
                            <button 
                                type="button"
                                onClick={() => setIsAutoSlug(!isAutoSlug)}
                                className={`text-[8px] font-bold px-1.5 py-0.5 rounded border transition-colors ${isAutoSlug ? 'bg-brand-pink/10 border-brand-pink text-brand-pink' : 'bg-gray-100 border-gray-300 text-gray-400'}`}
                            >
                                {isAutoSlug ? 'AUTO' : 'MANUAL'}
                            </button>
                        </div>
                        <input
                            type="text"
                            required
                            readOnly={isAutoSlug}
                            className={`w-full border-2 border-gray-100 rounded-lg px-4 py-3 text-sm outline-none font-mono text-gray-600 bg-gray-50/50 transition-all ${isAutoSlug ? 'opacity-60 cursor-not-allowed' : 'focus:border-brand-pink focus:bg-white'}`}
                            value={slug}
                            onChange={e => setSlug(e.target.value)}
                            placeholder="garrafa-mimuus-gold"
                        />
                    </div>
                </div>

                {/* Financials & Inventory */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Preço de Venda (R$)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">R$</span>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="w-full border-2 border-gray-100 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-brand-pink outline-none font-black text-gray-900 bg-gray-50/50 transition-all focus:bg-white"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Estoque Inicial</label>
                        <input
                            type="number"
                            required
                            className="w-full border-2 border-gray-100 rounded-lg px-4 py-3 text-sm focus:border-brand-pink outline-none font-black text-gray-900 bg-gray-50/50 transition-all focus:bg-white"
                            value={stock}
                            onChange={e => setStock(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Categoria Oficial</label>
                        <div className="relative">
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                disabled={loadingCats}
                                className="w-full border-2 border-gray-100 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-brand-pink outline-none font-bold text-gray-900 bg-gray-50/50 appearance-none transition-all focus:bg-white disabled:opacity-50"
                            >
                                {loadingCats ? (
                                    <option>Carregando...</option>
                                ) : (
                                    categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))
                                )}
                            </select>
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Identity & Aesthetics */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Assinatura Cromática</label>
                    <div className="flex items-center gap-4 p-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl">
                        <div className="relative group">
                            <input
                                type="color"
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white shadow-md relative z-10 p-0 overflow-hidden"
                            />
                            <div className="absolute -inset-1 bg-gradient-to-tr from-brand-pink to-brand-purple rounded-lg opacity-20 blur group-hover:opacity-40 transition-opacity" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">{selectedColor}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">HEX CODE IDENTIFIER</span>
                        </div>
                    </div>
                </div>

                {/* Vibe & Tags */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Vibe do Produto (Tags)</label>
                  <div className="flex flex-wrap gap-2 p-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl min-h-[60px]">
                    {tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-brand-black text-white px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-2 group transition-all"
                      >
                        {tag.toUpperCase()}
                        <button 
                          type="button"
                          onClick={() => setTags(tags.filter((_, i) => i !== index))}
                          className="hover:text-brand-pink transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                    <div className="flex-1 min-w-[120px]">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={addTag}
                        placeholder="Add vibe (press Enter)..."
                        className="w-full bg-transparent border-none outline-none text-[10px] font-bold text-gray-600 placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Gallery Management */}
                <div className="space-y-4 border-t border-gray-100 pt-6">
                    <div className="flex justify-between items-end">
                         <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-900">Galeria de Multimídia</label>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">SUPORTA HIGH RESOLUTION ASSETS</p>
                         </div>
                         <div className="text-[10px] text-gray-300 font-black">DRAG & DROP READY</div>
                    </div>
                    
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                         {/* Main Preview (Static Reference) */}
                         {previewImage && (
                            <div className="aspect-square rounded-lg border-4 border-brand-pink overflow-hidden relative group shadow-sm bg-white">
                                <img src={previewImage} className="w-full h-full object-contain p-1" />
                                <div className="absolute top-0 left-0 bg-brand-pink text-white text-[8px] font-black px-1.5 py-0.5 rounded-br-lg">ROOT</div>
                            </div>
                         )}
                         
                         {/* Extra Images */}
                         {extraImages.map((url, idx) => (
                            <div key={idx} className="aspect-square rounded-lg border-2 border-gray-100 overflow-hidden relative group hover:border-brand-black transition-all bg-gray-50">
                                <img src={url} className="w-full h-full object-cover" />
                                <button 
                                    type="button"
                                    onClick={() => setExtraImages(extraImages.filter((_, i) => i !== idx))}
                                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all scale-75 shadow-lg"
                                >
                                    <X size={12} />
                                </button>
                                <div className="absolute bottom-0 inset-x-0 bg-brand-black/60 text-white text-[6px] font-bold p-1 text-center opacity-0 group-hover:opacity-100 uppercase">IMG_{idx+1}</div>
                            </div>
                         ))}

                         {/* Unified Add Button */}
                         <label className={`aspect-square rounded-lg border-2 border-dashed transition-all ${
                             isUploading
                               ? 'border-brand-pink bg-pink-50 cursor-wait'
                               : 'border-gray-200 hover:border-brand-black hover:bg-gray-50 cursor-pointer'
                           } flex flex-col items-center justify-center gap-1 group scale-100 active:scale-95`}>
                            <input 
                                type="file" 
                                accept="image/*" 
                                multiple
                                className="hidden"
                                disabled={isUploading}
                                onChange={async (e) => {
                                    if (e.target.files) {
                                        setIsUploading(true);
                                        const files = Array.from(e.target.files);
                                        for (const file of files) {
                                            const formData = new FormData();
                                            formData.append('file', file);
                                            try {
                                                const res = await uploadProductImage(formData);
                                                if (res.success && res.url) {
                                                    setExtraImages(prev => [...prev, res.url!]);
                                                } else {
                                                    toast.error(`Falha ao enviar ${file.name}: ${res.error || 'Erro desconhecido'}`);
                                                }
                                            } catch {
                                                toast.error(`Erro ao enviar ${file.name}.`);
                                            }
                                        }
                                        setIsUploading(false);
                                    }
                                }}
                            />
                            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-brand-black group-hover:scale-110 transition-all border border-gray-100">
                                {isUploading ? (
                                  <svg className="animate-spin w-4 h-4 text-brand-pink" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                                  </svg>
                                ) : (
                                  <Plus size={16} />
                                )}
                            </div>
                            <span className="text-[8px] font-black text-gray-400 group-hover:text-brand-black uppercase pt-1">
                                {isUploading ? 'ENVIANDO' : 'UPLOAD'}
                            </span>
                         </label>
                    </div>
                </div>

                {/* Narrative Details */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Marketing & Copywriting</label>
                    <textarea
                        className="w-full border-2 border-gray-100 rounded-2xl px-4 py-4 text-sm focus:border-brand-pink outline-none font-medium text-gray-700 bg-gray-50/50 min-h-[140px] transition-all focus:bg-white resize-none"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Descreva a alma deste produto: materiais, benefícios e o que o torna único..."
                    />
                </div>
            </form>
        </div>

        {/* Action Footer */}
        <div className="px-10 py-6 bg-gray-900 border-t border-gray-800 flex justify-between items-center">
             <div className="hidden sm:flex flex-col">
                <span className="text-white font-black text-xs uppercase tracking-tighter">Workflow: Alpha Beta</span>
                <span className="text-gray-500 font-bold text-[8px] uppercase tracking-widest">Aguardando confirmação de protocolo</span>
             </div>
             <div className="flex gap-4">
                <button onClick={onClose} className="px-6 py-2.5 text-xs font-black text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
                    Abortar
                </button>
                <button
                    type="submit"
                    form="product-form"
                    className="bg-brand-pink text-white px-10 py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-[0px_8px_20px_rgba(255,100,200,0.3)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3"
                >
                    <Plus size={16} className="bg-white/20 rounded-md p-0.5" /> Efetivar Registro
                </button>
             </div>
        </div>
      </motion.div>
    </div>
  );
}
export default ProductRegistrationModal;
