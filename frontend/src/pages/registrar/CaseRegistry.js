// src/pages/registrar/CaseRegistry.js
// ============================================================
// 📑 Case Registry — Registrar's Case Management Page
// Features:
// - List all cases from backend
// - Register new cases
// - View or update case info (optional later)
// Endpoints used:
//   GET  /cases/
//   POST /cases/file
// ============================================================

import React, { useEffect, useState } from "react";
import { Spinner, Alert, Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "../../auth/AuthContext";
import API from "../../config/api";

export default function CaseRegistry() {
  // ------------------------------
  // STATE & CONTEXT
  // ------------------------------
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Case registration form
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    filed_by: "",
    prosecutor_id: "",
  });

  // ------------------------------
  // FETCH ALL CASES
  // ------------------------------
  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const res = await API.api.get("/cases/");
        setCases(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching cases:", err);
        setError("Failed to load case list from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  // ------------------------------
  // HANDLE FORM INPUT
  // ------------------------------
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ------------------------------
  // REGISTER NEW CASE
  // ------------------------------
  const handleRegisterCase = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.filed_by) {
      alert("⚠️ Please fill all required fields.");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      filed_by: formData.filed_by.trim(),
      prosecutor_id: formData.prosecutor_id
        ? Number(formData.prosecutor_id)
        : null,
    };

    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const res = await API.api.post("/cases/file", payload);
      setCases((prev) => [...prev, res.data]); // add to table instantly
      setSuccess("✅ Case registered successfully!");
      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        filed_by: "",
        prosecutor_id: "",
      });
    } catch (err) {
      console.error("❌ Case registration failed:", err.response?.data || err);
      setError(
        err.response?.data?.detail ||
          "Case registration failed. Check console for details."
      );
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------
  // UI STATES
  // ------------------------------
  if (loading)
    return (
      <div className="p-8 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="text-gray-600 mt-2">Loading cases...</p>
      </div>
    );

  // ------------------------------
  // MAIN UI
  // ------------------------------
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">📑 Case Registry</h2>
          <p className="text-gray-600">
            Browse and manage all registered cases.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          ➕ Register New Case
        </button>
      </div>

      {/* Alerts */}
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

      {/* Cases Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 text-left">Case ID</th>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Filed By</th>
              <th className="p-4 text-left">Date Filed</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {cases.length > 0 ? (
              cases.map((c) => (
                <tr
                  key={c.id}
                  className="border-t hover:bg-gray-50 transition text-gray-800"
                >
                  <td className="p-4 font-medium">{c.id}</td>
                  <td className="p-4">{c.title}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        c.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4">{c.filed_by || "N/A"}</td>
                  <td className="p-4">
                    {c.date_filed
                      ? new Date(c.date_filed).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-4">
                    <button
                      className="text-blue-600 hover:underline font-medium"
                      onClick={() => alert(`View case ${c.id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-center text-gray-500 italic"
                >
                  No cases found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🧾 Modal — Register New Case */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🧾 Register New Case</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRegisterCase}>
            <Form.Group className="mb-3">
              <Form.Label>Case Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter case title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter brief case details"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Filed By</Form.Label>
              <Form.Control
                type="text"
                name="filed_by"
                value={formData.filed_by}
                onChange={handleChange}
                placeholder="Enter name or email of complainant"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Prosecutor ID (optional)</Form.Label>
              <Form.Control
                type="number"
                name="prosecutor_id"
                value={formData.prosecutor_id}
                onChange={handleChange}
                placeholder="Enter prosecutor ID"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleRegisterCase}
            disabled={saving}
          >
            {saving ? "Registering..." : "Register Case"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
