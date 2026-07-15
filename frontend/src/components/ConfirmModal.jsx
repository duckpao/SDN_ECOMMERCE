export default function ConfirmModal({ show, title, message, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onCancel}></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">
                <i className="bi bi-exclamation-triangle text-danger me-2"></i>
                {title || "Xac nhan"}
              </h5>
              <button type="button" className="btn-close" onClick={onCancel}></button>
            </div>
            <div className="modal-body">{message || "Ban co chac chan?"}</div>
            <div className="modal-footer border-0">
              <button className="btn btn-outline-dark" onClick={onCancel}>
                Huy
              </button>
              <button className="btn btn-danger" onClick={onConfirm}>
                <i className="bi bi-eye-slash me-1"></i>An
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}