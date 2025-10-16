import React, { useEffect, useState } from "react";
import api from "../../api";
import { ListGroup, Spinner, Alert, Button } from "react-bootstrap";

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await api.get("/documents/mine");
        setDocs(res.data);
      } catch (err) {
        setError("Failed to load documents");
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <h3>📄 Court Documents</h3>
      <ListGroup>
        {docs.map((d) => (
          <ListGroup.Item key={d.id}>
            {d.title} — {new Date(d.date).toLocaleDateString()}
            <Button
              className="float-end"
              variant="outline-primary"
              size="sm"
              onClick={() => window.open(d.file_url, "_blank")}
            >
              Download
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}
