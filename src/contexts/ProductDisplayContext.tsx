"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  ProductDisplayConfig,
  DEFAULT_DISPLAY_CONFIG,
  loadConfigFromStorage,
  saveConfigToStorage,
} from "@/lib/product-display-config";

interface ProductDisplayContextType {
  config: ProductDisplayConfig;
  updateConfig: (key: keyof ProductDisplayConfig, value: number | string) => void;
  saveConfig: () => void;
  resetConfig: () => void;
}

const ProductDisplayContext = createContext<
  ProductDisplayContextType | undefined
>(undefined);

export function ProductDisplayProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [config, setConfig] = useState<ProductDisplayConfig>(() =>
    loadConfigFromStorage(),
  );

  const updateConfig = useCallback(
    (key: keyof ProductDisplayConfig, value: number | string) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const saveConfig = useCallback(() => {
    saveConfigToStorage(config);
  }, [config]);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_DISPLAY_CONFIG);
    saveConfigToStorage(DEFAULT_DISPLAY_CONFIG);
  }, []);

  return (
    <ProductDisplayContext.Provider
      value={{ config, updateConfig, saveConfig, resetConfig }}
    >
      {children}
    </ProductDisplayContext.Provider>
  );
}

export function useProductDisplay() {
  const context = useContext(ProductDisplayContext);
  if (!context) {
    throw new Error(
      "useProductDisplay must be used within ProductDisplayProvider",
    );
  }
  return context;
}
