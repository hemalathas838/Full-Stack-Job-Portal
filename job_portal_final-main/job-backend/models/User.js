const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  university: String,
  gpa: String,
  resume: String,

  // ✅ ADD THESE ONLY
  phone: String,
  skills: String,
  bio: String,
  profilePic: String,

  // ✅ ADD THESE 3 FIELDS (everything else stays exactly as-is)
  role: { type: String, default: "student" },
  approvalStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Notified"],
    default: "Pending",
  },
  adminNotes: String,
  adminActionDate: { type: Date }, //add me

  // 🔐 ✅ ADD THESE FOR OTP RESET (NEW)
  otp: String,
  otpExpire: Date,
});


// Fix OverwriteModelError
module.exports =
  mongoose.models.Student ||
  mongoose.model("Student", studentSchema);