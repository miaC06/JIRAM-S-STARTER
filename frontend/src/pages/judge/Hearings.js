import React from "react";
import { Container, Table, Button } from "react-bootstrap";

export default function Hearings() {
  const hearings = [
    { id: 1, case: "State vs John Doe", date: "2025-09-25", status: "Scheduled" },
    { id: 2, case: "Civil Dispute - Land", date: "2025-09-30", status: "Pending" },
  ];

  return (
    <Container className="mt-4">
      <h2>📅 Hearings</h2>
      <p>View and manage scheduled hearings.</p>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Hearing ID</th>
            <th>Case</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {hearings.map((h) => (
            <tr key={h.id}>
              <td>{h.id}</td>
              <td>{h.case}</td>
              <td>{h.date}</td>
              <td>{h.status}</td>
              <td>
                <Button variant="warning" size="sm">
                  Reschedule
                </Button>{" "}
                <Button variant="danger" size="sm">
                  Cancel
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
