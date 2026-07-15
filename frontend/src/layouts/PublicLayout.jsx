import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Outlet } from 'react-router-dom';
export default function PublicLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100 bg-white text-dark">
      <nav className="navbar navbar-expand navbar-dark bg-dark shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <i className="bi bi-shop me-2"></i>SDN Ecommerce
          </Link>
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-outline-light btn-sm">
                  <i className="bi bi-person-circle me-1"></i>
                  {user.fullName}
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="btn btn-outline-light btn-sm">
                    <i className="bi bi-gear me-1"></i>Admin
                  </Link>
                )}
                <button className="btn btn-outline-light btn-sm" onClick={logout}>
                  <i className="bi bi-box-arrow-right"></i>
                </button>
              </>
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
        <p className="mb-0 small opacity-50">
          &copy; 2026 - SDN Ecommerce - Group 5
        </p>
      </footer>
    </div>
  );
}