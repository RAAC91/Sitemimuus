"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Save, ArrowLeft, Loader2, Plus, X, Monitor, Type, Palette, PlusCircle } from "lucide-react";
import Link from "next/link";
import { createProduct, updateProduct, uploadProductImage } from "@/actions/admin-actions";
import { Product } from "@/types";

interface ProductFormProps {
  initialData?: Product;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;
  
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    category: initialData?.category || "garrafas",
    subcategory: "",
    base_price: initialData?.price || 89.90,
    sale_price: initialData?.oldPrice || null,
    stock: initialData?.stock || 100,
    images: initialData?.images || [],
    tags: initialData?.tags || [],
    is_active: true,
  });

  const [tagInput, setTagInput] = useState("");

  // Editor Mock State
  const [editorState, setEditorState] = useState({
    color: "#FF6B9D",
    text: "MIMUUS",
  });

  useEffect(() => {
    if (initialData) {
        const sub = (initialData as any).subcategory || "";
        setFormData(prev => ({ 
            ...prev, 
            subcategory: sub,
            name: initialData.name,
            slug: initialData.slug || "",
            description: initialData.description || "",
            category: initialData.category || "Garrafas",
            base_price: initialData.price,
            sale_price: initialData.oldPrice || null,
            stock: initialData.stock || 0,
            images: initialData.images || [],
            tags: initialData.tags || []
        }));
    }
  }, [initialData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const form = new FormData();
      form.append("file", file);
      
      // Get slug for folder organization
      const currentSlug = formData.slug || formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || "temp-upload";
      
      const result = await uploadProductImage(form, currentSlug);
      if (result.success && result.url) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, result.url!]
        }));
        toast.success("Imagem enviada!");
      } else {
        toast.error("Erro no upload: " + result.error);
      }
    } catch (error) {
      toast.error("Erro ao enviar imagem");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    try {
      setIsSaving(true);
      
      const slug = formData.slug || formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

      const payload = {
        ...formData,
        slug: slug || Date.now().toString(),
        price: formData.base_price, // Ensure compatibility with action expectations if needed
        sale_price: formData.sale_price !== null ? formData.sale_price : undefined,
      };

      if (isEditing) {
        const result = await updateProduct(initialData!.id.toString(), payload as any);
        if (result.success) {
          toast.success("Produto atualizado!");
          router.push("/x7z-4dm1n-P4n3l/products");
          router.refresh();
        } else {
          toast.error("Erro: " + result.error);
        }
      } else {
        const result = await createProduct(payload);
        if (result.success) {
          toast.success("Produto criado!");
          router.push("/x7z-4dm1n-P4n3l/products");
          router.refresh();
        } else {
          toast.error("Erro: " + result.error);
        }
      }
    } catch (error) {
      toast.error("Erro ao salvar produto");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-12 gap-6 p-2">
      
      {/* LEFT: Product Form */}
      <form onSubmit={handleSubmit} className="lg:col-span-5 flex flex-col h-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-brand-black">
         <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button type="button" onClick={() => router.push('/x7z-4dm1n-P4n3l/products')} className="p-2 hover:bg-gray-50 rounded-lg transition">
                    <ArrowLeft size={20} className="text-gray-400" />
                </button>
                <div>
                    <h2 className="text-xl font-black">{isEditing ? "Editar Produto" : "Novo Produto"}</h2>
                    <p className="text-xs text-gray-500">Informações e catálogo.</p>
                </div>
            </div>
            <button 
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-brand-black text-white text-sm font-bold rounded-lg hover:bg-gray-900 transition flex items-center gap-2 disabled:opacity-50"
            >
               {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
               Salvar
            </button>
         </div>
         
         <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
               <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Nome do Produto</label>
               <input 
                 type="text" 
                 required
                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink outline-none transition font-bold"
                 placeholder="Ex: Garrafa Aurora"
                 value={formData.name}
                 onChange={e => setFormData({...formData, name: e.target.value})}
               />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Preço (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink outline-none transition font-bold"
                    value={formData.base_price}
                    onChange={e => setFormData({...formData, base_price: parseFloat(e.target.value)})}
                  />
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Estoque</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink outline-none transition font-bold"
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
                  />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Categoria</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink outline-none transition font-bold"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="garrafas">Garrafas</option>
                    <option value="copos">Copos</option>
                    <option value="acessórios">Acessórios</option>
                    <option value="kits">Kits</option>
                  </select>
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Subcategoria (Vibe)</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink outline-none transition font-bold"
                    value={formData.subcategory}
                    onChange={e => setFormData({...formData, subcategory: e.target.value})}
                  >
                    <option value="">Nenhuma</option>
                    <option value="fashion">Fashion</option>
                    <option value="vibrant">Vibrant</option>
                    <option value="clean">Clean</option>
                    <option value="corporate">Corporate</option>
                    <option value="kids">Kids</option>
                  </select>
               </div>
            </div>

            <div>
               <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Imagens</label>
               <div className="grid grid-cols-3 gap-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg bg-gray-100 overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-brand-pink transition group">
                    {uploadingImage ? <Loader2 size={24} className="animate-spin text-gray-400" /> : <Plus size={24} className="text-gray-400 group-hover:text-brand-pink" />}
                    <input type="file" className="hidden" onChange={handleImageUpload} />
                  </label>
               </div>
            </div>

            <div>
               <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Descrição</label>
               <textarea 
                 rows={3}
                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink outline-none transition resize-none font-medium text-sm"
                 placeholder="Detalhes técnicos, materiais..."
                 value={formData.description}
                 onChange={e => setFormData({...formData, description: e.target.value})}
               />
            </div>

            <div>
               <div className="flex items-center justify-between mb-2">
                 <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tags / Vibe</label>
                 <span className="text-[10px] text-gray-400 font-medium">Pressione Enter</span>
               </div>
               <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-brand-pink/10 text-brand-pink text-[10px] font-black uppercase rounded-lg border border-brand-pink/20">
                      {tag}
                      <button type="button" onClick={() => setFormData({...formData, tags: formData.tags.filter(t => t !== tag)})}>
                        <X size={10} />
                      </button>
                    </span>
                  ))}
               </div>
               <input 
                 type="text" 
                 value={tagInput}
                 onChange={e => setTagInput(e.target.value)}
                 onKeyDown={e => {
                    if (e.key === 'Enter' && tagInput.trim()) {
                      e.preventDefault();
                      if (!formData.tags.includes(tagInput.trim())) {
                        setFormData({...formData, tags: [...formData.tags, tagInput.trim()]});
                      }
                      setTagInput("");
                    }
                 }}
                 className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink outline-none transition text-sm"
                 placeholder="Ex: limited-edition, minimal, summer..."
               />
            </div>

            <div className="pt-4 border-t border-gray-100">
               <h3 className="text-xs font-black text-gray-400 uppercase mb-4 tracking-widest">Configurações Avançadas</h3>
               <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">URL Slug (Opcional)</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink outline-none transition text-xs font-mono"
                      placeholder="deixe vazio para automático"
                      value={formData.slug}
                      onChange={e => setFormData({...formData, slug: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Preço Promocional (Opcional)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink outline-none transition text-xs font-bold"
                      value={formData.sale_price || ""}
                      onChange={e => setFormData({...formData, sale_price: e.target.value ? parseFloat(e.target.value) : null})}
                    />
                  </div>
               </div>
            </div>
         </div>
      </form>

      {/* RIGHT: Visual Editor (Canvas) */}
      <div className="lg:col-span-7 flex flex-col h-full bg-gray-800 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden relative">
         <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-10 pointer-events-none" />
         
         <div className="p-6 border-b border-gray-700 flex justify-between items-center z-10 bg-gray-800/80 backdrop-blur-md">
            <div>
               <h2 className="text-lg font-black text-white flex items-center gap-2">
                 <Monitor size={18} className="text-brand-pink" />
                 Editor Visual
               </h2>
               <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Standard Branding Preview</p>
            </div>
         </div>

         <div className="flex-1 relative flex items-center justify-center p-8">
            {/* The "Bottle" Canvas Mockup - Corrected Proportions */}
            <div className="relative w-36 h-[480px] md:w-44 md:h-[600px] transition-all duration-300 transform hover:scale-105">
               {/* Bottle Color Layer */}
               <div 
                 className="absolute inset-0 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl transition-colors duration-500"
                 style={{ backgroundColor: editorState.color }}
               />
               
               {/* Shine/Reflection Overlay */}
               <div className="absolute inset-0 rounded-[2.5rem] md:rounded-[3.5rem] bg-linear-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
               <div className="absolute top-12 right-4 w-3 h-32 bg-white/20 rounded-full blur-sm" />

               {/* Text Layer */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
                  <h1 className="text-3xl md:text-5xl font-black text-white/90 transform -rotate-90 tracking-[0.2em] md:tracking-[0.3em] drop-shadow-xl select-none opacity-80">
                    {editorState.text.toUpperCase()}
                  </h1>
               </div>
            </div>

            {/* Quick Tools Panel */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-gray-900/95 backdrop-blur-lg text-white p-3 rounded-2xl flex flex-col gap-4 border border-gray-700/50 shadow-2xl">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block text-center">Paleta</label>
                  <div className="flex flex-col gap-2.5">
                     {["#FF6B9D", "#2D3142", "#00B4D8", "#FBBF24", "#ffffff", "#8B5CF6"].map(c => (
                        <button 
                           key={c}
                           onClick={() => setEditorState({...editorState, color: c})}
                           className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-125 ${editorState.color === c ? 'border-brand-pink scale-110 shadow-[0_0_10px_rgba(255,107,157,0.5)]' : 'border-gray-700 hover:border-white'}`}
                           style={{ backgroundColor: c }}
                        />
                     ))}
                  </div>
               </div>

               <div className="w-8 h-px bg-gray-800 mx-auto" />

               <div className="space-y-3 text-center">
                 <button className="p-2.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                    <Type size={18} />
                 </button>
                 <button className="p-2.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                    <Palette size={18} />
                 </button>
               </div>
            </div>
         </div>

         {/* Bottom Bar: Layers Interface (Simplified) */}
         <div className="p-6 bg-gray-900/50 border-t border-gray-700/50 z-10">
            <div className="flex gap-4 items-center">
               <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg border border-brand-pink shadow-lg shadow-brand-pink/10">
                  <div className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Base Color</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700 text-gray-500 hover:text-gray-300 transition cursor-pointer">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#f0f0f0]">Typography Layer</span>
               </div>
               <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-brand-pink/10 rounded-lg border border-brand-pink/20 text-brand-pink hover:bg-brand-pink hover:text-white transition">
                  <PlusCircle size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">New Layer</span>
               </button>
            </div>
         </div>
      </div>

    </div>
  );
}
