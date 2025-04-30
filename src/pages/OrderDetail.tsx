import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { Order } from "./MyOrders";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const handleDownloadPDF = async () => {
    const element = document.getElementById("order-detail");
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`pedido-${order?.id}.pdf`);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      const docRef = doc(db, "orders", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setOrder({
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
        } as Order);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [id]);

  if (loading) return <div className="container mt-5">Cargando detalle...</div>;
  if (!order)
    return <div className="container mt-5">Pedido no encontrado.</div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Detalle del Pedido</h2>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={handleDownloadPDF}
        >
          Descargar PDF
        </button>
      </div>
      <div id="order-detail">
        <p>
          <strong>Fecha:</strong> {order.createdAt?.toLocaleString("es-ES")}
        </p>
        <p>
          <strong>Nombre:</strong> {order.name}
        </p>
        <p>
          <strong>Correo:</strong> {order.userEmail}
        </p>
        <p>
          <strong>Teléfono:</strong> {order.phone}
        </p>
        <p>
          <strong>Dirección:</strong> {order.address}
        </p>
        <p>
          <strong>Total:</strong> ${order.total.toFixed(2)}
        </p>

        <h4 className="mt-4">Productos</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br />
      <Link to="/orders" className="btn btn-secondary me-2">
        Ver mis pedidos
      </Link>
    </div>
  );
}

export default OrderDetail;
