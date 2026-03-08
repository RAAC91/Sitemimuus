
const baseUrl = "https://ik.imagekit.io/x2or5thkzy/mimuus-assets/hydra-600ml/colors/hydra-white.png";
const maskUrl = "https://ik.imagekit.io/x2or5thkzy/mimuus-assets/hydra-600ml/mask.png";
const maskPathEncoded = "mimuus-assets@@hydra-600ml@@mask.png";

const tests = [
    { name: "Direct Mask Access", url: maskUrl },
    { name: "Overlay (No Mask Mode)", url: `${baseUrl}?tr=l-image,i-${maskPathEncoded},l-end` },
    { name: "Mask Mode", url: `${baseUrl}?tr=l-image,i-${maskPathEncoded},cm-mask,l-end` },
    { name: "Mask with Width", url: `${baseUrl}?tr=l-image,i-${maskPathEncoded},w-2754,cm-mask,l-end` }
];

async function runTests() {
    for (const test of tests) {
        try {
            const response = await fetch(test.url, { method: 'HEAD' });
            console.log(`[${test.name}] Status: ${response.status}`);
        } catch (e) {
            console.log(`[${test.name}] Error: ${e.message}`);
        }
    }
}

runTests();
