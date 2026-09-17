const fs = require('fs');
let jsx = fs.readFileSync('src/components/Sketchbook/Sketchbook.jsx', 'utf8');

// Replace common SVG hyphenated attributes with camelCase
const propsToReplace = [
  'stroke-width', 'stroke-linecap', 'stroke-linejoin', 
  'clip-path', 'fill-rule', 'clip-rule', 'stroke-dasharray',
  'stroke-dashoffset', 'stroke-miterlimit', 'stop-color', 'stop-opacity'
];

propsToReplace.forEach(prop => {
  const regex = new RegExp(prop + '="', 'g');
  const camelCase = prop.replace(/-([a-z])/g, g => g[1].toUpperCase());
  jsx = jsx.replace(regex, camelCase + '="');
});

fs.writeFileSync('src/components/Sketchbook/Sketchbook.jsx', jsx);
console.log('Fixed SVG props.');
