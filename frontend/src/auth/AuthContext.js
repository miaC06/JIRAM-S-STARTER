import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import api from "../api"; // axios instance

// Create context
const AuthContext = createContext();

// ---------------------------------------------------------
// 🧠 AuthProvider component
// ---------------------------------------------------------
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Restore session on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);

      // Attach token to axios
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  // ---------------------------------------------------------
  // 🔑 Login function
  // ---------------------------------------------------------
  const login = useCallback(async (email, password) => {
    try {
      const params = new URLSearchParams();
      params.append("username", email); // FastAPI expects "username"
      params.append("password", password);

      const res = await api.post("/auth/token", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const data = res.data;
      console.log("🔍 Backend login response:", data);

      // Validate
      if (!data.access_token) {
        throw new Error("No access token returned from server");
      }

      // Extract user role
      const role =
        data.user?.role ||
        data.role ||
        (Array.isArray(data.roles) ? data.roles[0] : "UNKNOWN");

      const loggedInUser = {
        email: data.user?.email || data.email || email,
        role,
        roles: [role],
      };

      // Save to state + localStorage
      setUser(loggedInUser);
      setToken(data.access_token);

      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("token", data.access_token);

      // Attach token globally
      api.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;

      return loggedInUser;
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      throw new Error(
        err.response?.data?.detail || "Invalid credentials or server error"
      );
    }
  }, []);

  // ---------------------------------------------------------
  // 🚪 Logout function
  // ---------------------------------------------------------
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }, []);

  // ---------------------------------------------------------
  // 🕒 Auto logout when token expires (optional)
  // ---------------------------------------------------------
  useEffect(() => {
    if (!token) return;

    // Decode JWT expiry if needed
    try {
      const [, payload] = token.split(".");
      const { exp } = JSON.parse(atob(payload));
      const expiresIn = exp * 1000 - Date.now();

      if (expiresIn > 0) {
        const timer = setTimeout(() => {
          alert("Session expired. Please log in again.");
          logout();
        }, expiresIn);

        return () => clearTimeout(timer);
      } else {
        logout();
      }
    } catch (err) {
      console.warn("⚠️ Could not decode token expiry:", err);
    }
  }, [token, logout]);

  // ---------------------------------------------------------
  // ⏳ Loading state
  // ---------------------------------------------------------
  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for consuming context
export const useAuth = () => useContext(AuthContext);
