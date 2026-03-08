
const url = "https://ik.imagekit.io/x2or5thkzy/mimuus-assets/hydra-600ml/colors/hydra-white.png?tr=l-text,i-Teste_123,fs-180,co-000000,ff-Roboto,lx-1377,ly-1170,rt-0,ia-center,l-end:l-image,i-mimuus-assets@@hydra-600ml@@mask.png,cm-mask,l-end";

async function checkUrl() {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        console.log(`Status: ${response.status}`);
        if (response.status !== 200) {
            console.log('Error headers:', response.headers);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

checkUrl();
