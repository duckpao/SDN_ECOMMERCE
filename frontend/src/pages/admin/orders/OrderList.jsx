import { useState, useEffect } from "react";
import api from "../../../api";
import Pagination from "../../../components/Pagination";

const statusBadge = (s) => {
  const map = {
    pending: "bg-warning text-dark",
    confirmed: "bg-info text-dark",
    shipping: "bg-primary",
    completed: "bg-success",
    cancelled: "bg-danger",
  };
  return map[s] || "bg-secondary";
};

const statusLabel = (s) => {
  const map = {
    pending: "Cho xac nhan",
    confirmed: "Da xac nhan",
    shipping: "Dang giao",
    completed: "Da giao",
    cancelled: "Da huy",
  };
  return map[s] || s;
};

const nextStatuses = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipping", "cancelled"],
  shipping: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export default function OrderList() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);

  const fetchData = async (p) => {
    setLoading(true);
    try {
      const res = await api.get("/orders?page=" + p + "&limit=10");
      setData(res.data.data);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(page); }, [page]);

  const updateStatus = async (id, status) => {
    try {
      await api.put("/orders/" + id + "/status", { status });
      fetchData(page);
    } catch (err) { alert(err.response?.data?.message || "Loi"); }
  };

  return (
    <div>
      <h4 className="fw-bold mb-4"><i className="bi bi-truck me-2"></i>Quan ly Don hang</h4>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-dark"></div></div>
          ) : data.length === 0 ? (
            <p className="text-muted text-center py-4">Chua co don hang</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Ma DH</th>
                    <th>Khach hang</th>
                    <th>San pham</th>
                    <th>Tong tien</th>
                    <th>Trang thai</th>
                    <th>Thanh toan</th>
                    <th style={{ width: 80 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((order) => (
                    <tr key={order._id}>
                      <td className="small">#{order._id.slice(-8).toUpperCase()}</td>
                      <td>
                        <span className="fw-semibold small">{order.user?.fullName}</span>
                        <br /><span className="text-muted" style={{ fontSize: ".75rem" }}>{order.user?.email}</span>
                      </td>
                      <td className="small">{order.items?.length} SP</td>
                      <td className="fw-bold small">{order.finalAmount?.toLocaleString()}d</td>
                      <td>
                        <span className={"badge " + statusBadge(order.status)}>{statusLabel(order.status)}</span>
                      </td>
                      <td>
                        <span className={"badge bg-" + (order.paymentStatus === "paid" ? "success" : "warning") + " text-dark"}>
                          {order.paymentStatus === "paid" ? "Da TT" : "Chua TT"}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-dark" onClick={() => setDetail(detail?._id === order._id ? null : order)}>
                          <i className={"bi " + (detail?._id === order._id ? "bi-chevron-up" : "bi-chevron-down")}></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {detail && (
            <div className="mt-3 p-3 bg-light rounded">
              <h6 className="fw-bold mb-3">Chi tiet don hang #{detail._id.slice(-8).toUpperCase()}</h6>

              {/* Items */}
              <div className="table-responsive mb-3">
                <table className="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th>San pham</th>
                      <th>Don gia</th>
                      <th>SL</th>
                      <th>Thanh tien</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.productName}</td>
                        <td>{item.unitPrice?.toLocaleString()}d</td>
                        <td>{item.quantity}</td>
                        <td className="fw-bold">{item.subtotal?.toLocaleString()}d</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Shipping address */}
              {detail.shippingAddress && (
                <div className="small mb-3">
                  <span className="fw-semibold">Giao den: </span>
                  {detail.shippingAddress.receiverName} - {detail.shippingAddress.receiverPhone}
                  , {detail.shippingAddress.street}, {detail.shippingAddress.city}
                </div>
              )}

              {/* Status buttons */}
              <div className="d-flex gap-2 flex-wrap">
                {nextStatuses[detail.status]?.map((ns) => (
                  <button key={ns} className={"btn btn-sm " + (
                    ns === "cancelled" ? "btn-outline-danger" :
                    ns === "completed" ? "btn-success" :
                    ns === "confirmed" ? "btn-info text-dark" :
                    ns === "shipping" ? "btn-primary" : "btn-outline-dark"
                  )} onClick={() => updateStatus(detail._id, ns)}>
                    <i className={"bi " + (
                      ns === "cancelled" ? "bi-x-circle" :
                      ns === "completed" ? "bi-check-circle" :
                      "bi-arrow-right"
                    ) + " me-1"}></i>
                    {statusLabel(ns)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
}