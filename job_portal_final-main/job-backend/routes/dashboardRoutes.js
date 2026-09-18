// const express = require("express");
// const router = express.Router();

// const User = require("../models/User");
// const Job = require("../models/Job");        // jobs schema
// const Company = require("../models/Company"); // recruiters
// const Application = require("../models/Application");

// router.get("/stats", async (req, res) => {
//   try {
//     const students = await User.countDocuments();
//     const recruiters = await Company.countDocuments();
//     const jobs = await Job.countDocuments();
//     const applications = await Application.countDocuments();
//     // OPTIONAL (if you have Application model)
//     // const applications = await Application.countDocuments();

//     // OPTIONAL (if you store selected students)
//     const selected = await User.countDocuments({ status: "Approved" });

//     res.json({
//       students,
//       recruiters,
//       jobs,
//       applications: 0, // update if you have model
//       selected,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();

const User = require("../models/User"); 
const Job = require("../models/Job");
const Company = require("../models/Company");
const Application = require("../models/Application");

router.get("/stats", async (req, res) => {
  try {
    const students = await User.countDocuments({ role: "student" });
    
    const recruiters = await Company.countDocuments();
    const jobs = await Job.countDocuments();
    
    // Count all applications
    const applications = await Application.countDocuments();
    
    // Count applications where status is 'selected'
    const selected = await Application.countDocuments({ status: "selected" });

    res.json({
      students,
      recruiters,
      jobs,
      applications,
      selected,
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;