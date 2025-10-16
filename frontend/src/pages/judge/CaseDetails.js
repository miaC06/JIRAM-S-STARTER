import React from "react";
import { Container, Card } from "react-bootstrap";

export default function CaseDetails() {
  return (
    <Container className="mt-4">
      <h2>📂 Case Details</h2>
      <Card className="shadow-sm border-0 p-3">
        <Card.Body>
          <Card.Title>Case ID: #1</Card.Title>
          <Card.Text>
            <strong>Title:</strong> State vs John Doe <br />
            <strong>Status:</strong> Ongoing <br />
            <strong>Description:</strong> This is a sample case description
            showing the parties, facts, and case progress.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}
