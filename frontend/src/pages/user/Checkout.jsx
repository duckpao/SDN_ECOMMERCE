import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    receiverName: user?.fullName || "",
    receiverPhone: user?.phone || "",
    street: "",
    district: "",
    city: "",
    paymentMethod: "COD",
  });

  useEffect(() => {
    api.get("/carts/my-cart").then((r) => {
      setCart(r.data.data);
    }).catch(() => setCart(null)).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      const res = await api.post("/orders/checkout", {
        shippingAddress: {
          receiverName: form.receiverName,
          receiverPhone: form.receiverPhone,
          street: form.street,
          district: form.district,
          city: form.city,
        },
        paymentMethod: form.paymentMethod,
      });
      setSuccess(true);
      setTimeout(() => navigate("/my-orders"), 2000);
    } catch (error) {
      setErr(error.response?.data?.message || "Dat hang that bai");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-vh-100 bg-white d-flex align-items-center">
        <div className="container text-center">
          <i className="bi bi-check-circle text-success" style={{ fontSize: "4rem" }}></i>
          <h3 className="fw-bold mt-3">Dat hang thanh cong!</h3>
          <p className="text-muted">Dang chuyen den don hang cua ban...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        <button className="btn btn-outline-dark btn-sm mb-3" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-1"></i>Quay lai
        </button>
        <h4 className="fw-bold mb-4"><i className="bi bi-credit-card me-2"></i>Thanh toan</h4>

        <div className="row g-4">
          {/* Cart summary */}
          <div className="col-lg-5 order-lg-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="fw-bold mb-3">Don hang</h6>
                {loading ? (
                  <div className="text-center py-3"><div className="spinner-border spinner-border-sm text-dark"></div></div>
                ) : !cart || !cart.items || cart.items.length === 0 ? (
                  <p className="text-muted text-center py-3">Gio hang trong</p>
                ) : (
                  <>
                    {cart.items.map((item, idx) => (
                      <div key={idx} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                        <div>
                          <span className="fw-semibold small">{item.productName}</span>
                          <br /><span className="text-muted small">x{item.quantity}</span>
                        </div>
                        <span className="fw-bold small">{(item.unitPrice * item.quantity).toLocaleString()}d</span>
                      </div>
                    ))}
                    <div className="d-flex justify-content-between fw-bold pt-2">
                      <span>Tong cong</span>
                      <span className="text-danger">{cart.totalAmount?.toLocaleString()}d</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Shipping form */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3"><i className="bi bi-geo-alt me-2"></i>Dia chi nhan hang</h6>
                {err && <div className="alert alert-danger py-2 small">{err}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Nguoi nhan <span className="text-danger">*</span></label>
                      <input className="form-control" value={form.receiverName}
                        onChange={(e) => setForm({ ...form, receiverName: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">SDT nguoi nhan <span className="text-danger">*</span></label>
                      <input className="form-control" value={form.receiverPhone}
                        onChange={(e) => setForm({ ...form, receiverPhone: e.target.value })} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Dia chi <span className="text-danger">*</span></label>
                      <input className="form-control" value={form.street} placeholder="So nha, ten duong"
                        onChange={(e) => setForm({ ...form, street: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Phuong/Xa</label>
                      <input className="form-control" value={form.district}
                        onChange={(e) => setForm({ ...form, district: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Thanh pho <span className="text-danger">*</span></label>
                      <input className="form-control" value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Phuong thuc thanh toan</label>
                      <select className="form-select" value={form.paymentMethod}
                        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
                        <option value="COD">Thanh toan khi nhan hang (COD)</option>
                        <option value="BANKING">Chuyen khoan ngan hang</option>
                        <option value="MOMO">Vi MoMo</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-dark w-100 py-2 fw-semibold"
                        disabled={submitting || !cart || cart.items?.length === 0}>
                        {submitting ? (
                          <><span className="spinner-border spinner-border-sm me-2"></span>Dang xu ly...</>
                        ) : (
                          <><i className="bi bi-check-lg me-2"></i>Dat hang</>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}