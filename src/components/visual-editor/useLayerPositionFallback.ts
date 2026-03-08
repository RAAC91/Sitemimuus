
import { useEffect } from 'react';
import { EditorLayer } from './constants';

interface FallbackConfig {
  centerX: number;
  centerY: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const DEFAULT_CONFIG: FallbackConfig = {
  centerX: 50,
  centerY: 50,
  minX: 10,
  maxX: 90,
  minY: 10,
  maxY: 90,
};

export function useLayerPositionFallback(
  layers: EditorLayer[],
  onUpdateLayer: (id: string, updates: Partial<EditorLayer>) => void,
  config: Partial<FallbackConfig> = {}
) {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };

  useEffect(() => {
    layers.forEach((layer) => {
      let needsCorrection = false;
      const updates: Partial<EditorLayer> = {};

      if (layer.x < fullConfig.minX || layer.x > fullConfig.maxX) {
        updates.x = fullConfig.centerX;
        needsCorrection = true;
      }

      if (layer.y < fullConfig.minY || layer.y > fullConfig.maxY) {
        updates.y = fullConfig.centerY;
        needsCorrection = true;
      }

      if (needsCorrection) {
        console.log(`[Fallback] Corrigindo layer ${layer.id}`);
        onUpdateLayer(layer.id, updates);
      }
    });
  }, [layers, onUpdateLayer, fullConfig]);
}
