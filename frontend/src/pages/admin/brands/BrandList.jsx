import { useState, useEffect } from "react";
import api from "../../../api";
import DataTable from "../../../components/DataTable";
import CrudModal from "../../../components/CrudModal";
import ConfirmModal from "../../../components/ConfirmModal";
import Pagination from "../../../components/Pagination";

const columns = [
  { key: "name", label: "Ten thuong hieu" },
  { key: "country", label: "Quoc gia" },
  { key: "description", label: "Mo ta" },
];

export default function BrandList() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [disableTarget, setDisableTarget] = useState(null);
  const [form, setForm] = useState({ name: "", country: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async (p) => {
    setLoading(true);
    try {
      const res = await api.get("/brands?page=" + p + "&limit=10");
      setData(res.data.data);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(page); }, [page]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: "", country: "", description: "" });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, country: item.country || "", description: item.description || "" });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editItem) {
        await api.put("/brands/" + editItem._id, form);
      } else {
        await api.post("/brands", form);
      }
      setShowModal(false);
      fetchData(page);
    } catch (err) {
      alert(err.response?.data?.message || "Loi");
    } finally { setSubmitting(false); }
  };

  const confirmDisable = (item) => { setDisableTarget(item); setShowConfirm(true); };

  const handleDisable = async () => {
    try {
      await api.delete("/brands/" + disableTarget._id);
      setShowConfirm(false);
      setDisableTarget(null);
      fetchData(page);
    } catch (err) { alert(err.response?.data?.message || "Loi"); }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0"><i className="bi bi-tag me-2"></i>Quan ly Thuong hieu</h4>
        <button className="btn btn-dark" onClick={openCreate}>
          <i className="bi bi-plus-lg me-1"></i>Them moi
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={confirmDisable} loading={loading} />
          <div className="mt-3">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>
      </div>

      <CrudModal show={showModal} title={editItem ? "Sua thuong hieu" : "Them thuong hieu"}
        onSubmit={handleSubmit} onCancel={() => setShowModal(false)} submitting={submitting}>
        <div className="mb-3">
          <label className="form-label small fw-semibold">Ten thuong hieu <span className="text-danger">*</span></label>
          <input className="form-control" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="mb-3">
          <label className="form-label small fw-semibold">Quoc gia</label>
          <input className="form-control" value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })} />
        </div>
        <div className="mb-3">
          <label className="form-label small fw-semibold">Mo ta</label>
          <textarea className="form-control" rows="2" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
      </CrudModal>

      <ConfirmModal show={showConfirm} title="Vo hieu hoa thuong hieu"
        message={"Ban co chac muon an thuong hieu \"" + (disableTarget?.name || "") + "\"?"}
        onConfirm={handleDisable} onCancel={() => { setShowConfirm(false); setDisableTarget(null); }} />
    </div>
  );
}