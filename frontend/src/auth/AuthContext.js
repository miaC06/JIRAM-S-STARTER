import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ✅ Restore user + token from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // --- Login handler ---
  const login = async (email, password) => {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const res = await api.post("/auth/token", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const data = res.data;
    console.log("🔍 Raw backend login response:", data);

    // ✅ Normalize response (support both `user.role` or `roles`)
    const role =
      data.user?.role || (Array.isArray(data.roles) ? data.roles[0] : null);

    if (!role) {
      throw new Error("No role found in response");
    }

    const loggedInUser = {
      email: data.user?.email || data.email,
      role, // keep role as a single string for easier redirects
      roles: [role], // also provide array for RoleGuard compatibility
    };

    // ✅ Save to state + localStorage
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    localStorage.setItem("token", data.access_token);

    return loggedInUser; // frontend expects role here
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
