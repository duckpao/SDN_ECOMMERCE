import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="d-flex flex-column min-vh-100 bg-white text-dark">
      <nav className="navbar navbar-expand navbar-dark bg-dark shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <i className="bi bi-shop me-2"></i>SDN Ecommerce
          </Link>
          <div className="d-flex align-items-center gap-3">
            {user?.role === "admin" && (
              <Link to="/admin" className="btn btn-outline-light btn-sm">
                <i className="bi bi-gear me-1"></i>Admin
              </Link>
            )}
            <span className="text-white-50 small">
              <i className="bi bi-person-circle me-1"></i>{user?.fullName}
            </span>
            <span className="badge bg-light text-dark">{user?.role}</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>Thoat
            </button>
          </div>
        </div>
      </nav>
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-dark text-white d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: 80, height: 80, fontSize: "2rem" }}>
                  {user?.fullName?.charAt(0)?.toUpperCase() || <i className="bi bi-person"></i>}
                </div>
                <h5 className="fw-bold">{user?.fullName}</h5>
                <p className="text-muted small mb-1"><i className="bi bi-envelope me-1"></i>{user?.email}</p>
                <p className="text-muted small mb-0"><i className="bi bi-telephone me-1"></i>{user?.phone || "Chua cap nhat"}</p>
                <span className="badge bg-dark mt-2">{user?.role}</span>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4"><i className="bi bi-info-circle me-2"></i>Thong tin tai khoan</h5>
                <table className="table table-borderless">
                  <tbody>
                    <tr><td className="fw-semibold text-muted" style={{width:140}}>Ho ten</td><td>{user?.fullName}</td></tr>
                    <tr><td className="fw-semibold text-muted">Email</td><td>{user?.email}</td></tr>
                    <tr><td className="fw-semibold text-muted">So dien thoai</td><td>{user?.phone || "Chua cap nhat"}</td></tr>
                    <tr><td className="fw-semibold text-muted">Vai tro</td><td><span className="badge bg-dark">{user?.role}</span></td></tr>
                    <tr><td className="fw-semibold text-muted">Trang thai</td>
                      <td>{user?.isActive
                        ? <span className="text-success"><i className="bi bi-check-circle me-1"></i>Hoat dong</span>
                        : <span className="text-danger"><i className="bi bi-x-circle me-1"></i>Vo hieu hoa</span>}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}