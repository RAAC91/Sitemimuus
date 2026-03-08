"use client"

import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Package, Clock, CheckCircle, Truck, PackageCheck, Trash2, Eye, ExternalLink } from 'lucide-react';
import { OrderDetailModal } from './OrderDetailModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const statusConfig = {
    pending: { label: 'Pendente', color: 'text-yellow-600 bg-yellow-50 border-yellow-100', icon: Clock },
    paid: { label: 'Pago', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: CheckCircle },
    preparing: { label: 'Preparando', color: 'text-blue-600 bg-blue-50 border-blue-100', icon: Package },
    shipped: { label: 'Enviado', color: 'text-purple-600 bg-purple-50 border-purple-100', icon: Truck },
    delivered: { label: 'Entregue', color: 'text-green-600 bg-green-50 border-green-100', icon: PackageCheck },
    cancelled: { label: 'Cancelado', color: 'text-red-600 bg-red-50 border-red-100', icon: Trash2 },
};

interface OrdersTableProps {
    initialOrders: any[];
    orderItemsMap: any;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ initialOrders, orderItemsMap }) => {
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewDetails = (order: any) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleStatusUpdate = () => {
        window.location.reload(); 
    };

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="text-left p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pedido & Cliente</th>
                            <th className="text-left p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produtos</th>
                            <th className="text-left p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                            <th className="text-left p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="text-left p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                            <th className="text-right p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {initialOrders.map((order: any) => {
                            const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                            const Icon = config.icon;
                            const orderItems = orderItemsMap[order.id] || [];
                            
                            return (
                                <tr key={order.id} className="hover:bg-slate-50/50 transition-all align-top group">
                                    <td className="p-8">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-tighter">#{order.id.slice(0, 8)}</span>
                                            </div>
                                            <p className="font-black text-slate-900 leading-tight text-base hover:text-brand-pink transition-colors cursor-pointer" onClick={() => handleViewDetails(order)}>
                                                {order.customer_name || 'Visitante'}
                                            </p>
                                            <p className="text-[11px] text-slate-500 font-medium">{order.customer_email}</p>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex -space-x-3 overflow-hidden">
                                            {orderItems.map((item: any, idx: number) => (
                                                <div key={idx} className="inline-block h-12 w-12 rounded-2xl ring-4 ring-white bg-slate-100 overflow-hidden border border-slate-200 transition-transform group-hover:translate-y-[-2px]" style={{ transitionDelay: `${idx * 50}ms` }}>
                                                    <img 
                                                        src={item.thumbnail_url} 
                                                        alt="" 
                                                        className="h-full w-full object-cover"
                                                        title={item.product_name}
                                                    />
                                                </div>
                                            ))}
                                            {orderItems.length > 4 && (
                                                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl ring-4 ring-white bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-400">
                                                    +{orderItems.length - 4}
                                                </div>
                                            )}
                                        </div>
                                        <p className="mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            {orderItems.length} {orderItems.length === 1 ? 'item' : 'itens'}
                                        </p>
                                    </td>
                                    <td className="p-8">
                                        <div className="space-y-1">
                                            <p className="font-black text-slate-900 text-lg tracking-tighter">R$ {Number(order.total).toFixed(2)}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 rounded-md px-1.5 w-fit">
                                                {order.payment_method || 'Cartão'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} transition-all group-hover:scale-105`}>
                                            <Icon size={12} strokeWidth={3} />
                                            <span className="text-[10px] font-black uppercase tracking-widest leading-none pt-0.5">{config.label}</span>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] text-slate-900 font-black whitespace-nowrap">
                                                {formatDistanceToNow(new Date(order.created_at), { 
                                                    addSuffix: true,
                                                    locale: ptBR 
                                                })}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium">Original às {new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <Button 
                                            onClick={() => handleViewDetails(order)}
                                            variant="outline" 
                                            className="rounded-2xl border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all px-6 h-12 group/btn shadow-sm"
                                        >
                                            <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" /> 
                                            Ver Detalhes
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <OrderDetailModal 
                    order={selectedOrder}
                    items={orderItemsMap[selectedOrder.id] || []}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onStatusUpdate={handleStatusUpdate}
                />
            )}
        </div>
    );
};
