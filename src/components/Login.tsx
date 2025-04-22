import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const Login = () => {
    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("Usuario logueado:", user.displayName);
        } catch (error) {
            console.error("Error de login:", error);
        }
    };

    return <button onClick={handleLogin}>Iniciar sesión con Google</button>;
};

export default Login;