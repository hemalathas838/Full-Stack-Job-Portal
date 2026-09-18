const express = require("express");
const router = express.Router();

const Application = require("../models/Application");
const Job = require("../models/Job");
const userMiddleware = require("../middleware/userMiddleware");

// ======================================================
// APPLY FOR A JOB
// POST /api/student/applications
// ======================================================

router.post("/", userMiddleware, async (req, res) => {
  try {
    console.log("================================");
    console.log("APPLY JOB REQUEST RECEIVED");
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const { jobId } = req.body;

    // Check Job ID
    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
      });
    }

    // Get logged-in student ID
    const studentId = req.user.id || req.user._id;

    if (!studentId) {
      return res.status(401).json({
        message: "Student ID not found in token",
      });
    }

    // Find the job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      student: studentId,
      job: job._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    // Create application
    const application = new Application({
      student: studentId,
      job: job._id,
      status: "applied",
    });

    await application.save();

    // Increase applicant count
    await Job.findByIdAndUpdate(job._id, {
      $inc: { applicants: 1 },
    });

    console.log("APPLICATION CREATED:", application._id);
    console.log("================================");

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });

  } catch (error) {
    console.error("================================");
    console.error("APPLY JOB ERROR:", error);
    console.error("================================");

    res.status(500).json({
      message: "Unable to apply for this job",
      error: error.message,
    });
  }
});


// ======================================================
// GET MY APPLICATIONS
// GET /api/student/applications/my
// ======================================================

router.get("/my", userMiddleware, async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;

    if (!studentId) {
      return res.status(401).json({
        message: "Student ID not found",
      });
    }

    const applications = await Application.find({
      student: studentId,
    })
      .populate({
        path: "job",
        select:
          "title location type department description posted company",
        populate: {
          path: "company",
          select: "companyName name",
        },
      })
      .sort({ appliedAt: -1 });

    const formattedApplications = applications.map((app) => ({
      _id: app._id,

      jobId: app.job?._id,

      job: app.job?.title || "Unknown Job",

      title: app.job?.title || "Unknown Job",

      location: app.job?.location || "N/A",

      type: app.job?.type || "N/A",

      department: app.job?.department || "N/A",

      description: app.job?.description || "",

      companyName:
        app.job?.company?.companyName ||
        app.job?.company?.name ||
        "N/A",

      status: app.status,

      finalStatus: app.finalStatus,

      appliedAt: app.appliedAt,
    }));

    res.status(200).json(formattedApplications);

  } catch (error) {
    console.error("GET MY APPLICATIONS ERROR:", error);

    res.status(500).json({
      message: "Error fetching applications",
      error: error.message,
    });
  }
});


// ======================================================
// EXPORT
// ======================================================

module.exports = router;