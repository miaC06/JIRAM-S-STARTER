// src/pages/prosecutor/CaseDetails.js
import React, { useState } from "react";
import { Container, Card, Row, Col, Tab, Nav, Badge } from "react-bootstrap";

export default function CaseDetails() {
  // Example case data (replace later with backend fetch)
  const caseData = {
    id: "001",
    title: "State vs. John Doe",
    status: "Open",
    filedOn: "15 Sept 2025",
    nextHearing: "28 Sept 2025",
    parties: {
      plaintiff: "State of Example",
      defendant: "John Doe",
      prosecutor: "Jane Smith",
      judge: "Hon. Justice Roberts",
    },
    evidence: ["Police Report", "Witness Statement", "CCTV Footage"],
    hearings: [
      { date: "15 Sept 2025", note: "Case Filed" },
      { date: "20 Sept 2025", note: "Preliminary Hearing" },
      { date: "28 Sept 2025", note: "Scheduled Hearing" },
    ],
  };

  const [activeKey, setActiveKey] = useState("overview");

  return (
    <Container className="mt-4">
      {/* Header Card */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-1">{caseData.title}</h3>
              <p className="text-muted mb-0">Case ID: {caseData.id}</p>
            </Col>
            <Col xs="auto">
              <Badge bg="success" className="px-3 py-2">
                {caseData.status}
              </Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabs */}
      <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="overview">Overview</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="parties">Parties</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="hearings">Hearings</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="evidence">Evidence</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* Overview */}
          <Tab.Pane eventKey="overview">
            <Card className="shadow-sm border-0 p-4">
              <p>
                <strong>Status:</strong> {caseData.status}
              </p>
              <p>
                <strong>Filed On:</strong> {caseData.filedOn}
              </p>
              <p>
                <strong>Next Hearing:</strong> {caseData.nextHearing}
              </p>
            </Card>
          </Tab.Pane>

          {/* Parties */}
          <Tab.Pane eventKey="parties">
            <Card className="shadow-sm border-0 p-4">
              <p>
                <strong>Plaintiff:</strong> {caseData.parties.plaintiff}
              </p>
              <p>
                <strong>Defendant:</strong> {caseData.parties.defendant}
              </p>
              <p>
                <strong>Prosecutor:</strong> {caseData.parties.prosecutor}
              </p>
              <p>
                <strong>Judge:</strong> {caseData.parties.judge}
              </p>
            </Card>
          </Tab.Pane>

          {/* Hearings */}
          <Tab.Pane eventKey="hearings">
            <Card className="shadow-sm border-0 p-4">
              <ul className="list-unstyled">
                {caseData.hearings.map((hearing, idx) => (
                  <li key={idx} className="mb-2">
                    <strong>{hearing.date}:</strong> {hearing.note}
                  </li>
                ))}
              </ul>
            </Card>
          </Tab.Pane>

          {/* Evidence */}
          <Tab.Pane eventKey="evidence">
            <Card className="shadow-sm border-0 p-4">
              <ul className="list-unstyled">
                {caseData.evidence.map((item, idx) => (
                  <li key={idx} className="mb-2">
                    📎 {item}
                  </li>
                ))}
              </ul>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}
