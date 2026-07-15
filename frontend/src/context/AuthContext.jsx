import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/users/login", { email, password });
      const { token, data } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.post("/users/register", userData);
      const { token, data } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };
  const refreshUser = async () => {
    const res = await api.get("/users/profile");
    setUser(res.data.data);
    localStorage.setItem("user", JSON.stringify(res.data.data));
  };

  const updateProfile = async (payload) => {
    const res = await api.put("/users/profile", payload);
    setUser(res.data.data);
    localStorage.setItem("user", JSON.stringify(res.data.data));
    return res.data.data;
  };
  const addAddress = async (payload) => {
    const res = await api.post("/users/addresses", payload);

    await refreshUser();

    return res.data;
  };

  const updateAddress = async (addressId, payload) => {
    const res = await api.put(`/users/addresses/${addressId}`, payload);

    await refreshUser();

    return res.data;
  };

  const deleteAddress = async (addressId) => {
    const res = await api.delete(`/users/addresses/${addressId}`);

    await refreshUser();

    return res.data;
  };

  const setDefaultAddress = async (addressId) => {
    const res = await api.patch(`/users/addresses/${addressId}/default`);

    await refreshUser();

    return res.data;
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
