import { create } from "zustand";
import { createCart, addToCart as addShopifyCart } from "@/lib/shopify";

export const useCartStore = create((set, get) => ({
  cartId: null,
  checkoutUrl: null,
  cartItems: [],
  isCartOpen: false,

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  addToCart: async (product) => {
    let { cartId } = get();
    
    // Create cart if none exists
    if (!cartId) {
      const newCart = await createCart();
      if (newCart) {
        set({ cartId: newCart.id, checkoutUrl: newCart.checkoutUrl });
        cartId = newCart.id;
      }
    }

    // Optimistically update local cart UI
    set((state) => {
      const existingItem = state.cartItems.find(
        (item) => item.variantId === product.variantId || item.name === product.name
      );
      if (existingItem) {
        const updatedItems = state.cartItems.map((item) => {
          if (item.variantId === product.variantId || item.name === product.name) {
            const currentQuantity = Number(item.quantity) || 1;
            return { ...item, quantity: currentQuantity + 1 };
          }
          return item;
        });
        return { cartItems: updatedItems, isCartOpen: true };
      }

      const newItem = { ...product, quantity: 1 };
      return { cartItems: [...state.cartItems, newItem], isCartOpen: true };
    });

    // Add to Shopify cart if variant ID is present
    if (cartId && product.variantId) {
      const lines = [{ merchandiseId: product.variantId, quantity: 1 }];
      const updatedCart = await addShopifyCart(cartId, lines);
      if (updatedCart) {
        set({ checkoutUrl: updatedCart.checkoutUrl });
      }
    }
  },

  removeFromCart: (productName) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.name !== productName),
    }));
  },
}));

export const useCartCount = () =>
  useCartStore((state) =>
    state.cartItems.reduce((total, item) => total + (item.quantity || 1), 0)
  );

export const useCartSubtotal = () =>
  useCartStore((state) =>
    state.cartItems.reduce(
      (total, item) => total + parseFloat(item.price || 0) * (item.quantity || 1),
      0
    )
  );
