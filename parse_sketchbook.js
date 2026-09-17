const fs = require('fs');

const content = fs.readFileSync('public/sketchbook-main/index.html', 'utf8');

const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
const css = styleMatch ? styleMatch[1] : '';

const bodyMatch = content.match(/<main class="page home">([\s\S]*?)<\/main>/);
let html = bodyMatch ? bodyMatch[1] : '';

const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
const js = scriptMatch ? scriptMatch[1] : '';

// Fix CSS paths
const fixedCss = css.replace(/url\((['"]?)sketchbook\//g, 'url($1/sketchbook-main/sketchbook/');

fs.mkdirSync('src/components/Sketchbook', { recursive: true });
fs.writeFileSync('src/components/Sketchbook/Sketchbook.css', fixedCss);
fs.writeFileSync('src/components/Sketchbook/sketchbook-html.txt', html);
fs.writeFileSync('src/components/Sketchbook/sketchbook-js.txt', js);

console.log('Done parsing.');
