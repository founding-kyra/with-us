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
      // Process Theatre Scroll Animation (Recreated from Aro Creativ)
      const stage = containerRef.current?.querySelector(".genesis-process-theatre");
      if (stage) {
        const mm = gsap.matchMedia();

        mm.add(
          {
            isDesktop: "(min-width: 900px)",
            isMobile: "(max-width: 899px)",
          },
          (context) => {
            const { isMobile } = context.conditions;
            stage.classList.add("process-motion");
            const rows = gsap.utils.toArray(
              stage.querySelectorAll(".process-item")
            );
            const counter = stage.querySelector(".process-counter");
            const orbit = stage.querySelector(".process-orbit");
            const getActiveY = (idx) => {
              if (idx === 1) return isMobile ? -30 : -60;
              return 0;
            };

            const getGap = (activeIdx) => {
              if (isMobile) {
                return activeIdx === 1
                  ? Math.max(window.innerHeight * 0.12, 80)
                  : Math.max(window.innerHeight * 0.08, 60);
              }
              if (activeIdx === 1) {
                return Math.max(window.innerHeight * 0.16, 130);
              }
              return Math.max(window.innerHeight * 0.12, 100);
            };

            const getY = (targetIdx, activeIdx) => {
              const activeCenter = getActiveY(activeIdx);
              if (targetIdx === activeIdx) return activeCenter;

              const gap = getGap(activeIdx);
              const activeH = rows[activeIdx].offsetHeight;
              const targetH = rows[targetIdx].offsetHeight;

              if (targetIdx < activeIdx) {
                // Animate upwards out of view
                return activeCenter - (activeH / 2 + gap + targetH / 2);
              }
              if (targetIdx === activeIdx + 1) {
                // Immediate next item sits with a spacious gap well below the active card
                return activeCenter + activeH / 2 + gap + targetH / 2;
              }
              // Further upcoming items sit deeper below
              return activeCenter + activeH / 2 + gap + targetH / 2 + (targetIdx - (activeIdx + 1)) * (isMobile ? 140 : 220);
            };

            const getOpacity = (targetIdx, activeIdx) => {
              if (targetIdx === activeIdx) return 1;
              if (targetIdx === activeIdx + 1) return 0.16; // subtle ambient preview, zero disturbance
              return 0; // any further sections are completely hidden
            };

            rows.forEach((row, j) => {
              gsap.set(row, {
                yPercent: -50,
                y: getY(j, 0),
                scale: j === 0 ? 1 : 0.96,
                opacity: getOpacity(j, 0),
                filter: j === 0 ? "blur(0px)" : "blur(5px)",
                zIndex: j === 0 ? 2 : 1,
                force3D: true,
              });
              const body = row.querySelector(".process-body");
              if (j && body) {
                gsap.set(body, { opacity: 0 });
              }
            });

            let activeStepFormatted = "01";
            const scrollDistance = isMobile
              ? window.innerHeight * 3.0
              : window.innerHeight * 3.8;

            const sequence = gsap.timeline({
              scrollTrigger: {
                trigger: stage,
                start: "top top",
                end: () => "+=" + scrollDistance,
                pin: true,
                anticipatePin: 1,
                scrub: 1.1,
                invalidateOnRefresh: true,
                refreshPriority: 2,
                onUpdate: (self) => {
                  if (counter) {
                    const stepNum = Math.min(
                      rows.length,
                      Math.floor(self.progress * (rows.length - 0.01)) + 1
                    );
                    const formatted = String(stepNum).padStart(2, "0");
                    if (formatted !== activeStepFormatted) {
                      activeStepFormatted = formatted;
                      counter.textContent = formatted;
                      gsap.fromTo(
                        counter,
                        { opacity: 0.35, y: 4 },
                        {
                          opacity: 1,
                          y: 0,
                          duration: 0.35,
                          ease: "power2.out",
                          overwrite: true,
                        }
                      );
                    }
                  }
                },
              },
            });

            sequence.to({}, { duration: 0.3 });

            for (let i = 1; i < rows.length; i++) {
              const at = 0.3 + (i - 1) * 1.35;
              rows.forEach((row, j) => {
                sequence.to(
                  row,
                  {
                    yPercent: -50,
                    y: () => getY(j, i),
                    scale: j === i ? 1 : 0.96,
                    opacity: () => getOpacity(j, i),
                    filter: j === i ? "blur(0px)" : "blur(5px)",
                    zIndex: j === i ? 2 : 1,
                    duration: 1.1,
                    ease: "power2.inOut",
                    force3D: true,
                  },
                  at
                );
              });

              const prevBody = rows[i - 1]?.querySelector(".process-body");
              const currBody = rows[i]?.querySelector(".process-body");

              if (prevBody) {
                sequence.to(
                  prevBody,
                  { opacity: 0, duration: 0.4, ease: "power2.out" },
                  at
                );
              }
              if (currBody) {
                sequence.to(
                  currBody,
                  { opacity: 1, duration: 0.55, ease: "power2.out" },
                  at + 0.4
                );
              }
            }

            sequence.to({}, { duration: 0.4 });

            if (orbit) {
              gsap.to(orbit, {
                rotation: 180,
                transformOrigin: "center center",
                ease: "none",
                scrollTrigger: {
                  trigger: stage,
                  start: "top top",
                  end: () => "+=" + scrollDistance,
                  scrub: 1,
                },
              });
            }

            return () => {
              stage.classList.remove("process-motion");
            };
          }
        );
      }

      // Project Preview Grid Zoom Animation (Whitespace trigger in proper DOM sequence)
      const projectPreviewWrapper = containerRef.current?.querySelector(
        ".project-preview-wrapper"
      );
      const previewCols = containerRef.current?.querySelectorAll(
        ".preview-col:not(.main-preview-col)"
      );
      const mainPreviewImg = containerRef.current?.querySelector(
        ".preview-img.main-preview-img img"
      );

      if (projectPreviewWrapper && previewCols?.length && mainPreviewImg) {
        ScrollTrigger.create({
          trigger: ".project-page-whitespace",
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1,
          refreshPriority: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const previewScreenWidth = window.innerWidth;
            const previewMaxScale = previewScreenWidth < 900 ? 4 : 2.65;

            const scale = 1 + self.progress * previewMaxScale;
            const yPreviewColTranslate = self.progress * 300;
            const mainPreviewImgScale = 2 - self.progress * 0.85;

            projectPreviewWrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;

            for (let c = 0; c < previewCols.length; c++) {
              previewCols[c].style.transform = `translateY(${yPreviewColTranslate}px)`;
            }

            mainPreviewImg.style.transform = `scale(${mainPreviewImgScale})`;
          },
        });
      }

      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);

      return () => {
        clearTimeout(refreshTimeout);
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
      <section className="project-preview">
        <div className="project-preview-wrapper">
          <div className="preview-col">
            <div className="preview-img">
              <img src="/Photos 2/WUS-31.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="preview-img">
              <img src="/Photos 2/WUS-35.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="preview-img">
              <img src="/Photos 2/WUS-41.webp" alt="" loading="lazy" decoding="async" />
            </div>
          </div>
          <div className="preview-col">
            <div className="preview-img">
              <img src="/Photos 2/WUS-25.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="preview-img">
              <img src="/Photos 2/WUS-16.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="preview-img">
              <img src="/Photos 2/WUS-11.webp" alt="" loading="lazy" decoding="async" />
            </div>
          </div>
          <div className="preview-col main-preview-col">
            <div className="preview-img">
              <img src="/Photos 2/WUS-10.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="preview-img main-preview-img">
              <img src="/genesis/back-to-back.png" alt="WITHUS Genesis Preview" loading="lazy" decoding="async" />
            </div>
            <div className="preview-img">
              <img src="/Photos 2/WUS-4.webp" alt="" loading="lazy" decoding="async" />
            </div>
          </div>
          <div className="preview-col">
            <div className="preview-img">
              <img src="/Photos 2/WUS-7.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="preview-img">
              <img src="/Photos 2/WUS-27.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="preview-img">
              <img src="/Photos 2/WUS-29.webp" alt="" loading="lazy" decoding="async" />
            </div>
          </div>
          <div className="preview-col">
            <div className="preview-img">
              <img src="/Photos 2/WUS-38.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="preview-img">
              <img src="/Photos 2/WUS-46.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="preview-img">
              <img src="/Photos 2/WUS-8.webp" alt="" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      <section className="genesis-hero">
        <div className="gen-hero-img">
            <img src="/genesis/WUS-23.webp" alt="WITHUS Genesis Hero" fetchPriority="high" decoding="async" />
        </div>
      </section>

      <div className="genesis-fact-strip" aria-label="WITHUS timeline">
        <div className="genesis-fact-track">
          <div className="genesis-fact-content">
            <span>SINCE 2022 · EST. 2024 · REBUILT 2026 · CREATED IN LOS ANGELES · REWARDING THE WORK</span>
            <span className="fact-divider" aria-hidden="true">·</span>
          </div>
          <div className="genesis-fact-content" aria-hidden="true">
            <span>SINCE 2022 · EST. 2024 · REBUILT 2026 · CREATED IN LOS ANGELES · REWARDING THE WORK</span>
            <span className="fact-divider" aria-hidden="true">·</span>
          </div>
          <div className="genesis-fact-content" aria-hidden="true">
            <span>SINCE 2022 · EST. 2024 · REBUILT 2026 · CREATED IN LOS ANGELES · REWARDING THE WORK</span>
            <span className="fact-divider" aria-hidden="true">·</span>
          </div>
          <div className="genesis-fact-content" aria-hidden="true">
            <span>SINCE 2022 · EST. 2024 · REBUILT 2026 · CREATED IN LOS ANGELES · REWARDING THE WORK</span>
            <span className="fact-divider" aria-hidden="true">·</span>
          </div>
        </div>
      </div>

      <section className="genesis-about">
        <div className="genesis-screen">
          <div className="container">
            <div className="genesis-about-logo"><BrandIcon fill="#efefef" /></div>
            <div className="genesis-about-copy">
          <Copy><h2>GENESIS</h2></Copy>
          <Copy><p className="genesis-lead">Built for those who were overlooked or underestimated.</p></Copy>
          <Copy><p>WITHUS began as an idea in Los Angeles in 2022, became a company in 2024, and was rebuilt in 2026 by people who believe in each other. It was never about one person or one idea. It's about respect for anyone who works hard, aims high and refuses to settle, and about helping each other get there. That's why people find their way to WITHUS: they see themselves in who it represents.</p></Copy>
        </div>
          </div>
        </div>
        <div className="genesis-screen">
          <div className="container">

            <div className="genesis-about-copy"><Copy><h2>REJECTION BECAME DIRECTION</h2></Copy>
          <Copy><p>Everyone behind WITHUS has been doubted at some point. We don't build around those moments. We build around what came after: the discipline, the repetition, the refusal to settle.</p></Copy>
        </div>
          </div>
        </div>
        <section className="genesis-process-theatre process-theatre">
          <div className="process-orbit">
            <svg
              className="orbit-svg"
              width="140"
              height="140"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Outer precision frame */}
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="rgba(255, 255, 255, 0.22)"
                strokeWidth="1"
              />

              {/* Minimalist cardinal tick marks at North, South, East, West */}
              <line x1="100" y1="5" x2="100" y2="13" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="100" y1="187" x2="100" y2="195" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="5" y1="100" x2="13" y2="100" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="187" y1="100" x2="195" y2="100" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1.5" strokeLinecap="round" />

              {/* Secondary fine-dashed radar arc */}
              <circle
                cx="100"
                cy="100"
                r="76"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
                strokeDasharray="4 6"
              />

              {/* Corner coordinate guide dots */}
              <circle cx="48" cy="48" r="1.5" fill="rgba(255, 255, 255, 0.5)" />
              <circle cx="152" cy="48" r="1.5" fill="rgba(255, 255, 255, 0.5)" />
              <circle cx="48" cy="152" r="1.5" fill="rgba(255, 255, 255, 0.5)" />
              <circle cx="152" cy="152" r="1.5" fill="rgba(255, 255, 255, 0.5)" />

              {/* Inner ambient lens disc */}
              <circle
                cx="100"
                cy="100"
                r="64"
                fill="rgba(255, 255, 255, 0.025)"
                stroke="rgba(255, 255, 255, 0.18)"
                strokeWidth="0.75"
              />

              {/* Centered WITHUS Logo - locked to exact center */}
              <g transform="translate(100, 100)">
                <svg x="-28" y="-28" width="56" height="56" viewBox="0 0 1000 1000" fill="none">
                  <path
                    d="M311.38,745.73c-31.22,17.63-65.97,28.66-100.63,18.31-15.96-4.77-28.26-16.13-34.05-31.89-4.17-11.36-6.82-23.41-6.83-36.02l-.34-278.89c-2.19-41.3,1.07-73.38-42.49-94.23,55.13-14.09,101.57-41.57,136.05-83.9,2.07-.73,4.29-.72,6.86,0l.22,392.88c0,12.67,3.2,25.53,7.95,36.58,7.21,16.79,22.18,27.22,40.05,28.6,27.86,2.16,54.5-5.83,78.12-21.4,2.43,5.14.07,8.26-3.74,11.56-25.38,21.9-51.65,41.73-81.16,58.39Z"
                    fill="#ffffff"
                  />
                  <path
                    d="M537.25,753.97l-107.65-.02-.25-300.93s-3.49-80.1-7.26-93.4c-5.38-17.95-17.58-27.24-35.86-36.69,55.93-13.67,102.76-41.18,138.39-84.15,2.53-.3,5.63-.24,8.21.24,0,0-11.52,415.76,4.42,514.94Z"
                    fill="#ffffff"
                  />
                  <path
                    d="M752.67,725.38c-12.13,30.03-50.08,33.15-78.16,24.62-18.64-5.67-35.87-14.67-52.27-25.69-19.72-13.25-39.31-26.94-57.02-45.75,22.17,11.03,41.45,18.55,65.37,17.22,36.72-2.04,45.1-34.57,45.73-66.85l1.7-87.93.7-235.66c.09-31.64,4.12-62.74,38.05-70.95,34.18-8.27,63.32,6.03,92.86,23.09,21.7,14.79,43.88,29.33,63.34,50.05-22.87-11.26-43.1-19.26-67.52-17.19-18.37,1.56-32.37,13.15-38.32,31-4.13,12.4-5.02,25.44-5.16,39.08l-2,205.04-.59,70.08-.59,61.79c-.1,9.92-2.5,19.15-6.1,28.07Z"
                    fill="#ffffff"
                  />
                </svg>
              </g>
            </svg>
          </div>

          <span className="process-counter" aria-hidden="true">
            01
          </span>

          <ol className="process-list">
            <li className="process-item">
              <div className="process-content">
                <h2>FOR THE OVERLOOKED</h2>
                <div className="process-body">
                  <p>
                    SOME COMMUNITIES HAVE ALWAYS BEEN UNDERSERVED BY WHAT THEY WEAR.
                    DANCERS ARE A CLEAR EXAMPLE: THEY NEED CLOTHES THAT LOOK FLY AND STILL
                    LET THEM MOVE, AND THEY RARELY GET BOTH. PLENTY OF OTHERS FEEL THE
                    SAME GAP. THAT&apos;S THE SPACE WITHUS FILLS: LUXURY STREETWEAR FIRST,
                    COMFORTABLE AND FUNCTIONAL ENOUGH TO LIVE IN.
                  </p>
                </div>
              </div>
            </li>

            <li className="process-item">
              <div className="process-content">
                <h2>STYLE THAT WORKS</h2>
                <div className="process-body">
                  <p className="process-lead">EVERY DETAIL DOES TWO JOBS.</p>
                  <ul className="process-bullets">
                    <li>
                      <strong>VENTILATION FORMED FROM OUR LOGO</strong>, FOR
                      BREATHABILITY THAT DOUBLES AS DESIGN
                    </li>
                    <li>
                      <strong>A SPLIT FRONT HEM</strong> ON THE SWEATPANTS, SO A WIDE LEG
                      DRAPES CLEAN WITHOUT DRAGGING OR BUNCHING AT A CUFF
                    </li>
                    <li>
                      <strong>MID-WEIGHT, MINERAL-WASHED, GARMENT-DYED FABRIC</strong>{" "}
                      THAT HOLDS ITS SHAPE AND SOFTENS WITH WEAR
                    </li>
                    <li>
                      <strong>THICK RIBBING AND A MOCK NECK</strong> THAT KEEP THEIR
                      STRUCTURE WASH AFTER WASH
                    </li>
                  </ul>
                  <p>
                    NOTHING IS ADDED BECAUSE IT LOOKS BUSY. NOTHING IS CUT BECAUSE IT&apos;S
                    CHEAPER.
                  </p>
                </div>
              </div>
            </li>

            <li className="process-item">
              <div className="process-content">
                <h2>LIMITED BY DESIGN</h2>
                <div className="process-body">
                  <p>
                    EVERY PIECE IS DESIGNED IN LOS ANGELES AND MADE IN SMALL RUNS. WE
                    WORK CLOSELY WITH OUR PRODUCTION PARTNERS AND APPROVE EVERY SAMPLE
                    OURSELVES, SO EACH RUN MEETS THE SAME STANDARD AS THE FIRST.
                  </p>
                </div>
              </div>
            </li>

            <li className="process-item">
              <div className="process-content">
                <h2>WE REWARD THE WORK</h2>
                <div className="process-body">
                  <p>
                    ASPIRATION ONLY MEANS SOMETHING IF PEOPLE CAN REACH IT. SO WE REWARD
                    THE WORK: BACKING YOUNG ATHLETES WHO PUT IN THE HOURS, AND BUILDING A
                    COMMUNITY THAT RISES TO THE STANDARD WE HOLD OURSELVES TO. THAT
                    STARTS WITH WITHUS WAVES, A TRACK CLUB STARTED BY ONE OF OUR OWN FOR
                    SERIOUS HIGH SCHOOL ATHLETES, ESPECIALLY THOSE AT SCHOOLS WITHOUT A
                    STRONG PROGRAM. IT&apos;S A TEAM YOU&apos;LL SEE US INVEST IN MORE IN
                    THE NEAR FUTURE.
                  </p>
                </div>
              </div>
            </li>
          </ol>
        </section>
<div className="genesis-screen genesis-closing-screen"><div className="container"><div className="genesis-about-copy"><Copy><p className="genesis-closing"><strong>Luxury with purpose. Created in Los Angeles.</strong></p></Copy></div></div></div>
      </section>

      <section className="project-page-whitespace"></section>

      <TextBlock />
    </div>
  );
}
