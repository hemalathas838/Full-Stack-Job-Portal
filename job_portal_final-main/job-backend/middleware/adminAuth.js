const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Login as admin first.",
      });
    }

    const token = header.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Login as admin first.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // You can add role check here if your admin model has a role field
    // if (decoded.role !== "admin") {
    //   return res.status(403).json({ success: false, message: "Access denied. Admin only." });
    // }

    req.admin = decoded;
    next();
  } catch (err) {
    console.error("Admin auth error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};

module.exports = adminAuth;