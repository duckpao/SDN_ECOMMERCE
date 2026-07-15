import { Link } from "react-router-dom";

export default function OrderSummary() {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">

        <div className="d-flex justify-content-between align-items-center">

          <div>
            <h4 className="mb-2">
              <i className="bi bi-bag-check me-2"></i>
              My Orders
            </h4>

            <p className="text-muted mb-0">
              View your order history and track your purchases.
            </p>
          </div>

          <Link
            to="/orders"
            className="btn btn-success"
          >
            <i className="bi bi-arrow-right-circle me-2"></i>
            View Orders
          </Link>

        </div>

      </div>
    </div>
  );
}