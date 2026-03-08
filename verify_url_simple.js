
const baseUrl = "https://ik.imagekit.io/x2or5thkzy/mimuus-assets/hydra-600ml/colors/hydra-white.png";

const tests = [
    { name: "Base Image", url: baseUrl },
    { name: "Simple Text", url: `${baseUrl}?tr=l-text,i-Test,fs-50,co-000000,l-end` },
    { name: "Text with Font", url: `${baseUrl}?tr=l-text,i-Test,fs-50,ff-Roboto,l-end` },
    { name: "Full Text Params", url: `${baseUrl}?tr=l-text,i-Teste_123,fs-180,co-000000,ff-Roboto,lx-1377,ly-1170,rt-0,ia-center,l-end` },
    { name: "Mask Only", url: `${baseUrl}?tr=l-image,i-mimuus-assets@@hydra-600ml@@mask.png,cm-mask,l-end` }
];

async function runTests() {
    for (const test of tests) {
        try {
            const response = await fetch(test.url, { method: 'HEAD' });
            console.log(`[${test.name}] Status: ${response.status}`);
            if (response.status !== 200) console.log(`   URL: ${test.url}`);
        } catch (e) {
            console.log(`[${test.name}] Error: ${e.message}`);
        }
    }
}

runTests();
