import React from "react";
import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import { useAuth } from "../../auth/AuthContext"; // ✅ correct

import { useNavigate } from "react-router-dom";
import { Bell } from "react-bootstrap-icons";

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goDashboard = () => {
    switch (user?.role) {
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
    }
  };

  return (
    <Navbar expand="lg" className="py-3 shadow-sm bg-white">
      <Container>
        {/* Brand */}
        <Navbar.Brand
          onClick={goDashboard}
          style={{ cursor: "pointer", fontWeight: "bold", fontSize: "1.4rem" }}
        >
          ⚖️ <span style={{ fontWeight: "bold" }}>JIRAMS</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          {/* Left Side */}
          <Nav className="me-auto">
            <Nav.Link onClick={goDashboard} style={{ fontWeight: "bold" }}>
              Dashboard
            </Nav.Link>
            <Nav.Link style={{ fontWeight: "bold" }}>Settings</Nav.Link>
            <Nav.Link style={{ fontWeight: "bold" }}>Help / Support</Nav.Link>
          </Nav>

          {/* Right Side */}
          <Nav>
            {/* Notifications */}
            <Nav.Link className="position-relative">
              <Bell size={20} />
              <Badge
                bg="danger"
                pill
                className="position-absolute top-0 start-100 translate-middle"
              >
                3
              </Badge>
            </Nav.Link>

            {/* User Dropdown */}
            <NavDropdown
              title={
                <span style={{ fontWeight: "bold" }}>
                  {user?.email || "Account"}
                </span>
              }
              align="end"
            >
              <NavDropdown.Item disabled>
                <strong>Role:</strong> {user?.role}
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <strong>Logout</strong>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
