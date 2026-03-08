import postgres from 'postgres';
import { OrdersTable } from './OrdersTable';
import { ClipboardList, PieChart, ShoppingBag } from 'lucide-react';

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: { rejectUnauthorized: false }
});

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await sql`
    SELECT * FROM orders 
    ORDER BY created_at DESC 
    LIMIT 100
  `;

  // Fetch items for these orders
  const items = orders.length > 0 ? await sql`
    SELECT oi.*, p.name as product_name, p.images as product_images
    FROM order_items oi
    JOIN products p ON oi.product_id::uuid = p.id
    WHERE oi.order_id::text IN (${orders.map(o => o.id)})
  ` : [];

  // Group items by order_id
  const orderItemsMap = items.reduce((acc: any, item: any) => {
    if (!acc[item.order_id]) acc[item.order_id] = [];
    
    // Fallback thumbnail if customization doesn't have one
    const thumbnail = item.customization?.previewImage || (item.product_images?.[0] || '/placeholder-product.png');
    
    acc[item.order_id].push({
        ...item,
        thumbnail_url: thumbnail
    });
    return acc;
  }, {});

  // Stats for the header
  const totalRevenue = orders.filter(o => o.status === 'paid' || o.status === 'delivered').reduce((acc, o) => acc + Number(o.total), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestão de Pedidos</h1>
          <p className="text-slate-500 font-medium">Controle de produção e logística em tempo real</p>
        </div>

        <div className="flex gap-4">
           <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                 <PieChart className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Receita (Pagos)</p>
                 <p className="text-lg font-black text-slate-900 leading-none">R$ {totalRevenue.toFixed(2)}</p>
              </div>
           </div>
           
           <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
                 <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pendentes</p>
                 <p className="text-lg font-black text-slate-900 leading-none">{pendingOrders}</p>
              </div>
           </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-slate-200 shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full mx-auto mb-6 flex items-center justify-center">
            <ClipboardList className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Nenhum pedido registrado</h3>
          <p className="text-slate-500 max-w-sm mx-auto font-medium">A calmaria antes da tempestade! Seus pedidos aparecerão aqui assim que as vendas começarem.</p>
        </div>
      ) : (
        <OrdersTable initialOrders={orders} orderItemsMap={orderItemsMap} />
      )}
    </div>
  );
}

