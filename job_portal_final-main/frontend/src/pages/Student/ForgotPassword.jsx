import { useState } from "react";
import axios from "axios";
import ResetPassword from "./ResetPassword.jsx";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/send-otp",
        { email }
      );

      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow w-full max-w-md">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Forgot Password
            </h2>

            <form onSubmit={handleSendOtp}>
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full p-3 border rounded mb-4"
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button className="w-full bg-blue-600 text-white p-3 rounded">
                Send OTP
              </button>
            </form>
          </>
        )}

        {step === 2 && <ResetPassword email={email} />}

        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}