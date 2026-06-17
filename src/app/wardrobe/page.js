"use client";
import "./wardrobe.css";
import { useEffect, useRef, useState } from "react";

import { getProducts } from "@/lib/shopify";
import Product from "@/components/Product/Product";
import Copy from "@/components/Copy/Copy";

import { gsap } from "gsap";

export default function Wardrobe() {
  const [activeTag, setActiveTag] = useState("All");
  const [activeColor, setActiveColor] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const productRefs = useRef([]);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts(20);
      setAllProducts(data);
      setFilteredProducts(data);
    };
    fetchProducts();
  }, []);

  const handleFilterChange = (newTag, newColor) => {
    if (isAnimating) return;
    if (newTag === activeTag && newColor === activeColor) return;

    setIsAnimating(true);
    setActiveTag(newTag);
    setActiveColor(newColor);

    const currentRefs = productRefs.current.filter(Boolean);

    const applyFilter = () => {
      const filtered = allProducts.filter((product) => {
        if (newTag !== "All" && !product.tags?.includes(newTag)) return false;
        // if (newColor && product.color !== newColor) return false; // assuming Shopify doesn't map color perfectly yet
        return true;
      });
      setFilteredProducts(filtered);
    };

    if (currentRefs.length === 0) {
      // No visible products to animate out — apply immediately
      applyFilter();
      return;
    }

    gsap.killTweensOf(currentRefs);

    gsap.to(currentRefs, {
      opacity: 0,
      scale: 0.5,
      duration: 0.25,
      stagger: 0.05,
      ease: "power3.out",
      onComplete: applyFilter,
    });
  };

  useEffect(() => {
    productRefs.current = productRefs.current.slice(0, filteredProducts.length);
    const currentRefs = productRefs.current.filter(Boolean);

    gsap.killTweensOf(currentRefs);

    if (currentRefs.length === 0) {
      // No products to animate in — unlock immediately
      setIsAnimating(false);
      isInitialMount.current = false;
      return;
    }

    gsap.fromTo(
      currentRefs,
      { opacity: 0, scale: 0.5 },
      {
        opacity: 1,
        scale: 1,
        duration: isInitialMount.current ? 0.5 : 0.25,
        stagger: 0.05,
        ease: "power3.out",
        onComplete: () => {
          setIsAnimating(false);
          isInitialMount.current = false;
        },
      }
    );
  }, [filteredProducts]);

  return (
    <>
      <section className="products-header">
        <div className="container">
          <Copy animateOnScroll={false} delay={0.65}>
            <h1>Wardrobe Circulation</h1>
          </Copy>
          <div className="products-header-divider"></div>
          <div className="product-filter-bar">
            <div className="filter-bar-header">
              <p className="bodyCopy">Filters</p>
            </div>
            <div className="filter-bar-tags">
              {["All", "Summer 2026"].map((tag) => (
                <p
                  key={tag}
                  className={`bodyCopy ${activeTag === tag ? "active" : ""}`}
                  onClick={() => handleFilterChange(tag, activeColor)}
                  style={{ cursor: isAnimating ? "not-allowed" : "pointer" }}
                >
                  {tag}
                </p>
              ))}
            </div>

          </div>
        </div>
      </section>
      <section className="product-list">
        <div className="container">
          {filteredProducts.map((product, index) => (
            <Product
              key={product.handle || product.id}
              product={product}
              productIndex={index + 1}
              showAddToCart={true}
              innerRef={(el) => (productRefs.current[index] = el)}
              style={{ opacity: 0, transform: "scale(0.5)" }}
            />
          ))}
        </div>
      </section>
    </>
  );
}
