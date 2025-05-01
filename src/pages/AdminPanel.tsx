import { useEffect, useState } from "react";
import { useAuthStore } from "../store/AuthStore";
// import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import { Product } from "../store/CartStore";
import { useProductStore } from "../store/ProductStore";

function AdminPanel() {
  const { user, role } = useAuthStore();
  const { products, addProduct, updateProduct, deleteProduct } =
    useProductStore();
  // const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const isAdmin = role === "admin"; // cambia esto a tu admin real

  const fetchFromAPI = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      const data = await res.json();

      for (const item of data) {
        const product: Product = {
          name: item.title,
          price: item.price,
          description: item.description,
          image: item.image,
          category: item.category,
          stock: Math.floor(Math.random() * 20) + 1,
        };

        addProduct(product);
      }

      toast.success("Productos cargados en Firestore");
      
    } catch (err) {
      console.error(err);
      toast.error("Error cargando productos");
    } finally {
      setLoading(false);
    }
  };
  

  const handleDelete = async (id: string) => {
    deleteProduct(id);
    toast.info("Producto eliminado");
    
  };

  const handleUpdate = async (product: Product) => {
    if (!product.id) return;
    const newPrice = prompt("Nuevo precio", product.price.toString());
    if (newPrice) {
      updateProduct(product.id, { ...product, price: parseFloat(newPrice) });
      toast.success("Producto actualizado");
      
    }
  };

  useEffect(() => {
    
  }, []);

  if (!user || !isAdmin)
    return <div className="container mt-5">Acceso denegado</div>;

  return (
    <div className="container mt-5">
      <h2>Panel de Administración</h2>
      <div className="my-3">
        <Button disabled={loading} onClick={fetchFromAPI}>
          {loading ? "Cargando..." : "Importar productos de API"}
        </Button>
      </div>
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card h-100">
              <img
                src={product.image?.toString()}
                className="card-img-top"
                alt={product.name}
                style={{ height: 200, objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="fw-bold">${product.price}</p>
                <p className="text-muted">Stock: {product.stock}</p>
                <p className="text-muted">Categoría: {product.category}</p>
                <Button
                  variant="secondary"
                  onClick={() => handleUpdate(product)}
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(product.id!)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
