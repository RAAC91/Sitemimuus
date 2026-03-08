"use client";

import React, { useState, useRef } from 'react';
import { X, Target, RotateCcw } from 'lucide-react';
import { SKUS } from './constants';

interface PositionCalibratorProps {
    currentSku: string;
    initialPosition: { x: number; y: number };
    onSave: (position: { x: number; y: number }) => void;
    onCancel: () => void;
}

export function PositionCalibrator({ currentSku, initialPosition, onSave, onCancel }: PositionCalibratorProps) {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Constrain to bottle bounds (5% - 95%)
        const clampedX = Math.max(5, Math.min(95, x));
        const clampedY = Math.max(5, Math.min(95, y));

        setPosition({ x: clampedX, y: clampedY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    React.useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging]);

    const handleReset = () => {
        setPosition({ x: 50, y: 90 });
    };

    const handleSave = () => {
        onSave({ x: Math.round(position.x), y: Math.round(position.y) });
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Target className="w-6 h-6 text-rose-500" />
                        <h2 className="text-2xl font-black text-slate-800">Calibrador de Posição</h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Instructions */}
                <p className="text-slate-600 mb-6 text-sm">
                    Arraste o elemento vermelho para a posição desejada. Esta será a posição padrão para novos textos e imagens.
                </p>

                {/* Preview Container */}
                <div
                    ref={containerRef}
                    className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border-4 border-slate-300 cursor-crosshair"
                    style={{
                        backgroundImage: `url(${SKUS[currentSku]?.img})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    {/* Grid lines (optional) */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[25, 50, 75].map(pos => (
                            <React.Fragment key={pos}>
                                <div className="absolute h-full w-px bg-white/20" style={{ left: `${pos}%` }} />
                                <div className="absolute w-full h-px bg-white/20" style={{ top: `${pos}%` }} />
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Draggable Element */}
                    <div
                        onMouseDown={handleMouseDown}
                        className={`absolute w-16 h-16 -ml-8 -mt-8 cursor-move transition-transform ${
                            isDragging ? 'scale-110' : 'scale-100'
                        }`}
                        style={{
                            left: `${position.x}%`,
                            top: `${position.y}%`,
                        }}
                    >
                        <div className="relative w-full h-full">
                            {/* Cross-hair */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-0.5 bg-rose-500" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-0.5 h-full bg-rose-500" />
                            </div>
                            {/* Center circle */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 bg-rose-500 rounded-full border-2 border-white shadow-lg" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coordinates Display */}
                <div className="mt-6 flex items-center justify-center gap-8 text-lg font-bold">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500">X:</span>
                        <span className="text-rose-600 font-mono">{Math.round(position.x)}%</span>
                    </div>
                    <div className="w-px h-8 bg-slate-300" />
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500">Y:</span>
                        <span className="text-rose-600 font-mono">{Math.round(position.y)}%</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex items-center justify-between gap-4">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 flex items-center gap-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Resetar (50, 90)
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        >
                            Aplicar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
