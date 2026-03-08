import { EditorLayer } from "@/components/visual-editor/constants";

// CONSTANTES DO HYDRA (Mimuus Engine)
const HYDRA_CONFIG = {
    // Dimensões HD da base (Canvas total)
    hdWidth: 2754,
    hdHeight: 2340,
    
    // Mapeamento de Cores (SKU -> Nome do Arquivo)
    colorMap: {
        'Branco': 'white',
        'Preto': 'black',
        'Rosa': 'pink',
        'Azul': 'blue',
        'Lilás': 'lilac',
        'default': 'white'
    } as Record<string, string>,

    // Endpoint do ImageKit
    imageKitId: 'x2or5thkzy',
    skuPath: 'mimuus-assets/hydra-600ml'
};

/**
 * Converte um design do editor em uma URL de produção do ImageKit (Hydra Engine)
 * Baseado na lógica fornecida pelo usuário.
 */
export function getHydraProductionUrl(sku: string, layers: EditorLayer[]): string {
    // Configurações Gocase-Style
    const IK_BASE = `https://ik.imagekit.io/${HYDRA_CONFIG.imageKitId}/`;
    
    // FULL HD Resolution matching BottlePreview.tsx
    // Original Canvas: 2754px x 2340px
    const CANVAS_WIDTH = 2754;
    const CANVAS_HEIGHT = 2340;
    
    // Mapeamento de SKU para arquivo base
    const colorName = HYDRA_CONFIG.colorMap[sku] || 'white';
    
    // Base Bottle Image Path
    const BOTTLE = `${HYDRA_CONFIG.skuPath}/colors/hydra-${colorName}.png`;

    const allTransforms: string[] = [];

    layers.forEach(layer => {
        if (!layer.visible) return;

        // Convert percentage coordinates (Center) to Absolute Pixels (Center)
        const centerX = Math.round((layer.x / 100) * CANVAS_WIDTH); 
        const centerY = Math.round((layer.y / 100) * CANVAS_HEIGHT);
        
        const rot = layer.rotation || 0;
        let transformStr = '';

        if (layer.type === 'text') {
            // Text Sizing logic from BottlePreview.tsx:
            // Base size: 280px (Special fonts) or 180px (Standard)
            // No ratio scaling needed anymore as we are at 1:1 scale with the canvas
            
            const isLargeFont = ['Great Vibes', 'Loverine-otf'].includes(layer.font || '');
            const basePixelSize = isLargeFont ? 280 : 180;
            const fontSize = Math.round(basePixelSize * (layer.size / 100));
            
            // Encode text
            const text = encodeURIComponent(layer.content || '').replace(/,/g, '%2C').replace(/'/g, '%27');
            const color = (layer.color || '000000').replace('#', '');
            
            // Font mapping
            let font = 'Roboto'; // Default
            if (layer.font?.includes('Marvel')) font = 'Marvel';
            if (layer.font?.includes('Poppins')) font = 'Poppins';
            if (layer.font?.includes('Bangers')) font = 'Bangers';
            if (layer.font?.includes('Dancing')) font = 'Dancing Script';
            if (layer.font?.includes('Loverine')) font = 'Loverine-otf';
            if (layer.font?.includes('Black Ops')) font = 'Black Ops One';
            if (layer.font?.includes('Perm. Marker')) font = 'Permanent Marker';
            if (layer.font?.includes('Montserrat')) font = 'Montserrat';

            const encodedFont = encodeURIComponent(font);

            // Positioning Text
            // ImageKit positions text top-left by default.
            // We only have center coordinates. 
            // We pass lx/ly as CenterX/CenterY hoping for the best alignment or manual tweak.
            // (Ideally we'd calculate offset based on text width, but unmeasured text is hard)
            
            transformStr = `l-text,i-${text},fs-${fontSize},co-${color},ff-${encodedFont},lx-${centerX},ly-${centerY}`;
        } 
        else if (layer.type === 'image' || layer.type === 'icon') {
            // Image/Icon Sizing logic from BottlePreview.tsx:
            // Image Base Width: 360px | Icon Base Width: 300px
            // Scaled directly by layer.size (percentage)
            
            const baseWidth = layer.type === 'image' ? 360 : 300;
            const width = Math.round(baseWidth * (layer.size / 100));
            
            // Centering Logic
            // Convert Center Coordinates to Top-Left for ImageKit
            const lx = Math.round(centerX - (width / 2));
            const ly = Math.round(centerY - (width / 2));
            
            // Path cleanup
            let imagePath = layer.content;
            if (imagePath.includes(HYDRA_CONFIG.imageKitId)) {
                imagePath = imagePath.split(HYDRA_CONFIG.imageKitId + '/')[1] || imagePath;
                imagePath = imagePath.split('?')[0]; 
            }
            imagePath = imagePath.replace(/\//g, '@@');

            transformStr = `l-image,i-${imagePath},w-${width},lx-${lx},ly-${ly}`;
        }

        // Add Rotation if exists
        if (rot !== 0) {
            const rotValue = rot < 0 ? `N${Math.abs(rot)}` : rot;
            transformStr += `,rt-${rotValue}`;
        }

        // Close layer
        transformStr += `,l-end`;
        allTransforms.push(transformStr);
    });

    const transformations = allTransforms.join(':');

    // CANVAS RESIZE STRATEGY:
    // 1. Resize/Pad Base Image to 2754x2340 (Full HD)
    // 2. Apply Mask (lm-cutter) to define shape
    // 3. Apply Layers
    
    // Step 1: Force Canvas Size FIRST
    const CANVAS_INIT = `w-${CANVAS_WIDTH},h-${CANVAS_HEIGHT},cm-pad_resize,bg-00000000`; // Transparent background padding
    
    // Step 2: Mask
    const MASK = "l-image,i-mimuus-assets@@hydra-600ml@@mask.png,w-2754,lm-cutter,l-end";
    
    // Chain: Init -> Mask -> Layers
    let trParam = CANVAS_INIT + ':' + MASK;
    if (transformations) {
        trParam += ':' + transformations;
    }
    
    const finalUrl = `${IK_BASE}${BOTTLE}?tr=${trParam}`;
    console.log("[HydraEngine] Calibrated URL:", finalUrl);
    return finalUrl;
}
