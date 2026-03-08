// Use the classic imagekit package (v6) which has imagekit.upload() method.
// The @imagekit/nodejs v7 package uses a modular API that does NOT have instance.upload().
import ImageKit from "imagekit";

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/x2or5thkzy/",
});
