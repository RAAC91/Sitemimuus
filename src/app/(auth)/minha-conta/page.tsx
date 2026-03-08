import { getUserOrders } from '@/actions/order-actions';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );
  
  const { data: { user } } = await supabase.auth.getUser();
  const { orders } = await getUserOrders(user!.id);
  
  const recentOrders = orders?.slice(0, 3) || [];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black">Minha Conta</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-brand-pink/5 border border-brand-pink/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-2">Bem-vindo(a)!</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Acompanhe o status dos seus pedidos e gerencie suas informações.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold">Pedidos Recentes</h2>
          <Link href="/minha-conta/pedidos" className="text-sm font-bold text-brand-pink hover:underline">
            Ver Todos →
          </Link>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Você ainda não fez nenhum pedido. <br />
            <Link href="/produtos" className="text-brand-pink font-bold hover:underline mt-2 inline-block">
              Começar a comprar
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {recentOrders.map((order: any) => (
              <div key={order.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold"># {order.id.split('-')[0].toUpperCase()}</span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-xs font-bold rounded-full">
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {format(parseISO(order.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                  </p>
                </div>
                
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="text-right flex-1 md:flex-none">
                    <p className="font-black text-lg text-brand-pink">{formatPrice(order.total || 0)}</p>
                    <p className="text-xs text-gray-400">{order.items?.length || 0} item(s)</p>
                  </div>
                  
                  <Link 
                    href={`/minha-conta/pedidos/${order.id}`}
                    className="shrink-0 px-4 py-2 border border-brand-pink text-brand-pink font-bold rounded-lg hover:bg-brand-pink hover:text-white transition-colors text-sm"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
