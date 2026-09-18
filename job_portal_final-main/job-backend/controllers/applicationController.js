const Application = require("../models/Application");

// ═══════════════════════════════════════════════════════════════
// GET /api/admin/applications
// Fetch all applications with populated student + job + company
// Supports optional query params:
//   ?status=applied
//   ?company=Google
//   ?job=SDE
//   ?student=Priya
//   ?search=priya
//   ?page=1&limit=20
//   ?sort=latest|oldest
// ═══════════════════════════════════════════════════════════════
exports.getAllApplications = async (req, res) => {
  try {
    const {
      status,
      company,
      job: jobTitle,
      student: studentName,
      search,
      page = 1,
      limit = 200,
      sort = "latest",
    } = req.query;

    // ── Build filter pipeline ──
    const match = {};

    if (status) {
      match.status = status;
    }

    // For search/filter on populated fields, we use $lookup or
    // a two-step approach. Here we use a lean approach:
    // first fetch matching IDs from referenced collections, then filter.

    let studentIds = null;
    let jobIds = null;

    // Filter by student name
    if (studentName) {
      const Student = require("../../models/Student");
      const students = await Student.find({
        $or: [
          { name: { $regex: studentName, $options: "i" } },
          { fullName: { $regex: studentName, $options: "i" } },
        ],
      }).select("_id");
      studentIds = students.map((s) => s._id);
      if (studentIds.length === 0) {
        return res.json({ success: true, applications: [], total: 0, page: 1, pages: 0 });
      }
      match.student = { $in: studentIds };
    }

    // Filter by company name
    if (company) {
      const Company = require("../../models/Company");
      const companies = await Company.find({
        companyName: { $regex: company, $options: "i" },
      }).select("_id");
      const companyIds = companies.map((c) => c._id);

      const Job = require("../../models/Job");
      const jobsByCompany = await Job.find({
        $or: [
          { company: { $in: companyIds } },
          { companyName: { $regex: company, $options: "i" } },
        ],
      }).select("_id");
      jobIds = jobsByCompany.map((j) => j._id);

      if (jobIds.length === 0) {
        return res.json({ success: true, applications: [], total: 0, page: 1, pages: 0 });
      }
      match.job = { $in: jobIds };
    }

    // Filter by job title
    if (jobTitle) {
      const Job = require("../../models/Job");
      const jobFilter = { title: { $regex: jobTitle, $options: "i" } };
      if (jobIds) {
        jobFilter._id = { $in: jobIds };
      }
      const matchedJobs = await Job.find(jobFilter).select("_id");
      const matchedJobIds = matchedJobs.map((j) => j._id);

      if (matchedJobIds.length === 0) {
        return res.json({ success: true, applications: [], total: 0, page: 1, pages: 0 });
      }
      match.job = { $in: matchedJobIds };
    }

    // Global search across student name, job title, company name
    if (search) {
      const Student = require("../../models/Student");
      const Job = require("../../models/Job");

      const [matchedStudents, matchedJobs] = await Promise.all([
        Student.find({
          $or: [
            { name: { $regex: search, $options: "i" } },
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }).select("_id"),
        Job.find({
          $or: [
            { title: { $regex: search, $options: "i" } },
            { companyName: { $regex: search, $options: "i" } },
          ],
        }).select("_id company"),
      ]);

      const sIds = matchedStudents.map((s) => s._id);
      const jIds = matchedJobs.map((j) => j._id);

      if (sIds.length === 0 && jIds.length === 0) {
        return res.json({ success: true, applications: [], total: 0, page: 1, pages: 0 });
      }

      // Combine: application must match student OR job
      const orConditions = [];
      if (sIds.length > 0) orConditions.push({ student: { $in: sIds } });
      if (jIds.length > 0) orConditions.push({ job: { $in: jIds } });

      if (orConditions.length > 0) {
        match.$or = orConditions;
      }
    }

    // ── Sort ──
    const sortOption = sort === "oldest" ? { appliedAt: 1 } : { appliedAt: -1 };

    // ── Pagination ──
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Application.countDocuments(match);
    const pages = Math.ceil(total / parseInt(limit));

    // ── Fetch with deep populate ──
    const applications = await Application.find(match)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: "student",
        select: "name fullName email department branch cgpa phone enrollmentNo",
      })
      .populate({
        path: "job",
        select: "title description salary package type employmentType location department deadline lastDate status",
        populate: {
          path: "company",
          select: "companyName email phone industry website",
        },
      })
      .lean();

    // ── Stats (only when no pagination to keep it fast) ──
    let stats = null;
    if (!page || page === "1") {
      const allApps = await Application.find({});
      stats = {
        total: allApps.length,
        applied: allApps.filter((a) => a.status === "applied").length,
        shortlisted: allApps.filter((a) => a.status === "shortlisted").length,
        selected: allApps.filter((a) => a.status === "selected").length,
        rejected: allApps.filter((a) => a.status === "rejected").length,
        uniqueStudents: new Set(allApps.map((a) => a.student?.toString()).filter(Boolean)).size,
        uniqueJobs: new Set(allApps.map((a) => a.job?.toString()).filter(Boolean)).size,
      };
    }

    return res.json({
      success: true,
      applications,
      total,
      page: parseInt(page),
      pages,
      ...(stats ? { stats } : {}),
    });
  } catch (err) {
    console.error("Get all applications error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: err.message,
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// GET /api/admin/applications/:id
// Single application details
// ═══════════════════════════════════════════════════════════════
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: "student",
        select: "name fullName email department branch cgpa phone enrollmentNo",
      })
      .populate({
        path: "job",
        select: "title description salary package type employmentType location department deadline lastDate skills requirements",
        populate: {
          path: "company",
          select: "companyName email phone industry website address",
        },
      })
      .populate("statusHistory.changedBy", "name email")
      .lean();

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.json({ success: true, application });
  } catch (err) {
    console.error("Get application by ID error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch application",
      error: err.message,
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// PATCH /api/admin/applications/:id/status
// Update application status (shortlist / select / reject)
// ═══════════════════════════════════════════════════════════════
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason, notes } = req.body;

    const validStatuses = ["applied", "shortlisted", "selected", "rejected"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const oldStatus = application.status;

    // Push to history
    application.statusHistory.push({
      status,
      changedAt: new Date(),
      changedBy: req.admin?._id || req.admin?.id,
      reason: reason || "",
    });

    application.status = status;
    if (notes) application.adminNotes = notes;

    await application.save();

    // ── Send notification email (non-blocking) ──
    try {
      const Application = require("../../models/Application");
      const populated = await Application.findById(id)
        .populate("student", "name email")
        .populate({
          path: "job",
          populate: { path: "company", select: "companyName" },
        });

      const studentEmail = populated?.student?.email;
      const studentName = populated?.student?.name;
      const jobTitle = populated?.job?.title;
      const companyName = populated?.job?.company?.companyName;

      if (studentEmail) {
        const emailService = require("../emailService");
        await emailService.sendApplicationStatusEmail({
          to: studentEmail,
          studentName,
          jobTitle,
          companyName,
          oldStatus,
          newStatus: status,
          reason: reason || "",
        });
      }
    } catch (emailErr) {
      console.warn("Application status email failed:", emailErr.message);
      // Don't fail the request just because email failed
    }

    return res.json({
      success: true,
      message: `Application status updated to "${status}"`,
      application,
    });
  } catch (err) {
    console.error("Update application status error:", err);

    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update application status",
      error: err.message,
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// DELETE /api/admin/applications/:id
// Delete an application (use with caution)
// ═══════════════════════════════════════════════════════════════
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (err) {
    console.error("Delete application error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete application",
      error: err.message,
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// GET /api/admin/applications/stats/summary
// Quick stats for the dashboard cards
// ═══════════════════════════════════════════════════════════════
exports.getApplicationStats = async (req, res) => {
  try {
    const [total, byStatus] = await Promise.all([
      Application.countDocuments(),
      Application.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const uniqueStudents = await Application.distinct("student");
    const uniqueJobs = await Application.distinct("job");

    // Get unique companies through jobs
    const Job = require("../../models/Job");
    const jobsWithCompany = await Job.find({ _id: { $in: uniqueJobs } })
      .distinct("company")
      .lean();
    const uniqueCompanies = await require("../../models/Company")
      .find({ _id: { $in: jobsWithCompany } })
      .countDocuments();

    const statusMap = {};
    byStatus.forEach((item) => {
      statusMap[item._id] = item.count;
    });

    return res.json({
      success: true,
      stats: {
        total,
        applied: statusMap.applied || 0,
        shortlisted: statusMap.shortlisted || 0,
        selected: statusMap.selected || 0,
        rejected: statusMap.rejected || 0,
        uniqueStudents: uniqueStudents.length,
        uniqueJobs: uniqueJobs.length,
        uniqueCompanies,
      },
    });
  } catch (err) {
    console.error("Get application stats error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch application stats",
      error: err.message,
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// POST /api/admin/applications/bulk-status
// Update multiple application statuses at once
// ═══════════════════════════════════════════════════════════════
exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { applicationIds, status, reason } = req.body;

    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "applicationIds must be a non-empty array",
      });
    }

    const validStatuses = ["applied", "shortlisted", "selected", "rejected"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const result = await Application.updateMany(
      { _id: { $in: applicationIds } },
      {
        $set: { status },
        $push: {
          statusHistory: {
            status,
            changedAt: new Date(),
            changedBy: req.admin?._id || req.admin?.id,
            reason: reason || "",
          },
        },
      }
    );

    return res.json({
      success: true,
      message: `${result.modifiedCount} application(s) updated to "${status}"`,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Bulk update status error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk update statuses",
      error: err.message,
    });
  }
};