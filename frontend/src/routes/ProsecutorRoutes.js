import React from "react";
import { Routes, Route } from "react-router-dom";

// Prosecutor pages
import Dashboard from "../pages/prosecutor/Dashboard";
import MyCases from "../pages/prosecutor/MyCases";
import CaseDetails from "../pages/prosecutor/CaseDetails";
import Evidence from "../pages/prosecutor/Evidence";
import Hearings from "../pages/prosecutor/Hearings";
import Submissions from "../pages/prosecutor/Submissions";

export default function ProsecutorRoutes() {
  return (
    <Routes>
      {/* Main dashboard */}
      <Route path="/" element={<Dashboard />} />

      {/* Case Management */}
      <Route path="cases" element={<MyCases />} />
      <Route path="cases/:id" element={<CaseDetails />} />

      {/* Evidence & Hearings */}
      <Route path="evidence" element={<Evidence />} />
      <Route path="hearings" element={<Hearings />} />

      {/* Submissions */}
      <Route path="submissions" element={<Submissions />} />
    </Routes>
  );
}
