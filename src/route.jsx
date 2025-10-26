import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import ForgetPage from "./pages/Auth/ForgetPage";
import SignupPage from "./pages/Auth/SignupPage";
import PublicRoute from "./pages/Auth/PublicRoute";
import Dashboard from "./pages/Dashboard/Dashboard";

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

      <Route path="/dashboard" element={<Dashboard />} />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
