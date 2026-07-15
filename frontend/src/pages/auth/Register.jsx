import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { getAvatarSrc, readAvatarFile, validateAvatarFile } from "../../utils/avatar";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "", avatar: "" });
  const [err, setErr] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = "Vui long nhap ho ten";
    else if (form.fullName.trim().length < 2) nextErrors.fullName = "Ho ten toi thieu 2 ky tu";
    if (!form.email.trim()) nextErrors.email = "Vui long nhap email";
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) nextErrors.email = "Email khong hop le";
    if (!form.password) nextErrors.password = "Vui long nhap mat khau";
    else if (form.password.length < 6) nextErrors.password = "Mat khau toi thieu 6 ky tu";
    if (form.phone.trim() && !/^[0-9+\-\s()]{9,15}$/.test(form.phone.trim())) {
      nextErrors.phone = "So dien thoai khong hop le";
    }
    return nextErrors;
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateAvatarFile(file);
    if (error) {
      setErrors({ ...errors, avatar: error });
      event.target.value = "";
      return;
    }

    const avatar = await readAvatarFile(file);
    handleChange("avatar", avatar);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        avatar: form.avatar,
      });
      navigate("/");
    } catch (error) {
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
      setErr(error.response?.data?.message || "Dang ky that bai");
    }
  };

  return (
    <div className="min-vh-100 bg-dark d-flex align-items-center py-4">
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
                    <input
                      type="text"
                      className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                      placeholder="Nguyen Van A"
                      value={form.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                    />
                    {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Mat khau</label>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">So dien thoai</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                      placeholder="090xxxxxxx"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Avatar</label>
                    <div className="avatar-preview mb-2">
                      {form.avatar ? (
                        <img src={getAvatarSrc(form.avatar)} alt="Avatar preview" />
                      ) : (
                        <i className="bi bi-person"></i>
                      )}
                    </div>
                    <input
                      type="file"
                      className={`form-control ${errors.avatar ? "is-invalid" : ""}`}
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handleAvatarChange}
                    />
                    {errors.avatar && <div className="invalid-feedback d-block">{errors.avatar}</div>}
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
