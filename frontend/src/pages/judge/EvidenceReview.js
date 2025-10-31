import React, { useEffect, useState } from "react";
import {
  Container,
  ListGroup,
  Button,
  Spinner,
  Alert,
  Form,
  Badge,
} from "react-bootstrap";
import API from "../../config/api";

export default function EvidenceReview() {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState("");
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ----------------------------------------
  // Fetch all cases on mount
  // ----------------------------------------
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await API.api.get("/cases/admin/all");
        setCases(res.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch cases:", err);
        setError("Unable to fetch cases from server.");
      }
    };
    fetchCases();
  }, []);

  // ----------------------------------------
  // Fetch evidence for selected case
  // ----------------------------------------
  const fetchEvidence = async (caseId) => {
    if (!caseId) return;
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await API.api.get(`/evidence/case/${caseId}`);
      console.log("📁 Evidence fetched:", res.data);
      setEvidenceList(res.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch evidence:", err);
      setError("No evidence found or server error.");
      setEvidenceList([]);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // Handle file viewing
  // ----------------------------------------
  const handleView = (evidenceId) => {
    if (!evidenceId) {
      alert("No evidence ID available.");
      return;
    }
    // Open evidence file using download endpoint
    const url = `http://127.0.0.1:8000/evidence/download/${evidenceId}`;
    console.log("🔍 Opening evidence URL:", url);
    window.open(url, "_blank");
  };

  // ----------------------------------------
  // Approve / Reject Evidence
  // ----------------------------------------
  const handleReview = async (evidenceId, status) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("status", status);

      const res = await API.api.put(`/evidence/${evidenceId}/review`, { status });
      console.log("✅ Review response:", res.data);

      setSuccess(`Evidence ${status.toLowerCase()} successfully.`);
      // Refresh evidence list
      fetchEvidence(selectedCase);
    } catch (err) {
      console.error("❌ Review update failed:", err);
      setError("Failed to update evidence review status.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // RENDER
  // ----------------------------------------
  return (
    <Container className="mt-4">
      <h2>🕵 Evidence Review</h2>
      <p className="text-muted">
        Select a case to review, approve, or reject submitted evidence.
      </p>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Case Selector */}
      <Form.Group className="mb-3" controlId="caseSelect">
        <Form.Label>Select Case</Form.Label>
        <Form.Select
          value={selectedCase}
          onChange={(e) => {
            const caseId = e.target.value;
            setSelectedCase(caseId);
            fetchEvidence(caseId);
          }}
        >
          <option value="">-- Choose a case --</option>
          {cases.map((c) => (
            <option key={c.id} value={c.id}>
              #{c.id} — {c.title} ({c.status})
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Evidence List */}
      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
          <p className="text-muted mt-2">Loading evidence...</p>
        </div>
      ) : evidenceList.length > 0 ? (
        <ListGroup className="shadow-sm">
          {evidenceList.map((ev) => (
            <ListGroup.Item
              key={ev.id}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{ev.filename}</strong>{" "}
                <Badge
                  bg={
                    ev.status === "APPROVED"
                      ? "success"
                      : ev.status === "REJECTED"
                      ? "danger"
                      : "secondary"
                  }
                  className="ms-2"
                >
                  {ev.status || "PENDING"}
                </Badge>
                <div className="text-muted small">
                  Uploaded: {new Date(ev.uploaded_at).toLocaleString()}
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleView(ev.id)}
                >
                  View
                </Button>
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={() => handleReview(ev.id, "APPROVED")}
                >
                  Approve
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleReview(ev.id, "REJECTED")}
                >
                  Reject
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : selectedCase ? (
        <Alert variant="light" className="mt-3">
          No evidence found for this case.
        </Alert>
      ) : (
        <Alert variant="info" className="mt-3">
          Please select a case to view its evidence.
        </Alert>
      )}
    </Container>
  );
}
