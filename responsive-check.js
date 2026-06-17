const { chromium } = require('playwright');

const viewports = [
  { width: 375, height: 667, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1024, height: 768, name: 'small-desktop' },
  { width: 1440, height: 900, name: 'desktop' },
  { width: 2560, height: 1440, name: 'large-desktop' },
];

(async () => {
  const errors = {};
  for (const vp of viewports) {
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    page.on('console', msg => {
      if (msg.type() === 'error') {
        if (!errors[vp.name]) errors[vp.name] = [];
        errors[vp.name].push(msg.text());
      }
    });
    try {
      await page.goto('http://localhost:49199/', { waitUntil: 'networkidle' });
      // Give a moment for any lazy loads
      await page.waitForTimeout(1000);
    } catch (e) {
      console.error(`Failed to load ${vp.name}:`, e);
    }
    await browser.close();
  }
  console.log('Responsive check completed. Errors by viewport:');
  console.log(JSON.stringify(errors, null, 2));
})();
