import { getOrderById } from '@/actions/order-actions';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Image from 'next/image';

export const metadata = { title: 'Detalhes do Pedido - mimuus.' };

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { success, order, error } = await getOrderById(resolvedParams.id, user!.id);

  if (!success || !order) {
    return (
      <div className="bg-red-50 dark:bg-red-500/10 text-red-600 rounded-2xl p-6 text-center border border-red-200 dark:border-red-500/20">
        <h2 className="text-xl font-bold mb-2">Erro ao carregar pedido</h2>
        <p>{error || 'Pedido não encontrado.'}</p>
        <Link href="/minha-conta/pedidos" className="font-bold underline mt-4 inline-block">← Voltar para Meus Pedidos</Link>
      </div>
    );
  }

  // Synchronized statuses with Admin Panel
  // Available statuses: "pending", "paid", "preparing", "shipped", "delivered", "cancelled"
  const getTimelineStatus = (currentStatus: string) => {
    const statuses = ['pending', 'paid', 'preparing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(currentStatus.toLowerCase());
    
    // Default to pending if not found (e.g. cancelled)
    const activeIndex = currentIndex === -1 ? 0 : currentIndex;

    return statuses.map((status, index) => ({
      status,
      active: index <= activeIndex,
      current: index === activeIndex
    }));
  };

  const timeline = getTimelineStatus(order.status);
  const statusLabels: Record<string, string> = {
    'pending': 'Aguardando Pagamento',
    'paid': 'Pagamento Aprovado',
    'preparing': 'Em Produção',
    'shipped': 'Pedido Enviado',
    'delivered': 'Entregue'
  };

  // Convert legacy DB dates to a standard form, checking for validity
  let orderDateFormatted = "Data Desconhecida";
  try {
     if (order.created_at) {
        orderDateFormatted = format(parseISO(order.created_at), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR });
     }
  } catch (e) {
    console.error("Invalid date parsing:", e);
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/minha-conta/pedidos" className="text-sm font-bold hover:bg-gray-100 dark:hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors">
            ← Voltar
          </Link>
          <h1 className="text-3xl font-black tracking-tight">Status do Pedido</h1>
        </div>
        <div className="hidden sm:block">
           <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full">Atualizado em tempo real</span>
        </div>
      </div>

      {/* Header Overview - Prominent Order ID */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-white/5 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Número do Pedido</p>
          <div className="flex items-center gap-3">
            <h2 className="font-black text-4xl tracking-tighter text-slate-900 dark:text-white uppercase">#{order.id.split('-')[0]}</h2>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(order.id);
                // Notification could be added here if toast is available
              }}
              className="p-2 bg-slate-50 dark:bg-white/5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              title="Copiar ID Completo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            </button>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Data da Compra</p>
          <p className="font-bold text-lg">{orderDateFormatted}</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Geral</p>
          <p className="font-black text-brand-pink text-3xl tracking-tighter">{formatPrice(order.total)}</p>
        </div>
      </div>

      {/* Visual Timeline Tracking */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 shadow-sm border border-gray-100 dark:border-white/5 text-center sm:text-left">
         <h2 className="text-xl font-black mb-10 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-brand-pink rounded-full"></span>
            Acompanhe o Progresso
         </h2>
         
         {order.status.toLowerCase() === 'cancelled' || order.status.toLowerCase() === 'cancelado' ? (
           <div className="bg-red-50 dark:bg-red-500/10 p-8 rounded-3xl border border-red-100 dark:border-red-500/20 flex flex-col items-center justify-center gap-4 text-red-600">
             <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl shadow-sm">🚫</div>
             <div className="text-center">
               <h3 className="text-xl font-black">Pedido Cancelado</h3>
               <p className="text-sm font-medium opacity-80 mt-1">Este pedido foi encerrado e não seguirá para entrega.</p>
             </div>
           </div>
         ) : (
           <div className="relative">
             {/* Progress Bar Line */}
             <div className="hidden md:block absolute top-[20px] left-0 w-full h-1 bg-gray-100 dark:bg-white/10 rounded-full z-0 overflow-hidden">
                <div 
                  className="h-full bg-brand-pink transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(236,72,153,0.5)]" 
                  style={{ width: `${(timeline.filter(t => t.active).length - 1) / (timeline.length - 1) * 100}%` }}
                />
             </div>
             
             <div className="flex flex-col md:flex-row justify-between relative z-10 gap-10 md:gap-0">
               {timeline.map((step, index) => (
                 <div key={step.status} className="flex md:flex-col items-center gap-6 md:gap-4 group">
                    <div className="relative">
                      <div 
                        className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center font-black text-sm border-2 transition-all duration-500
                          ${step.active 
                            ? 'bg-brand-pink border-brand-pink text-white shadow-xl shadow-brand-pink/30' 
                            : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-white/10 text-gray-400'
                          }
                          ${step.current ? 'scale-125 ring-8 ring-brand-pink/10 animate-pulse' : ''}
                        `}
                      >
                        {step.active ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                        ) : index + 1}
                      </div>
                      {step.current && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-pink rounded-full border-2 border-white dark:border-slate-900" />
                      )}
                    </div>
                    <div className="md:text-center">
                      <p className={`font-black text-[10px] uppercase tracking-widest ${step.active ? 'text-slate-900 dark:text-white' : 'text-gray-400'}`}>
                        {statusLabels[step.status]}
                      </p>
                      {step.current && <p className="text-[9px] font-bold text-brand-pink animate-bounce mt-1 italic">Status Atual</p>}
                    </div>
                 </div>
               ))}
             </div>
           </div>
         )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Items List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-black flex items-center gap-3">
             <span className="w-1.5 h-6 bg-brand-pink rounded-full"></span>
             Minha Escolha
          </h2>
          
          <div className="space-y-4">
            {order.items?.map((item: Record<string, any>) => (
              <div key={item.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 flex flex-col sm:flex-row gap-6 shadow-sm border border-gray-100 dark:border-white/5 transition-all hover:border-brand-pink/20 hover:shadow-md group">
                {/* Thumbnail / Art Preview */}
                <div className="w-28 h-28 bg-gray-50 dark:bg-white/5 rounded-2xl shrink-0 border border-slate-100 dark:border-white/5 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                  <Image 
                    src={item.customization?.previewImage || item.thumbnail_url} 
                    alt={item.product_name || 'Produto'} 
                    fill 
                    className="object-cover"
                  />
                  {item.customization?.previewImage && (
                    <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider">
                      Preview Arte
                    </div>
                  )}
                </div>
                
                {/* Item Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-black text-xl text-slate-900 dark:text-white tracking-tight">{item.product_name}</h3>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Quantidade: {item.quantity}</p>
                    </div>
                    <p className="font-black text-brand-pink text-xl tracking-tighter">{formatPrice(item.total_price)}</p>
                  </div>
                  
                  {item.customization && (
                    <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 mt-3 grid grid-cols-2 gap-y-2 gap-x-4 border border-slate-100 dark:border-white/5">
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Fonte Escolhida</p>
                            <p className="text-xs font-bold text-slate-600 dark:text-gray-300 italic">{item.customization.fontName || 'Padrão'}</p>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Cor do Texto</p>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full border border-slate-200" style={{ backgroundColor: item.customization.textColor }} />
                                <p className="text-xs font-bold text-slate-600 dark:text-gray-300 uppercase italic">{item.customization.textColor || 'Padrão'}</p>
                            </div>
                        </div>
                        <div className="col-span-2 pt-2 border-t border-slate-200/50 dark:border-white/10 mt-1">
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Texto Gravado</p>
                            <p className="text-base font-black text-slate-900 dark:text-white italic">"{item.customization.text || 'Sem texto'}"</p>
                        </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping info */}
        <div className="space-y-6">
          <h2 className="text-xl font-black flex items-center gap-3">
             <span className="w-1.5 h-6 bg-brand-pink rounded-full"></span>
             Envio & Ajuda
          </h2>

          {order.shipping_address ? (
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-white/5">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                 Endereço de Entrega
              </h3>
              <div className="space-y-2 text-sm">
                <p className="font-black text-slate-900 dark:text-white text-base">{order.shipping_address.name}</p>
                <div className="text-slate-600 dark:text-gray-400 font-medium">
                  <p>{order.shipping_address.street}, {order.shipping_address.number}</p>
                  {order.shipping_address.complement && <p>{order.shipping_address.complement}</p>}
                  <p>{order.shipping_address.neighborhood}</p>
                  <p>{order.shipping_address.city} - {order.shipping_address.state}</p>
                  <p className="font-black text-slate-400 mt-2">{order.shipping_address.cep}</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Método de Envio</h3>
                 <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                    <div className="text-2xl">📦</div>
                    <p className="text-sm font-black text-slate-900 dark:text-white">Frete Grátis Standard</p>
                 </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-white/5 rounded-3xl p-8 text-center text-sm text-gray-500 italic border border-dashed border-slate-200">
              Endereço de entrega não disponível.
            </div>
          )}

          <div className="bg-brand-pink/5 dark:bg-brand-pink/10 rounded-[2rem] p-8 border border-brand-pink/10 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 group-hover:scale-110 transition-transform duration-700">💬</div>
            <h3 className="font-black text-slate-900 dark:text-white mb-2">Precisa de suporte?</h3>
            <p className="text-sm text-slate-600 dark:text-gray-400 mb-6 font-medium leading-relaxed">
              Dúvidas sobre sua arte ou prazo de entrega? Nossa equipe está pronta para te atender.
            </p>
            <a 
              href="mailto:suporte@mimuus.com.br" 
              className="block text-center w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg active:scale-95"
            >
              Falar com nossa equipe
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
