"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "./Icons";
import { Layer } from "@/types";

interface SelectedLayerHUDProps {
  selectedLayer: Layer | null;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

export function SelectedLayerHUD({
  selectedLayer,
  onRemove,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: SelectedLayerHUDProps) {
  if (!selectedLayer) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[150] hidden lg:flex items-center gap-2 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl"
      >
        <button
          onClick={() => onMoveDown(selectedLayer.id)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title="Mover para Trás"
        >
          <Icons.ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-300 transform rotate-180" />
        </button>
        <button
          onClick={() => onMoveUp(selectedLayer.id)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title="Mover para Frente"
        >
          <Icons.ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
        <button
          onClick={() => onDuplicate(selectedLayer.id)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title="Duplicar"
        >
          <Icons.Plus className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <button
          onClick={() => onRemove(selectedLayer.id)}
          className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
          title="Remover"
        >
          <Icons.Trash className="w-5 h-5 text-rose-500" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
