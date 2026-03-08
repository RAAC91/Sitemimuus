"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, Trash2, Edit2, ChevronRight, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { getCategories, upsertCategory, deleteCategory } from "@/actions/admin-actions";
import { toast } from "sonner";
import { Category } from "@/types";

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadCategories() {
    setLoading(true);
    const res = await getCategories();
    if (res.success && res.categories) {
      setCategories(res.categories as unknown as Category[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    async function init() {
      await loadCategories();
    }
    init();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;
    
    setSaving(true);
    const slug = editingCategory.slug || generateSlug(editingCategory.name);
    const res = await upsertCategory({
      id: editingCategory.id,
      name: editingCategory.name,
      slug,
      parent_id: editingCategory.parent_id
    });

    if (res.success) {
      toast.success("Categoria salva!");
      setIsModalOpen(false);
      loadCategories();
    } else {
      toast.error("Erro: " + res.error);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza? Produtos vinculados a esta categoria ficarão sem categoria.")) return;
    const res = await deleteCategory(id);
    if (res.success) {
      toast.success("Categoria excluída!");
      loadCategories();
    }
  };

  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Categorias</h1>
          <p className="text-gray-500">Organize seus produtos em coleções e subcategorias.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCategory({})} className="bg-brand-pink hover:bg-brand-pink/90 text-white gap-2 shadow-lg shadow-brand-pink/20">
              <Plus className="h-4 w-4" /> Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingCategory?.id ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome</label>
                <Input 
                  value={editingCategory?.name || ""} 
                  onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})} 
                  placeholder="Ex: Almofadas" 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug (URL)</label>
                <Input 
                  value={editingCategory?.slug || ""} 
                  onChange={(e) => setEditingCategory({...editingCategory, slug: e.target.value})} 
                  placeholder="Ex: almofadas-personalizadas" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria Pai (Opcional)</label>
                <select 
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
                  value={editingCategory?.parent_id || ""}
                  onChange={(e) => setEditingCategory({...editingCategory, parent_id: e.target.value || null})}
                >
                  <option value="">Nenhuma (Categoria Principal)</option>
                  {categories.filter(c => c.id !== editingCategory?.id).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={saving} className="bg-brand-pink text-white w-full">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Categoria"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {categories.length === 0 ? (
          <Card className="border-dashed border-2 py-12">
            <CardContent className="flex flex-col items-center justify-center text-gray-400">
              <Folder className="h-12 w-12 mb-4 opacity-20" />
              <p>Nenhuma categoria cadastrada.</p>
            </CardContent>
          </Card>
        ) : (
          categories.filter(c => !c.parent_id).map(category => (
            <div key={category.id} className="space-y-2">
              <Card className="border-gray-100 shadow-sm hover:border-brand-pink/30 transition-colors group">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-brand-pink/10 flex items-center justify-center text-brand-pink">
                      <Folder className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{category.name}</h3>
                      <p className="text-xs text-gray-500">/{category.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        setEditingCategory(category);
                        setIsModalOpen(true);
                      }}
                      className="h-8 w-8 text-gray-400 hover:text-brand-pink"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(category.id)}
                      className="h-8 w-8 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Children categories */}
              <div className="ml-12 space-y-2 border-l-2 border-gray-100 pl-4">
                {categories.filter(c => c.parent_id === category.id).map(sub => (
                  <div key={sub.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg group">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ChevronRight className="h-3 w-3" />
                      <span className="font-medium">{sub.name}</span>
                      <span className="text-xs opacity-50">/{sub.slug}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          setEditingCategory(sub);
                          setIsModalOpen(true);
                        }}
                        className="h-7 w-7 text-gray-400 hover:text-brand-pink"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(sub.id)}
                        className="h-7 w-7 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
