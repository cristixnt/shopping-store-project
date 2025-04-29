import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          E-commerce
        </Link>
        <div className="d-flex gap-3">
          <Link className="nav-link" to="/">
            Inicio
          </Link>
          <Link className="nav-link" to="/shop">
            Tienda
          </Link>
          <Link className="nav-link" to="/cart">
            Carrito
          </Link>

          {user ? (
            <>
              <button
                onClick={handleLogout}
                className="btn btn-outline-danger btn-sm"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">
                Login
              </Link>
              <Link className="nav-link" to="/register">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
