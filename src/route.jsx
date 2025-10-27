import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import ForgetPage from "./pages/Auth/ForgetPage";
import SignupPage from "./pages/Auth/SignupPage";
import PublicRoute from "./pages/Auth/PublicRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./pages/Auth/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import Students from "./pages/Students/Students";
import Attendance from "./pages/Attendance/Attendance";
import Marks from "./pages/Marks/Marks";
import Reports from "./pages/Reports/Repoorts";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forget"
        element={
          <PublicRoute>
            <ForgetPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/marks" element={<Marks />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
