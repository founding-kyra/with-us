const fs = require('fs');

let html = fs.readFileSync('src/components/Sketchbook/sketchbook-html.txt', 'utf8');
let js = fs.readFileSync('src/components/Sketchbook/sketchbook-js.txt', 'utf8');

// Fix HTML for JSX
html = html.replace(/class="/g, 'className="');
html = html.replace(/style="position:absolute"/g, 'style={{ position: "absolute" }}');
// Close empty tags
html = html.replace(/<img(.*?)>/g, '<img$1 />');
// Some SVG elements need closing in JSX if they are self-closing in HTML
// Actually the original HTML has self-closing tags like <path d="..."/> which is fine in JSX.
// BUT <polyline ...> without / is bad. Let's make sure it's closed.
html = html.replace(/<polyline(.*?[^\/])>/g, '<polyline$1 />');
html = html.replace(/<circle(.*?[^\/])>/g, '<circle$1 />');
html = html.replace(/<rect(.*?[^\/])>/g, '<rect$1 />');
html = html.replace(/<filter id="sb-mblur-1"><feGaussianBlur stdDeviation="5 0"\/><\/filter>/g, '<filter id="sb-mblur-1"><feGaussianBlur stdDeviation="5 0"/></filter>');

// Fix JS
js = js.replace(/const DIR='sketchbook\/';/, "const DIR='/sketchbook-main/sketchbook/';");

// Create JSX file
const jsxContent = `
"use client";
import React, { useEffect, useRef } from 'react';
import './Sketchbook.css';

export default function Sketchbook() {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Wait a brief moment for React to paint the DOM nodes before querying them
    setTimeout(() => {
      ${js}
    }, 100);
    
  }, []);

  return (
    <div className="sketchbook-container">
      ${html}
    </div>
  );
}
`;

fs.writeFileSync('src/components/Sketchbook/Sketchbook.jsx', jsxContent);
fs.unlinkSync('src/components/Sketchbook/sketchbook-html.txt');
fs.unlinkSync('src/components/Sketchbook/sketchbook-js.txt');

console.log('JSX generated.');
