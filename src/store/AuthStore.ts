import { create } from "zustand";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "../services/firebase";

type AuthState = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    set({ user: res.user });
  },
  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },
}));

// Escuchar cambios de autenticación y actualizar Zustand
onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user });
});
