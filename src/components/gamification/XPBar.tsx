'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useGamification } from '@/context/GamificationContext';

export const XPBar = () => {
    const { xp, level } = useGamification();
    const progress = (xp % 100); 

    return (
        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-full p-1 pl-1.5 pr-4 flex items-center gap-3 shadow-lg hover:bg-slate-900/80 transition-all cursor-help group">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-yellow-400 to-amber-600 flex items-center justify-center font-black text-xs text-white shadow-inner border border-white/20 group-hover:scale-110 transition-transform">
                {level}
            </div>
            
            <div className="flex flex-col gap-0.5 min-w-[100px]">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span>Nível {level}</span>
                    <span className="text-yellow-400">{xp} XP</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="h-full bg-linear-to-r from-brand-pink to-brand-cyan"
                    />
                </div>
            </div>
        </div>
    );
};
