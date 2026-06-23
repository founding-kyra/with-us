"use client";
import "./genesis.css";
import { useRef } from "react";

import Copy from "@/components/Copy/Copy";
import TextBlock from "@/components/TextBlock/TextBlock";
import BrandIcon from "@/components/BrandIcon/BrandIcon";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Genesis() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: ".project-page-whitespace",
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const projectPreviewWrapper = document.querySelector(
            ".project-preview-wrapper"
          );
          const previewCols = document.querySelectorAll(
            ".preview-col:not(.main-preview-col)"
          );
          const mainPreviewImg = document.querySelector(
            ".preview-img.main-preview-img img"
          );

          if (!projectPreviewWrapper || !previewCols.length || !mainPreviewImg)
            return;

          const previewScreenWidth = window.innerWidth;
          const previewMaxScale = previewScreenWidth < 900 ? 4 : 2.65;

          const scale = 1 + self.progress * previewMaxScale;
          const yPreviewColTranslate = self.progress * 300;
          const mainPreviewImgScale = 2 - self.progress * 0.85;

          projectPreviewWrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;

          previewCols.forEach((previewCol) => {
            previewCol.style.transform = `translateY(${yPreviewColTranslate}px)`;
          });

          mainPreviewImg.style.transform = `scale(${mainPreviewImgScale})`;
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
      <section className="project-preview">
        <div className="project-preview-wrapper">
          <div className="preview-col">
            <div className="preview-img">
              <img src="/spotlight%20new/3.webp" alt="" />
            </div>
            <div className="preview-img">
              <img src="/spotlight%20new/6.webp" alt="" />
            </div>
            <div className="preview-img">
              <img src="/spotlight%20new/9.webp" alt="" />
            </div>
          </div>
          <div className="preview-col">
            <div className="preview-img">
              <img src="/spotlight%20new/1.webp" alt="" />
            </div>
            <div className="preview-img">
              <img src="/spotlight%20new/4.webp" alt="" />
            </div>
            <div className="preview-img">
              <img src="/spotlight%20new/7.webp" alt="" />
            </div>
          </div>
          <div className="preview-col main-preview-col">
            <div className="preview-img">
              <img src="/spotlight%20new/2.webp" alt="" />
            </div>
            <div className="preview-img main-preview-img">
              <img src="/spotlight%20new/5.webp" alt="" />
            </div>
            <div className="preview-img">
              <img src="/spotlight%20new/8.webp" alt="" />
            </div>
          </div>
          <div className="preview-col">
            <div className="preview-img">
              <img src="/spotlight%20new/3.webp" alt="" />
            </div>
            <div className="preview-img">
              <img src="/spotlight%20new/6.webp" alt="" />
            </div>
            <div className="preview-img">
              <img src="/spotlight%20new/9.webp" alt="" />
            </div>
          </div>
          <div className="preview-col">
            <div className="preview-img">
              <img src="/spotlight%20new/1.webp" alt="" />
            </div>
            <div className="preview-img">
              <img src="/spotlight%20new/4.webp" alt="" />
            </div>
            <div className="preview-img">
              <img src="/spotlight%20new/7.webp" alt="" />
            </div>
          </div>
        </div>
      </section>

      <section className="genesis-hero">
        <div className="gen-hero-img">
            <img src="/genesis/With Us · Black shirt black studio background.png" alt="" />
        </div>
        <div className="container">
          <div className="gen-hero-copy">
            <Copy animateOnScroll={false} delay={0.7} type="flicker">
              <p>Signal over surplus,</p>
              <p>Fragments of identity,</p>
              <p>Minimal by necessity.</p>
            </Copy>
          </div>
          <div className="gen-hero-copy">
            <Copy animateOnScroll={false} delay={0.8} type="flicker">
              <p>We design future forms,</p>
              <p>Built for the now.</p>
            </Copy>
          </div>
          <div className="gen-hero-copy">
            <Copy animateOnScroll={false} delay={0.7}>
              <h1>The Genesis behind what you wear</h1>
            </Copy>
            <div className="gen-hero-meta">
              <div className="gen-hero-meta-block">
                <Copy animateOnScroll={false} delay={0.9} type="flicker">
                  <p>We create frameworks,</p>
                  <p>For the unnamed future,</p>
                  <p>A study in silhouette.</p>
                </Copy>
              </div>

            </div>
          </div>
        </div>
      </section>

      <section className="genesis-about">
        <div className="container">
          <div className="genesis-about-logo">
            <BrandIcon fill="#2b2b2b" />
          </div>
          <div className="genesis-about-copy">
            <Copy>
              <h2>
                MADE IN LOS ANGELES
              </h2>
            </Copy>
            <Copy>
              <h4 delay={0.2}>
                We build locally. The craft stays close, the standards stay high, and the people behind the product are part of the collective.
              </h4>
            </Copy>
            <Copy>
              <h4 delay={0.4}>
                Every piece is produced close to home, allowing us to stay connected to the process, protect the quality, and support the community that helped shape the brand from day one.
              </h4>
            </Copy>
            <Copy>
              <h4 delay={0.6}>
                We believe great products come from great relationships. That’s why we focus on people, craftsmanship, and doing things the right way.
              </h4>
            </Copy>
          </div>
        </div>
      </section>

      <section className="project-page-whitespace"></section>

      <TextBlock />
    </div>
  );
}
