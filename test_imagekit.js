const ImageKit = require('@imagekit/nodejs');
const fs = require('fs');
const path = require('path');

// Hardcoded for the test script since it's a one-off verification
const imagekit = new ImageKit({
  publicKey: "public_+xWnPjcdxsGONadFrbk5MQRu8nU=",
  privateKey: "private_mzgVeyDaL6haTWrPcH78X1FPNyI=",
  urlEndpoint: "https://ik.imagekit.io/x2or5thkzy",
});

// Small base64 transparent pixel
const testImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

async function testUpload() {
  console.log("Starting ImageKit test upload...");
  try {
    const result = await imagekit.upload({
      file: testImage,
      fileName: `test_connection_${Date.now()}.png`,
      folder: "mimuus-assets/tests",
    });
    console.log("✅ Upload successful!");
    console.log("URL:", result.url);
    console.log("File ID:", result.fileId);
  } catch (error) {
    console.error("❌ Upload failed!");
    console.error(error);
  }
}

testUpload();
