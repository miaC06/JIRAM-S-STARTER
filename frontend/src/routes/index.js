import React from "react";
import { Routes, Route } from "react-router-dom";

// Shared pages
import Home from "../pages/shared/Home";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";

// Dashboards
import CivilianDashboard from "../pages/civilian/Dashboard";
import ProsecutorDashboard from "../pages/prosecutor/Dashboard";
import JudgeDashboard from "../pages/judge/Dashboard";
import RegistrarDashboard from "../pages/registrar/Dashboard";

// Auth & Layout
import ProtectedRoute from "../auth/ProtectedRoute";
import AppLayout from "../layouts/AppLayout";

// Role-specific route modules (✅ must be default exports in their files)
import CivilianRoutes from "./CivilianRoutes";
import ProsecutorRoutes from "./ProsecutorRoutes";
import JudgeRoutes from "./JudgeRoutes";
import RegistrarRoutes from "./RegistrarRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected role dashboards (outer entry points) */}
      <Route
        path="/civilian"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CivilianDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/prosecutor"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProsecutorDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/judge"
        element={
          <ProtectedRoute>
            <AppLayout>
              <JudgeDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/registrar"
        element={
          <ProtectedRoute>
            <AppLayout>
              <RegistrarDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Role-specific nested routes */}
      <Route
        path="/civilian/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CivilianRoutes />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/prosecutor/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProsecutorRoutes />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/judge/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <JudgeRoutes />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/registrar/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <RegistrarRoutes />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
