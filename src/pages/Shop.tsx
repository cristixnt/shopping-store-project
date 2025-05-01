import { useEffect, useState } from "react";
import { useCartStore, Product } from "../store/CartStore";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import { useProductStore } from "../store/ProductStore";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Navigate } from "react-router-dom";

function Shop() {
  const { products, fetchProducts } = useProductStore();
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const addToCart = useCartStore((state) => state.addToCart);

  // ⚠️ Solo llamamos una vez al montar
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    let filtered = [...products];

    const uniqueCategories = Array.from(
      new Set(products.map((p) => p.category))
    );

    setCategories(uniqueCategories);

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  const handleImageClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock > 0) {
      addToCart(product);
      toast.success(`¡${product.name} agregado al carrito!`, {
        onClick: () => {
          <Navigate to="/cart" />;
        },
      });
    } else {
      toast.error(`Lo siento, no hay stock de ${product.name}.`);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Tienda</h1>

      {/* Filtro por categoría */}
      <div className="mb-4">
        <select
          className="form-select"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">All</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro de búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Productos filtrados */}
      <div className="row">
        {filteredProducts.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: "200px", objectFit: "cover" }}
                  onClick={() => handleImageClick(product)}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text fw-bold">${product.price}</p>
                  <p className="text-muted">Stock: {product.stock}</p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn btn-primary mt-auto"
                    disabled={product.stock <= 0}
                  >
                    <FaShoppingCart /> Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {selectedProduct && (
        <Modal size="lg" centered show={true} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-12 text-center mb-3">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  style={{ maxHeight: "400px", objectFit: "cover" }}
                />
              </div>
              <div className="col-md-12">
                <p>
                  <strong>Descripción:</strong> {selectedProduct.description}
                </p>
                <p>
                  <strong>Precio:</strong> ${selectedProduct.price}
                </p>
                <p>
                  <strong>Stock:</strong> {selectedProduct.stock}
                </p>
                <p>
                  <strong>Categoría:</strong> {selectedProduct.category}
                </p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cerrar
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                handleAddToCart(selectedProduct);
                closeModal();
              }}
            >
              <FaShoppingCart /> Agregar al carrito
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Shop;
