const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "recipientModel"
  },
  recipientModel: {
    type: String,
    enum: ["Company", "Student", "Admin"],
    required: true
  },
  type: {
    type: String,
    enum: ["job_approved", "job_rejected", "student_notified", "general"],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  reason: { type: String, default: "" },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  jobTitle: { type: String, default: "" },
  action: { type: String, enum: ["approved", "rejected"], default: "approved" },
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);