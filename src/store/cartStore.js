import { create } from "zustand";
import { persist } from "zustand/middleware";
import { 
  createCart, 
  getCart, 
  addToCart as addShopifyCart, 
  updateCartLines, 
  removeCartLines 
} from "@/lib/shopify";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartId: null,
      checkoutUrl: null,
      cart: null, // The authoritative Shopify cart object
      isCartOpen: false,

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      // Initialize or fetch the cart from Shopify
      initCart: async () => {
        const { cartId } = get();
        if (cartId) {
          const cart = await getCart(cartId);
          if (cart) {
            set({ cart, checkoutUrl: cart.checkoutUrl });
            return;
          }
        }
        // If no cartId or the cart expired/was deleted
        const newCart = await createCart();
        if (newCart) {
          set({ cartId: newCart.id, checkoutUrl: newCart.checkoutUrl, cart: newCart });
        }
      },

      addToCart: async (product) => {
        let { cartId, cart } = get();
        
        if (!cartId) {
          const newCart = await createCart();
          if (newCart) {
            set({ cartId: newCart.id, checkoutUrl: newCart.checkoutUrl, cart: newCart });
            cartId = newCart.id;
          }
        }

        if (cartId && product.variantId) {
          const existingLine = cart?.lines?.edges?.find(
            (edge) => edge.node.merchandise.id === product.variantId
          );

          set({ isCartOpen: true }); 

          if (existingLine) {
            const newQuantity = existingLine.node.quantity + (product.quantity || 1);
            const lines = [{ id: existingLine.node.id, quantity: newQuantity }];
            const response = await updateCartLines(cartId, lines);
            if (response?.userErrors?.length > 0) {
              alert(response.userErrors[0].message);
            }
            if (response?.cart) set({ cart: response.cart, checkoutUrl: response.cart.checkoutUrl });
          } else {
            const lines = [{ merchandiseId: product.variantId, quantity: product.quantity || 1 }];
            const response = await addShopifyCart(cartId, lines);
            if (response?.userErrors?.length > 0) {
              alert(response.userErrors[0].message);
            }
            if (response?.cart) set({ cart: response.cart, checkoutUrl: response.cart.checkoutUrl });
          }
        }
      },

      updateQuantity: async (lineId, quantity) => {
        const { cartId } = get();
        if (!cartId || !lineId) return;

        if (quantity === 0) {
          return get().removeFromCart(lineId);
        }

        const lines = [{ id: lineId, quantity }];
        const response = await updateCartLines(cartId, lines);
        if (response?.userErrors?.length > 0) {
          alert(response.userErrors[0].message);
        }
        if (response?.cart) set({ cart: response.cart, checkoutUrl: response.cart.checkoutUrl });
      },

      removeFromCart: async (lineId) => {
        const { cartId } = get();
        if (!cartId || !lineId) return;

        const response = await removeCartLines(cartId, [lineId]);
        if (response?.userErrors?.length > 0) {
          alert(response.userErrors[0].message);
        }
        if (response?.cart) set({ cart: response.cart, checkoutUrl: response.cart.checkoutUrl });
      },
    }),
    {
      name: "withus-cart-storage",
      partialize: (state) => ({ cartId: state.cartId }), // Only persist the cartId
    }
  )
);

export const useCartCount = () =>
  useCartStore((state) => {
    if (!state.cart?.lines?.edges) return 0;
    return state.cart.lines.edges.reduce((total, edge) => total + edge.node.quantity, 0);
  });

export const useCartSubtotal = () =>
  useCartStore((state) => {
    if (!state.cart?.estimatedCost?.subtotalAmount?.amount) return 0;
    return parseFloat(state.cart.estimatedCost.subtotalAmount.amount);
  });
