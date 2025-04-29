// src/pages/Cart.tsx

import { useCartStore, CartItem } from "../store/CartStore";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { useCouponStore, validateCoupon } from "../store/CouponStore";
import { toast } from "react-toastify";

const Cart = () => {
  const { cart, removeFromCart, clearCart, addToCart } = useCartStore();
  const { discount, setCoupon, resetCoupon } = useCouponStore();
  const [coupon, setCouponInput] = useState<string>(""); // Para el campo de cupón

  const [view, setView] = useState<"grid" | "list">("grid"); // 'grid' para tarjetas, 'list' para tabla

  // Incrementar cantidad
  const increaseQuantity = (product: CartItem) => {
    addToCart(product);
  };

  // Reducir cantidad
  const decreaseQuantity = (productId: number) => {
    const product = cart.find((item) => item.id === productId);
    if (!product) return;

    if (product.quantity > 1) {
      useCartStore.setState((state) => ({
        cart: state.cart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      }));
    } else {
      handleRemoveItem(productId);
    }
  };

  const handleRemoveItem = (productId: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este producto?"
    );
    if (confirmDelete) {
      removeFromCart(productId);
    }
  };

  // Calcular el precio total
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponInput(e.target.value);
  };

  // Función para aplicar el cupón y actualizar el estado
  const applyCoupon = async () => {
    const result = await validateCoupon(coupon);
    if (result.isValid) {
      setCoupon(coupon, result.discount, true);
      toast.success(
        `Cupón "${coupon}" aplicado con ${result.discount}% de descuento`,
        {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
        }
      );
    } else {
      resetCoupon();
      toast.error("Cupón inválido. Intenta nuevamente.", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
    }
  };

  const totalWithDiscount = totalPrice - totalPrice * (discount / 100);

  // Si el carrito está vacío
  if (cart.length === 0) {
    return (
      <div className="container py-5">
        <h2>Tu carrito está vacío</h2>
        <Link to="/shop" className="btn btn-primary mt-3">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Carrito de Compras</h2>

      {/* ButtonGroup para cambiar entre vistas */}
      <ButtonGroup className="mb-4">
        <ToggleButton
          id="grid-view"
          type="radio"
          variant="outline-primary"
          value="grid"
          checked={view === "grid"}
          onChange={() => setView("grid")}
        >
          Vista de Tarjetas
        </ToggleButton>
        <ToggleButton
          id="list-view"
          type="radio"
          variant="outline-primary"
          value="list"
          checked={view === "list"}
          onChange={() => setView("list")}
        >
          Vista de Tabla
        </ToggleButton>
      </ButtonGroup>

      {/* Vista de Tarjetas */}
      {view === "grid" && (
        <div className="row">
          {cart.map((item) => (
            <div className="col-md-4 mb-4" key={item.id}>
              <div className="card shadow-sm">
                <img
                  src={item.image}
                  alt={item.name}
                  className="card-img-top"
                  style={{ objectFit: "cover", height: "200px" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">Precio: ${item.price.toFixed(2)}</p>

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-outline-secondary btn-sm me-2"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm ms-2"
                        onClick={() => increaseQuantity(item)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista de Tabla */}
      {view === "list" && (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                        className="me-3 rounded"
                      />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary ms-2"
                        onClick={() => increaseQuantity(item)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="d-flex flex-column align-items-end mt-4">
        <div className="input-group mb-3" style={{ maxWidth: "300px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Código de descuento"
            value={coupon}
            onChange={handleCouponChange}
          />
          <button className="btn btn-outline-secondary" onClick={applyCoupon}>
            Aplicar cupón
          </button>
        </div>

        {discount > 0 && (
          <p className="text-success">Descuento aplicado: {discount}%</p>
        )}

        <h4>Total: ${totalWithDiscount.toFixed(2)}</h4>
      </div>

      {/* Mostrar total y botones de acción */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h4>Total: ${totalPrice.toFixed(2)}</h4>

        <div>
          <button className="btn btn-outline-danger me-2" onClick={clearCart}>
            Vaciar carrito
          </button>
          <Link to="/shop" className="btn btn-secondary me-2">
            Seguir comprando
          </Link>
          <Link to="/checkout" className="btn btn-success">
            Proceder a pagar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
