import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../App.css";
import "./Student.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: email.trim(),
          password: password,
        }
      );

      // Save login token
      localStorage.setItem("token", response.data.token);

      // Save user information
      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      // Go to student dashboard
      navigate("/student/dashboard");
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response) {
        setMessage(
          error.response.data?.message || "Invalid email or password"
        );
      } else if (error.request) {
        setMessage(
          "Cannot connect to server. Please make sure the backend is running."
        );
      } else {
        setMessage("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md">

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-2">
          🎓 Student Login
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Login to your JobPortal account
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Error / Success Message */}
        {message && (
          <p className="mt-4 text-center text-red-600 font-medium">
            {message}
          </p>
        )}

        {/* Register */}
        <p className="mt-5 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-purple-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

        {/* Forgot Password */}
        <p className="mt-3 text-center">
          <Link
            to="/forgot-password"
            className="text-purple-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </p>

        {/* Back Home */}
        <p className="mt-4 text-center">
          <Link
            to="/"
            className="text-gray-500 hover:text-purple-600"
          >
            ← Back to Home
          </Link>
        </p>

      </div>
    </div>
  );
}