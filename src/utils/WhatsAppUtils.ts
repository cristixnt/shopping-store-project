import { Order } from "../pages/MyOrders";

export function sendWhatsApp(order: Order) {
  const itemsText = order.items
    ?.map(
      (item) => `• ${item.name} x${item.quantity} - $${item.price.toFixed(2)}`
    )
    .join("\n");

  const message = `
🛒 *Nuevo pedido recibido*:
📧 Email: ${order.userEmail}
📞 Teléfono: ${order.phone}
📍 Dirección: ${order.address}
💵 Total: $${order.total.toFixed(2)}

📦 Productos:
${itemsText}
`;

  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = "573005365613"; // cambia por tu número de WhatsApp con código de país

  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
}
