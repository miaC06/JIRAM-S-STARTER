import React from "react";
import { Table, Container } from "react-bootstrap";

export default function MyCases() {
  const cases = [
    { id: 1, title: "State vs John Doe", status: "Ongoing" },
    { id: 2, title: "Civil Dispute - Land", status: "Hearing Scheduled" },
  ];

  return (
    <Container className="mt-4">
      <h2>📑 My Cases</h2>
      <p>List of cases currently assigned to you.</p>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Case ID</th>
            <th>Title</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.title}</td>
              <td>{c.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
