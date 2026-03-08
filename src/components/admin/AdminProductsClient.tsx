"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Package, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { createProduct, updateProduct, deleteProductAction } from "@/actions/admin-actions";
import ProductRegistrationModal from "./ProductRegistrationModal";

interface AdminProductsClientProps {
  initialProducts: any[];
}

export default function AdminProductsClient({ initialProducts }: AdminProductsClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category_name && p.category_name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSave = async (data: any) => {
    try {
      // Normalize: modal returns `price`, DB action expects `base_price`
      const payload = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        category_id: data.category_id,
        base_price: parseFloat(data.price),
        stock: parseInt(data.stock),
        tags: data.tags ?? [],
        color: data.color,
        images: data.images ?? [],
        is_active: true,
      };

      if (editingProduct) {
        const res = await updateProduct(editingProduct.id, payload);
        if (res.success) {
          toast.success("Produto atualizado!");
          setProducts(prev =>
            prev.map(p =>
              p.id === editingProduct.id
                ? { ...p, ...payload, category_name: p.category_name }
                : p
            )
          );
          setIsModalOpen(false);
        } else {
          toast.error("Erro ao atualizar: " + res.error);
        }
      } else {
        const res = await createProduct(payload);
        if (res.success) {
          toast.success("Produto criado!");
          window.location.reload();
          setIsModalOpen(false);
        } else {
          toast.error("Erro ao criar: " + res.error);
        }
      }
    } catch {
      toast.error("Ocorreu um erro inesperado.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    const res = await deleteProductAction(id);
    if (res.success) {
      toast.success("Produto removido!");
      setProducts(prev => prev.filter(p => p.id !== id));
    } else {
      toast.error("Erro ao remover: " + res.error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Buscar produtos ou categorias..." 
            className="pl-10 h-11 bg-gray-50/50 border-gray-100 rounded-lg focus:ring-brand-pink/20 focus:border-brand-pink"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="bg-brand-black hover:bg-gray-800 text-white h-11 px-6 rounded-lg font-bold gap-2 w-full md:w-auto"
        >
          <Plus className="h-5 w-5" /> Novo Produto
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Produto</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Categoria</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Preço</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estoque</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100 relative">
                      {product.images && product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-gray-300" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight">{product.name}</h4>
                      <p className="text-xs text-gray-500 font-mono mt-1">/{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    {product.category_name || "Sem Categoria"}
                  </span>
                </td>
                <td className="p-4 font-black text-gray-900">
                  R$ {Number(product.price).toFixed(2)}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${
                      product.stock > 10 ? 'bg-green-500' :
                      product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm font-bold text-gray-700">{product.stock} un</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                      className="h-9 w-9 text-gray-400 hover:text-brand-pink hover:bg-brand-pink/5"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(product.id)}
                      className="h-9 w-9 text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Nenhum produto encontrado</h3>
            <p className="text-gray-500 text-sm">Tente ajustar sua busca ou adicione um novo produto.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ProductRegistrationModal 
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          initialData={editingProduct}
          previewImage={editingProduct?.images?.[0]}
        />
      )}
    </div>
  );
}
