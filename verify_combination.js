
const baseUrl = "https://ik.imagekit.io/x2or5thkzy/mimuus-assets/hydra-600ml/colors/hydra-white.png";
const maskPathEnc = "mimuus-assets@@hydra-600ml@@mask.png";

// Simple overlay syntax (what we switched to)
const maskParam = `l-image,i-${maskPathEnc},l-end`;
const textParam = `l-text,i-Teste_123,fs-180,co-000000,ff-Roboto,lx-1377,ly-1170,rt-0,ia-center,l-end`;

// Construct combined URL
const combinedUrl = `${baseUrl}?tr=${textParam}:${maskParam}`;
const swappedUrl = `${baseUrl}?tr=${maskParam}:${textParam}`; // Test order

async function check(name, url) {
    try {
        const res = await fetch(url, { method: 'HEAD' });
        console.log(`[${name}] Status: ${res.status}`);
        if (res.status !== 200) console.log(`   URL: ${url}`);
    } catch(e) { console.error(e); }
}

console.log("Testing Combinations...");
check("Text + Mask (Overlay)", combinedUrl);
check("Mask + Text", swappedUrl);
