// // const express = require("express");
// // const router = express.Router();
// // const Application = require("../models/Application");

// // // ✅ GET ALL APPLICATIONS WITH FILTERS
// // router.get("/", async (req, res) => {
// //   try {
// //     const { companyId, jobId, studentId, status } = req.query;

// //     let filter = {};

// //     if (companyId) filter.company = companyId;
// //     if (jobId) filter.job = jobId;
// //     if (studentId) filter.student = studentId;
// //     if (status) filter.status = status;

// //     const applications = await Application.find(filter)
// //       .populate("student")
// //       .populate("job")
// //       .populate("company")
// //       .sort({ createdAt: -1 });

// //     res.json(applications);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });   


// const express = require("express");
// const router = express.Router();
// const Application = require("../models/Application");

// // ═════════════════════════════════════════════════════════
// // GET ALL APPLICATIONS (Admin View)
// // ═════════════════════════════════════════════════════════
// router.get("/", async (req, res) => {
//   try {
//     // ✅ FIX: Populate job FIRST, then populate company THROUGH job
//     const applications = await Application.find({})
//       .populate({
//         path: "student",
//         select: "name email university gpa phone skills profilePic"
//       })
//       .populate({
//         path: "job",
//         populate: {
//           path: "company",
//           select: "companyName location"
//         }
//       })
//       .sort({ appliedAt: -1 });

//     console.log(`✅ Fetched ${applications.length} applications`);

//     // ✅ Format data for frontend
//     const formattedApps = applications.map((app) => ({
//       _id: app._id,
//       student: app.student ? {
//         _id: app.student._id,
//         name: app.student.name,
//         email: app.student.email,
//         university: app.student.university,
//         gpa: app.student.gpa,
//         phone: app.student.phone,
//         skills: app.student.skills,
//         profilePic: app.student.profilePic,
//       } : null,
//       job: app.job ? {
//         _id: app.job._id,
//         title: app.job.title,
//         department: app.job.department,
//         location: app.job.location,
//         type: app.job.type,
//         company: app.job.company ? {
//           _id: app.job.company._id,
//           companyName: app.job.company.companyName,
//           location: app.job.company.location,
//         } : null,
//       } : null,
//       status: app.status,
//       appliedAt: app.appliedAt,
//       createdAt: app.createdAt,
//       adminNotes: app.adminNotes,
//     }));

//     // ✅ Return in format frontend expects
//     res.json({
//       applications: formattedApps,
//       total: formattedApps.length,
//     });

//   } catch (err) {
//     console.error("❌ GET APPLICATIONS ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ═════════════════════════════════════════════════════════
// // GET SINGLE APPLICATION
// // ═════════════════════════════════════════════════════════
// router.get("/:id", async (req, res) => {
//   try {
//     const application = await Application.findById(req.params.id)
//       .populate({
//         path: "student",
//         select: "name email university gpa phone skills bio profilePic resume"
//       })
//       .populate({
//         path: "job",
//         populate: {
//           path: "company",
//           select: "companyName location email"
//         }
//       });

//     if (!application) {
//       return res.status(404).json({ error: "Application not found" });
//     }

//     res.json(application);
//   } catch (err) {
//     console.error("GET APPLICATION ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ═════════════════════════════════════════════════════════
// // UPDATE APPLICATION STATUS (Admin)
// // ═════════════════════════════════════════════════════════
// router.patch("/:id/status", async (req, res) => {
//   try {
//     const { status } = req.body;

//     const validStatuses = ["applied", "shortlisted", "selected", "rejected"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ error: "Invalid status. Use: applied, shortlisted, selected, rejected" });
//     }

//     const application = await Application.findById(req.params.id);
//     if (!application) {
//       return res.status(404).json({ error: "Application not found" });
//     }

//     // Add to status history
//     application.statusHistory = application.statusHistory || [];
//     application.statusHistory.push({
//       status: status,
//       changedAt: new Date(),
//       reason: req.body.reason || "",
//     });

//     application.status = status;
//     await application.save();

//     console.log(`✅ Application ${req.params.id} status → ${status}`);

//     res.json({
//       message: "Status updated",
//       data: application,
//     });
//   } catch (err) {
//     console.error("UPDATE STATUS ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ═════════════════════════════════════════════════════════
// // DELETE APPLICATION (Admin)
// // ═════════════════════════════════════════════════════════
// router.delete("/:id", async (req, res) => {
//   try {
//     const deleted = await Application.findByIdAndDelete(req.params.id);
//     if (!deleted) {
//       return res.status(404).json({ error: "Application not found" });
//     }

//     console.log(`🗑️ Application deleted: ${req.params.id}`);
//     res.json({ message: "Application deleted" });
//   } catch (err) {
//     console.error("DELETE ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Application = require("../models/Application");

// ═════════════════════════════════════════════════════════
// GET ALL APPLICATIONS (Admin View)
// ═════════════════════════════════════════════════════════
router.get("/", async (req, res) => {
  try {
    // ✅ Filter out null references before populate
    let applications = await Application.find({})
      .populate({
        path: "student",
        select: "name email university gpa phone skills profilePic",
        options: { match: { $ne: null } }
      })
      .populate({
        path: "job",
        options: { match: { $ne: null } },
        populate: {
          path: "company",
          select: "companyName location"
        }
      })
      .sort({ appliedAt: -1 });

    // ✅ Filter out any that still came back null
    applications = applications.filter(a => a.student && a.job);

    console.log(`✅ Fetched ${applications.length} applications`);

    // Format data for frontend
    const formattedApps = applications.map((app) => ({
      _id: app._id,
      student: app.student ? {
        _id: app.student._id,
        name: app.student.name,
        email: app.student.email,
        university: app.student.university,
        gpa: app.student.gpa,
        phone: app.student.phone,
        skills: app.student.skills,
        profilePic: app.student.profilePic,
      } : null,
      job: app.job ? {
        _id: app.job._id,
        title: app.job.title,
        department: app.job.department,
        location: app.job.location,
        type: app.job.type,
        company: app.job.company ? {
          _id: app.job.company._id,
          companyName: app.job.company.companyName,
          location: app.job.company.location,
        } : null,
      } : null,
      status: app.status,
      appliedAt: app.appliedAt,
      createdAt: app.createdAt,
      adminNotes: app.adminNotes,
    }));

    res.json({
      applications: formattedApps,
      total: formattedApps.length,
    });

  } catch (err) {
    console.error("❌ GET APPLICATIONS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ═════════════════════════════════════════════════════════
// GET SINGLE APPLICATION
// ═════════════════════════════════════════════════════════
router.get("/:id", async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: "student",
        select: "name email university gpa phone skills bio profilePic resume"
      })
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "companyName location email"
        }
      });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(application);
  } catch (err) {
    console.error("GET APPLICATION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ═════════════════════════════════════════════════════════
// UPDATE APPLICATION STATUS (Admin)
// ═════════════════════════════════════════════════════════
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["applied", "shortlisted", "selected", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status. Use: applied, shortlisted, selected, rejected" });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    application.statusHistory = application.statusHistory || [];
    application.statusHistory.push({
      status: status,
      changedAt: new Date(),
      reason: req.body.reason || "",
    });

    application.status = status;
    await application.save();

    console.log(`✅ Application ${req.params.id} status → ${status}`);

    res.json({
      message: "Status updated",
      data: application,
    });
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ═════════════════════════════════════════════════════════
// DELETE APPLICATION (Admin)
// ═════════════════════════════════════════════════════════
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Application.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Application not found" });
    }

    console.log(`🗑️ Application deleted: ${req.params.id}`);
    res.json({ message: "Application deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;