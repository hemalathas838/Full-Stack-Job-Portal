// routes/recruiterRoutes.js
const express = require("express");
const router = express.Router();
const Company = require("../models/Company"); // <-- updated schema

// Get all companies (recruiters)
router.get("/", async (req, res) => {
  try {
    const recruiters = await Company.find();
    res.json(recruiters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // Get single company by ID
router.get("/:id", async (req, res) => {
  try {
    const recruiter = await Company.findById(req.params.id);
    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }
    res.json(recruiter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve company
router.put("/approve/:id", async (req, res) => {
  try {
    const updated = await Company.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      // { new: true }
      { returnDocument: "after" }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject company
router.put("/reject/:id", async (req, res) => {
  try {
    const updated = await Company.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      // { new: true }
        { returnDocument: "after" }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// delete fake
router.delete("/:id", async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: "Recruiter deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;    