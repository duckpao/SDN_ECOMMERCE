import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import Pagination from "../../components/Pagination";

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

export default function MyOrders() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchData = async (p) => {
    setLoading(true);
    try {
      const res = await api.get("/orders/my-orders?page=" + p + "&limit=10");
      setData(res.data.data);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(page); }, [page]);

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0"><i className="bi bi-receipt me-2"></i>Don hang cua toi</h4>
          <Link to="/" className="btn btn-outline-dark btn-sm">
            <i className="bi bi-arrow-left me-1"></i>Tiep tuc mua sam
          </Link>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-dark"></div></div>
            ) : data.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-inbox text-muted" style={{ fontSize: "3rem" }}></i>
                <p className="text-muted mt-2">Ban chua co don hang nao</p>
                <Link to="/" className="btn btn-dark btn-sm">Mua ngay</Link>
              </div>
            ) : (
              <>
                {data.map((order) => (
                  <div key={order._id} className="border rounded p-3 mb-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <span className="fw-bold">#{order._id.slice(-8).toUpperCase()}</span>
                        <span className="text-muted small ms-2">
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <span className={"badge " + statusBadge(order.status)}>{statusLabel(order.status)}</span>
                    </div>
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="d-flex justify-content-between align-items-center small py-1 border-bottom">
                        <span>{item.productName} x{item.quantity}</span>
                        <span className="fw-semibold">{(item.unitPrice * item.quantity).toLocaleString()}d</span>
                      </div>
                    ))}
                    <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                      <div>
                        <span className="small text-muted">
                          <i className="bi bi-credit-card me-1"></i>{order.paymentMethod}
                        </span>
                        <span className="small text-muted ms-3">
                          <span className={"badge bg-" + (order.paymentStatus === "paid" ? "success" : "warning") + " text-dark"}>
                            {order.paymentStatus === "paid" ? "Da thanh toan" : "Chua thanh toan"}
                          </span>
                        </span>
                      </div>
                      <span className="fw-bold text-danger fs-5">{order.finalAmount?.toLocaleString()}d</span>
                    </div>
                    {order.shippingAddress && (
                      <div className="small text-muted mt-1">
                        <i className="bi bi-geo-alt me-1"></i>
                        {order.shippingAddress.receiverName} - {order.shippingAddress.receiverPhone}
                        , {order.shippingAddress.street}, {order.shippingAddress.city}
                      </div>
                    )}
                  </div>
                ))}
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}