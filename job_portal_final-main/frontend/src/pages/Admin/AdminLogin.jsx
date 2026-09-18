

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
const res = await axios.post("http://127.0.0.1:5000/api/admin/login", formData);
//  await axios.post("http://localhost:5000/api/admin/login", formData);
     
localStorage.setItem("adminToken", res.data.token);

      // ✅ Show success message
      setSuccess("Login Successful!");

      // ✅ Auto hide + redirect
      setTimeout(() => {
        setSuccess("");
        navigate("/admin/dashboard");
      }, 1000);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      {/* ✅ Success Toast */}
      {success && <div className="success-msg">{success}</div>}

      <div className="login-box">
        <h2>🧑‍💼 Placement Officer Login</h2>
        {/* <p>Sign in to continue</p> */}

        {/* ❌ Error Message */}
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <span
              className="toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Button */}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;