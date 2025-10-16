import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";

export default function Rulings() {
  const [ruling, setRuling] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Ruling submitted: " + ruling);
    setRuling("");
  };

  return (
    <Container className="mt-4">
      <h2>⚖️ Rulings</h2>
      <p>Write and issue rulings for completed cases.</p>

      <Card className="p-3 shadow-sm border-0">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Case ID</Form.Label>
            <Form.Control type="text" placeholder="Enter case ID" required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ruling</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Write ruling here..."
              value={ruling}
              onChange={(e) => setRuling(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            Submit Ruling
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
