import React from "react";
import { Container } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="bg-light text-center py-3 mt-auto border-top">
      <Container>
        <small className="text-muted">
          © {new Date().getFullYear()} Case Management System. All Rights Reserved.
        </small>
      </Container>
    </footer>
  );
}
