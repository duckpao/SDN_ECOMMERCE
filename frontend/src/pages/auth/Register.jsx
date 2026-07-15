import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "" });
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await register(form);
      navigate("/dashboard");
    } catch (error) {
      setErr(error.response?.data?.message || "Dang ky that bai");
    }
  };

  return (
    <div className="min-vh-100 bg-dark d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-11 col-sm-8 col-md-6 col-lg-4">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-4 text-dark">
                <div className="text-center mb-4">
                  <i className="bi bi-person-plus fs-1 text-dark"></i>
                  <h3 className="fw-bold mt-2">Dang ky</h3>
                  <p className="text-muted small">Tao tai khoan moi</p>
                </div>
                {err && (
                  <div className="alert alert-danger py-2 small">
                    <i className="bi bi-exclamation-circle me-1"></i>{err}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Ho ten</label>
                    <input type="text" className="form-control" placeholder="Nguyen Van A"
                      value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Email</label>
                    <input type="email" className="form-control" placeholder="your@email.com"
                      value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Mat khau</label>
                    <input type="password" className="form-control" placeholder="••••••••"
                      value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">So dien thoai</label>
                    <input type="tel" className="form-control" placeholder="090xxxxxxx"
                      value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <button type="submit" className="btn btn-dark w-100 py-2 fw-semibold" disabled={loading}>
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Dang xu ly...</>
                    ) : (
                      <><i className="bi bi-person-plus me-2"></i>Dang ky</>
                    )}
                  </button>
                </form>
                <p className="text-center text-muted small mt-3 mb-0">
                  Da co tai khoan?{" "}
                  <Link to="/login" className="text-dark fw-semibold">Dang nhap</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}