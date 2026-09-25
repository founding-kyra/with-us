"use client";
import "./ShoppingCart.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

import { useCartStore, useCartCount, useCartSubtotal } from "@/store/cartStore";

const ShoppingCart = () => {
  const pathname = usePathname();
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const storeToggleCart = useCartStore((state) => state.toggleCart);
  const storeCloseCart = useCartStore((state) => state.closeCart);

  const toggleCart = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => storeToggleCart());
    } else {
      storeToggleCart();
    }
  };

  const closeCart = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => storeCloseCart());
    } else {
      storeCloseCart();
    }
  };
  const cart = useCartStore((state) => state.cart);
  const cartItems = cart?.lines?.edges || [];
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const cartCount = useCartCount();
  const subtotal = useCartSubtotal();
  const checkoutUrl = useCartStore((state) => state.checkoutUrl);
  const initCart = useCartStore((state) => state.initCart);

  useEffect(() => {
    initCart();
  }, [initCart]);

  const dragRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const startTouchRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  // Store handlers as refs so we can remove them correctly
  const touchStartHandlerRef = useRef(null);
  const touchMoveHandlerRef = useRef(null);
  const touchEndHandlerRef = useRef(null);

  const setupDragRef = useCallback((element) => {
    // Cleanup old listeners
    if (dragRef.current) {
      if (touchStartHandlerRef.current) dragRef.current.removeEventListener('touchstart', touchStartHandlerRef.current);
      if (touchMoveHandlerRef.current) dragRef.current.removeEventListener('touchmove', touchMoveHandlerRef.current);
      if (touchEndHandlerRef.current) dragRef.current.removeEventListener('touchend', touchEndHandlerRef.current);
    }

    dragRef.current = element;

    if (element) {
      touchStartHandlerRef.current = (e) => {
        const touch = e.touches[0];
        isDraggingRef.current = false;
        startTouchRef.current = { x: touch.clientX, y: touch.clientY };
        startPosRef.current = { x: positionRef.current.x, y: positionRef.current.y };
      };

      touchMoveHandlerRef.current = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const touch = e.touches[0];
        const dx = touch.clientX - startTouchRef.current.x;
        const dy = touch.clientY - startTouchRef.current.y;

        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          isDraggingRef.current = true;
        }

        const newX = startPosRef.current.x + dx;
        const newY = startPosRef.current.y + dy;
        positionRef.current = { x: newX, y: newY };

        if (dragRef.current) {
          dragRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
        }
      };

      touchEndHandlerRef.current = (e) => {
        if (!isDraggingRef.current) {
          toggleCart();
        }
        isDraggingRef.current = false;
      };

      element.addEventListener('touchstart', touchStartHandlerRef.current, { passive: true });
      element.addEventListener('touchmove', touchMoveHandlerRef.current, { passive: false });
      element.addEventListener('touchend', touchEndHandlerRef.current, { passive: true });
    }
  }, []);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  return (
    <div className="shopping-cart-container">
      {pathname !== "/lookbook2" && pathname !== "/lookbook" && pathname !== "/lookbook3" && cartCount > 0 && !isCartOpen && (
        <div 
          className="cart-button-wrapper" 
          ref={setupDragRef}
          style={{ transform: `translate(${positionRef.current.x}px, ${positionRef.current.y}px)` }}
        >
          <button className="cart-button">
            <span className="cart-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </span>
            <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      )}

      <div
        className={`cart-sidebar ${isCartOpen ? "open" : ""}`}
        onWheel={(e) => {
          const target = e.currentTarget;
          const cartItems = target.querySelector(".cart-items");
          if (cartItems) {
            const { scrollTop, scrollHeight, clientHeight } = cartItems;
            const isAtTop = scrollTop === 0;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

            if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
              e.stopPropagation();
            }
          }
        }}
      >
        <div className="cart-sidebar-content">
          <div className="cart-header">
            <h2>Bag</h2>
            <button className="cart-close" onClick={closeCart}>
              Close
            </button>
          </div>
          <div
            className="cart-items"
            onWheel={(e) => {
              e.stopPropagation();
            }}
            onTouchMove={(e) => {
              e.stopPropagation();
            }}
          >
            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <p>Your bag is empty</p>
              </div>
            ) : (
              cartItems.map((item, index) => {
                const node = item.node;
                const variant = node.merchandise;
                const product = variant.product;
                const imageSrc = product.images?.edges?.[0]?.node?.url || `/products/product_${index + 1}.webp`;
                const quantity = node.quantity || 1;
                
                return (
                  <div key={node.id} className="cart-item">
                    <div className="cart-item-image">
                      <img
                        src={imageSrc}
                        alt={product.title}
                      />
                    </div>
                    <div className="cart-item-details">
                      <div className="cart-item-name-row">
                        <p className="cart-item-name">{product.title}</p>
                        {quantity > 1 && (
                          <span className="cart-item-quantity">{quantity}</span>
                        )}
                      </div>
                      <p className="cart-item-name" style={{opacity: 0.6, fontSize: '0.8rem', marginTop: '-4px', marginBottom: '4px'}}>{variant.title}</p>
                      
                      <p className="cart-item-price">${Number(variant.price.amount).toFixed(2).replace(/\.00$/, '')}</p>
                      <button
                        className="cart-item-remove"
                        onClick={() => removeFromCart(node.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="cart-footer">
              <div className="cart-summary-row">
                <span>Total</span>
                <span>${subtotal.toFixed(2).replace(/\.00$/, '')}</span>
              </div>
              <button 
                className="cart-checkout" 
                onClick={() => {
                  if (checkoutUrl) {
                    const url = new URL(checkoutUrl);
                    url.searchParams.set('return_to', window.location.origin);
                    window.location.href = url.toString();
                  }
                }}
                disabled={!checkoutUrl}
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
