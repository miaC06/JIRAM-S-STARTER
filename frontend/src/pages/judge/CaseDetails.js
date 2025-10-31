import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Spinner, Alert, Badge, Row, Col } from "react-bootstrap";
import api from "../../api";

export default function CaseDetails() {
  const { id } = useParams(); // ✅ grabs case ID from URL like /cases/3
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCase = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/cases/${id}`); // ✅ backend route
        setCaseData(res.data);
      } catch (err) {
        console.error("❌ Failed to load case:", err);
        setError("Failed to load case details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
        <p className="text-muted mt-2">Loading case details...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!caseData) return <Alert variant="info">No case details found.</Alert>;

  return (
    <Container className="mt-4">
      <h2>📂 Case Details</h2>

      <Card className="shadow-sm border-0 mt-3">
        <Card.Body>
          <Row>
            <Col md={8}>
              <Card.Title className="mb-3">
                <strong>{caseData.title}</strong>
              </Card.Title>
              <Card.Text>
                <strong>Description:</strong> {caseData.description || "No description provided."}
              </Card.Text>
              <Card.Text>
                <strong>Status:</strong>{" "}
                <Badge
                  bg={
                    caseData.status === "PENDING"
                      ? "warning"
                      : caseData.status === "Ongoing"
                      ? "info"
                      : caseData.status === "Completed"
                      ? "success"
                      : "secondary"
                  }
                >
                  {caseData.status}
                </Badge>
              </Card.Text>
              <Card.Text>
                <strong>Created By:</strong> {caseData.created_by || "—"} <br />
                <strong>Assigned To:</strong> {caseData.assigned_to || "—"}
              </Card.Text>
              <Card.Text>
                <strong>Created At:</strong>{" "}
                {new Date(caseData.created_at || Date.now()).toLocaleString()}
              </Card.Text>
            </Col>

            <Col md={4} className="border-start">
              <h5 className="mb-3">⚖️ Case Summary</h5>
              <p>
                This section can include a summary of hearings, uploaded evidence, and case notes for
                judges to review before making a ruling.
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* 🔹 Future sections */}
      <div className="mt-4">
        <h5>🗓️ Hearings</h5>
        <Alert variant="light">Upcoming and past hearings will be listed here.</Alert>

        <h5>📁 Evidence</h5>
        <Alert variant="light">Linked evidence files will appear here.</Alert>

        <h5>📝 Case Notes</h5>
        <Alert variant="light">Prosecutor and judge notes will be displayed here.</Alert>
      </div>
    </Container>
  );
}
