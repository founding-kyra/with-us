const fs = require('fs');
let jsx = fs.readFileSync('src/components/Sketchbook/Sketchbook.jsx', 'utf8');

jsx = jsx.replace(/<\/svg \/>/g, '</svg>');

fs.writeFileSync('src/components/Sketchbook/Sketchbook.jsx', jsx);
console.log('Fixed SVG closing tags.');
