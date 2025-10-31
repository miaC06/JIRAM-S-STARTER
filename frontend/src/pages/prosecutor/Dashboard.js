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
import { useAuth } from "../../auth/AuthContext";

export default function ProsecutorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Dashboard statistics and state
  const [stats, setStats] = useState({
    activeCases: 0,
    pendingEvidence: 0,
    upcomingHearings: 0,
    filedSubmissions: 0,
  });

  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const Animated = ({ children, delay = 0 }) => (
    <div
      className="animate__animated animate__fadeInUp"
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );

  // ------------------------------------------------------------
  // Fetch all data for dashboard (cases, hearings, evidence, docs)
  // ------------------------------------------------------------
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // 1️⃣ Fetch all cases
        const caseRes = await api.get("/cases/");
        const allCases = caseRes.data || [];

        // Optionally filter to prosecutor’s assigned cases
        const prosecutorEmail = user?.email || "";
        const myCases = allCases.filter(
          (c) => c.assigned_to === prosecutorEmail || c.status !== "Closed"
        );

        // 2️⃣ Fetch all hearings
        let hearings = [];
        try {
          const hearingRes = await api.get("/hearings/");
          hearings = hearingRes.data || [];
        } catch {
          hearings = [];
        }

        // 3️⃣ Fetch all documents per case (since `/documents/` root doesn’t exist)
        let documents = [];
        try {
          const docPromises = myCases.map((c) =>
            api
              .get(`/documents/${c.id}`)
              .then((res) => res.data)
              .catch(() => [])
          );
          const docArrays = await Promise.all(docPromises);
          documents = docArrays.flat();
        } catch (err) {
          console.warn("⚠️ Document fetch failed:", err.message);
        }

        // 4️⃣ Fetch all evidence per case (since `/evidence/` root doesn’t exist)
        let evidences = [];
        try {
          const evidencePromises = myCases.map((c) =>
            api
              .get(`/evidence/${c.id}`)
              .then((res) => res.data)
              .catch(() => [])
          );
          const evidenceArrays = await Promise.all(evidencePromises);
          evidences = evidenceArrays.flat();
        } catch (err) {
          console.warn("⚠️ Evidence fetch failed:", err.message);
        }

        // 5️⃣ Derive statistics
        const activeCases = myCases.filter(
          (c) => c.status?.toLowerCase() === "ongoing"
        ).length;

        const pendingEvidence = evidences.filter(
          (e) => e.status?.toLowerCase() === "pending"
        ).length;

        const upcomingHearings = hearings.length;
        const filedSubmissions = documents.length;

        // Apply to state
        setStats({
          activeCases,
          pendingEvidence,
          upcomingHearings,
          filedSubmissions,
        });

        // Limit recent cases for table
        setRecentCases(myCases.slice(0, 5));
      } catch (err) {
        console.error("❌ Dashboard fetch failed:", err);
        setError("Unable to load prosecutor dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // ------------------------------------------------------------
  // Loading / Error UI
  // ------------------------------------------------------------
  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p className="text-muted mt-2">Loading prosecutor dashboard...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  // ------------------------------------------------------------
  // RENDER UI
  // ------------------------------------------------------------
  return (
    <Container fluid className="py-4 bg-white min-vh-100">
      {/* Header */}
      <Animated>
        <div className="text-center mb-5">
          <h2 className="fw-bold text-danger">⚖️ Prosecutor Operations Panel</h2>
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
              value: stats.activeCases,
              color: "primary",
              progress: stats.activeCases ? 70 : 10,
            },
            {
              title: "Pending Evidence",
              value: stats.pendingEvidence,
              color: "danger",
              progress: stats.pendingEvidence ? 45 : 5,
            },
            {
              title: "Upcoming Hearings",
              value: stats.upcomingHearings,
              color: "warning",
              progress: stats.upcomingHearings ? 65 : 10,
            },
            {
              title: "Filed Submissions",
              value: stats.filedSubmissions,
              color: "success",
              progress: stats.filedSubmissions ? 80 : 10,
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
                {recentCases.length === 0 ? (
                  <Alert variant="light">No cases found.</Alert>
                ) : (
                  <Table responsive bordered hover size="sm">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Case Title</th>
                        <th>Status</th>
                        <th>Filed By</th>
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
                                c.status?.toLowerCase() === "ongoing"
                                  ? "success"
                                  : c.status?.toLowerCase() === "review"
                                  ? "warning"
                                  : c.status?.toLowerCase() === "closed"
                                  ? "secondary"
                                  : "info"
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
