// =====================================================
// ✅ API SERVICE INITIALIZATION
// =====================================================
console.log("✅ api.js loaded successfully");

// Import your backend base URL
import { API_BASE_URL } from "../config/api";

// =====================================================
// 🔧 Generic Request Helper
// =====================================================
const request = async (endpoint, method = "GET", data = null, token = null) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const options = { method, headers };
  if (data) options.body = JSON.stringify(data);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
};

// =====================================================
// 👤 AUTH
// =====================================================
export const AuthAPI = {
  login: (data) => request("/auth/login", "POST", data),
  register: (data) => request("/auth/register", "POST", data),
  me: (token) => request("/auth/me", "GET", null, token),
};

// =====================================================
// ⚖️ CASES
// =====================================================
export const CaseAPI = {
  create: (data, token) => request("/cases/", "POST", data, token),
  list: (token) => request("/cases/", "GET", null, token),
  details: (id, token) => request(`/cases/${id}`, "GET", null, token),
  update: (id, data, token) => request(`/cases/${id}`, "PUT", data, token),
  delete: (id, token) => request(`/cases/${id}`, "DELETE", null, token),
};

// =====================================================
// 📁 DOCUMENTS
// =====================================================
export const DocumentAPI = {
  upload: async (formData, token) => {
    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData, // Don’t stringify FormData
    });
    if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
    return response.json();
  },
  listByCase: (caseId, token) =>
    request(`/documents/${caseId}`, "GET", null, token),
  delete: (docId, token) => request(`/documents/${docId}`, "DELETE", null, token),
};

// =====================================================
// 🧾 EVIDENCE
// =====================================================
export const EvidenceAPI = {
  upload: async (formData, token) => {
    const response = await fetch(`${API_BASE_URL}/evidence/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
    return response.json();
  },
  listByCase: (caseId, token) =>
    request(`/evidence/${caseId}`, "GET", null, token),
  delete: (id, token) => request(`/evidence/${id}`, "DELETE", null, token),
};

// =====================================================
// 🗓️ HEARINGS
// =====================================================
export const HearingAPI = {
  create: (data, token) => request("/hearings/", "POST", data, token),
  list: (token) => request("/hearings/", "GET", null, token),
  update: (id, data, token) => request(`/hearings/${id}`, "PUT", data, token),
  delete: (id, token) => request(`/hearings/${id}`, "DELETE", null, token),
};

// =====================================================
// 💳 PAYMENTS
// =====================================================
export const PaymentAPI = {
  create: (data, token) => request("/payments/", "POST", data, token),
  list: (token) => request("/payments/", "GET", null, token),
  listByCase: (caseId, token) =>
    request(`/payments/${caseId}`, "GET", null, token),
  update: (id, data, token) => request(`/payments/${id}`, "PUT", data, token),
};

// =====================================================
// 👥 USERS
// =====================================================
export const UserAPI = {
  list: (token) => request("/users/", "GET", null, token),
  details: (id, token) => request(`/users/${id}`, "GET", null, token),
  byRole: (role, token) => request(`/users/role/${role}`, "GET", null, token),
};

// =====================================================
// 🧭 DEBUGGING: ALL ROUTES MAP
// =====================================================
export const API_ROUTES = {
  AUTH: ["/auth/register", "/auth/login", "/auth/me"],
  USERS: ["/users/", "/users/{id}", "/users/role/{role}"],
  CASES: ["/cases/", "/cases/{id}", "/cases/file"],
  DOCUMENTS: ["/documents/upload", "/documents/{case_id}", "/documents/{doc_id}"],
  EVIDENCE: ["/evidence/upload", "/evidence/{case_id}", "/evidence/{id}"],
  HEARINGS: ["/hearings/", "/hearings/{case_id}", "/hearings/{hearing_id}"],
  PAYMENTS: ["/payments/", "/payments/{case_id}", "/payments/{payment_id}"],
};

// =====================================================
// 🖨️ PRINT ROUTES ONCE (in dev only)
// =====================================================
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("🧩 Available API Endpoints:");
  console.table(API_ROUTES);
}
