import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

const BADGES = {
  pending: "bg-warning text-dark",
  confirmed: "bg-info text-dark",
  shipping: "bg-primary",
  completed: "bg-success",
  cancelled: "bg-secondary",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders/my-orders");
      setOrders(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-bag-check me-2"></i>
          My Orders
        </h2>
        <Link to="/profile" className="btn btn-secondary">
          Back Profile
        </Link>
      </div>

      <div className="card shadow-sm border-0">
        {orders.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-inbox display-4 text-muted mb-3 d-block"></i>
            <p className="text-muted">No orders found</p>
            <Link to="/products" className="btn btn-dark rounded-pill px-4">
              Shop now
            </Link>
          </div>
        ) : (
          orders.map((item) => (
            <div key={item._id} className="border-bottom p-4">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <span className="fw-bold">#{item._id.slice(-8)}</span>
                  {/* BUG 2 FIX: Status badge with proper color */}
                  <span className={"badge ms-2 " + (BADGES[item.status] || "bg-secondary")}>
                    {item.status}
                  </span>
                  <span className="ms-2 text-muted small">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-end">
                  <div className="fw-bold fs-5">{item.finalAmount?.toLocaleString()} VND</div>
                  <div className="small text-muted">{item.paymentMethod}</div>
                </div>
              </div>
              {/* BUG 3 FIX: Show order items */}
              <div className="small text-muted mb-2">
                {item.shippingAddress?.receiverName} - {item.shippingAddress?.street}, {item.shippingAddress?.city}
              </div>
              <details className="small">
                <summary className="text-primary" style={{ cursor: "pointer" }}>
                  {item.items?.length || 0} item(s)
                </summary>
                <div className="mt-2 ps-3">
                  {item.items?.map((oi, idx) => (
                    <div key={idx} className="d-flex justify-content-between mb-1">
                      <span>{oi.productName} x{oi.quantity}</span>
                      <span className="fw-semibold">{oi.subtotal?.toLocaleString()} VND</span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
