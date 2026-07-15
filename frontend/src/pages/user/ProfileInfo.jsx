import { getAvatarSrc } from "../../utils/avatar";

export default function ProfileInfo({ user, onEdit }) {
  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-3">
            {user.avatar ? (
              <img className="avatar-md" src={getAvatarSrc(user.avatar)} alt={user.fullName} />
            ) : (
              <span className="avatar-md avatar-fallback">
                <i className="bi bi-person"></i>
              </span>
            )}
            <h4 className="mb-0">
              <i className="bi bi-person-vcard me-2"></i>
              Personal Information
            </h4>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={onEdit}
          >
            <i className="bi bi-pencil-square me-2"></i>
            Edit Profile
          </button>
        </div>

        <table className="table table-borderless align-middle mb-0">
          <tbody>

            <tr>
              <td width="180">
                <strong>Full Name</strong>
              </td>
              <td>{user.fullName}</td>
            </tr>

            <tr>
              <td>
                <strong>Email</strong>
              </td>
              <td>{user.email}</td>
            </tr>

            <tr>
              <td>
                <strong>Phone</strong>
              </td>
              <td>{user.phone || "Not updated"}</td>
            </tr>

            <tr>
              <td>
                <strong>Role</strong>
              </td>
              <td>
                <span className="badge bg-dark">
                  {user.role}
                </span>
              </td>
            </tr>

            <tr>
              <td>
                <strong>Status</strong>
              </td>
              <td>
                {user.isActive ? (
                  <span className="badge bg-success">
                    Active
                  </span>
                ) : (
                  <span className="badge bg-danger">
                    Disabled
                  </span>
                )}
              </td>
            </tr>

          </tbody>
        </table>

      </div>
    </div>
  );
}
