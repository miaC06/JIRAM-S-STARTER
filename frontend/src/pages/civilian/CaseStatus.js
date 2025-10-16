import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { ListGroup, Spinner, Alert } from "react-bootstrap";

export default function CaseStatus() {
  const { id } = useParams();
  const [statusLogs, setStatusLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get(`/cases/${id}/status`);
        setStatusLogs(res.data);
      } catch (err) {
        setError("Failed to fetch case status");
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [id]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <h3>📊 Case Status</h3>
      <ListGroup>
        {statusLogs.map((log, idx) => (
          <ListGroup.Item key={idx}>
            <b>{log.date}</b>: {log.status}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}
