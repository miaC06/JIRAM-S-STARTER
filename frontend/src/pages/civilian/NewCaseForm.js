import React, { useState } from "react";
import api from "../../api";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

export default function NewCaseForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);

    try {
      const res = await api.post("/cases", { title, description });
      setSuccess("Case filed successfully!");
      setTitle(""); setDescription("");
    } catch (err) {
      setError("Failed to file case");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3>📝 File a New Case</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label>Case Title</Form.Label>
        <Form.Control
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </Form.Group>
      <Button type="submit" disabled={loading}>
        {loading ? <Spinner size="sm" animation="border" /> : "Submit"}
      </Button>
    </Form>
  );
}
