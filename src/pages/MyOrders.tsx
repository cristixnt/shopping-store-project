// src/pages/MyOrders.tsx
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  FieldValue,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuthStore } from "../store/AuthStore";
import { Link } from "react-router-dom";

export interface Order {
  id?: string;
  userId: string;
  userEmail: string | null;
  createdAt: Date | Timestamp | FieldValue;
  name: string;
  phone: string;
  address: string;
  total: number;
  items: OrderItem[] | null;
  coupon: string | null;
  totalWithCoupon: number;
}

export interface OrderItem {
  productId?: string;
  name: string;
  price: number;
  quantity: number;
}

function MyOrders() {
  const { user } = useAuthStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const fetchedOrders = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
        } as Order;
      });
      setOrders(fetchedOrders);
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  if (loading) return <div className="container mt-5">Cargando pedidos...</div>;

  return (
    <div className="container mt-5">
      <h2>Mis Pedidos</h2>
      {orders.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        <table className="table mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Fecha</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={order.id}>
                <td>{i + 1}</td>
                <td>
                  {" "}
                  {order.createdAt instanceof Date
                    ? order.createdAt.toLocaleString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        // hour: "2-digit",
                        // minute: "2-digit",
                      })
                    : ""}
                </td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <Link
                    to={`/orders/${order.id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Ver Detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyOrders;
