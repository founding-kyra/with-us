"use client";
import "./Product.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";

import { useCartStore } from "@/store/cartStore";

const Product = ({
  product,
  productIndex = 1,
  showAddToCart = true,
  className = "",
  innerRef,
  style,
}) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const pathname = usePathname();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const handleImageClick = () => {
    if (pathname.includes("/products/")) {
      window.dispatchEvent(new CustomEvent("scrollToTop"));
    }
  };

  const title = product.title || product.name || "WITHUS PIECE";
  const rawPrice = product.priceRange?.minVariantPrice?.amount || product.price || "100.0";
  const price = Number(rawPrice).toFixed(2).replace(/\.00$/, '');
  const rawImage = product.images?.edges?.[0]?.node?.url || (product.image ? (product.image.startsWith('/') ? product.image : `/products/${product.image}`) : "/product/product_shot_01.webp");
  
  let imageUrl = rawImage;
  if (imageUrl.includes('cdn.shopify.com') && !imageUrl.includes('width=')) {
    imageUrl += (imageUrl.includes('?') ? '&' : '?') + 'width=800';
  }
  
  const variantId = product.variants?.edges?.[0]?.node?.id;
  const handle = product.handle || "unit";
  const href = product.handle ? `/products/${handle}` : "/wardrobe";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      ...product,
      name: title,
      price,
      image: imageUrl,
      variantId
    });
  };

  const formattedIndex = String(productIndex).padStart(2, "0");

  return (
    <div
      className={`product ${className}`}
      ref={(el) => {
        cardRef.current = el;
        if (typeof innerRef === 'function') innerRef(el);
        else if (innerRef) innerRef.current = el;
      }}
      style={style}
      data-image={imageUrl}
      onMouseMove={handleMouseMove}
    >
      <div className="product-card-bg"></div>

      {/* Top Header Badge */}
      <div className="product-header-badge">
        <span className="product-number">{formattedIndex}</span>
        <span className="product-number-line"></span>
      </div>

      {/* Image Link */}
      <Link href={href} className="product-img" onClick={handleImageClick}>
        <img src={imageUrl} alt={title} />
        
        {/* Neon Reticle */}
        <div className="product-reticle" style={{ left: mousePos.x, top: mousePos.y }}>
          <div className="reticle-bracket top-left"></div>
          <div className="reticle-bracket top-right"></div>
          <div className="reticle-bracket bottom-left"></div>
          <div className="reticle-bracket bottom-right"></div>
          <div className="reticle-banner">{title}</div>
        </div>
      </Link>

      {/* Card Info Overlay */}
      <div className="product-info">
        <div className="product-info-wrapper">
          <div className="product-text">
            <p className="product-name">{title}</p>
            <p className="product-card-color">BLACK</p>
            <p className="product-price">${price}</p>
          </div>
          <Link href={href} className="product-action-link" aria-label="View product">
            <span className="product-arrow">— ↗</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;
