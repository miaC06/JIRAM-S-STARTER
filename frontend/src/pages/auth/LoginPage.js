import React, { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
  Spinner,
  Alert,
  Navbar,
} from "react-bootstrap";
import { EyeFill, EyeSlashFill, PersonFillLock } from "react-bootstrap-icons";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      if (!user?.role) throw new Error("No role found in response");

      // ✅ Redirect based on role
      switch (user.role) {
        case "CIVILIAN":
          navigate("/civilian");
          break;
        case "PROSECUTOR":
          navigate("/prosecutor");
          break;
        case "JUDGE":
          navigate("/judge");
          break;
        case "REGISTRAR":
          navigate("/registrar");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Invalid email or password. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Top Navbar */}
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="shadow-sm px-3"
        fixed="top"
      >
        <Container>
          <Navbar.Brand className="fw-bold">
            🏛 Case Management System
          </Navbar.Brand>
        </Container>
      </Navbar>

      {/* Login Section */}
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1e3a8a, #0f172a, #1e293b)",
          paddingTop: "4rem",
        }}
      >
        <Row className="w-100 justify-content-center px-3">
          <Col md={5} lg={4}>
            <Card
              className="shadow-lg border-0 text-center"
              style={{
                borderRadius: "15px",
                transform: "translateY(0)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-6px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <Card.Body className="p-4">
                {/* Header Icon */}
                <div
                  className="d-flex justify-content-center align-items-center mb-3"
                  style={{
                    width: "70px",
                    height: "70px",
                    margin: "0 auto",
                    borderRadius: "50%",
                    backgroundColor: "#1e3a8a",
                    color: "white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  }}
                >
                  <PersonFillLock size={35} />
                </div>

                <h3 className="fw-bold mb-3">Login</h3>
                <p className="text-muted mb-4">
                  Access your case management dashboard securely.
                </p>

                {error && <Alert variant="danger">{error}</Alert>}

                {/* Login Form */}
                <Form onSubmit={handleSubmit}>
                  {/* Email */}
                  <Form.Group className="mb-3 text-start">
                    <Form.Label className="fw-semibold text-secondary">
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-4 text-start">
                    <Form.Label className="fw-semibold text-secondary">
                      Password
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                      >
                        {showPassword ? <EyeSlashFill /> : <EyeFill />}
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  {/* Submit Button */}
                  <div className="d-grid">
                    <Button
                      variant="primary"
                      size="lg"
                      type="submit"
                      disabled={loading}
                      className="fw-semibold"
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />{" "}
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </div>
                </Form>

                {/* Forgot Password & Back */}
                <div className="d-flex justify-content-between mt-4">
                  <Button
                    variant="link"
                    className="text-decoration-none text-secondary"
                    onClick={() =>
                      alert("Forgot password feature coming soon!")
                    }
                  >
                    Forgot Password?
                  </Button>
                  <Button
                    variant="link"
                    className="text-decoration-none text-primary"
                    onClick={() => navigate("/")}
                  >
                    ← Back to Home
                  </Button>
                </div>

                {/* Registration Link */}
                <div className="text-center mt-3">
                  <p className="text-muted small mb-0">
                    Don't have an account?{' '}
                    <Button
                      variant="link"
                      className="text-decoration-none text-primary p-0"
                      onClick={() => navigate("/register")}
                    >
                      Sign up here
                    </Button>
                  </p>
                </div>
              </Card.Body>
            </Card>

            {/* Footer Text */}
            <p className="text-center text-light mt-4 small">
              © {new Date().getFullYear()} Case Management System | All Rights
              Reserved
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
}
