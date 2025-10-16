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

export default function JudgeDashboard() {
  const navigate = useNavigate();

  const Animated = ({ children, delay = 0 }) => (
    <div
      className="animate__animated animate__fadeIn"
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );

  return (
    <Container fluid className="py-4 bg-light min-vh-100">
      {/* Header */}
      <Animated>
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark mb-1">⚖️ Judicial Control Panel</h2>
          <p className="text-muted">
            Oversee case activities, hearings, evidence reviews, and rulings —
            all at your command.
          </p>
          <Badge bg="dark" className="p-2 mt-2">
            Judge Access • Authorized
          </Badge>
        </div>
      </Animated>

      {/* Summary Statistics */}
      <Animated delay={0.2}>
        <Row className="g-4 mb-4 px-3">
          {[
            {
              title: "Active Cases",
              value: 18,
              color: "primary",
              progress: 70,
            },
            {
              title: "Pending Rulings",
              value: 6,
              color: "warning",
              progress: 40,
            },
            {
              title: "Scheduled Hearings",
              value: 12,
              color: "success",
              progress: 80,
            },
            {
              title: "Evidence Reviews",
              value: 9,
              color: "info",
              progress: 55,
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

      {/* Functional Panels */}
      <Animated delay={0.3}>
        <Row className="g-4 px-3">
          {/* Left Column */}
          <Col md={7}>
            {/* Case Management */}
            <Card className="shadow-lg border-0 mb-4">
              <Card.Header className="bg-dark text-white fw-bold">
                📁 Case Management
              </Card.Header>
              <Card.Body>
                <Table hover responsive bordered size="sm" className="mb-3">
                  <thead className="table-secondary">
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
                      <td>State vs Moyo</td>
                      <td>
                        <Badge bg="warning" text="dark">
                          Pending
                        </Badge>
                      </td>
                      <td>08 Oct 2025</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>People vs Banda</td>
                      <td>
                        <Badge bg="success">Active</Badge>
                      </td>
                      <td>11 Oct 2025</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Republic vs Chirwa</td>
                      <td>
                        <Badge bg="danger">Review</Badge>
                      </td>
                      <td>13 Oct 2025</td>
                    </tr>
                  </tbody>
                </Table>
                <div className="text-end">
                  <Button
                    variant="dark"
                    onClick={() => navigate("/judge/cases")}
                  >
                    Manage All Cases →
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Hearings */}
            <Card className="shadow border-0 mb-4">
              <Card.Header className="bg-success text-white fw-bold">
                📅 Upcoming Hearings
              </Card.Header>
              <Card.Body>
                <p className="text-muted small">
                  Manage your hearing schedules and attendance records.
                </p>
                <Button
                  variant="success"
                  onClick={() => navigate("/judge/hearings")}
                >
                  View Schedule →
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column */}
          <Col md={5}>
            {/* Evidence Review */}
            <Card className="shadow border-0 mb-4">
              <Card.Header className="bg-info text-white fw-bold">
                🕵 Evidence Reviews
              </Card.Header>
              <Card.Body>
                <p className="text-muted small">
                  Examine and verify all submitted evidence for ongoing cases.
                </p>
                <Button
                  variant="info"
                  className="text-white"
                  onClick={() => navigate("/judge/evidence")}
                >
                  Review Evidence →
                </Button>
              </Card.Body>
            </Card>

            {/* Rulings */}
            <Card className="shadow border-0">
              <Card.Header className="bg-warning fw-bold text-dark">
                ⚖️ Pending Rulings
              </Card.Header>
              <Card.Body>
                <p className="text-muted small">
                  Write, approve, and issue judgments for completed cases.
                </p>
                <Button
                  variant="dark"
                  onClick={() => navigate("/judge/rulings")}
                >
                  Issue Rulings →
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Animated>

      {/* Footer */}
      <div className="text-center text-muted small mt-5">
        <hr />
        <p className="mb-1 fw-semibold">Judicial System Interface</p>
        <p>© {new Date().getFullYear()} Ministry of Justice</p>
      </div>
    </Container>
  );
}
