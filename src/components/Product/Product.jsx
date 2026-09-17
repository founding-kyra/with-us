"use client";
import "./Product.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  const handleImageClick = () => {
    if (pathname.includes("/products/")) {
      window.dispatchEvent(new CustomEvent("scrollToTop"));
    }
  };

  const title = product.title || product.name || "WITHUS PIECE";
  const rawPrice = product.priceRange?.minVariantPrice?.amount || product.price || "100.0";
  const price = Number(rawPrice).toFixed(2);
  const rawImage = product.images?.edges?.[0]?.node?.url || (product.image ? (product.image.startsWith('/') ? product.image : `/products/${product.image}`) : "/product/product_shot_01.webp");
  const imageUrl = rawImage;
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
      ref={innerRef}
      style={style}
      data-image={imageUrl}
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
      </Link>

      {/* Card Info Overlay */}
      <div className="product-info">
        <div className="product-info-wrapper">
          <div className="product-text">
            <p className="product-name">{title}</p>
            <p className="product-color">BLACK</p>
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
