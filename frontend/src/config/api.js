// ============================================================
// 🌐 api.js — Frontend API Integration for MediCare+ MSU System
// ============================================================

import axios from "axios";

// ============================================================
// ✅ API CONFIGURATION
// ============================================================

export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-production-domain.com"
    : "http://127.0.0.1:8000"; // or localhost

// Create a reusable axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// ✅ TOKEN MANAGEMENT HELPERS
// ============================================================

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("access_token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("access_token");
    delete api.defaults.headers.common["Authorization"];
  }
};

// Automatically attach token from localStorage (if exists)
const token = localStorage.getItem("access_token");
if (token) setAuthToken(token);

// ============================================================
// 🔐 AUTH ENDPOINTS
// ============================================================

export const AuthAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/token", data),
  me: () => api.get("/auth/me"),
  getPharmacistDashboard: () => api.get("/auth/pharmacist/dashboard"),
  getStudentDashboard: () => api.get("/auth/student/dashboard"),
};

// ============================================================
// 💊 MEDICATION ENDPOINTS
// ============================================================

export const MedicationAPI = {
  add: (data) => api.post("/medications/", data),
  getAll: (params) => api.get("/medications/", { params }),
};

// ============================================================
// 🛒 ORDER ENDPOINTS
// ============================================================

export const OrderAPI = {
  create: (data) => api.post("/orders/", data),
  getAll: () => api.get("/orders/"),
  cancel: (orderId) => api.delete(`/orders/${orderId}`),
  updateStatus: (orderId, status) =>
    api.put(`/orders/${orderId}/status`, null, { params: { status } }),
  getAnalytics: () => api.get("/orders/analytics/orders"),
};

// ============================================================
// 🧾 RECEIPT ENDPOINTS
// ============================================================

export const ReceiptAPI = {
  generate: (orderId) => api.post(`/receipts/${orderId}`),
  getAll: () => api.get("/receipts/"),
};

// ============================================================
// 🔔 NOTIFICATION ENDPOINTS
// ============================================================

export const NotificationAPI = {
  create: (message) =>
    api.post("/notifications/", null, { params: { message } }),
  getAll: () => api.get("/notifications/"),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
};

// ============================================================
// 🔌 WEBSOCKET CONNECTION (Optional)
// ============================================================

export const connectWebSocket = () => {
  const token = localStorage.getItem("access_token");
  const ws = new WebSocket(
    `ws://127.0.0.1:8000/notifications/ws?token=${token}`
  );

  ws.onopen = () => console.log("✅ WebSocket connected");
  ws.onmessage = (event) =>
    console.log("🔔 Notification received:", event.data);
  ws.onclose = () => console.log("❌ WebSocket disconnected");

  return ws;
};

// ============================================================
// 🧩 SEEDER (Dev Only)
// ============================================================

export const SeederAPI = {
  seedPharmacist: () =>
    fetch(`${API_BASE_URL}/seed_pharmacist`, {
      method: "POST",
    }),
};

// ============================================================
// 🧠 EXPORT DEFAULT — ✅ Prevent Circular Issues
// ============================================================

const API = {
  api,
  AuthAPI,
  MedicationAPI,
  OrderAPI,
  ReceiptAPI,
  NotificationAPI,
  SeederAPI,
  connectWebSocket,
  setAuthToken,
};

export default API;
