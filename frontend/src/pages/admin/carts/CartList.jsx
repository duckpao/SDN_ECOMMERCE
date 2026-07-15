import { useState, useEffect } from "react";
import api from "../../../api";
import Pagination from "../../../components/Pagination";
import ConfirmModal from "../../../components/ConfirmModal";

export default function CartList() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [disableTarget, setDisableTarget] = useState(null);

  const fetchData = async (p) => {
    setLoading(true);
    try {
      const res = await api.get("/carts?page=" + p + "&limit=10");
      setData(res.data.data);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(page); }, [page]);

  const confirmDisable = (cart) => { setDisableTarget(cart); setShowConfirm(true); };

  const handleDisable = async () => {
    try {
      await api.delete("/carts/" + disableTarget._id);
      setShowConfirm(false); setDisableTarget(null);
      fetchData(page);
    } catch (err) { alert(err.response?.data?.message || "Loi"); }
  };

  return (
    <div>
      <h4 className="fw-bold mb-4"><i className="bi bi-cart me-2"></i>Quan ly Gio hang</h4>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : data.length === 0 ? (
            <p className="text-muted text-center py-4">Chua co gio hang</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Nguoi dung</th>
                    <th>So luong SP</th>
                    <th>Tong tien</th>
                    <th style={{ width: 100 }}>Chi tiet</th>
                    <th style={{ width: 80 }}>An</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((cart) => (
                    <tr key={cart._id}>
                      <td>
                        <span className="fw-semibold">{cart.user?.fullName || "N/A"}</span>
                        <br /><span className="small text-muted">{cart.user?.email}</span>
                      </td>
                      <td>{cart.items?.length || 0}</td>
                      <td className="fw-bold">{(cart.totalAmount || 0).toLocaleString()}d</td>
                      <td>
                        <button className="btn btn-sm btn-outline-dark"
                          onClick={() => setDetail(detail?._id === cart._id ? null : cart)}>
                          <i className={"bi " + (detail?._id === cart._id ? "bi-chevron-up" : "bi-chevron-down")}></i>
                        </button>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => confirmDisable(cart)} title="An">
                          <i className="bi bi-eye-slash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {detail && (
            <div className="mt-3 p-3 bg-light rounded">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-receipt me-1"></i>
                Chi tiet gio hang - {detail.user?.fullName}
              </h6>
              <div className="table-responsive">
                <table className="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th>San pham</th>
                      <th>Don gia</th>
                      <th>SL</th>
                      <th>Thanh tien</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.productName || item.product?.name}</td>
                        <td>{item.unitPrice?.toLocaleString()}d</td>
                        <td>{item.quantity}</td>
                        <td className="fw-bold">{item.subtotal?.toLocaleString()}d</td>
                      </tr>
                    ))}
                    <tr className="table-active fw-bold">
                      <td colSpan="3" className="text-end">Tong cong:</td>
                      <td>{detail.totalAmount?.toLocaleString()}d</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-3">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>
      </div>

      <ConfirmModal show={showConfirm} title="Vo hieu hoa gio hang"
        message={"Ban co chac muon an gio hang cua \"" + (disableTarget?.user?.fullName || "") + "\"?"}
        onConfirm={handleDisable} onCancel={() => { setShowConfirm(false); setDisableTarget(null); }} />
    </div>
  );
}