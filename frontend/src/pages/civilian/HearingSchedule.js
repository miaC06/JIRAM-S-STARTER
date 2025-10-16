import React, { useEffect, useState } from "react";
import api from "../../api";
import { Table, Spinner, Alert } from "react-bootstrap";

export default function HearingSchedule() {
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHearings = async () => {
      try {
        const res = await api.get("/hearings/mine");
        setHearings(res.data);
      } catch (err) {
        setError("Failed to fetch hearings");
      } finally {
        setLoading(false);
      }
    };
    fetchHearings();
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <h3>📅 Hearing Schedule</h3>
      <Table striped bordered>
        <thead>
          <tr>
            <th>#</th>
            <th>Case</th>
            <th>Date</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {hearings.map((h, idx) => (
            <tr key={h.id}>
              <td>{idx + 1}</td>
              <td>{h.case_title}</td>
              <td>{new Date(h.date).toLocaleString()}</td>
              <td>{h.location}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
