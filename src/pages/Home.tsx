import { useEffect, useState } from "react";
import { Product } from "../store/CartStore";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { Spinner } from "react-bootstrap";

function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const items: Product[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Product),
      }));
      setAllProducts(items);
    };

    fetchProducts();
  }, []);

  const destacados = allProducts.slice(0, 4);
  const ofertas = allProducts.filter((p) => p.price < 30).slice(0, 4);
  const populares = allProducts.slice(-4); // Simulado

  const renderSection = (title: string, products: Product[]) => (
    <Carousel className="mb-5">
      <h3 className="mb-3">{title}</h3>
      {products.map((product, index) => (
        <Carousel.Item key={index}>
          <Link
            to={`/product/${product.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img
              className="d-block w-100"
              src={product.image}
              alt={product.name}
              style={{ height: 200, objectFit: "contain" }}
            />
          </Link>
          <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-2">
            <h4>{product.name}</h4>
            <p>${product.price}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Bienvenido a Nuestra Tienda</h1>
      {destacados.length <= 0 ? (
        <div className="d-flex justify-content-center align-items-center w-100 h-100 position-absolute top-0 start-0 bg-light">
          <Spinner animation="border" />
        </div>
      ) : (
        renderSection("Productos Destacados", destacados)
      )}
      {/* {renderSection("Ofertas Especiales", ofertas)} */}
      {ofertas.length <= 0 ? (
        <div className="d-flex justify-content-center align-items-center w-100 h-100 position-absolute top-0 start-0 bg-light">
          <Spinner animation="border" />
        </div>
      ) : (
        renderSection("Ofertas Especiales", ofertas)
      )}
      {/* {renderSection("Más Populares", populares)} */}
      {populares.length <= 0 ? (
        <div className="d-flex justify-content-center align-items-center w-100 h-100 position-absolute top-0 start-0 bg-light">
          <Spinner animation="border" />
        </div>
      ) : (
        renderSection("Más Populares", populares)
      )}
    </div>
  );
}

export default Home;
