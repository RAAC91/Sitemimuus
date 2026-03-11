'use server';

import { imagekit } from '@/lib/imagekit';

export async function uploadImage(base64Image: string, fileName: string) {
  try {
    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: fileName,
      folder: 'mimuus-assets/user-uploads', // Organizing uploads
    });

    return { success: true, url: uploadResponse.url };
  } catch (error: any) {
    console.error('Error uploading image to ImageKit:', error);
    return { success: false, error: error.message };
  }
}

export async function removeImageBackground(imageUrl: string) {
  try {
    if (!imageUrl) throw new Error("No image_url provided");

    const removeBgFormData = new FormData();
    removeBgFormData.append("size", "auto");

    if (imageUrl.startsWith('data:image')) {
      const base64Data = imageUrl.split(',')[1];
      removeBgFormData.append("image_file_b64", base64Data);
    } else {
      removeBgFormData.append("image_url", imageUrl);
    }

    const apiKey = process.env.REMOVE_BG_API_KEY || "YwHzGTv7S33hwfdDxwFdHVv4";

    const removeBgResponse = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": apiKey },
      body: removeBgFormData,
    });

    if (!removeBgResponse.ok) {
      const errorText = await removeBgResponse.text();
      console.error("Remove.bg API Error:", removeBgResponse.status, errorText);
      throw new Error(`Remove.bg Error: ${removeBgResponse.status}`);
    }

    const arrayBuffer = await removeBgResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload the no-bg image to ImageKit
    const uploadResponse = await imagekit.upload({
      file: buffer.toString('base64'),
      fileName: `no-bg-${Date.now()}.png`,
      folder: 'mimuus-assets/user-uploads',
    });

    return { success: true, url: uploadResponse.url };
  } catch (error: any) {
    console.error("Error in removeImageBackground:", error);
    return { success: false, error: error.message };
  }
}
