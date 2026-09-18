// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const Application = require("../models/Application");
// const Interview = require("../models/Interview");

// // ==================== ADMIN MIDDLEWARE ====================
// // Replace this with your existing adminMiddleware if you have one
// const adminMiddleware = async (req, res, next) => {
//   try {
//     // Option A: If your User model has role field
//     const user = await User.findById(req.user?.id || req.user?._id);
//     if (!user) return res.status(401).json({ message: "Not authenticated" });
//     if (user.role === "admin") return next();
//     return res.status(403).json({ message: "Admin access required" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ==================== GET ALL STUDENTS ====================
// // GET /api/admin/students?search=&status=&resume=&page=&limit=
// router.get("/", adminMiddleware, async (req, res) => {
//   try {
//     const {
//       search = "",
//       status = "all",
//       resume = "all",
//       page = 1,
//       limit = 10,
//     } = req.query;

//     // Build filter
//     const filter = { role: "student" };

//     // Search by name or email
//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//         { university: { $regex: search, $options: "i" } },
//       ];
//     }

//     // Filter by approval status
//     if (status !== "all") {
//       filter.approvalStatus = status;
//     }

//     // Filter by resume
//     if (resume === "uploaded") {
//       filter.resume = { $ne: null, $ne: "" };
//     } else if (resume === "not-uploaded") {
//       filter.resume = { $in: [null, ""] };
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     // Fetch students
//     const students = await User.find(filter)
//       .select("-password")
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit))
//       .lean();

//     // Fetch application counts for each student
//     const studentsWithStats = await Promise.all(
//       students.map(async (student) => {
//         const appCount = await Application.countDocuments({
//           $or: [
//             { student: student._id },
//             { user: student._id },
//           ],
//         });

//         const interviewCount = await Interview.countDocuments({
//           student: student._id,
//         });

//         // Calculate profile completeness
//         const fields = [
//           student.university,
//           student.gpa,
//           student.phone,
//           student.skills,
//           student.bio,
//           student.resume,
//           student.profilePic,
//         ];
//         const filled = fields.filter((f) => f && f.toString().trim() !== "").length;
//         const completeness = Math.round((filled / fields.length) * 100);

//         return {
//           ...student,
//           applicationCount: appCount,
//           interviewCount,
//           profileCompleteness: completeness,
//           isProfileComplete: completeness === 100,
//         };
//       })
//     );

//     // Stats
//     const totalStudents = await User.countDocuments({ role: "student" });
//     const approvedCount = await User.countDocuments({
//       role: "student",
//       approvalStatus: "Approved",
//     });
//     const pendingCount = await User.countDocuments({
//       role: "student",
//       approvalStatus: "Pending",
//     });
//     const rejectedCount = await User.countDocuments({
//       role: "student",
//       approvalStatus: "Rejected",
//     });
//     const withResume = await User.countDocuments({
//       role: "student",
//       resume: { $ne: null, $ne: "" },
//     });
//     const incompleteProfiles = await User.countDocuments({
//       role: "student",
//       $or: [
//         { university: { $in: [null, ""] } },
//         { gpa: { $in: [null, ""] } },
//         { resume: { $in: [null, ""] } },
//       ],
//     });

//     const totalFiltered = await User.countDocuments(filter);

//     res.json({
//       success: true,
//       data: studentsWithStats,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(totalFiltered / parseInt(limit)),
//         totalStudents: totalFiltered,
//         limit: parseInt(limit),
//       },
//       stats: {
//         totalStudents,
//         approved: approvedCount,
//         pending: pendingCount,
//         rejected: rejectedCount,
//         withResume,
//         incompleteProfiles,
//       },
//     });
//   } catch (err) {
//     console.error("GET ALL STUDENTS ERROR:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // ==================== GET SINGLE STUDENT DETAIL ====================
// router.get("/:id", adminMiddleware, async (req, res) => {
//   try {
//     const student = await User.findById(req.params.id).select("-password").lean();

//     if (!student) {
//       return res.status(404).json({ success: false, error: "Student not found" });
//     }

//     // Get applications
//     const applications = await Application.find({
//       $or: [{ student: student._id }, { user: student._id }],
//     })
//       .populate("jobId", "title location type")
//       .populate("company", "companyName")
//       .sort({ appliedDate: -1 })
//       .lean();

//     // Get interviews
//     const interviews = await Interview.find({ student: student._id })
//       .populate("company", "companyName")
//       .sort({ date: -1 })
//       .lean();

//     // Profile completeness
//     const fields = [
//       student.university,
//       student.gpa,
//       student.phone,
//       student.skills,
//       student.bio,
//       student.resume,
//       student.profilePic,
//     ];
//     const filled = fields.filter((f) => f && f.toString().trim() !== "").length;
//     const completeness = Math.round((filled / fields.length) * 100);

//     // Missing fields list
//     const missingFields = [];
//     if (!student.university || student.university.trim() === "") missingFields.push("University");
//     if (!student.gpa || student.gpa.trim() === "") missingFields.push("GPA");
//     if (!student.phone || student.phone.trim() === "") missingFields.push("Phone");
//     if (!student.skills || student.skills.trim() === "") missingFields.push("Skills");
//     if (!student.bio || student.bio.trim() === "") missingFields.push("Bio");
//     if (!student.resume) missingFields.push("Resume");
//     if (!student.profilePic) missingFields.push("Profile Picture");

//     res.json({
//       success: true,
//       data: {
//         ...student,
//         profileCompleteness: completeness,
//         missingFields,
//         applications,
//         interviews,
//       },
//     });
//   } catch (err) {
//     console.error("GET STUDENT DETAIL ERROR:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // ==================== UPDATE STUDENT ====================
// router.put("/:id", adminMiddleware, async (req, res) => {
//   try {
//     const { name, email, university, gpa, phone, skills, bio, approvalStatus, adminNotes } =
//       req.body;

//     const updates = {};
//     if (name !== undefined) updates.name = name;
//     if (email !== undefined) updates.email = email;
//     if (university !== undefined) updates.university = university;
//     if (gpa !== undefined) updates.gpa = gpa;
//     if (phone !== undefined) updates.phone = phone;
//     if (skills !== undefined) updates.skills = skills;
//     if (bio !== undefined) updates.bio = bio;
//     if (approvalStatus !== undefined) updates.approvalStatus = approvalStatus;
//     if (adminNotes !== undefined) updates.adminNotes = adminNotes;

//     const updated = await User.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true })
//       .select("-password")
//       .lean();

//     if (!updated) {
//       return res.status(404).json({ success: false, error: "Student not found" });
//     }

//     res.json({ success: true, data: updated, message: "Student updated successfully" });
//   } catch (err) {
//     console.error("UPDATE STUDENT ERROR:", err);
//     if (err.code === 11000) {
//       return res.status(400).json({ success: false, error: "Email already exists" });
//     }
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // ==================== DELETE STUDENT ====================
// router.delete("/:id", adminMiddleware, async (req, res) => {
//   try {
//     const student = await User.findById(req.params.id);
//     if (!student) {
//       return res.status(404).json({ success: false, error: "Student not found" });
//     }

//     // Delete associated applications
//     await Application.deleteMany({
//       $or: [{ student: student._id }, { user: student._id }],
//     });

//     // Delete associated interviews
//     await Interview.deleteMany({ student: student._id });

//     // Delete student
//     await User.findByIdAndDelete(req.params.id);

//     res.json({ success: true, message: "Student and associated data deleted successfully" });
//   } catch (err) {
//     console.error("DELETE STUDENT ERROR:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // ==================== APPROVE STUDENT ====================
// router.put("/:id/approve", adminMiddleware, async (req, res) => {
//   try {
//     const updated = await User.findByIdAndUpdate(
//       req.params.id,
//       { approvalStatus: "Approved", adminNotes: "" },
//     //   { new: true }
//     { returnDocument: "after" }
//     ).select("-password");

//     if (!updated) {
//       return res.status(404).json({ success: false, error: "Student not found" });
//     }

//     res.json({ success: true, data: updated, message: "Student approved successfully" });
//   } catch (err) {
//     console.error("APPROVE STUDENT ERROR:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // ==================== REJECT STUDENT ====================
// router.put("/:id/reject", adminMiddleware, async (req, res) => {
//   try {
//     const { reason } = req.body;

//     const updated = await User.findByIdAndUpdate(
//       req.params.id,
//       {
//         approvalStatus: "Rejected",
//         adminNotes: reason || "Profile rejected by admin",
//       },
//     //   { new: true }
//     { returnDocument: "after" }
//     ).select("-password");

//     if (!updated) {
//       return res.status(404).json({ success: false, error: "Student not found" });
//     }

//     res.json({ success: true, data: updated, message: "Student rejected" });
//   } catch (err) {
//     console.error("REJECT STUDENT ERROR:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // ==================== NOTIFY STUDENT (incomplete profile) ====================
// router.put("/:id/notify", adminMiddleware, async (req, res) => {
//   try {
//     const { message } = req.body;

//     const updated = await User.findByIdAndUpdate(
//       req.params.id,
//       {
//         approvalStatus: "Notified",
//         adminNotes: message || "Please complete your profile",
//       },
//     //   { new: true }
//       { returnDocument: "after" }
// ).select("-password");

//     if (!updated) {
//       return res.status(404).json({ success: false, error: "Student not found" });
//     }

//     // TODO: Integrate email/SMS notification here
//     // e.g., await sendEmail(updated.email, "Complete Your Profile", message);

//     res.json({ success: true, data: updated, message: "Student notified successfully" });
//   } catch (err) {
//     console.error("NOTIFY STUDENT ERROR:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Student = require("../models/User"); // Your Student model
const Application = require("../models/Application");
const Interview = require("../models/Interview");

// ==================== ADMIN AUTH MIDDLEWARE ====================
// Uses the SAME auth as your other admin routes
const adminMiddleware = (req, res, next) => {
  // If you have a separate adminAuth middleware, import it instead.
  // For now, we check if a token exists and user is admin.
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, error: "No token provided" });
  }

  try {
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "placementportal",
    );

    // Attach user to request
    req.user = decoded;

    // Allow access (remove role check since your Student model may not have role field)
    // If you have an Admin model with role check, add it here:
    // if (decoded.role !== "admin") return res.status(403).json({ error: "Admin only" });

    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
};

// ==================== GET ALL STUDENTS ====================
router.get("/", adminMiddleware, async (req, res) => {
  try {
    const {
      search = "",
      status = "all",
      resume = "all",
      page = 1,
      limit = 10,
    } = req.query;

    // ✅ FIX: No role filter — all docs in 'students' collection ARE students
    const filter = {};

    // Search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { university: { $regex: search, $options: "i" } },
      ];
    }

    // ✅ FIX: Handle approvalStatus — only filter if documents HAVE this field
    if (status !== "all") {
      filter.approvalStatus = status;
    }

    // Resume filter
    if (resume === "uploaded") {
      filter.resume = { $exists: true, $ne: null, $ne: "" };
    } else if (resume === "not-uploaded") {
      filter.$or = filter.$or
        ? [
            ...filter.$or,
            { resume: { $exists: false } },
            { resume: null },
            { resume: "" },
          ]
        : [{ resume: { $exists: false } }, { resume: null }, { resume: "" }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch students
    const students = await Student.find(filter)
      .select("-password")
      .sort({ _id: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Add stats to each student
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const appCount = await Application.countDocuments({
          $or: [{ student: student._id }, { user: student._id }],
        });

        const interviewCount = await Interview.countDocuments({
          student: student._id,
        });

        // Profile completeness
        const fields = [
          student.university,
          student.gpa,
          student.phone,
          student.skills,
          student.bio,
          student.resume,
          student.profilePic,
        ];
        const filled = fields.filter(
          (f) => f && f.toString().trim() !== "",
        ).length;
        const completeness = Math.round((filled / fields.length) * 100);

        return {
          ...student,
          applicationCount: appCount,
          interviewCount,
          profileCompleteness: completeness,
          isProfileComplete: completeness === 100,
          // ✅ Default status if field doesn't exist
          approvalStatus: student.approvalStatus || "Pending",
        };
      }),
    );

    // Stats
    const totalStudents = await Student.countDocuments();
    const approvedCount = await Student.countDocuments({
      approvalStatus: "Approved",
    });
    const pendingCount = await Student.countDocuments({
      $or: [
        { approvalStatus: "Pending" },
        { approvalStatus: { $exists: false } },
      ],
    });
    const rejectedCount = await Student.countDocuments({
      approvalStatus: "Rejected",
    });
    const withResume = await Student.countDocuments({
      resume: { $exists: true, $ne: null, $ne: "" },
    });
    const incompleteProfiles = await Student.countDocuments({
      $or: [
        { university: { $in: [null, ""] } },
        { gpa: { $in: [null, ""] } },
        { resume: { $in: [null, ""] } },
        { university: { $exists: false } },
        { gpa: { $exists: false } },
        { resume: { $exists: false } },
      ],
    });

    const totalFiltered = await Student.countDocuments(filter);

    res.json({
      success: true,
      data: studentsWithStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalFiltered / parseInt(limit)),
        totalStudents: totalFiltered,
        limit: parseInt(limit),
      },
      stats: {
        totalStudents,
        approved: approvedCount,
        pending: pendingCount,
        rejected: rejectedCount,
        withResume,
        incompleteProfiles,
      },
    });
  } catch (err) {
    console.error("GET ALL STUDENTS ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==================== GET SINGLE STUDENT ====================
router.get("/:id", adminMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .select("-password")
      .lean();

    if (!student) {
      return res
        .status(404)
        .json({ success: false, error: "Student not found" });
    }

    const applications = await Application.find({
      $or: [{ student: student._id }, { user: student._id }],
    })
      .populate("jobId", "title location type")
      .populate("company", "companyName")
      .sort({ appliedDate: -1 })
      .lean();

    const interviews = await Interview.find({ student: student._id })
      .populate("company", "companyName")
      .sort({ date: -1 })
      .lean();

    const fields = [
      student.university,
      student.gpa,
      student.phone,
      student.skills,
      student.bio,
      student.resume,
      student.profilePic,
    ];
    const filled = fields.filter((f) => f && f.toString().trim() !== "").length;
    const completeness = Math.round((filled / fields.length) * 100);

    const missingFields = [];
    if (!student.university || student.university.trim() === "")
      missingFields.push("University");
    if (!student.gpa || student.gpa.trim() === "") missingFields.push("GPA");
    if (!student.phone || student.phone.trim() === "")
      missingFields.push("Phone");
    if (!student.skills || student.skills.trim() === "")
      missingFields.push("Skills");
    if (!student.bio || student.bio.trim() === "") missingFields.push("Bio");
    if (!student.resume) missingFields.push("Resume");
    if (!student.profilePic) missingFields.push("Profile Picture");

    res.json({
      success: true,
      data: {
        ...student,
        approvalStatus: student.approvalStatus || "Pending",
        adminNotes: student.adminNotes || "",
        profileCompleteness: completeness,
        missingFields,
        applications,
        interviews,
      },
    });
  } catch (err) {
    console.error("GET STUDENT ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==================== UPDATE STUDENT ====================
router.put("/:id", adminMiddleware, async (req, res) => {
  try {
    const {
      name,
      email,
      university,
      gpa,
      phone,
      skills,
      bio,
      approvalStatus,
      adminNotes,
    } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (university !== undefined) updates.university = university;
    if (gpa !== undefined) updates.gpa = gpa;
    if (phone !== undefined) updates.phone = phone;
    if (skills !== undefined) updates.skills = skills;
    if (bio !== undefined) updates.bio = bio;
    if (approvalStatus !== undefined) updates.approvalStatus = approvalStatus;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;

    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: updates, adminActionDate: new Date() },   //add me
      { returnDocument: "after" },
    )
      .select("-password")
      .lean();

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, error: "Student not found" });
    }

    res.json({ success: true, data: updated, message: "Student updated" });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ success: false, error: "Email already exists" });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==================== DELETE STUDENT ====================
router.delete("/:id", adminMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, error: "Student not found" });
    }

    await Application.deleteMany({
      $or: [{ student: student._id }, { user: student._id }],
    });
    await Interview.deleteMany({ student: student._id });
    await Student.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Student deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==================== APPROVE ====================
router.put("/:id/approve", adminMiddleware, async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: "Approved",
        adminNotes: "",
        adminActionDate: new Date() //add me
      },
      { returnDocument: "after" },
    )
      .select("-password")
      .lean();

    if (!updated)
      return res.status(404).json({ success: false, error: "Not found" });

    res.json({ success: true, data: updated, message: "Student approved" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==================== REJECT ====================
router.put("/:id/reject", adminMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: "Rejected",
        adminNotes: reason || "Rejected by admin",
        adminActionDate: new Date() //add me
      },
      { returnDocument: "after" },
    )
      .select("-password")
      .lean();

    if (!updated)
      return res.status(404).json({ success: false, error: "Not found" });

    res.json({ success: true, data: updated, message: "Student rejected" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==================== NOTIFY ====================
router.put("/:id/notify", adminMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: "Notified",
        adminNotes: message || "Complete your profile",
          adminActionDate: new Date()  //add me
      },
      { returnDocument: "after" },
    )
      .select("-password")
      .lean();

    if (!updated)
      return res.status(404).json({ success: false, error: "Not found" });

    res.json({ success: true, data: updated, message: "Student notified" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
