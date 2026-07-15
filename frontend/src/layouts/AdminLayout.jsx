import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, Link } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { getAvatarSrc } from "../utils/avatar";


export default function AdminLayout() {
  const { user, logout } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;

  return (
    <div className="d-flex min-vh-100 bg-light">
      <AdminSidebar />
      <div className="d-flex flex-column flex-grow-1">
        {/* Topbar */}
        <nav className="navbar navbar-expand navbar-light bg-white shadow-sm px-4">
          <span className="navbar-brand small fw-semibold">
            <i className="bi bi-building me-2"></i>Quan ly
          </span>
          <div className="ms-auto d-flex align-items-center gap-3">
            <span className="small text-muted">
              {user.avatar ? (
                <img className="avatar-xs me-2" src={getAvatarSrc(user.avatar)} alt={user.fullName} />
              ) : (
                <i className="bi bi-person-circle me-1"></i>
              )}
              {user.fullName}
            </span>
            <span className="badge bg-dark">{user.role}</span>
            <Link to="/" className="btn btn-outline-dark btn-sm">
              <i className="bi bi-house"></i>
            </Link>
            <button className="btn btn-outline-danger btn-sm" onClick={logout}>
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </nav>

        {/* Content */}
        <div className="flex-grow-1 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
