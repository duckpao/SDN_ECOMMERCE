import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = "http://localhost:9999/categories";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  
  // States cho Alert
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  // States cho Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: "", name: "", description: "", isActive: true });
  const [modalTitle, setModalTitle] = useState("Thêm Danh mục Mới");

  // Load dữ liệu mỗi khi page hoặc search thay đổi
  useEffect(() => {
    fetchCategories(page, search);
  }, [page, search]);

  const showAlert = (message, type = "danger") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3000);
  };

  const fetchCategories = async (currentPage, currentSearch) => {
    try {
      const res = await fetch(`${API_URL}?page=${currentPage}&limit=5&search=${currentSearch}`);
      const json = await res.json();
      if (res.ok) {
        setCategories(json.data);
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

  // Các hàm điều khiển Modal
  const openCreateModal = () => {
    setModalTitle("Thêm Danh mục Mới");
    setFormData({ id: "", name: "", description: "", isActive: true });
    setShowModal(true);
  };

  const openEditModal = async (id) => {
    setModalTitle("Chỉnh sửa Danh mục");
    try {
      const res = await fetch(`${API_URL}/${id}`);
      const json = await res.json();
      if (res.ok) {
        const cat = json.data;
        setFormData({
          id: cat._id,
          name: cat.name,
          description: cat.description || "",
          isActive: cat.isActive,
        });
        setShowModal(true);
      } else {
        showAlert(json.message);
      }
    } catch (error) {
      showAlert("Lỗi khi lấy thông tin danh mục!");
    }
  };

  const closeModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Lưu dữ liệu (POST/PUT)
  const saveCategory = async () => {
    if (!formData.name) {
      alert("Vui lòng nhập tên danh mục!");
      return;
    }

    const method = formData.id ? "PUT" : "POST";
    const url = formData.id ? `${API_URL}/${formData.id}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          isActive: formData.isActive,
        }),
      });
      const json = await res.json();

      if (res.ok) {
        showAlert(formData.id ? "Cập nhật thành công!" : "Thêm mới thành công!", "success");
        closeModal();
        fetchCategories(page, search);
      } else {
        showAlert(json.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      showAlert("Lỗi kết nối khi lưu dữ liệu!");
    }
  };

  // Xóa dữ liệu (DELETE)
  const deleteCategory = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn danh mục này không?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const json = await res.json();

      if (res.ok) {
        showAlert("Xóa thành công!", "success");
        fetchCategories(page, search);
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
        <h2>🏷️ Quản lý Danh mục</h2>
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
        <div className="col-md-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tên danh mục để tìm..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn btn-outline-secondary" onClick={handleSearch}>
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Tên danh mục</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-3">
                    Không tìm thấy dữ liệu
                  </td>
                </tr>
              ) : (
                categories.map((item) => (
                  <tr key={item._id}>
                    <td className="fw-bold">{item.name}</td>
                    <td>{item.description || <i className="text-muted">Không có mô tả</i>}</td>
                    <td>
                      {item.isActive ? (
                        <span className="badge bg-success">Đang hoạt động</span>
                      ) : (
                        <span className="badge bg-secondary">Tạm ẩn</span>
                      )}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => openEditModal(item._id)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteCategory(item._id)}
                      >
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
                  <button className="page-link" onClick={() => setPage(p)}>
                    {p}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Modal Custom bằng Bootstrap Classes */}
      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{modalTitle}</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Tên danh mục <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label">Hoạt động (isActive)</label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Hủy</button>
                  <button type="button" className="btn btn-success" onClick={saveCategory}>Lưu dữ liệu</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}