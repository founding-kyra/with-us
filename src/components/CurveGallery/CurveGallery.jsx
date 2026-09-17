"use client";
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import './CurveGallery.css';

gsap.registerPlugin(Observer);

export default function CurveGallery() {
  const mountRef = useRef(null);
  const [activePath, setActivePath] = useState(0);
  const [autoScroll, setAutoScroll] = useState(false);

  useEffect(() => {
    let renderer, scene, camera, curve, observerInstance;
    let planes = [];
    let allRaws = [];
    let focusTGate;
    let targetT = 0;
    let autoScrollInternal = false;
    let currentPathIndex = 0;
    let rafId;

    const TEX_VARIANTS = 15;
    const IG_LINKS = Array.from({ length: TEX_VARIANTS }, (_, i) => 
      `https://instagram.com/p/placeholder_${i + 1}`
    );
    const SCALE = 16;
    const TOTAL = 500;
    const CAM_Z = 10;
    const FOCUS_DIST = 5.5;
    const MAX_SCALE = 14;
    const Z_GATE = 11;

    const LATERAL_OFFSET_RANGE = [-1, 1];
    const DEPTH_OFFSET_RANGE = [-0.75, 0.75];
    const SIZE_RANGE = [0.18, 0.4];

    function randomBetween(min, max) {
      return min + Math.random() * (max - min);
    }

    function toScaledVector3([x, y, z], scale) {
      return new THREE.Vector3(x * scale, y * scale, z * scale);
    }

    function buildCurve(raw) {
      const points = raw.map(p => toScaledVector3(p, SCALE));
      return new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.5);
    }

    function getCurveFrame(c, t) {
      const pos = c.getPoint(t);
      const tangent = c.getTangent(t);
      return { pos, nx: -tangent.y, ny: tangent.x };
    }

    async function init() {
      // 1. Setup Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
        mountRef.current.appendChild(renderer.domElement);
      }

      // 2. Setup Scene & Camera
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);
      scene.fog = new THREE.Fog(0xffffff, 10, 40);

      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);

      // 3. Load Assets
      const textureLoader = new THREE.TextureLoader();
      const textures = Array.from({ length: 15 }, (_, i) => 
        textureLoader.load(`/curve-gallery/compressed-img/WUS-${i + 1}.webp`)
      );

      const files = ['path1', 'path2', 'path3', 'path4', 'path5'];
      try {
        allRaws = await Promise.all(
          files.map(name => fetch(`/curve-gallery/paths/${name}.json`).then(r => r.json()))
        );
      } catch (err) {
        console.error("Failed to load curve paths", err);
        return;
      }

      curve = buildCurve(allRaws[0]);
      focusTGate = (FOCUS_DIST * 1.5) / curve.getLength();

      function createScaleAnimator(mesh) {
        const proxy = { value: 1 };
        return gsap.quickTo(proxy, 'value', {
          duration: 0.4,
          ease: 'power3.out',
          onUpdate: () => mesh.scale.setScalar(proxy.value),
        });
      }

      // 4. Generate Planes
      const recentIndices = [];

      for (let i = 0; i < TOTAL; i++) {
        const t = i / TOTAL;
        const { pos, nx, ny } = getCurveFrame(curve, t);
        
        const lateralOffset = randomBetween(...LATERAL_OFFSET_RANGE);
        const depthOffset = randomBetween(...DEPTH_OFFSET_RANGE);
        const size = randomBetween(...SIZE_RANGE);

        let textureIndex;
        do {
          textureIndex = Math.floor(Math.random() * TEX_VARIANTS);
        } while (recentIndices.includes(textureIndex));
        
        recentIndices.push(textureIndex);
        if (recentIndices.length > 6) {
          recentIndices.shift();
        }

        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(size, size),
          new THREE.MeshBasicMaterial({
            map: textures[textureIndex],
            side: THREE.DoubleSide,
          })
        );

        mesh.position.set(
          pos.x + nx * lateralOffset,
          pos.y + ny * lateralOffset,
          pos.z + depthOffset
        );

        mesh.userData.t = t;
        mesh.userData.textureIndex = textureIndex;
        mesh.userData.lateralOffset = lateralOffset;
        mesh.userData.depthOffset = depthOffset;
        mesh.userData.setScale = createScaleAnimator(mesh);

        planes.push(mesh);
        scene.add(mesh);
      }

      // 5. Setup Camera Animators & Observers
      const camProxy = { t: 0 };
      const setCamT = gsap.quickTo(camProxy, 't', { duration: 1, ease: 'power3.out' });
      const SENSITIVITY = 0.8 / (window.innerHeight * 4);

      observerInstance = Observer.create({
        target: window,
        type: 'wheel,touch,pointer',
        onChange: (self) => {
          if (autoScrollInternal) return;
          targetT += self.deltaY * SENSITIVITY;
          setCamT(targetT);
        },
      });

      const AUTO_SCROLL_DURATION = 10;
      const AUTO_T_PER_SEC = 1 / AUTO_SCROLL_DURATION;
      const camPos = { x: 0, y: 0, z: 0 };

      // 5.5 Setup Raycasting
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      
      window._curveGalleryOnPointerMove = (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(planes);
        
        if (intersects.length > 0) {
          document.body.style.cursor = 'pointer';
        } else {
          document.body.style.cursor = 'auto';
        }
      };

      window._curveGalleryOnClick = (event) => {
        if (event.target.tagName === 'BUTTON') return;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(planes);
        
        if (intersects.length > 0) {
          const texIdx = intersects[0].object.userData.textureIndex;
          if (IG_LINKS[texIdx]) {
            window.open(IG_LINKS[texIdx], '_blank');
          }
        }
      };

      window.addEventListener('pointermove', window._curveGalleryOnPointerMove);
      window.addEventListener('click', window._curveGalleryOnClick);

      // 6. Define global-to-component handlers
      window._curveGalleryChangePath = (idx) => {
        if (idx === currentPathIndex) return;
        currentPathIndex = idx;
        const newCurve = buildCurve(allRaws[idx]);
        
        planes.forEach((mesh) => {
          const t = mesh.userData.t;
          const { pos, nx, ny } = getCurveFrame(newCurve, t);
          gsap.to(mesh.position, {
            x: pos.x + nx * mesh.userData.lateralOffset,
            y: pos.y + ny * mesh.userData.lateralOffset,
            z: pos.z + mesh.userData.depthOffset,
            duration: 1.4,
            ease: 'power3.inOut',
          });
        });

        curve = newCurve;
        focusTGate = (FOCUS_DIST * 1.5) / newCurve.getLength();

        const t = ((1 - camProxy.t) % 1 + 1) % 1;
        const target = newCurve.getPoint(t);
        gsap.killTweensOf(camPos);
        gsap.to(camPos, {
          x: target.x,
          y: target.y,
          z: target.z + CAM_Z,
          duration: 1.4,
          ease: 'power3.inOut',
        });
      };

      window._curveGalleryToggleAutoScroll = () => {
        autoScrollInternal = !autoScrollInternal;
        setAutoScroll(autoScrollInternal);
      };

      // 7. Animation Loop
      let lastTime = performance.now();

      function computeFocusScale(distance, maxDistance, maxScale) {
        const f = 1 - distance / maxDistance;
        return 1 + f ** 3 * (maxScale - 1);
      }

      function animate() {
        rafId = requestAnimationFrame(animate);
        const now = performance.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;

        if (autoScrollInternal) {
          targetT += AUTO_T_PER_SEC * delta;
          setCamT(targetT);
        }

        const t = ((1 - camProxy.t) % 1 + 1) % 1;
        const pathPos = curve.getPoint(t);
        
        if (!gsap.isTweening(camPos)) {
          camPos.x = pathPos.x;
          camPos.y = pathPos.y;
          camPos.z = pathPos.z + CAM_Z;
        }
        camera.position.set(camPos.x, camPos.y, camPos.z);

        for (const plane of planes) {
          const dx = camera.position.x - plane.position.x;
          const dy = camera.position.y - plane.position.y;
          const dz = Math.abs(camera.position.z - plane.position.z);
          const distXY = Math.sqrt(dx * dx + dy * dy);

          let dt = Math.abs(plane.userData.t - t);
          if (dt > 0.5) dt = 1 - dt;

          const isInFocusZone = dt < focusTGate && dz < Z_GATE && distXY < FOCUS_DIST;
          const targetScale = isInFocusZone ? computeFocusScale(distXY, FOCUS_DIST, MAX_SCALE) : 1;

          plane.userData.setScale(targetScale);
        }

        renderer.render(scene, camera);
      }
      
      animate();
    }

    init();

    // 8. Resize Handler
    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // 9. Cleanup on Unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', window._curveGalleryOnPointerMove);
      window.removeEventListener('click', window._curveGalleryOnClick);
      document.body.style.cursor = 'auto';

      if (rafId) cancelAnimationFrame(rafId);
      if (observerInstance) observerInstance.kill();
      
      delete window._curveGalleryChangePath;
      delete window._curveGalleryToggleAutoScroll;
      delete window._curveGalleryOnPointerMove;
      delete window._curveGalleryOnClick;

      if (renderer) {
        renderer.dispose();
      }
      if (scene) {
        scene.traverse((object) => {
          if (object.isMesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(m => {
                  if (m.map) m.map.dispose();
                  m.dispose();
                });
              } else {
                if (object.material.map) object.material.map.dispose();
                object.material.dispose();
              }
            }
          }
        });
      }

      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="curve-gallery-container">
      <div id="canvas-container" ref={mountRef}></div>
      <button 
        id="scroll-toggle" 
        className={`scroll-toggle ${autoScroll ? 'active' : ''}`} 
        onClick={() => {
          if (window._curveGalleryToggleAutoScroll) window._curveGalleryToggleAutoScroll();
        }}
      >
        {autoScroll ? 'Auto' : 'Scroll'}
      </button>
      <div className="btns-container">
        {[0, 1, 2, 3, 4].map(idx => (
          <button 
            key={idx}
            className={`path-btn ${activePath === idx ? 'active' : ''}`}
            onClick={() => {
              setActivePath(idx);
              if (window._curveGalleryChangePath) window._curveGalleryChangePath(idx);
            }}
          >
            Path {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
