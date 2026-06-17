"use client";
import "./ShoppingCart.css";
import { useState, useEffect } from "react";

import { useCartStore, useCartCount, useCartSubtotal } from "@/store/cartStore";

const ShoppingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cartItems = useCartStore((state) => state.cartItems);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const cartCount = useCartCount();
  const subtotal = useCartSubtotal();
  const checkoutUrl = useCartStore((state) => state.checkoutUrl);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="shopping-cart-container">
      <button className="cart-button" onClick={toggleCart}>
        <span className="cart-icon">BAG</span>
        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
      </button>

      <div
        className={`cart-sidebar ${isOpen ? "open" : ""}`}
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
            <button className="cart-close" onClick={toggleCart}>
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
                const imageSrc = item.image || `/products/product_${index + 1}.webp`;
                const quantity = Number(item.quantity) || 1;
                return (
                  <div key={`${item.name}-${index}`} className="cart-item">
                    <div className="cart-item-image">
                      <img
                        src={imageSrc}
                        alt={item.name}
                      />
                    </div>
                    <div className="cart-item-details">
                      <div className="cart-item-name-row">
                        <p className="cart-item-name">{item.name}</p>
                        {quantity > 1 && (
                          <span className="cart-item-quantity">{quantity}</span>
                        )}
                      </div>
                      <p className="cart-item-price">${item.price}</p>
                      <button
                        className="cart-item-remove"
                        onClick={() => removeFromCart(item.name)}
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
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button 
                className="cart-checkout" 
                onClick={() => checkoutUrl && (window.location.href = checkoutUrl)}
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
