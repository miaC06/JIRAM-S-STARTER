import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Table,
  ProgressBar,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../auth/AuthContext"; // Optional, used for judge filtering

export default function JudgeDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    cases: 0,
    pendingRulings: 0,
    hearings: 0,
    evidences: 0,
  });
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const Animated = ({ children, delay = 0 }) => (
    <div
      className="animate__animated animate__fadeIn"
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // 🔹 1. Fetch all cases
        let allCases = [];
        try {
          const caseRes = await api.get("/cases/");
          allCases = caseRes.data || [];
        } catch (e) {
          console.warn("⚠️ Cases fetch failed:", e.message);
        }

        // 🔹 2. Fetch all hearings
        let allHearings = [];
        try {
          const hearingRes = await api.get("/hearings/");
          allHearings = hearingRes.data || [];
        } catch (e) {
          console.warn("⚠️ Hearings fetch failed:", e.message);
        }

        // 🔹 3. Attempt to fetch all evidence (may 404)
        let allEvidence = [];
        try {
          const evidenceRes = await api.get("/evidence/");
          allEvidence = evidenceRes.data || [];
        } catch (e) {
          console.warn("⚠️ Evidence endpoint not found — skipping count");
        }

        // 🔹 Filter cases assigned to this judge (optional)
        const judgeEmail = user?.email || "";
        const myCases = allCases.filter(
          (c) => c.assigned_to === judgeEmail || c.status === "Ongoing"
        );

        // 🔹 Calculate statistics
        const pendingRulings = myCases.filter(
          (c) =>
            c.status?.toLowerCase() === "pending ruling" ||
            c.status?.toLowerCase() === "review"
        ).length;

        setStats({
          cases: myCases.length,
          pendingRulings,
          hearings: allHearings.length,
          evidences: allEvidence.length,
        });

        // 🔹 Keep top 5 most recent cases
        setRecentCases(myCases.slice(0, 5));
      } catch (err) {
        console.error("❌ Dashboard load failed:", err);
        setError("Failed to load dashboard data. Check server or endpoints.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // -------------------------------
  // UI RENDER
  // -------------------------------
  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p className="text-muted mt-2">Loading judicial dashboard...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container fluid className="py-4 bg-light min-vh-100">
      {/* Header */}
      <Animated>
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark mb-1">⚖️ Judicial Control Panel</h2>
          <p className="text-muted">
            Oversee case activities, hearings, evidence reviews, and rulings — all at your command.
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
              value: stats.cases,
              color: "primary",
              progress: stats.cases ? 70 : 10,
            },
            {
              title: "Pending Rulings",
              value: stats.pendingRulings,
              color: "warning",
              progress: stats.pendingRulings ? 40 : 5,
            },
            {
              title: "Scheduled Hearings",
              value: stats.hearings,
              color: "success",
              progress: stats.hearings ? 80 : 10,
            },
            {
              title: "Evidence Reviews",
              value: stats.evidences,
              color: "info",
              progress: stats.evidences ? 55 : 10,
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
                {recentCases.length === 0 ? (
                  <Alert variant="light">No cases assigned yet.</Alert>
                ) : (
                  <Table hover responsive bordered size="sm" className="mb-3">
                    <thead className="table-secondary">
                      <tr>
                        <th>#</th>
                        <th>Case Title</th>
                        <th>Status</th>
                        <th>Created By</th>
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
                                c.status === "Pending"
                                  ? "warning"
                                  : c.status === "Active"
                                  ? "success"
                                  : "secondary"
                              }
                            >
                              {c.status}
                            </Badge>
                          </td>
                          <td>{c.created_by || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
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
