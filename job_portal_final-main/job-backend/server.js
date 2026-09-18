const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

// ======================================================
// CONFIG
// ======================================================

const connectDB = require("./config/db");

// ======================================================
// ROUTES
// ======================================================

// General routes
const authRoutes = require("./routes/auth");
const companyRoutes = require("./routes/companyRoutes");
const jobRoutes = require("./routes/jobRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const userRoutes = require("./routes/user");

// Student routes
const studentRoutes = require("./routes/studentRoutes");
const studentJobRoutes = require("./routes/studentJobRoutes");
const studentAppRoutes = require("./routes/studentAppRoutes");

// Company routes
const companyApplicationRoutes = require("./routes/companyApplicationRoutes");

// Admin routes
const adminApplicationRoutes = require("./routes/adminApplicationRoutes");
const adminReportsRoutes = require("./routes/adminReports");
const placementResultsRoutes = require("./routes/placementResultsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
const adminStudentRoutes = require("./routes/adminStudentRoutes");

// Public routes
const publicJobRoutes = require("./routes/publicJobRoutes");

// Notification routes
const notificationRoutes = require("./routes/notification");

// ======================================================
// ENVIRONMENT
// ======================================================

dotenv.config();

// ======================================================
// CREATE APP
// ======================================================

const app = express();

// ======================================================
// DATABASE
// ======================================================

connectDB();

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.json());

// ======================================================
// STATIC UPLOADS
// ======================================================

app.use(
  "/uploads",
  express.static("uploads")
);

app.use(
  "/uploads/resumes",
  express.static("uploads/resumes")
);

app.use(
  "/uploads/profile",
  express.static("uploads/profile")
);

// ======================================================
// BASIC TEST ROUTE
// ======================================================

app.get("/", (req, res) => {
  res.json({
    message: "Job Portal Backend is running",
  });
});

// ======================================================
// AUTH ROUTES
// ======================================================

app.use(
  "/api/auth",
  authRoutes
);

// ======================================================
// COMPANY + GENERAL ROUTES
// ======================================================

app.use(
  "/api/company",
  companyRoutes
);

app.use(
  "/api/jobs",
  jobRoutes
);

app.use(
  "/api/applications",
  companyApplicationRoutes
);

app.use(
  "/api/interviews",
  interviewRoutes
);

app.use(
  "/api/user",
  userRoutes
);

// ======================================================
// STUDENT ROUTES
// ======================================================
//
// IMPORTANT:
// Specific routes MUST come before:
// app.use("/api/student", studentRoutes)
//
// Otherwise /api/student/jobs can be caught by
// studentRoutes first and may return "No token provided".
//

app.use(
  "/api/student/jobs",
  studentJobRoutes
);

app.use(
  "/api/student/applications",
  studentAppRoutes
);

app.use(
  "/api/student",
  studentRoutes
);

// ======================================================
// ADMIN STUDENT ROUTES
// ======================================================

app.use(
  "/api/admin/students",
  adminStudentRoutes
);

// ======================================================
// ADMIN ROUTES
// ======================================================

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/recruiters",
  recruiterRoutes
);

// ======================================================
// PUBLIC JOB ROUTES
// ======================================================

app.use(
  "/api/jobs",
  publicJobRoutes
);

// ======================================================
// NOTIFICATIONS
// ======================================================

app.use(
  notificationRoutes
);

// ======================================================
// ADMIN APPLICATIONS
// ======================================================

app.use(
  "/api/admin/applications",
  adminApplicationRoutes
);

// ======================================================
// ADMIN REPORTS
// ======================================================

app.use(
  "/api/admin",
  adminReportsRoutes
);

// ======================================================
// PLACEMENT RESULTS
// ======================================================

app.use(
  "/api/admin/placement-results",
  placementResultsRoutes
);

// ======================================================
// 404 ROUTE
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ======================================================
// ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    message: err.message || "Internal server error",
  });
});

// ======================================================
// SERVER START
// ======================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});