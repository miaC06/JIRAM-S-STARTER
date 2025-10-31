// src/pages/registrar/Dashboard.js
// ============================================================
// 📋 Registrar Dashboard — Live Data Overview
// Pulls system metrics from backend endpoints and links to core registrar modules.
// ============================================================

import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ProgressBar,
  Badge,
  Table,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../../config/api";
import { useAuth } from "../../auth/AuthContext";

export default function RegistrarDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ------------------------------
  // STATE
  // ------------------------------
  const [stats, setStats] = useState({
    totalCases: 0,
    pendingHearings: 0,
    activeUsers: 0,
    reports: 0,
  });
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ------------------------------
  // FETCH DASHBOARD DATA
  // ------------------------------
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // Parallel fetch for performance
        const [casesRes, hearingsRes, usersRes] = await Promise.all([
          API.api.get("/cases/admin/all"),
          API.api.get("/hearings/"),
          API.api.get(`/users/all?registrar_email=${user.email}`),
        ]);

        const allCases = casesRes.data || [];
        const allHearings = hearingsRes.data || [];
        const allUsers = usersRes.data || [];

        // Compute metrics
        const totalCases = allCases.length;
        const pendingHearings = allHearings.filter(
          (h) =>
            h.status?.toUpperCase() === "PENDING" ||
            h.status?.toUpperCase() === "SCHEDULED"
        ).length;
        const activeUsers = allUsers.length;

        // Reports placeholder — if your API later supports /documents/
        const reports = 0;

        // Keep top 3-5 most recent cases
        const recentCases = allCases
          .sort(
            (a, b) =>
              new Date(b.date_filed || b.created_at) -
              new Date(a.date_filed || a.created_at)
          )
          .slice(0, 5);

        setStats({ totalCases, pendingHearings, activeUsers, reports });
        setRecentCases(recentCases);
      } catch (err) {
        console.error("❌ Dashboard fetch failed:", err);
        setError("Failed to fetch dashboard data from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ------------------------------
  // SMALL ANIMATED WRAPPER
  // ------------------------------
  const Animated = ({ children, delay = 0 }) => (
    <div
      className="animate__animated animate__fadeIn"
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );

  // ------------------------------
  // UI: LOADING & ERROR
  // ------------------------------
  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
        <Spinner animation="border" variant="primary" />
        <p className="text-muted mt-3">Loading dashboard...</p>
      </div>
    );

  if (error)
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  // ------------------------------
  // MAIN DASHBOARD UI
  // ------------------------------
  return (
    <Container fluid className="py-4 bg-light min-vh-100">
      {/* Header */}
      <Animated>
        <div className="text-center mb-5">
          <h2 className="fw-bold text-primary">📋 Registrar Control Center</h2>
          <p className="text-muted mb-1">
            Coordinate case assignments, schedule hearings, manage user access,
            and oversee system operations.
          </p>
          <Badge bg="info" className="p-2 mt-2">
            Administrative Access • {user?.role || "Registrar"}
          </Badge>
        </div>
      </Animated>

      {/* Overview Summary */}
      <Animated delay={0.1}>
        <Row className="g-4 px-3 mb-4">
          {[
            {
              title: "Total Cases",
              value: stats.totalCases,
              color: "primary",
              progress: Math.min(stats.totalCases / 2, 100),
            },
            {
              title: "Pending Hearings",
              value: stats.pendingHearings,
              color: "warning",
              progress: Math.min(stats.pendingHearings * 10, 100),
            },
            {
              title: "Active Users",
              value: stats.activeUsers,
              color: "success",
              progress: Math.min(stats.activeUsers * 5, 100),
            },
            {
              title: "Reports Generated",
              value: stats.reports,
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
                📂 Recent Case Assignments
              </Card.Header>
              <Card.Body>
                {recentCases.length === 0 ? (
                  <p className="text-muted text-center mb-0">
                    No cases registered yet.
                  </p>
                ) : (
                  <Table responsive hover size="sm" bordered>
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Case Title</th>
                        <th>Status</th>
                        <th>Date Filed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentCases.map((c, i) => (
                        <tr key={c.id}>
                          <td>{i + 1}</td>
                          <td>{c.title}</td>
                          <td>
                            <Badge
                              bg={
                                c.status?.toLowerCase() === "active"
                                  ? "success"
                                  : c.status?.toLowerCase() === "closed"
                                  ? "secondary"
                                  : "warning"
                              }
                            >
                              {c.status || "Unknown"}
                            </Badge>
                          </td>
                          <td>
                            {c.date_filed
                              ? new Date(c.date_filed).toLocaleDateString()
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}

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
