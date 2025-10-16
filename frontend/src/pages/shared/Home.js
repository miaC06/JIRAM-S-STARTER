import React, { useEffect } from "react";
import {
  Container,
  Navbar,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Carousel,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Footer from "../../layouts/Footer";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showInfo, setShowInfo] = React.useState(false);
  const [modalContent, setModalContent] = React.useState({});

  // ✅ Role-based redirect logic
  useEffect(() => {
    if (user) {
      const roles = user.roles || [];
      if (roles.includes("CIVILIAN")) navigate("/civilian/dashboard");
      else if (roles.includes("PROSECUTOR")) navigate("/prosecutor/dashboard");
      else if (roles.includes("JUDGE")) navigate("/judge/dashboard");
      else if (roles.includes("REGISTRAR")) navigate("/registrar/dashboard");
    }
  }, [user, navigate]);

  // ✅ Modal open/close handlers
  const handleShow = (title, text) => {
    setModalContent({ title, text });
    setShowInfo(true);
  };

  const handleClose = () => setShowInfo(false);

  // ✅ Card click handler
  const handleCardClick = () => navigate("/login");

  return (
    <>
      {/* Navbar */}
      <Navbar
        expand="lg"
        bg="dark"
        variant="dark"
        sticky="top"
        className="shadow-sm"
      >
        <Container>
          <Navbar.Brand className="fw-bold fs-4">
            🏛 Case Management System
          </Navbar.Brand>
        </Container>
      </Navbar>

      {/* Hero Section with Carousel */}
      <Carousel fade interval={4000}>
        <Carousel.Item>
          <div
            className="d-flex align-items-center justify-content-center text-center"
            style={{
              height: "70vh",
              background:
                "linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1603791440384-56cd371ee9a7') center/cover",
            }}
          >
            <Container>
              <h1 className="display-4 text-white fw-bold mb-3">
                Welcome to the Case Management System
              </h1>
              <p className="lead text-light mb-4">
                Secure access to case filing, digital evidence, hearings, and
                billing.
              </p>
              <Button
                variant="light"
                size="lg"
                className="fw-bold"
                onClick={handleCardClick}
              >
                Get Started
              </Button>
            </Container>
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div
            className="d-flex align-items-center justify-content-center text-center"
            style={{
              height: "70vh",
              background:
                "linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1528747045269-390fe33c19d0') center/cover",
            }}
          >
            <Container>
              <h1 className="display-5 text-white fw-bold mb-3">
                Empowering Digital Justice
              </h1>
              <p className="lead text-light mb-4">
                Simplifying courtroom procedures and ensuring transparent access
                to justice.
              </p>
              <Button
                variant="outline-light"
                size="lg"
                onClick={() =>
                  handleShow(
                    "About the System",
                    "The Case Management System streamlines legal operations by integrating evidence, billing, and scheduling into one secure digital platform."
                  )
                }
              >
                Learn More
              </Button>
            </Container>
          </div>
        </Carousel.Item>
      </Carousel>

      {/* Role Section */}
      <Container className="py-5 text-center">
        <h2 className="fw-bold mb-4 text-primary">
          Choose Your Role to Continue
        </h2>
        <Row className="g-4 justify-content-center">
          {[
            {
              title: "👤 Civilian",
              text: "File cases, upload evidence, and track case progress.",
              color: "primary",
            },
            {
              title: "⚖️ Prosecutor",
              text: "Manage assigned cases, review evidence, and submit charges.",
              color: "danger",
            },
            {
              title: "👨‍⚖️ Judge",
              text: "Review cases, schedule hearings, and deliver rulings.",
              color: "warning",
            },
            {
              title: "📋 Registrar",
              text: "Oversee the system, assign roles, verify evidence, and manage billing.",
              color: "secondary",
            },
          ].map((role, index) => (
            <Col key={index} md={3} sm={6}>
              <Card
                bg={role.color}
                text={role.color === "warning" ? "dark" : "light"}
                className="shadow-lg border-0 h-100"
                onClick={handleCardClick}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-8px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
                style={{
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                }}
              >
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <Card.Title className="fw-bold fs-4 mb-2">
                    {role.title}
                  </Card.Title>
                  <Card.Text className="mb-3">{role.text}</Card.Text>
                  <Button
                    variant="light"
                    size="sm"
                    className="fw-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShow(role.title, role.text);
                    }}
                  >
                    More Info
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Call to Action Section */}
      <Container
        fluid
        className="text-center py-5 bg-light border-top border-bottom"
      >
        <h3 className="fw-bold mb-3 text-dark">
          Ready to Experience Digital Justice?
        </h3>
        <p className="text-muted mb-4">
          Join the Case Management System and streamline your courtroom
          operations securely.
        </p>
        <Button
          variant="primary"
          size="lg"
          className="fw-semibold px-4"
          onClick={handleCardClick}
        >
          Proceed to Login
        </Button>
      </Container>

      {/* Info Modal */}
      <Modal show={showInfo} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent.text}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCardClick}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Footer */}
      <Footer />
    </>
  );
}
