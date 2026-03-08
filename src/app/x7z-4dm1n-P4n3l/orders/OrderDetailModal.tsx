"use client"

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Clock,
    CheckCircle,
    Package,
    Truck,
    PackageCheck,
    XCircle,
    MapPin,
    Phone,
    Mail,
    User,
    ExternalLink,
    AlertCircle,
    Copy,
    Check,
    ArrowLeft,
    Type,
    Image as ImageIcon,
    Sticker,
    Download,
    Layers,
    RotateCw,
    Maximize2,
    Eye,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { updateOrderStatus } from './admin-actions';
import { toast } from 'sonner';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface EditorLayer {
    id: string;
    type: 'text' | 'image' | 'icon';
    content?: string;
    text?: string;
    font?: string;
    color?: string;
    fontSize?: number;
    x?: number;
    y?: number;
    rotation?: number;
    size?: number;
    opacity?: number;
    isBold?: boolean;
    isItalic?: boolean;
    rawImg?: string;
}

interface OrderDetailModalProps {
    order: any;
    items: any[];
    isOpen: boolean;
    onClose: () => void;
    onStatusUpdate: () => void;
}

// ─── Status pipeline (ordered) ─────────────────────────────────────────────────

const STATUS_PIPELINE = [
    { id: 'pending',   label: 'Pendente',   icon: Clock,        color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
    { id: 'paid',      label: 'Pago',        icon: CheckCircle,  color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
    { id: 'preparing', label: 'Preparando',  icon: Package,      color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
    { id: 'shipped',   label: 'Enviado',     icon: Truck,        color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
    { id: 'delivered', label: 'Entregue',    icon: PackageCheck, color: '#22c55e', bg: '#f0fdf4', border: '#86efac' },
    { id: 'cancelled', label: 'Cancelado',   icon: XCircle,      color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
];

// ─── LayersSection ─────────────────────────────────────────────────────────────

const LayersSection: React.FC<{ layers: EditorLayer[]; previewImage?: string }> = ({ layers, previewImage }) => {
    const [expanded, setExpanded] = useState(true);

    const textLayers  = layers.filter(l => l.type === 'text');
    const imageLayers = layers.filter(l => l.type === 'image');
    const iconLayers  = layers.filter(l => l.type === 'icon');

    if (!layers.length) return (
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400">
            <Layers size={14} />
            <span className="text-xs font-bold">Sem camadas de customização</span>
        </div>
    );

    return (
        <div className="space-y-3">
            {previewImage && (
                <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-2xl border border-slate-800">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-white shrink-0 border border-slate-700">
                        <img src={previewImage} alt="Design Final" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Design de Referência</p>
                        <p className="text-sm font-black text-white">Imagem capturada do editor</p>
                        <a
                            href={previewImage}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-rose-400 hover:underline"
                        >
                            <Download size={10} /> Ver em tela cheia
                        </a>
                    </div>
                </div>
            )}

            <button
                onClick={() => setExpanded(v => !v)}
                className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-100 transition-all"
            >
                <div className="flex items-center gap-2 text-slate-500">
                    <Layers size={12} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{layers.length} camadas de customização</span>
                </div>
                {expanded ? <ChevronUp size={12} className="text-slate-400" /> : <ChevronDown size={12} className="text-slate-400" />}
            </button>

            {expanded && (
                <div className="space-y-2 pl-2 border-l-2 border-slate-100">
                    {textLayers.map((layer, i) => (
                        <div key={layer.id} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                                <Type size={12} className="text-rose-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Texto {i + 1}</p>
                                <p className="text-sm font-black text-slate-900 break-words">"{layer.text || layer.content || '—'}"</p>
                                <div className="flex items-center gap-3 mt-2 flex-wrap">
                                    {layer.font && (
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                            🔤 {layer.font}
                                        </span>
                                    )}
                                    {layer.color && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                            <span className="w-2.5 h-2.5 rounded-full border border-slate-200 shrink-0" style={{ backgroundColor: layer.color }} />
                                            {layer.color}
                                        </span>
                                    )}
                                    {layer.fontSize && (
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                            {layer.fontSize}px
                                        </span>
                                    )}
                                    {(layer.isBold || layer.isItalic) && (
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                            {layer.isBold ? 'Negrito' : ''}{layer.isBold && layer.isItalic ? ' + ' : ''}{layer.isItalic ? 'Itálico' : ''}
                                        </span>
                                    )}
                                    {layer.rotation != null && layer.rotation !== 0 && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                            <RotateCw size={8} /> {layer.rotation.toFixed(0)}°
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {imageLayers.map((layer, i) => {
                        const src = layer.rawImg || layer.content || '';
                        return (
                            <div key={layer.id} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="w-16 h-16 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                                    {src && <img src={src} alt="" className="w-full h-full object-contain" />}
                                    {!src && <ImageIcon size={20} className="text-slate-300 m-auto mt-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Imagem {i + 1}</p>
                                    <p className="text-xs font-bold text-slate-500 mb-2">Imagem personalizada do cliente</p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {layer.size != null && (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                                <Maximize2 size={8} /> {layer.size}%
                                            </span>
                                        )}
                                        {layer.opacity != null && layer.opacity !== 1 && (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                                <Eye size={8} /> {Math.round((layer.opacity ?? 1) * 100)}%
                                            </span>
                                        )}
                                        {src && (
                                            <a
                                                href={src}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-100 hover:bg-rose-100 transition-all"
                                            >
                                                <Download size={8} /> Download
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {iconLayers.map((layer, i) => {
                        const src = layer.content || '';
                        return (
                            <div key={layer.id} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden p-2 shrink-0">
                                    {src && <img src={src} alt="" className="w-full h-full object-contain" />}
                                    {!src && <Sticker size={20} className="text-slate-300" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Ícone / Sticker {i + 1}</p>
                                    <div className="flex items-center gap-2 flex-wrap mt-1">
                                        {layer.size != null && (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                                <Maximize2 size={8} /> {layer.size}%
                                            </span>
                                        )}
                                        {layer.rotation != null && layer.rotation !== 0 && (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                                <RotateCw size={8} /> {layer.rotation.toFixed(0)}°
                                            </span>
                                        )}
                                        {src && (
                                            <a
                                                href={src}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-all"
                                            >
                                                <ExternalLink size={8} /> Ver
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ─── StatusTimeline ─────────────────────────────────────────────────────────────

const StatusTimeline: React.FC<{
    currentStatus: string;
    isUpdating: boolean;
    onUpdate: (status: string) => void;
}> = ({ currentStatus, isUpdating, onUpdate }) => {
    // Cancelled is handled separately — pipeline only covers the main flow
    const pipeline = STATUS_PIPELINE.filter(s => s.id !== 'cancelled');
    const cancelledStatus = STATUS_PIPELINE.find(s => s.id === 'cancelled')!;

    const currentIdx = pipeline.findIndex(s => s.id === currentStatus);
    const isCancelled = currentStatus === 'cancelled';

    const canGoBack    = !isCancelled && currentIdx > 0;
    const canGoForward = !isCancelled && currentIdx < pipeline.length - 1;

    return (
        <div className="space-y-4">
            {/* Timeline bar */}
            <div className="relative">
                {/* Track */}
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-slate-100" />
                {/* Progress fill */}
                {!isCancelled && currentIdx >= 0 && (
                    <motion.div
                        className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-rose-400 to-rose-300"
                        initial={false}
                        animate={{ width: `calc(${(currentIdx / (pipeline.length - 1)) * 100}% - 0px)` }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                    />
                )}

                {/* Steps */}
                <div className="relative flex justify-between">
                    {pipeline.map((step, idx) => {
                        const Icon = step.icon;
                        const isPast    = !isCancelled && idx < currentIdx;
                        const isCurrent = !isCancelled && idx === currentIdx;
                        const isFuture  = isCancelled || idx > currentIdx;

                        return (
                            <button
                                key={step.id}
                                disabled={isUpdating}
                                onClick={() => onUpdate(step.id)}
                                className="flex flex-col items-center gap-2 group"
                                title={step.label}
                            >
                                <motion.div
                                    animate={{
                                        scale: isCurrent ? 1.15 : 1,
                                        backgroundColor: isCurrent ? step.color : isPast ? step.color : '#e2e8f0',
                                    }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-shadow ${
                                        isCurrent ? 'shadow-lg ring-4 ring-offset-2' : 'shadow-sm'
                                    } ${isFuture && !isCurrent ? 'opacity-40' : ''} ${
                                        !isUpdating ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'
                                    }`}
                                    style={isCurrent ? { '--tw-ring-color': step.border } as any : {}}
                                >
                                    <Icon
                                        size={16}
                                        style={{ color: (isCurrent || isPast) ? '#ffffff' : '#94a3b8' }}
                                    />
                                </motion.div>
                                <span
                                    className="text-[9px] font-black uppercase tracking-wider text-center leading-tight"
                                    style={{ color: isCurrent ? step.color : isPast ? '#64748b' : '#cbd5e1' }}
                                >
                                    {step.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-2">
                <button
                    disabled={!canGoBack || isUpdating}
                    onClick={() => canGoBack && onUpdate(pipeline[currentIdx - 1].id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                        canGoBack && !isUpdating
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                    }`}
                >
                    <ChevronLeft size={14} /> Retroceder
                </button>

                {/* Cancelled button */}
                <button
                    disabled={isUpdating}
                    onClick={() => onUpdate(isCancelled ? 'pending' : 'cancelled')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                        isCancelled
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-100'
                    }`}
                >
                    <XCircle size={12} />
                    {isCancelled ? 'Reativar' : 'Cancelar'}
                </button>

                <button
                    disabled={!canGoForward || isUpdating}
                    onClick={() => canGoForward && onUpdate(pipeline[currentIdx + 1].id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                        canGoForward && !isUpdating
                            ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm'
                            : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                    }`}
                >
                    Avançar <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
};

// ─── Main Panel ─────────────────────────────────────────────────────────────────

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, items, isOpen, onClose, onStatusUpdate }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [copiedId, setCopiedId]     = useState(false);
    // Local status mirrors DB so UI reflects changes instantly
    const [localStatus, setLocalStatus] = useState<string>(order?.status ?? 'pending');

    // Sync when order prop changes (e.g. parent re-fetch)
    React.useEffect(() => {
        if (order?.status) setLocalStatus(order.status);
    }, [order?.status]);

    const handleUpdateStatus = async (newStatus: string) => {
        if (newStatus === localStatus) return;
        const prev = localStatus;
        setLocalStatus(newStatus); // Optimistic update
        setIsUpdating(true);
        try {
            const result = await updateOrderStatus(order.id, newStatus);
            if (result.success) {
                toast.success(`Status → ${STATUS_PIPELINE.find(s => s.id === newStatus)?.label}`);
                onStatusUpdate();
            } else {
                setLocalStatus(prev); // Rollback
                toast.error('Erro ao atualizar status');
            }
        } catch {
            setLocalStatus(prev);
            toast.error('Ocorreu um erro inesperado');
        } finally {
            setIsUpdating(false);
        }
    };

    const copyOrderId = () => {
        navigator.clipboard.writeText(order.id);
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
    };

    if (!isOpen || !order) return null;

    const currentStatusInfo = STATUS_PIPELINE.find(s => s.id === localStatus);
    const dateFormatted = new Date(order.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

    return (
        <AnimatePresence>
            <motion.div
                key="order-detail-panel"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 60 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="fixed inset-0 z-50 bg-slate-50 flex flex-col overflow-hidden"
            >
                {/* ── TOP BAR ──────────────────────────────────────── */}
                <div className="h-14 shrink-0 flex items-center gap-4 px-6 bg-white border-b border-slate-100 shadow-sm">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors text-[11px] font-black uppercase tracking-wider"
                    >
                        <ArrowLeft size={15} /> Voltar
                    </button>

                    <div className="w-px h-5 bg-slate-200" />

                    {/* Order ID */}
                    <button onClick={copyOrderId} className="flex items-center gap-1.5 group">
                        <span className="font-mono text-xs text-slate-500 group-hover:text-slate-800 transition-colors">
                            #{order.order_number || order.id.slice(0, 8).toUpperCase()}
                        </span>
                        {copiedId
                            ? <Check size={11} className="text-emerald-500" />
                            : <Copy size={11} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                        }
                    </button>

                    {/* Status badge */}
                    {currentStatusInfo && (
                        <div
                            className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black"
                            style={{ color: currentStatusInfo.color, backgroundColor: currentStatusInfo.bg, borderColor: currentStatusInfo.border }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentStatusInfo.color }} />
                            {currentStatusInfo.label}
                        </div>
                    )}

                    <div className="flex-1" />
                    <p className="text-[11px] text-slate-400 font-medium">{dateFormatted}</p>
                    <div className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-sm font-black">
                        R$ {Number(order.total).toFixed(2)}
                    </div>
                </div>

                {/* ── SCROLLABLE BODY ───────────────────────────────── */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8 pb-16">

                        {/* ── STATUS TIMELINE ──────────────────────── */}
                        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                <Clock size={10} /> Status do Pedido
                            </p>
                            <StatusTimeline
                                currentStatus={localStatus}
                                isUpdating={isUpdating}
                                onUpdate={handleUpdateStatus}
                            />
                            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg mt-5">
                                <AlertCircle size={13} className="text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] font-bold text-amber-700 leading-snug">
                                    Alterações de status disparam notificações por e-mail automaticamente ao cliente.
                                </p>
                            </div>
                        </section>

                        {/* ── INFO: 3 COLS ─────────────────────────── */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Cliente */}
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                    <User size={10} /> Cliente
                                </p>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-base font-black text-slate-900">{order.customer_name || 'Visitante'}</p>
                                    </div>
                                    <a
                                        href={`mailto:${order.customer_email}`}
                                        className="flex items-center gap-2 text-xs text-slate-500 hover:text-rose-500 transition-colors"
                                    >
                                        <Mail size={12} className="shrink-0" /> {order.customer_email}
                                    </a>
                                    {order.customer_phone && (
                                        <a
                                            href={`tel:${order.customer_phone}`}
                                            className="flex items-center gap-2 text-xs text-slate-500 hover:text-rose-500 transition-colors"
                                        >
                                            <Phone size={12} className="shrink-0" /> {order.customer_phone}
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Endereço */}
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                    <MapPin size={10} /> Entrega
                                </p>
                                {order.shipping_address ? (
                                    <div className="space-y-1 text-sm text-slate-700">
                                        <p className="font-black">{order.shipping_address.street}, {order.shipping_address.number}</p>
                                        {order.shipping_address.complement && (
                                            <p className="text-xs text-slate-400">{order.shipping_address.complement}</p>
                                        )}
                                        <p className="text-xs text-slate-500">{order.shipping_address.neighborhood}</p>
                                        <p className="text-xs text-slate-500">{order.shipping_address.city} — {order.shipping_address.state}</p>
                                        <p className="text-xs font-black text-slate-400 pt-1">{order.shipping_address.zipCode}</p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 italic">Sem endereço registrado</p>
                                )}
                            </div>

                            {/* Resumo financeiro */}
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">Resumo</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs text-slate-500">
                                        <span>Itens</span>
                                        <span className="font-bold">{items.length} produto{items.length !== 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-slate-500">
                                        <span>Subtotal</span>
                                        <span className="font-bold">R$ {Number(order.subtotal ?? order.total).toFixed(2)}</span>
                                    </div>
                                    {order.shipping_cost != null && (
                                        <div className="flex justify-between items-center text-xs text-slate-500">
                                            <span>Frete</span>
                                            <span className="font-bold">R$ {Number(order.shipping_cost).toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-slate-100 pt-2 flex justify-between items-center">
                                        <span className="text-sm font-black text-slate-900">Total</span>
                                        <span className="text-lg font-black text-slate-900">R$ {Number(order.total).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── PRODUTOS & ASSETS ─────────────────────── */}
                        <section>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                <Package size={10} /> Produtos & Assets de Produção
                            </p>

                            {items.length === 0 ? (
                                <div className="flex items-center gap-3 p-6 bg-white rounded-3xl border border-slate-100 text-slate-400">
                                    <Package size={16} />
                                    <span className="text-sm font-bold">Nenhum produto neste pedido</span>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {items.map((item, idx) => {
                                        const layers: EditorLayer[] = item.customization?.layers || [];
                                        const previewImg = item.customization?.previewImage || item.thumbnail_url || '';

                                        return (
                                            <div key={idx} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                                {/* Product header */}
                                                <div className="flex items-center gap-5 p-6 border-b border-slate-100">
                                                    <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                                                        {previewImg
                                                            ? <img src={previewImg} alt="" className="w-full h-full object-contain" />
                                                            : <Package size={28} className="text-slate-300 m-auto mt-8" />
                                                        }
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-black text-slate-900 text-xl">{item.product_name}</p>
                                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mt-1">
                                                            Qtd: {item.quantity} · R$ {(Number(item.price) * item.quantity).toFixed(2)}
                                                        </p>
                                                        <div className="flex items-center gap-3 mt-3 flex-wrap">
                                                            {item.customization?.backgroundColor && (
                                                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                                                    <span className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: item.customization.backgroundColor }} />
                                                                    Cor base: {item.customization.backgroundColor}
                                                                </span>
                                                            )}
                                                            {item.customization?.lidColor && (
                                                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                                                    <span className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: item.customization.lidColor }} />
                                                                    Cor tampa: {item.customization.lidColor}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {previewImg && (
                                                        <a
                                                            href={previewImg}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="shrink-0 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-rose-500 bg-rose-50 px-3 py-2 rounded-lg border border-rose-100 hover:bg-rose-100 transition-all"
                                                        >
                                                            <Download size={11} /> Design
                                                        </a>
                                                    )}
                                                </div>

                                                {/* Layers */}
                                                <div className="p-6">
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                                        <Layers size={10} /> Assets de Produção · {layers.length} camada{layers.length !== 1 ? 's' : ''}
                                                    </p>
                                                    <LayersSection layers={layers} previewImage={previewImg} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
