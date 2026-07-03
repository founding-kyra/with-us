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
        <div className="banner-content">
          <Copy type="flicker">
            <p>[ Frame Shift ]</p>
          </Copy>
          <Copy>
            <h4>REJECTION BECAME DIRECTION</h4>
          </Copy>
        </div>
        <div className="banner-img">
          <img src="/marquee-banner/2 (3).png" alt="" />
          <Annotation 
            mode="light"
            top="25%" left="50%"
            lineEndX={-35} lineEndY={-15} horizontalLength={25}
            textAlign="right" textOffsetX={-5}
            title="DOUBLE COLLAR"
            subtitle="MADE TO HOLD SHAPE"
          />
          <Annotation 
            mode="light"
            top="50%" left="43%"
            lineEndX={-45} lineEndY={10} horizontalLength={25}
            textAlign="right" textOffsetX={-5}
            title="ACID WASH FINISH"
            subtitle="GARMENT DYED"
          />
          <Annotation 
            mode="light"
            top="48%" left="57%"
            lineEndX={55} lineEndY={-10} horizontalLength={35}
            textAlign="left" textOffsetX={5}
            title="VENTED DETAILING"
            subtitle="PERFORATED BACK PANEL"
          />
          <Annotation 
            mode="light"
            top="65%" left="60%"
            lineEndX={55} lineEndY={15} horizontalLength={35}
            textAlign="left" textOffsetX={5}
            title="460 GSM COTTON"
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
