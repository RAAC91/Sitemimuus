
// Mock constants
const HYDRA_CONFIG = {
    hdWidth: 2754,
    hdHeight: 2340,
    colorMap: {
        'Branco': 'white',
        'Preto': 'black',
        'Rosa': 'pink',
        'Azul': 'blue',
        'Lilás': 'lilac',
        'default': 'white'
    },
    imageKitId: 'x2or5thkzy',
    skuPath: 'mimuus-assets/hydra-600ml'
};

function getHydraProductionUrl(sku, layers) {
    const IK_BASE = `https://ik.imagekit.io/${HYDRA_CONFIG.imageKitId}/`;
    
    const colorName = HYDRA_CONFIG.colorMap[sku] || HYDRA_CONFIG.colorMap['default'];
    const BASE_IMG = `${HYDRA_CONFIG.skuPath}/colors/hydra-${colorName}.png`;
    const MASK_IMG = `${HYDRA_CONFIG.skuPath}/mask.png`;

    const url = `${IK_BASE}${BASE_IMG}?tr=`;

    const layersParams = layers.filter(l => l.visible).map(layer => {
        const pixelX = Math.round((layer.x / 100) * HYDRA_CONFIG.hdWidth);
        const pixelY = Math.round((layer.y / 100) * HYDRA_CONFIG.hdHeight);
        const rotation = Math.round(layer.rotation);

        if (layer.type === 'text') {
            // FIX: Replace spaces with underscore (_) or use specific encoding if required.
            // ImageKit generally prefers spaces as underscores in text layer overlay parameters if not fully url-encoded, 
            // but sometimes %20 works. 'Invalid transformation' often means syntax error in the string.
            // Let's try explicit underscore replacement for spaces.
            let text = layer.content.replace(/ /g, '_'); 
            text = encodeURIComponent(text);

            const color = layer.color ? layer.color.replace('#', '') : '000000';
            
            let font = 'Roboto';
            if (layer.font?.includes('Marvel')) font = 'Marvel';
            if (layer.font?.includes('Poppins')) font = 'Poppins';
            if (layer.font?.includes('Bangers')) font = 'Bangers';
            if (layer.font?.includes('Dancing')) font = 'Dancing Script'; // Spaced font names might need + or _
            if (layer.font?.includes('Loverine')) font = 'Loverine-otf';
            
            // Check if font name needs encoding too
            font = font.replace(/ /g, '+');

            const baseFontSize = (['Great Vibes', 'Loverine-otf'].includes(layer.font || '') ? 280 : 180);
            const fontSize = Math.round(baseFontSize * (layer.size / 100));

            return `l-text,i-${text},fs-${fontSize},co-${color},ff-${font},lx-${pixelX},ly-${pixelY},rt-${rotation},ia-center,l-end`;
        } 
        else {
            let imgId = '';
            if (layer.content.includes('ik.imagekit.io')) {
                 try {
                    const urlObj = new URL(layer.content);
                    if (layer.content.includes(HYDRA_CONFIG.imageKitId)) {
                        const parts = urlObj.pathname.split('/');
                        imgId = parts.slice(2).join('/');
                        imgId = imgId.replace(/\//g, '@@');
                    } else {
                        imgId = layer.content.split('/').pop() || '';
                    }
                } catch { 
                    imgId = layer.content; 
                }
            } else {
                imgId = layer.content; 
            }

            const baseWidth = layer.type === 'image' ? 360 : 300;
            const width = Math.round(baseWidth * (layer.size / 100));

            return `l-image,i-${imgId},w-${width},lx-${pixelX},ly-${pixelY},rt-${rotation},ia-center,l-end`;
        }
    }).join(':');

    const maskPathEncoded = MASK_IMG.replace(/\//g, '@@');
    const MASK_PARAM = `l-image,i-${maskPathEncoded},cm-mask,l-end`;

    let finalUrl = '';
    
    if (layersParams.length > 0) {
        finalUrl = `${url}${layersParams}:${MASK_PARAM}`;
    } else {
        finalUrl = `${url}${MASK_PARAM}`;
    }
    
    return finalUrl;
}

const mockLayers = [
    {
        id: '1',
        type: 'text',
        visible: true,
        content: 'Teste 123',
        font: 'Roboto',
        color: '#000000',
        size: 100,
        rotation: 0,
        x: 50,
        y: 50
    }
];

const generated = getHydraProductionUrl('Branco', mockLayers);
console.log(generated);
