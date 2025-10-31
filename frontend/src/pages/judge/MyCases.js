import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Spinner,
  Alert,
  Badge,
  Button,
  Form,
} from "react-bootstrap";
import api from "../../api";
import { useNavigate } from "react-router-dom";

export default function MyCases() {
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState({});

  // ------------------------------------------------
  // Fetch all cases (Judge view)
  // ------------------------------------------------
  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const res = await api.get("/cases/");
        console.log("📑 Cases fetched:", res.data);
        setCases(res.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch cases:", err);
        setError("Unable to fetch case records from the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  // ------------------------------------------------
  // Update case status
  // ------------------------------------------------
  const handleStatusUpdate = async (caseId) => {
    const newStatus = selectedStatus[caseId];
    if (!newStatus) {
      alert("Please select a new status before updating.");
      return;
    }

    try {
      setUpdating(true);
      await api.put(`/cases/${caseId}`, { status: newStatus });
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId ? { ...c, status: newStatus } : c
        )
      );
    } catch (err) {
      console.error("❌ Status update failed:", err);
      setError("Failed to update case status.");
    } finally {
      setUpdating(false);
    }
  };

  // ------------------------------------------------
  // Loading / Error States
  // ------------------------------------------------
  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p className="text-muted mt-2">Loading cases...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  // ------------------------------------------------
  // RENDER
  // ------------------------------------------------
  return (
    <Container className="mt-4">
      <h2>⚖️ Judge Case Management</h2>
      <p className="text-muted">
        Manage, update, and review all cases currently active in your docket.
      </p>

      {cases.length === 0 ? (
        <Alert variant="light">No cases available.</Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-secondary">
            <tr>
              <th>Case ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Filed By</th>
              <th>Assigned To</th>
              <th>Update Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.title || "Untitled Case"}</td>
                <td>
                  <Badge
                    bg={
                      c.status?.toLowerCase() === "filed"
                        ? "warning"
                        : c.status?.toLowerCase() === "ongoing"
                        ? "success"
                        : c.status?.toLowerCase() === "review"
                        ? "info"
                        : c.status?.toLowerCase() === "closed"
                        ? "secondary"
                        : "dark"
                    }
                  >
                    {c.status || "Unknown"}
                  </Badge>
                </td>
                <td>{c.created_by || "—"}</td>
                <td>{c.assigned_to || "—"}</td>
                <td>
                  <Form.Select
                    size="sm"
                    value={selectedStatus[c.id] || ""}
                    onChange={(e) =>
                      setSelectedStatus((prev) => ({
                        ...prev,
                        [c.id]: e.target.value,
                      }))
                    }
                    disabled={updating}
                  >
                    <option value="">Change...</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Pending Ruling">Pending Ruling</option>
                    <option value="Closed">Closed</option>
                  </Form.Select>
                  <Button
                    variant="outline-success"
                    size="sm"
                    className="mt-1"
                    onClick={() => handleStatusUpdate(c.id)}
                    disabled={updating}
                  >
                    Update
                  </Button>
                </td>
                <td>
                  <Button
                    variant="dark"
                    size="sm"
                    onClick={() => navigate(`/judge/case/${c.id}`)}
                  >
                    View Details →
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
