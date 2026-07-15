import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders/my-orders");
      setOrders(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container py-5">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2>
          <i className="bi bi-bag-check me-2"></i>
          My Orders
        </h2>

        <Link
          to="/profile"
          className="btn btn-secondary"
        >
          Back Profile
        </Link>

      </div>

      <div className="card shadow-sm border-0">

        <div className="table-responsive">

          <table className="table table-hover align-middle mb-0">

            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-5"
                  >
                    No orders found
                  </td>
                </tr>
              )}

              {orders.map((item) => (
                <tr key={item._id}>
                  <td>{item._id.slice(-6)}</td>

                  <td>
                    <span className="badge bg-primary">
                      {item.status}
                    </span>
                  </td>

                  <td>{item.paymentMethod}</td>

                  <td>
                    {item.finalAmount?.toLocaleString()} ₫
                  </td>

                  <td>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}