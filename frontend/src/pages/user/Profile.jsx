import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { getAvatarSrc } from "../../utils/avatar";

import ProfileInfo from "./ProfileInfo";
import AddressInfo from "./AddressInfo";
import OrderSummary from "./OrderSummary";
import EditProfileModal from "./EditProfileModal";
import EditAddressModal from "./EditAddressModal";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <i className="bi bi-shop me-2"></i>
            SDN Ecommerce
          </Link>

          <div className="d-flex align-items-center gap-3">
            {user.role === "admin" && (
              <Link to="/admin" className="btn btn-outline-light btn-sm">
                Admin
              </Link>
            )}

            <span className="text-white">
              {user.avatar ? (
                <img className="avatar-xs me-1" src={getAvatarSrc(user.avatar)} alt={user.fullName} />
              ) : (
                <i className="bi bi-person-circle me-1"></i>
              )}
              {user.fullName}
            </span>

            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                {user.avatar ? (
                  <img className="avatar-xl mx-auto mb-3" src={getAvatarSrc(user.avatar)} alt={user.fullName} />
                ) : (
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{
                      width: 90,
                      height: 90,
                      fontSize: 35,
                      fontWeight: "bold",
                    }}
                  >
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                )}

                <h4>{user.fullName}</h4>

                <p className="text-muted">{user.role}</p>

                <hr />

                <p>
                  <strong>Email</strong>
                  <br />
                  {user.email}
                </p>

                <p>
                  <strong>Phone</strong>
                  <br />
                  {user.phone || "Not updated"}
                </p>

                <p>
                  <strong>Status</strong>
                  <br />
                  {user.isActive ? (
                    <span className="text-success">Active</span>
                  ) : (
                    <span className="text-danger">Disabled</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <ProfileInfo user={user} onEdit={() => setShowProfileModal(true)} />

            <AddressInfo
              user={user}
              onAdd={() => {
                setSelectedAddress(null);
                setShowAddressModal(true);
              }}
              onEdit={(address) => {
                setSelectedAddress(address);
                setShowAddressModal(true);
              }}
            />
            <EditAddressModal
              show={showAddressModal}
              onClose={() => {
                setShowAddressModal(false);
                setSelectedAddress(null);
              }}
              user={user}
              address={selectedAddress}
            />

            <OrderSummary />
          </div>
        </div>
      </div>

      <EditProfileModal
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
      />

      <EditAddressModal
        show={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setSelectedAddress(null);
        }}
        user={user}
        address={selectedAddress}
      />
    </div>
  );
}
