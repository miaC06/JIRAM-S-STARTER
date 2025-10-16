import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/civilian/Dashboard";
import MyCases from "../pages/civilian/MyCases";
import CaseDetails from "../pages/civilian/CaseDetails";
import CaseStatus from "../pages/civilian/CaseStatus";
import NewCaseForm from "../pages/civilian/NewCaseForm";
import EvidenceUpload from "../pages/civilian/EvidenceUpload";
import Payments from "../pages/civilian/Payments";
import HearingSchedule from "../pages/civilian/HearingSchedule";
import Documents from "../pages/civilian/Documents";

export default function CivilianRoutes() {
  return (
    <Routes>
      {/* Default landing page for /civilian */}
      <Route index element={<Dashboard />} />

      {/* Case-related */}
      <Route path="cases" element={<MyCases />} />
      <Route path="cases/:id" element={<CaseDetails />} />
      <Route path="cases/:id/status" element={<CaseStatus />} />
      <Route path="cases/new" element={<NewCaseForm />} />

      {/* Other features */}
      <Route path="evidence" element={<EvidenceUpload />} />
      <Route path="payments" element={<Payments />} />
      <Route path="hearings" element={<HearingSchedule />} />
      <Route path="documents" element={<Documents />} />
    </Routes>
  );
}
