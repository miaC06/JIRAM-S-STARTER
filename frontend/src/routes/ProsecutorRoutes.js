import React from "react";
import { Routes, Route } from "react-router-dom";

// New admin components
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminCaseList from "../pages/admin/AdminCaseList";
import AdminCaseDetails from "../pages/admin/AdminCaseDetails";

// Old prosecutor pages (fallback)
import Evidence from "../pages/prosecutor/Evidence";
import Hearings from "../pages/prosecutor/Hearings";
import Submissions from "../pages/prosecutor/Submissions";

export default function ProsecutorRoutes() {
  return (
    <Routes>
      {/* Main dashboard */}
      <Route index element={<AdminDashboard />} />
      <Route path="dashboard" element={<AdminDashboard />} />

      {/* Case Management */}
      <Route path="cases" element={<AdminCaseList />} />
      <Route path="cases/:id" element={<AdminCaseDetails />} />

      {/* Evidence & Hearings */}
      <Route path="evidence" element={<Evidence />} />
      <Route path="hearings" element={<Hearings />} />

      {/* Submissions */}
      <Route path="submissions" element={<Submissions />} />
      
      {/* Placeholder routes */}
      <Route path="users" element={<div className="p-6 text-center">Users page coming soon</div>} />
      <Route path="reports" element={<div className="p-6 text-center">Reports page coming soon</div>} />
      <Route path="documents" element={<div className="p-6 text-center">Documents page coming soon</div>} />
      <Route path="settings" element={<div className="p-6 text-center">Settings page coming soon</div>} />
    </Routes>
  );
}
