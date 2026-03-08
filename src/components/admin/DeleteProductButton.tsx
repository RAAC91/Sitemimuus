"use client";

import { Trash2, Loader2 } from "lucide-react";
import { deleteProductAction } from "@/actions/admin-actions";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteProductButtonProps {
  productId: string;
}

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja deletar este produto? Esta ação não pode ser desfeita.")) {
      try {
        setIsDeleting(true);
        const result = await deleteProductAction(productId);
        
        if (result.success) {
          toast.success("Produto deletado com sucesso!");
          router.refresh();
        } else {
          toast.error("Erro ao deletar: " + (result.error || "Erro desconhecido"));
        }
      } catch (error) {
        toast.error("Erro ao deletar produto.");
        console.error(error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 hover:bg-red-50 rounded-lg transition text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed group"
      title="Deletar produto"
    >
      {isDeleting ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
      )}
    </button>
  );
}
