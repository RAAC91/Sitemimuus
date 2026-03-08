"use client";

import { useState } from "react";
import { X, Plus, Tag, ChevronDown } from "lucide-react";
// We'll use basic UI for now, relying on Tailwind
import { motion } from "framer-motion";

interface ProductRegistrationModalProps {
  onClose: () => void;
  onSave: (data: {
    name: string;
    price: string;
    description: string;
    category: string;
    tags: string[];
    color: string; // Add color field
    previewImage?: string
  }) => void;
  initialData?: {
    name?: string;
    price?: number;
    description?: string;
    category?: string;
    color?: string;
    tags?: string[];
  };
  previewImage?: string;
}

export const ProductRegistrationModal: React.FC<ProductRegistrationModalProps> = ({ onClose, onSave, initialData, previewImage }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "Garrafas");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [selectedColor, setSelectedColor] = useState(initialData?.color || "#000000"); // Default color

  const [tagInput, setTagInput] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      price,
      description,
      category,
      tags,
      color: selectedColor,
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
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-black tracking-tight text-gray-900">Novo Produto - Catálogo</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-8">
            {/* Left: Preview */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
                <div className="aspect-3/4 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative group flex items-center justify-center">
                    {previewImage ? (
                        <img src={previewImage} alt="Preview" className="w-full h-full object-contain animate-in fade-in duration-500" />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                           <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-pink rounded-full animate-spin" />
                           <span className="text-[10px] font-bold uppercase tracking-widest animate-pulse">Capturando Design...</span>
                        </div>
                    )}
                </div>
                <div className="text-xs text-center text-gray-500 font-medium">
                    Gerado pelo Editor
                </div>
            </div>

            {/* Right: Form */}
            <form id="product-form" onSubmit={handleSave} className="flex-1 space-y-5">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Nome do Produto</label>
                    <input
                        type="text"
                        required
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink outline-none font-bold text-gray-900"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ex: Garrafa Mimuus 2026"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Preço (R$)</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink outline-none font-bold text-gray-900"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                        />
                     </div>
                     {/* Category & Color Row */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Categoria Principal
                        </label>
                        <div className="relative">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary appearance-none transition-all"
                            >
                                <option value="Garrafas">Garrafas</option>
                                <option value="Copos">Copos</option>
                                <option value="Acessórios">Acessórios</option>
                                <option value="Kits">Kits Presente</option>
                                <option value="Edição Limitada">Edição Limitada</option>
                            </select>
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Cor do Produto
                    </label>
                    <div className="flex items-center gap-3 p-2 bg-gray-50 border border-gray-200 rounded-lg h-[46px]">
                        <input
                            type="color"
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border-none p-0 bg-transparent"
                        />
                        <span className="text-sm font-mono text-gray-600 uppercase">{selectedColor}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Descrição</label>
                    <textarea
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink outline-none font-medium text-gray-700 min-h-[100px]"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Detalhes incríveis sobre este produto..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Tags de Busca</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map(tag => (
                            <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                                {tag}
                                <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))}>
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-pink outline-none pl-9"
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={addTag}
                            placeholder="Digite e pressione Enter..."
                        />
                        <Tag size={16} className="absolute left-3 top-2.5 text-gray-400" />
                    </div>
                </div>
            </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
             <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900">
                Cancelar
             </button>
             <button
                type="submit"
                form="product-form"
                className="bg-brand-black text-white px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors shadow-lg flex items-center gap-2"
             >
                <Plus size={16} /> Adicionar ao Site
             </button>
        </div>
      </motion.div>
    </div>
  );
}
