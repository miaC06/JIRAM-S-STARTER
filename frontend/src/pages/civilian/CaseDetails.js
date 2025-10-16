import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { Card, Spinner, Alert } from "react-bootstrap";

export default function CaseDetails() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await api.get(`/cases/${id}`);
        setCaseData(res.data);
      } catch (err) {
        setError("Failed to fetch case details");
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [id]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Card>
      <Card.Body>
        <Card.Title>{caseData.title}</Card.Title>
        <Card.Text><b>Status:</b> {caseData.status}</Card.Text>
        <Card.Text><b>Description:</b> {caseData.description}</Card.Text>
      </Card.Body>
    </Card>
  );
}
