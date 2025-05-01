import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase"; // Asegúrate de tener db importado para Firestore
import { doc, setDoc } from "firebase/firestore"; // Para guardar en Firestore
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Crear usuario con email y password en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Almacenar información del usuario en Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
        role: "user", // Puedes modificar el rol más tarde
      });

      navigate("/"); // Redirige a la página principal o a la que desees
    } catch {
      setError("Error al registrarse. Intenta con otro correo.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="col-md-12">
          <h2 className="mb-4 text-center">Registrarse</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Ingresa tu correo"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Crea una contraseña"
              />
            </div>
            {error && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {error}
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100 mt-3">
              Registrarse
            </button>
          </form>
          <div className="mt-3 text-center">
            <p>
              ¿Ya tienes cuenta?{" "}
              <a href="/login" className="text-decoration-none">
                Iniciar sesión
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
