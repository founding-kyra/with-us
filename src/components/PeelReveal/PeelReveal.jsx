"use client";
import "./PeelReveal.css";
import { useRef, useEffect } from "react";

import Copy from "../Copy/Copy";
import Annotation from "../Annotation/Annotation";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const PeelReveal = () => {
  const peelRevealContainerRef = useRef(null);

  useEffect(() => {
    const container = peelRevealContainerRef.current;
    if (!container) return;

    let timer = null;

    const ctx = gsap.context(() => {
      timer = setTimeout(() => {
        const section = container.querySelector(".peel-reveal");
        if (!section) return;

        const imageContainer = section.querySelector(
          ".peel-reveal-img-container"
        );
        const introTexts = Array.from(
          section.querySelectorAll(".peel-reveal-intro-text")
        );
        const maskLayers = Array.from(section.querySelectorAll(".mask"));
        const header = section.querySelector(".peel-reveal-header h1");

        if (!imageContainer || !header) return;

        const splitText = new SplitText(header, { type: "words" });
        const words = splitText.words;
        gsap.set(words, { opacity: 0 });

        // Mask peel animation disabled
        gsap.set(imageContainer, { scale: 0 });

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * 4}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;

            gsap.set(imageContainer, { 
              scale: progress,
              borderRadius: `${3 * (1 - progress)}rem` 
            });

            // Mask layer scale animation disabled

            if (progress <= 0.9) {
              const textProgress = progress / 0.9;
              const moveDistance = window.innerWidth * 0.55;
              gsap.set(introTexts[0], { x: -textProgress * moveDistance });
              gsap.set(introTexts[1], { x: textProgress * moveDistance });
            }

            if (progress >= 0.6 && progress <= 0.9) {
              const headerProgress = (progress - 0.6) / 0.3;
              const totalWords = words.length;

              words.forEach((word, i) => {
                const wordStartDelay = i / totalWords;
                const wordEndDelay = (i + 1) / totalWords;
                let wordOpacity = 0;

                if (headerProgress >= wordEndDelay) {
                  wordOpacity = 1;
                } else if (headerProgress >= wordStartDelay) {
                  const wordProgress =
                    (headerProgress - wordStartDelay) /
                    (wordEndDelay - wordStartDelay);
                  wordOpacity = wordProgress;
                }

                gsap.set(word, { opacity: wordOpacity });
              });
            } else if (progress < 0.6) {
              gsap.set(words, { opacity: 0 });
            } else if (progress > 0.9) {
              gsap.set(words, { opacity: 1 });
            }
          },
        });
      }, 500);
    }, container);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      ctx.revert();
    };
  }, []);

  return (
    <div className="peel-reveal-container" ref={peelRevealContainerRef}>
      <section className="peel-reveal">


        <div className="peel-reveal-img-container">
          <div className="pr-cover-wrapper">
            <div className="pr-img mask">
              <img src="/peel-reveal/Codex Image 18 Sept 2026, 23_17_14.png" alt="Peel reveal" />
            </div>
          </div>

          <div className="peel-reveal-header">
            <h1>The uniform holds no allegiance</h1>
          </div>
          <div className="corner-markers">
            <div className="cm-top-left">
              <span className="cm-cross">+</span>
              <div className="cm-text">
                <strong>[ SHARED VISION ]</strong><br/>
                COLLECTION 01<br/>
                EST. 2024<br/>
                INTENT DRIVEN
              </div>
            </div>
            <div className="cm-top-right">
              <div className="cm-text right-align">
                <strong>WITHUS™</strong><br/>
                DESIGNED WITH INTENT
              </div>
              <span className="cm-cross">+</span>
            </div>
            <div className="cm-bottom-left">
              <span className="cm-cross">+</span>
              <span className="cm-text">ARCHIVE SERIES</span>
            </div>
            <div className="cm-bottom-right">
              <span className="cm-text">BUILT TO OUTLAST</span>
              <span className="cm-cross">+</span>
            </div>
            <div className="cm-center-left">001 / 120</div>
            <div className="cm-center-right">FW . 26</div>
          </div>
        </div>
        <div className="peel-reveal-intro-text-container">
          <div className="peel-reveal-intro-text">
            <h1>SHARED</h1>
          </div>
          <div className="peel-reveal-intro-text">
            <h1>VISION</h1>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PeelReveal;
