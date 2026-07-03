"use client";
import "./unit.css";
import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { use } from "react";
import { getProduct, getProducts } from "@/lib/shopify";
import Annotation from "@/components/Annotation/Annotation";
import Copy from "@/components/Copy/Copy";
import Product from "@/components/Product/Product";
import { useCartStore } from "@/store/cartStore";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Unit({ params }) {
  const { handle } = use(params);
  const heroRef = useRef(null);
  const activeMinimapIndex = useRef(0);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [specImageUrl, setSpecImageUrl] = useState(null);
  const [shippingImageUrl, setShippingImageUrl] = useState(null);
  const heroScrollTriggerRef = useRef(null);


  const addToCart = useCartStore((state) => state.addToCart);
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      const product = await getProduct(handle);
      setCurrentProduct(product);

      console.log('[DEBUG] product:', product);
      console.log('[DEBUG] product.title:', product?.title);
      console.log('[DEBUG] product.images:', product?.images?.edges);

       // Pick spec image (index 1) and shipping image (index 2) from Shopify product images
       const specImg = product?.images?.edges?.[1]?.node?.url || null;
       const shipImg = product?.images?.edges?.[2]?.node?.url || null;
       setSpecImageUrl(specImg);
       setShippingImageUrl(shipImg);

      const allProducts = await getProducts(10);
      console.log('[DEBUG] allProducts count:', allProducts.length, allProducts.map(p => p.handle));
      setRelatedProducts(allProducts.filter((p) => p.handle !== handle));

    
    };
    fetchData();
  }, [handle]);

  useEffect(() => {
    if (pathname === "/unit") {
      window.scrollTo(0, 0);

      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  useEffect(() => {
    const handleScrollToTop = () => {
      window.scrollTo(0, 0);
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    };

    window.addEventListener("scrollToTop", handleScrollToTop);

    return () => {
      window.removeEventListener("scrollToTop", handleScrollToTop);
    };
  }, []);

  useGSAP(() => {
    const snapshots = document.querySelectorAll(".product-snapshot");
    const minimapImages = document.querySelectorAll(
      ".product-snapshot-minimap-img"
    );
    const totalImages = snapshots.length;

    // Guard: don't run if images haven't loaded yet
    if (totalImages === 0) return;

    // Kill only the hero ScrollTrigger to avoid duplicates, preserving Copy component triggers
    if (heroScrollTriggerRef.current) {
      heroScrollTriggerRef.current.kill();
      heroScrollTriggerRef.current = null;
    }

    gsap.set(snapshots[0], { y: "0%", scale: 1 });
    gsap.set(minimapImages[0], { scale: 1.25 });
    for (let i = 1; i < totalImages; i++) {
      gsap.set(snapshots[i], { y: "100%", scale: 1 });
      gsap.set(minimapImages[i], { scale: 1 });
    }

    heroScrollTriggerRef.current = ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: `+=${window.innerHeight * 5}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        let currentActiveIndex = 0;

        for (let i = 1; i < totalImages; i++) {
          const imageStart = (i - 1) / (totalImages - 1);
          const imageEnd = i / (totalImages - 1);

          let localProgress = (progress - imageStart) / (imageEnd - imageStart);
          localProgress = Math.max(0, Math.min(1, localProgress));

          const yValue = 100 - localProgress * 100;
          gsap.set(snapshots[i], { y: `${yValue}%` });

          const scaleValue = 1 + localProgress * 0.5;
          gsap.set(snapshots[i - 1], { scale: scaleValue });

          if (localProgress >= 0.5) {
            currentActiveIndex = i;
          }
        }

        if (currentActiveIndex !== activeMinimapIndex.current) {
          gsap.to(minimapImages[currentActiveIndex], {
            scale: 1.25,
            duration: 0.3,
            ease: "power2.out",
          });

          for (let i = 0; i < currentActiveIndex; i++) {
            gsap.to(minimapImages[i], {
              scale: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          }

          for (let i = currentActiveIndex + 1; i < totalImages; i++) {
            gsap.to(minimapImages[i], {
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          }

          activeMinimapIndex.current = currentActiveIndex;
        }
      },
    });

    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [currentProduct]);

  return (
    <>
      <section className="product-hero" ref={heroRef}>
        <div className="product-hero-col product-snapshots">
          {currentProduct?.images?.edges.slice(0, 4).map((edge, index) => (
            <div className="product-snapshot" key={index}>
              <img src={edge.node.url} alt="" />
            </div>
          )) || (
            <div className="product-snapshot">
              <img src="/product/1.jpg" alt="" />
            </div>
          )}
          <div className="product-snapshot-minimap">
            {currentProduct?.images?.edges.slice(0, 4).map((edge, index) => (
              <div className="product-snapshot-minimap-img" key={`mini-${index}`}>
                <img src={edge.node.url} alt="" />
              </div>
            )) || (
              <div className="product-snapshot-minimap-img">
                <img src="/product/1.jpg" alt="" />
              </div>
            )}
          </div>
        </div>
        <div className="product-hero-col product-meta">
          <div className="product-meta-container">
            <div className="product-meta-header">
              <h3>{currentProduct?.title || currentProduct?.name}</h3>
              <h3>${currentProduct?.priceRange?.minVariantPrice?.amount || currentProduct?.price}</h3>
            </div>
            <div className="product-meta-header-divider"></div>
            <div className="product-sizes-container">
              <p className="md">Form Size</p>
              <div className="product-sizes">
                <p className="md selected">[ S ]</p>
                <p className="md">[ M ]</p>
                <p className="md">[ L ]</p>
                <p className="md">[ XL ]</p>
              </div>
            </div>
            <div className="product-meta-buttons">
              <button
                className="primary"
                onClick={() => addToCart({
                  ...currentProduct,
                  name: currentProduct?.title,
                  price: currentProduct?.priceRange?.minVariantPrice?.amount,
                  image: currentProduct?.images?.edges?.[0]?.node?.url,
                  variantId: currentProduct?.variants?.edges?.[0]?.node?.id
                })}
              >
                Add To Bag
              </button>
              <button className="secondary">Save Item</button>
            </div>
          </div>
        </div>
      </section>

      <section className="product-details specifications">
        <div className="product-col product-col-copy">
          <div className="product-col-copy-wrapper">
            <Copy>
              <h4>Description</h4>
            </Copy>
            <div className="section-body">
              <Copy>
                {currentProduct?.descriptionHtml ? (
                  <div 
                    className="shopify-description" 
                    dangerouslySetInnerHTML={{ __html: currentProduct.descriptionHtml }} 
                  />
                ) : (
                  <p>{currentProduct?.description}</p>
                )}
              </Copy>
            </div>
          </div>
        </div>
        {specImageUrl && (
          <div className="product-col product-col-img">
            <img src={specImageUrl} alt="" className="section-image" />
          </div>
        )}
      </section>

      <section className="product-details shipping-details">
        {shippingImageUrl && (
          <div className="product-col product-col-img">
            <img src={shippingImageUrl} alt="" className="section-image" />
          </div>
        )}
        <div className="product-col product-col-copy">
          <div className="product-col-copy-wrapper">
            <Copy>
              <h4>Shipping Terms</h4>
            </Copy>
            <div className="section-body">
              <Copy>
                <p className="bodyCopy lg">
                  All orders are processed within 5 business days and shipped via
                  tracked courier service. Estimated delivery times vary by
                  region, but most domestic shipments arrive within 7 business
                  days. You’ll receive a tracking link once your order is
                  dispatched.
                </p>
              </Copy>
              <Copy>
                <p className="bodyCopy lg">
                  We accept returns on unworn items within 30 days of delivery. To
                  initiate a return, please email hello@withusworld.com for a return label
                  with your order number. Refunds are issued to the original payment method
                  once the item is received and inspected.
                </p>
              </Copy>
            </div>
          </div>
        </div>
      </section>

      <section className="related-products">
        <div className="container">
          <div className="related-products-header">
            <h3>Parallel Forms</h3>
          </div>
          <div className="related-products-container">
            <div className="container">
              {relatedProducts.map((product, index) => (
                <Product
                  key={product.handle || product.id}
                  product={product}
                  productIndex={index + 1}
                  showAddToCart={true}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
