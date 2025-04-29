import { useParams, useNavigate } from "react-router-dom";
import { useCartStore, Product } from "../store/CartStore";
import { FaShoppingCart } from "react-icons/fa";

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Camiseta",
    price: 20,
    description: "Camiseta de algodón",
    image: "/img/camiseta.jpg",
    category: "Ropa",
    stock: 10,
  },
  {
    id: 2,
    name: "Zapatillas",
    price: 50,
    description: "Zapatillas deportivas",
    image: "/img/zapatillas.jpg",
    category: "Calzado",
    stock: 5,
  },
  {
    id: 3,
    name: "Gorra",
    price: 15,
    description: "Gorra de béisbol",
    image: "/img/gorra.jpg",
    category: "Accesorios",
    stock: 8,
  },
  // Otros productos...
];

function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const product = productId
    ? mockProducts.find((p) => p.id === parseInt(productId))
    : undefined;
  const addToCart = useCartStore((state) => state.addToCart);

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product);
      navigate("/cart"); // Redirigir al carrito después de agregar el producto
    } else {
      alert("No hay suficiente stock");
    }
  };

  return (
    <div className="container mt-5">
      <h1>{product.name}</h1>

      <div className="row">
        <div className="col-md-6">
          <img src={product.image} alt={product.name} className="img-fluid" />
        </div>
        <div className="col-md-6">
          <p>{product.description}</p>
          <p className="fw-bold">${product.price}</p>
          <p className="text-muted">Stock: {product.stock}</p>
          <button onClick={handleAddToCart} className="btn btn-primary">
            <FaShoppingCart /> Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
