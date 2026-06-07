import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api.get("/auth/me")
        .then(res => {
          setUser(res.data.user);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    return res.data;
  };

  // আপডেটেড login ফাংশন
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);
    toast.success(`Welcome back, ${user.name.split(" ")[0]}! 👋`); // লগইন সাকসেস টোস্ট
    return res.data;
  };

  // আপডেটেড logout ফাংশন
  const logout = async () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    }
    setUser(null);
    toast.success("Logged out successfully! 👋"); // লগআউট সাকসেস টোস্ট
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}