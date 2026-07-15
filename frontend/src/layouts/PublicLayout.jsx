import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAvatarSrc } from "../utils/avatar";

export default function PublicLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-white text-dark">
      <nav className="navbar navbar-expand navbar-dark bg-dark shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <i className="bi bi-shop me-2"></i>SDN Ecommerce
          </Link>
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <div className="d-flex gap-2">
                <Link to="/profile" className="btn btn-light rounded-pill fw-medium">
                  {user.avatar ? (
                    <img className="avatar-xs me-2" src={getAvatarSrc(user.avatar)} alt={user.fullName} />
                  ) : (
                    <i className="bi bi-person-circle me-2 text-primary"></i>
                  )}
                  {user.fullName}
                </Link>
                <Link to="/my-orders" className="btn btn-outline-light btn-sm">
                  <i className="bi bi-receipt me-1"></i>Don hang
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="btn btn-outline-light btn-sm">
                    <i className="bi bi-gear me-1"></i>Admin
                  </Link>
                )}
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i>
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm">
                  <i className="bi bi-box-arrow-in-right me-1"></i>Dang nhap
                </Link>
                <Link to="/register" className="btn btn-light btn-sm text-dark">
                  <i className="bi bi-person-plus me-1"></i>Dang ky
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0 small opacity-50">&copy; 2026 - SDN Ecommerce - Group 5</p>
      </footer>
    </div>
  );
}
