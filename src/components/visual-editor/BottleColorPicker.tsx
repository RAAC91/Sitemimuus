
import React from 'react';
import Image from 'next/image';
import { SKUS } from './constants';

interface BottleColorPickerProps {
    selectedSku: string;
    onSelectSku: (sku: string) => void;
}

export const BottleColorPicker: React.FC<BottleColorPickerProps> = ({ selectedSku, onSelectSku }) => {
    /** Strip existing ImageKit transform and apply a top-focused square crop */
    const capUrl = (src: string) =>
        src.replace(/\?tr=[^#]*/, '') + '?tr=w-200,h-200,fo-top,cm-extract';

    return (
        /* Floating bar — rounded-[8px] igual ao botão Comprar */
        <div className="
            inline-flex items-center gap-2
            px-3 py-2 rounded-[8px]
            bg-white/65 backdrop-blur-2xl
            border border-white/70
            shadow-[0_4px_20px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.06)]
        ">
            {/* Label */}
            <span className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400 whitespace-nowrap select-none leading-none">
                ✦ Cor
            </span>

            {/* Divider */}
            <div className="w-px h-5 bg-slate-200/80 shrink-0" />

            {/* Swatches — 1:1 square, ImageKit top crop */}
            <div className="flex items-center gap-2">
                {Object.entries(SKUS).map(([key, sku]) => {
                    const isActive = selectedSku === key;

                    return (
                        <button
                            key={key}
                            onClick={() => onSelectSku(key)}
                            title={sku.name}
                            aria-label={`Garrafa ${sku.name}`}
                            className={`
                                relative overflow-hidden rounded-[6px]
                                transition-all duration-200 cursor-pointer shrink-0
                                ${isActive
                                    ? 'w-12 h-12 ring-2 ring-offset-1 ring-slate-700/40 shadow-md'
                                    : 'w-10 h-10 opacity-55 hover:opacity-100 hover:w-11 hover:h-11'
                                }
                            `}
                        >
                            {/* 1:1 top crop via ImageKit */}
                            <Image
                                src={capUrl(sku.img)}
                                alt={sku.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                            />

                            {/* Inset border */}
                            <span
                                className="absolute inset-0 pointer-events-none rounded-[6px]"
                                style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.10)' }}
                            />

                            {/* Active checkmark */}
                            {isActive && (
                                <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Divider + selected name */}
            <div className="w-px h-5 bg-slate-200/80 shrink-0" />
            <span className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-600 whitespace-nowrap select-none min-w-[28px] leading-none">
                {SKUS[selectedSku]?.name.split(' ')[0] ?? selectedSku}
            </span>
        </div>
    );
};

/* ─── Lid Color Picker ─── */

interface LidColorPickerProps {
    selectedColor: string;
    onSelectColor: (color: string) => void;
    vertical?: boolean;
}

export const LidColorPicker: React.FC<LidColorPickerProps> = ({ selectedColor, onSelectColor, vertical = false }) => {
    const LID_COLORS = [
        { name: 'Preto', color: '#000000' },
        { name: 'Branco', color: '#ffffff' },
        { name: 'Prata', color: '#C0C0C0' },
        { name: 'Dourado', color: '#D4AF37' },
        { name: 'Rosa', color: '#FFC0CB' },
    ];

    return (
        <div className={`
            flex ${vertical ? 'flex-col gap-3 py-4' : 'flex-row gap-2'}
            items-center flex-wrap justify-center
            p-2 rounded-[8px]
            bg-white/60 backdrop-blur-2xl
            border border-white/40 shadow-xl min-w-16
        `}>
            {LID_COLORS.map((lid) => {
                const isWhite = lid.color === '#ffffff';
                return (
                    <button
                        key={lid.color}
                        onClick={() => onSelectColor(lid.color)}
                        className={`
                            w-6 h-6 rounded-[6px] border-2 transition-all
                            hover:scale-110 active:scale-90 shadow-sm
                            ${selectedColor === lid.color
                                ? 'border-rose-400 scale-110 ring-2 ring-rose-200'
                                : isWhite ? 'border-slate-200' : 'border-white hover:border-slate-200'
                            }
                        `}
                        style={{ backgroundColor: lid.color }}
                        title={`Tampa ${lid.name}`}
                        aria-label={`Tampa ${lid.name}`}
                    />
                );
            })}
        </div>
    );
};
