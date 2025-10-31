import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Badge } from "react-bootstrap";
import api from "../../api";

export default function HearingSchedule() {
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Fetch all hearings
  useEffect(() => {
    const fetchHearings = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/hearings/"); // ✅ matches your backend
        setHearings(res.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch hearings:", err);
        setError("Failed to fetch hearings");
      } finally {
        setLoading(false);
      }
    };
    fetchHearings();
  }, []);

  if (loading)
    return (
      <div className="text-center my-4">
        <Spinner animation="border" />
        <p className="text-muted mt-2">Loading hearing schedule...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (hearings.length === 0) return <Alert variant="info">No hearings available.</Alert>;

  return (
    <div className="p-3">
      <h3 className="mb-4">📅 Hearing Schedule</h3>
      <Table bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Case Title</th>
            <th>Date</th>
            <th>Location</th>
            <th>Judge</th>
            <th>Registrar</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {hearings.map((h, idx) => (
            <tr key={h.id}>
              <td>{idx + 1}</td>
              <td>{h.case_title || "—"}</td>
              <td>{new Date(h.scheduled_date).toLocaleString()}</td>
              <td>{h.location || "—"}</td>
              <td>{h.judge_name || "—"}</td>
              <td>{h.registrar_name || "—"}</td>
              <td>
                <Badge
                  bg={
                    h.status === "Scheduled"
                      ? "info"
                      : h.status === "Completed"
                      ? "success"
                      : "secondary"
                  }
                >
                  {h.status || "Unknown"}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
