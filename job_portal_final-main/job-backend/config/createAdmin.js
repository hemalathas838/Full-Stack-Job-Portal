const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ email: "admin@gmail.com" });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await Admin.create({
        email: "admin@gmail.com",
        password: hashedPassword,
      });

      console.log("✅ Admin Created");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (err) {
    console.log("❌ Error:", err.message);
  }
};

module.exports = createAdmin;