/**
 * Documents.jsx
 * -----------------------------
 * Frontend component for viewing and downloading uploaded court documents.
 * Matches backend FastAPI endpoints under /documents/.
 *
 * Dependencies:
 * - React
 * - React Bootstrap
 * - api.js (axios instance)
 * - useAuth() from AuthContext
 */

import React, { useEffect, useState } from "react";
import { ListGroup, Spinner, Alert, Button, Form } from "react-bootstrap";
import api from "../../api";
import { useAuth } from "../../auth/AuthContext";

export default function Documents() {
  const { user } = useAuth();
  const [caseId, setCaseId] = useState("");
  const [cases, setCases] = useState([]);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Fetch all cases created or assigned to this user
  useEffect(() => {
    const fetchUserCases = async () => {
      if (!user?.email) return;
      try {
        const res = await api.get(`/cases/mine/${user.email}`);
        setCases(res.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch user cases:", err);
        setError("Failed to fetch your cases");
      }
    };
    fetchUserCases();
  }, [user]);

  // 🔹 Fetch documents for a selected case
  const fetchDocs = async (selectedCaseId) => {
    if (!selectedCaseId) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/documents/case/${selectedCaseId}`);
      setDocs(res.data || []);
    } catch (err) {
      console.error("❌ Failed to load documents:", err);
      setError("Failed to load documents for this case");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Build proper file URL for download
  const getFileURL = (path) => {
    if (!path) return "#";
    if (path.startsWith("http")) return path;
    // Normalizes file path and serves from FastAPI static mount
    return `http://127.0.0.1:8000/${path.replace(/\\/g, "/")}`;
  };

  return (
    <div className="p-4">
      <h3 className="mb-4">📄 Court Documents</h3>

      {/* --- Case Selector Dropdown --- */}
      <Form.Group className="mb-3" controlId="caseSelect">
        <Form.Label>Select Case</Form.Label>
        <Form.Select
          value={caseId}
          onChange={(e) => {
            const selected = e.target.value;
            setCaseId(selected);
            fetchDocs(selected);
          }}
        >
          <option value="">-- Select a case --</option>
          {cases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title} ({c.status})
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* --- Documents Section --- */}
      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
          <p className="mt-2 text-muted">Loading documents...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : docs.length > 0 ? (
        <ListGroup>
          {docs.map((d) => (
            <ListGroup.Item
              key={d.id}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{d.filename}</strong>
                <div className="small text-muted">
                  Uploaded: {new Date(d.upload_date).toLocaleDateString()} <br />
                  Type: {d.file_type || "Unknown"}
                </div>
              </div>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => window.open(getFileURL(d.file_path), "_blank")}
              >
                Download
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <Alert variant="info">No documents found for this case.</Alert>
      )}
    </div>
  );
}
