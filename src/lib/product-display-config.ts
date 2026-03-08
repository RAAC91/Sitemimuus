export interface ProductDisplayConfig {
  zoom: number; // 0.5 - 2.0
  xPosition: number; // -50 to 50 (%)
  yPosition: number; // -50 to 50 (%)
  rotation: number; // -15 to 15 (degrees)
  objectFit: "contain" | "cover" | "fill";
}

export const DEFAULT_DISPLAY_CONFIG: ProductDisplayConfig = {
  zoom: 1.35, // Increased for better visibility (was 1.0)
  xPosition: 0,
  yPosition: 0,
  rotation: 0,
  objectFit: "contain",
};

// Base configuration for products from the bottle editor
export const EDITOR_BASE_CONFIG: ProductDisplayConfig = {
  zoom: 1.6, // 160% - valores calibrados pelo usuário
  xPosition: 0,
  yPosition: -2,
  rotation: 0,
  objectFit: "contain",
};

export const STORAGE_KEYS = {
  ZOOM: "mimuus_product_display_zoom",
  X_POSITION: "mimuus_product_display_x",
  Y_POSITION: "mimuus_product_display_y",
  ROTATION: "mimuus_product_display_rotation",
  OBJECT_FIT: "mimuus_product_display_object_fit",
} as const;

export function loadConfigFromStorage(): ProductDisplayConfig {
  if (typeof window === "undefined") return DEFAULT_DISPLAY_CONFIG;

  return {
    zoom: parseFloat(
      localStorage.getItem(STORAGE_KEYS.ZOOM) ||
        DEFAULT_DISPLAY_CONFIG.zoom.toString(),
    ),
    xPosition: parseFloat(
      localStorage.getItem(STORAGE_KEYS.X_POSITION) ||
        DEFAULT_DISPLAY_CONFIG.xPosition.toString(),
    ),
    yPosition: parseFloat(
      localStorage.getItem(STORAGE_KEYS.Y_POSITION) ||
        DEFAULT_DISPLAY_CONFIG.yPosition.toString(),
    ),
    rotation: parseFloat(
      localStorage.getItem(STORAGE_KEYS.ROTATION) ||
        DEFAULT_DISPLAY_CONFIG.rotation.toString(),
    ),
    objectFit:
      (localStorage.getItem(STORAGE_KEYS.OBJECT_FIT) as
        | "contain"
        | "cover"
        | "fill") || DEFAULT_DISPLAY_CONFIG.objectFit,
  };
}

export function saveConfigToStorage(config: ProductDisplayConfig): void {
  localStorage.setItem(STORAGE_KEYS.ZOOM, config.zoom.toString());
  localStorage.setItem(STORAGE_KEYS.X_POSITION, config.xPosition.toString());
  localStorage.setItem(STORAGE_KEYS.Y_POSITION, config.yPosition.toString());
  localStorage.setItem(STORAGE_KEYS.ROTATION, config.rotation.toString());
  localStorage.setItem(STORAGE_KEYS.OBJECT_FIT, config.objectFit);
}
