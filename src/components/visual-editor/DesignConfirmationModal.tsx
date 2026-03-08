'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './Icons';
import { Loader2 } from 'lucide-react';

interface DesignConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    previewImage: string | null;
    isUploading: boolean;
}

export const DesignConfirmationModal: React.FC<DesignConfirmationModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    previewImage,
    isUploading 
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-all duration-300" 
                        onClick={!isUploading ? onClose : undefined} 
                    />
                    
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="relative z-10 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-1 shadow-2xl max-w-lg w-full overflow-hidden"
                    >
                        {/* Glass Container */}
                        <div className="bg-white/70 backdrop-blur-xl rounded-[2.3rem] p-8 flex flex-col items-center text-center relative overflow-hidden">
                            
                            {/* Decorative Gradients */}
                            <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-rose-100/50 to-transparent pointer-events-none" />
                            
                            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide mb-2 relative z-10">
                                Ficou Perfeito?
                            </h2>
                            <p className="text-slate-500 text-sm mb-8 max-w-xs relative z-10">
                                Confira como ficou sua personalização antes de continuarmos.
                            </p>

                            {/* Image Preview */}
                            <div className="relative w-64 h-64 mb-8 bg-white rounded-2xl shadow-inner border border-slate-100 flex items-center justify-center overflow-hidden group">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#f8fafc_0%,#e2e8f0_100%)] opacity-50" />
                                {previewImage ? (
                                    <img 
                                        src={previewImage} 
                                        alt="Preview" 
                                        className="relative z-10 w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" 
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-slate-300">
                                        <Icons.Image className="w-12 h-12 mb-2" />
                                        <span className="text-xs font-bold uppercase">Sem Preview</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3 w-full relative z-10">
                                <button
                                    onClick={onConfirm}
                                    disabled={isUploading}
                                    className="w-full py-4 bg-slate-900 text-white rounded-lg font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl hover:shadow-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processando...
                                        </>
                                    ) : (
                                        <>
                                            Sim, Continuar <Icons.ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                                
                                <button
                                    onClick={onClose}
                                    disabled={isUploading}
                                    className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold uppercase tracking-widest hover:bg-slate-50 active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    Voltar e Editar
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
