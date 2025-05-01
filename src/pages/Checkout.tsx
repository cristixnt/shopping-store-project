import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { useCartStore } from "../store/CartStore";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import { toast } from "react-toastify";
import { sendWhatsApp } from "../utils/WhatsAppUtils";
import { Order, OrderItem } from "./MyOrders";
import { useCouponStore } from "../store/CouponStore";

const Checkout = () => {
  const { user } = useAuthStore();
  const { cart, clearCart } = useCartStore();
  const { discount, resetCoupon, couponCode } = useCouponStore();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleConfirmOrder = async () => {
    if (!user) return;

    const items = cart.map((item) => {
      const order_item: OrderItem = {
        productId: item.id?.toString(),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      };
      return order_item;
    });

    const order: Order = {
      userId: user.uid,
      userEmail: user.email,
      createdAt: serverTimestamp(),
      name,
      phone,
      address,
      total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
      items,
      coupon: couponCode,
      totalWithCoupon:
        cart.reduce((acc, item) => acc + item.price * item.quantity, 0) -
        cart.reduce((acc, item) => acc + item.price * item.quantity, 0) *
          (discount / 100),
    };

    try {
      const orderRef = await addDoc(collection(db, "orders"), order);
      sendWhatsApp({ ...order, id: orderRef.id }); // Enviar pedido a WhatsApp
      toast.success("Pedido confirmado con éxito");
      clearCart();
      resetCoupon(); // Reiniciar el cupón
      navigate("/orders"); // Redirigir a la página de pedidos
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      toast.error(`Error al guardar la orden: ${errorMessage}`);
    }
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
            onClick={handleConfirmOrder}
          >
            Confirmar Pedido
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
