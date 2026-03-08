
import { getHydraProductionUrl } from './src/lib/hydra-engine';
import { EditorLayer } from './src/components/visual-editor/constants';

const mockLayers: EditorLayer[] = [
    {
        id: '1',
        type: 'text',
        visible: true,
        content: 'Teste',
        font: 'Roboto',
        color: '#000000',
        size: 100,
        rotation: 0,
        x: 50,
        y: 50
    }
];

const sku = 'Branco';
const url = getHydraProductionUrl(sku, mockLayers);
console.log('Generated URL:', url);
