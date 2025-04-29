export function generateWhatsAppLink(productName: string): string {
  const phone = "TU_NUMERO_DE_WHATSAPP"; // Ej: 5491123456789
  const message = `Hola! Estoy interesado en el producto: ${productName}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
