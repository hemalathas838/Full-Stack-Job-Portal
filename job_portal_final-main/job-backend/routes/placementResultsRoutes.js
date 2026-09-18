// const express = require("express");
// const router = express.Router();
// const adminAuth = require("../middleware/adminAuth");
// const Application = require("../models/Application");

// // ═══════ All routes require admin auth ═══════
// router.use(adminAuth);

// // ═══════════════════════════════════════════════════════════════
// // GET — Fetch placement results (applications company has selected)
// // ═══════════════════════════════════════════════════════════════
// router.get("/", async (req, res) => {
//   try {
//     // Only show applications where the COMPANY already selected the student
//     const results = await Application.find({ status: "selected" })
//       .populate("student", "name email university gpa phone skills resume profilePic")
//       .populate({
//         path: "job",
//         select: "title department location type package",
//         populate: {
//           path: "company",
//           select: "companyName industry",
//         },
//       })
//       .sort({ appliedAt: -1 });

//     // Compute stats from the actual data
//     const stats = {
//       companySelected: results.length,
//       adminSelected: results.filter((r) => r.finalStatus === "Selected").length,
//       adminRejected: results.filter((r) => r.finalStatus === "Rejected").length,
//       pending: results.filter(
//         (r) => r.finalStatus === "pending" || !r.finalStatus
//       ).length,
//     };

//     res.json({ results, stats });
//   } catch (err) {
//     console.error("GET PLACEMENT RESULTS ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ═══════════════════════════════════════════════════════════════
// // PATCH — Admin marks student as Selected or Rejected
// // ═══════════════════════════════════════════════════════════════
// router.patch("/:id", async (req, res) => {
//   try {
//     const { finalStatus } = req.body;

//     // Validate
//     if (!["Selected", "Rejected"].includes(finalStatus)) {
//       return res.status(400).json({ error: "Invalid finalStatus. Use 'Selected' or 'Rejected'." });
//     }

//     // Find application
//     const application = await Application.findById(req.params.id);
//     if (!application) {
//       return res.status(404).json({ error: "Application not found" });
//     }

//     // Only allow if company has already selected
//     if (application.status !== "selected") {
//       return res.status(400).json({
//         error: "Cannot finalize. Company has not selected this student yet.",
//       });
//     }

//     // Update finalStatus
//     application.finalStatus = finalStatus;

//     // Add to status history
//     application.statusHistory = application.statusHistory || [];
//     application.statusHistory.push({
//       status: finalStatus,
//       changedAt: new Date(),
//       changedBy: req.admin ? req.admin._id : null,
//       reason: `Admin finalized as ${finalStatus}`,
//     });

//     await application.save();

//     res.json({
//       message: `Student marked as ${finalStatus}`,
//       data: application,
//     });
//   } catch (err) {
//     console.error("UPDATE FINAL STATUS ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ═══════════════════════════════════════════════════════════════
// // POST — Publish all finalized results
// // ═══════════════════════════════════════════════════════════════
// router.post("/publish", async (req, res) => {
//   try {
//     const { results } = req.body;

//     if (!results || !Array.isArray(results) || results.length === 0) {
//       return res.status(400).json({ error: "No results to publish" });
//     }

//     const ids = results.map((r) => r._id);

//     // Validate all IDs exist
//     const validApplications = await Application.find({
//       _id: { $in: ids },
//       finalStatus: { $in: ["Selected", "Rejected"] },
//     });

//     if (validApplications.length === 0) {
//       return res.status(400).json({ error: "No finalized results found to publish" });
//     }

//     const validIds = validApplications.map((a) => a._id);

//     // Set publishedAt for all finalized applications
//     await Application.updateMany(
//       { _id: { $in: validIds } },
//       {
//         $set: {
//           publishedAt: new Date(),
//         },
//       }
//     );

//     // Also update the main status to reflect final outcome
//     for (const app of validApplications) {
//       const newStatus =
//         app.finalStatus === "Selected" ? "selected" : "rejected";
//       await Application.findByIdAndUpdate(app._id, { status: newStatus });
//     }

//     const selectedCount = validApplications.filter(
//       (a) => a.finalStatus === "Selected"
//     ).length;
//     const rejectedCount = validApplications.filter(
//       (a) => a.finalStatus === "Rejected"
//     ).length;

//     res.json({
//       message: "Results published successfully",
//       data: {
//         published: validApplications.length,
//         selected: selectedCount,
//         rejected: rejectedCount,
//       },
//     });
//   } catch (err) {
//     console.error("PUBLISH RESULTS ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const Application = require("../models/Application");

router.use(adminAuth);

router.get("/", async (req, res) => {
  try {
    const results = await Application.find({ status: "selected" })
      .populate("student", "name email university gpa phone skills resume profilePic")
      .populate({
        path: "job",
        select: "title department location type package",
        populate: {
          path: "company",
          select: "companyName industry",
        },
      })
      .sort({ appliedAt: -1 });

    const stats = {
      companySelected: results.length,
      adminSelected: results.filter((r) => r.finalStatus === "Selected").length,
      adminRejected: results.filter((r) => r.finalStatus === "Rejected").length,
      pending: results.filter(
        (r) => r.finalStatus === "pending" || !r.finalStatus
      ).length,
    };

    res.json({ results, stats });
  } catch (err) {
    console.error("GET PLACEMENT RESULTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { finalStatus } = req.body;

    if (!["Selected", "Rejected"].includes(finalStatus)) {
      return res.status(400).json({ error: "Invalid finalStatus. Use 'Selected' or 'Rejected'." });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (application.status !== "selected") {
      return res.status(400).json({
        error: "Cannot finalize. Company has not selected this student yet.",
      });
    }

    application.finalStatus = finalStatus;

    application.statusHistory = application.statusHistory || [];
    application.statusHistory.push({
      status: finalStatus,
      changedAt: new Date(),
      changedBy: req.admin ? req.admin._id : null,
      reason: `Admin finalized as ${finalStatus}`,
    });

    await application.save();

    res.json({
      message: `Student marked as ${finalStatus}`,
      data: application,
    });
  } catch (err) {
    console.error("UPDATE FINAL STATUS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/publish", async (req, res) => {
  try {
    const { results } = req.body;

    if (!results || !Array.isArray(results) || results.length === 0) {
      return res.status(400).json({ error: "No results to publish" });
    }

    const ids = results.map((r) => r._id);

    const validApplications = await Application.find({
      _id: { $in: ids },
      finalStatus: { $in: ["Selected", "Rejected"] },
    });

    if (validApplications.length === 0) {
      return res.status(400).json({ error: "No finalized results found to publish" });
    }

    const validIds = validApplications.map((a) => a._id);

    await Application.updateMany(
      { _id: { $in: validIds } },
      { $set: { publishedAt: new Date() } }
    );

    for (const app of validApplications) {
      const newStatus =
        app.finalStatus === "Selected" ? "selected" : "rejected";
      await Application.findByIdAndUpdate(app._id, { status: newStatus });
    }

    const selectedCount = validApplications.filter(
      (a) => a.finalStatus === "Selected"
    ).length;
    const rejectedCount = validApplications.filter(
      (a) => a.finalStatus === "Rejected"
    ).length;

    res.json({
      message: "Results published successfully",
      data: {
        published: validApplications.length,
        selected: selectedCount,
        rejected: rejectedCount,
      },
    });
  } catch (err) {
    console.error("PUBLISH RESULTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;