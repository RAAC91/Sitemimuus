"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottlePreview } from "./BottlePreview";
import { EditorLayer } from "./constants";
import { X, RotateCcw, Save, Check } from "lucide-react";
import { toast } from "sonner";

interface CaptureCalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCapture: (config: CaptureConfig) => void;
  sku: string;
  lidColor: string;
  layers: EditorLayer[];
  isBusy: boolean;
  defaultTextPosition: { x: number; y: number };
}

export interface CaptureConfig {
  zoom: number;
  xPosition: number;
  yPosition: number;
  width: number;
  height: number;
  rotation: number;
  margin: number;
}

const DEFAULT_CONFIG: CaptureConfig = {
  zoom: 1.2,
  xPosition: 0,
  yPosition: 50,
  width: 600,
  height: 750,
  rotation: 0,
  margin: 0,
};

export const CaptureCalibrationModal: React.FC<
  CaptureCalibrationModalProps
> = ({
  isOpen,
  onClose,
  onConfirmCapture,
  sku,
  lidColor,
  layers,
  isBusy,
  defaultTextPosition,
}) => {
  // Load from localStorage or use defaults
  const [config, setConfig] = useState<CaptureConfig>(() => {
    if (typeof window === "undefined") return DEFAULT_CONFIG;

    const getVal = (key: string, def: string) => {
        // Try SKU specific first, then global
        return localStorage.getItem(`mimuus_capture_${sku}_${key}`) || 
               localStorage.getItem(`mimuus_capture_${key}`) || 
               def;
    };

    return {
      zoom: parseFloat(getVal("zoom", DEFAULT_CONFIG.zoom.toString())),
      xPosition: parseFloat(getVal("x_position", DEFAULT_CONFIG.xPosition.toString())),
      yPosition: parseFloat(getVal("y_position", DEFAULT_CONFIG.yPosition.toString())),
      width: parseInt(getVal("width", DEFAULT_CONFIG.width.toString())),
      height: parseInt(getVal("height", DEFAULT_CONFIG.height.toString())),
      rotation: parseFloat(getVal("rotation", DEFAULT_CONFIG.rotation.toString())),
      margin: parseFloat(getVal("margin", DEFAULT_CONFIG.margin.toString())),
    };
  });

  const [showGuides, setShowGuides] = useState(true);

  const updateConfig = (key: keyof CaptureConfig, value: number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveConfiguration = () => {
    const save = (key: string, val: string) => {
        localStorage.setItem(`mimuus_capture_${sku}_${key}`, val);
        // Also update global for convenience as fallback for NEW Skus
        localStorage.setItem(`mimuus_capture_${key}`, val);
    };

    save("zoom", config.zoom.toString());
    save("x_position", config.xPosition.toString());
    save("y_position", config.yPosition.toString());
    save("width", config.width.toString());
    save("height", config.height.toString());
    save("rotation", config.rotation.toString());
    save("margin", config.margin.toString());

    toast.success(`✅ Configuração para ${sku} gravada!`);
  };

  const handleResetToDefaults = () => {
    setConfig(DEFAULT_CONFIG);
    toast.info("🔄 Valores restaurados para padrão");
  };

  const handleConfirm = () => {
    onConfirmCapture(config);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-0"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all z-[110]"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Main Container */}
        <div className="w-full h-full flex">
          {/* LEFT SIDEBAR: Controls */}
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-[380px] h-full bg-white/5 backdrop-blur-2xl border-r border-white/10 p-6 overflow-y-auto flex flex-col"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white mb-2">
                Calibração de Captura
              </h2>
              <p className="text-sm text-white/60">
                Ajuste todos os parâmetros em tempo real
              </p>
            </div>

            <div className="flex-1 space-y-6">
              {/* Zoom Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-white/80 uppercase tracking-wider">
                    🔍 Zoom
                  </label>
                  <span className="text-white font-mono text-sm bg-white/10 px-3 py-1 rounded-full">
                    {(config.zoom * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={config.zoom}
                  onChange={(e) =>
                    updateConfig("zoom", parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer slider-thumb"
                />
                <div className="flex justify-between text-xs text-white/40">
                  <span>0.5x</span>
                  <span>3.0x</span>
                </div>
              </div>

              {/* X Position Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-white/80 uppercase tracking-wider">
                    ↔️ Posição X
                  </label>
                  <span className="text-white font-mono text-sm bg-white/10 px-3 py-1 rounded-full">
                    {config.xPosition.toFixed(0)}px
                  </span>
                </div>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  step="5"
                  value={config.xPosition}
                  onChange={(e) =>
                    updateConfig("xPosition", parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer slider-thumb"
                />
                <div className="flex justify-between text-xs text-white/40">
                  <span>-200px</span>
                  <span>+200px</span>
                </div>
              </div>

              {/* Y Position Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-white/80 uppercase tracking-wider">
                    ↕️ Posição Y
                  </label>
                  <span className="text-white font-mono text-sm bg-white/10 px-3 py-1 rounded-full">
                    {config.yPosition.toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={config.yPosition}
                  onChange={(e) =>
                    updateConfig("yPosition", parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer slider-thumb"
                />
                <div className="flex justify-between text-xs text-white/40">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Width Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-white/80 uppercase tracking-wider">
                    📏 Largura
                  </label>
                  <input
                    type="number"
                    min="300"
                    max="1200"
                    step="10"
                    value={config.width}
                    onChange={(e) =>
                      updateConfig("width", parseInt(e.target.value))
                    }
                    className="w-20 bg-white/10 text-white font-mono text-sm px-2 py-1 rounded-lg text-right focus:bg-white/20 focus:outline-none"
                  />
                </div>
                <input
                  type="range"
                  min="300"
                  max="1200"
                  step="10"
                  value={config.width}
                  onChange={(e) =>
                    updateConfig("width", parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer slider-thumb"
                />
                <div className="flex justify-between text-xs text-white/40">
                  <span>300px</span>
                  <span>1200px</span>
                </div>
              </div>

              {/* Height Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-white/80 uppercase tracking-wider">
                    📐 Altura
                  </label>
                  <input
                    type="number"
                    min="400"
                    max="1500"
                    step="10"
                    value={config.height}
                    onChange={(e) =>
                      updateConfig("height", parseInt(e.target.value))
                    }
                    className="w-20 bg-white/10 text-white font-mono text-sm px-2 py-1 rounded-lg text-right focus:bg-white/20 focus:outline-none"
                  />
                </div>
                <input
                  type="range"
                  min="400"
                  max="1500"
                  step="10"
                  value={config.height}
                  onChange={(e) =>
                    updateConfig("height", parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer slider-thumb"
                />
                <div className="flex justify-between text-xs text-white/40">
                  <span>400px</span>
                  <span>1500px</span>
                </div>
              </div>

              {/* Rotation Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-white/80 uppercase tracking-wider">
                    🔄 Rotação
                  </label>
                  <span className="text-white font-mono text-sm bg-white/10 px-3 py-1 rounded-full">
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

              {/* Margin Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-white/80 uppercase tracking-wider">
                    📦 Margem
                  </label>
                  <span className="text-white font-mono text-sm bg-white/10 px-3 py-1 rounded-full">
                    {config.margin.toFixed(0)}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={config.margin}
                  onChange={(e) =>
                    updateConfig("margin", parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer slider-thumb"
                />
                <div className="flex justify-between text-xs text-white/40">
                  <span>0px</span>
                  <span>100px</span>
                </div>
              </div>

              {/* Show Guides Toggle */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <label className="text-sm font-bold text-white/80 uppercase tracking-wider">
                  Mostrar Guias
                </label>
                <button
                  onClick={() => setShowGuides(!showGuides)}
                  className={`w-12 h-6 rounded-full transition-all ${showGuides ? "bg-emerald-500" : "bg-white/20"}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-lg transition-transform ${showGuides ? "translate-x-6" : "translate-x-0.5"}`}
                  />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleSaveConfiguration}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <Save className="w-5 h-5" />
                Gravar Configuração
              </button>
              <button
                onClick={handleResetToDefaults}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                Restaurar Padrão
              </button>
            </div>
          </motion.div>

          {/* RIGHT SIDE: Preview */}
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="mb-4">
              <p className="text-white/60 text-sm">
                Preview de captura ({config.width}x{config.height}px)
              </p>
            </div>

            {/* Preview Container with Capture Frame */}
            <div className="relative">
              <div
                id="capture-preview-target"
                className="relative bg-white"
                style={{
                  width: `${config.width}px`,
                  height: `${config.height}px`,
                  padding: `${config.margin}px`,
                }}
              >
                <BottlePreview
                  sku={sku}
                  lidColor={lidColor}
                  layers={layers}
                  selectedLayerId={null}
                  isBusy={false}
                  onUndo={() => {}}
                  onRedo={() => {}}
                  onReset={() => {}}
                  canUndo={false}
                  canRedo={false}
                  onSelectLayer={() => {}}
                  onUpdateLayer={() => {}}
                  zoom={config.zoom}
                  yOffset={(config.yPosition - 50) * 3}
                  hideCanvasBackground={true}
                  hideUI={true}
                  draftTextPosition={defaultTextPosition}
                />
              </div>

              {/* Guide Overlay */}
              {showGuides && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Center Crosshair */}
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-400/50" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-400/50" />

                  {/* Corner Markers */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400/70" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/70" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400/70" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400/70" />
                </div>
              )}
            </div>

            {/* Confirm & Simulation Container */}
            <div className="mt-8 flex items-center gap-8">
              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                disabled={isBusy}
                className="px-12 py-4 rounded-2xl bg-emerald-500 text-white font-black text-lg hover:bg-emerald-600 shadow-2xl hover:shadow-emerald-500/50 transition-all flex items-center gap-3 disabled:opacity-50"
              >
                <Check className="w-6 h-6" />
                {isBusy ? "Capturando..." : "Confirmar e Capturar"}
              </button>

              {/* Sacola Simulation */}
              <div className="flex flex-col items-center gap-2">
                 <div className="w-[120px] h-[160px] bg-gray-50 border-2 border-brand-pink/30 rounded-lg overflow-hidden flex items-center justify-center relative shadow-xl p-1">
                    <div style={{ 
                        transform: `scale(${Math.min(112/config.width, 152/config.height)})`, 
                        transformOrigin: 'center' 
                    }}>
                       <div style={{ width: config.width, height: config.height }}>
                          <BottlePreview
                            sku={sku}
                            lidColor={lidColor}
                            layers={layers}
                            selectedLayerId={null}
                            isBusy={false}
                            onUndo={() => {}} onRedo={() => {}} onReset={() => {}}
                            canUndo={false} canRedo={false} onSelectLayer={() => {}} onUpdateLayer={() => {}}
                            zoom={config.zoom}
                            yOffset={(config.yPosition - 50) * 3}
                            hideCanvasBackground={true}
                            hideUI={true}
                            draftTextPosition={defaultTextPosition}
                          />
                       </div>
                    </div>
                    <div className="absolute inset-0 border border-brand-pink/10 pointer-events-none" />
                 </div>
                 <span className="text-[10px] font-black text-brand-pink uppercase tracking-tighter">Simulação Sacola (3:4)</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
