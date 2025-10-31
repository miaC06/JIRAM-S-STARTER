// ============================================================
// ⚖️ Prosecutor Submissions Page — Connected to Backend
// ============================================================

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../../config/api"; // ✅ Backend API config
import { useAuth } from "../../auth/AuthContext";

export default function Submissions() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // ------------------------------------------------------------
  // 🧩 Fetch existing submissions (documents)
  // ------------------------------------------------------------
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const res = await API.api.get("/documents/"); // ✅ Adjust if your route differs
        setSubmissions(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  // ------------------------------------------------------------
  // 📝 Handle new submission
  // ------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !details.trim()) {
      alert("Please fill in both fields before submitting.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title,
        content: details,
        submitted_by: user?.email || "anonymous",
        role: user?.role || "PROSECUTOR",
      };

      const res = await API.api.post("/documents/", payload);
      const newSubmission = res.data;

      setSubmissions([newSubmission, ...submissions]);
      setTitle("");
      setDetails("");
    } catch (err) {
      console.error("❌ Submission failed:", err.response?.data || err.message);
      alert(err.response?.data?.detail || "Failed to submit document.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // 🚀 Routing Shortcuts (Example)
  // ------------------------------------------------------------
  const goToDashboard = () => navigate("/prosecutor/dashboard");
  const goToCaseDetails = (caseId) => navigate(`/cases/${caseId}`);

  // ------------------------------------------------------------
  // 🧱 UI
  // ------------------------------------------------------------
  return (
    <Container className="mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">📝 Submissions</h2>
          <p className="text-muted mb-0">
            Submit motions, evidence, or legal documents to the court system.
          </p>
        </div>
        <Button variant="outline-primary" onClick={goToDashboard}>
          ← Back to Dashboard
        </Button>
      </div>

      <Row>
        {/* New Submission Form */}
        <Col md={6} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>➕ New Submission</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Submission Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter submission title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Details</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter submission details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="success"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        size="sm"
                        animation="border"
                        className="me-2"
                      />{" "}
                      Submitting...
                    </>
                  ) : (
                    "Submit Document"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Submitted Documents List */}
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>📂 Submitted Documents</Card.Title>

              {loading && submissions.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Loading submissions...
                </div>
              ) : submissions.length === 0 ? (
                <p className="text-muted">No submissions yet.</p>
              ) : (
                <ListGroup variant="flush">
                  {submissions.map((sub) => (
                    <ListGroup.Item
                      key={sub.id}
                      className="d-flex flex-column align-items-start"
                    >
                      <div className="d-flex justify-content-between w-100">
                        <h6 className="mb-1">{sub.title}</h6>
                        {sub.case_id && (
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => goToCaseDetails(sub.case_id)}
                          >
                            View Case
                          </Button>
                        )}
                      </div>
                      <small className="text-muted">
                        {new Date(sub.created_at || sub.date).toLocaleString()}
                      </small>
                      <p className="mb-0 text-muted mt-2">{sub.content || sub.details}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
