const { chromium } = require('playwright');
const path = require('path');

(async () => {
  // Setup browser with HOME set if needed
  if (!process.env.HOME) {
    process.env.HOME = process.env.USERPROFILE;
  }

  console.log('Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Navigating to homepage...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Wait for TrustBar to be visible
  const trustBar = await page.getByText('Frete Grátis');
  const isVisible = await trustBar.isVisible();
  console.log(`TrustBar visible: ${isVisible}`);

  console.log('Taking screenshot...');
  const screenshotPath = path.resolve(process.env.USERPROFILE, '.gemini/antigravity/brain/c7e2c904-08aa-4676-a0cf-791ab4447fdb/homepage_screenshot.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });

  console.log(`Screenshot saved to: ${screenshotPath}`);

  await browser.close();
})();
