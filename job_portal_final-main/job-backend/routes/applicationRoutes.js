const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const {
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats,
  bulkUpdateStatus,
} = require("../controllers/applicationController");

// All routes require admin authentication
router.use(adminAuth);

// ═══════ Routes ═══════
router.get("/", getAllApplications);
router.get("/stats/summary", getApplicationStats);
router.get("/:id", getApplicationById);
router.patch("/:id/status", updateApplicationStatus);
router.post("/bulk-status", bulkUpdateStatus);
router.delete("/:id", deleteApplication);

module.exports = router;