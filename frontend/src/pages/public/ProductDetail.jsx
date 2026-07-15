import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0); // Tự động cuộn lên đầu trang khi vào
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Thay đổi đường dẫn API nếu backend của bạn khác nhé
        const res = await api.get(`/products/${id}`);
        const data = res.data.data;
        setProduct(data);
        setMainImage(data.image || "/images/products/download.webp");
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center min-vh-100 mt-5">
        <i className="bi bi-box-seam display-1 text-muted mb-3 d-block"></i>
        <h2 className="fw-bold">Không tìm thấy sản phẩm</h2>
        <p className="text-muted">Sản phẩm này có thể đã bị xóa hoặc không tồn tại.</p>
        <Link to="/products" className="btn btn-dark rounded-pill px-4 mt-3">
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;

  // Lọc ra danh sách ảnh hợp lệ
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  const handleIncrease = () => setQuantity(prev => (prev < product.stock ? prev + 1 : prev));

  return (
    <div className="bg-white min-vh-100 pb-5">
      {/* Breadcrumb */}
      <div className="bg-light py-3 border-bottom mb-5">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 small fw-medium">
              <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Trang chủ</Link></li>
              <li className="breadcrumb-item"><Link to="/products" className="text-decoration-none text-muted">Sản phẩm</Link></li>
              <li className="breadcrumb-item active text-dark text-truncate" style={{ maxWidth: "200px" }} aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container">
        <div className="row g-5">
          {/* CỘT TRÁI: HÌNH ẢNH SẢN PHẨM */}
          <div className="col-12 col-md-6">
            <div className="position-relative bg-light rounded-4 p-3 mb-3 border shadow-sm">
              <img
                src={mainImage}
                alt={product.name}
                className="img-fluid w-100 rounded-3"
                style={{ aspectRatio: "1/1", objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/products/download.webp";
                }}
              />
              {hasDiscount && (
                <span className="position-absolute top-0 end-0 badge bg-danger rounded-pill m-4 px-3 py-2 shadow-sm fs-6">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="d-flex gap-2 overflow-auto pb-2" style={{ scrollbarWidth: "thin" }}>
                {allImages.map((imgUrl, index) => (
                  <div
                    key={index}
                    className={`border rounded-3 p-1 cursor-pointer flex-shrink-0 ${mainImage === imgUrl ? 'border-dark shadow-sm' : 'border-light'}`}
                    style={{ width: "80px", height: "80px", cursor: "pointer", transition: "all 0.2s" }}
                    onClick={() => setMainImage(imgUrl)}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${index}`}
                      className="w-100 h-100 rounded-2"
                      style={{ objectFit: "cover" }}
                      onError={(e) => { e.target.onerror = null; e.target.src = "/images/products/download.webp"; }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CỘT PHẢI: THÔNG TIN SẢN PHẨM */}
          <div className="col-12 col-md-6">
            <div className="d-flex flex-column h-100">
              {/* Tên & Thương hiệu */}
              <div className="mb-4">
                {product.brand?.name && (
                  <span className="badge bg-light text-dark border px-3 py-2 rounded-pill mb-3 fw-semibold">
                    Thương hiệu: {product.brand.name}
                  </span>
                )}
                <h1 className="fw-black mb-2">{product.name}</h1>
                <div className="d-flex align-items-center gap-3 text-muted small">
                  <span>Đã bán: <strong className="text-dark">{product.soldQuantity || 0}</strong></span>
                  <span>|</span>
                  <span>Kho: <strong className={product.stock > 0 ? "text-success" : "text-danger"}>
                    {product.stock > 0 ? `${product.stock} sản phẩm` : "Hết hàng"}
                  </strong></span>
                </div>
              </div>

              {/* Giá */}
              <div className="bg-light p-4 rounded-4 mb-4">
                {hasDiscount ? (
                  <div className="d-flex align-items-baseline gap-3 flex-wrap">
                    <span className="fw-bold text-danger display-5 mb-0">
                      {displayPrice.toLocaleString()} ₫
                    </span>
                    <span className="text-muted text-decoration-line-through fs-5">
                      {product.price.toLocaleString()} ₫
                    </span>
                  </div>
                ) : (
                  <span className="fw-bold text-dark display-5 mb-0">
                    {displayPrice.toLocaleString()} ₫
                  </span>
                )}
              </div>

              {/* Mô tả ngắn */}
              <div className="mb-4">
                <h6 className="fw-bold mb-2">Mô tả sản phẩm:</h6>
                <p className="text-muted lh-lg">{product.description || "Đang cập nhật mô tả cho sản phẩm này."}</p>
              </div>

              {/* Nút Số lượng & Thêm vào giỏ hàng */}
              <div className="mt-auto">
                <div className="row g-3 align-items-center">
                  <div className="col-auto">
                    <div className="input-group flex-nowrap" style={{ width: "130px" }}>
                      <button className="btn btn-outline-dark" type="button" onClick={handleDecrease} disabled={product.stock === 0}>-</button>
                      <input type="text" className="form-control text-center bg-white border-dark text-dark fw-bold" value={quantity} readOnly />
                      <button className="btn btn-outline-dark" type="button" onClick={handleIncrease} disabled={product.stock === 0 || quantity >= product.stock}>+</button>
                    </div>
                  </div>
                  <div className="col">
                    <button
                      className="btn btn-dark btn-lg w-100 rounded-pill fw-semibold shadow-sm"
                      disabled={product.stock === 0}
                      onClick={() => alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`)}
                    >
                      {product.stock > 0 ? (
                        <><i className="bi bi-cart-plus me-2"></i>Thêm vào giỏ hàng</>
                      ) : (
                        "Tạm hết hàng"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}