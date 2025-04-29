//import { useEffect, useState } from "react";
import "./App.css";
// import Login from "./components/Login";
// import EmailAuth from "./components/EmailAuth";
// import { auth, db } from "./services/firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { UserProvider } from "./contexts/UserContext";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./utils/ProtectedRoute";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./components/ProductDetail";
import Checkout from "./pages/Checkout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  // const [user, setUser] = useState<any>(null);
  // const [nombreUsuario, setNombreUsuario] = useState("");

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     setUser(user);
  //     if (user != null) {
  //       const docRef = doc(db, "usuarios", user.uid);
  //       const docSnap = await getDoc(docRef);

  //       if (docSnap.exists()) {
  //         const userData = docSnap.data();
  //         console.log("Nombre del usuario:", userData.nombre);
  //         setNombreUsuario(userData.nombre + " " + userData.apellido);
  //       } else {
  //         console.log("No existe documento del usuario en Firestore");
  //       }
  //     }
  //   });
  //   return () => unsubscribe();
  // }, []);

  return (
    // <UserProvider>
    //   <div>
    //     <h1>Shopping Store</h1>
    //     {user ? (
    //       <div>
    //         <p>Bienvenido, {nombreUsuario}</p>
    //         <button onClick={() => signOut(auth)}>Cerrar sesión</button>
    //       </div>
    //     ) : (
    //       <div>
    //         {/* <Login />
    //       <hr /> */}
    //         <EmailAuth />
    //       </div>
    //     )}
    //   </div>
    // </UserProvider>

    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route
          path="/cart"
          element={
            // <ProtectedRoute>
            <Cart />
            // </ProtectedRoute>
          }
        />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminRequired>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
