import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { getAdminStats } from "@/actions/admin-actions";

export default async function AdminDashboardPage() {
  const statsRes = await getAdminStats();
  
  const stats = statsRes.success && statsRes.stats ? statsRes.stats : {
    totalRevenue: 0,
    orders: 0,
    customers: 0,
    recentSales: []
  };

  const METRICS = [
    {
      title: "Total Revenue",
      value: `R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: "Based on paid orders",
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: `+${stats.orders}`,
      change: "Total lifetime orders",
      icon: ShoppingBag,
    },
    {
      title: "Active Customers",
      value: `+${stats.customers}`,
      change: "Unique customer emails",
      icon: Users,
    },
    {
      title: "Status",
      value: "Online",
      change: "CMS System Active",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-brand-black">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral do desempenho da sua loja.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((metric) => (
          <Card key={metric.title} className="border-none shadow-sm bg-white/50 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-500">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-brand-pink" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-brand-black">{metric.value}</div>
              <p className="text-xs text-gray-400 font-medium">
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-brand-black font-bold">Resumo de Atividade</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <div className="h-[300px] flex flex-col items-center justify-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-muted-foreground text-sm">
                <TrendingUp className="w-12 h-12 mb-4 text-gray-200" />
                <p className="font-bold text-gray-400">Gráficos de vendas em breve</p>
                <p className="text-xs">Fase 2 do CMS Personalizado</p>
             </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-brand-black font-bold">Vendas Recentes</CardTitle>
            <div className="text-sm text-gray-400 font-medium">
              Últimas 5 transações registradas.
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
               {stats.recentSales.length > 0 ? stats.recentSales.map((sale: any, i: number) => (
                   <div key={i} className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-brand-pink/10 text-brand-pink flex items-center justify-center text-xs font-black">
                         {sale.name?.substring(0, 2).toUpperCase() || '??'}
                      </div>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-bold leading-none text-brand-black">{sale.name}</p>
                        <p className="text-xs text-gray-400">{sale.email}</p>
                      </div>
                      <div className="ml-auto font-black text-brand-black">
                        {sale.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                    </div>
               )) : (
                 <p className="text-center py-10 text-gray-400 text-sm font-medium">Nenhuma venda registrada ainda.</p>
               )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
