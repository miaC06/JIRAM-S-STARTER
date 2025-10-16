import React from "react";
import { Routes, Route } from "react-router-dom";

// Judge pages
import Dashboard from "../pages/judge/Dashboard";
import MyCases from "../pages/judge/MyCases";
import CaseDetails from "../pages/judge/CaseDetails";
import EvidenceReview from "../pages/judge/EvidenceReview";
import Hearings from "../pages/judge/Hearings";
import Rulings from "../pages/judge/Rulings";

export default function JudgeRoutes() {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="/" element={<Dashboard />} />

      {/* Cases */}
      <Route path="cases" element={<MyCases />} />
      <Route path="cases/:id" element={<CaseDetails />} />

      {/* Evidence */}
      <Route path="evidence" element={<EvidenceReview />} />

      {/* Hearings */}
      <Route path="hearings" element={<Hearings />} />

      {/* Rulings */}
      <Route path="rulings" element={<Rulings />} />
    </Routes>
  );
}
