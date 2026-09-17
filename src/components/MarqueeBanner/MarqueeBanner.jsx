import "./MarqueeBanner.css";
import { useRef } from "react";

import Copy from "../Copy/Copy";
import Annotation from "../Annotation/Annotation";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MarqueeBanner = () => {
  const marqueeBannerRef = useRef(null);
  const marquee1Ref = useRef(null);
  const marquee2Ref = useRef(null);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: marqueeBannerRef.current,
        start: "top bottom",
        end: "150% top",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;

          const marquee1X = 25 - progress * 50;
          gsap.set(marquee1Ref.current, { x: `${marquee1X}%` });

          const marquee2X = -25 + progress * 50;
          gsap.set(marquee2Ref.current, { x: `${marquee2X}%` });
        },
      });
    },
    { scope: marqueeBannerRef }
  );

  return (
    <section className="marquee-banner" ref={marqueeBannerRef}>
      <div className="marquees">
        <div className="marquee-header marquee-header-1" ref={marquee1Ref}>
          <h1>BUILT FOR THE ONES WHO STAYED</h1>
        </div>
        <div className="marquee-header marquee-header-2" ref={marquee2Ref}>
          <h1>FOR THE ONES THAT REFUSED TO QUIT</h1>
        </div>
      </div>
      <div className="banner">
        <div className="banner-bg-img">
          <img src="/marquee-banner/Codex Image 17 Sept 2026, 04_26_41.webp" alt="Banner Background" />
        </div>
        <div className="banner-content">
          <Copy type="flicker">
            <p>[ Frame Shift ]</p>
          </Copy>
          <Copy>
            <h4>REJECTION BECAME DIRECTION</h4>
          </Copy>
        </div>
        <div className="banner-img">
          <img src="/marquee-banner/Codex Image 17 Sept 2026, 04_19_23.webp" alt="Product Image" />
          {/* LEFT UPPER - THICK RIBBING */}
          <Annotation 
            mode="light"
            top="36%" left="52%"
            lineEndX={-80} lineEndY={-15} horizontalLength={40}
            textAlign="right" textOffsetX={-5}
            title="THICK RIBBING"
            subtitle="MOCK NECK"
          />
          {/* LEFT MID - MINERAL WASH */}
          <Annotation 
            mode="light"
            top="60%" left="30%"
            lineEndX={-30} lineEndY={0} horizontalLength={30}
            textAlign="right" textOffsetX={-5}
            title="MINERAL WASH"
            subtitle="GARMENT DYED"
          />
          {/* RIGHT UPPER - W LOGO */}
          <Annotation 
            mode="light"
            top="50%" left="55%"
            lineEndX={105} lineEndY={-20} horizontalLength={20}
            textAlign="left" textOffsetX={5}
            title="W LOGO"
            subtitle="VENTILATION HOLES"
          />
          {/* RIGHT LOWER - MID WEIGHT FABRIC */}
          <Annotation 
            mode="light"
            top="75%" left="58%"
            lineEndX={100} lineEndY={20} horizontalLength={20}
            textAlign="left" textOffsetX={5}
            title="MID WEIGHT FABRIC"
            subtitle="OVERSIZED FIT"
          />
        </div>
        <div className="banner-logo">
          <h5>WITHUS</h5>
        </div>
      </div>
    </section>
  );
};

export default MarqueeBanner;
