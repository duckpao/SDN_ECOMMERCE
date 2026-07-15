import { useAuth } from "../../context/AuthContext";

export default function AddressInfo({
  user,
  onAdd,
  onEdit,
}) {
  const {
    deleteAddress,
    setDefaultAddress,
  } = useAuth();

  const addresses = user?.addresses || [];

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      await deleteAddress(id);
      alert("Address deleted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      alert("Default address updated");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="card shadow-sm border-0 mb-4">

      <div className="card-body">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h4 className="mb-0">
            <i className="bi bi-geo-alt me-2"></i>
            Address Book
          </h4>

          <button
            className="btn btn-primary btn-sm"
            onClick={onAdd}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Address
          </button>

        </div>

        {addresses.length === 0 ? (

          <div className="text-center py-4 text-muted">
            No address found
          </div>

        ) : (

          addresses.map((address) => (

            <div
              key={address._id}
              className="card border mb-3"
            >

              <div className="card-body">

                <div className="d-flex justify-content-between">

                  <div>

                    <h5 className="mb-2">

                      {address.receiverName}

                      {address.isDefault && (
                        <span className="badge bg-success ms-2">
                          Default
                        </span>
                      )}

                    </h5>

                    <div className="text-muted mb-1">
                      {address.receiverPhone}
                    </div>

                    <div>
                      {[
                        address.street,
                        address.district,
                        address.city,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </div>

                  </div>

                  <div className="d-flex gap-2 align-items-start">

                    {!address.isDefault && (
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() =>
                          handleSetDefault(address._id)
                        }
                      >
                        Default
                      </button>
                    )}

                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => onEdit(address)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() =>
                        handleDelete(address._id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}