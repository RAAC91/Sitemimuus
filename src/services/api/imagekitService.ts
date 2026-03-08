
// ImageKit Service - Dynamic Icon Loading via Direct URLs
const IMAGEKIT_URL_ENDPOINT = 'https://ik.imagekit.io/x2or5thkzy';

// Cache para evitar requisições repetidas
const iconCache: Record<string, string[]> = {};
const MAX_ICONS_PER_FOLDER = 50; // Máximo de ícones para tentar carregar

/**
 * Verifica se uma imagem existe tentando carregá-la
 */
async function imageExists(url: string): Promise<boolean> {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Busca ícones de uma pasta específica no ImageKit
 * Assume que os ícones estão nomeados sequencialmente: 1.png, 2.png, 3.png, etc.
 * 
 * @param folderPath - Caminho da pasta (ex: 'icons/coracoes')
 * @returns Array de URLs dos ícones encontrados
 */
export async function fetchIconsFromFolder(folderPath: string): Promise<string[]> {
    // Retorna do cache se já foi buscado
    if (iconCache[folderPath]) {
        return iconCache[folderPath];
    }

    const icons: string[] = [];

    // Tenta carregar ícones numerados sequencialmente
    for (let i = 1; i <= MAX_ICONS_PER_FOLDER; i++) {
        // Adiciona parâmetros de transformação para alta qualidade
        const url = `${IMAGEKIT_URL_ENDPOINT}/${folderPath}/${i}.png?tr=w-3000,q-100`;
        //                                                              ↑ largura  ↑ qualidade máxima

        // Verifica se o ícone existe
        const exists = await imageExists(url);

        if (exists) {
            icons.push(url);
        } else {
            // Se não encontrou o ícone atual, assume que não há mais
            break;
        }
    }

    // Cachear resultado
    iconCache[folderPath] = icons;

    return icons;
}

/**
 * Busca todos os ícones de todas as categorias
 */
export async function fetchAllIcons(categories: Record<string, string>): Promise<Record<string, string[]>> {
    const results: Record<string, string[]> = {};

    await Promise.all(
        Object.entries(categories).map(async ([categoryName, folderPath]) => {
            results[categoryName] = await fetchIconsFromFolder(folderPath);
        })
    );

    return results;
}

/**
 * Limpa o cache de ícones (útil para forçar atualização)
 */
export function clearIconCache(): void {
    Object.keys(iconCache).forEach(key => delete iconCache[key]);
}
