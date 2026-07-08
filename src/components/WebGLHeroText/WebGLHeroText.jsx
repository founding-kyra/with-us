"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { isInitialLoad } from "@/components/Preloader/Preloader";
import "./WebGLHeroText.css";

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  // Full screen quad doesn't need projection or model view matrix
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uProgress;
uniform float uTime;
uniform vec2 uResolution;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  // Flip Y to match standard canvas coordinates if needed, but ThreeJS CanvasTexture handles it usually.
  // Wait, ThreeJS CanvasTexture flips Y by default. So vUv is correct.
  vec4 texColor = texture2D(uTexture, vUv);
  
  if (texColor.a < 0.01) {
    discard;
  }

  // High frequency noise for sand particulate effect
  // scale noise to keep grit size uniform regardless of screen size
  vec2 noiseUv = vUv * uResolution * 0.2; 
  float noise = snoise(noiseUv + uTime * 1.5);
  noise = noise * 0.5 + 0.5; // 0 to 1
  
  // Progress determines reveal from left to right.
  // We want to add some grit near the edge.
  float gritCoefficient = 0.5;
  float threshold = vUv.x - uProgress + (noise * gritCoefficient);

  if (threshold > 0.0) {
    discard;
  }

  gl_FragColor = texColor;
}
`;

export default function WebGLHeroText() {
  const containerRef = useRef(null);
  const hiddenTextRef1 = useRef(null);
  const hiddenTextRef2 = useRef(null);
  
  // WebGL references
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const materialRef = useRef(null);
  const textureRef = useRef(null);
  const reqIdRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Setup Three.js
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(
      width / -2, width / 2,
      height / 2, height / -2,
      0.1, 10
    );
    camera.position.z = 1;
    cameraRef.current = camera;

    // 2. Offscreen Canvas for text masking
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    // Initialize canvas to correct size immediately so the first CanvasTexture is correct
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    // Function to draw text onto the canvas based on the hidden DOM elements
    const updateTexture = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const currentDpr = Math.min(window.devicePixelRatio, 2);
      
      const newWidth = w * currentDpr;
      const newHeight = h * currentDpr;
      
      let resized = false;
      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;
        resized = true;
      }
      
      renderer.setSize(w, h);
      
      if (materialRef.current) {
        materialRef.current.uniforms.uResolution.value.set(w, h);
      }

      ctx.resetTransform();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(currentDpr, currentDpr);

      // Draw lines exactly where they sit in the DOM
      const drawLine = (el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        
        const fontSize = parseFloat(style.fontSize);
        const fontFamily = style.fontFamily;
        const fontWeight = style.fontWeight;
        const color = style.color;
        
        ctx.font = fontWeight + " " + fontSize + "px " + fontFamily;
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        
        const cx = rect.left + rect.width / 2;
        const cy = rect.top;
        
        ctx.fillText(el.textContent, cx, cy);
      };

      drawLine(hiddenTextRef1.current);
      drawLine(hiddenTextRef2.current);

      // Always recreate the texture to avoid WebGL memory/resizing bugs
      if (textureRef.current) {
        textureRef.current.dispose();
      }
      textureRef.current = new THREE.CanvasTexture(canvas);
      textureRef.current.minFilter = THREE.LinearFilter;
      textureRef.current.magFilter = THREE.LinearFilter;
      if (materialRef.current) {
        materialRef.current.uniforms.uTexture.value = textureRef.current;
      }
    };

    textureRef.current = new THREE.CanvasTexture(canvas);
    textureRef.current.minFilter = THREE.LinearFilter;
    textureRef.current.magFilter = THREE.LinearFilter;

    // 3. Setup Material and Mesh
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTexture: { value: textureRef.current },
        uProgress: { value: -0.5 },
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) }
      }
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Initial draw
    document.fonts.ready.then(() => {
      updateTexture();
    });
    // Fallbacks for Safari or cases where fonts load late
    setTimeout(updateTexture, 100);
    setTimeout(updateTexture, 500);
    setTimeout(updateTexture, 2000);

    // 4. Handle resize
    window.addEventListener("resize", updateTexture);

    // 5. Render Loop
    const clock = new THREE.Clock();
    const duration = 4.0; // Slower animation
    const delay = isInitialLoad ? 5.5 : 0.65;

    const render = () => {
      const time = clock.getElapsedTime();
      material.uniforms.uTime.value = time;
      
      let progress = -0.5;
      if (time > delay) {
        let t = (time - delay) / duration;
        t = Math.min(Math.max(t, 0), 1); // Clamp to 0-1
        t = t * (2 - t); // easeOutQuad
        progress = -0.5 + t * 2.0; // Map 0->1 to -0.5->1.5
      }
      material.uniforms.uProgress.value = progress;

      renderer.render(scene, camera);
      reqIdRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", updateTexture);
      cancelAnimationFrame(reqIdRef.current);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      textureRef.current.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <>
      <div className="webgl-hero-text-container" ref={containerRef} />
      
      {/* Hidden DOM elements to read exact positioning and styling */}
      <div className="container">
        <div className="hero-header" style={{ opacity: 0, pointerEvents: "none", zIndex: -1 }}>
          <h1>
            <span ref={hiddenTextRef1} style={{ display: "block" }}>I&apos;M</span>
            <span ref={hiddenTextRef2} style={{ display: "block" }}>WITHUS</span>
          </h1>
        </div>
      </div>
    </>
  );
}
