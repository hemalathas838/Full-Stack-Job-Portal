// const express = require("express");
// const router = express.Router();
// const Notification = require("../models/Notification");
// const Job = require("../models/Job");
// const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//   try {
//     const header = req.headers.authorization;
//     if (!header || !header.startsWith("Bearer ")) return res.status(401).json({ error: "No token" });
//     const token = header.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "placement_portal_secret_key");
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Invalid token" });
//   }
// };

// // ═══════ ADMIN: Notify company ═══════
// router.post("/api/admin/notify-approval/:jobId", verifyToken, async (req, res) => {
//   try {
//     const { action, reason } = req.body;
//     const job = await Job.findById(req.params.jobId);

//     if (!job) {
//       console.log("❌ Job not found:", req.params.jobId);
//       return res.status(404).json({ error: "Job not found" });
//     }

//     // ✅ CHECK ALL POSSIBLE FIELD NAMES
//     console.log("🔍 Full job object keys:", Object.keys(job._doc || job));
//     console.log("🔍 postedBy:", job.postedBy);
//     console.log("🔍 company:", job.company);
//     console.log("🔍 companyId:", job.companyId);
//     console.log("🔍 userId:", job.userId);

//     const companyId =
//       (job.postedBy?._id ? job.postedBy._id.toString() : null) ||
//       (job.postedBy ? job.postedBy.toString() : null) ||
//       (job.company?._id ? job.company._id.toString() : null) ||
//       (job.company ? job.company.toString() : null) ||
//       (job.companyId?._id ? job.companyId._id.toString() : null) ||
//       (job.companyId ? job.companyId.toString() : null) ||
//       (job.userId?._id ? job.userId._id.toString() : null) ||
//       (job.userId ? job.userId.toString() : null);

//     console.log("✅ Resolved companyId:", companyId);

//     if (!companyId) {
//       console.log("❌ No company ID found in job");
//       return res.status(400).json({ error: "No company linked to this job" });
//     }

//     const notification = new Notification({
//       recipient: companyId,
//       recipientModel: "Company",
//       type: action === "approved" ? "job_approved" : "job_rejected",
//       title: action === "approved" ? "Job Approved ✅" : "Job Rejected ❌",
//       message: action === "approved"
//         ? `Your job "${job.title}" has been approved and is now live.`
//         : `Your job "${job.title}" has been rejected.`,
//       reason: reason || "",
//       job: job._id,
//       jobTitle: job.title,
//       action: action,
//       read: false
//     });

//     await notification.save();
//     console.log("✅ Notification saved with recipient:", companyId);
//     res.json({ success: true, message: "Notification sent" });

//   } catch (err) {
//     console.error("❌ Notify error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ═══════ COMPANY: Get notifications ═══════
// router.get("/api/notifications", verifyToken, async (req, res) => {
//   try {
//     const userId = req.user.id || req.user._id || req.user.userId;
//     console.log("🔍 Fetching notifs for userId:", userId);

//     const notifications = await Notification.find({
//       recipient: userId,
//       recipientModel: "Company"
//     }).sort({ createdAt: -1 });

//     console.log("🔍 Found:", notifications.length, "notifications");
//     res.json(notifications);
//   } catch (err) {
//     console.error("❌ Fetch error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ═══════ COMPANY: Unread count ═══════
// router.get("/api/notifications/unread-count", verifyToken, async (req, res) => {
//   try {
//     const userId = req.user.id || req.user._id || req.user.userId;
//     const count = await Notification.countDocuments({
//       recipient: userId,
//       recipientModel: "Company",
//       read: false
//     });
//     res.json({ count });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ═══════ COMPANY: Mark read ═══════
// router.put("/api/notifications/:id/read", verifyToken, async (req, res) => {
//   try {
//     await Notification.findByIdAndUpdate(req.params.id, { read: true });
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ═══════ COMPANY: Mark all read ═══════
// router.put("/api/notifications/read-all", verifyToken, async (req, res) => {
//   try {
//     const userId = req.user.id || req.user._id || req.user.userId;
//     await Notification.updateMany(
//       { recipient: userId, recipientModel: "Company", read: false },
//       { read: true }
//     );
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ═══════ DEBUG: See all notifications ═══════
// router.get("/api/notifications/debug/all", async (req, res) => {
//   try {
//     const all = await Notification.find().sort({ createdAt: -1 });
//     res.json({
//       total: all.length,
//       items: all.map(n => ({
//         _id: n._id,
//         recipient: n.recipient?.toString(),
//         recipientModel: n.recipientModel,
//         type: n.type,
//         title: n.title,
//         jobTitle: n.jobTitle,
//         action: n.action,
//         read: n.read,
//         createdAt: n.createdAt
//       }))
//     });
//   } catch (err) {
//     res.json({ error: err.message, total: 0, items: [] });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const Job = require("../models/Job");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) return res.status(401).json({ error: "No token" });
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "placement_portal_secret_key");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Helper: Safely convert any value to string ID
function toStr(val) {
  if (!val) return null;
  if (typeof val === "string") return val;
  if (val._id) return val._id.toString();
  if (val.toString) return val.toString();
  return null;
}

// ═══════ ADMIN: Notify company ═══════
router.post("/api/admin/notify-approval/:jobId", verifyToken, async (req, res) => {
  try {
    const { action, reason } = req.body;
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      console.log("❌ Job not found:", req.params.jobId);
      return res.status(404).json({ error: "Job not found" });
    }

    // Print EVERY field in the job to find the company ID
    console.log("════════ JOB DEBUG ═══════");
    console.log("Job title:", job.title);
    for (const key of Object.keys(job._doc || job)) {
      const val = job[key];
      if (val && (val._id || typeof val === "object" || typeof val === "string")) {
        console.log(`  ${key}:`, JSON.stringify(val).substring(0, 200));
      }
    }

    // Try EVERY possible field name
    const companyId = toStr(job.postedBy) || toStr(job.company) || toStr(job.companyId) || toStr(job.userId) || toStr(job.createdBy) || toStr(job.recruiter);

    console.log("✅ Resolved companyId:", companyId);

    if (!companyId) {
      console.log("❌ Could not find any company ID in job");
      return res.status(400).json({ error: "No company linked to this job", debug: Object.keys(job._doc || job) });
    }

    const notification = new Notification({
      recipient: companyId,
      recipientModel: "Company",
      type: action === "approved" ? "job_approved" : "job_rejected",
      title: action === "approved" ? "Job Approved ✅" : "Job Rejected ❌",
      message: action === "approved"
        ? `Your job "${job.title}" has been approved and is now live.`
        : `Your job "${job.title}" has been rejected.`,
      reason: reason || "",
      job: job._id,
      jobTitle: job.title,
      action: action,
      read: false
    });

    await notification.save();
    console.log("✅ Notification saved! recipient:", companyId, "type:", notification.type);
    res.json({ success: true, message: "Notification sent", recipient: companyId });

  } catch (err) {
    console.error("❌ Notify error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ═══════ COMPANY: Get notifications ═══════
router.get("/api/notifications", verifyToken, async (req, res) => {
  try {
    // Try ALL possible JWT field names
    const userId = toStr(req.user.id) || toStr(req.user._id) || toStr(req.user.userId);
    console.log("🔍 Company fetching notifs. JWT fields:", JSON.stringify(req.user), "→ resolved:", userId);

    if (!userId) {
      console.log("❌ No user ID in JWT");
      return res.json([]);
    }

    // Find notifications - use string comparison to avoid ObjectId mismatch
    const allNotifs = await Notification.find({ recipientModel: "Company" }).sort({ createdAt: -1 });
    const notifications = allNotifs.filter(n => toStr(n.recipient) === userId);

    console.log(`🔍 Found ${notifications.length} notifications for company ${userId} (out of ${allNotifs.length} total)`);
    res.json(notifications);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ═══════ COMPANY: Unread count ═══════
router.get("/api/notifications/unread-count", verifyToken, async (req, res) => {
  try {
    const userId = toStr(req.user.id) || toStr(req.user._id) || toStr(req.user.userId);
    console.log("🔍 Unread count for:", userId);

    if (!userId) return res.json({ count: 0 });

    const allUnread = await Notification.find({ recipientModel: "Company", read: false });
    const count = allUnread.filter(n => toStr(n.recipient) === userId).length;

    console.log("🔍 Unread count:", count);
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════ COMPANY: Mark read ═══════
router.put("/api/notifications/:id/read", verifyToken, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════ COMPANY: Mark all read ═══════
router.put("/api/notifications/read-all", verifyToken, async (req, res) => {
  try {
    const userId = toStr(req.user.id) || toStr(req.user._id) || toStr(req.user.userId);
    if (!userId) return res.json({ success: true });

    const allUnread = await Notification.find({ recipientModel: "Company", read: false });
    const idsToUpdate = allUnread.filter(n => toStr(n.recipient) === userId).map(n => n._id);

    await Notification.updateMany({ _id: { $in: idsToUpdate } }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════ DEBUG ENDPOINT ═══════
router.get("/api/notifications/debug/all", async (req, res) => {
  try {
    const all = await Notification.find().sort({ createdAt: -1});
    res.json({
      total: all.length,
      items: all.map(n => ({
        _id: n._id,
        recipient: toStr(n.recipient),
        recipientModel: n.recipientModel,
        type: n.type,
        title: n.title,
        jobTitle: n.jobTitle,
        action: n.action,
        read: n.read,
        createdAt: n.createdAt
      }))
    });
  } catch (err) {
    res.json({ error: err.message, total: 0, items: [] });
  }
});

module.exports = router;