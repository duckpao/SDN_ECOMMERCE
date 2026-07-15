import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAvatarSrc, readAvatarFile, validateAvatarFile } from "../../utils/avatar";

export default function EditProfileModal({
  show,
  onClose,
  user,
}) {
  const { updateProfile } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    avatar: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) return;

    setForm({
      fullName: user.fullName || "",
      phone: user.phone || "",
      avatar: user.avatar || "",
    });
    setErrors({});
  }, [user]);

  if (!show) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateAvatarFile(file);
    if (error) {
      setErrors({ ...errors, avatar: error });
      e.target.value = "";
      return;
    }

    try {
      const avatar = await readAvatarFile(file);
      setForm({ ...form, avatar });
      setErrors({ ...errors, avatar: "" });
    } catch {
      setErrors({ ...errors, avatar: "Khong doc duoc file avatar" });
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    const nextErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required";
    else if (form.fullName.trim().length < 2) nextErrors.fullName = "Full name must be at least 2 characters";
    else if (form.fullName.trim().length > 80) nextErrors.fullName = "Full name must be 80 characters or fewer";
    if (form.phone.trim() && !/^[0-9+\-\s()]{9,15}$/.test(form.phone.trim())) {
      nextErrors.phone = "Invalid phone number";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await updateProfile({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        avatar: form.avatar,
      });
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
                Avatar
              </label>
              <div className="avatar-preview mb-2">
                {form.avatar ? (
                  <img src={getAvatarSrc(form.avatar)} alt="Avatar preview" />
                ) : (
                  <i className="bi bi-person"></i>
                )}
              </div>
              <input
                type="file"
                className={`form-control ${errors.avatar ? "is-invalid" : ""}`}
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleAvatarChange}
              />
              {errors.avatar && <div className="invalid-feedback d-block">{errors.avatar}</div>}
            </div>

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
              {errors.fullName && <div className="text-danger small mt-1">{errors.fullName}</div>}
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
              {errors.phone && <div className="text-danger small mt-1">{errors.phone}</div>}
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
