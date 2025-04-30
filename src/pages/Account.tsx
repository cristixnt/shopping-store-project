import { useAuthStore } from "../store/AuthStore";

function Account() {
  const { user } = useAuthStore();

  return (
    <div className="container mt-5">
      <h2>Mi cuenta</h2>
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Información del usuario</h5>
          <p className="card-text">
            <strong>Correo electrónico:</strong> {user?.email}
          </p>
          {/* Aquí puedes agregar más datos del usuario si los tienes */}
        </div>
      </div>
    </div>
  );
}

export default Account;
