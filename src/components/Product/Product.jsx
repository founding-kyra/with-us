"use client";
import "./Product.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCartStore } from "@/store/cartStore";

const Product = ({
  product,
  productIndex,
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

  const title = product.title || product.name;
  const price = product.priceRange?.minVariantPrice?.amount || product.price;
  const imageUrl = product.images?.edges?.[0]?.node?.url || (product.image ? `/products/${product.image}` : null);
  const variantId = product.variants?.edges?.[0]?.node?.id;
  const handle = product.handle || "unit";
  const href = product.handle ? `/products/${handle}` : "/unit";

  const handleAddToCart = () => {
    addToCart({
      ...product,
      name: title,
      price,
      image: imageUrl,
      variantId
    });
  };

  return (
    <div
      className={`product ${className}`}
      ref={innerRef}
      style={style}
      data-image={imageUrl}
    >
      <Link href={href} className="product-img" onClick={handleImageClick}>
        <img src={imageUrl} alt={title} />
      </Link>
      <div className="product-info">
        <div className="product-info-wrapper">
          <p>{title}</p>
          <p>${price}</p>
        </div>
        {showAddToCart && (
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default Product;
