import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Student
import Login from "./pages/Student/Login";
import Register from "./pages/Student/Register";
import StudentDashboard from "./pages/Student/StudentDashboard";
import ForgotPassword from "./pages/Student/ForgotPassword.jsx";
import ResetPassword from "./pages/Student/ResetPassword.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

// Company
import CompanyLogin from "./pages/Company/CompanyLogin";
import CompanyRegister from "./pages/Company/CompanyRegister";
import CompanyDashboard from "./pages/Company/CompanyDashboard";

// Admin
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageStudents from "./pages/Admin/ManageStudents";
import ManageRecruiters from "./pages/Admin/ManageRecruiters";
import VerifyRecruiter from "./pages/Admin/VerifyRecruiter";
import ApproveJobs from "./pages/Admin/ApproveJobs.jsx";
import AdminApplications from "./pages/Admin/AdminApplications";
import PlacementResults from "./pages/Admin/PlacementResults";
import Reports from "./pages/Admin/Reports";

import "./pages/Student/Student.css";


/* ================= ADMIN PRIVATE ROUTE ================= */

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  return token ? children : <Navigate to="/admin/login" />;
};


/* ================= APP ================= */

function App() {
  return (
    <>
      {/* ================= ROUTES ================= */}

      <Routes>

        {/* ---------- HOME ---------- */}

        <Route
          path="/"
          element={<HomePage />}
        />

        {/* ---------- PUBLIC PAGES ---------- */}

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* ---------- STUDENT ---------- */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* ---------- COMPANY ---------- */}

        <Route
          path="/company/login"
          element={<CompanyLogin />}
        />

        <Route
          path="/company/register"
          element={<CompanyRegister />}
        />

        <Route
          path="/company/dashboard"
          element={<CompanyDashboard />}
        />

        {/* ---------- ADMIN ---------- */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/students"
          element={<ManageStudents />}
        />

        <Route
          path="/recruiters"
          element={<ManageRecruiters />}
        />

        <Route
          path="/manage-recruiters"
          element={<ManageRecruiters />}
        />

        <Route
          path="/verify-recruiter/:id"
          element={<VerifyRecruiter />}
        />

        <Route
          path="/admin/approve-jobs"
          element={<ApproveJobs />}
        />

        <Route
          path="/admin/applications"
          element={<AdminApplications />}
        />

        <Route
          path="/admin/results"
          element={<PlacementResults />}
        />

        <Route
          path="/admin/reports"
          element={<Reports />}
        />

        {/* ---------- 404 ---------- */}

        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">

                <h1 className="text-6xl font-bold text-gray-800">
                  404
                </h1>

                <p className="text-gray-500 mt-3">
                  Page Not Found
                </p>

                <a
                  href="/"
                  className="inline-block mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Back to Home
                </a>

              </div>
            </div>
          }
        />

      </Routes>

    </>
  );
}

export default App;