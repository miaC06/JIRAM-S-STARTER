import React from "react";
import { Routes, Route } from "react-router-dom";

// Registrar pages
import Dashboard from "../pages/registrar/Dashboard";
import CaseAssignments from "../pages/registrar/CaseAssignments";
import CaseRegistry from "../pages/registrar/CaseRegistry";
import Documents from "../pages/registrar/Documents";
import HearingManagement from "../pages/registrar/HearingManagement";
import Payments from "../pages/registrar/Payments";
import Reports from "../pages/registrar/Reports";
import Schedule from "../pages/registrar/Schedule";
import UserAccounts from "../pages/registrar/UserAccounts";

export default function RegistrarRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="assignments" element={<CaseAssignments />} />
      <Route path="registry" element={<CaseRegistry />} />
      <Route path="documents" element={<Documents />} />
      <Route path="hearings" element={<HearingManagement />} />
      <Route path="payments" element={<Payments />} />
      <Route path="reports" element={<Reports />} />
      <Route path="schedule" element={<Schedule />} />
      <Route path="users" element={<UserAccounts />} />
    </Routes>
  );
}
