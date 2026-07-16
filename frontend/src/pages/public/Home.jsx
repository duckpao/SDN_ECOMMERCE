/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import ProductCard from "../../components/public/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/products?limit=8").then((r) => setProducts(r.data.data));
    api.get("/categories").then((r) => setCategories(r.data.data));
  }, []);


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
      <section id="products" className="container pb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold mb-0">Sản phẩm gợi ý</h3>
          <Link to="/products" className="text-primary text-decoration-none fw-semibold">
            Xem tất cả <i className="bi bi-chevron-right fs-6"></i>
          </Link>
        </div>

        {/* Thay thế toàn bộ khối map cũ bằng ProductCard */}
        <div className="row g-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}