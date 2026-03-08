import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import ImageKit from 'imagekit';

// Inicializa a IA no Server-Side
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY });

// Inicializa o SDK do ImageKit (pode requerer envs adequadas ou mock se ausente)
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || 'public_fake',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_fake',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/fake',
});

// A Edge Engine precisa ser evitada caso ImageKit use node APIs não compatíveis (ex: fs), 
// mas usaremos node runtime normal para a Next.js App Route por segurança (remover o export 'edge').
// export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { prompt, isPattern } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    let finalPrompt = '';

    if (isPattern) {
        finalPrompt = `Create a flat lay composition of ${prompt} themed design elements on a pure white background. Include 30-50 varied icons, symbols, illustrations, and typography related to ${prompt}. Style: modern vector art, clean flat design, vibrant colors with complementary accent colors. Elements should have NO white borders, NO sticker outlines, NO drop shadows - just pure flat graphics seamlessly integrated on white background. Include diverse mix of: main icons (large), secondary symbols (medium), small decorative elements, typography/text badges, thematic illustrations. Arrange all elements in an organized scattered grid pattern with balanced visual weight and professional spacing. Design must be suitable for cylindrical bottle wrap printing with seamless repeatable edges. High resolution, print-ready quality, professional graphic design aesthetic.`;
    } else {
        finalPrompt = `Create a single, isolated, high-quality design element related to ${prompt} on a pure white background. Style: modern vector art, clean flat design, vibrant colors. The element should have NO white borders, NO sticker outlines, NO drop shadows - just pure flat graphics. Focus on a central, iconic representation suitable for product printing. High resolution, print-ready quality, professional graphic design aesthetic.`;
    }

    const aiResponse = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: finalPrompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
        }
    });

    let base64String = null;
    let mimeType = 'image/jpeg';

    if (aiResponse.generatedImages && aiResponse.generatedImages.length > 0) {
        base64String = aiResponse.generatedImages[0].image?.imageBytes || null;
    }

    if (!base64String) {
        throw new Error('Nenhuma imagem retornada pela API do Gemini.');
    }

    // Transformando a String Base64 para ser consumida como Buffer no ImageKit
    const fileBuffer = Buffer.from(base64String, 'base64');
    
    // Nome do arquivo unico para evitar chache-collision
    const fileName = `ai_gen_${Date.now()}.png`;

    // Processamento Assíncrono para ImageKit
    const uploadResult = await new Promise((resolve, reject) => {
        imagekit.upload(
            {
                file: fileBuffer, // can be a base64 string or buffer
                fileName: fileName,
                folder: '/mimuus_ai_generations',
            },
            (error, result) => {
                if (error) {
                    console.error('ImageKit Upload Error:', error);
                    // Como fallback, retornaremos o raw base64 em caso de falha do ImageKit para não quebrar a UI
                    resolve({ url: `data:${mimeType};base64,${base64String}` });
                } else {
                    resolve(result);
                }
            }
        );
    });

    // Cast da resposta (que tem ou property 'url' ou é o response do ik)
    const resultUrl = (uploadResult as any).url;

    return NextResponse.json({ imageUrl: resultUrl });

  } catch (error: unknown) {
    console.error('API Generate Error:', error);
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
