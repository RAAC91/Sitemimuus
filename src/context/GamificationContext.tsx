'use client';

import React, { createContext, useContext, useState } from 'react';

interface XPToast {
    id: number;
    amount: number;
    label: string;
}

interface GamificationContextType {
    xp: number;
    level: number;
    toasts: XPToast[];
    addXP: (amount: number, label: string) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [xp, setXp] = useState(0);
    const [toasts, setToasts] = useState<XPToast[]>([]);

    const level = Math.floor(xp / 100) + 1;

    const addXP = (amount: number, label: string) => {
        setXp(prev => prev + amount);
        const newToast = { id: Date.now(), amount, label };
        setToasts(prev => [...prev, newToast]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== newToast.id));
        }, 3000);
    };

    return (
        <GamificationContext.Provider value={{ xp, level, toasts, addXP }}>
            {children}
        </GamificationContext.Provider>
    );
};

export const useGamification = () => {
    const context = useContext(GamificationContext);
    if (!context) throw new Error('useGamification must be used within GamificationProvider');
    return context;
};
