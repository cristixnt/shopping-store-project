import { create } from "zustand";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";

type CouponState = {
  discount: number;
  couponCode: string | null;
  couponApplied: boolean;
  setCoupon: (code: string, discount: number, applied: boolean) => void;
  resetCoupon: () => void;
};

export const useCouponStore = create<CouponState>((set) => ({
  discount: 0,
  couponCode: null,
  couponApplied: false,
  setCoupon: (code, discount, applied) =>
    set({ couponCode: code, discount, couponApplied: applied }),
  resetCoupon: () =>
    set({ couponCode: null, discount: 0, couponApplied: false }),
}));

export const validateCoupon = async (code: string) => {
  const couponsRef = collection(db, "coupons");
  const q = query(
    couponsRef,
    where("code", "==", code.trim().toUpperCase()),
    where("active", "==", true)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    const coupon = doc.data();

    // Validar expiración
    const now = new Date();
    const expiresAt: Timestamp = coupon.expiresAt;

    if (expiresAt && expiresAt.toDate() < now) {
      return { isValid: false }; // Expirado
    }

    return {
      isValid: true,
      code: coupon.code,
      discount: coupon.discount,
    };
  }

  return { isValid: false };
};
