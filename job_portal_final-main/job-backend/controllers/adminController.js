const User = require("../models/User");

// GET all students
exports.getStudents = async (req, res) => {
  const students = await User.find();
  res.json(students);
};

// GET single student
exports.getStudentById = async (req, res) => {
  const student = await User.findById(req.params.id);
  res.json(student);
};

// APPROVE
exports.approveStudent = async (req, res) => {
  const student = await User.findByIdAndUpdate(
    req.params.id,
    { status: "Approved" },
    // { new: true }
      { returnDocument: "after" }
  );
  res.json({ message: "Student Approved", student });
};

// REJECT
exports.rejectStudent = async (req, res) => {
  const student = await User.findByIdAndUpdate(
    req.params.id,
    { status: "Rejected" },
    // { new: true }
     { returnDocument: "after" } 
  );
  res.json({ message: "Student Rejected", student });
};

// DELETE
exports.deleteStudent = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Student Deleted" });
};