// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Admin = require("../models/Admin");
// const User = require("../models/User");
// const admin = require("../controllers/adminController");
// const Job = require("../models/Job");
// const adminMiddleware = require("../middleware/adminMiddleware");


// // ✅ Admin Login Route
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const admin = await Admin.findOne({ email });

//     if (!admin) {
//       return res.status(400).json({ message: "Admin not found" });
//     }

//     const isMatch = await bcrypt.compare(password, admin.password);

//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: admin._id },
//     //   process.env.JWT_SECRET || "secretkey",
//     process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       token,
//       message: "Login successful",
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // 1️⃣ Get all pending jobs
// router.get("/pending-jobs", adminMiddleware, async (req, res) => {
//   try {
//     const jobs = await Job.find({ approvalStatus: "Pending" })
//       .populate("company", "companyName email location") // ✅ Populate company
//       .sort({ posted: -1 });
//     res.json(jobs);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 2️⃣ Approve a job
// router.post("/approve/:id", adminMiddleware, async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);
//     if (!job) return res.status(404).json({ message: "Job not found" });

//     job.approvalStatus = "Approved";
//     await job.save();
//     res.json({ message: "Job approved", job });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 3️⃣ Reject a job
// router.post("/reject/:id", adminMiddleware, async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);
//     if (!job) return res.status(404).json({ message: "Job not found" });

//     job.approvalStatus = "Rejected";
//     await job.save();
//     res.json({ message: "Job rejected", job });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.get("/test", (req, res) => {
//   res.send("Admin route working");
// });

// router.get("/students", admin.getStudents);
// router.get("/students/:id", admin.getStudentById);
// router.post("/students/approve/:id", admin.approveStudent);
// router.post("/students/reject/:id", admin.rejectStudent);
// router.delete("/students/:id", admin.deleteStudent);

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Admin = require("../models/Admin");
// const User = require("../models/User");
// const admin = require("../controllers/adminController");
// const Job = require("../models/Job");
// const Application = require("../models/Application"); // ✅ ADD THIS
// const adminMiddleware = require("../middleware/adminMiddleware");


// // ✅ Admin Login Route
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const admin = await Admin.findOne({ email });

//     if (!admin) {
//       return res.status(400).json({ message: "Admin not found" });
//     }

//     const isMatch = await bcrypt.compare(password, admin.password);

//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: admin._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       token,
//       message: "Login successful",
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // 1️⃣ Get all pending jobs
// router.get("/pending-jobs", adminMiddleware, async (req, res) => {
//   try {
//     const jobs = await Job.find({ approvalStatus: "Pending" })
//       .populate("company", "companyName email location")
//       .sort({ posted: -1 });
//     res.json(jobs);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 2️⃣ Approve a job
// router.post("/approve/:id", adminMiddleware, async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);
//     if (!job) return res.status(404).json({ message: "Job not found" });

//     job.approvalStatus = "Approved";
//     await job.save();
//     res.json({ message: "Job approved", job });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 3️⃣ Reject a job
// router.post("/reject/:id", adminMiddleware, async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);
//     if (!job) return res.status(404).json({ message: "Job not found" });

//     job.approvalStatus = "Rejected";
//     await job.save();
//     res.json({ message: "Job rejected", job });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ═══════════════════════════════════════════════════════════
// // 🏆 PLACEMENT RESULTS
// // ═══════════════════════════════════════════════════════════
// // Get applications where company marked as "selected"
// router.get("/placement-results", adminMiddleware, async (req, res) => {
//   try {
//     const results = await Application.find({ status: "selected" })
//       .populate("student", "name email university gpa skills profilePic")
//       .populate({
//         path: "job",
//         populate: {
//           path: "company",
//           select: "companyName location"
//         }
//       })
//       .sort({ appliedAt: -1 });

//     res.json({ results });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update final status (Selected or Rejected)
// router.patch("/placement-results/:id", adminMiddleware, async (req, res) => {
//   try {
//     const { finalStatus } = req.body;
//     if (!["Selected", "Rejected"].includes(finalStatus)) {
//       return res.status(400).json({ error: "Invalid final status" });
//     }

//     const updated = await Application.findByIdAndUpdate(
//       req.params.id,
//       { finalStatus },
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ error: "Result not found" });
//     }

//     res.json({ message: `Marked as ${finalStatus}`, data: updated });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Publish all finalized results at once
// router.post("/placement-results/publish", adminMiddleware, async (req, res) => {
//   try {
//     const { results } = req.body;

//     for (const r of results) {
//       await Application.findByIdAndUpdate(r._id, {
//         finalStatus: r.finalStatus,
//         publishedAt: new Date(),
//       });
//     }

//     console.log(`🏆 Published ${results.length} placement results`);

//     res.json({ message: "Results published successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ═══════════════════════════════════════════════════════════
// // EXISTING ROUTES
// // ═════════════════════════════════════════════════════════

// router.get("/test", (req, res) => {
//   res.send("Admin route working");
// });

// router.get("/students", admin.getStudents);
// router.get("/students/:id", admin.getStudentById);
// router.post("/students/approve/:id", admin.approveStudent);
// router.post("/students/reject/:id", admin.rejectStudent);
// router.delete("/students/:id", admin.deleteStudent);

// module.exports = router;
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");
const admin = require("../controllers/adminController");
const Job = require("../models/Job");
const adminMiddleware = require("../middleware/adminMiddleware");

// ✅ Admin Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      message: "Login successful",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 1️⃣ Get all pending jobs
router.get("/pending-jobs", adminMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ approvalStatus: "Pending" })
      .populate("company", "companyName email location")
      .sort({ posted: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2️⃣ Approve a job
router.post("/approve/:id", adminMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    job.approvalStatus = "Approved";
    await job.save();
    res.json({ message: "Job approved", job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3️⃣ Reject a job
router.post("/reject/:id", adminMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    job.approvalStatus = "Rejected";
    await job.save();
    res.json({ message: "Job rejected", job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═════════════════════════════════════════════════════════
// ✅ NO DUPLICATES HERE — placement-results is in its own route file
// ═════════════════════════════════════════════════════════

router.get("/test", (req, res) => {
  res.send("Admin route working");
});

router.get("/students", admin.getStudents);
router.get("/students/:id", admin.getStudentById);
router.post("/students/approve/:id", admin.approveStudent);
router.post("/students/reject/:id", admin.rejectStudent);
router.delete("/students/:id", admin.deleteStudent);

module.exports = router;

