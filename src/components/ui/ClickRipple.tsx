'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
    x: number;
    y: number;
    id: number;
}

export const ClickRipple = () => {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const newRipple = { x: e.clientX, y: e.clientY, id: Date.now() };
            setRipples(prev => [...prev, newRipple]);
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    // Clean up old ripples
    useEffect(() => {
        if (ripples.length > 0) {
            const timer = setTimeout(() => {
                setRipples(prev => prev.slice(1));
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [ripples]);

    return (
        <div className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden">
            <AnimatePresence>
                {ripples.map((ripple) => (
                    <motion.div
                        key={ripple.id}
                        initial={{ opacity: 0.8, scale: 0, border: '2px solid #00E5CC' }}
                        animate={{ opacity: 0, scale: 3, borderWidth: '0px' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute w-8 h-8 rounded-full blur-[1px]"
                        style={{ 
                            left: ripple.x, 
                            top: ripple.y,
                            transform: 'translate(-50%, -50%)'
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};
