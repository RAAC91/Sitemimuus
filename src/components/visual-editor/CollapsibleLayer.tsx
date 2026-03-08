
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleLayerProps {
    isOpen: boolean;
    onToggle: () => void;
    title: string;
    onTitleChange?: (newTitle: string) => void;
    icon?: React.ReactNode;
    onDelete?: () => void;
    children: React.ReactNode;
}

export const CollapsibleLayer: React.FC<CollapsibleLayerProps> = ({
    isOpen,
    onToggle,
    title,
    onTitleChange,
    icon,
    onDelete,
    children,
}) => {
    return (
        <div className="border border-white/30 rounded-2xl overflow-hidden glass-panel mb-4 shadow-sm group transition-all hover:shadow-md">
            {/* Header - sempre visível */}
            <div
                role="button"
                tabIndex={0}
                onClick={onToggle}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onToggle();
                    }
                }}
                className="w-full flex items-center gap-3 p-5 hover:bg-white/40 transition-colors cursor-pointer outline-none focus:bg-white/40"
            >
                {/* Ícone de expand/collapse */}
                <div className="text-slate-400 group-hover:text-indigo-500 transition-colors">
                    {isOpen ? (
                        <ChevronDown className="w-5 h-5" />
                    ) : (
                        <ChevronRight className="w-5 h-5" />
                    )}
                </div>

                {/* Ícone do tipo */}
                {icon && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/80 shadow-inner flex items-center justify-center text-indigo-600 font-semibold ring-1 ring-black/5">
                        {icon}
                    </div>
                )}

                {/* Título */}
                <div className="flex-1 text-left min-w-0">
                    {onTitleChange ? (
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => onTitleChange(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            className="w-full bg-transparent border-none text-sm font-bold text-gray-800 focus:outline-none focus:ring-0 p-0 placeholder:text-gray-400"
                            placeholder="Nome da camada..."
                        />
                    ) : (
                        <p className="text-sm font-bold text-gray-800 truncate">
                            {title}
                        </p>
                    )}
                </div>

                {/* Botão deletar */}
                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="flex-shrink-0 p-2 text-gray-400 hover:text-white hover:bg-red-500 rounded-lg transition-all"
                        title="Deletar"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                )}
            </div>

            {/* Conteúdo - visível apenas quando aberto */}
            {isOpen && (
                <div className="px-5 pb-5 pt-3 border-t border-white/20 bg-white/20">
                    {children}
                </div>
            )}
        </div>
    );
};
