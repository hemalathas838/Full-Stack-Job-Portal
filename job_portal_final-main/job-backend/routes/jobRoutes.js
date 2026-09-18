const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Job = require("../models/Job");
const authMiddleware = require("../middleware/authMiddleware");

// Get all jobs FOR THIS COMPANY
router.get("/", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.company._id }).sort({ posted: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all approved jobs (for students & public)
router.get("/all", async (req, res) => {
  try {
    const jobs = await Job.find({ 
      approvalStatus: "Approved",
      status: "Open"
    })
      .populate("company", "companyName location")
      .sort({ posted: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new job
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newJob = new Job({
      ...req.body,
      company: req.company._id,
      approvalStatus: "Pending"
    });
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Toggle Job Status (Open/Closed)
router.post("/:id/toggle", authMiddleware, async (req, res) => {
  try {
    const jobId = req.params.id;
    const companyObjectId = new mongoose.Types.ObjectId(req.company._id);
    
    let job = await Job.findOne({ 
      _id: jobId, 
      company: companyObjectId 
    });
    
    if (!job) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }
    
    if (job.approvalStatus !== "Approved") {
      return res.status(400).json({ 
        message: "Cannot toggle. Job must be approved first." 
      });
    }
    
    job.status = job.status === "Open" ? "Closed" : "Open";
    await job.save();
    
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;