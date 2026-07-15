import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function EditProfileModal({
  show,
  onClose,
  user,
}) {
  const { updateProfile } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
  });

  useEffect(() => {
    if (!user) return;

    setForm({
      fullName: user.fullName || "",
      phone: user.phone || "",
    });
  }, [user]);

  if (!show) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await updateProfile(form);
      alert("Profile updated successfully");
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="modal fade show d-block">
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">
              Edit Profile
            </h5>

            <button
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">

            <div className="mb-3">
              <label className="form-label">
                Full Name
              </label>

              <input
                type="text"
                className="form-control"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Phone
              </label>

              <input
                type="text"
                className="form-control"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="modal-footer">

            <button
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={handleSave}
            >
              Save
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}