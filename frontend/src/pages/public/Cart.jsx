/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      setLoading(true);
      // Gọi đúng API lấy giỏ hàng của user
      const res = await api.get("/carts/my-cart");
      setCart(res.data.data);
    } catch (error) {
      console.error("Lỗi tải giỏ hàng:", error);
      setCart(null); // Đảm bảo nếu lỗi thì cart là null để hiện thông báo trống
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId, currentQuantity, change) => {
    // Nếu số lượng hiện tại là 1 mà còn đòi trừ tiếp thì chặn luôn
    if (currentQuantity + change < 1) return;

    try {
      // Gọi API cộng thêm hoặc trừ đi đúng 1 đơn vị (biến change)
      await api.post("/carts/add", { productId, quantity: change });
      fetchCart(); // Load lại giỏ hàng để cập nhật số tiền
    } catch (error) {
      alert("Cập nhật thất bại");
    }
  };

  const handleRemove = async (productId) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      // Dùng hàm removeItem trong controller bạn đã tạo
      await api.delete(`/carts/remove/${productId}`);
      fetchCart();
    } catch (error) {
      alert("Xóa thất bại");
    }
  };

  if (loading) return <div className="text-center py-5">Đang tải giỏ hàng...</div>;

  // Thay vì chỉ check !cart
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3 className="mb-4">Giỏ hàng của bạn đang trống</h3>
        <Link to="/products" className="btn btn-dark rounded-pill px-4">Mua sắm ngay</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Giỏ hàng của bạn</h2>
      <div className="row">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            {cart.items.map((item) => (
              <div key={item.product._id} className="row align-items-center mb-4 pb-4 border-bottom">
                <div className="col-3 col-md-2">
                  <img src={item.product.image} alt={item.productName} className="img-fluid rounded-3" />
                </div>
                <div className="col-9 col-md-10">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="fw-bold">{item.productName}</h6>
                      <p className="text-muted small">{item.unitPrice.toLocaleString()} ₫</p>
                    </div>
                    <button className="btn btn-link text-danger" onClick={() => handleRemove(item.product._id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                  <div className="d-flex align-items-center gap-3 mt-2">
                    {/* Nút trừ: Truyền change là -1 */}
                    <button
                      className="btn btn-sm btn-outline-dark"
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity, -1)}
                    >-</button>

                    <span className="fw-bold">{item.quantity}</span>

                    {/* Nút cộng: Truyền change là 1 */}
                    <button
                      className="btn btn-sm btn-outline-dark"
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity, 1)}
                    >+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-3">Tóm tắt đơn hàng</h5>
            <div className="d-flex justify-content-between mb-2">
              <span>Tổng tiền:</span>
              <span className="fw-bold">{cart?.totalAmount?.toLocaleString() || 0} ₫</span>
            </div>
            <Link to="/checkout" className="btn btn-dark w-100 rounded-pill mt-3">Thanh toán</Link>
          </div>
        </div>
      </div>
    </div>
  );
}