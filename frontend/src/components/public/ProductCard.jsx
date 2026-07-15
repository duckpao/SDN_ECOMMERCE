/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const normalizeImage = (value) => {
    if (!value) return "/images/products/download.webp";
    return value;
  };

  const imageSrc = normalizeImage(product.image);
  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;

  return (
    <div className="col-6 col-md-4 col-lg-3">
      {/* Đã bọc thẻ Link ở đây để trỏ sang trang Chi tiết sản phẩm */}
      <Link to={`/products/${product._id}`} className="text-decoration-none text-dark d-block h-100">
        <div
          className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden"
          style={{ cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.classList.add('shadow');
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.classList.remove('shadow');
          }}
        >
          <div className="position-relative bg-white p-3 pb-0">
            <img
              src={imageSrc}
              alt={product.name}
              className="card-img-top rounded-4"
              style={{
                aspectRatio: "1 / 1",
                objectFit: "cover",
                width: "100%",
              }}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/products/download.webp";
              }}
            />
            {hasDiscount && (
              <span className="position-absolute top-0 end-0 badge bg-danger rounded-pill m-3 px-2 py-1 shadow-sm">
                -{discountPercent}%
              </span>
            )}
          </div>
          <div className="card-body p-3 d-flex flex-column">
            <div className="mb-2">
              <p className="text-muted small mb-1">
                {product.brand?.name || "Thương hiệu"}
              </p>
              <h6 className="card-title mb-1 text-truncate fw-semibold" title={product.name}>
                {product.name}
              </h6>
            </div>

            <div className="mt-auto">
              {hasDiscount ? (
                <div className="d-flex flex-column">
                  <span className="fw-bold text-danger fs-5">{displayPrice.toLocaleString()} ₫</span>
                  <span className="text-muted text-decoration-line-through small">
                    {product.price.toLocaleString()} ₫
                  </span>
                </div>
              ) : (
                <span className="fw-bold text-dark fs-5 mt-3 d-block">{displayPrice.toLocaleString()} ₫</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}