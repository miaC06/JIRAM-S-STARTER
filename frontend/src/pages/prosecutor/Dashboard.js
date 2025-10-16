// src/pages/prosecutor/Dashboard.js
import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Table,
  ProgressBar,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ProsecutorDashboard() {
  const navigate = useNavigate();

  const Animated = ({ children, delay = 0 }) => (
    <div
      className="animate__animated animate__fadeInUp"
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );

  return (
    <Container fluid className="py-4 bg-white min-vh-100">
      {/* Header */}
      <Animated>
        <div className="text-center mb-5">
          <h2 className="fw-bold text-danger">
            ⚖️ Prosecutor Operations Panel
          </h2>
          <p className="text-muted mb-1">
            Manage active prosecutions, monitor case progress, analyze evidence,
            and coordinate with the judiciary efficiently.
          </p>
          <Badge bg="danger" className="p-2 mt-2">
            Prosecutor Access • Restricted
          </Badge>
        </div>
      </Animated>

      {/* Overview Stats */}
      <Animated delay={0.1}>
        <Row className="g-4 mb-4 px-3">
          {[
            {
              title: "Active Cases",
              value: 22,
              color: "primary",
              progress: 65,
            },
            {
              title: "Pending Evidence",
              value: 7,
              color: "danger",
              progress: 45,
            },
            {
              title: "Upcoming Hearings",
              value: 11,
              color: "warning",
              progress: 70,
            },
            {
              title: "Filed Submissions",
              value: 15,
              color: "success",
              progress: 85,
            },
          ].map((item, i) => (
            <Col key={i} md={3} sm={6}>
              <Card className="shadow-sm border-0 h-100 text-center">
                <Card.Body>
                  <Card.Title className={`text-${item.color} fw-bold`}>
                    {item.title}
                  </Card.Title>
                  <h3 className="fw-bold">{item.value}</h3>
                  <ProgressBar
                    now={item.progress}
                    variant={item.color}
                    className="mt-2"
                  />
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Animated>

      {/* Core Panels */}
      <Animated delay={0.2}>
        <Row className="g-4 px-3">
          {/* Left Section */}
          <Col md={7}>
            {/* Case Management */}
            <Card className="shadow border-0 mb-4">
              <Card.Header className="bg-primary text-white fw-bold">
                📂 Active Case Files
              </Card.Header>
              <Card.Body>
                <Table responsive bordered hover size="sm">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Case Title</th>
                      <th>Status</th>
                      <th>Next Hearing</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>State vs Mokoena</td>
                      <td>
                        <Badge bg="warning" text="dark">
                          Under Review
                        </Badge>
                      </td>
                      <td>10 Oct 2025</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>People vs Dube</td>
                      <td>
                        <Badge bg="success">Active</Badge>
                      </td>
                      <td>13 Oct 2025</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Republic vs Chisale</td>
                      <td>
                        <Badge bg="danger">Pending Evidence</Badge>
                      </td>
                      <td>17 Oct 2025</td>
                    </tr>
                  </tbody>
                </Table>

                <div className="text-end">
                  <Button
                    variant="primary"
                    onClick={() => navigate("/prosecutor/cases")}
                  >
                    Manage All Cases →
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Hearings */}
            <Card className="shadow border-0 mb-4">
              <Card.Header className="bg-warning fw-bold text-dark">
                📅 Hearings & Scheduling
              </Card.Header>
              <Card.Body>
                <p className="text-muted small">
                  Stay informed of upcoming hearings and prepare arguments.
                </p>
                <Button
                  variant="warning"
                  onClick={() => navigate("/prosecutor/hearings")}
                >
                  View Schedule →
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Section */}
          <Col md={5}>
            {/* Evidence */}
            <Card className="shadow border-0 mb-4">
              <Card.Header className="bg-danger text-white fw-bold">
                🔍 Evidence Management
              </Card.Header>
              <Card.Body>
                <p className="text-muted small">
                  Review and upload new evidence for active prosecutions.
                </p>
                <Button
                  variant="danger"
                  onClick={() => navigate("/prosecutor/evidence")}
                >
                  Manage Evidence →
                </Button>
              </Card.Body>
            </Card>

            {/* Submissions */}
            <Card className="shadow border-0 mb-4">
              <Card.Header className="bg-success text-white fw-bold">
                📝 Legal Submissions
              </Card.Header>
              <Card.Body>
                <p className="text-muted small">
                  File motions, responses, and official documents to the court.
                </p>
                <Button
                  variant="success"
                  onClick={() => navigate("/prosecutor/submissions")}
                >
                  Submit Documents →
                </Button>
              </Card.Body>
            </Card>

            {/* Analytics */}
            <Card className="shadow border-0">
              <Card.Header className="bg-secondary text-white fw-bold">
                📊 Case Insights
              </Card.Header>
              <Card.Body>
                <p className="text-muted small">
                  Analyze performance trends and conviction rates.
                </p>
                <ProgressBar
                  now={75}
                  variant="info"
                  label="Conviction Rate"
                  className="mb-2"
                />
                <ProgressBar
                  now={60}
                  variant="success"
                  label="Resolved Cases"
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Animated>

      {/* Footer */}
      <div className="text-center text-muted small mt-5">
        <hr />
        <p className="mb-1 fw-semibold">Prosecutorial Command Center</p>
        <p>© {new Date().getFullYear()} Ministry of Justice</p>
      </div>
    </Container>
  );
}
