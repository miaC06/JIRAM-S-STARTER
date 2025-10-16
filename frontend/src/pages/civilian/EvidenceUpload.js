import React, { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

export default function EvidenceUpload() {
  const { id } = useParams(); // Case ID
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    setError(""); setSuccess(""); setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await api.post(`/cases/${id}/evidence`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Evidence uploaded successfully!");
      setFile(null);
    } catch (err) {
      setError("Failed to upload evidence");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3>📂 Upload Evidence</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form.Group className="mb-3">
        <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
      </Form.Group>

      <Button type="submit" disabled={loading}>
        {loading ? <Spinner size="sm" animation="border" /> : "Upload"}
      </Button>
    </Form>
  );
}
