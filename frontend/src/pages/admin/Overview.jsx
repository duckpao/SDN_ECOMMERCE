import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

export default function Overview() {
  const [stats, setStats] = useState({ users: 0, categories: 0, brands: 0, products: 0 });

  useEffect(() => {
    Promise.all([
      api.get("/users?limit=1"),
      api.get("/categories?limit=1"),
      api.get("/brands?limit=1"),
      api.get("/products?limit=1"),
    ]).then(([u, c, b, p]) => {
      setStats({
        users: u.data.total || 0,
        categories: c.data.total || 0,
        brands: b.data.total || 0,
        products: p.data.total || 0,
      });
    });
  }, []);

  const cards = [
    { label: "Nguoi dung", value: stats.users, icon: "bi-people", color: "bg-primary", link: "#" },
    { label: "Danh muc", value: stats.categories, icon: "bi-grid", color: "bg-success", link: "/admin/categories" },
    { label: "Thuong hieu", value: stats.brands, icon: "bi-tag", color: "bg-warning text-dark", link: "/admin/brands" },
    { label: "San pham", value: stats.products, icon: "bi-box", color: "bg-danger", link: "#" },
  ];

  return (
    <div>
      <h4 className="fw-bold mb-4"><i className="bi bi-speedometer2 me-2"></i>Tong quan</h4>
      <div className="row g-4">
        {cards.map((c, i) => (
          <div key={i} className="col-6 col-lg-3">
            <Link to={c.link} className="text-decoration-none">
              <div className={"card border-0 shadow-sm " + c.color + " text-white"}>
                <div className="card-body d-flex align-items-center gap-3 p-4">
                  <i className={"bi " + c.icon + " fs-1 opacity-75"}></i>
                  <div>
                    <p className="display-6 fw-bold mb-0">{c.value}</p>
                    <p className="mb-0 small opacity-75">{c.label}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}