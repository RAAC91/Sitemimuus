export default function imageKitLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (!src.includes('ik.imagekit.io')) return src;
  
  const params = [`w-${width}`];
  if (quality) {
    params.push(`q-${quality}`);
  }
  
  const paramsString = params.join(',');
  
  // If the URL already has a query string, append with & otherwise with ?
  // But ImageKit prefers transformations via /tr: or ?tr=
  
  if (src.includes('?')) {
    return `${src}&tr=${paramsString}`;
  }
  
  return `${src}?tr=${paramsString}`;
}
