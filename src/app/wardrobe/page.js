"use client";
import "./wardrobe.css";
import { useEffect, useRef, useState } from "react";

import { getProducts } from "@/lib/shopify";
import Product from "@/components/Product/Product";
import Copy from "@/components/Copy/Copy";

import { gsap } from "gsap";

export default function Wardrobe() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts(20);
      setAllProducts(data);
      setFilteredProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <>
      <section className="products-header">
        <div className="container">
          <Copy animateOnScroll={false} delay={0.65}>
            <h1>Wardrobe Circulation</h1>
          </Copy>
          <div className="products-header-divider"></div>

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
            />
          ))}
        </div>
      </section>
    </>
  );
}
