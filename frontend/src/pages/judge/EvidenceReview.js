import React from "react";
import { Container, ListGroup, Button } from "react-bootstrap";

export default function EvidenceReview() {
  const evidenceList = [
    { id: 1, name: "Witness Statement.pdf" },
    { id: 2, name: "Forensic Report.docx" },
    { id: 3, name: "Surveillance Video.mp4" },
  ];

  return (
    <Container className="mt-4">
      <h2>🕵 Evidence Review</h2>
      <p>Review and evaluate submitted evidence for cases.</p>

      <ListGroup>
        {evidenceList.map((ev) => (
          <ListGroup.Item
            key={ev.id}
            className="d-flex justify-content-between align-items-center"
          >
            {ev.name}
            <Button variant="outline-primary" size="sm">
              View
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}
