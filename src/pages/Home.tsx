import { useEffect, useState } from "react";
import { Product } from "../store/CartStore";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { Spinner } from "react-bootstrap";

function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const items: Product[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Product),
      }));
      setAllProducts(items);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const destacados = allProducts.slice(0, 4);
  const ofertas = allProducts.filter((p) => p.price < 30).slice(0, 4);
  const populares = allProducts.slice(-4); // Simulado

  const renderSection = (title: string, products: Product[]) => (
    <div className="mb-5">
      <h3 className="mb-3">{title}</h3>
      <Carousel interval={5000}>
        {products.map((product, index) => (
          <Carousel.Item key={index} className="text-center">
            <Link
              to={`/product/${product.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                className="d-flex justify-content-center align-items-center"
                style={{
                  height: "300px",
                  background: "#f8f9fa",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </Link>
            <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-2 mt-3">
              <h5>{product.name}</h5>
              <p>${product.price}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Bienvenido a Nuestra Tienda</h1>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {renderSection("Productos Destacados", destacados)}
          {renderSection("Ofertas Especiales", ofertas)}
          {renderSection("Más Populares", populares)}
        </>
      )}
    </div>
  );
}

export default Home;
