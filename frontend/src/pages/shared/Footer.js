import React from "react";
import { Container } from "react-bootstrap";

export default function Footer() {
  return (
    <footer
      className="text-light py-4 mt-auto"
      style={{
        background:
          "linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #0d1b2a 100%)",
        borderTop: "3px solid #007bff",
        boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.2)",
        transition: "background 0.3s ease-in-out",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background =
          "linear-gradient(135deg, #112d4e 0%, #1b263b 70%, #112d4e 100%)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background =
          "linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #0d1b2a 100%)")
      }
    >
      <Container className="text-center">
        <small
          className="fw-semibold"
          style={{
            letterSpacing: "0.5px",
            fontSize: "0.95rem",
            display: "block",
            color: "#e0e0e0",
          }}
        >
          © {new Date().getFullYear()}{" "}
          <span style={{ color: "#4da6ff" }}>Case Management System</span> — All
          Rights Reserved
        </small>

        <div className="mt-2">
          <small
            className="text-muted"
            style={{
              fontStyle: "italic",
              fontSize: "0.85rem",
            }}
          >
            "Delivering Justice, Digitally and Fairly"
          </small>
        </div>
      </Container>
    </footer>
  );
}
