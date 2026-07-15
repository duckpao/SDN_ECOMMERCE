import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/user/Dashboard";
import Profile from "./pages/user/Profile";
import Checkout from "./pages/user/Checkout";
import MyOrders from "./pages/user/MyOrders";
import Overview from "./pages/admin/Overview";
import OrderList from "./pages/admin/orders/OrderList";
import BrandList from "./pages/admin/brands/BrandList";
import CategoryList from "./pages/admin/categories/CategoryList";
import CartList from "./pages/admin/carts/CartList";
import UserList from "./pages/admin/users/UserList";
import Products from "./pages/public/Products";
import ProductDetail from "./pages/public/ProductDetail";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
          <Route path="/orders" element={<Navigate to="/my-orders" replace />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Overview />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="brands" element={<BrandList />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="carts" element={<CartList />} />
            <Route path="customers" element={<UserList userType="customer" />} />
            <Route path="employees" element={<UserList userType="employee" />} />
            <Route path="users" element={<Navigate to="/admin/customers" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
