import React from "react";
import { Routes, Route } from "react-router-dom";

// Civilian pages - New modern components
import CivilianDashboard from "../pages/civilian/CivilianDashboard";
import CivilianNewCase from "../pages/civilian/CivilianNewCase";
import TestNewCase from "../pages/civilian/TestNewCase";
import CivilianMyCases from "../pages/civilian/CivilianMyCases";
import CivilianCaseStatus from "../pages/civilian/CivilianCaseStatus";

// Old components (fallback)
import CaseDetails from "../pages/civilian/CaseDetails";
import EvidenceUpload from "../pages/civilian/EvidenceUpload";
import Payments from "../pages/civilian/Payments";
import HearingSchedule from "../pages/civilian/HearingSchedule";
import Documents from "../pages/civilian/Documents";

/**
 * CivilianRoutes.jsx
 * ------------------
 * Maps frontend civilian pages to correct backend endpoints.
 * Each page component should call the appropriate FastAPI endpoint(s)
 * listed in the comments below.
 */

export default function CivilianRoutes() {
  return (
    <Routes>
      {/* 🏠 Default landing page for /civilian */}
      <Route index element={<CivilianDashboard />} />
      <Route path="dashboard" element={<CivilianDashboard />} />

      {/* ⚖️ CASE MANAGEMENT ROUTES */}
      {/* List user's filed & assigned cases -> GET /cases/mine/{email} */}
      <Route path="my-cases" element={<CivilianMyCases />} />

      {/* File new case -> POST /cases/ */}
      <Route path="new-case" element={<CivilianNewCase />} />

      {/* Check status of all cases with feedback -> GET /cases/{id}/status */}
      <Route path="case-status" element={<CivilianCaseStatus />} />

      {/* Case details (view case + notes + evidence + documents) */}
      <Route path="cases/:id" element={<CaseDetails />} />

      {/* 📂 EVIDENCE UPLOAD */}
      <Route path="evidence" element={<EvidenceUpload />} />

      {/* 💰 PAYMENTS */}
      <Route path="payments" element={<Payments />} />

      {/* 📅 HEARINGS */}
      <Route path="hearings" element={<HearingSchedule />} />

      {/* 🧾 DOCUMENTS */}
      <Route path="documents" element={<Documents />} />
    </Routes>
  );
}
