import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CaseAPI } from "../../services/api"; // ✅ Import CaseAPI helper
import { Card, Spinner, Alert, ListGroup } from "react-bootstrap";

export default function CaseStatus() {
  const { id } = useParams(); // Extract case ID from URL
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const token = localStorage.getItem("token"); // get auth token if required
        const res = await CaseAPI.details(id, token);
        setCaseData(res);
      } catch (err) {
        console.error("❌ Error fetching case:", err);
        setError("Failed to fetch case details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [id]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!caseData) return <Alert variant="warning">No case found.</Alert>;

  return (
    <Card className="shadow-sm mt-3">
      <Card.Body>
        <Card.Title>⚖️ Case Status</Card.Title>
        <Card.Text>
          <b>Case Title:</b> {caseData.title}
          <br />
          <b>Description:</b> {caseData.description}
        </Card.Text>

        <ListGroup variant="flush" className="mt-3">
          <ListGroup.Item>
            <b>Status:</b> {caseData.status}
          </ListGroup.Item>
          <ListGroup.Item>
            <b>Created By:</b>{" "}
            {caseData.created_by?.email || `User #${caseData.created_by_id}`}
          </ListGroup.Item>
          <ListGroup.Item>
            <b>Assigned To:</b>{" "}
            {caseData.assigned_to?.email || `User #${caseData.assigned_to_id}`}
          </ListGroup.Item>
          <ListGroup.Item>
            <b>Created At:</b>{" "}
            {new Date(caseData.created_at).toLocaleString()}
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}
