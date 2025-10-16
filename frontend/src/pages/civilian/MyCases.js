import React, { useEffect, useState } from "react";
import api from "../../api";
import { Table, Spinner, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function MyCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await api.get("/cases/mine");
        setCases(res.data);
      } catch (err) {
        setError("Failed to load cases");
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <h3>📑 My Cases</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Case Title</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c, index) => (
            <tr key={c.id}>
              <td>{index + 1}</td>
              <td>{c.title}</td>
              <td>{c.status}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => navigate(`/civilian/cases/${c.id}`)}
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
