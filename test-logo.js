const { chromium } = require('playwright');

(async () => {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
  <style>
    body { background: #2b2b2b; color: white; margin: 0; padding: 50px; }
    .navbar {
      background: #111;
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      height: 60px;
    }
    .logo img {
      height: 48px;
      width: 48px; /* assuming square SVG */
      display: block;
      transform: scale(2.2) translateY(-10%);
      transform-origin: left center;
    }
  </style>
  </head>
  <body>
    <div class="navbar" id="nav">
      <div class="logo">
        <img id="logo-img" src="file:///Users/razalkizhakkekara/arocreativ/CGMWTDEC2025/nrmlss/public/logo/logo-with-us-icon-champagne.svg" />
      </div>
    </div>
  </body>
  </html>
  `;
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  
  // get bounding box of navbar and image
  const navBox = await page.evaluate(() => document.getElementById('nav').getBoundingClientRect());
  const imgBox = await page.evaluate(() => document.getElementById('logo-img').getBoundingClientRect());
  
  console.log('Navbar:', navBox.top, navBox.bottom, 'Center:', navBox.top + navBox.height/2);
  console.log('Image:', imgBox.top, imgBox.bottom, 'Height:', imgBox.height);
  
  // The actual drawing inside the SVG is from 45% to 75% roughly
  // The center is 60%.
  // In the scaled image, the top of drawing is: imgBox.top + imgBox.height * 0.45
  // center of drawing is: imgBox.top + imgBox.height * 0.60
  const drawingCenter = imgBox.top + imgBox.height * 0.60;
  console.log('Drawing Center:', drawingCenter);
  console.log('Difference:', drawingCenter - (navBox.top + navBox.height/2));
  
  await browser.close();
})();
