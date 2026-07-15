import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function EditAddressModal({ show, onClose, user, address }) {
  const { addAddress, updateAddress } = useAuth();

  const [form, setForm] = useState({
    receiverName: "",
    receiverPhone: "",
    street: "",
    district: "",
    city: "",
  });

  useEffect(() => {
    if (!show) return;

    if (address) {
      setForm({
        receiverName: address.receiverName || "",
        receiverPhone: address.receiverPhone || "",
        street: address.street || "",
        district: address.district || "",
        city: address.city || "",
      });
    } else {
      setForm({
        receiverName: "",
        receiverPhone: "",
        street: "",
        district: "",
        city: "",
      });
    }
  }, [address, show]);

  if (!show) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      if (address) {
        await updateAddress(address._id, form);
        alert("Address updated successfully");
      } else {
        await addAddress(form);
        alert("Address added successfully");
      }

      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  return (
    <div className="modal fade show d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {address ? "Edit Address" : "Add Address"}
            </h5>

            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Receiver</label>
              <input
                className="form-control"
                name="receiverName"
                value={form.receiverName}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                className="form-control"
                name="receiverPhone"
                value={form.receiverPhone}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Street</label>
              <input
                className="form-control"
                name="street"
                value={form.street}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">District</label>
              <input
                className="form-control"
                name="district"
                value={form.district}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">City</label>
              <input
                className="form-control"
                name="city"
                value={form.city}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
