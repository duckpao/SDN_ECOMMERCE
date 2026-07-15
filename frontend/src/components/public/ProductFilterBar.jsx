/* eslint-disable react/prop-types */

export default function ProductFilterBar({
  search,
  setSearch,
  sortBy,
  setSortBy,
  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
  brands,
  categories,
}) {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-4">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-4">
            <label htmlFor="product-search" className="form-label text-muted small fw-semibold text-uppercase mb-1">
              <i className="bi bi-search me-1"></i> Tìm kiếm
            </label>
            <input
              id="product-search"
              type="text"
              className="form-control bg-light border-0 rounded-3 py-2"
              placeholder="Nhập tên sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-12 col-sm-6 col-lg-2">
            <label htmlFor="product-sort" className="form-label text-muted small fw-semibold text-uppercase mb-1">
              Sắp xếp
            </label>
            <select id="product-sort" className="form-select bg-light border-0 rounded-3 py-2" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Mới nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="name-asc">Tên A-Z</option>
            </select>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <label htmlFor="product-brand" className="form-label text-muted small fw-semibold text-uppercase mb-1">
              Thương hiệu
            </label>
            <select
              id="product-brand"
              className="form-select bg-light border-0 rounded-3 py-2"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="">Tất cả thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <label htmlFor="product-category" className="form-label text-muted small fw-semibold text-uppercase mb-1">
              Danh mục
            </label>
            <select
              id="product-category"
              className="form-select bg-light border-0 rounded-3 py-2"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}