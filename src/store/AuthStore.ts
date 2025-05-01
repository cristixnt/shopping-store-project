// src/store/AuthStore.ts
import { create } from "zustand";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

type AuthState = {
  user: User | null;
  role: string | null; // Nuevo estado para el rol
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

// Función para obtener el rol del usuario desde Firestore
const fetchUserRole = async (uid: string): Promise<string> => {
  const docRef = doc(db, "users", uid); // Suponemos que en "users" tienes los roles
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data().role || "user" : "user";
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null, // Iniciamos con el rol en null
  login: async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const role = await fetchUserRole(res.user.uid); // Recuperamos el rol
    set({
      user: res.user,
      role: role, // Guardamos el rol en el estado
    });
  },
  logout: async () => {
    await signOut(auth);
    set({ user: null, role: null }); // Limpiamos el estado cuando el usuario cierre sesión
  },
}));

// Escuchar cambios de autenticación y actualizar Zustand
onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    const role = await fetchUserRole(firebaseUser.uid);
    useAuthStore.setState({
      user: firebaseUser,
      role: role, // Establecemos el rol cuando el estado cambia
    });
  } else {
    useAuthStore.setState({ user: null, role: null }); // Limpiamos el estado
  }
});
