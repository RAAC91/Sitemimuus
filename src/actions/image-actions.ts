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
