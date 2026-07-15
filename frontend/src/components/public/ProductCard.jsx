/* eslint-disable react/prop-types */

export default function ProductCard({ product }) {
  const normalizeImage = (value) => {
    if (!value) return "/images/products/download.webp"; // Đổi về link này
    return value;
  };

  const imageSrc = normalizeImage(product.image);
  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;

  return (
    <div className="col-12 col-sm-6 col-lg-4">
      <div className="card h-100 border-0 shadow-sm overflow-hidden">
        <div className="position-relative bg-light" style={{ minHeight: "220px" }}>
          <img
            src={imageSrc}
            alt={product.name}
            className="card-img-top"
            style={{
              aspectRatio: "1 / 1",
              objectFit: "cover",
              minHeight: "220px",
              width: "100%",
            }}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/products/download.webp"; // Đổi về link này
            }}
          />
          {hasDiscount && (
            <span className="position-absolute top-0 start-0 badge bg-danger m-2">
              -{discountPercent}%
            </span>
          )}
        </div>
        <div className="card-body d-flex flex-column">
          <div className="mb-2">
            <h6 className="card-title mb-1 text-truncate" title={product.name}>{product.name}</h6>
            <p className="text-muted small mb-0">
              {product.brand?.name || "Thương hiệu"}
            </p>
          </div>

          <div className="mt-auto">
            {hasDiscount ? (
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-danger fs-5">{displayPrice.toLocaleString()}đ</span>
                <span className="text-muted text-decoration-line-through small">
                  {product.price.toLocaleString()}đ
                </span>
              </div>
            ) : (
              <span className="fw-bold text-dark fs-5">{displayPrice.toLocaleString()}đ</span>
            )}
            <div className="mt-2 text-muted small">
              <i className="bi bi-tag me-1"></i>
              {product.category?.name || "Danh mục"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}