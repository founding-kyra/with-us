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
              <img src="/Photos 2/WUS-31.jpg" alt="" />
            </div>
            <div className="preview-img">
              <img src="/Photos 2/WUS-35.jpg" alt="" />
            </div>
            <div className="preview-img">
              <img src="/Photos 2/WUS-41.jpg" alt="" />
            </div>
          </div>
          <div className="preview-col">
            <div className="preview-img">
              <img src="/Photos 2/WUS-25.jpg" alt="" />
            </div>
            <div className="preview-img">
              <img src="/Photos 2/WUS-16.jpg" alt="" />
            </div>
            <div className="preview-img">
              <img src="/Photos 2/WUS-11.jpg" alt="" />
            </div>
          </div>
          <div className="preview-col main-preview-col">
            <div className="preview-img">
              <img src="/Photos 2/WUS-10.jpg" alt="" />
            </div>
            <div className="preview-img main-preview-img">
              <img src="/Photos 2/Codex Image 17 Sept 2026, 09_09_22.png" alt="" />
            </div>
            <div className="preview-img">
              <img src="/Photos 2/WUS-4.jpg" alt="" />
            </div>
          </div>
          <div className="preview-col">
            <div className="preview-img">
              <img src="/Photos 2/WUS-7.jpg" alt="" />
            </div>
            <div className="preview-img">
              <img src="/Photos 2/WUS-27.jpg" alt="" />
            </div>
            <div className="preview-img">
              <img src="/Photos 2/WUS-29.jpg" alt="" />
            </div>
          </div>
          <div className="preview-col">
            <div className="preview-img">
              <img src="/Photos 2/WUS-38.jpg" alt="" />
            </div>
            <div className="preview-img">
              <img src="/Photos 2/WUS-46.jpg" alt="" />
            </div>
            <div className="preview-img">
              <img src="/Photos 2/WUS-8.jpg" alt="" />
            </div>
          </div>
        </div>
      </section>

      <section className="genesis-hero">
        <div className="gen-hero-img">
            <img src="/genesis/WUS-23.jpg" alt="" />
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
        <div className="genesis-screen">
          <div className="container">
            <div className="genesis-about-logo">
              <BrandIcon fill="#efefef" />
            </div>
            <div className="genesis-about-copy">
              <Copy>
                <h2>MADE IN LOS</h2>
                <h2>ANGELES</h2>
              </Copy>
              <Copy delay={0.2}>
                <h4>WE BUILD LOCALLY. THE</h4>
                <h4>CRAFT STAYS CLOSE, THE</h4>
                <h4>STANDARDS STAY HIGH,</h4>
                <h4>AND THE PEOPLE BEHIND</h4>
                <h4>THE PRODUCT ARE PART</h4>
                <h4>OF THE COLLECTIVE.</h4>
              </Copy>
            </div>
          </div>
        </div>
        <div className="genesis-screen">
          <div className="container">
            <div className="genesis-about-copy">
              <Copy delay={0.4}>
                <h4>EVERY PIECE IS</h4>
                <h4>PRODUCED CLOSE TO</h4>
                <h4>HOME, ALLOWING US TO</h4>
                <h4>STAY CONNECTED TO THE</h4>
                <h4>PROCESS, PROTECT THE</h4>
                <h4>QUALITY, AND SUPPORT</h4>
                <h4>THE COMMUNITY THAT</h4>
                <h4>HELPED SHAPE THE</h4>
                <h4>BRAND FROM DAY ONE.</h4>
              </Copy>
              <Copy delay={0.6}>
                <h4>WE BELIEVE GREAT</h4>
                <h4>PRODUCTS COME FROM</h4>
                <h4>GREAT RELATIONSHIPS.</h4>
                <h4>THAT&apos;S WHY WE FOCUS ON</h4>
                <h4>PEOPLE, CRAFTSMANSHIP, AND</h4>
                <h4>DOING THINGS THE RIGHT</h4>
                <h4>WAY.</h4>
              </Copy>
            </div>
          </div>
        </div>
      </section>

      <section className="project-page-whitespace"></section>

      <TextBlock />
    </div>
  );
}
