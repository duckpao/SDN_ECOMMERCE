import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";

const emptyAddress = { receiverName: "", receiverPhone: "", street: "", district: "", city: "" };

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [cartResponse, profileResponse] = await Promise.all([api.get("/carts/my-cart"), api.get("/users/profile")]);
        const loadedCart = cartResponse.data.data;
        if (!loadedCart?.items?.length) {
          navigate("/cart", { replace: true });
          return;
        }
        setCart(loadedCart);
        const addresses = profileResponse.data.data?.addresses || [];
        const defaultAddress = addresses.find((item) => item.isDefault) || addresses[0];
        if (defaultAddress) {
          const { receiverName, receiverPhone, street, district, city } = defaultAddress;
          setAddress({ receiverName, receiverPhone, street, district, city });
        }
      } catch (err) {
        setError(err.response?.data?.message || "Không thể tải thông tin thanh toán");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/orders/checkout", { shippingAddress: address, paymentMethod });
      navigate("/orders", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Đặt hàng thất bại, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container py-5 text-center">Đang tải thanh toán...</div>;
  if (!cart) return <div className="container py-5 text-center text-danger">{error}</div>;

  return <div className="container py-5">
    <div className="d-flex justify-content-between align-items-center mb-4"><h2 className="fw-bold mb-0">Thanh toán</h2><Link to="/cart" className="btn btn-outline-secondary">Quay lại giỏ hàng</Link></div>
    <form onSubmit={submit} className="row g-4">
      <div className="col-lg-7">
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <h5 className="fw-bold mb-3">Địa chỉ nhận hàng</h5>
          <div className="row g-3">
            {[['receiverName', 'Họ và tên'], ['receiverPhone', 'Số điện thoại'], ['street', 'Địa chỉ'], ['district', 'Quận/Huyện'], ['city', 'Tỉnh/Thành phố']].map(([name, label]) => <div className={name === 'street' ? 'col-12' : 'col-md-6'} key={name}><label className="form-label">{label}</label><input required className="form-control" value={address[name]} onChange={(event) => setAddress({ ...address, [name]: event.target.value })} /></div>)}
          </div>
          <h5 className="fw-bold mt-4 mb-3">Phương thức thanh toán</h5>
          {[['COD', 'Thanh toán khi nhận hàng'], ['BANKING', 'Chuyển khoản ngân hàng'], ['MOMO', 'Ví MoMo']].map(([value, label]) => <div className="form-check mb-2" key={value}><input className="form-check-input" type="radio" name="payment" id={value} checked={paymentMethod === value} onChange={() => setPaymentMethod(value)} /><label className="form-check-label" htmlFor={value}>{label}</label></div>)}
        </div>
      </div>
      <div className="col-lg-5"><div className="card border-0 shadow-sm rounded-4 p-4"><h5 className="fw-bold mb-3">Đơn hàng của bạn</h5>{cart.items.map((item) => <div className="d-flex justify-content-between small mb-2" key={item.product._id}><span>{item.productName} × {item.quantity}</span><span>{item.subtotal.toLocaleString()} ₫</span></div>)}<hr /><div className="d-flex justify-content-between fw-bold fs-5"><span>Tổng cộng</span><span>{cart.totalAmount.toLocaleString()} ₫</span></div>{error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}<button disabled={submitting} className="btn btn-dark w-100 rounded-pill mt-4">{submitting ? 'Đang xử lý...' : 'Đặt hàng'}</button></div></div>
    </form>
  </div>;
}
