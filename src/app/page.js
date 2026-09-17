"use client";
import "./home.css";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

import { getProducts } from "@/lib/shopify";
import Preloader, { isInitialLoad } from "@/components/Preloader/Preloader";

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
  const heroSectionRef = useRef(null);

  const handlePreloaderComplete = () => {
    setLoaderAnimating(false);
  };

  const default6Products = [
    { id: "1", handle: "mock-vent-tee-1", title: "MOCK VENT TEE", price: "100.0", image: "/product/product_shot_01.webp" },
    { id: "2", handle: "mock-vent-tee-2", title: "MOCK VENT TEE", price: "100.0", image: "/product/product_shot_02.webp" },
    { id: "3", handle: "mesh-shorts-1", title: "MESH 2-IN-1 SHORTS", price: "130.0", image: "/product/product_shot_03.webp" },
    { id: "4", handle: "new-era-hat", title: "NEW ERA 59FIFTY FITTED HAT", price: "80.0", image: "/product/product_shot_04.webp" },
    { id: "5", handle: "mock-vent-tee-3", title: "MOCK VENT TEE", price: "100.0", image: "/product/product_shot_05.webp" },
    { id: "6", handle: "mesh-shorts-2", title: "MESH 2-IN-1 SHORTS", price: "130.0", image: "/product/1.webp" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(6);
        if (data && data.length >= 6) {
          setFeaturedProducts(data.slice(0, 6));
        } else if (data && data.length > 0) {
          setFeaturedProducts([...data, ...default6Products.slice(data.length)]);
        } else {
          setFeaturedProducts(default6Products);
        }
      } catch (err) {
        setFeaturedProducts(default6Products);
      }
    };
    fetchProducts();
  }, []);

  useGSAP(() => {
    if (!heroImgRef.current) return;

    gsap.set(heroImgRef.current, { y: 1000 });
    gsap.to(heroImgRef.current, {
      y: 0,
      duration: 0.75,
      ease: "power3.out",
      delay: isInitialLoad ? 5.75 : 1,
    });
  });

  return (
    <>
      <Preloader onAnimationComplete={handlePreloaderComplete} />

      <section className="hero" ref={heroSectionRef}>
        <div className="hero-bg-img">
          <img src="/home/hero-bg.webp" alt="Hero Background" />
        </div>
        <div className="hero-middle-gif">
          <img src="/home/3.gif" alt="Hero Background Animation" />
        </div>
        <div className="hero-img" ref={heroImgRef}>
          <img src="/home/hero-model.webp" alt="Hero Model" />
        </div>

      </section>

      <section className="about">
        <div className="container">
          <div className="about-copy">
            <Copy>
              <h3>BUILT FOR THOSE WHO WERE OVERLOOKED OR UNDERESTIMATED</h3>
            </Copy>
          </div>
        </div>
      </section>

      <section className="featured-products">
        <div className="featured-bg-img">
          <img src="/home/Codex Image 17 Sept 2026, 11_45_50.webp" alt="Smoke Overlay" aria-hidden="true" />
        </div>
        <div className="container">
          <div className="featured-products-header">
            <Copy type="flicker">
              <p className="featured-eyebrow">LATEST DROPS</p>
            </Copy>
            <Copy>
              <h3 className="featured-typography">THE UNIFORM</h3>
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
