const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// ✅ Get ONLY APPROVED jobs (for students)
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({ approvalStatus: "Approved" })
      .populate("company", "companyName")
      .sort({ posted: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;