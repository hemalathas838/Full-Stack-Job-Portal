// const mongoose = require("mongoose");

// const applicationSchema = new mongoose.Schema(
//   {
//     student: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Student",
//       required: true,
//     },
//     job: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Job",
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["applied", "shortlisted", "selected", "rejected"],
//           // enum: ["Applied", "Under Review", "Pending", "Selected", "Rejected"],

//       default: "applied",
//     },
//     appliedAt: {
//       type: Date,
//       default: Date.now,
//     },
//     // Admin notes (optional)
//     adminNotes: {
//       type: String,
//       default: "",
//     },
//     // Track when status was last changed
//     statusHistory: [
//       {
//         status: { type: String, required: true },
//         changedAt: { type: Date, default: Date.now },
//         changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
//         reason: { type: String },
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// // ═══════════════════════════════════════
// // Prevent duplicate applications
// // ═══════════════════════════════════════
// applicationSchema.index({ student: 1, job: 1 }, { unique: true });

// module.exports = mongoose.model("Application", applicationSchema);


const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "selected", "rejected"],
      default: "applied",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    adminNotes: {
      type: String,
      default: "",
    },
    finalStatus: {
      type: String,
      enum: ["pending", "Selected", "Rejected"],
      default: "pending",
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
        reason: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ student: 1, job: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);