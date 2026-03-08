"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { useProductDisplay } from "@/contexts/ProductDisplayContext";
import { useAdmin } from "@/hooks/useAdmin";

export function ProductDisplayControls() {
  const [isOpen, setIsOpen] = useState(false);
  const { config, updateConfig, saveConfig, resetConfig } = useProductDisplay();
  const { isAdmin } = useAdmin();

  if (!isAdmin) return null;

  const handleSave = () => {
    saveConfig();
    toast.success("✅ Configuração gravada com sucesso!");
  };

  const handleReset = () => {
    resetConfig();
    toast.info("🔄 Valores restaurados para padrão");
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-linear-to-br from-cyan-500 to-blue-600 text-white shadow-2xl hover:shadow-cyan-500/50 flex items-center justify-center transition-all hover:scale-110"
          >
            <Settings className="w-7 h-7" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Control Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed bottom-8 right-8 z-50 w-[380px] bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-white">
                  Calibração de Cards
                </h3>
                <p className="text-xs text-white/60 mt-1">
                  Ajuste em tempo real
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Controls */}
            <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
              {/* Zoom */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white/80 uppercase tracking-wider">
                    🔍 Zoom
                  </label>
                  <span className="text-white font-mono text-xs bg-white/10 px-2 py-1 rounded-full">
                    {(config.zoom * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={config.zoom}
                  onChange={(e) =>
                    updateConfig("zoom", parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer slider-thumb"
                />
                <div className="flex justify-between text-xs text-white/40">
                  <span>0.5x</span>
                  <span>2.0x</span>
                </div>
              </div>

              {/* X Position */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white/80 uppercase tracking-wider">
                    ↔️ Posição X
                  </label>
                  <span className="text-white font-mono text-xs bg-white/10 px-2 py-1 rounded-full">
                    {config.xPosition.toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="1"
                  value={config.xPosition}
                  onChange={(e) =>
                    updateConfig("xPosition", parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer slider-thumb"
                />
                <div className="flex justify-between text-xs text-white/40">
                  <span>-50%</span>
                  <span>+50%</span>
                </div>
              </div>

              {/* Y Position */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white/80 uppercase tracking-wider">
                    ↕️ Posição Y
                  </label>
                  <span className="text-white font-mono text-xs bg-white/10 px-2 py-1 rounded-full">
                    {config.yPosition.toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="1"
                  value={config.yPosition}
                  onChange={(e) =>
                    updateConfig("yPosition", parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer slider-thumb"
                />
                <div className="flex justify-between text-xs text-white/40">
                  <span>-50%</span>
                  <span>+50%</span>
                </div>
              </div>

              {/* Rotation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white/80 uppercase tracking-wider">
                    🔄 Rotação
                  </label>
                  <span className="text-white font-mono text-xs bg-white/10 px-2 py-1 rounded-full">
                    {config.rotation.toFixed(1)}°
                  </span>
                </div>
                <input
                  type="range"
                  min="-15"
                  max="15"
                  step="0.5"
                  value={config.rotation}
                  onChange={(e) =>
                    updateConfig("rotation", parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer slider-thumb"
                />
                <div className="flex justify-between text-xs text-white/40">
                  <span>-15°</span>
                  <span>+15°</span>
                </div>
              </div>

              {/* Object Fit */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/80 uppercase tracking-wider">
                  📐 Object Fit
                </label>
                <select
                  value={config.objectFit}
                  onChange={(e) =>
                    updateConfig(
                      "objectFit",
                      e.target.value as "contain" | "cover" | "fill",
                    )
                  }
                  className="w-full bg-white/10 text-white text-sm px-3 py-2 rounded-lg focus:bg-white/20 focus:outline-none"
                >
                  <option value="contain">Contain (padrão)</option>
                  <option value="cover">Cover (preencher)</option>
                  <option value="fill">Fill (esticar)</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleSave}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                Gravar Configuração
              </button>
              <button
                onClick={handleReset}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Restaurar Padrão
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
