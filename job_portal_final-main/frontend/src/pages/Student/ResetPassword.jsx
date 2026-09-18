import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ResetPassword({ email }) {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email,
          otp,
          newPassword: password,
        }
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-center">
        Enter OTP
      </h2>

      <form onSubmit={handleReset}>
        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full p-3 border rounded mb-3"
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 border rounded mb-3"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-green-600 text-white p-3 rounded">
          Reset Password
        </button>
      </form>

      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </>
  );
}