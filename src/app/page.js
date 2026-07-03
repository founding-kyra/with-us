"use client";
import "./home.css";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

import { getProducts } from "@/lib/shopify";
import Preloader, { isInitialLoad } from "@/components/Preloader/Preloader";
import DotMatrix from "@/components/DotMatrix/DotMatrix";
import BrandIcon from "@/components/BrandIcon/BrandIcon";
import MarqueeBanner from "@/components/MarqueeBanner/MarqueeBanner";
import TextBlock from "@/components/TextBlock/TextBlock";
import PeelReveal from "@/components/PeelReveal/PeelReveal";
import CTA from "@/components/CTA/CTA";
import Annotation from "@/components/Annotation/Annotation";

import Copy from "@/components/Copy/Copy";
import Product from "@/components/Product/Product";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Index() {
  const [loaderAnimating, setLoaderAnimating] = useState(isInitialLoad);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const heroImgRef = useRef(null);
  const heroHeaderRef = useRef(null);
  const heroSectionRef = useRef(null);

  const handlePreloaderComplete = () => {
    setLoaderAnimating(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts(4);
      setFeaturedProducts(data);
    };
    fetchProducts();
  }, []);

  useGSAP(() => {
    if (!heroImgRef.current || !heroHeaderRef.current) return;

    gsap.set(heroImgRef.current, { y: 1000 });
    gsap.to(heroImgRef.current, {
      y: 0,
      duration: 0.75,
      ease: "power3.out",
      delay: isInitialLoad ? 5.75 : 1,
    });

    gsap.to(heroHeaderRef.current, {
      y: 150,
      ease: "none",
      scrollTrigger: {
        trigger: heroSectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  return (
    <>
      <Preloader onAnimationComplete={handlePreloaderComplete} />

      <section className="hero" ref={heroSectionRef}>
        <DotMatrix
          color="#afa69c"
          dotSize={2}
          spacing={5}
          opacity={0.9}
          delay={isInitialLoad ? 6 : 1.125}
        />
        <div className="container">
          <div className="hero-header" ref={heroHeaderRef}>
            <Copy animateOnScroll={false} delay={isInitialLoad ? 5.5 : 0.65}>
              <h1>
                YOU&apos;RE <br /> W/US
              </h1>
            </Copy>
          </div>
        </div>
        <div className="hero-img" ref={heroImgRef}>
          <img src="/home/451079DD-E9EE-45BB-925B-7A58D5D5C1B2.webp" alt="" />

        </div>

      </section>

      <section className="about">
        <div className="container">
          <div className="about-copy">
            <Copy>
              <h3>BUILT FOR THOSE WHO WERE OVERLOOKED OR UNDERESTIMATED</h3>
            </Copy>
            <div className="about-icon">
              <BrandIcon />
            </div>
          </div>
        </div>

      </section>

      <section className="featured-products">
        <div className="container">
          <div className="featured-products-header">
            <Copy type="flicker">
              <p>LATEST DROPS</p>
            </Copy>
            <Copy>
              <h3>THE UNIFORM</h3>
            </Copy>
          </div>
          <div className="featured-products-separator">
            <div className="featured-products-divider"></div>
            <div className="featured-products-labels">

              <Copy type="flicker">
                <Link href="/wardrobe">VIEW COLLECTION</Link>
              </Copy>
            </div>
          </div>
          <div className="featured-products-list">
            {featuredProducts.map((product, index) => (
              <Product
                key={product.handle || product.id}
                product={product}
                productIndex={index + 1}
                showAddToCart={true}
              />
            ))}
          </div>
        </div>
      </section>

      <MarqueeBanner />

      <TextBlock />

      <PeelReveal />

      <CTA />
    </>
  );
}
