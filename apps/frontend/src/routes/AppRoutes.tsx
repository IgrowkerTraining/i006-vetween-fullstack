import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import MyAccount from "../pages/MyAccount";
import ProfessionalProfile from "../pages/ProfessionalProfile";
import ClinicProfile from "../pages/ClinicProfile";
import SecurityProfile from "../pages/SecurityProfile";
import DevPlayground from "../pages/DevPlayground";
import Patient from "../pages/Patient";
import ClinicalSummaryList from "../pages/ClinicalSummaryList";
import ClinicalSummaryDetail from "../pages/ClinicalSummaryDetail";
import ResponsibleList from "../pages/ResponsibleList";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mi-cuenta"
        element={
          <ProtectedRoute>
            <MyAccount />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mi-cuenta/perfil-profesional"
        element={
          <ProtectedRoute>
            <ProfessionalProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mi-cuenta/clinica"
        element={
          <ProtectedRoute>
            <ClinicProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mi-cuenta/seguridad"
        element={
          <ProtectedRoute>
            <SecurityProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clinical-summary/detail/:id"
        element={
          <ProtectedRoute>
            <ClinicalSummaryDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clinical-summary"
        element={
          <ProtectedRoute>
            <ClinicalSummaryList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/responsables"
        element={
          <ProtectedRoute>
            <ResponsibleList />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/patient/:id"
        element={
          <ProtectedRoute>
            <Patient />
          </ProtectedRoute>
        }
      />

      {/* Dev route - solo para desarrollo */}
      <Route path="/dev" element={<DevPlayground />} />
    </Routes>
  );
};

export default AppRoutes;