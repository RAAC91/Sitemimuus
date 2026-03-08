'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '@/context/GamificationContext';

export const XPToast = () => {
    const { toasts } = useGamification();

    return (
        <div className="fixed top-24 right-6 z-100 flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 20, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.8 }}
                        className="bg-slate-900/90 backdrop-blur-md border border-brand-pink/30 p-3 rounded-2xl shadow-xl flex items-center gap-3 pr-6"
                    >
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-yellow-400 to-amber-600 flex items-center justify-center font-black text-white shadow-inner animate-bounce">
                            +{toast.amount}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-sm tracking-wide">{toast.label}</span>
                            <span className="text-xs text-yellow-400 font-bold uppercase tracking-widest">XP Ganho</span>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
