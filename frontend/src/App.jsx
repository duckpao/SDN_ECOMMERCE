import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/user/Profile";
import Overview from "./pages/admin/Overview";
import BrandList from "./pages/admin/brands/BrandList";
import CategoryList from "./pages/admin/categories/CategoryList";
import CartList from "./pages/admin/carts/CartList";
import UserList from "./pages/admin/users/UserList";
import Products from "./pages/public/Products";
import ProductDetail from "./pages/public/ProductDetail";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
import Orders from "./pages/user/Orders";
import Cart from "./pages/public/Cart";
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
          </Route>

          {/* Auth routes (full screen) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User dashboard */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Overview />} />
            <Route path="brands" element={<BrandList />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="carts" element={<CartList />} />
            <Route path="users" element={<UserList />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
