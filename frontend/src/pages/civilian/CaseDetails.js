import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { Card, Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../../auth/AuthContext";

export default function CaseDetails() {
  const { id } = useParams();
  const { user } = useAuth(); // get current user's email
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCase = async () => {
      try {
        if (!user?.email) {
          setError("User not authenticated");
          return;
        }

        // ✅ Get all cases for this user
        const res = await api.get(`/cases/mine/${user.email}`);
        const cases = res.data || [];

        // ✅ Find the one with matching ID from the URL
        const foundCase = cases.find((c) => String(c.id) === String(id));

        if (!foundCase) {
          setError(`Case with ID ${id} not found for this user.`);
        } else {
          setCaseData(foundCase);
        }
      } catch (err) {
        console.error("❌ Failed to fetch case details:", err);
        setError("Failed to fetch case details");
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id, user]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p className="mt-2 text-muted">Loading case details...</p>
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="mt-4 text-center">
        {error}
      </Alert>
    );

  return (
    <Card className="shadow-sm border-0 mt-4">
      <Card.Body>
        <Card.Title className="fw-bold text-primary">{caseData.title}</Card.Title>
        <Card.Text>
          <b>Status:</b> {caseData.status}
        </Card.Text>
        <Card.Text>
          <b>Description:</b> {caseData.description}
        </Card.Text>
        <Card.Text>
          <b>Created By:</b> {caseData.created_by || "Unknown"}
        </Card.Text>
        <Card.Text>
          <b>Assigned To:</b> {caseData.assigned_to || "Not yet assigned"}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
