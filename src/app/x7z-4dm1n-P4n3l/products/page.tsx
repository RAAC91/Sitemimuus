import { getAdminProducts } from "@/actions/admin-actions";
import AdminProductsClient from "@/components/admin/AdminProductsClient";

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const res = await getAdminProducts();
  const products = res.success ? res.products : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Produtos</h1>
          <p className="text-gray-500">Gerencie seu inventário e crie novos itens com o mestre supremo.</p>
        </div>
      </div>

      <AdminProductsClient initialProducts={products as any[]} />
    </div>
  );
}
