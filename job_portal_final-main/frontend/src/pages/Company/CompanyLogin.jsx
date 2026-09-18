// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useState } from "react";

// export default function CompanyLogin() {
//   const navigate = useNavigate();

//   // ✅ State
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   // ✅ Login Function
//   const handleLogin = async () => {
//     try {
//       const res = await axios.post("http://localhost:5000/api/company/login", {
//         email,
//         password,
//       });

//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("company", JSON.stringify(res.data.company));

//       alert("Login Success ✅");

//       // ✅ Redirect after login
//       navigate("/company/dashboard");
//     } catch (err) {
//       alert(err.response?.data?.msg || "Login Failed ❌");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-blue-100">
//       <div className="bg-white p-6 rounded-2xl shadow-xl w-[350px]">
//         <h2 className="text-2xl font-bold text-center mb-4">Company Login</h2>

//         {/* ✅ Email Input */}
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full mb-3 p-2 border rounded"
//         />

//         {/* ✅ Password Input */}
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full mb-3 p-2 border rounded"
//         />

//         {/* ✅ Call API */}
//         <button
//           onClick={handleLogin}
//           className="w-full bg-blue-600 text-white p-2 rounded"
//         >
//           Login
//         </button>

//         <p className="text-center mt-3 text-sm">
//           Don't have an account?
//           <span
//             onClick={() => navigate("/company/register")}
//             className="text-blue-600 cursor-pointer ml-1"
//           >
//             Register
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function CompanyLogin() {
  const navigate = useNavigate();

  // ✅ State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Login Function
  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/company/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("company", JSON.stringify(res.data.company));

      alert("Login Success ✅");

      // ✅ Redirect after login
      navigate("/company/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Login Failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blur-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blur-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-indigo-300 rounded-full mix-blur-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Login Card Container */}
      <div className="relative z-10 w-full max-w-md px-6 py-8 bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl mx-4">
        
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 transform rotate-3 hover:rotate-0 transition-transform">
            <span className="text-3xl font-bold text-white">C</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Company Portal
          </h2>
          <p className="text-sm text-gray-500 mt-1">Login to manage your jobs</p>
        </div>

        <div className="space-y-5">
          {/* ✅ Email Input */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-gray-700"
            />
          </div>

          {/* ✅ Password Input */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-gray-700"
            />
          </div>

          {/* ✅ Call API */}
          <button
            onClick={handleLogin}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Login Securely
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/company/register")}
              className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer hover:underline transition-colors"
            >
              Register here
            </span>
          </p>
        </div>
      </div>

      {/* Simple CSS for Animation */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}