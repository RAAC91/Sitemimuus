"use server";

import { imagekit } from "@/lib/imagekit";

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file uploaded");
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const response = await imagekit.upload({
      file: buffer.toString('base64'),
      fileName: file.name.replace(/[^a-zA-Z0-9.-]/g, '-'),
      folder: "mimuus-assets/uploads",
    });

    return { success: true, url: response.url, filePath: response.filePath };
  } catch (error: any) {
    console.error("ImageKit upload error:", error);
    return { success: false, error: `Failed: ${error.message || JSON.stringify(error)}` };
  }
}
