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

            gsap.set(imageContainer, { scale: progress });

            // Border radius peel animation disabled

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
          <div className="pr-img">
            <img src="/peel-reveal/peel reveal new .webp" alt="Peel reveal" />
          </div>
          {/* Mask layers hidden — peel animation disabled */}
          <div className="peel-reveal-header">
            <h1>The uniform holds no allegiance</h1>
          </div>
          
          <Annotation 
            mode="dark"
            top="32%" left="42%"
            lineEndX={-60} lineEndY={-50} horizontalLength={40}
            textAlign="right" textOffsetX={-10}
            title="MINERAL WASH"
            subtitle="GARMENT DYED FOR UNIQUE FADE"
          />
          <Annotation 
            mode="dark"
            top="55%" left="38%"
            lineEndX={-50} lineEndY={20} horizontalLength={60}
            textAlign="right" textOffsetX={-10}
            title="OVERSIZED FIT"
            subtitle="DESIGNED FOR DAILY MOVEMENT"
          />
          <Annotation 
            mode="dark"
            top="75%" left="42%"
            lineEndX={-40} lineEndY={30} horizontalLength={50}
            textAlign="right" textOffsetX={-10}
            title="MID WEIGHT FABRIC"
            subtitle="SOFT HAND FEEL. BUILT TO LAST."
          />
          
          <Annotation 
            mode="dark"
            top="30%" left="55%"
            lineEndX={60} lineEndY={-60} horizontalLength={40}
            textAlign="left" textOffsetX={10}
            title="THICK RIBBING"
            subtitle="MOCK NECK"
          />
          <Annotation 
            mode="dark"
            top="45%" left="52%"
            lineEndX={90} lineEndY={-10} horizontalLength={40}
            textAlign="left" textOffsetX={10}
            title="W LOGO"
            subtitle="VENTILATION HOLES"
          />
          <Annotation 
            mode="dark"
            top="60%" left="62%"
            lineEndX={60} lineEndY={10} horizontalLength={50}
            textAlign="left" textOffsetX={10}
            title="RAW HEM"
            subtitle="DISTRESSED EDGE"
          />
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
