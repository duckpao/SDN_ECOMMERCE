import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = "http://localhost:9999/products";
// Giả định bạn có sẵn 2 API này để lấy danh sách đưa vào thẻ <select>
const CATEGORY_API_URL = "http://localhost:9999/categories?limit=100"; 
const BRAND_API_URL = "http://localhost:9999/brands?limit=100";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Thêm Sản phẩm Mới");
  
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
    discountPrice: 0,
    stock: 0,
    image: "",
    category: "",
    brand: "",
    isActive: true
  });

  // Load danh sách danh mục & thương hiệu 1 lần khi mở trang
  useEffect(() => {
    fetchOptions();
  }, []);

  // Load dữ liệu sản phẩm mỗi khi đổi trang hoặc tìm kiếm
  useEffect(() => {
    fetchProducts(page, search);
  }, [page, search]);

  const showAlert = (message, type = "danger") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3000);
  };

  const fetchOptions = async () => {
    try {
      const [resCat, resBrand] = await Promise.all([
        fetch(CATEGORY_API_URL),
        fetch(BRAND_API_URL).catch(() => null) // Bỏ qua lỗi nếu chưa có API brand
      ]);
      if (resCat.ok) {
        const catJson = await resCat.json();
        setCategories(catJson.data || []);
      }
      if (resBrand && resBrand.ok) {
        const brandJson = await resBrand.json();
        setBrands(brandJson.data || []);
      }
    } catch (error) {
      console.log("Không thể tải danh sách Category/Brand");
    }
  };

  const fetchProducts = async (currentPage, currentSearch) => {
    try {
      const res = await fetch(`${API_URL}?page=${currentPage}&limit=5&search=${currentSearch}`);
      const json = await res.json();
      if (res.ok) {
        setProducts(json.data);
        setTotalPages(json.totalPages);
        setPage(json.page);
      } else {
        showAlert(json.message);
      }
    } catch (error) {
      showAlert("Lỗi kết nối máy chủ!");
    }
  };

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const openCreateModal = () => {
    setModalTitle("Thêm Sản phẩm Mới");
    setFormData({
      id: "", name: "", description: "", price: 0, discountPrice: 0, stock: 0, 
      image: "", category: categories[0]?._id || "", brand: brands[0]?._id || "", isActive: true
    });
    setShowModal(true);
  };

  const openEditModal = async (id) => {
    setModalTitle("Chỉnh sửa Sản phẩm");
    try {
      const res = await fetch(`${API_URL}/${id}`);
      const json = await res.json();
      if (res.ok) {
        const prod = json.data;
        setFormData({
          id: prod._id,
          name: prod.name,
          description: prod.description || "",
          price: prod.price,
          discountPrice: prod.discountPrice || 0,
          stock: prod.stock || 0,
          image: prod.image || "",
          // Backend trả về populate object, ta cần trích xuất _id để bind vào thẻ <select>
          category: prod.category?._id || prod.category || "",
          brand: prod.brand?._id || prod.brand || "",
          isActive: prod.isActive,
        });
        setShowModal(true);
      } else {
        showAlert(json.message);
      }
    } catch (error) {
      showAlert("Lỗi khi lấy thông tin sản phẩm!");
    }
  };

  const closeModal = () => setShowModal(false);

  const saveProduct = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      alert("Vui lòng nhập đủ các trường bắt buộc (Tên, Giá, Category)!");
      return;
    }

    const method = formData.id ? "PUT" : "POST";
    const url = formData.id ? `${API_URL}/${formData.id}` : API_URL;

    // Loại bỏ các trường ID rỗng để Mongoose không báo lỗi CastError
    const payload = { ...formData };
    if (!payload.brand) delete payload.brand;
    delete payload.id;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (res.ok) {
        showAlert(formData.id ? "Cập nhật thành công!" : "Thêm mới thành công!", "success");
        closeModal();
        fetchProducts(page, search);
      } else {
        showAlert(json.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      showAlert("Lỗi kết nối khi lưu dữ liệu!");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm này không?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const json = await res.json();

      if (res.ok) {
        showAlert("Xóa thành công!", "success");
        fetchProducts(page, search);
      } else {
        showAlert(json.message);
      }
    } catch (error) {
      showAlert("Lỗi kết nối khi xóa dữ liệu!");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📦 Quản lý Sản phẩm</h2>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <i className="bi bi-plus-circle me-1"></i> Thêm mới
        </button>
      </div>

      {alert.show && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      <div className="row mb-3">
        <div className="col-md-5">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tên sản phẩm để tìm..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn btn-outline-secondary" onClick={handleSearch}>Tìm kiếm</button>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body overflow-auto">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Ảnh</th>
                <th>Sản phẩm</th>
                <th>Giá bán</th>
                <th>Tồn kho</th>
                <th>Danh mục</th>
                <th>Trạng thái</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-3">Không tìm thấy dữ liệu</td>
                </tr>
              ) : (
                products.map((item) => (
                  <tr key={item._id}>
                    <td>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }} />
                      ) : (
                        <div className="bg-secondary text-white d-flex justify-content-center align-items-center" style={{ width: "50px", height: "50px", borderRadius: "5px" }}>N/A</div>
                      )}
                    </td>
                    <td>
                      <span className="fw-bold d-block">{item.name}</span>
                      <small className="text-muted">{item.brand?.name || "No Brand"}</small>
                    </td>
                    <td>
                      <span className={item.discountPrice > 0 ? "text-decoration-line-through text-muted me-2" : ""}>
                        {item.price.toLocaleString()}đ
                      </span>
                      {item.discountPrice > 0 && <span className="text-danger fw-bold">{item.discountPrice.toLocaleString()}đ</span>}
                    </td>
                    <td>{item.stock}</td>
                    <td><span className="badge bg-info text-dark">{item.category?.name || "N/A"}</span></td>
                    <td>
                      {item.isActive ? <span className="badge bg-success">Hiển thị</span> : <span className="badge bg-secondary">Tạm ẩn</span>}
                    </td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(item._id)}>
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProduct(item._id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <nav>
            <ul className="pagination justify-content-end mb-0">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", overflowY: "auto" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Tên sản phẩm <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">URL Ảnh mô tả</label>
                    <input type="text" className="form-control" name="image" value={formData.image} onChange={handleInputChange} />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Giá gốc <span className="text-danger">*</span></label>
                    <input type="number" className="form-control" name="price" value={formData.price} onChange={handleInputChange} min="0" required />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Giá khuyến mãi</label>
                    <input type="number" className="form-control" name="discountPrice" value={formData.discountPrice} onChange={handleInputChange} min="0" />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Tồn kho</label>
                    <input type="number" className="form-control" name="stock" value={formData.stock} onChange={handleInputChange} min="0" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Danh mục <span className="text-danger">*</span></label>
                    <select className="form-select" name="category" value={formData.category} onChange={handleInputChange} required>
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Thương hiệu</label>
                    <select className="form-select" name="brand" value={formData.brand} onChange={handleInputChange}>
                      <option value="">-- Chọn thương hiệu --</option>
                      {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea className="form-control" rows="3" name="description" value={formData.description} onChange={handleInputChange}></textarea>
                  </div>
                  <div className="col-12 mb-3">
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} />
                      <label className="form-check-label">Hiển thị (isActive)</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Hủy</button>
                <button type="button" className="btn btn-success" onClick={saveProduct}>Lưu dữ liệu</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}