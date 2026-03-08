import { getUserOrders } from '@/actions/order-actions';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const metadata = { title: 'Meus Pedidos - mimuus.' };

export default async function OrdersListPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { orders } = await getUserOrders(user!.id);
  const orderList = orders || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">Meus Pedidos</h1>
      
      {orderList.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-gray-100 dark:border-white/5">
          <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📦</div>
          <h2 className="text-xl font-bold mb-2">Nenhum pedido encontrado</h2>
          <p className="text-gray-500 mb-6">Parece que você ainda não realizou nenhuma compra.</p>
          <Link 
            href="/produtos" 
            className="inline-block bg-brand-pink text-white font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-brand-pink/20"
          >
            Ver Produtos
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {orderList.map((order: any) => (
            <div key={order.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-black text-lg">#{order.id.split('-')[0].toUpperCase()}</span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-xs font-bold rounded-full">
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Realizado em {format(parseISO(order.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                 {(order.items || []).slice(0, 3).map((item: any) => (
                   <div key={item.id} className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-lg overflow-hidden shrink-0">
                      {item.thumbnail_url && (
                        <img src={item.thumbnail_url} alt={item.product_name} className="w-full h-full object-cover" />
                      )}
                   </div>
                 ))}
                 {(order.items?.length || 0) > 3 && (
                   <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center text-xs font-bold">
                     +{order.items.length - 3}
                   </div>
                 )}
              </div>

              <div className="flex items-center justify-between w-full md:w-auto gap-6 md:border-l border-gray-200 dark:border-white/10 md:pl-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                  <p className="font-black text-xl text-brand-pink">{formatPrice(order.total || 0)}</p>
                </div>
                <Link 
                  href={`/minha-conta/pedidos/${order.id}`}
                  className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-sm font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  Rastrear
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
