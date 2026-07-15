import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/products?limit=8").then((r) => setProducts(r.data.data));
    api.get("/categories").then((r) => setCategories(r.data.data));
  }, []);

  const normalizeImage = (value) => {
    if (!value) return "/images/products/download.webp"; // Đổi về link này
    return value;
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
          <p className="lead mb-4 opacity-75">Mua sắm trực tuyến - Hàng chính hãng, giá tốt</p>
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/products" className="btn btn-light btn-lg px-4 text-dark fw-semibold">
              <i className="bi bi-bag me-2"></i>Mua ngay
            </Link>
            <Link to="/login" className="btn btn-outline-light btn-lg px-4">
              <i className="bi bi-box-arrow-in-right me-2"></i>Đăng nhập
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container py-5">
        <h2 className="fw-bold mb-4">
          <i className="bi bi-grid me-2"></i>Danh mục
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">
            <i className="bi bi-star me-2"></i>Sản phẩm nổi bật
          </h2>
          <Link to="/products" className="text-decoration-none fw-semibold">
            Xem tất cả <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        <div className="row g-4">
          {products.map((p) => {
            const displayPrice = p.discountPrice > 0 ? p.discountPrice : p.price;
            const hasDiscount = p.discountPrice > 0;
            const discountPercent = hasDiscount ? Math.round((1 - p.discountPrice / p.price) * 100) : 0;

            return (
              <div key={p._id} className="col-6 col-md-4 col-lg-3">
                <div className="card h-100 border-0 shadow-sm overflow-hidden">
                  <div className="position-relative bg-light">
                    <img
                      src={normalizeImage(p.image)}
                      className="card-img-top"
                      alt={p.name}
                      style={{ aspectRatio: "1/1", objectFit: "cover" }}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/products/download.webp"; // Đổi về link này
                      }}
                    />
                    {hasDiscount && (
                      <span className="position-absolute top-0 start-0 badge bg-danger m-2">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title text-truncate mb-1" title={p.name}>{p.name}</h6>
                    <p className="card-text text-muted small mb-2">{p.brand?.name || "Thương hiệu"}</p>
                    <div className="mt-auto">
                      {hasDiscount ? (
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-bold text-danger fs-5">
                            {displayPrice.toLocaleString()}đ
                          </span>
                          <span className="text-muted text-decoration-line-through small">
                            {p.price.toLocaleString()}đ
                          </span>
                        </div>
                      ) : (
                        <span className="fw-bold text-dark fs-5">
                          {displayPrice.toLocaleString()}đ
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}