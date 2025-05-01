import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";

export type Product = {
  id?: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
};

export type CartItem = Product & {
  quantity: number;
  coupon?: string;
  totalWithCoupon?: number;
};

type CartState = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId?: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) => {
        const cart = get().cart;
        const existingItem = cart.find((item) => item.id === product.id);
        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
      },

      removeFromCart: (productId) => {
        set({
          cart: get().cart.filter((item) => item.id !== productId),
        });
      },

      clearCart: () => {
        set({ cart: [] });
      },

      applyCoupon: (_code, discount) => {
        set({
          cart: get().cart.map((item) => ({
            ...item,
            price: item.price * (1 - discount / 100),
          })),
        });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
