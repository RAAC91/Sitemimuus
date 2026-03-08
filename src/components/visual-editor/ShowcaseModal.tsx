'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './Icons';

interface ShowcaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    sku: string;
    lidColor?: string;
    previewUrl?: string; // Added optional previewUrl
}

export const ShowcaseModal: React.FC<ShowcaseModalProps> = ({ isOpen, onClose, onConfirm, previewUrl }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={onClose} />
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl overflow-hidden"
                    >
                        {/* Glow Effects */}
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-brand-pink/20 blur-[100px] rounded-full pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-brand-cyan/20 blur-[100px] rounded-full pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center text-center">
                            {previewUrl ? (
                                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg overflow-hidden border-4 border-white/10">
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-20 h-20 bg-linear-to-br from-brand-pink to-brand-cyan rounded-full flex items-center justify-center mb-6 shadow-lg animate-bounce">
                                    <Icons.Check className="w-10 h-10 text-white" />
                                </div>
                            )}
                            
                            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-wide">Ficou Incrível!</h2>
                            <p className="text-slate-400 mb-8">Sua garrafa personalizada está pronta.</p>

                            <div className="flex flex-col gap-3 w-full">
                                {onConfirm && (
                                    <button
                                        onClick={onConfirm}
                                        className="w-full py-4 bg-white text-slate-900 rounded-lg font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-white/20"
                                    >
                                        Adicionar ao Carrinho
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-transparent border border-white/10 text-white rounded-lg font-bold uppercase tracking-widest hover:bg-white/5 active:scale-95 transition-all"
                                >
                                    Continuar Editando
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
