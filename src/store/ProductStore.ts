import { create } from "zustand";
import { Product } from "./CartStore"; // ya tienes definido Product ahí
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";

interface ProductState {
  products: Product[];
  fetchProducts: () => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateProduct: (id: string, updatedProduct: Product) => Promise<void>;
  addProduct: (newProduct: Product) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  fetchProducts: async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const fetched = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        price: data.price,
        description: data.description,
        image: data.image,
        category: data.category,
        stock: data.stock,
      } as Product;
    });

    set({ products: fetched });
  },

  addProduct: async (newProduct: Product) => {
    const docRef = await addDoc(collection(db, "products"), newProduct);
    set((state) => ({
      products: [...state.products, { ...newProduct, id: docRef.id }],
    }));
  },

  deleteProduct: async (id: string) => {
    await deleteDoc(doc(db, "products", id));
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
  },

  updateProduct: async (id: string, updatedProduct: Product) => {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, updatedProduct);
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
    }));
  },
}));
