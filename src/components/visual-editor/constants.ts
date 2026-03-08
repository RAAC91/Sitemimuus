
export const ENGINE_CONFIG = {
    maskUrl: "url('https://ik.imagekit.io/gocase/engines/uploads/previewmask/64951/src/c886a2045c41d68de28f214194ddd714.png?tr=h-484')",
    hdWidth: 2754,
    hdHeight: 2340,
    displayScale: 0.1757,
    matrix3d: "matrix3d(0.714763, 0.0011939, 0, 0.0000012, 0.0011162, 0.604589, 0, -0.0000087, 0, 0, 1, 0, 68.8903, 151.141, 0, 1)"
};

export const SKUS: Record<string, { name: string; price: number; color: string; img: string; mockup: string }> = {
    'Branco': {
        name: 'Branca Premium',
        price: 89.90,
        color: '#FFFFFF',
        img: 'https://ik.imagekit.io/gocase/v3/case_types/1534/original/shbranca.jpg?tr=w-500,h-500',
        mockup: 'https://ik.imagekit.io/x2or5thkzy/Mockups/5.svg?updatedAt=1768533960256'
    },
    'Preto': {
        name: 'Preta Stealth',
        price: 89.90,
        color: '#000000',
        img: 'https://ik.imagekit.io/gocase/v3/case_types/1537/original/shpretu.jpg?tr=w-500,h-500',
        mockup: 'https://ik.imagekit.io/x2or5thkzy/Mockups/3.png?updatedAt=1768533949506'
    },
    'Rosa': {
        name: 'Rosa Candy',
        price: 89.90,
        color: '#FFC0CB',
        img: 'https://ik.imagekit.io/gocase/v3/case_types/1535/original/shrosa.jpg?tr=w-500,h-500',
        mockup: 'https://ik.imagekit.io/x2or5thkzy/Mockups/2?updatedAt=1768533927596'
    },
    'Azul': {
        name: 'Azul Sky',
        price: 89.90,
        color: '#87CEEB',
        img: 'https://ik.imagekit.io/gocase/v3/case_types/1539/original/shzumari.jpg?tr=w-500,h-500',
        mockup: 'https://ik.imagekit.io/x2or5thkzy/Mockups/1.png?updatedAt=1768533939113'
    },
    'Lilás': {
        name: 'Lilás Dream',
        price: 89.90,
        color: '#C8A2C8',
        img: 'https://ik.imagekit.io/gocase/v3/case_types/1540/original/shlilais.jpg?tr=w-500,h-500',
        mockup: 'https://ik.imagekit.io/x2or5thkzy/Mockups/4.png'
    }
};

// Mapeamento de categorias para pastas no ImageKit
export const ICON_CATEGORY_FOLDERS: Record<string, string> = {
    'Coração': 'icons/coracoes',
    'Saúde': 'icons/saude',
    'Pets': 'icons/pets',
    'Vibe': 'icons/vibe'
};

// Icons loaded from ImageKit — /mimuus-assets/icons/<category>/<n>.png
const IK_ICONS = 'https://ik.imagekit.io/x2or5thkzy/mimuus-assets/icons';
export const ICON_CATEGORIES: Record<string, string[]> = {
    'Coração': Array.from({ length: 11 }, (_, i) => `${IK_ICONS}/coracoes/${i + 1}.png`),
    'Saúde':   Array.from({ length: 13 }, (_, i) => `${IK_ICONS}/saude/${i + 1}.png`),
    'Pets':    Array.from({ length: 9 }, (_, i) => `${IK_ICONS}/pets/${i + 1}.png`),
    'Vibe':    Array.from({ length: 11 }, (_, i) => `${IK_ICONS}/vibe/${i + 1}.png`),
};

export const FONTS = [
    { name: 'Marvel', family: 'var(--font-marvel)', type: 'display' },
    { name: 'Poppins', family: 'var(--font-poppins)', type: 'sans' },
    { name: 'Black Ops', family: 'var(--font-black-ops)', type: 'display' },
    { name: 'Bangers', family: 'var(--font-bangers)', type: 'display' },
    { name: 'Perm. Marker', family: 'var(--font-permanent-marker)', type: 'handwritten' },
    { name: 'Dancing', family: 'var(--font-dancing-script)', type: 'script' },
    { name: 'Montserrat', family: 'var(--font-montserrat)', type: 'sans' },
];

export const EDITOR_COLORS = [
    // Linha 1
    { name: 'Preto', valor: '#000000' },
    { name: 'Branco', valor: '#FFFFFF' },
    { name: 'Prata', valor: '#C0C0C0', style: { background: 'linear-gradient(135deg, #a1a1a1 0%, #ffffff 50%, #a1a1a1 100%)' } },
    { name: 'Azul Marinho', valor: '#000080' },
    { name: 'Cinza Chumbo', valor: '#36454F' },
    { name: 'Dourado', valor: '#D4AF37', style: { background: 'linear-gradient(135deg, #b8860b 0%, #ffd700 50%, #b8860b 100%)' } },
    { name: 'Cobre', valor: '#B87333', style: { background: 'linear-gradient(135deg, #8b4513 0%, #cd7f32 50%, #8b4513 100%)' } },
    // Linha 2
    { name: 'Vermelho Puro', valor: '#FF0000' },
    { name: 'Laranja Escuro', valor: '#FF8C00' },
    { name: 'Amarelo Canário', valor: '#FFEF00' },
    { name: 'Verde Bandeira', valor: '#008000' },
    { name: 'Azul Royal', valor: '#4169E1' },
    { name: 'Verde Lima', valor: '#32CD32' },
    { name: 'Tiffany', valor: '#0ABAB5' },
    // Linha 3
    { name: 'Rosa Claro', valor: '#FFB6C1' },
    { name: 'Lavanda', valor: '#E6E6FA' },
    { name: 'Verde Menta', valor: '#98FF98' },
    { name: 'Azul Sky', valor: '#87CEEB' },
    { name: 'Bege', valor: '#F5F5DC' },
    { name: 'Vinho', valor: '#800020' },
    { name: 'Dark Plum', valor: '#60223B' },
    // Outras
    { name: 'Rosa Shock', valor: '#FF007F' },
    { name: 'Roxo', valor: '#7C3AED' },
    { name: 'Marrom', valor: '#78350F' }
];

export const LID_COLORS = [
    { name: 'Preto', valor: '#000000' },
    { name: 'Branco', valor: '#FFFFFF' },
    { name: 'Cinza', valor: '#808080' },
    { name: 'Rosa', valor: '#FFC0CB' },
    { name: 'Azul', valor: '#87CEEB' },
    { name: 'Verde', valor: '#98FF98' },
    { name: 'Laranja', valor: '#FFA500' }
];

export enum ViewApp {
    HOME = 'HOME',
    EDITOR = 'EDITOR'
}

export type LayerType = 'text' | 'image' | 'icon';

export interface EditorLayer {
    id: string;
    type: LayerType;
    visible: boolean;
    content: string; // text string or image URL
    font?: string;
    color?: string;
    size: number;
    stroke?: boolean;
    glow?: boolean;
    rotation: number;
    x: number;
    y: number;
    isBgClean?: boolean;
    rawImg?: string | null;
    mode?: 'center' | 'tile';
    italic?: boolean;
    underline?: boolean;
    opacity?: number;
    isMirrored?: boolean;
    scaleX?: number;
    scaleY?: number;
}

export interface HistoryState {
    sku: string;
    layers: EditorLayer[];
    selectedLayerId: string | null;
}
