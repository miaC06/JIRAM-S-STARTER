// frontend/src/layouts/AppLayout.js
import React from "react";
import AppNavbar from "../pages/shared/Navbar"; // ✅ now points correctly
import { Container } from "react-bootstrap";

export default function AppLayout({ children }) {
  return (
    <>
      <AppNavbar />
      <Container fluid className="mt-4">
        {children}
      </Container>
    </>
  );
}
