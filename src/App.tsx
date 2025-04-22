
import React, { useEffect, useState } from "react";
import "./App.css";
// import Login from "./components/Login";
import EmailAuth from "./components/EmailAuth";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { UserProvider } from "./context/UserContext";

function App() {
  const [user, setUser] = useState<any>(null);
  const [nombreUsuario, setNombreUsuario] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user != null) {

        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          console.log("Nombre del usuario:", userData.nombre);
          setNombreUsuario(userData.nombre + " " + userData.apellido);
        } else {
          console.log("No existe documento del usuario en Firestore");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserProvider>
      <div>
        <h1>Shopping Store</h1>
        {user ? (
          <div>
            <p>Bienvenido, {nombreUsuario}</p>
            <button onClick={() => signOut(auth)}>Cerrar sesión</button>
          </div>
        ) : (
          <div>
            {/* <Login />
          <hr /> */}
            <EmailAuth />
          </div>
        )}
      </div>
    </UserProvider>
  );
}

export default App;
