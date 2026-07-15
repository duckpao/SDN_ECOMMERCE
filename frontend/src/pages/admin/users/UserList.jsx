import { useEffect, useState } from "react";
import api from "../../../api";
import DataTable from "../../../components/DataTable";
import CrudModal from "../../../components/CrudModal";
import ConfirmModal from "../../../components/ConfirmModal";
import Pagination from "../../../components/Pagination";

const emptyForm = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  role: "customer",
  avatar: "",
  isActive: true,
};

const phonePattern = /^0\d{9}$/;
const avatarPattern = /^data:image\/(jpeg|png|webp|gif);base64,/i;

const columns = [
  { key: "fullName", label: "Ho ten" },
  { key: "email", label: "Email" },
  { key: "phone", label: "So dien thoai", render: (r) => r.phone || "-" },
  {
    key: "role",
    label: "Vai tro",
    render: (r) => {
      const badge = r.role === "admin" ? "bg-danger" : r.role === "staff" ? "bg-warning text-dark" : "bg-primary";
      return <span className={"badge " + badge}>{r.role}</span>;
    },
  },
  {
    key: "isActive",
    label: "Trang thai",
    render: (r) => r.isActive
      ? <span className="badge bg-success">Hoat dong</span>
      : <span className="badge bg-secondary">Khoa</span>,
  },
];

export default function UserList({
  title = "Quan ly User",
  icon = "bi-people",
  roles = [],
  defaultRole = "customer",
  roleOptions = ["customer", "staff", "admin"],
  createLabel = "Them moi",
}) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const nextErrors = {};
    const phone = form.phone.trim();
    const avatar = form.avatar.trim();

    if (phone && !phonePattern.test(phone)) {
      nextErrors.phone = "So dien thoai phai gom 10 chu so va bat dau bang 0";
    }

    const unchangedExistingAvatar = editItem && avatar === (editItem.avatar || "") && !avatarPattern.test(avatar);
    if (avatar && !avatarPattern.test(avatar) && !unchangedExistingAvatar) {
      nextErrors.avatar = "Avatar phai la file anh jpg, png, webp hoac gif";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const fetchData = async (p, keyword = appliedSearch) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ page: String(p), limit: "10" });
      if (keyword.trim()) query.set("search", keyword.trim());
      if (roles.length > 0) query.set("roles", roles.join(","));
      const res = await api.get("/users?" + query.toString());
      setData(res.data.data);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      alert(err.response?.data?.message || "Khong tai duoc danh sach user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(page); }, [page, appliedSearch]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ ...emptyForm, role: defaultRole });
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
      avatar: item.avatar || "",
      isActive: item.isActive !== false,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setAppliedSearch(search);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = { ...form };
      payload.phone = payload.phone.trim();
      payload.avatar = payload.avatar.trim();
      if (editItem && !payload.password) delete payload.password;
      if (editItem && payload.avatar === (editItem.avatar || "") && !avatarPattern.test(payload.avatar)) {
        delete payload.avatar;
      }

      if (editItem) await api.put("/users/" + editItem._id, payload);
      else await api.post("/users", payload);

      setShowModal(false);
      fetchData(page);
    } catch (err) {
      alert(err.response?.data?.message || "Loi");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const maxSize = 5 * 1024 * 1024;
    if (!validTypes.includes(file.type)) {
      setErrors({ ...errors, avatar: "Chi chap nhan file anh jpg, png, webp hoac gif" });
      e.target.value = "";
      return;
    }
    if (file.size > maxSize) {
      setErrors({ ...errors, avatar: "Anh avatar phai nho hon 5MB" });
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm({ ...form, avatar: reader.result });
      setErrors({ ...errors, avatar: "" });
    };
    reader.readAsDataURL(file);
  };

  const confirmDelete = (item) => {
    setDeleteTarget(item);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete("/users/" + deleteTarget._id);
      setShowConfirm(false);
      setDeleteTarget(null);
      fetchData(page);
    } catch (err) {
      alert(err.response?.data?.message || "Loi");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0"><i className={"bi " + icon + " me-2"}></i>{title}</h4>
        <button className="btn btn-dark" onClick={openCreate}>
          <i className="bi bi-plus-lg me-1"></i>{createLabel}
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <form className="row g-2 mb-3" onSubmit={handleSearch}>
            <div className="col-md-9 col-lg-10">
              <input
                className="form-control"
                placeholder="Tim theo ten, email, so dien thoai"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-3 col-lg-2 d-grid">
              <button className="btn btn-outline-dark" type="submit">
                <i className="bi bi-search me-1"></i>Tim
              </button>
            </div>
          </form>

          <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={confirmDelete} loading={loading} />
          <div className="mt-3">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>
      </div>

      <CrudModal
        show={showModal}
        title={editItem ? "Sua user" : createLabel}
        onSubmit={handleSubmit}
        onCancel={() => { setShowModal(false); setErrors({}); }}
        submitting={submitting}
      >
        <div className="mb-3">
          <label className="form-label small fw-semibold">Ho ten <span className="text-danger">*</span></label>
          <input className="form-control" value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
        </div>
        <div className="mb-3">
          <label className="form-label small fw-semibold">Email <span className="text-danger">*</span></label>
          <input type="email" className="form-control" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="mb-3">
          <label className="form-label small fw-semibold">
            Mat khau {!editItem && <span className="text-danger">*</span>}
          </label>
          <input
            type="password"
            className="form-control"
            value={form.password}
            placeholder={editItem ? "De trong neu khong doi" : ""}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!editItem}
          />
        </div>
        <div className="mb-3">
          <label className="form-label small fw-semibold">So dien thoai</label>
          <input className={"form-control " + (errors.phone ? "is-invalid" : "")} value={form.phone}
            inputMode="numeric" pattern="0[0-9]{9}" maxLength="10"
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label small fw-semibold">Avatar</label>
          <input
            type="file"
            className={"form-control " + (errors.avatar ? "is-invalid" : "")}
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleAvatarChange}
          />
          {errors.avatar && <div className="invalid-feedback">{errors.avatar}</div>}
          {form.avatar && (
            <div className="d-flex align-items-center gap-2 mt-2">
              <img
                src={form.avatar}
                alt="Avatar preview"
                className="rounded-circle border"
                style={{ width: 44, height: 44, objectFit: "cover" }}
              />
              <button type="button" className="btn btn-sm btn-outline-danger"
                onClick={() => setForm({ ...form, avatar: "" })}>
                Xoa avatar
              </button>
            </div>
          )}
        </div>
        {roleOptions.length > 1 && (
          <div className="mb-3">
            <label className="form-label small fw-semibold">Vai tro</label>
            <select className="form-select" value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {roleOptions.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        )}
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" id="userActive"
            checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          <label className="form-check-label" htmlFor="userActive">Hoat dong</label>
        </div>
      </CrudModal>

      <ConfirmModal
        show={showConfirm}
        title="Xoa user"
        message={"Ban co chac muon xoa user \"" + (deleteTarget?.fullName || "") + "\"?"}
        onConfirm={handleDelete}
        onCancel={() => { setShowConfirm(false); setDeleteTarget(null); }}
      />
    </div>
  );
}
