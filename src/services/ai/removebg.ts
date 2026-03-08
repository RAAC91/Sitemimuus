
/**
 * Remove.bg API Service
 * Professional Background Removal
 */

const REMOVE_BG_API_KEY = process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY || 'YwHzGTv7S33hwfdDxwFdHVv4';

export const removeBackgroundCloud = async (imageSource: string): Promise<string> => {
    try {
        console.log("Iniciando remoção de fundo via Remove.bg API...");

        // Determine if it's base64 or URL
        const isBase64 = imageSource.startsWith('data:');
        const body: Record<string, string | undefined> = {
            size: 'preview', // 0.25MP - cheap and fast
            format: 'png',
            image_url: isBase64 ? undefined : imageSource,
            image_file_b64: isBase64 ? imageSource.split(',')[1] : undefined,
        };

        // Remove undefined keys
        Object.keys(body).forEach(key => body[key] === undefined && delete body[key]);

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-API-Key': REMOVE_BG_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Remove.bg Error:", errorData);
            throw new Error(errorData.errors?.[0]?.title || "Erro desconhecido na API Remove.bg");
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);

    } catch (error) {
        console.error("Cloud Background Removal Failed:", error);
        throw error;
    }
};
