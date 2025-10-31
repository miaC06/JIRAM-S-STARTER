// ============================================================
// 🧠 AuthContext — Central Authentication State + Logic
// ============================================================

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import API from "../config/api"; // ✅ Axios instance

// ------------------------------------------------------------
// Context Creation
// ------------------------------------------------------------
const AuthContext = createContext();

// ============================================================
// 🧩 AuthProvider Component
// ============================================================
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------------
  // 🧩 Restore session from localStorage on refresh
  // ---------------------------------------------------------
  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");
    const storedToken = localStorage.getItem("access_token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      API.setAuthToken(storedToken);
    }

    setLoading(false);
  }, []);

  // ---------------------------------------------------------
  // 🔑 Login (POST /auth/token)
  // ---------------------------------------------------------
  const login = useCallback(async (email, password) => {
    try {
      // ✅ FastAPI expects `application/x-www-form-urlencoded`
      const formData = new URLSearchParams();
      formData.append("username", email); // ⬅️ Must be 'username'
      formData.append("password", password);

      const response = await API.api.post("/auth/token", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const data = response.data;
      console.log("✅ Login success:", data);

      if (!data.access_token) {
        throw new Error("No access token returned from backend");
      }

      // ✅ Build user object
      const loggedInUser = {
        id: data.user?.id || null,
        email: data.user?.email || email,
        role: data.user?.role || data.role || "USER",
      };

      // ✅ Save session
      setUser(loggedInUser);
      setToken(data.access_token);

      localStorage.setItem("userProfile", JSON.stringify(loggedInUser));
      localStorage.setItem("access_token", data.access_token);

      // ✅ Attach token for future requests
      API.setAuthToken(data.access_token);

      return loggedInUser;
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Invalid credentials or server error";
      throw new Error(message);
    }
  }, []);

  // ---------------------------------------------------------
  // 🚪 Logout
  // ---------------------------------------------------------
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("userProfile");
    localStorage.removeItem("access_token");
    API.setAuthToken(null);
  }, []);

  // ---------------------------------------------------------
  // ⏰ Auto logout when token expires
  // ---------------------------------------------------------
  useEffect(() => {
    if (!token) return;

    try {
      const [, payload] = token.split(".");
      const { exp } = JSON.parse(atob(payload));
      const expiresIn = exp * 1000 - Date.now();

      if (expiresIn > 0) {
        const timer = setTimeout(() => {
          alert("⚠️ Session expired. Please log in again.");
          logout();
        }, expiresIn);
        return () => clearTimeout(timer);
      } else {
        logout();
      }
    } catch (err) {
      console.warn("⚠️ Could not decode JWT token expiry:", err);
    }
  }, [token, logout]);

  // ---------------------------------------------------------
  // 🌀 Loading State
  // ---------------------------------------------------------
  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="text-muted fs-5">Loading...</p>
      </div>
    );

  // ---------------------------------------------------------
  // 🧠 Provide context to children
  // ---------------------------------------------------------
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ------------------------------------------------------------
// Custom Hook for consuming AuthContext
// ------------------------------------------------------------
export const useAuth = () => useContext(AuthContext); 
