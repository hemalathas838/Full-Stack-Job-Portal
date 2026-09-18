// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function CompanyRegister() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     companyName: "",
//     email: "",
//     location: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleRegister = async () => {
//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/company/register",
//         form
//       );

//       alert("Registered Successfully ✅");
//       navigate("/company/login");
//     } catch (err) {
//       console.log(err);
//       alert("Registration Failed ❌");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-blue-100">
//       <div className="bg-white p-6 rounded-2xl shadow-xl w-[350px]">
//         <h2 className="text-2xl font-bold text-center mb-4">
//           Company Register
//         </h2>

//         <input
//           name="companyName"
//           placeholder="Company Name"
//           onChange={handleChange}
//           className="w-full mb-3 p-2 border rounded"
//         />

//         <input
//           name="email"
//           placeholder="Email"
//           onChange={handleChange}
//           className="w-full mb-3 p-2 border rounded"
//         />

//         <input
//           name="location"
//           placeholder="Location"
//           onChange={handleChange}
//           className="w-full mb-3 p-2 border rounded"
//         />

//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           onChange={handleChange}
//           className="w-full mb-3 p-2 border rounded"
//         />

//         <button
//           onClick={handleRegister}
//           className="w-full bg-green-600 text-white p-2 rounded"
//         >
//           Register
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CompanyRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "",
    email: "",
    location: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/company/register",
        form
      );

      alert("Registered Successfully ✅");
      navigate("/company/login");
    } catch (err) {
      console.log(err);
      alert("Registration Failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-teal-100 to-cyan-100 relative overflow-hidden">
      
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Register Card Container with Entry Animation */}
      <div className="relative z-10 w-full max-w-md px-8 py-10 bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl mx-4 animate-fade-in-up">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 transform hover:rotate-12 transition-transform">
            <span className="text-3xl">🏢</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 mt-1">Register your company with us</p>
        </div>

        <div className="space-y-4">
          {/* Company Name Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
            <input
              name="companyName"
              placeholder="Company Name"
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-gray-400 text-gray-700"
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <input
              name="email"
              type="email"
              placeholder="Business Email"
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-gray-400 text-gray-700"
            />
          </div>

          {/* Location Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <input
              name="location"
              placeholder="Location (e.g. Delhi, India)"
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-gray-400 text-gray-700"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <input
              name="password"
              type="password"
              placeholder="Create Password"
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-gray-400 text-gray-700"
            />
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            className="w-full py-3.5 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 mt-2"
          >
            Create Account
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/company/login")}
              className="font-semibold text-teal-600 hover:text-teal-700 cursor-pointer hover:underline transition-colors"
            >
              Login here
            </span>
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        /* Background Blob Animation */
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

        /* Card Entry Animation */
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px) scale(0.98); 
          } 
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}