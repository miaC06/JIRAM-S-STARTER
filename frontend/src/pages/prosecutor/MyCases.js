// src/pages/prosecutor/MyCases.js
// ============================================================
// ⚖️ MyCases — Prosecutor's Case List Page
// Fetches and displays all cases assigned to the logged-in prosecutor
// ============================================================

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext"; // ✅ For token + user info
import API from "../../config/api"; // ✅ Configured Axios instance

export default function MyCases() {
  const { user } = useAuth(); // 🧠 Current logged-in prosecutor
  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ----------------------------------------------------------
  // 🔄 Fetch prosecutor's cases from backend
  // ----------------------------------------------------------
  useEffect(() => {
    const fetchCases = async () => {
      try {
        // ✅ Hit backend endpoint — adjust query if your API filters by role or prosecutor ID
        const response = await API.api.get("/cases/");
        console.log("✅ Cases fetched:", response.data);

        // Assuming the backend returns an array of cases like:
        // [{ id, title, status, prosecutor_id }, ...]
        const prosecutorCases = response.data.filter(
          (c) =>
            c.prosecutor_id === user?.id || // optional if backend filters automatically
            c.prosecutor?.email === user?.email
        );

        setCases(prosecutorCases);
      } catch (err) {
        console.error("❌ Failed to load cases:", err);
        setError(
          err.response?.data?.detail ||
            err.response?.data?.message ||
            "Could not fetch cases. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchCases();
  }, [user]);

  // ----------------------------------------------------------
  // 🔍 Search filter
  // ----------------------------------------------------------
  const filteredCases = cases.filter(
    (c) =>
      c.id?.toString().toLowerCase().includes(search.toLowerCase()) ||
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.status?.toLowerCase().includes(search.toLowerCase())
  );

  // ----------------------------------------------------------
  // 🏷️ Status Badge Styling
  // ----------------------------------------------------------
  const getStatusBadge = (status) => {
    const badgeStyles = {
      Open: "bg-green-100 text-green-700",
      "Hearing Scheduled": "bg-yellow-100 text-yellow-700",
      Closed: "bg-red-100 text-red-700",
    };

    const style = badgeStyles[status] || "bg-gray-100 text-gray-700";
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${style}`}>{status}</span>
    );
  };

  // ----------------------------------------------------------
  // 🌀 Render State
  // ----------------------------------------------------------
  if (loading)
    return (
      <div className="p-8 text-center text-gray-600">Loading your cases...</div>
    );

  if (error)
    return (
      <div className="p-8 text-center text-red-600">
        ❌ {error}
      </div>
    );

  // ----------------------------------------------------------
  // 📋 Render Case List
  // ----------------------------------------------------------
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📂 My Cases</h2>
      <p className="text-gray-600 mb-6">
        Below is a list of cases assigned to you as a prosecutor.
      </p>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search cases..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Cases Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4">Case ID</th>
              <th className="p-4">Title</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.length > 0 ? (
              filteredCases.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-4 font-medium">{c.id}</td>
                  <td className="p-4">{c.title}</td>
                  <td className="p-4">{getStatusBadge(c.status)}</td>
                  <td className="p-4">
                    <Link
                      to={`/prosecutor/cases/${c.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="p-6 text-center text-gray-500 italic"
                >
                  No cases found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
