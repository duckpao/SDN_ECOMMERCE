import { useEffect, useMemo, useState } from "react";
import api from "../../../api";
import Pagination from "../../../components/Pagination";
import ConfirmModal from "../../../components/ConfirmModal";
import { getAvatarSrc, readAvatarFile, validateAvatarFile } from "../../../utils/avatar";

const emptyForm = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  role: "customer",
  isActive: true,
  avatar: "",
};

const roleLabels = {
  customer: "Customer",
  staff: "Nhan vien",
  admin: "Admin",
};

const validateForm = (form, isEdit) => {
  const errors = {};
  const emailRegex = /^\S+@\S+\.\S+$/;
  const phoneRegex = /^[0-9+\-\s()]{9,15}$/;

  if (!form.fullName.trim()) errors.fullName = "Vui long nhap ho ten";
  else if (form.fullName.trim().length < 2) errors.fullName = "Ho ten toi thieu 2 ky tu";

  if (!form.email.trim()) errors.email = "Vui long nhap email";
  else if (!emailRegex.test(form.email.trim())) errors.email = "Email khong hop le";

  if (!isEdit && !form.password) errors.password = "Vui long nhap mat khau";
  else if (form.password && form.password.length < 6) errors.password = "Mat khau toi thieu 6 ky tu";

  if (form.phone.trim() && !phoneRegex.test(form.phone.trim())) errors.phone = "So dien thoai khong hop le";

  return errors;
};

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("customer");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [disableTarget, setDisableTarget] = useState(null);

  const title = useMemo(
    () => (roleFilter === "customer" ? "Quan ly Customer" : "Quan ly Nhan vien"),
    [roleFilter],
  );

  const fetchUsers = async (targetPage = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(targetPage),
        limit: "10",
        role: roleFilter,
      });
      if (search.trim()) params.set("search", search.trim());

      const res = await api.get(`/users?${params.toString()}`);
      setUsers(res.data.data);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      alert(err.response?.data?.message || "Khong tai duoc danh sach user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [roleFilter]);

  const openCreate = () => {
    setEditItem(null);
    setForm({
      ...emptyForm,
      role: roleFilter === "customer" ? "customer" : "staff",
    });
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      fullName: item.fullName || "",
      email: item.email || "",
      password: "",
      phone: item.phone || "",
      role: item.role || "customer",
      isActive: item.isActive !== false,
      avatar: item.avatar || "",
    });
    setErrors({});
    setShowModal(true);
  };

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateAvatarFile(file);
    if (error) {
      setErrors((current) => ({ ...current, avatar: error }));
      event.target.value = "";
      return;
    }

    const avatar = await readAvatarFile(file);
    handleChange("avatar", avatar);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateForm(form, Boolean(editItem));
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: form.role,
      isActive: form.isActive,
      avatar: form.avatar,
    };
    if (form.password) payload.password = form.password;

    setSubmitting(true);
    try {
      if (editItem) await api.put(`/users/${editItem._id}`, payload);
      else await api.post("/users", payload);
      setShowModal(false);
      fetchUsers(page);
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) setErrors(apiErrors);
      else alert(err.response?.data?.message || "Luu user that bai");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisable = async () => {
    try {
      await api.delete(`/users/${disableTarget._id}`);
      setDisableTarget(null);
      fetchUsers(page);
    } catch (err) {
      alert(err.response?.data?.message || "Vo hieu hoa user that bai");
    }
  };

  const submitSearch = (event) => {
    event.preventDefault();
    fetchUsers(1);
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h4 className="fw-bold mb-0">
          <i className="bi bi-people me-2"></i>
          {title}
        </h4>
        <button className="btn btn-dark" onClick={openCreate}>
          <i className="bi bi-person-plus me-1"></i>Them user
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center mb-3">
            <div className="btn-group" role="group" aria-label="Loai user">
              <button
                type="button"
                className={`btn ${roleFilter === "customer" ? "btn-dark" : "btn-outline-dark"}`}
                onClick={() => setRoleFilter("customer")}
              >
                Customer
              </button>
              <button
                type="button"
                className={`btn ${roleFilter === "employee" ? "btn-dark" : "btn-outline-dark"}`}
                onClick={() => setRoleFilter("employee")}
              >
                Nhan vien
              </button>
            </div>

            <form className="d-flex gap-2" onSubmit={submitSearch}>
              <input
                className="form-control"
                placeholder="Tim ten, email, SDT"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button className="btn btn-outline-dark" type="submit" title="Tim kiem">
                <i className="bi bi-search"></i>
              </button>
            </form>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : users.length === 0 ? (
            <p className="text-muted text-center py-4 mb-0">Chua co user</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>So dien thoai</th>
                    <th>Vai tro</th>
                    <th>Trang thai</th>
                    <th style={{ width: 110 }}>Hanh dong</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {item.avatar ? (
                            <img className="avatar-sm" src={getAvatarSrc(item.avatar)} alt={item.fullName} />
                          ) : (
                            <span className="avatar-sm avatar-fallback">
                              <i className="bi bi-person"></i>
                            </span>
                          )}
                          <span className="fw-semibold">{item.fullName}</span>
                        </div>
                      </td>
                      <td>{item.email}</td>
                      <td>{item.phone || "-"}</td>
                      <td>
                        <span className="badge bg-dark">{roleLabels[item.role] || item.role}</span>
                      </td>
                      <td>
                        <span className={`badge ${item.isActive ? "bg-success" : "bg-secondary"}`}>
                          {item.isActive ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-dark" onClick={() => openEdit(item)} title="Sua">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setDisableTarget(item)}
                            title="Vo hieu hoa"
                            disabled={!item.isActive}
                          >
                            <i className="bi bi-eye-slash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-3">
            <Pagination page={page} totalPages={totalPages} onChange={(nextPage) => fetchUsers(nextPage)} />
          </div>
        </div>
      </div>

      {showModal && (
        <>
          <div className="modal-backdrop fade show" onClick={() => setShowModal(false)}></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">{editItem ? "Sua user" : "Them user"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-4">
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

                      <div className="col-md-8">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label small fw-semibold">Ho ten</label>
                            <input
                              className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                              value={form.fullName}
                              onChange={(event) => handleChange("fullName", event.target.value)}
                            />
                            {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label small fw-semibold">Email</label>
                            <input
                              type="email"
                              className={`form-control ${errors.email ? "is-invalid" : ""}`}
                              value={form.email}
                              onChange={(event) => handleChange("email", event.target.value)}
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label small fw-semibold">
                              Mat khau {editItem && <span className="text-muted">(bo trong neu khong doi)</span>}
                            </label>
                            <input
                              type="password"
                              className={`form-control ${errors.password ? "is-invalid" : ""}`}
                              value={form.password}
                              onChange={(event) => handleChange("password", event.target.value)}
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label small fw-semibold">So dien thoai</label>
                            <input
                              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                              value={form.phone}
                              onChange={(event) => handleChange("phone", event.target.value)}
                            />
                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label small fw-semibold">Vai tro</label>
                            <select
                              className={`form-select ${errors.role ? "is-invalid" : ""}`}
                              value={form.role}
                              onChange={(event) => handleChange("role", event.target.value)}
                            >
                              <option value="customer">Customer</option>
                              <option value="staff">Nhan vien</option>
                              <option value="admin">Admin</option>
                            </select>
                            {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                          </div>
                          <div className="col-md-6 d-flex align-items-end">
                            <div className="form-check form-switch mb-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="user-active"
                                checked={form.isActive}
                                onChange={(event) => handleChange("isActive", event.target.checked)}
                              />
                              <label className="form-check-label" htmlFor="user-active">
                                Dang hoat dong
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-outline-dark" onClick={() => setShowModal(false)}>
                      Huy
                    </button>
                    <button type="submit" className="btn btn-dark" disabled={submitting}>
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1"></span>Dang luu...
                        </>
                      ) : (
                        "Luu"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      <ConfirmModal
        show={Boolean(disableTarget)}
        title="Vo hieu hoa user"
        message={`Ban co chac muon vo hieu hoa "${disableTarget?.fullName || ""}"?`}
        onConfirm={handleDisable}
        onCancel={() => setDisableTarget(null)}
      />
    </div>
  );
}
