import { GoogleGenAI } from '@google/genai';

async function test() {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: 'A cute cat astronaut, vector flat design.',
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1'
            }
        });
        
        console.log("Response:", response);
        if (response.generatedImages?.[0]?.image?.imageBytes) {
            console.log("Success! ImageBytes length:", response.generatedImages[0].image.imageBytes.length);
        } else {
            console.log("Image bytes missing.");
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
