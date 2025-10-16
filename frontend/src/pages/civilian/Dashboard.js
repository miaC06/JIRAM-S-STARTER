import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Spinner,
  ProgressBar,
} from "react-bootstrap";
import api from "../../api";
import { useAuth } from "../../auth/AuthContext";

export default function CivilianDashboard() {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [caseRes, paymentRes] = await Promise.all([
          api.get("/cases"),
          api.get("/payments"),
        ]);
        setCases(caseRes.data || []);
        setPayments(paymentRes.data || []);
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Small helper for animated appearance
  const AnimatedCard = ({ children, delay = 0 }) => (
    <div
      className="animate__animated animate__fadeInUp"
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );

  return (
    <Container className="py-4">
      {/* Welcome Section */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">
          👋 Welcome back, {user?.email || "Civilian"}
        </h2>
        <p className="text-muted">
          Manage your cases, track payments, and stay updated with court
          proceedings — all in one place.
        </p>
      </div>

      {loading ? (
        <div className="d-flex flex-column align-items-center my-5">
          <Spinner animation="border" role="status" />
          <p className="mt-3 text-muted">Loading your dashboard...</p>
          <ProgressBar animated now={60} className="w-50 mt-2" />
        </div>
      ) : (
        <>
          {/* Quick Overview */}
          <Row className="g-4 mb-4">
            <Col md={6}>
              <AnimatedCard delay={0.1}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body>
                    <Card.Title className="fw-bold text-primary">
                      📑 Recent Cases
                    </Card.Title>
                    {cases.length > 0 ? (
                      <Table
                        size="sm"
                        bordered
                        hover
                        responsive
                        className="mt-3"
                      >
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>Case Title</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cases.slice(0, 3).map((c, i) => (
                            <tr key={c.id} className="align-middle">
                              <td>{i + 1}</td>
                              <td>{c.title}</td>
                              <td>
                                <span
                                  className={`badge bg-${
                                    c.status === "Closed"
                                      ? "danger"
                                      : c.status === "Pending"
                                      ? "warning text-dark"
                                      : "success"
                                  }`}
                                >
                                  {c.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <p className="text-muted mt-2">No cases filed yet.</p>
                    )}
                    <div className="text-end">
                      <Button variant="primary" href="/civilian/my-cases">
                        View All Cases →
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </AnimatedCard>
            </Col>

            <Col md={6}>
              <AnimatedCard delay={0.2}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body>
                    <Card.Title className="fw-bold text-success">
                      💳 Latest Payments
                    </Card.Title>
                    {payments.length > 0 ? (
                      <Table
                        size="sm"
                        bordered
                        hover
                        responsive
                        className="mt-3"
                      >
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.slice(0, 3).map((p, i) => (
                            <tr key={p.id} className="align-middle">
                              <td>{i + 1}</td>
                              <td>${p.amount}</td>
                              <td>
                                <span
                                  className={`badge bg-${
                                    p.status === "Failed"
                                      ? "danger"
                                      : p.status === "Pending"
                                      ? "warning text-dark"
                                      : "success"
                                  }`}
                                >
                                  {p.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <p className="text-muted mt-2">
                        No payments recorded yet.
                      </p>
                    )}
                    <div className="text-end">
                      <Button variant="warning" href="/civilian/payments">
                        View All Payments →
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </AnimatedCard>
            </Col>
          </Row>

          {/* Navigation Cards */}
          <Row className="g-4 mb-5">
            {[
              {
                title: "📝 File New Case",
                text: "Submit a new case online instantly.",
                link: "/civilian/new-case",
                variant: "success",
              },
              {
                title: "📂 Upload Evidence",
                text: "Attach important documents securely.",
                link: "/civilian/evidence",
                variant: "info",
              },
              {
                title: "📊 Case Status",
                text: "Monitor real-time case updates.",
                link: "/civilian/case-status",
                variant: "secondary",
              },
              {
                title: "📅 Hearing Schedule",
                text: "Stay informed on upcoming hearings.",
                link: "/civilian/hearings",
                variant: "dark",
              },
              {
                title: "📑 Court Documents",
                text: "Access all official documents.",
                link: "/civilian/documents",
                variant: "primary",
              },
              {
                title: "📂 Case Details",
                text: "View your full case information.",
                link: "/civilian/cases/1",
                variant: "outline-primary",
              },
            ].map((item, index) => (
              <Col md={4} key={index}>
                <AnimatedCard delay={0.3 + index * 0.1}>
                  <Card
                    className="shadow border-0 text-center h-100 p-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => (window.location.href = item.link)}
                  >
                    <Card.Body>
                      <Card.Title className="fw-bold">{item.title}</Card.Title>
                      <Card.Text className="text-muted small">
                        {item.text}
                      </Card.Text>
                      <Button variant={item.variant}>{`Go →`}</Button>
                    </Card.Body>
                  </Card>
                </AnimatedCard>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
}
