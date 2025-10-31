import React from "react";
import { Routes, Route } from "react-router-dom";

// New admin components
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminCaseList from "../pages/admin/AdminCaseList";
import AdminCaseDetails from "../pages/admin/AdminCaseDetails";

// Old registrar pages (fallback)
import CaseAssignments from "../pages/registrar/CaseAssignments";
import Documents from "../pages/registrar/Documents";
import HearingManagement from "../pages/registrar/HearingManagement";
import Payments from "../pages/registrar/Payments";
import Reports from "../pages/registrar/Reports";
import Schedule from "../pages/registrar/Schedule";
import UserAccounts from "../pages/registrar/UserAccounts";
import UserManagement from "../pages/registrar/UserManagement";
import ReportsGeneration from "../pages/registrar/ReportsGeneration";

export default function RegistrarRoutes() {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="cases" element={<AdminCaseList />} />
      <Route path="cases/:id" element={<AdminCaseDetails />} />
      <Route path="assignments" element={<CaseAssignments />} />
      <Route path="documents" element={<Documents />} />
      <Route path="hearings" element={<HearingManagement />} />
      <Route path="payments" element={<Payments />} />
      <Route path="reports" element={<ReportsGeneration />} />
      <Route path="schedule" element={<Schedule />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="settings" element={<div className="p-6 text-center">Settings page coming soon</div>} />
    </Routes>
  );
}
