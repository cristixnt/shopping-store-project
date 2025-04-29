// src/pages/Checkout.tsx

import { useCartStore } from "../store/CartStore";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Checkout = () => {
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleOrder = () => {
    if (!name || !phone || !address) {
      alert("Por favor completa todos los campos");
      return;
    }

    // Aquí simularíamos enviar el pedido a Firestore o WhatsApp
    console.log("Orden enviada:", { name, phone, address, cart });

    clearCart();
    navigate("/thanks");
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5">
        <h2>No tienes productos en el carrito</h2>
        <Link to="/shop" className="btn btn-primary mt-3">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2>Finalizar Compra</h2>

      <form className="row g-3 mt-4">
        <div className="col-md-6">
          <label htmlFor="name" className="form-label">
            Nombre Completo
          </label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="phone" className="form-label">
            Teléfono
          </label>
          <input
            type="text"
            id="phone"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="col-12">
          <label htmlFor="address" className="form-label">
            Dirección de Entrega
          </label>
          <textarea
            id="address"
            className="form-control"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="col-12 d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-success"
            onClick={handleOrder}
          >
            Confirmar Pedido
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
