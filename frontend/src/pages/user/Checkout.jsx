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
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [form, setForm] = useState({
    receiverName: "",
    receiverPhone: "",
    street: "",
    district: "",
    city: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cartRes, userRes] = await Promise.all([
        api.get("/carts/my-cart"),
        api.get("/users/profile"),
      ]);
      setCart(cartRes.data.data);
      const addrs = userRes.data.data?.addresses || [];
      setAddresses(addrs);
      const def = addrs.find((a) => a.isDefault) || addrs[0];
      setSelectedAddress(def?._id || null);
      if (def) {
        setForm({
          receiverName: def.receiverName || "",
          receiverPhone: def.receiverPhone || "",
          street: def.street || "",
          district: def.district || "",
          city: def.city || "",
        });
      }
    } catch (err) {
      console.error(err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (addr) => {
    setSelectedAddress(addr._id);
    setForm({
      receiverName: addr.receiverName || "",
      receiverPhone: addr.receiverPhone || "",
      street: addr.street || "",
      district: addr.district || "",
      city: addr.city || "",
    });
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.receiverName || !form.receiverPhone || !form.street || !form.district || !form.city) {
      alert("Please fill in all shipping info");
      return;
    }

    try {
      setSubmitting(true);
      const shippingAddress = {
        receiverName: form.receiverName,
        receiverPhone: form.receiverPhone,
        street: form.street,
        district: form.district,
        city: form.city,
      };
      await api.post("/orders", { shippingAddress, paymentMethod });
      alert("Order placed successfully!");
      navigate("/my-orders");
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="container py-5 text-center">Loading...</div>;

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3 className="mb-4">Your cart is empty</h3>
        <button className="btn btn-dark rounded-pill px-4" onClick={() => navigate("/products")}>
          Shop now
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Checkout</h2>
      <div className="row">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-geo-alt me-2"></i>Shipping Address
            </h5>

            {addresses.length > 0 && (
              <div className="mb-3">
                {addresses.map((addr) => {
                  const isSel = selectedAddress === addr._id;
                  const cls = "border rounded-3 p-3 mb-2 cursor-pointer" + (isSel ? " border-dark bg-light" : "");
                  return (
                    <div
                      key={addr._id}
                      className={cls}
                      onClick={() => handleAddressSelect(addr)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong>{addr.receiverName}</strong>
                          {addr.isDefault && (
                            <span className="badge bg-dark ms-2">Default</span>
                          )}
                        </div>
                      </div>
                      <div className="small text-muted">
                        {addr.street}, {addr.district}, {addr.city}
                      </div>
                      <div className="small text-muted">{addr.receiverPhone}</div>
                    </div>
                  );
                })}
              </div>
            )}

            <form>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small">Receiver</label>
                  <input
                    name="receiverName"
                    className="form-control"
                    value={form.receiverName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Phone</label>
                  <input
                    name="receiverPhone"
                    className="form-control"
                    value={form.receiverPhone}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small">Address</label>
                  <input
                    name="street"
                    className="form-control"
                    placeholder="Street, house number"
                    value={form.street}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">District</label>
                  <input
                    name="district"
                    className="form-control"
                    value={form.district}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">City</label>
                  <input
                    name="city"
                    className="form-control"
                    value={form.city}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-credit-card me-2"></i>Payment Method
            </h5>
            <div className="d-flex gap-3">
              {["COD", "BANKING", "MOMO"].map((method) => (
                <button
                  key={method}
                  type="button"
                  className={"btn " + (paymentMethod === method ? "btn-dark" : "btn-outline-dark") + " rounded-pill px-4"}
                  onClick={() => setPaymentMethod(method)}
                >
                  {method === "COD"
                    ? "Cash"
                    : method === "BANKING"
                    ? "Bank Transfer"
                    : "MOMO"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-3">Order Summary</h5>
            {cart.items.map((item) => (
              <div key={item.product._id} className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={item.product.image}
                    alt={item.productName}
                    style={{ width: 48, height: 48, objectFit: "cover" }}
                    className="rounded-2"
                  />
                  <div>
                    <div className="small fw-semibold">{item.productName}</div>
                    <div className="small text-muted">x{item.quantity}</div>
                  </div>
                </div>
                <div className="fw-bold">
                  {item.subtotal.toLocaleString()} VND
                </div>
              </div>
            ))}
            <div className="d-flex justify-content-between fw-bold fs-5 mt-3">
              <span>Total</span>
              <span>{cart.totalAmount.toLocaleString()} VND</span>
            </div>
            <button
              className="btn btn-dark w-100 rounded-pill mt-4 py-2"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
