import { useState } from "react";
import { useCartStore, Product } from "../store/CartStore";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";

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

function Shop() {
  const [products] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const addToCart = useCartStore((state) => state.addToCart);

  // Filtrar productos por búsqueda
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  // Filtrar productos por categoría
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category) {
      setFilteredProducts(
        products.filter((product) => product.category === category)
      );
    } else {
      setFilteredProducts(products);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock > 0) {
      addToCart(product);
      toast.success(`¡${product.name} agregado al carrito!`, {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
    } else {
      toast.error(`Lo siento, no hay suficiente stock de ${product.name}.`, {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
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
          <option value="">Todas las categorías</option>
          <option value="Ropa">Ropa</option>
          <option value="Calzado">Calzado</option>
          <option value="Accesorios">Accesorios</option>
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
        {filteredProducts.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img
                src={product.image}
                className="card-img-top"
                alt={product.name}
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
        ))}
      </div>
    </div>
  );
}

export default Shop;
