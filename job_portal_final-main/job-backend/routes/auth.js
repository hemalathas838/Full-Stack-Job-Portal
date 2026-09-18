const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Company = require("../models/Company");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

require("dotenv").config();


// ===============================
// STUDENT REGISTER
// ===============================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// ===============================
// STUDENT LOGIN
// ===============================
router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    console.log("Login request:", email);

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: email
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    if (!user.password) {
      return res.status(500).json({
        message: "User password is missing in database"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");

      return res.status(500).json({
        message: "JWT_SECRET is missing in .env"
      });
    }

    const token = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    console.log("Login successful:", email);

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// ===============================
// COMPANY LOGIN
// ===============================
router.post("/company/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const company = await Company.findOne({ email });

    if (!company) {
      return res.status(404).json({
        message: "Company not found"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      company.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: company._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.json({
      token: token,
      company: {
        name: company.name,
        email: company.email
      }
    });

  } catch (error) {

    console.error("COMPANY LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// ===============================
// SEND OTP
// ===============================
router.post("/send-otp", async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        message: "Email settings are missing in .env"
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP for Password Reset",

      html: `
        <h2>Your OTP: ${otp}</h2>
        <p>Valid for 5 minutes.</p>
      `
    });

    res.json({
      message: "OTP sent successfully"
    });

  } catch (error) {

    console.error("OTP ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
});


// ===============================
// VERIFY OTP + RESET PASSWORD
// ===============================
router.post("/verify-otp", async (req, res) => {

  try {

    const {
      email,
      otp,
      newPassword
    } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      user.otp !== otp ||
      !user.otpExpire ||
      user.otpExpire < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.json({
      message: "Password reset successful"
    });

  } catch (error) {

    console.error("RESET ERROR:", error);

    res.status(500).json({
      message: "Reset failed",
      error: error.message
    });
  }
});


module.exports = router;