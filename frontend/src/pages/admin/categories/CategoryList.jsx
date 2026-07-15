import { useState, useEffect } from "react";
import api from "../../../api";
import DataTable from "../../../components/DataTable";
import CrudModal from "../../../components/CrudModal";
import ConfirmModal from "../../../components/ConfirmModal";
import Pagination from "../../../components/Pagination";

const columns = [
  { key: "name", label: "Ten danh muc" },
  { key: "description", label: "Mo ta" },
  {
    key: "isActive", label: "Trang thai",
    render: (r) => r.isActive
      ? <span className="badge bg-success">Hoat dong</span>
      : <span className="badge bg-secondary">An</span>,
  },
];

export default function CategoryList() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", isActive: true });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async (p) => {
    setLoading(true);
    try {
      const res = await api.get("/categories?page=" + p + "&limit=10");
      setData(res.data.data);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(page); }, [page]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: "", description: "", isActive: true });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, description: item.description || "", isActive: item.isActive });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editItem) await api.put("/categories/" + editItem._id, form);
      else await api.post("/categories", form);
      setShowModal(false);
      fetchData(page);
    } catch (err) { alert(err.response?.data?.message || "Loi"); }
    finally { setSubmitting(false); }
  };

  const confirmDelete = (item) => { setDeleteTarget(item); setShowConfirm(true); };

  const handleDelete = async () => {
    try {
      await api.delete("/categories/" + deleteTarget._id);
      setShowConfirm(false); setDeleteTarget(null);
      fetchData(page);
    } catch (err) { alert(err.response?.data?.message || "Loi"); }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0"><i className="bi bi-grid me-2"></i>Quan ly Danh muc</h4>
        <button className="btn btn-dark" onClick={openCreate}>
          <i className="bi bi-plus-lg me-1"></i>Them moi
        </button>
      </div>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={confirmDelete} loading={loading} />
          <div className="mt-3">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>
      </div>

      <CrudModal show={showModal} title={editItem ? "Sua danh muc" : "Them danh muc"}
        onSubmit={handleSubmit} onCancel={() => setShowModal(false)} submitting={submitting}>
        <div className="mb-3">
          <label className="form-label small fw-semibold">Ten danh muc <span className="text-danger">*</span></label>
          <input className="form-control" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="mb-3">
          <label className="form-label small fw-semibold">Mo ta</label>
          <textarea className="form-control" rows="2" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" id="catActive"
            checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          <label className="form-check-label" htmlFor="catActive">Hoat dong</label>
        </div>
      </CrudModal>

      <ConfirmModal show={showConfirm} title="Xoa danh muc"
        message={"Ban co chac muon xoa danh muc \"" + (deleteTarget?.name || "") + "\"?"}
        onConfirm={handleDelete} onCancel={() => { setShowConfirm(false); setDeleteTarget(null); }} />
    </div>
  );
}