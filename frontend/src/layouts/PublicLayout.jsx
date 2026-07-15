import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100 bg-light text-dark">
      {/* Navbar sáng màu, sticky-top để luôn hiển thị khi cuộn */}
      <nav className="navbar navbar-expand navbar-light bg-white border-bottom sticky-top py-3 shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bolder text-primary fs-4" to="/">
            <i className="bi bi-shop-window me-2"></i>SDN<span className="text-dark">Store</span>
          </Link>
          <div className="d-flex align-items-center gap-3">
            <Link to="/products" className="text-decoration-none text-dark fw-semibold text-hover-primary">
              <i className="bi bi-grid me-1"></i> Sản phẩm
            </Link>

            <div className="vr d-none d-sm-block"></div> {/* Dòng kẻ dọc */}

            {user ? (
              <div className="d-flex gap-2">
                <Link to="/profile" className="btn btn-light rounded-pill fw-medium">
                  <i className="bi bi-person-circle me-2 text-primary"></i>
                  {user.fullName}
                </Link>
                <Link to="/cart" className="btn btn-outline-dark rounded-pill ms-2">
                  <i className="bi bi-cart"></i>
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="btn btn-outline-dark rounded-pill fw-medium">
                    <i className="bi bi-gear"></i>
                  </Link>
                )}
                <button className="btn btn-danger rounded-pill px-3" onClick={logout} title="Đăng xuất">
                  <i className="bi bi-box-arrow-right"></i>
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-light rounded-pill fw-semibold px-4">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn btn-dark rounded-pill fw-semibold px-4 shadow-sm">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow-1" style={{ backgroundColor: "#f8f9fa" }}>
        <Outlet />
      </main>

      <footer className="bg-white border-top text-dark text-center py-4 mt-auto">
        <div className="container">
          <h5 className="fw-bold mb-3"><i className="bi bi-shop-window me-2"></i>SDN Store</h5>
          <p className="mb-0 text-muted small">
            &copy; 2026 - Mua sắm trực tuyến hàng chính hãng. Group 5.
          </p>
        </div>
      </footer>
    </div>
  );
}