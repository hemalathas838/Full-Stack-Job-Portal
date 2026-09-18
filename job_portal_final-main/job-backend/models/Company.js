const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  companyName: String,
  email: { type: String, unique: true },
  location: String,
  password: String,
    status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  }
}, { timestamps: true });

// ✅ Fix: use the correct variable name
module.exports = mongoose.models.Company || mongoose.model("Company", companySchema);