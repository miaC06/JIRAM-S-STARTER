import React from "react";
import { Routes, Route } from "react-router-dom";

// New admin components
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminCaseList from "../pages/admin/AdminCaseList";
import AdminCaseDetails from "../pages/admin/AdminCaseDetails";

// Old judge pages (fallback)
import EvidenceReview from "../pages/judge/EvidenceReview";
import Hearings from "../pages/judge/Hearings";
import Rulings from "../pages/judge/Rulings";

export default function JudgeRoutes() {
  return (
    <Routes>
      {/* Dashboard */}
      <Route index element={<AdminDashboard />} />
      <Route path="dashboard" element={<AdminDashboard />} />

      {/* Cases */}
      <Route path="cases" element={<AdminCaseList />} />
      <Route path="cases/:id" element={<AdminCaseDetails />} />

      {/* Evidence */}
      <Route path="evidence" element={<EvidenceReview />} />

      {/* Hearings */}
      <Route path="hearings" element={<Hearings />} />

      {/* Rulings */}
      <Route path="rulings" element={<Rulings />} />
      
      {/* Placeholder routes */}
      <Route path="users" element={<div className="p-6 text-center">Users page coming soon</div>} />
      <Route path="reports" element={<div className="p-6 text-center">Reports page coming soon</div>} />
      <Route path="documents" element={<div className="p-6 text-center">Documents page coming soon</div>} />
      <Route path="settings" element={<div className="p-6 text-center">Settings page coming soon</div>} />
    </Routes>
  );
}
