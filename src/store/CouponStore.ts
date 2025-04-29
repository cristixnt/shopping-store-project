import firebase from "firebase/compat/app";
import { create } from "zustand";

interface CouponState {
  couponId: string | null; // ID del cupón
  discount: number; // Descuento en porcentaje
  isValid: boolean; // Estado si el cupón es válido
  setCoupon: (couponId: string, discount: number, isValid: boolean) => void; // Función para actualizar el cupón
  resetCoupon: () => void; // Función para resetear el estado del cupón
}

export const useCouponStore = create<CouponState>((set) => ({
  couponId: null,
  discount: 0,
  isValid: false,
  setCoupon: (couponId, discount, isValid) =>
    set({ couponId, discount, isValid }),
  resetCoupon: () => set({ couponId: null, discount: 0, isValid: false }),
}));

export const validateCoupon = async (couponCode: string) => {
  const couponRef = firebase.firestore().collection("coupons");
  const snapshot = await couponRef.where("code", "==", couponCode).get();

  if (!snapshot.empty) {
    const couponData = snapshot.docs[0].data();
    return { discount: couponData.discount, isValid: true };
  }

  return { discount: 0, isValid: false };
};
