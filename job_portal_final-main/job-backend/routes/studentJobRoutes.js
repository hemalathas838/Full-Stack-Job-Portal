const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

router.get("/", async (req, res) => {
  try {
    console.log("================================");
    console.log("STUDENT JOB ROUTE HIT");

    const jobs = await Job.find()
      .populate("company", "companyName name")
      .sort({ posted: -1 });

    console.log("TOTAL JOBS FOUND:", jobs.length);

    res.status(200).json(jobs);

  } catch (error) {
    console.error("STUDENT JOB ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;