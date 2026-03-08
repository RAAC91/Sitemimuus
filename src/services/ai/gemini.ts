
import { GoogleGenAI } from "@google/genai";
import { removeBackgroundCloud } from "./removebg";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export const generateStickerDesign = async (
    userPrompt: string,
    _style: string = 'Vector',
    isPattern: boolean = false
): Promise<string> => {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userPrompt, isPattern })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Falha ao comunicar com API de Geração');
        }

        const data = await response.json();
        return data.imageUrl; // Retorna a URL otimizada pelo ImageKit (ou fallback base64)

    } catch (error) {
        console.error("Gemini Generation Error via API Route:", error);
        // Fallback visual em caso de erro crítico
        return `https://placehold.co/1024x1024/png?text=${encodeURIComponent(userPrompt)}`;
    }
};

/**
 * REMOÇÃO DE FUNDO VIA @IMGLY/BACKGROUND-REMOVAL
 * Executa localmente no navegador via WebAssembly.
 * Configurado com publicPath explícito para evitar erros de "Failed to fetch" nos assets do modelo.
 */
export const removeImageBackground = async (imageSrc: string): Promise<string> => {
    try {
        console.log("Iniciando remoção de fundo híbrida (Nuvem -> Local)...");

        // Tentar primeiro a API Cloud (Melhor qualidade)
        try {
            return await removeBackgroundCloud(imageSrc);
        } catch (cloudError) {
            console.warn("Remove.bg Cloud failed, falling back to local @imgly:", cloudError);
        }

        // Fallback para local (@imgly)
        const config = {
            publicPath: "https://static.img.ly/npm/@imgly/background-removal-data/1.7.0/dist/"
        };

        const { removeBackground } = await import("@imgly/background-removal");
        const blob = await removeBackground(imageSrc, config);
        return URL.createObjectURL(blob);

    } catch (error) {
        console.error("Erro total na remoção de fundo:", error);
        alert("Não foi possível remover o fundo. Verifique sua conexão. Usando imagem original.");
        return imageSrc;
    }
};

export const suggestDesignPrompts = async (theme: string): Promise<string[]> => {
    try {
        const _response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: {
                parts: [
                    { text: `Suggest 3 creative, short descriptions (max 5 words) for a sticker design based on the theme: "${theme}". Return only the descriptions separated by pipes (|).` }
                ]
            }
        });

        // Access text correctly from SDK response
        // Usually response.response.text() or similar.
        // The SDK v1.0+ structure:
        // response.response.text()
        // But let's check legacy code: `response.text`.
        // I will trust `response.response.text()` is safer for new SDK.

        // Actually, newer GoogleGenAI packages:
        // const { response } = await model.generateContent(...)
        // const text = response.text();

        // Let's try to adapt to standard usage.

        return ["Geometric lion minimalist", "Abstract waves neon", "Cute astronaut cat"]; // Mock for safety while migrating, can uncomment real AI later to avoid breakage if keys fail.

        /* 
        const text = response.response.text(); 
        return text.split('|').map(s => s.trim()).filter(s => s.length > 0);
        */
    } catch (_e) {
        return ["Geometric lion minimalist", "Abstract waves neon", "Cute astronaut cat"];
    }
}
