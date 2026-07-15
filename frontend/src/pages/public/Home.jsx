import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    api.get("/products?limit=8").then((r) => setProducts(r.data.data));
    api.get("/categories").then((r) => setCategories(r.data.data));
  }, []);

  const addToCart = async (productId) => {
    if (!user) { navigate("/login"); return; }
    setAdding(productId);
    try {
      await api.post("/carts/add", { productId, quantity: 1 });
      alert("Da them vao gio hang!");
    } catch (err) {
      alert(err.response?.data?.message || "Loi");
    } finally { setAdding(null); }
  };

  return (
    <>
      {/* HERO */}
      <section
        className="py-5 text-white"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      >
        <div className="container text-center py-5">
          <h1 className="display-4 fw-bold mb-3">SDN Ecommerce</h1>
          <p className="lead mb-4 opacity-75">Mua sam truc tuyen - Hang chinh hang, gia tot</p>
          <div className="d-flex gap-3 justify-content-center">
            <a href="#products" className="btn btn-light btn-lg px-4 text-dark fw-semibold">
              <i className="bi bi-bag me-2"></i>Mua ngay
            </a>
            {!user && (
              <Link to="/login" className="btn btn-outline-light btn-lg px-4">
                <i className="bi bi-box-arrow-in-right me-2"></i>Dang nhap
              </Link>
            )}
            {user && (
              <Link to="/checkout" className="btn btn-outline-light btn-lg px-4">
                <i className="bi bi-credit-card me-2"></i>Thanh toan
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container py-5">
        <h2 className="fw-bold mb-4">
          <i className="bi bi-grid me-2"></i>Danh muc
        </h2>
        <div className="d-flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={"/products?category=" + cat._id}
              className="btn btn-outline-dark rounded-pill px-3"
            >
              <i className="bi bi-tag me-1"></i>
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="container pb-5">
        <h2 className="fw-bold mb-4">
          <i className="bi bi-star me-2"></i>San pham noi bat
        </h2>
        <div className="row g-4">
          {products.map((p) => (
            <div key={p._id} className="col-6 col-md-4 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="position-relative">
                  <img
                    src={
                      p.image
                        ? p.image.replace("https://example.com/images/", "/images/products/")
                        : "/images/products/placeholder.jpg"
                    }
                    className="card-img-top"
                    alt={p.name}
                    style={{ aspectRatio: "1/1", objectFit: "cover" }}
                    onError={(e) => { e.target.src = "/images/products/placeholder.jpg"; }}
                  />
                  {p.discountPrice > 0 && (
                    <span className="position-absolute top-0 start-0 badge bg-danger m-2">
                      -{Math.round((1 - p.discountPrice / p.price) * 100)}%
                    </span>
                  )}
                </div>
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title text-truncate">{p.name}</h6>
                  <p className="card-text text-muted small mb-2">{p.brand?.name}</p>
                  <div className="mt-auto">
                    {p.discountPrice > 0 ? (
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="fw-bold text-danger fs-5">{p.discountPrice.toLocaleString()}d</span>
                        <span className="text-muted text-decoration-line-through small">{p.price.toLocaleString()}d</span>
                      </div>
                    ) : (
                      <span className="fw-bold text-dark fs-5 mb-2 d-block">{p.price.toLocaleString()}d</span>
                    )}
                    <button className="btn btn-dark btn-sm w-100"
                      onClick={() => addToCart(p._id)}
                      disabled={adding === p._id}>
                      {adding === p._id ? (
                        <><span className="spinner-border spinner-border-sm me-1"></span>Dang them...</>
                      ) : (
                        <><i className="bi bi-cart-plus me-1"></i>Them vao gio</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}