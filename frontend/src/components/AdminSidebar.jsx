import { Link, useLocation } from "react-router-dom";

const menu = [
  { path: "/admin", label: "Tong quan", icon: "bi-speedometer2" },
  { path: "/admin/brands", label: "Thuong hieu", icon: "bi-tag" },
  { path: "/admin/categories", label: "Danh muc", icon: "bi-grid" },
  { path: "/admin/carts", label: "Gio hang", icon: "bi-cart" },
];

export default function AdminSidebar() {
  const loc = useLocation();
  const active = (p) => loc.pathname === p || loc.pathname.startsWith(p + "/");

  return (
    <div className="d-flex flex-column bg-dark text-white" style={{ width: 240, minHeight: "100vh" }}>
      <Link to="/admin" className="text-white text-decoration-none p-3 border-bottom border-secondary">
        <i className="bi bi-shop me-2"></i>
        <span className="fw-bold">SDN Admin</span>
      </Link>
      <nav className="flex-grow-1 p-2">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`d-flex align-items-center gap-2 px-3 py-2 rounded mb-1 text-decoration-none ${
              active(item.path) ? "bg-white text-dark" : "text-white-50 hover-bg"
            }`}
          >
            <i className={`bi ${item.icon}`}></i>
            <span className="small">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-3 border-top border-secondary">
        <Link to="/" className="text-white-50 text-decoration-none small">
          <i className="bi bi-house me-1"></i>Ve trang chu
        </Link>
      </div>
    </div>
  );
}