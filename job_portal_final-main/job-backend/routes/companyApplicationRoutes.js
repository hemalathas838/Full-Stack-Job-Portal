const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Job = require("../models/Job");
const companyMiddleware = require("../middleware/companyMiddleware");

// ═══════ GET ALL APPLICATIONS FOR THIS COMPANY'S JOBS ═══════
router.get("/", companyMiddleware, async (req, res) => {
  try {
    // 1. Find all jobs belonging to this company
    const companyJobs = await Job.find({ company: req.company._id });
    const jobIds = companyJobs.map((j) => j._id);

    if (jobIds.length === 0) {
      return res.json([]); // No jobs, no applications
    }

    // 2. Find all applications for these jobs
    const applications = await Application.find({
      job: { $in: jobIds },
    })
      .populate("student", "name email university gpa phone skills resume profilePic")
      .populate("job", "title department location type")
      .sort({ appliedAt: -1 });

    // 3. Format response to match what company dashboard expects
    const formattedApps = applications.map((app) => ({
      _id: app._id,
      name: app.student?.name || "Unknown",
      email: app.student?.email || "N/A",
      university: app.student?.university || "N/A",
      gpa: app.student?.gpa || "N/A",
      phone: app.student?.phone || "N/A",
      skills: app.student?.skills || "N/A",
      resume: app.student?.resume || null,
      profilePic: app.student?.profilePic || null,
      job: app.job?.title || "Unknown Job",
      jobId: app.job?._id,
      jobDepartment: app.job?.department || "N/A",
      jobLocation: app.job?.location || "N/A",
      jobType: app.job?.type || "N/A",
      studentId: app.student?._id,
      status: app.status,
      appliedAt: app.appliedAt,
      createdAt: app.createdAt,
    }));

    res.json(formattedApps);
  } catch (err) {
    console.error("GET COMPANY APPLICATIONS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ═══════ UPDATE APPLICATION STATUS ═══════
router.post("/:id", companyMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    // ✅ Match your schema's enum values
    const validStatuses = ["applied", "shortlisted", "selected", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Find the application
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Verify the job belongs to this company
    const job = await Job.findById(application.job);
    if (!job || job.company.toString() !== req.company._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Add to status history
    application.statusHistory = application.statusHistory || [];
    application.statusHistory.push({
      status: status,
      changedAt: new Date(),
      reason: req.body.reason || "",
    });

    // Update status
    application.status = status;
    await application.save();

    res.json({
      message: "Status updated",
      data: application,
    });
  } catch (err) {
    console.error("UPDATE APPLICATION STATUS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ═══════ GET SINGLE APPLICATION DETAIL ═══════
router.get("/:id", companyMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("student", "name email university gpa phone skills bio profilePic resume")
      .populate("job", "title department location type description");

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Verify ownership
    const job = await Job.findById(application.job);
    if (!job || job.company.toString() !== req.company._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.json(application);
  } catch (err) {
    console.error("GET APPLICATION DETAIL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;