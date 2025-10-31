import React, { useEffect, useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import api from "../../api";
import { useAuth } from "../../auth/AuthContext";

export default function EvidenceUpload() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [caseId, setCaseId] = useState("");
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // 🔹 Load all cases for the logged-in user
  useEffect(() => {
    const fetchUserCases = async () => {
      if (!user?.email) return;
      try {
        const res = await api.get(`/cases/mine/${user.email}`);
        setCases(res.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch cases:", err);
        setError("Failed to load your cases");
      }
    };
    fetchUserCases();
  }, [user]);

  // 🔹 Handle upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!file) return setError("Please select a file to upload");
    if (!caseId) return setError("Please select a case");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploader_email", user.email);

      // ✅ Backend expects /cases/{case_id}/upload-evidence
      await api.post(`/cases/${caseId}/upload-evidence`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("✅ Evidence uploaded successfully!");
      setFile(null);
      setCaseId("");
    } catch (err) {
      console.error("❌ Upload failed:", err);
      setError("Failed to upload evidence. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="p-4 shadow-sm rounded bg-white">
      <h3 className="mb-4">📂 Upload Evidence</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Select case */}
      <Form.Group className="mb-3">
        <Form.Label>Select Case</Form.Label>
        <Form.Select
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          required
        >
          <option value="">-- Choose a case --</option>
          {cases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title} ({c.status})
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* File input */}
      <Form.Group className="mb-3">
        <Form.Label>Evidence File</Form.Label>
        <Form.Control
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
      </Form.Group>

      <Button
        type="submit"
        disabled={loading}
        variant="primary"
        className="px-4"
      >
        {loading ? (
          <>
            <Spinner size="sm" animation="border" className="me-2" />
            Uploading...
          </>
        ) : (
          "Upload Evidence"
        )}
      </Button>
    </Form>
  );
}
