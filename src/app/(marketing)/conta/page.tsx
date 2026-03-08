"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Trophy, 
  Sparkles, 
  TrendingUp,
  Package,
  Clock,
  Droplets,
  Calendar,
  Crown
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import Header from "@/components/layout/Header";
import { BackgroundEffects } from "@/components/ui/background-effects";
import { useTheme } from "next-themes";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface UserProfile {
  display_name: string;
  avatar_url: string | null;
  xp_points: number;
  level: number;
  total_spent: number;
  total_orders: number;
}

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
  items: {
    product_id: string;
    quantity: number;
    price: number;
    name?: string;
  }[];
}

interface Design {
  id: string;
  name: string;
  preview_url: string | null;
  created_at: string;
}

interface Activity {
  id: string;
  action_type: "order_placed" | "design_saved" | "level_up" | string;
  action_data: {
    total?: number;
    design_name?: string;
    new_level?: number;
    [key: string]: string | number | undefined;
  };
  xp_earned: number;
  created_at: string;
}

export default function AccountPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      // router.push("/login"); // Let AuthProvider handle redirect or show loading
      return;
    }
    
    fetchAllData();
  }, [user, router]);

  const fetchAllData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch profile
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (profileData) setProfile(profileData);
      
      // Fetch orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (ordersData) setOrders(ordersData);
      
      // Fetch designs
      const { data: designsData } = await supabase
        .from("designs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6);
      
      if (designsData) setDesigns(designsData);
      
      // Fetch activity
      const { data: activityData } = await supabase
        .from("activity_log")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (activityData) setActivities(activityData);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;
  const isDark = resolvedTheme === 'dark';

  if (!user || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0f1115]' : 'bg-gray-50'}`}>
        <div className={isDark ? 'text-white' : 'text-gray-900'}>Carregando...</div>
      </div>
    );
  }

  const isAdmin = user?.email?.toLowerCase().trim() === 'rueliton.andrade@gmail.com';
  
  // Calculate XP progress
  const currentLevel = profile?.level || 1;
  const currentXP = profile?.xp_points || 0;
  const xpForNextLevel = Math.pow(currentLevel, 2) * 100;

  // Simple progress bar logic (can be refined)
  const xpProgress = Math.min((currentXP / xpForNextLevel) * 100, 100);
  
  const statusColors: Record<string, string> = {
    pending: isDark ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : "bg-yellow-100 text-yellow-700 border-yellow-200",
    paid: isDark ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-green-100 text-green-700 border-green-200",
    processing: isDark ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-blue-100 text-blue-700 border-blue-200",
    shipped: isDark ? "bg-purple-500/10 text-purple-500 border-purple-500/20" : "bg-purple-100 text-purple-700 border-purple-200",
    delivered: isDark ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-emerald-100 text-emerald-700 border-emerald-200",
    cancelled: isDark ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-red-100 text-red-700 border-red-200",
  };

  const statusLabels: Record<string, string> = {
    pending: "Pendente",
    paid: "Pago",
    processing: "Processando",
    shipped: "Enviado",
    delivered: "Entregue",
    cancelled: "Cancelado",
  };

  const activityIcons: Record<string, React.ElementType> = {
    order_placed: ShoppingBag,
    design_saved: Droplets,
    level_up: Crown,
  };

  const activityLabels: Record<string, (data: Activity['action_data']) => string> = {
    order_placed: (data) => `Pedido realizado - R$ ${data.total?.toFixed(2) || '0.00'}`,
    design_saved: (data) => `Design salvo: ${data.design_name || 'Sem nome'}`,
    level_up: (data) => `Subiu para nível ${data.new_level || '?'}!`,
  };

  // Card Style Helper
  const cardStyle = `rounded-2xl p-6 backdrop-blur-xl border transition-all hover:shadow-lg ${
    isDark 
      ? 'bg-white/5 border-white/10 hover:border-white/20' 
      : 'bg-white/60 border-gray-200 shadow-sm hover:shadow-md'
  }`;

  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`min-h-screen pt-24 pb-16 px-4 relative overflow-hidden transition-colors duration-500`}>
      <Header />
      <BackgroundEffects />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Breadcrumb 
            items={[{ label: "MINHA CONTA" }]} 
            className="mb-8"
          />
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-cyan-500/20">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  user.email?.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h1 className={`text-3xl font-bold mb-1 ${textPrimary}`}>
                  {profile?.display_name || user.email?.split('@')[0]}
                </h1>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                    isDark ? 'bg-cyan-500/10 border-cyan-500/20' : 'bg-cyan-50 border-cyan-200'
                  }`}>
                    <Trophy className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm font-bold text-cyan-500">Nível {currentLevel}</span>
                  </div>
                  {isAdmin && (
                    <span className="text-xs bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full font-bold border border-amber-500/20">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => router.push('/garrafas-personalizadas')}
              className={`px-6 py-3 rounded-lg font-bold border transition-all shadow-lg ${
                 isDark 
                  ? 'bg-white text-black hover:bg-gray-200 border-transparent' 
                  : 'bg-black text-white hover:bg-gray-800 border-transparent'
              }`}
            >
              + Criar Novo Design
            </button>
          </div>

          {/* XP Progress Bar */}
          <div className={`${cardStyle} p-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-semibold ${textSecondary}`}>Progresso para Nível {currentLevel + 1}</span>
              <span className="text-sm font-bold text-cyan-500">{currentXP} / {xpForNextLevel} XP</span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-black/20' : 'bg-gray-200'}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Pedidos", value: profile?.total_orders || 0, icon: ShoppingBag, color: "text-cyan-500", bg: "bg-cyan-500/10" },
            { label: "Gasto Total", value: `R$ ${profile?.total_spent?.toFixed(2) || '0.00'}`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "XP", value: profile?.xp_points || 0, icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10" },
            { label: "Designs", value: designs.length, icon: Droplets, color: "text-blue-500", bg: "bg-blue-500/10" },
          ].map((stat, i) => (
            <div key={i} className={cardStyle}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className={`text-sm font-semibold ${textSecondary}`}>{stat.label}</span>
              </div>
              <p className={`text-2xl font-extrabold ${textPrimary}`}>{stat.value}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {isAdmin && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => router.push('/x7z-4dm1n-P4n3l')}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 group"
              >
                <Crown className="w-5 h-5" />
                <span>Painel Admin</span>
                <span className="text-amber-100 group-hover:translate-x-1 transition-transform">→</span>
              </motion.button>
            )}

            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={cardStyle}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold flex items-center gap-2 ${textPrimary}`}>
                  <Package className="w-5 h-5 text-cyan-500" />
                  Pedidos Recentes
                </h2>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className={`w-12 h-12 mx-auto mb-3 ${textSecondary}`} />
                  <p className={`mb-4 ${textSecondary}`}>Nenhum pedido ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className={`border rounded-lg p-4 transition-colors ${
                        isDark ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-mono ${textSecondary}`}>#{order.id.slice(0, 8)}</span>
                        <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${statusColors[order.status] || statusColors.pending}`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
                          <Calendar className="w-4 h-4" />
                          {new Date(order.created_at).toLocaleDateString('pt-BR')}
                        </div>
                        <span className={`text-lg font-bold ${textPrimary}`}>R$ {order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Bottles Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={cardStyle}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold flex items-center gap-2 ${textPrimary}`}>
                  <Droplets className="w-5 h-5 text-blue-500" />
                  Minhas Garrafas
                </h2>
              </div>

              {designs.length === 0 ? (
                <div className="text-center py-12">
                  <Droplets className={`w-12 h-12 mx-auto mb-3 ${textSecondary}`} />
                  <p className={`mb-4 ${textSecondary}`}>Nenhum design salvo</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {designs.map((design) => (
                    <div
                      key={design.id}
                      className={`rounded-lg overflow-hidden hover:scale-105 transition-all cursor-pointer border ${
                        isDark ? 'bg-black/20 border-white/5' : 'bg-white border-gray-200 shadow-sm'
                      }`}
                    >
                      <div className={`aspect-square flex items-center justify-center ${
                        isDark ? 'bg-gray-800' : 'bg-gray-100'
                      }`}>
                        {design.preview_url ? (
                          <img src={design.preview_url} alt={design.name} className="w-full h-full object-cover" />
                        ) : (
                          <Droplets className={`w-12 h-12 ${textSecondary}`} />
                        )}
                      </div>
                      <div className="p-3">
                        <p className={`text-sm font-semibold truncate ${textPrimary}`}>{design.name || 'Sem nome'}</p>
                        <p className={`text-xs ${textSecondary}`}>{new Date(design.created_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column: Activity Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`${cardStyle} h-fit`}
          >
            <h2 className={`text-xl font-bold flex items-center gap-2 mb-6 ${textPrimary}`}>
              <Clock className="w-5 h-5 text-purple-500" />
              Atividades Recentes
            </h2>

            {activities.length === 0 ? (
              <div className="text-center py-12">
                <Clock className={`w-12 h-12 mx-auto mb-3 ${textSecondary}`} />
                <p className={textSecondary}>Nenhuma atividade ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity, index) => {
                  const Icon = activityIcons[activity.action_type] || Clock;
                  const label = activityLabels[activity.action_type]?.(activity.action_data) || activity.action_type;
                  
                  return (
                    <div key={activity.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
                           isDark ? 'bg-cyan-500/10 border-cyan-500/20' : 'bg-cyan-50 border-cyan-100'
                        }`}>
                          <Icon className="w-4 h-4 text-cyan-500" />
                        </div>
                        {index < activities.length - 1 && (
                          <div className={`w-px h-full mt-2 ${isDark ? 'bg-white/5' : 'bg-gray-200'}`} />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className={`text-sm font-semibold mb-1 ${textPrimary}`}>{label}</p>
                        <div className={`flex items-center gap-2 text-xs ${textSecondary}`}>
                          <span>{new Date(activity.created_at).toLocaleDateString('pt-BR')}</span>
                          {activity.xp_earned > 0 && (
                            <span className="text-cyan-500 font-semibold">+{activity.xp_earned} XP</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
