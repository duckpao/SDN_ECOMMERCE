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
    if (!value) return "/images/products/download.webp";
    return value;
  };

  return (
    <>
      {/* HERO SECTION - Phong cách tươi sáng, rực rỡ */}
      <section
        className="py-5"
        style={{
          background: "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)",
          borderRadius: "0 0 40px 40px",
          marginBottom: "40px"
        }}
      >
        <div className="container text-center py-5">
          <h1 className="display-3 fw-black text-dark mb-3" style={{ fontWeight: 900 }}>
            Mùa Lễ Hội Mua Sắm
          </h1>
          <p className="lead text-dark mb-4 fw-medium opacity-75">
            Sản phẩm chính hãng - Freeship mọi đơn hàng từ 0đ
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/products" className="btn btn-dark btn-lg rounded-pill px-5 shadow">
              Khám phá ngay <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES - Cấu trúc thẻ mềm mại */}
      <section className="container mb-5">
        <div className="d-flex align-items-center mb-4">
          <h3 className="fw-bold mb-0">Danh mục nổi bật</h3>
        </div>
        <div className="d-flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={"/products?category=" + cat._id}
              className="btn btn-white bg-white border-0 shadow-sm rounded-pill px-4 py-2 fw-medium text-dark text-decoration-none"
              style={{ transition: "all 0.2s" }}
              onMouseOver={(e) => e.currentTarget.classList.add('shadow')}
              onMouseOut={(e) => e.currentTarget.classList.remove('shadow')}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="container pb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold mb-0">Sản phẩm gợi ý</h3>
          <Link to="/products" className="text-primary text-decoration-none fw-semibold">
            Xem tất cả <i className="bi bi-chevron-right fs-6"></i>
          </Link>
        </div>

        <div className="row g-4">
          {products.map((p) => {
            const displayPrice = p.discountPrice > 0 ? p.discountPrice : p.price;
            const hasDiscount = p.discountPrice > 0;
            const discountPercent = hasDiscount ? Math.round((1 - p.discountPrice / p.price) * 100) : 0;

            return (
              <div key={p._id} className="col-6 col-md-4 col-lg-3">
                <Link to={`/products`} className="text-decoration-none text-dark">
                  <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden h-100" style={{ transition: "transform 0.2s" }} onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"} onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                    <div className="position-relative bg-white p-3">
                      <img
                        src={normalizeImage(p.image)}
                        className="card-img-top rounded-4"
                        alt={p.name}
                        style={{ aspectRatio: "1/1", objectFit: "cover" }}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/products/download.webp";
                        }}
                      />
                      {hasDiscount && (
                        <span className="position-absolute top-0 end-0 badge bg-danger rounded-pill m-3 px-2 py-1 shadow-sm">
                          -{discountPercent}%
                        </span>
                      )}
                    </div>
                    <div className="card-body p-3 pt-0 d-flex flex-column">
                      <p className="text-muted small mb-1">{p.brand?.name || "Thương hiệu"}</p>
                      <h6 className="card-title text-truncate mb-2 fw-semibold" title={p.name}>{p.name}</h6>
                      <div className="mt-auto">
                        {hasDiscount ? (
                          <div className="d-flex flex-column">
                            <span className="fw-bold text-danger fs-5">
                              {displayPrice.toLocaleString()} ₫
                            </span>
                            <span className="text-muted text-decoration-line-through small">
                              {p.price.toLocaleString()} ₫
                            </span>
                          </div>
                        ) : (
                          <span className="fw-bold text-dark fs-5">
                            {displayPrice.toLocaleString()} ₫
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}