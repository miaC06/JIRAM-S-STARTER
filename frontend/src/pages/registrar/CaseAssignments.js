// src/pages/registrar/CaseAssignments.js
// ============================================================
// 🧑‍⚖️ Registrar Case Assignment Page
// Registrar can assign cases to judges or prosecutors.
// Endpoints used:
// - GET /cases/
// - GET /users/role/{role}
// - PUT /cases/{id}
// ============================================================

import React, { useEffect, useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../../auth/AuthContext";
import API from "../../config/api";

export default function CaseAssignments() {
  // ------------------------------------------------------------
  // 🔧 STATE & CONTEXT
  // ------------------------------------------------------------
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [judges, setJudges] = useState([]);
  const [prosecutors, setProsecutors] = useState([]);
  const [selectedCase, setSelectedCase] = useState("");
  const [assignmentType, setAssignmentType] = useState("Judge");
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ------------------------------------------------------------
  // 📥 Fetch Cases + Users
  // ------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch cases
        const caseRes = await API.api.get("/cases/admin/all");
        setCases(caseRes.data || []);

        // Fetch judges & prosecutors
        const judgeRes = await API.api.get("/users/role/JUDGE");
        const prosRes = await API.api.get("/users/role/PROSECUTOR");

        setJudges(judgeRes.data || []);
        setProsecutors(prosRes.data || []);
      } catch (err) {
        console.error("❌ Failed to load data:", err);
        setError("Could not load cases or users from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ------------------------------------------------------------
  // 📨 Assign Case
  // ------------------------------------------------------------
  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedCase || !selectedAssignee) {
      alert("⚠️ Please select a case and a user to assign.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // Build payload - backend expects assigned_to_id
      const payload = {
        assigned_to_id: parseInt(selectedAssignee)
      };

      // PUT /cases/{id}
      await API.api.put(`/cases/${selectedCase}`, payload);

      setSuccess(`✅ Case successfully assigned to ${assignmentType}.`);
      setSelectedCase("");
      setSelectedAssignee("");
      
      // Refresh case list to show updated assignment
      const caseRes = await API.api.get("/cases/admin/all");
      setCases(caseRes.data || []);
    } catch (err) {
      console.error("❌ Assignment failed:", err.response?.data || err);
      setError("Failed to assign case. Please check console for details.");
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------------------------------------
  // 🌀 UI LOADING & ERROR STATES
  // ------------------------------------------------------------
  if (loading)
    return (
      <div className="p-8 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="text-muted mt-2">Loading cases and users...</p>
      </div>
    );

  // ------------------------------------------------------------
  // 🧱 MAIN UI
  // ------------------------------------------------------------
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        📂 Case Assignments
      </h2>
      <p className="text-gray-600 mb-6">
        Assign cases to judges and prosecutors below.
      </p>

      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" onClose={() => setSuccess("")} dismissible>
          {success}
        </Alert>
      )}

      <div className="bg-white shadow-lg rounded-xl p-6 max-w-2xl">
        <form onSubmit={handleAssign}>
          {/* CASE SELECTOR */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Case
            </label>
            <select
              value={selectedCase}
              onChange={(e) => setSelectedCase(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">-- Select Case --</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title || `Case #${c.id}`} — {c.status}
                </option>
              ))}
            </select>
          </div>

          {/* ASSIGNMENT TYPE */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Assign To
            </label>
            <select
              value={assignmentType}
              onChange={(e) => {
                setAssignmentType(e.target.value);
                setSelectedAssignee("");
              }}
              className="w-full border rounded-lg p-2"
            >
              <option value="Judge">Judge</option>
              <option value="Prosecutor">Prosecutor</option>
            </select>
          </div>

          {/* ASSIGNEE SELECTOR */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Select {assignmentType}
            </label>
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">-- Select {assignmentType} --</option>
              {(assignmentType === "Judge" ? judges : prosecutors).map((u) => (
                <option key={u.id} value={u.id}>
                  {u.email} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
            disabled={saving}
          >
            {saving ? "Assigning..." : "Assign Case"}
          </button>
        </form>
      </div>
    </div>
  );
}
