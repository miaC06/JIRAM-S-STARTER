// src/pages/registrar/Dashboard.js
import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ProgressBar,
  Badge,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function RegistrarDashboard() {
  const navigate = useNavigate();

  // ✅ Subtle fade-in effect (Bootstrap + Animate.css if available)
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
          <h2 className="fw-bold text-teal">📋 Registrar Control Center</h2>
          <p className="text-muted mb-1">
            Coordinate case assignments, schedule hearings, manage user access,
            and oversee system operations.
          </p>
          <Badge bg="info" className="p-2 mt-2">
            Administrative Access • Registrar
          </Badge>
        </div>
      </Animated>

      {/* Overview Summary */}
      <Animated delay={0.1}>
        <Row className="g-4 px-3 mb-4">
          {[
            {
              title: "Total Cases",
              value: 128,
              color: "primary",
              progress: 80,
            },
            {
              title: "Pending Hearings",
              value: 12,
              color: "warning",
              progress: 45,
            },
            {
              title: "Active Users",
              value: 54,
              color: "success",
              progress: 75,
            },
            {
              title: "Reports Generated",
              value: 23,
              color: "info",
              progress: 60,
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
            {/* Case Assignment Section */}
            <Card className="shadow border-0 mb-4">
              <Card.Header className="bg-primary text-white fw-bold">
                📂 Case Assignments
              </Card.Header>
              <Card.Body>
                <Table responsive hover size="sm" bordered>
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Case Title</th>
                      <th>Assigned To</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>State vs Kuda M.</td>
                      <td>Judge: T. Ndlovu</td>
                      <td>
                        <Badge bg="success">Active</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>People vs Chirwa</td>
                      <td>Prosecutor: A. Banda</td>
                      <td>
                        <Badge bg="warning" text="dark">
                          Pending
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>State vs Dube</td>
                      <td>Judge: P. Moyo</td>
                      <td>
                        <Badge bg="info">Scheduled</Badge>
                      </td>
                    </tr>
                  </tbody>
                </Table>

                <div className="text-end">
                  <Button
                    variant="primary"
                    onClick={() => navigate("/registrar/assignments")}
                  >
                    Manage Assignments →
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Hearing Management */}
            <Card className="shadow border-0">
              <Card.Header className="bg-success text-white fw-bold">
                📅 Hearing Management
              </Card.Header>
              <Card.Body>
                <p className="text-muted small">
                  Schedule or reschedule hearings for ongoing cases. Ensure
                  timely coordination between judges and prosecutors.
                </p>
                <Button
                  variant="success"
                  onClick={() => navigate("/registrar/hearings")}
                >
                  Manage Hearings →
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Section */}
          <Col md={5}>
            {/* User Management */}
            <Card className="shadow border-0 mb-4">
              <Card.Header className="bg-info text-white fw-bold">
                👥 User Account Management
              </Card.Header>
              <Card.Body>
                <p className="text-muted small">
                  Manage user accounts for all system roles: Civilian,
                  Prosecutor, Judge, and Registrar.
                </p>
                <Button
                  variant="info"
                  onClick={() => navigate("/registrar/users")}
                >
                  Manage Users →
                </Button>
              </Card.Body>
            </Card>

            {/* Reports */}
            <Card className="shadow border-0 mb-4">
              <Card.Header className="bg-warning fw-bold text-dark">
                📊 System Reports
              </Card.Header>
              <Card.Body>
                <p className="text-muted small">
                  Generate and review reports on case statistics, user activity,
                  and system logs.
                </p>
                <Button
                  variant="warning"
                  onClick={() => navigate("/registrar/reports")}
                >
                  View Reports →
                </Button>
              </Card.Body>
            </Card>

            {/* Analytics Overview */}
            <Card className="shadow border-0">
              <Card.Header className="bg-secondary text-white fw-bold">
                🧾 System Overview
              </Card.Header>
              <Card.Body>
                <p className="text-muted small">
                  Monitor system performance and data integrity.
                </p>
                <ProgressBar
                  now={85}
                  variant="info"
                  label="System Uptime"
                  className="mb-2"
                />
                <ProgressBar
                  now={72}
                  variant="success"
                  label="Data Sync Health"
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Animated>

      {/* Footer */}
      <div className="text-center text-muted small mt-5">
        <hr />
        <p className="mb-1 fw-semibold">Registrar Administrative Dashboard</p>
        <p>© {new Date().getFullYear()} Ministry of Justice</p>
      </div>
    </Container>
  );
}
