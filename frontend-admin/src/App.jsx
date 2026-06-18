import { useState } from "react";
import Categories from "./Categories";
import Products from "./Products";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div>
      {/* Thanh điều hướng đơn giản */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand">Admin Panel</span>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button 
                  className={`nav-link btn btn-link ${activeTab === "categories" ? "active fw-bold" : ""}`} 
                  onClick={() => setActiveTab("categories")}
                >
                  Danh Mục
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link btn btn-link ${activeTab === "products" ? "active fw-bold" : ""}`} 
                  onClick={() => setActiveTab("products")}
                >
                  Sản Phẩm
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Render Component tùy theo Tab đang chọn */}
      {activeTab === "categories" ? <Categories /> : <Products />}
    </div>
  );
}

export default App;