import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product, useCartStore } from "../store/CartStore";
import { toast } from "react-toastify";
import { FaShoppingCart } from "react-icons/fa";
import { useProductStore } from "../store/ProductStore";

function ProductDetail() {
  const { id } = useParams(); // useParams sin tipos explícitos
  const [product, setProduct] = useState<Product | null>(null);

  const addToCart = useCartStore((state) => state.addToCart);
  const { products, fetchProducts } = useProductStore();

  // Cargar productos solo si están vacíos
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  // Buscar el producto una vez que se tienen los productos
  useEffect(() => {
    if (id && products.length > 0) {
      const found = products.find((p) => p.id === id);
      if (found) {
        setProduct(found);
      } else {
        toast.error("Producto no encontrado");
      }
    }
  }, [id, products]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock > 0) {
      addToCart(product);
      toast.success(`¡${product.name} agregado al carrito!`);
    } else {
      toast.error(`Lo siento, no hay stock de ${product.name}.`);
    }
  };

  if (!product) {
    return <div className="container mt-5">Cargando producto...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <h4 className="text-primary">${product.price}</h4>
          <p className="text-muted">Stock: {product.stock}</p>
          <p className="text-muted">Categoría: {product.category}</p>
          <button
            className="btn btn-success"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <FaShoppingCart /> Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
