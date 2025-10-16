// src/pages/prosecutor/Submissions.js
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ListGroup,
} from "react-bootstrap";

export default function Submissions() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [submissions, setSubmissions] = useState([]);

  // Handle new submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !details.trim()) {
      alert("Please fill in both fields.");
      return;
    }

    const newSubmission = {
      id: submissions.length + 1,
      title,
      details,
      date: new Date().toLocaleString(),
    };

    setSubmissions([newSubmission, ...submissions]); // prepend new submission
    setTitle("");
    setDetails("");
  };

  return (
    <Container className="mt-4">
      {/* Header */}
      <h2 className="mb-4">📝 Submissions</h2>
      <p className="text-muted">
        Submit motions, responses, or supporting documents to the court system.
      </p>

      <Row>
        {/* New Submission Form */}
        <Col md={6} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>➕ New Submission</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Submission Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter submission title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Details</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter submission details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                </Form.Group>

                <Button type="submit" variant="success" className="w-100">
                  Submit Document
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Submitted Documents List */}
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>📂 Submitted Documents</Card.Title>
              {submissions.length === 0 ? (
                <p className="text-muted">No submissions yet.</p>
              ) : (
                <ListGroup variant="flush">
                  {submissions.map((sub) => (
                    <ListGroup.Item key={sub.id}>
                      <h6 className="mb-1">{sub.title}</h6>
                      <small className="text-muted">{sub.date}</small>
                      <p className="mb-0 text-muted">{sub.details}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
