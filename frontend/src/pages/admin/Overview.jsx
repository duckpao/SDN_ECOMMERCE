import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import TopProductChart from "../../components/charts/TopProductChart";
import RevenueChart from "../../components/charts/RevenueChart";

export default function Overview() {
  const [stats, setStats] = useState({
    users: 0,
    categories: 0,
    brands: 0,
    products: 0,
  });

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders,setOrders]=useState([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

 const loadData = async () => {
  try {
    const [u, c, b, p, o] = await Promise.all([
      api.get("/users"),
      api.get("/categories?limit=1"),
      api.get("/brands?limit=1"),
      api.get("/products"),
      api.get("/orders"),
    ]);

    const userData = u.data.data || [];
    const productData = p.data.data || [];
    const orderData = o.data.data || [];

    setUsers(userData);
    setProducts(productData);
    setOrders(orderData);

    setStats({
      users: u.data.total || userData.length,
      categories: c.data.total || 0,
      brands: b.data.total || 0,
      products: p.data.total || productData.length,
    });

  } catch (err) {
    console.log(err);
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa User này?")) return;

    try {
      await api.delete(`/users/${id}`);

      const newUsers = users.filter((u) => u._id !== id);
      setUsers(newUsers);

      setStats((prev) => ({
        ...prev,
        users: newUsers.length,
      }));

      alert("Xóa thành công!");
    } catch (err) {
      console.log(err);
      alert("Xóa thất bại!");
    }
  };
  const handleRoleChange = async (id, newRole) => {
  try {
    await api.put(`/users/${id}`, {
      role: newRole,
    });

    setUsers((prev) =>
      prev.map((user) =>
        user._id === id ? { ...user, role: newRole } : user
      )
    );

    alert("Cập nhật Role thành công!");
  } catch (err) {
    console.log(err);
    alert("Cập nhật Role thất bại!");
  }
};

  const filteredUsers = users.filter((u) => {
    const keyword =
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());

    const role =
      roleFilter === "all" ? true : u.role === roleFilter;

    return keyword && role;
  });

  const cards = [
    {
      label: "Người dùng",
      value: stats.users,
      icon: "bi-people",
      color: "bg-primary",
      link: "/admin/users",
    },
    {
      label: "Danh mục",
      value: stats.categories,
      icon: "bi-grid",
      color: "bg-success",
      link: "/admin/categories",
    },
    {
      label: "Thương hiệu",
      value: stats.brands,
      icon: "bi-tag",
      color: "bg-warning text-dark",
      link: "/admin/brands",
    },
    {
      label: "Sản phẩm",
      value: stats.products,
      icon: "bi-box",
      color: "bg-danger",
      link: "/admin/products",
    },
  ];

  return (
    <div>
      <h4 className="fw-bold mb-4">
        <i className="bi bi-speedometer2 me-2"></i>
        Tổng quan
      </h4>

      {/* Dashboard Cards */}

      <div className="row g-4 mb-5">
        {cards.map((c, i) => (
          <div className="col-md-6 col-xl-3" key={i}>
            <Link to={c.link} className="text-decoration-none">
              <div className={`card shadow border-0 ${c.color} text-white`}>
                <div className="card-body d-flex align-items-center gap-3">
                  <i className={`bi ${c.icon} fs-1`}></i>

                  <div>
                    <h2 className="mb-0">{c.value}</h2>
                    <small>{c.label}</small>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Top Product */}
{/* Charts */}

<div className="row mb-5">

  <div className="col-lg-6">

    <div className="card shadow h-100">

      <div className="card-header fw-bold">
        <i className="bi bi-bar-chart-fill me-2"></i>
        Top sản phẩm bán chạy
      </div>

      <div className="card-body">

        <TopProductChart products={products} />

      </div>

    </div>

  </div>

  <div className="col-lg-6">

    <div className="card shadow h-100">

      <div className="card-header fw-bold">
        <i className="bi bi-graph-up-arrow me-2"></i>
        Doanh thu
      </div>

      <div className="card-body">

        <RevenueChart orders={orders} />

      </div>

    </div>

  </div>

</div>

      {/* User Management */}

      <div className="card shadow">

        <div className="card-header d-flex justify-content-between align-items-center">

          <h5 className="mb-0">
            <i className="bi bi-people me-2"></i>
            Quản lý tài khoản
          </h5>

          <span className="badge bg-primary">
            {filteredUsers.length} Users
          </span>

        </div>

        <div className="card-body">

          <div className="row mb-3">

            <div className="col-md-6">

              <input
                className="form-control"
                placeholder="Tìm theo tên hoặc email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

            <div className="col-md-3">

              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Tất cả Role</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="customer">Customer</option>
              </select>

            </div>

          </div>

          <div className="table-responsive">

            <table className="table table-hover align-middle">

              <thead className="table-dark">

                <tr>
                  <th>#</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Trạng thái</th>
                  <th width="170">Thao tác</th>
                </tr>

              </thead>

              <tbody>

                {filteredUsers.length === 0 ? (

                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      Không có dữ liệu
                    </td>
                  </tr>

                ) : (

                  filteredUsers.map((u, index) => (

                    <tr key={u._id}>

                      <td>{index + 1}</td>

                      <td>{u.fullName}</td>

                      <td>{u.email}</td>

                      <td style={{ width: "180px" }}>
  <select
    className={`form-select form-select-sm ${
      u.role === "admin"
        ? "border-danger"
        : u.role === "staff"
        ? "border-warning"
        : "border-primary"
    }`}
    value={u.role}
    onChange={(e) => handleRoleChange(u._id, e.target.value)}
  >
    <option value="customer">Customer</option>
    <option value="staff">Staff</option>
    <option value="admin">Admin</option>
  </select>
</td>

                      <td>

                        <span
                          className={`badge ${
                            u.isActive
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {u.isActive ? "Active" : "Disabled"}
                        </span>

                      </td>

                      <td>

                       

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(u._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </div>
  );
}