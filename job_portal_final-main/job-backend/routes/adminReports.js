const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Application = require("../models/Application");
const Job = require("../models/Job");
const adminAuth = require("../middleware/adminAuth");

router.get("/reports", adminAuth, async (req, res) => {
  try {
    // 1. All students (users with role student)
    const students = await User.find({ role: "student" })
      .select("name department university passingYear graduationYear createdAt")
      .lean();

    // 2. Only fetch applications where job is a valid ObjectId (skip bad data)
    const placedApplications = await Application.find({
      status: "Selected",
      job: { $type: "objectId" },
      student: { $type: "objectId" },
    })
      .populate({
        path: "student",
        select: "name department university _id",
      })
      .populate({
        path: "job",
        select: "title package company type location",
        populate: {
          path: "company",
          select: "companyName industry _id",
        },
      })
      .lean();

    // 3. All jobs
    const jobs = await Job.find({})
      .select("title package company type status")
      .populate({
        path: "company",
        select: "companyName industry _id",
      })
      .lean();

    res.json({
      students,
      placementResults: placedApplications,
      jobs,
    });
  } catch (err) {
    console.error("Reports error:", err);
    res.status(500).json({ message: "Failed to fetch report data" });
  }
});

module.exports = router;