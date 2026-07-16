import { useState, useEffect } from "react";
import api from "../../../api";
import Pagination from "../../../components/Pagination";

const STATUS_OPTIONS = ["pending", "confirmed", "shipping", "completed", "cancelled"];
const BADGE = {
  pending: "bg-warning text-dark",
  confirmed: "bg-info text-dark",
  shipping: "bg-primary",
  completed: "bg-success",
  cancelled: "bg-secondary",
};

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [detail, setDetail] = useState(null);

  const fetchOrders = async (p) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 10 };
      if (filter) params.status = filter;
      const res = await api.get("/orders", { params });
      setOrders(res.data.data || []);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(1); }, [filter]);
  useEffect(() => { fetchOrders(page); }, [page]);

  /* Admin confirm = complete + paid */
  const handleConfirm = async (id) => {
    if (!window.confirm("Xac nhan don hang nay?")) return;
    try {
      await api.patch("/orders/" + id + "/confirm");
      fetchOrders(page);
    } catch (err) { alert(err.response?.data?.message || "Loi"); }
  };

  const handleStatus = async (id, status) => {
    try {
      await api.patch("/orders/" + id + "/status", { status });
      fetchOrders(page);
    } catch (err) { alert(err.response?.data?.message || "Loi"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoa don hang nay?")) return;
    try {
      await api.delete("/orders/" + id);
      fetchOrders(page);
    } catch (err) { alert(err.response?.data?.message || "Loi"); }
  };

  return (
    <div>
      <h4 className="fw-bold mb-4"><i className="bi bi-receipt me-2"></i>Quan ly Don hang</h4>

      <div className="d-flex gap-2 mb-3 flex-wrap">
        <button className={"btn btn-sm rounded-pill " + (filter === "" ? "btn-dark" : "btn-outline-dark")}
          onClick={() => setFilter("")}>All</button>
        {STATUS_OPTIONS.map((s) => (
          <button key={s}
            className={"btn btn-sm rounded-pill " + (filter === s ? "btn-dark" : "btn-outline-dark")}
            onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-dark" /></div>
          ) : orders.length === 0 ? (
            <p className="text-muted text-center py-4">Khong co don hang</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Ma DH</th>
                    <th>Khach hang</th>
                    <th>San pham</th>
                    <th>Tong</th>
                    <th>Thanh toan</th>
                    <th>Trang thai</th>
                    <th>Ngay</th>
                    <th>Thao tac</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="small">{order._id.slice(-8)}</td>
                      <td>
                        <div className="fw-semibold small">{order.user?.fullName}</div>
                        <div className="small text-muted">{order.user?.phone}</div>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-link p-0 text-dark"
                          onClick={() => setDetail(detail === order._id ? null : order._id)}>
                          {order.items?.length || 0} SP{" "}
                          <i className={"bi " + (detail === order._id ? "bi-chevron-up" : "bi-chevron-down")}></i>
                        </button>
                        {detail === order._id && (
                          <div className="mt-1 small text-muted">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="d-flex justify-content-between gap-3">
                                <span>{item.productName}</span><span>x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="fw-bold">{order.finalAmount?.toLocaleString()}d</td>
                      <td>
                        <div className="small">{order.paymentMethod}</div>
                        <span className={"small badge " + (order.paymentStatus === "paid" ? "bg-success" : "bg-secondary")}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <select className="form-select form-select-sm"
                          value={order.status}
                          onChange={(e) => handleStatus(order._id, e.target.value)}>
                          {STATUS_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
                        </select>
                      </td>
                      <td className="small">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
                      <td>
                        <div className="d-flex gap-1">
                          {order.status === "pending" && (
                            <button className="btn btn-sm btn-success" onClick={() => handleConfirm(order._id)}
                              title="Xac nhan don hang">
                              <i className="bi bi-check-lg"></i>
                            </button>
                          )}
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(order._id)} title="Xoa">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-3"><Pagination page={page} totalPages={totalPages} onChange={setPage} /></div>
        </div>
      </div>
    </div>
  );
}
