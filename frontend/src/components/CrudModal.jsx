export default function CrudModal({ show, title, children, onSubmit, onCancel, submitLabel, submitting }) {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onCancel}></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">{title}</h5>
              <button type="button" className="btn-close" onClick={onCancel}></button>
            </div>
            <form onSubmit={onSubmit}>
              <div className="modal-body">{children}</div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-outline-dark" onClick={onCancel}>
                  Huy
                </button>
                <button type="submit" className="btn btn-dark" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1"></span>Dang luu...
                    </>
                  ) : (
                    <>{submitLabel || "Luu"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}