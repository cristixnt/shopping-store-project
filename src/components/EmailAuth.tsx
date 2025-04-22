import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useUser } from "../context/UserContext";

const EmailAuth = () => {
    const { userName } = useUser(); // Acceder al nombre del usuario desde el contexto
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!isRegistering) {
                await signInWithEmailAndPassword(auth, email, password);
                console.log("Usuario logueado");
            }
        } catch (error) {
            console.error("Error en la autenticación:", error);
        }
    };

    return (
        <div>
            <h2>{isRegistering ? "Registrarse" : "Iniciar sesión"}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />
                <button type="submit">
                    {isRegistering ? "Registrarse" : "Iniciar sesión"}
                </button>
            </form>
            {userName && <h3>¡Hola, {userName}!</h3>} {/* Mostrar nombre del usuario */}
            <button onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering
                    ? "¿Ya tienes cuenta? Inicia sesión"
                    : "¿No tienes cuenta? Regístrate"}
            </button>
        </div>
    );
};

export default EmailAuth;
