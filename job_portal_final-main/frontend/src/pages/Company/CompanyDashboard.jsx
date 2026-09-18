// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import CompanyName from "../Company/CompanyName.jsx";

// const formatDate = (dateString) => {
//   if (!dateString) return "";
//   return new Date(dateString).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// };

// const formatTimeAgo = (dateString) => {
//   if (!dateString) return "";
//   const now = new Date();
//   const date = new Date(dateString);
//   const seconds = Math.floor((now - date) / 1000);
//   if (seconds < 60) return "Just now";
//   const minutes = Math.floor(seconds / 60);
//   if (minutes < 60) return `${minutes}m ago`;
//   const hours = Math.floor(minutes / 60);
//   if (hours < 24) return `${hours}h ago`;
//   const days = Math.floor(hours / 24);
//   if (days < 7) return `${days}d ago`;
//   return formatDate(dateString);
// };

// // ✅ UPDATED STATUS COLORS - lowercase to match schema enum
// const STATUS_COLORS = {
//   applied: "bg-yellow-100 text-yellow-800",
//   shortlisted: "bg-blue-100 text-blue-800",
//   selected: "bg-green-100 text-green-800",
//   rejected: "bg-red-100 text-red-800",
//   Open: "bg-green-100 text-green-800",
//   Closed: "bg-gray-100 text-gray-800",
//   Scheduled: "bg-blue-100 text-blue-800",
//   Completed: "bg-green-100 text-green-800",
//   Cancelled: "bg-red-100 text-red-800",
//   Pending: "bg-yellow-100 text-yellow-800",
//   Approved: "bg-green-100 text-green-800",
//   Rejected: "bg-red-100 text-red-800",
// };

// // ✅ Helper to display pretty status names
// const formatStatus = (status) => {
//   if (!status) return "N/A";
//   const map = {
//     applied: "Applied",
//     shortlisted: "Shortlisted",
//     selected: "Selected",
//     rejected: "Rejected",
//   };
//   return map[status] || status;
// };

// const Badge = ({ status }) => (
//   <span
//     className={`px-2 py-1 rounded-full text-xs font-semibold ${
//       STATUS_COLORS[status] || "bg-gray-100 text-gray-700"
//     }`}
//   >
//     {formatStatus(status)}
//   </span>
// );

// const Modal = ({ title, onClose, children, size = "max-w-lg" }) => (
//   <div
//     className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
//     onClick={onClose}
//   >
//     <div
//       className={`bg-white rounded-2xl shadow-2xl w-full ${size} mx-4 overflow-hidden`}
//       onClick={(e) => e.stopPropagation()}
//     >
//       <div className="flex items-center justify-between px-6 py-4 border-b">
//         <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
//         <button
//           onClick={onClose}
//           className="text-gray-400 hover:text-gray-600 text-xl font-bold"
//         >
//           &#x2715;
//         </button>
//       </div>
//       <div className="px-6 py-5">{children}</div>
//     </div>
//   </div>
// );

// // ══════════════════════════════════════════
// // TOAST
// // ══════════════════════════════════════════
// function Toast({ toast, onClose }) {
//   useEffect(() => {
//     if (toast) {
//       const t = setTimeout(onClose, 3000);
//       return () => clearTimeout(t);
//     }
//   }, [toast, onClose]);
//   if (!toast) return null;
//   const colors = {
//     success: "bg-green-600",
//     error: "bg-red-600",
//     info: "bg-blue-600",
//     warning: "bg-yellow-500 text-gray-900",
//   };
//   const icons = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };
//   return (
//     <div
//       className="fixed top-5 right-5 z-[999]"
//       style={{ animation: "slideIn 0.3s ease-out" }}
//     >
//       <div
//         className={`${
//           colors[toast.type] || colors.success
//         } text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]`}
//       >
//         <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">
//           {icons[toast.type]}
//         </span>
//         <span className="text-sm font-medium flex-1">{toast.message}</span>
//         <button
//           onClick={onClose}
//           className="text-white/70 hover:text-white text-lg leading-none"
//         >
//           &times;
//         </button>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════
// // ANIMATED CHART DRAWING FUNCTIONS
// // ══════════════════════════════════════════

// function drawAnimatedDonut(canvas, data, colors, total, animProgress) {
//   if (!canvas) return;
//   const ctx = canvas.getContext("2d");
//   const dpr = window.devicePixelRatio || 1;
//   const size = 180;
//   canvas.width = size * dpr;
//   canvas.height = size * dpr;
//   canvas.style.width = size + "px";
//   canvas.style.height = size + "px";
//   ctx.scale(dpr, dpr);
//   ctx.clearRect(0, 0, size, size);

//   const cx = size / 2,
//     cy = size / 2;
//   const outerR = 80,
//     innerR = 56,
//     spacing = 0.04;
//   let startAngle = -Math.PI / 2;
//   const maxAngle = Math.PI * 2 * animProgress;

//   let accumulated = 0;
//   data.forEach((val, i) => {
//     const sweep = (val / total) * Math.PI * 2 - spacing;
//     const clampedSweep = Math.max(0, Math.min(sweep, maxAngle - accumulated));
//     if (clampedSweep <= 0) {
//       accumulated += sweep + spacing;
//       return;
//     }

//     ctx.beginPath();
//     ctx.arc(cx, cy, outerR, startAngle, startAngle + clampedSweep);
//     ctx.arc(cx, cy, innerR, startAngle + clampedSweep, startAngle, true);
//     ctx.closePath();
//     ctx.fillStyle = colors[i];
//     ctx.fill();

//     startAngle += clampedSweep + spacing;
//     accumulated += sweep + spacing;
//   });

//   ctx.fillStyle = "#0f172a";
//   ctx.font = "bold 26px system-ui, sans-serif";
//   ctx.textAlign = "center";
//   ctx.textBaseline = "middle";
//   ctx.fillText(Math.round(total * animProgress), cx, cy - 6);
//   ctx.fillStyle = "#94a3b8";
//   ctx.font = "11px system-ui, sans-serif";
//   ctx.fillText("Total", cx, cy + 14);
// }

// function drawAnimatedBar(canvas, labels, values, colors, animProgress) {
//   if (!canvas) return;
//   const ctx = canvas.getContext("2d");
//   const dpr = window.devicePixelRatio || 1;
//   const rect = canvas.parentElement.getBoundingClientRect();
//   const w = rect.width,
//     h = 200;
//   canvas.width = w * dpr;
//   canvas.height = h * dpr;
//   canvas.style.width = w + "px";
//   canvas.style.height = h + "px";
//   ctx.scale(dpr, dpr);
//   ctx.clearRect(0, 0, w, h);

//   const pad = { top: 20, right: 16, bottom: 36, left: 16 };
//   const cw = w - pad.left - pad.right;
//   const ch = h - pad.top - pad.bottom;
//   const maxVal = Math.max(...values, 1);
//   const n = labels.length;
//   const barW = Math.min(48, (cw / n) * 0.55);
//   const gap = (cw - barW * n) / (n + 1);

//   for (let i = 0; i <= 4; i++) {
//     const y = pad.top + (i / 4) * ch;
//     ctx.beginPath();
//     ctx.moveTo(pad.left, y);
//     ctx.lineTo(w - pad.right, y);
//     ctx.strokeStyle = "rgba(0,0,0,0.04)";
//     ctx.lineWidth = 1;
//     ctx.stroke();
//   }

//   labels.forEach((label, i) => {
//     const x = pad.left + gap * (i + 1) + barW * i;
//     const barH = (values[i] / maxVal) * ch * animProgress;
//     const y = pad.top + ch - barH;
//     const radius = Math.min(6, barW / 2);

//     if (barH > radius) {
//       ctx.beginPath();
//       ctx.moveTo(x, y + radius);
//       ctx.arcTo(x, y, x + radius, y, radius);
//       ctx.arcTo(x + barW, y, x + barW, y + radius, radius);
//       ctx.lineTo(x + barW, pad.top + ch);
//       ctx.lineTo(x, pad.top + ch);
//       ctx.closePath();
//     } else if (barH > 0) {
//       ctx.beginPath();
//       ctx.rect(x, y, barW, barH);
//       ctx.closePath();
//     }

//     const grad = ctx.createLinearGradient(x, y, x, pad.top + ch);
//     grad.addColorStop(0, colors[i]);
//     grad.addColorStop(1, colors[i] + "40");
//     ctx.fillStyle = grad;
//     ctx.fill();

//     if (animProgress > 0.5) {
//       const valOpacity = Math.min(1, (animProgress - 0.5) * 4);
//       ctx.globalAlpha = valOpacity;
//       ctx.fillStyle = "#334155";
//       ctx.font = "bold 12px system-ui, sans-serif";
//       ctx.textAlign = "center";
//       ctx.fillText(values[i], x + barW / 2, y - 8);
//       ctx.globalAlpha = 1;
//     }

//     ctx.fillStyle = "#94a3b8";
//     ctx.font = "10px system-ui, sans-serif";
//     ctx.textAlign = "center";
//     ctx.fillText(label, x + barW / 2, pad.top + ch + 18);
//   });
// }

// function drawAnimatedLine(canvas, labels, datasets, animProgress) {
//   if (!canvas) return;
//   const ctx = canvas.getContext("2d");
//   const dpr = window.devicePixelRatio || 1;
//   const rect = canvas.parentElement.getBoundingClientRect();
//   const w = rect.width,
//     h = 200;
//   canvas.width = w * dpr;
//   canvas.height = h * dpr;
//   canvas.style.width = w + "px";
//   canvas.style.height = h + "px";
//   ctx.scale(dpr, dpr);
//   ctx.clearRect(0, 0, w, h);

//   const pad = { top: 16, right: 16, bottom: 32, left: 36 };
//   const cw = w - pad.left - pad.right;
//   const ch = h - pad.top - pad.bottom;
//   const n = labels.length;
//   const allVals = datasets.flatMap((d) => d.values);
//   const maxVal = Math.max(...allVals, 1);

//   for (let i = 0; i <= 4; i++) {
//     const y = pad.top + (i / 4) * ch;
//     ctx.beginPath();
//     ctx.moveTo(pad.left, y);
//     ctx.lineTo(w - pad.right, y);
//     ctx.strokeStyle = "rgba(0,0,0,0.04)";
//     ctx.lineWidth = 1;
//     ctx.stroke();
//     ctx.fillStyle = "#94a3b8";
//     ctx.font = "10px system-ui, sans-serif";
//     ctx.textAlign = "right";
//     ctx.textBaseline = "middle";
//     ctx.fillText(
//       Math.round(maxVal - (i / 4) * maxVal),
//       pad.left - 8,
//       y
//     );
//   }

//   ctx.textAlign = "center";
//   ctx.textBaseline = "top";
//   labels.forEach((label, i) => {
//     const x = pad.left + (i / (n - 1)) * cw;
//     ctx.fillStyle = "#94a3b8";
//     ctx.font = "10px system-ui, sans-serif";
//     ctx.fillText(label, x, pad.top + ch + 10);
//   });

//   datasets.forEach((ds) => {
//     const pts = ds.values.map((v, i) => ({
//       x: pad.left + (i / (n - 1)) * cw,
//       y: pad.top + (1 - v / maxVal) * ch,
//     }));

//     const clipX = pad.left + cw * animProgress;

//     ctx.save();
//     ctx.beginPath();
//     ctx.rect(0, 0, clipX, h);
//     ctx.clip();

//     const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
//     grad.addColorStop(0, ds.color + "18");
//     grad.addColorStop(1, ds.color + "00");
//     ctx.beginPath();
//     ctx.moveTo(pts[0].x, pts[0].y);
//     for (let i = 1; i < pts.length; i++) {
//       const mx = (pts[i - 1].x + pts[i].x) / 2;
//       ctx.bezierCurveTo(mx, pts[i - 1].y, mx, pts[i].y, pts[i].x, pts[i].y);
//     }
//     ctx.lineTo(pts[pts.length - 1].x, pad.top + ch);
//     ctx.lineTo(pts[0].x, pad.top + ch);
//     ctx.closePath();
//     ctx.fillStyle = grad;
//     ctx.fill();

//     ctx.beginPath();
//     ctx.moveTo(pts[0].x, pts[0].y);
//     for (let i = 1; i < pts.length; i++) {
//       const mx = (pts[i - 1].x + pts[i].x) / 2;
//       ctx.bezierCurveTo(mx, pts[i - 1].y, mx, pts[i].y, pts[i].x, pts[i].y);
//     }
//     ctx.strokeStyle = ds.color;
//     ctx.lineWidth = 2.5;
//     ctx.stroke();

//     pts.forEach((p) => {
//       ctx.beginPath();
//       ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
//       ctx.fillStyle = ds.color;
//       ctx.fill();
//       ctx.beginPath();
//       ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
//       ctx.fillStyle = "#fff";
//       ctx.fill();
//     });

//     ctx.restore();
//   });
// }

// // ══════════════════════════════════════════
// // NOTIFICATION ITEM COMPONENT
// // ══════════════════════════════════════════
// function NotificationItem({ notif, onMarkRead, onViewDetail }) {
//   const isApproved = notif.action === "approved";
//   const isRejected = notif.action === "rejected";

//   return (
//     <div
//       onClick={() => {
//         if (!notif.read) onMarkRead(notif._id);
//       }}
//       className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
//         notif.read
//           ? "bg-white border-gray-100 hover:bg-gray-50"
//           : "bg-blue-50/50 border-blue-200 hover:bg-blue-50 shadow-sm"
//       }`}
//     >
//       {!notif.read && (
//         <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-blue-500" />
//       )}

//       <div className="flex items-start gap-3">
//         <div
//           className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
//             isApproved
//               ? "bg-green-100"
//               : isRejected
//               ? "bg-red-100"
//               : "bg-gray-100"
//           }`}
//         >
//           {isApproved ? "✅" : isRejected ? "❌" : "ℹ️"}
//         </div>
//         <div className="flex-1 min-w-0">
//           <h4
//             className={`text-sm font-semibold ${
//               notif.read ? "text-gray-700" : "text-gray-900"
//             }`}
//           >
//             {notif.title}
//           </h4>
//           <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>

//           {notif.jobTitle && (
//             <div className="mt-2 inline-flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-lg">
//               <span className="text-xs">💼</span>
//               <span className="text-xs font-medium text-gray-700">
//                 {notif.jobTitle}
//               </span>
//             </div>
//           )}

//           {isRejected && notif.reason && (
//             <div className="mt-2.5 bg-red-50 border border-red-200 rounded-lg p-3">
//               <p className="text-[10px] font-bold uppercase tracking-wide text-red-600 mb-1">
//                 Rejection Reason:
//               </p>
//               <p className="text-xs text-red-800 leading-relaxed">
//                 &quot;{notif.reason}&quot;
//               </p>
//             </div>
//           )}

//           {isApproved && (
//             <div className="mt-2.5 bg-green-50 border border-green-200 rounded-lg p-3">
//               <p className="text-xs text-green-800 leading-relaxed">
//                 🎉 Your job is now <strong>live</strong> on the placement
//                 portal. Students can view and apply to it.
//               </p>
//             </div>
//           )}

//           <div className="flex items-center gap-3 mt-2.5">
//             <span className="text-[11px] text-gray-400">
//               🕐 {formatTimeAgo(notif.createdAt)}
//             </span>
//             <span className="text-[11px] text-gray-400">
//               📅 {formatDate(notif.createdAt)}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════
// // MAIN COMPONENT
// // ══════════════════════════════════════════
// export default function CompanyDashboard() {
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState("overview");
//   const [jobs, setJobs] = useState([]);
//   const [applications, setApplications] = useState([]);
//   const [interviews, setInterviews] = useState([]);
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [showNotifPanel, setShowNotifPanel] = useState(false);
//   const [selectedNotif, setSelectedNotif] = useState(null);

//   const [showJobModal, setShowJobModal] = useState(false);
//   const [showInterviewModal, setShowInterviewModal] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [filterStatus, setFilterStatus] = useState("All");

//   const [toast, setToast] = useState(null);
//   const showToast = (message, type = "success") =>
//     setToast({ message, type });

//   const [jobForm, setJobForm] = useState({
//     title: "",
//     department: "",
//     location: "",
//     type: "Full-time",
//     description: "",
//   });
//   const [intForm, setIntForm] = useState({
//     candidateName: "",
//     job: "",
//     date: "",
//     time: "",
//     interviewer: "",
//     mode: "Video Call",
//     link: "",
//   });

//   const API_URL = "http://localhost:5000/api";

//   // ─── CHART REFS ───
//   const donutRef = useRef(null);
//   const barRef = useRef(null);
//   const lineRef = useRef(null);
//   const chartsAnimated = useRef(false);

//   const navItems = [
//     { id: "overview", label: "Overview", icon: "🏠" },
//     { id: "jobs", label: "Job Openings", icon: "💼" },
//     { id: "applications", label: "Applications", icon: "📋" },
//     { id: "shortlist", label: "Shortlisted", icon: "⭐" },
//     { id: "interviews", label: "Interviews", icon: "📅" },
//     { id: "notifications", label: "Notifications", icon: "🔔" },
//   ];

//   const getAuthHeaders = () => {
//     const token = localStorage.getItem("token");
//     return {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     };
//   };

//   // ─── FETCH ALL DATA ───
//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/company/login");
//         return;
//       }

//       try {
//         const headers = getAuthHeaders();

//         const [jobsRes, appsRes, intsRes, notifsRes, unreadRes] =
//           await Promise.all([
//             fetch(`${API_URL}/jobs`, { headers }).then((r) => r.json()),
//             fetch(`${API_URL}/applications`, { headers }).then((r) =>
//               r.json()
//             ),
//             fetch(`${API_URL}/interviews`, { headers }).then((r) => r.json()),
//             fetch(`${API_URL}/notifications`, { headers }).then((r) =>
//               r.json()
//             ),
//             fetch(`${API_URL}/notifications/unread-count`, {
//               headers,
//             }).then((r) => r.json()),
//           ]);

//         console.log("🔍 Jobs response:", jobsRes);
//         console.log("🔍 Applications response:", appsRes);
//         console.log("🔍 Interviews response:", intsRes);
//         console.log("🔍 Notifications response:", notifsRes);
//         console.log("🔍 Unread count response:", unreadRes);

//         if (Array.isArray(jobsRes)) setJobs(jobsRes);
//         if (Array.isArray(appsRes)) setApplications(appsRes);
//         if (Array.isArray(intsRes)) setInterviews(intsRes);
//         if (Array.isArray(notifsRes)) setNotifications(notifsRes);
//         if (unreadRes.count !== undefined) setUnreadCount(unreadRes.count);
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//         navigate("/company/login");
//       }
//     };
//     fetchData();
//   }, [navigate]);

//   // ─── AUTO-REFRESH NOTIFICATIONS ───
//   useEffect(() => {
//     const interval = setInterval(async () => {
//       try {
//         const headers = getAuthHeaders();
//         const [notifsRes, unreadRes] = await Promise.all([
//           fetch(`${API_URL}/notifications`, { headers }).then((r) =>
//             r.json()
//           ),
//           fetch(`${API_URL}/notifications/unread-count`, { headers }).then(
//             (r) => r.json()
//           ),
//         ]);
//         if (Array.isArray(notifsRes)) setNotifications(notifsRes);
//         if (unreadRes.count !== undefined) setUnreadCount(unreadRes.count);
//       } catch (e) {
//         /* silent */
//       }
//     }, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   // ─── ANIMATE CHARTS WHEN DATA LOADS ───
//   useEffect(() => {
//     if (applications.length === 0 && jobs.length === 0) return;
//     if (chartsAnimated.current) return;
//     chartsAnimated.current = true;

//     let start = null;
//     const duration = 1200;

//     // ✅ UPDATED: lowercase status values
//     const statusCounts = {
//       applied: applications.filter((a) => a.status === "applied").length,
//       shortlisted: applications.filter((a) => a.status === "shortlisted")
//         .length,
//       selected: applications.filter((a) => a.status === "selected").length,
//       rejected: applications.filter((a) => a.status === "rejected").length,
//     };
//     const donutData = Object.values(statusCounts);
//     const donutColors = ["#eab308", "#3b82f6", "#22c55e", "#ef4444"];
//     const donutTotal = donutData.reduce((a, b) => a + b, 0) || 1;

//     const jobStatusCounts = {
//       Open: jobs.filter((j) => j.status === "Open").length,
//       Closed: jobs.filter((j) => j.status === "Closed").length,
//       Pending: jobs.filter(
//         (j) => j.approvalStatus === "Pending"
//       ).length,
//     };
//     const barLabels = Object.keys(jobStatusCounts);
//     const barValues = Object.values(jobStatusCounts);
//     const barColors = ["#22c55e", "#94a3b8", "#eab308"];

//     const now = new Date();
//     const weekLabels = [];
//     const appliedPerWeek = [];
//     const selectedPerWeek = [];
//     for (let i = 6; i >= 0; i--) {
//       const weekStart = new Date(now);
//       weekStart.setDate(weekStart.getDate() - i * 7);
//       const weekEnd = new Date(weekStart);
//       weekEnd.setDate(weekEnd.getDate() + 7);
//       weekLabels.push(
//         weekStart.toLocaleDateString("en-US", {
//           month: "short",
//           day: "numeric",
//         })
//       );
//       appliedPerWeek.push(
//         applications.filter((a) => {
//           const d = new Date(a.appliedAt || a.createdAt || a.date);
//           return d >= weekStart && d < weekEnd;
//         }).length
//       );
//       selectedPerWeek.push(
//         applications.filter((a) => {
//           const d = new Date(a.appliedAt || a.createdAt || a.date);
//           return d >= weekStart && d < weekEnd && a.status === "selected";
//         }).length
//       );
//     }

//     function animate(timestamp) {
//       if (!start) start = timestamp;
//       const elapsed = timestamp - start;
//       const progress = Math.min(elapsed / duration, 1);
//       const eased = 1 - Math.pow(1 - progress, 3);

//       drawAnimatedDonut(
//         donutRef.current,
//         donutData,
//         donutColors,
//         donutTotal,
//         eased
//       );
//       drawAnimatedBar(
//         barRef.current,
//         barLabels,
//         barValues,
//         barColors,
//         eased
//       );
//       drawAnimatedLine(
//         lineRef.current,
//         weekLabels,
//         [
//           { values: appliedPerWeek, color: "#3b82f6" },
//           { values: selectedPerWeek, color: "#22c55e" },
//         ],
//         eased
//       );

//       if (progress < 1) requestAnimationFrame(animate);
//     }

//     const timer = setTimeout(() => requestAnimationFrame(animate), 150);

//     const onResize = () => {
//       drawAnimatedDonut(
//         donutRef.current,
//         donutData,
//         donutColors,
//         donutTotal,
//         1
//       );
//       drawAnimatedBar(barRef.current, barLabels, barValues, barColors, 1);
//       drawAnimatedLine(
//         lineRef.current,
//         weekLabels,
//         [
//           { values: appliedPerWeek, color: "#3b82f6" },
//           { values: selectedPerWeek, color: "#22c55e" },
//         ],
//         1
//       );
//     };
//     window.addEventListener("resize", onResize);

//     return () => {
//       clearTimeout(timer);
//       window.removeEventListener("resize", onResize);
//       chartsAnimated.current = false;
//     };
//   }, [applications, jobs]);

//   // ─── MARK NOTIFICATION AS READ ───
//   const markAsRead = async (id) => {
//     try {
//       await fetch(`${API_URL}/notifications/${id}/read`, {
//         method: "PUT",
//         headers: getAuthHeaders(),
//       });
//       setNotifications((prev) =>
//         prev.map((n) => (n._id === id ? { ...n, read: true } : n))
//       );
//       setUnreadCount((prev) => Math.max(0, prev - 1));
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   // ─── MARK ALL AS READ ───
//   const markAllAsRead = async () => {
//     try {
//       await fetch(`${API_URL}/notifications/read-all`, {
//         method: "PUT",
//         headers: getAuthHeaders(),
//       });
//       setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//       setUnreadCount(0);
//       showToast("All notifications marked as read", "info");
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   // ✅ UPDATED: lowercase status values
//   const stats = [
//     {
//       label: "Open Positions",
//       value: jobs.filter((j) => j.status === "Open").length,
//       icon: "💼",
//       color: "bg-blue-50 border-blue-200",
//     },
//     {
//       label: "Total Applications",
//       value: applications.length,
//       icon: "📋",
//       color: "bg-purple-50 border-purple-200",
//     },
//     {
//       label: "Shortlisted",
//       value: applications.filter((a) => a.status === "shortlisted").length,
//       icon: "⭐",
//       color: "bg-yellow-50 border-yellow-200",
//     },
//     {
//       label: "Selected",
//       value: applications.filter((a) => a.status === "selected").length,
//       icon: "✅",
//       color: "bg-green-50 border-green-200",
//     },
//   ];

//   // ─── ACTIONS ───
//   async function postJob() {
//     if (!jobForm.title || !jobForm.department) {
//       showToast("Please fill in Job Title and Department", "warning");
//       return;
//     }
//     try {
//       const res = await fetch(`${API_URL}/jobs`, {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify(jobForm),
//       });
//       const newJob = await res.json();
//       if (newJob._id) {
//         setJobs((prev) => [...prev, newJob]);
//         showToast(
//           `"${jobForm.title}" posted! Pending admin review.`,
//           "success"
//         );
//       } else {
//         showToast(newJob.error || "Failed to post job", "error");
//       }
//       setJobForm({
//         title: "",
//         department: "",
//         location: "",
//         type: "Full-time",
//         description: "",
//       });
//       setShowJobModal(false);
//     } catch (err) {
//       showToast("Network error while posting job", "error");
//     }
//   }

//   // ✅ UPDATED: map display labels to lowercase schema values
//   async function updateStatus(appId, newStatus) {
//     try {
//       // Map button labels to schema values (lowercase)
//       const statusMap = {
//         "Under Review": "applied",
//         Shortlisted: "shortlisted",
//         Selected: "selected",
//         Rejected: "rejected",
//       };

//       const actualStatus = statusMap[newStatus] || newStatus.toLowerCase();

//       const res = await fetch(`${API_URL}/applications/${appId}`, {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify({ status: actualStatus }),
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         showToast(err.error || err.message || "Failed to update", "error");
//         return;
//       }

//       setApplications((prev) =>
//         prev.map((a) =>
//           a._id === appId ? { ...a, status: actualStatus } : a
//         )
//       );

//       if (selectedCandidate?._id === appId)
//         setSelectedCandidate((prev) => ({ ...prev, status: actualStatus }));

//       const msgs = {
//         shortlisted: "⭐ Candidate shortlisted",
//         selected: "✅ Candidate selected!",
//         rejected: "❌ Candidate rejected",
//         applied: "🔄 Reset to Applied",
//       };
//       showToast(
//         msgs[actualStatus] || `Updated to ${formatStatus(actualStatus)}`,
//         actualStatus === "rejected" ? "error" : "success"
//       );
//     } catch (err) {
//       showToast("Network error", "error");
//     }
//   }

//   async function scheduleInterview() {
//     if (!intForm.candidateName || !intForm.date) {
//       showToast("Select candidate and date", "warning");
//       return;
//     }
//     const app = applications.find(
//       (a) => a.name === intForm.candidateName
//     );
//     try {
//       const res = await fetch(`${API_URL}/interviews`, {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify({ ...intForm, applicationId: app?._id }),
//       });
//       const newInt = await res.json();
//       if (newInt._id) {
//         setInterviews((prev) => [...prev, newInt]);
//         if (app)
//           setApplications((prev) =>
//             prev.map((a) =>
//               a._id === app._id
//                 ? { ...a, status: "shortlisted" }
//                 : a
//             )
//           );
//         showToast(
//           `Interview scheduled for ${intForm.candidateName}`,
//           "success"
//         );
//       } else {
//         showToast(newInt.error || "Failed to schedule", "error");
//       }
//       setIntForm({
//         candidateName: "",
//         job: "",
//         date: "",
//         time: "",
//         interviewer: "",
//         mode: "Video Call",
//         link: "",
//       });
//       setShowInterviewModal(false);
//     } catch (err) {
//       showToast("Network error", "error");
//     }
//   }

//   async function toggleJobStatus(id) {
//     try {
//       const res = await fetch(`${API_URL}/jobs/${id}/toggle`, {
//         method: "POST",
//         headers: getAuthHeaders(),
//       });
//       if (!res.ok) {
//         const err = await res.json();
//         showToast(`Error: ${err.message || err.error}`, "error");
//         return;
//       }
//       const updated = await res.json();
//       if (updated._id) {
//         setJobs((prev) =>
//           prev.map((j) => (j._id === id ? updated : j))
//         );
//         showToast(
//           updated.status === "Open"
//             ? `"${updated.title}" reopened`
//             : `"${updated.title}" closed`,
//           updated.status === "Open" ? "success" : "info"
//         );
//       }
//     } catch (err) {
//       showToast("Network error", "error");
//     }
//   }

//   async function updateInterviewStatus(id, status) {
//     try {
//       await fetch(`${API_URL}/interviews/${id}`, {
//         method: "PATCH",
//         headers: getAuthHeaders(),
//         body: JSON.stringify({ status }),
//       });
//       setInterviews((prev) =>
//         prev.map((x) => (x._id === id ? { ...x, status } : x))
//       );
//       showToast(`Interview marked as ${status}`, "success");
//     } catch (err) {
//       showToast("Failed to update", "error");
//     }
//   }

//   const filteredApps =
//     filterStatus === "All"
//       ? applications
//       : applications.filter((a) => a.status === filterStatus);

//   // ✅ UPDATED: lowercase status values
//   const shortlisted = applications.filter((a) =>
//     ["shortlisted", "selected"].includes(a.status)
//   );

//   const unreadNotifs = notifications.filter((n) => !n.read);

//   const inputCls =
//     "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
//   const labelCls = "block text-xs font-medium text-gray-600 mb-1";
//   const btnPrimary =
//     "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition";
//   const btnSecondary =
//     "bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition";

//   return (
//     <div className="flex h-screen bg-gray-50 font-sans">
//       <Toast toast={toast} onClose={() => setToast(null)} />

//       {/* ═══════ SIDEBAR ═══════ */}
//       <aside
//         className={`${
//           sidebarOpen ? "w-60" : "w-16"
//         } bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shrink-0`}
//       >
//         <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
//           <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
//             C
//           </div>
//           {sidebarOpen && <CompanyName />}
//         </div>
//         <nav className="flex-1 py-4 space-y-1 px-2">
//           {navItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => setActiveTab(item.id)}
//               className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition relative ${
//                 activeTab === item.id
//                   ? "bg-blue-50 text-blue-700 font-semibold"
//                   : "text-gray-600 hover:bg-gray-50"
//               }`}
//             >
//               <span className="text-base shrink-0">{item.icon}</span>
//               {sidebarOpen && <span>{item.label}</span>}
//               {item.id === "notifications" && unreadCount > 0 && (
//                 <span
//                   className={`${
//                     sidebarOpen
//                       ? "ml-auto"
//                       : "absolute -top-1 -right-1"
//                   } min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1`}
//                 >
//                   {unreadCount > 99 ? "99+" : unreadCount}
//                 </span>
//               )}
//             </button>
//           ))}
//         </nav>
//         <button
//           onClick={() => setSidebarOpen((o) => !o)}
//           className="m-4 text-xs text-gray-400 hover:text-gray-600 text-left"
//         >
//           {sidebarOpen ? "◀ Collapse" : "▶"}
//         </button>
//       </aside>

//       {/* ═══════ MAIN ═══════ */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Topbar */}
//         <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
//           <div>
//             <h1 className="text-lg font-semibold text-gray-800">
//               {navItems.find((n) => n.id === activeTab)?.icon}{" "}
//               {navItems.find((n) => n.id === activeTab)?.label}
//             </h1>
//           </div>
//           <div className="flex items-center gap-3">
//             {activeTab === "jobs" && (
//               <button
//                 onClick={() => setShowJobModal(true)}
//                 className={btnPrimary}
//               >
//                 + Post Job
//               </button>
//             )}
//             {activeTab === "interviews" && (
//               <button
//                 onClick={() => setShowInterviewModal(true)}
//                 className={btnPrimary}
//               >
//                 + Schedule Interview
//               </button>
//             )}

//             <button
//               onClick={() => setShowNotifPanel((p) => !p)}
//               className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
//             >
//               <span className="text-lg">🔔</span>
//               {unreadCount > 0 && (
//                 <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
//                   {unreadCount > 99 ? "99+" : unreadCount}
//                 </span>
//               )}
//             </button>

//             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
//               HR
//             </div>
//           </div>
//         </header>

//         {/* ═══════ NOTIFICATION DROPDOWN ═══════ */}
//         {showNotifPanel && (
//           <>
//             <div
//               className="fixed inset-0 z-30"
//               onClick={() => setShowNotifPanel(false)}
//             />
//             <div
//               className="absolute top-[73px] right-6 z-40 w-[420px] max-h-[500px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
//               style={{ animation: "slideIn 0.2s ease-out" }}
//             >
//               <div className="px-4 py-3 border-b flex items-center justify-between shrink-0">
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-semibold text-gray-800">
//                     Notifications
//                   </span>
//                   {unreadCount > 0 && (
//                     <span className="text-[10px] font-bold text-white bg-red-500 rounded-full px-2 py-0.5">
//                       {unreadCount} new
//                     </span>
//                   )}
//                 </div>
//                 {unreadCount > 0 && (
//                   <button
//                     onClick={markAllAsRead}
//                     className="text-xs text-blue-600 hover:text-blue-800 font-medium"
//                   >
//                     Mark all read
//                   </button>
//                 )}
//               </div>
//               <div className="flex-1 overflow-y-auto p-3 space-y-2">
//                 {notifications.length === 0 ? (
//                   <div className="text-center py-10">
//                     <span className="text-3xl">📭</span>
//                     <p className="text-sm text-gray-400 mt-2">
//                       No notifications yet
//                     </p>
//                   </div>
//                 ) : (
//                   notifications.slice(0, 10).map((n) => (
//                     <NotificationItem
//                       key={n._id}
//                       notif={n}
//                       onMarkRead={markAsRead}
//                       onViewDetail={setSelectedNotif}
//                     />
//                   ))
//                 )}
//               </div>
//               {notifications.length > 10 && (
//                 <div className="px-4 py-2.5 border-t text-center">
//                   <button
//                     onClick={() => {
//                       setActiveTab("notifications");
//                       setShowNotifPanel(false);
//                     }}
//                     className="text-xs text-blue-600 hover:text-blue-800 font-medium"
//                   >
//                     View all {notifications.length} notifications →
//                   </button>
//                 </div>
//               )}
//             </div>
//           </>
//         )}

//         {/* ═══════ CONTENT AREA ═══════ */}
//         <main className="flex-1 overflow-y-auto p-6">
//           {/* ─── OVERVIEW ─── */}
//           {activeTab === "overview" && (
//             <div className="space-y-6">
//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//                 {stats.map((s) => (
//                   <div
//                     key={s.label}
//                     className={`border rounded-2xl p-5 ${s.color} flex items-center gap-4`}
//                   >
//                     <div className="text-3xl">{s.icon}</div>
//                     <div>
//                       <div className="text-2xl font-bold text-gray-800">
//                         {s.value}
//                       </div>
//                       <div className="text-xs text-gray-500">{s.label}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* ─── GRAPHS ─── */}
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Donut — Application Status */}
//                 <div className="bg-white border border-gray-200 rounded-2xl p-5">
//                   <h2 className="font-semibold text-gray-800 mb-1">
//                     Application Status
//                   </h2>
//                   <p className="text-xs text-gray-400 mb-4">
//                     Distribution by current status
//                   </p>
//                   <div className="flex items-center justify-center">
//                     <canvas ref={donutRef} />
//                   </div>
//                   {/* ✅ UPDATED: lowercase status legend */}
//                   <div className="mt-4 space-y-2">
//                     {[
//                       {
//                         label: "Applied",
//                         color: "#eab308",
//                         count: applications.filter(
//                           (a) => a.status === "applied"
//                         ).length,
//                       },
//                       {
//                         label: "Shortlisted",
//                         color: "#3b82f6",
//                         count: applications.filter(
//                           (a) => a.status === "shortlisted"
//                         ).length,
//                       },
//                       {
//                         label: "Selected",
//                         color: "#22c55e",
//                         count: applications.filter(
//                           (a) => a.status === "selected"
//                         ).length,
//                       },
//                       {
//                         label: "Rejected",
//                         color: "#ef4444",
//                         count: applications.filter(
//                           (a) => a.status === "rejected"
//                         ).length,
//                       },
//                     ].map((item) => (
//                       <div
//                         key={item.label}
//                         className="flex items-center justify-between text-xs"
//                       >
//                         <div className="flex items-center gap-2">
//                           <span
//                             className="w-2.5 h-2.5 rounded-full shrink-0"
//                             style={{ background: item.color }}
//                           />
//                           <span className="text-gray-600">{item.label}</span>
//                         </div>
//                         <span className="font-bold text-gray-800">
//                           {item.count}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Bar — Job Status */}
//                 <div className="bg-white border border-gray-200 rounded-2xl p-5">
//                   <h2 className="font-semibold text-gray-800 mb-1">
//                     Job Postings
//                   </h2>
//                   <p className="text-xs text-gray-400 mb-4">
//                     Open vs Closed vs Pending review
//                   </p>
//                   <div>
//                     <canvas ref={barRef} />
//                   </div>
//                   <div className="mt-4 flex justify-center gap-5">
//                     <div className="flex items-center gap-1.5 text-xs">
//                       <span
//                         className="w-2.5 h-2.5 rounded-full"
//                         style={{ background: "#22c55e" }}
//                       />
//                       <span className="text-gray-600">Open</span>
//                     </div>
//                     <div className="flex items-center gap-1.5 text-xs">
//                       <span
//                         className="w-2.5 h-2.5 rounded-full"
//                         style={{ background: "#94a3b8" }}
//                       />
//                       <span className="text-gray-600">Closed</span>
//                     </div>
//                     <div className="flex items-center gap-1.5 text-xs">
//                       <span
//                         className="w-2.5 h-2.5 rounded-full"
//                         style={{ background: "#eab308" }}
//                       />
//                       <span className="text-gray-600">Pending</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Line — Weekly Trend */}
//                 <div className="bg-white border border-gray-200 rounded-2xl p-5">
//                   <h2 className="font-semibold text-gray-800 mb-1">
//                     Weekly Trend
//                   </h2>
//                   <p className="text-xs text-gray-400 mb-4">
//                     Applications vs Selections (last 7 weeks)
//                   </p>
//                   <div>
//                     <canvas ref={lineRef} />
//                   </div>
//                   <div className="mt-4 flex justify-center gap-5">
//                     <div className="flex items-center gap-1.5 text-xs">
//                       <span
//                         className="w-5 h-0.5 rounded"
//                         style={{ background: "#3b82f6" }}
//                       />
//                       <span className="text-gray-600">Applied</span>
//                     </div>
//                     <div className="flex items-center gap-1.5 text-xs">
//                       <span
//                         className="w-5 h-0.5 rounded"
//                         style={{ background: "#22c55e" }}
//                       />
//                       <span className="text-gray-600">Selected</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Recent Notifications on Overview */}
//               {unreadNotifs.length > 0 && (
//                 <div className="bg-white border border-gray-200 rounded-2xl p-5">
//                   <div className="flex items-center justify-between mb-4">
//                     <h2 className="font-semibold text-gray-800 flex items-center gap-2">
//                       🔔 Recent Notifications
//                       <span className="text-[10px] font-bold text-white bg-red-500 rounded-full px-2 py-0.5">
//                         {unreadNotifs.length}
//                       </span>
//                     </h2>
//                     <button
//                       onClick={() => setActiveTab("notifications")}
//                       className="text-xs text-blue-600 hover:underline"
//                     >
//                       View all →
//                     </button>
//                   </div>
//                   <div className="space-y-2">
//                     {unreadNotifs.slice(0, 3).map((n) => (
//                       <NotificationItem
//                         key={n._id}
//                         notif={n}
//                         onMarkRead={markAsRead}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div className="bg-white border border-gray-200 rounded-2xl p-5">
//                   <h2 className="font-semibold text-gray-800 mb-4">
//                     Recent Applications
//                   </h2>
//                   <div className="space-y-3">
//                     {applications.slice(0, 4).map((a) => (
//                       <div
//                         key={a._id}
//                         className="flex items-center justify-between"
//                       >
//                         <div>
//                           <p className="text-sm font-medium text-gray-700">
//                             {a.name}
//                           </p>
//                           <p className="text-xs text-gray-400">{a.job}</p>
//                         </div>
//                         <Badge status={a.status} />
//                       </div>
//                     ))}
//                     {applications.length === 0 && (
//                       <p className="text-sm text-gray-400 text-center py-4">
//                         No applications yet
//                       </p>
//                     )}
//                   </div>
//                 </div>
//                 <div className="bg-white border border-gray-200 rounded-2xl p-5">
//                   <h2 className="font-semibold text-gray-800 mb-4">
//                     Upcoming Interviews
//                   </h2>
//                   <div className="space-y-3">
//                     {interviews
//                       .filter((i) => i.status === "Scheduled")
//                       .map((i) => (
//                         <div
//                           key={i._id}
//                           className="flex items-center justify-between"
//                         >
//                           <div>
//                             <p className="text-sm font-medium text-gray-700">
//                               {i.candidateName}
//                             </p>
//                             <p className="text-xs text-gray-400">
//                               {i.date} at {i.time}
//                             </p>
//                           </div>
//                           <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">
//                             {i.mode}
//                           </span>
//                         </div>
//                       ))}
//                     {interviews.filter((i) => i.status === "Scheduled")
//                       .length === 0 && (
//                       <p className="text-sm text-gray-400 text-center py-4">
//                         No upcoming interviews
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ─── JOBS ─── */}
//           {activeTab === "jobs" && (
//             <div className="space-y-4">
//               <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
//                 <span className="text-sm">ℹ️</span>
//                 <span className="text-xs text-blue-700">
//                   Jobs posted here are sent for <strong>admin review</strong>.
//                   You&apos;ll be notified once approved or rejected.
//                 </span>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {jobs.map((j) => (
//                   <div
//                     key={j._id}
//                     className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition"
//                   >
//                     <div className="flex items-start justify-between mb-3">
//                       <div>
//                         <h3 className="font-semibold text-gray-800">
//                           {j.title}
//                         </h3>
//                         <p className="text-xs text-gray-500 mt-0.5">
//                           {j.department}
//                         </p>
//                       </div>
//                       <Badge status={j.status} />
//                     </div>
//                     <div className="space-y-1 text-xs text-gray-500 mb-4">
//                       <p>📍 {j.location}</p>
//                       <p>📅 Posted: {formatDate(j.posted)}</p>
//                       <p>👥 Applicants: {j.applicants || 0}</p>
//                     </div>
//                     <button
//                       onClick={() => toggleJobStatus(j._id)}
//                       className={`w-full text-xs py-1.5 rounded-lg font-medium transition ${
//                         j.status === "Open"
//                           ? "bg-red-50 text-red-600 hover:bg-red-100"
//                           : "bg-green-50 text-green-600 hover:bg-green-100"
//                       }`}
//                     >
//                       {j.status === "Open"
//                         ? "Close Position"
//                         : "Reopen Position"}
//                     </button>
//                   </div>
//                 ))}
//                 {jobs.length === 0 && (
//                   <div className="col-span-full text-center py-16 bg-white rounded-2xl border">
//                     <span className="text-4xl">💼</span>
//                     <p className="text-gray-400 mt-3">No jobs posted yet</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* ─── APPLICATIONS ─── */}
//           {activeTab === "applications" && (
//             <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
//               <div className="px-5 py-4 border-b flex items-center justify-between">
//                 <h2 className="font-semibold text-gray-800">
//                   All Applications ({filteredApps.length})
//                 </h2>
//                 {/* ✅ UPDATED: lowercase status filter options */}
//                 <select
//                   value={filterStatus}
//                   onChange={(e) => setFilterStatus(e.target.value)}
//                   className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
//                 >
//                   {["All", "applied", "shortlisted", "selected", "rejected"].map(
//                     (s) => (
//                       <option key={s} value={s}>
//                         {s === "All"
//                           ? "All"
//                           : formatStatus(s)}
//                       </option>
//                     )
//                   )}
//                 </select>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
//                     <tr>
//                       <th className="px-5 py-3 text-left">Candidate</th>
//                       <th className="px-5 py-3 text-left">Job</th>
//                       <th className="px-5 py-3 text-left">Status</th>
//                       <th className="px-5 py-3 text-left">Applied</th>
//                       <th className="px-5 py-3 text-left">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {filteredApps.map((a) => (
//                       <tr key={a._id} className="hover:bg-gray-50">
//                         <td className="px-5 py-3">
//                           <div className="font-medium text-gray-800">
//                             {a.name}
//                           </div>
//                           <div className="text-xs text-gray-400">
//                             {a.email}
//                           </div>
//                         </td>
//                         <td className="px-5 py-3 text-gray-600">{a.job}</td>
//                         <td className="px-5 py-3">
//                           <Badge status={a.status} />
//                         </td>
//                         <td className="px-5 py-3 text-xs text-gray-400">
//                           {a.appliedAt
//                             ? formatTimeAgo(a.appliedAt)
//                             : a.createdAt
//                             ? formatTimeAgo(a.createdAt)
//                             : "N/A"}
//                         </td>
//                         <td className="px-5 py-3">
//                           <button
//                             onClick={() => setSelectedCandidate(a)}
//                             className="text-blue-600 hover:underline text-xs font-medium"
//                           >
//                             View & Update
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                     {filteredApps.length === 0 && (
//                       <tr>
//                         <td
//                           colSpan="5"
//                           className="px-5 py-12 text-center text-gray-400"
//                         >
//                           {applications.length === 0
//                             ? "No applications received yet. Applications will appear here when students apply to your jobs."
//                             : "No applications match this filter."}
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* ─── SHORTLIST ─── */}
//           {activeTab === "shortlist" && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {shortlisted.map((a) => (
//                 <div
//                   key={a._id}
//                   className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition"
//                 >
//                   <div className="flex items-start justify-between mb-2">
//                     <div>
//                       <p className="font-semibold text-gray-800">{a.name}</p>
//                       <p className="text-xs text-gray-400">{a.email}</p>
//                     </div>
//                     <Badge status={a.status} />
//                   </div>
//                   <p className="text-sm text-gray-500 mb-1">Job: {a.job}</p>
//                   {a.university && (
//                     <p className="text-xs text-gray-400 mb-3">
//                       🎓 {a.university}
//                     </p>
//                   )}
//                   <div className="flex gap-2 mt-3">
//                     <button
//                       onClick={() => updateStatus(a._id, "Selected")}
//                       className="text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-100 font-medium"
//                     >
//                       ✅ Select
//                     </button>
//                     <button
//                       onClick={() => updateStatus(a._id, "Rejected")}
//                       className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 font-medium"
//                     >
//                       ❌ Reject
//                     </button>
//                     <button
//                       onClick={() => setSelectedCandidate(a)}
//                       className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium"
//                     >
//                       👁️ View
//                     </button>
//                   </div>
//                 </div>
//               ))}
//               {shortlisted.length === 0 && (
//                 <div className="col-span-full text-center py-16 bg-white rounded-2xl border">
//                   <span className="text-4xl">⭐</span>
//                   <p className="text-gray-400 mt-3">
//                     No shortlisted candidates
//                   </p>
//                   <p className="text-gray-300 text-sm mt-1">
//                     Go to Applications tab and mark candidates as Shortlisted
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ─── INTERVIEWS ─── */}
//           {activeTab === "interviews" && (
//             <div className="bg-white border border-gray-200 rounded-2xl overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
//                   <tr>
//                     <th className="px-5 py-3 text-left">Candidate</th>
//                     <th className="px-5 py-3 text-left">Job</th>
//                     <th className="px-5 py-3 text-left">Date</th>
//                     <th className="px-5 py-3 text-left">Mode</th>
//                     <th className="px-5 py-3 text-left">Status</th>
//                     <th className="px-5 py-3 text-left">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {interviews.map((i) => (
//                     <tr key={i._id} className="hover:bg-gray-50">
//                       <td className="px-5 py-3 font-medium">{i.candidateName}</td>
//                       <td className="px-5 py-3 text-gray-500">{i.job}</td>
//                       <td className="px-5 py-3 text-gray-500">
//                         {i.date}
//                         {i.time && ` at ${i.time}`}
//                       </td>
//                       <td className="px-5 py-3">
//                         <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">
//                           {i.mode}
//                         </span>
//                       </td>
//                       <td className="px-5 py-3">
//                         <Badge status={i.status} />
//                       </td>
//                       <td className="px-5 py-3">
//                         <div className="flex gap-2">
//                           {i.status === "Scheduled" && (
//                             <>
//                               <button
//                                 onClick={() =>
//                                   updateInterviewStatus(i._id, "Completed")
//                                 }
//                                 className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded font-medium"
//                               >
//                                 ✅ Done
//                               </button>
//                               <button
//                                 onClick={() =>
//                                   updateInterviewStatus(i._id, "Cancelled")
//                                 }
//                                 className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded font-medium"
//                               >
//                                 ❌ Cancel
//                               </button>
//                             </>
//                           )}
//                           {i.link && (
//                             <a
//                               href={i.link}
//                               target="_blank"
//                               rel="noreferrer"
//                               className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-medium hover:bg-blue-100"
//                             >
//                               🔗 Join
//                             </a>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               {interviews.length === 0 && (
//                 <div className="text-center py-16">
//                   <span className="text-4xl">📅</span>
//                   <p className="text-gray-400 mt-3">
//                     No interviews scheduled
//                   </p>
//                   <p className="text-gray-300 text-sm mt-1">
//                     Schedule interviews from shortlisted candidates
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ─── NOTIFICATIONS FULL PAGE ─── */}
//           {activeTab === "notifications" && (
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <h2 className="text-base font-semibold text-gray-800">
//                     All Notifications
//                   </h2>
//                   {unreadCount > 0 && (
//                     <span className="text-[10px] font-bold text-white bg-red-500 rounded-full px-2.5 py-1">
//                       {unreadCount} unread
//                     </span>
//                   )}
//                 </div>
//                 {unreadCount > 0 && (
//                   <button
//                     onClick={markAllAsRead}
//                     className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
//                   >
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     >
//                       <polyline points="20 6 9 17 4 12" />
//                     </svg>
//                     Mark all as read
//                   </button>
//                 )}
//               </div>

//               <div className="flex gap-2">
//                 {["all", "job_approved", "job_rejected"].map((f) => (
//                   <button
//                     key={f}
//                     onClick={() => {}}
//                     className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
//                       f === "all"
//                         ? "bg-gray-800 text-white"
//                         : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                     }`}
//                   >
//                     {f === "all"
//                       ? "All"
//                       : f === "job_approved"
//                       ? "✅ Approved"
//                       : "❌ Rejected"}
//                     {f === "all" && ` (${notifications.length})`}
//                     {f === "job_approved" &&
//                       ` (${notifications.filter((n) => n.type === "job_approved").length})`}
//                     {f === "job_rejected" &&
//                       ` (${notifications.filter((n) => n.type === "job_rejected").length})`}
//                   </button>
//                 ))}
//               </div>

//               <div className="space-y-3">
//                 {notifications.length === 0 ? (
//                   <div className="bg-white rounded-2xl border p-16 text-center">
//                     <span className="text-5xl">📭</span>
//                     <h3 className="text-gray-700 font-semibold mt-4">
//                       No notifications
//                     </h3>
//                     <p className="text-gray-400 text-sm mt-1">
//                       When admin approves or rejects your jobs, you&apos;ll see
//                       updates here.
//                     </p>
//                   </div>
//                 ) : (
//                   notifications.map((n) => (
//                     <NotificationItem
//                       key={n._id}
//                       notif={n}
//                       onMarkRead={markAsRead}
//                       onViewDetail={setSelectedNotif}
//                     />
//                   ))
//                 )}
//               </div>
//             </div>
//           )}
//         </main>
//       </div>

//       {/* ═══════ MODALS ═══════ */}

//       {showJobModal && (
//         <Modal
//           title="Post New Job Opening"
//           onClose={() => setShowJobModal(false)}
//         >
//           <div className="space-y-3">
//             <div>
//               <label className={labelCls}>Job Title *</label>
//               <input
//                 className={inputCls}
//                 placeholder="e.g. Software Engineer"
//                 value={jobForm.title}
//                 onChange={(e) =>
//                   setJobForm((p) => ({ ...p, title: e.target.value }))
//                 }
//               />
//             </div>
//             <div>
//               <label className={labelCls}>Department *</label>
//               <input
//                 className={inputCls}
//                 placeholder="e.g. Engineering"
//                 value={jobForm.department}
//                 onChange={(e) =>
//                   setJobForm((p) => ({ ...p, department: e.target.value }))
//                 }
//               />
//             </div>
//             <div>
//               <label className={labelCls}>Location</label>
//               <input
//                 className={inputCls}
//                 placeholder="e.g. Remote, New York"
//                 value={jobForm.location}
//                 onChange={(e) =>
//                   setJobForm((p) => ({ ...p, location: e.target.value }))
//                 }
//               />
//             </div>
//             <div>
//               <label className={labelCls}>Employment Type</label>
//               <select
//                 className={inputCls}
//                 value={jobForm.type}
//                 onChange={(e) =>
//                   setJobForm((p) => ({ ...p, type: e.target.value }))
//                 }
//               >
//                 <option value="Full-time">Full-time</option>
//                 <option value="Part-time">Part-time</option>
//                 <option value="Internship">Internship</option>
//                 <option value="Contract">Contract</option>
//               </select>
//             </div>
//             <div>
//               <label className={labelCls}>Job Description</label>
//               <textarea
//                 className={`${inputCls} resize-none`}
//                 rows={3}
//                 placeholder="Describe responsibilities..."
//                 value={jobForm.description}
//                 onChange={(e) =>
//                   setJobForm((p) => ({
//                     ...p,
//                     description: e.target.value,
//                   }))
//                 }
//               />
//             </div>
//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
//               ⏳ Your job will be reviewed by admin before going live.
//               You&apos;ll receive a notification once it&apos;s approved or
//               rejected.
//             </div>
//             <div className="flex gap-2 pt-2">
//               <button onClick={postJob} className={btnPrimary}>
//                 Post Job
//               </button>
//               <button
//                 onClick={() => setShowJobModal(false)}
//                 className={btnSecondary}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {showInterviewModal && (
//         <Modal
//           title="Schedule Interview"
//           onClose={() => setShowInterviewModal(false)}
//         >
//           <div className="space-y-3">
//             <div>
//               <label className={labelCls}>Candidate *</label>
//               <select
//                 className={inputCls}
//                 value={intForm.candidateName}
//                 onChange={(e) =>
//                   setIntForm((p) => ({
//                     ...p,
//                     candidateName: e.target.value,
//                   }))
//                 }
//               >
//                 <option value="">Select candidate</option>
//                 {applications.map((a) => (
//                   <option key={a._id} value={a.name}>
//                     {a.name} - {a.job}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className={labelCls}>Job Role</label>
//               <input
//                 className={inputCls}
//                 placeholder="e.g. Frontend Developer"
//                 value={intForm.job}
//                 onChange={(e) =>
//                   setIntForm((p) => ({ ...p, job: e.target.value }))
//                 }
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className={labelCls}>Date *</label>
//                 <input
//                   type="date"
//                   className={inputCls}
//                   value={intForm.date}
//                   onChange={(e) =>
//                     setIntForm((p) => ({ ...p, date: e.target.value }))
//                   }
//                 />
//               </div>
//               <div>
//                 <label className={labelCls}>Time</label>
//                 <input
//                   type="time"
//                   className={inputCls}
//                   value={intForm.time}
//                   onChange={(e) =>
//                     setIntForm((p) => ({ ...p, time: e.target.value }))
//                   }
//                 />
//               </div>
//             </div>
//             <div>
//               <label className={labelCls}>Interviewer</label>
//               <input
//                 className={inputCls}
//                 placeholder="e.g. Jane Doe (HR)"
//                 value={intForm.interviewer}
//                 onChange={(e) =>
//                   setIntForm((p) => ({
//                     ...p,
//                     interviewer: e.target.value,
//                   }))
//                 }
//               />
//             </div>
//             <div>
//               <label className={labelCls}>Mode</label>
//               <select
//                 className={inputCls}
//                 value={intForm.mode}
//                 onChange={(e) =>
//                   setIntForm((p) => ({ ...p, mode: e.target.value }))
//                 }
//               >
//                 <option value="Video Call">Video Call</option>
//                 <option value="In-Person">In-Person</option>
//                 <option value="Phone">Phone</option>
//               </select>
//             </div>
//             <div>
//               <label className={labelCls}>Meeting Link</label>
//               <input
//                 className={inputCls}
//                 placeholder="https://meet.google.com/..."
//                 value={intForm.link}
//                 onChange={(e) =>
//                   setIntForm((p) => ({ ...p, link: e.target.value }))
//                 }
//               />
//             </div>
//             <div className="flex gap-2 pt-2">
//               <button onClick={scheduleInterview} className={btnPrimary}>
//                 Schedule
//               </button>
//               <button
//                 onClick={() => setShowInterviewModal(false)}
//                 className={btnSecondary}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* ✅ UPDATED: Candidate Detail Modal with lowercase status buttons */}
//       {selectedCandidate && (
//         <Modal
//           title="Candidate Details"
//           onClose={() => setSelectedCandidate(null)}
//           size="max-w-xl"
//         >
//           <div className="space-y-4">
//             <div className="flex items-start gap-4">
//               <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
//                 👤
//               </div>
//               <div className="flex-1">
//                 <h3 className="text-lg font-bold text-gray-800">
//                   {selectedCandidate.name}
//                 </h3>
//                 <p className="text-sm text-gray-500">
//                   {selectedCandidate.email}
//                 </p>
//                 <div className="mt-2">
//                   <Badge status={selectedCandidate.status} />
//                 </div>
//               </div>
//             </div>

//             {/* Candidate Info Grid */}
//             <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl p-4">
//               {selectedCandidate.university && (
//                 <div>
//                   <p className="text-[10px] font-bold uppercase text-gray-400">
//                     University
//                   </p>
//                   <p className="text-sm text-gray-700">
//                     {selectedCandidate.university}
//                   </p>
//                 </div>
//               )}
//               {selectedCandidate.gpa && (
//                 <div>
//                   <p className="text-[10px] font-bold uppercase text-gray-400">
//                     GPA
//                   </p>
//                   <p className="text-sm text-gray-700">
//                     {selectedCandidate.gpa}
//                   </p>
//                 </div>
//               )}
//               {selectedCandidate.phone && (
//                 <div>
//                   <p className="text-[10px] font-bold uppercase text-gray-400">
//                     Phone
//                   </p>
//                   <p className="text-sm text-gray-700">
//                     {selectedCandidate.phone}
//                   </p>
//                 </div>
//               )}
//               {selectedCandidate.job && (
//                 <div>
//                   <p className="text-[10px] font-bold uppercase text-gray-400">
//                     Applied For
//                   </p>
//                   <p className="text-sm text-gray-700">
//                     {selectedCandidate.job}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {selectedCandidate.skills && (
//               <div>
//                 <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">
//                   Skills
//                 </p>
//                 <div className="flex flex-wrap gap-1.5">
//                   {selectedCandidate.skills
//                     .split(",")
//                     .map((skill, idx) => (
//                       <span
//                         key={idx}
//                         className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg"
//                       >
//                         {skill.trim()}
//                       </span>
//                     ))}
//                 </div>
//               </div>
//             )}

//             {selectedCandidate.appliedAt && (
//               <p className="text-xs text-gray-400">
//                 Applied {formatTimeAgo(selectedCandidate.appliedAt)}
//               </p>
//             )}

//             {/* Status Update Buttons - lowercase values */}
//             <div>
//               <p className="text-xs font-bold uppercase text-gray-400 mb-2">
//                 Update Status
//               </p>
//               <div className="flex flex-wrap gap-2">
//                 {[
//                   { value: "applied", label: "🔄 Under Review" },
//                   { value: "shortlisted", label: "⭐ Shortlist" },
//                   { value: "selected", label: "✅ Select" },
//                   { value: "rejected", label: "❌ Reject" },
//                 ].map((s) => (
//                   <button
//                     key={s.value}
//                     onClick={() => updateStatus(selectedCandidate._id, s.label)}
//                     className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${
//                       selectedCandidate.status === s.value
//                         ? "bg-blue-600 text-white border-blue-600"
//                         : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
//                     }`}
//                   >
//                     {s.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {selectedNotif && (
//         <Modal
//           title="Notification Details"
//           onClose={() => setSelectedNotif(null)}
//           size="max-w-md"
//         >
//           <div className="space-y-4">
//             <div
//               className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto ${
//                 selectedNotif.action === "approved"
//                   ? "bg-green-100"
//                   : "bg-red-100"
//               }`}
//             >
//               {selectedNotif.action === "approved" ? "✅" : "❌"}
//             </div>
//             <div className="text-center">
//               <h3 className="text-lg font-bold text-gray-800">
//                 {selectedNotif.title}
//               </h3>
//               <p className="text-sm text-gray-500 mt-1">
//                 {selectedNotif.message}
//               </p>
//             </div>

//             {selectedNotif.jobTitle && (
//               <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
//                 <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
//                   Job Posting
//                 </p>
//                 <p className="font-semibold text-gray-800">
//                   💼 {selectedNotif.jobTitle}
//                 </p>
//               </div>
//             )}

//             {selectedNotif.action === "approved" && (
//               <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
//                 <p className="text-sm text-green-800">
//                   🎉 Your job is now <strong>live</strong> on the placement
//                   portal. Students can view and apply.
//                 </p>
//               </div>
//             )}

//             {selectedNotif.action === "rejected" && selectedNotif.reason && (
//               <div className="bg-red-50 border border-red-200 rounded-xl p-4">
//                 <p className="text-[10px] font-bold uppercase tracking-wide text-red-500 mb-2">
//                   Admin&apos;s Rejection Reason:
//                 </p>
//                 <p className="text-sm text-red-800 leading-relaxed italic">
//                   &quot;{selectedNotif.reason}&quot;
//                 </p>
//               </div>
//             )}

//             <div className="text-center text-xs text-gray-400">
//               🕐 {formatTimeAgo(selectedNotif.createdAt)} &nbsp;·&nbsp; 📅{" "}
//               {formatDate(selectedNotif.createdAt)}
//             </div>
//           </div>
//         </Modal>
//       )}

//       <style>{`
//         @keyframes slideIn {
//           from { transform: translateX(100%); opacity: 0; }
//           to { transform: translateX(0); opacity: 1; }
//         }
//       `}</style>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CompanyName from "../Company/CompanyName.jsx";

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateString);
};

const STATUS_COLORS = {
  applied: "bg-yellow-100 text-yellow-800",
  shortlisted: "bg-blue-100 text-blue-800",
  selected: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  Open: "bg-green-100 text-green-800",
  Closed: "bg-gray-100 text-gray-800",
  Scheduled: "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
};

const formatStatus = (status) => {
  if (!status) return "N/A";
  const map = {
    applied: "Applied",
    shortlisted: "Shortlisted",
    selected: "Selected",
    rejected: "Rejected",
  };
  return map[status] || status;
};

const Badge = ({ status }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-semibold ${
      STATUS_COLORS[status] || "bg-gray-100 text-gray-700"
    }`}
  >
    {formatStatus(status)}
  </span>
);

const Modal = ({ title, onClose, children, size = "max-w-lg" }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className={`bg-white rounded-2xl shadow-2xl w-full ${size} mx-4 overflow-hidden`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          &#x2715;
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
);

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const t = setTimeout(onClose, 3000);
      return () => clearTimeout(t);
    }
  }, [toast, onClose]);
  if (!toast) return null;
  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
    warning: "bg-yellow-500 text-gray-900",
  };
  const icons = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };
  return (
    <div
      className="fixed top-5 right-5 z-[999]"
      style={{ animation: "slideIn 0.3s ease-out" }}
    >
      <div
        className={`${
          colors[toast.type] || colors.success
        } text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]`}
      >
        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">
          {icons[toast.type]}
        </span>
        <span className="text-sm font-medium flex-1">{toast.message}</span>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white text-lg leading-none"
        >
          &times;
        </button>
      </div>
    </div>
  );
}

function drawAnimatedDonut(canvas, data, colors, total, animProgress) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const size = 180;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + "px";
  canvas.style.height = size + "px";
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, size, size);

  const cx = size / 2,
    cy = size / 2;
  const outerR = 80,
    innerR = 56,
    spacing = 0.04;
  let startAngle = -Math.PI / 2;
  const maxAngle = Math.PI * 2 * animProgress;

  let accumulated = 0;
  data.forEach((val, i) => {
    const sweep = (val / total) * Math.PI * 2 - spacing;
    const clampedSweep = Math.max(0, Math.min(sweep, maxAngle - accumulated));
    if (clampedSweep <= 0) {
      accumulated += sweep + spacing;
      return;
    }

    ctx.beginPath();
    ctx.arc(cx, cy, outerR, startAngle, startAngle + clampedSweep);
    ctx.arc(cx, cy, innerR, startAngle + clampedSweep, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();

    startAngle += clampedSweep + spacing;
    accumulated += sweep + spacing;
  });

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 26px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(Math.round(total * animProgress), cx, cy - 6);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillText("Total", cx, cy + 14);
}

function drawAnimatedBar(canvas, labels, values, colors, animProgress) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  const w = rect.width,
    h = 200;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const pad = { top: 20, right: 16, bottom: 36, left: 16 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;
  const maxVal = Math.max(...values, 1);
  const n = labels.length;
  const barW = Math.min(48, (cw / n) * 0.55);
  const gap = (cw - barW * n) / (n + 1);

  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (i / 4) * ch;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.strokeStyle = "rgba(0,0,0,0.04)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  labels.forEach((label, i) => {
    const x = pad.left + gap * (i + 1) + barW * i;
    const barH = (values[i] / maxVal) * ch * animProgress;
    const y = pad.top + ch - barH;
    const radius = Math.min(6, barW / 2);

    if (barH > radius) {
      ctx.beginPath();
      ctx.moveTo(x, y + radius);
      ctx.arcTo(x, y, x + radius, y, radius);
      ctx.arcTo(x + barW, y, x + barW, y + radius, radius);
      ctx.lineTo(x + barW, pad.top + ch);
      ctx.lineTo(x, pad.top + ch);
      ctx.closePath();
    } else if (barH > 0) {
      ctx.beginPath();
      ctx.rect(x, y, barW, barH);
      ctx.closePath();
    }

    const grad = ctx.createLinearGradient(x, y, x, pad.top + ch);
    grad.addColorStop(0, colors[i]);
    grad.addColorStop(1, colors[i] + "40");
    ctx.fillStyle = grad;
    ctx.fill();

    if (animProgress > 0.5) {
      const valOpacity = Math.min(1, (animProgress - 0.5) * 4);
      ctx.globalAlpha = valOpacity;
      ctx.fillStyle = "#334155";
      ctx.font = "bold 12px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(values[i], x + barW / 2, y - 8);
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, x + barW / 2, pad.top + ch + 18);
  });
}

function drawAnimatedLine(canvas, labels, datasets, animProgress) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  const w = rect.width,
    h = 200;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const pad = { top: 16, right: 16, bottom: 32, left: 36 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;
  const n = labels.length;
  const allVals = datasets.flatMap((d) => d.values);
  const maxVal = Math.max(...allVals, 1);

  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (i / 4) * ch;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.strokeStyle = "rgba(0,0,0,0.04)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(Math.round(maxVal - (i / 4) * maxVal), pad.left - 8, y);
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  labels.forEach((label, i) => {
    const x = pad.left + (i / (n - 1)) * cw;
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px system-ui, sans-serif";
    ctx.fillText(label, x, pad.top + ch + 10);
  });

  datasets.forEach((ds) => {
    const pts = ds.values.map((v, i) => ({
      x: pad.left + (i / (n - 1)) * cw,
      y: pad.top + (1 - v / maxVal) * ch,
    }));

    const clipX = pad.left + cw * animProgress;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, clipX, h);
    ctx.clip();

    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
    grad.addColorStop(0, ds.color + "18");
    grad.addColorStop(1, ds.color + "00");
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      const mx = (pts[i - 1].x + pts[i].x) / 2;
      ctx.bezierCurveTo(mx, pts[i - 1].y, mx, pts[i].y, pts[i].x, pts[i].y);
    }
    ctx.lineTo(pts[pts.length - 1].x, pad.top + ch);
    ctx.lineTo(pts[0].x, pad.top + ch);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      const mx = (pts[i - 1].x + pts[i].x) / 2;
      ctx.bezierCurveTo(mx, pts[i - 1].y, mx, pts[i].y, pts[i].x, pts[i].y);
    }
    ctx.strokeStyle = ds.color;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    pts.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = ds.color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
    });

    ctx.restore();
  });
}

function NotificationItem({ notif, onMarkRead, onViewDetail }) {
  const isApproved = notif.action === "approved";
  const isRejected = notif.action === "rejected";

  return (
    <div
      onClick={() => {
        if (!notif.read) onMarkRead(notif._id);
      }}
      className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
        notif.read
          ? "bg-white border-gray-100 hover:bg-gray-50"
          : "bg-blue-50/50 border-blue-200 hover:bg-blue-50 shadow-sm"
      }`}
    >
      {!notif.read && (
        <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-blue-500" />
      )}

      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
            isApproved
              ? "bg-green-100"
              : isRejected
              ? "bg-red-100"
              : "bg-gray-100"
          }`}
        >
          {isApproved ? "✅" : isRejected ? "❌" : "ℹ️"}
        </div>
        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm font-semibold ${
              notif.read ? "text-gray-700" : "text-gray-900"
            }`}
          >
            {notif.title}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>

          {notif.jobTitle && (
            <div className="mt-2 inline-flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-lg">
              <span className="text-xs">💼</span>
              <span className="text-xs font-medium text-gray-700">
                {notif.jobTitle}
              </span>
            </div>
          )}

          {isRejected && notif.reason && (
            <div className="mt-2.5 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-red-600 mb-1">
                Rejection Reason:
              </p>
              <p className="text-xs text-red-800 leading-relaxed">
                &quot;{notif.reason}&quot;
              </p>
            </div>
          )}

          {isApproved && (
            <div className="mt-2.5 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-800 leading-relaxed">
                🎉 Your job is now <strong>live</strong> on the placement
                portal. Students can view and apply to it.
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 mt-2.5">
            <span className="text-[11px] text-gray-400">
              🕐 {formatTimeAgo(notif.createdAt)}
            </span>
            <span className="text-[11px] text-gray-400">
              📅 {formatDate(notif.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompanyDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  const [showJobModal, setShowJobModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type });

  const [jobForm, setJobForm] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    description: "",
  });
  const [intForm, setIntForm] = useState({
    candidateName: "",
    job: "",
    date: "",
    time: "",
    interviewer: "",
    mode: "Video Call",
    link: "",
  });

  const API_URL = "http://localhost:5000/api";

  const donutRef = useRef(null);
  const barRef = useRef(null);
  const lineRef = useRef(null);
  const chartsAnimated = useRef(false);

  const navItems = [
    { id: "overview", label: "Overview", icon: "🏠" },
    { id: "jobs", label: "Job Openings", icon: "💼" },
    { id: "applications", label: "Applications", icon: "📋" },
    { id: "shortlist", label: "Shortlisted", icon: "⭐" },
    { id: "interviews", label: "Interviews", icon: "📅" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
  ];

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/company/login");
        return;
      }

      try {
        const headers = getAuthHeaders();

        const [jobsRes, appsRes, intsRes, notifsRes, unreadRes] =
          await Promise.all([
            fetch(`${API_URL}/jobs`, { headers }).then((r) => r.json()),
            fetch(`${API_URL}/applications`, { headers }).then((r) => r.json()),
            fetch(`${API_URL}/interviews`, { headers }).then((r) => r.json()),
            fetch(`${API_URL}/notifications`, { headers }).then((r) => r.json()),
            fetch(`${API_URL}/notifications/unread-count`, { headers }).then(
              (r) => r.json()
            ),
          ]);

        console.log("Jobs:", jobsRes);
        console.log("Applications:", appsRes);

        if (Array.isArray(jobsRes)) setJobs(jobsRes);
        if (Array.isArray(appsRes)) setApplications(appsRes);
        if (Array.isArray(intsRes)) setInterviews(intsRes);
        if (Array.isArray(notifsRes)) setNotifications(notifsRes);
        if (unreadRes.count !== undefined) setUnreadCount(unreadRes.count);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        navigate("/company/login");
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const headers = getAuthHeaders();
        const [notifsRes, unreadRes] = await Promise.all([
          fetch(`${API_URL}/notifications`, { headers }).then((r) => r.json()),
          fetch(`${API_URL}/notifications/unread-count`, { headers }).then(
            (r) => r.json()
          ),
        ]);
        if (Array.isArray(notifsRes)) setNotifications(notifsRes);
        if (unreadRes.count !== undefined) setUnreadCount(unreadRes.count);
      } catch (e) {}
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (applications.length === 0 && jobs.length === 0) return;
    if (chartsAnimated.current) return;
    chartsAnimated.current = true;

    let start = null;
    const duration = 1200;

    const statusCounts = {
      applied: applications.filter((a) => a.status === "applied").length,
      shortlisted: applications.filter((a) => a.status === "shortlisted").length,
      selected: applications.filter((a) => a.status === "selected").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
    };
    const donutData = Object.values(statusCounts);
    const donutColors = ["#eab308", "#3b82f6", "#22c55e", "#ef4444"];
    const donutTotal = donutData.reduce((a, b) => a + b, 0) || 1;

    const jobStatusCounts = {
      Open: jobs.filter((j) => j.status === "Open").length,
      Closed: jobs.filter((j) => j.status === "Closed").length,
      Pending: jobs.filter((j) => j.approvalStatus === "Pending").length,
    };
    const barLabels = Object.keys(jobStatusCounts);
    const barValues = Object.values(jobStatusCounts);
    const barColors = ["#22c55e", "#94a3b8", "#eab308"];

    const now = new Date();
    const weekLabels = [];
    const appliedPerWeek = [];
    const selectedPerWeek = [];
    for (let i = 6; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      weekLabels.push(
        weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      );
      appliedPerWeek.push(
        applications.filter((a) => {
          const d = new Date(a.appliedAt || a.createdAt || a.date);
          return d >= weekStart && d < weekEnd;
        }).length
      );
      selectedPerWeek.push(
        applications.filter((a) => {
          const d = new Date(a.appliedAt || a.createdAt || a.date);
          return d >= weekStart && d < weekEnd && a.status === "selected";
        }).length
      );
    }

    function animate(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      drawAnimatedDonut(donutRef.current, donutData, donutColors, donutTotal, eased);
      drawAnimatedBar(barRef.current, barLabels, barValues, barColors, eased);
      drawAnimatedLine(
        lineRef.current,
        weekLabels,
        [
          { values: appliedPerWeek, color: "#3b82f6" },
          { values: selectedPerWeek, color: "#22c55e" },
        ],
        eased
      );

      if (progress < 1) requestAnimationFrame(animate);
    }

    const timer = setTimeout(() => requestAnimationFrame(animate), 150);

    const onResize = () => {
      drawAnimatedDonut(donutRef.current, donutData, donutColors, donutTotal, 1);
      drawAnimatedBar(barRef.current, barLabels, barValues, barColors, 1);
      drawAnimatedLine(
        lineRef.current,
        weekLabels,
        [
          { values: appliedPerWeek, color: "#3b82f6" },
          { values: selectedPerWeek, color: "#22c55e" },
        ],
        1
      );
    };
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      chartsAnimated.current = false;
    };
  }, [applications, jobs]);

  const markAsRead = async (id) => {
    try {
      await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${API_URL}/notifications/read-all`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      showToast("All notifications marked as read", "info");
    } catch (e) {
      console.error(e);
    }
  };

  const stats = [
    {
      label: "Open Positions",
      value: jobs.filter((j) => j.status === "Open").length,
      icon: "💼",
      color: "bg-blue-50 border-blue-200",
    },
    {
      label: "Total Applications",
      value: applications.length,
      icon: "📋",
      color: "bg-purple-50 border-purple-200",
    },
    {
      label: "Shortlisted",
      value: applications.filter((a) => a.status === "shortlisted").length,
      icon: "⭐",
      color: "bg-yellow-50 border-yellow-200",
    },
    {
      label: "Selected",
      value: applications.filter((a) => a.status === "selected").length,
      icon: "✅",
      color: "bg-green-50 border-green-200",
    },
  ];

  async function postJob() {
    if (!jobForm.title || !jobForm.department) {
      showToast("Please fill in Job Title and Department", "warning");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/jobs`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(jobForm),
      });
      const newJob = await res.json();
      if (newJob._id) {
        setJobs((prev) => [...prev, newJob]);
        showToast(`"${jobForm.title}" posted! Pending admin review.`, "success");
      } else {
        showToast(newJob.error || "Failed to post job", "error");
      }
      setJobForm({
        title: "",
        department: "",
        location: "",
        type: "Full-time",
        description: "",
      });
      setShowJobModal(false);
    } catch (err) {
      showToast("Network error while posting job", "error");
    }
  }

  // ✅✅✅ FIXED updateStatus FUNCTION ✅✅✅
  async function updateStatus(appId, newStatus) {
    try {
      // Map exact button labels to lowercase schema values
      const statusMap = {
        "Under Review": "applied",
        "Shortlisted": "shortlisted",
        "Selected": "selected",
        "Rejected": "rejected",
      };

      // Get the actual lowercase status
      const actualStatus = statusMap[newStatus] || newStatus.toLowerCase();

      console.log("Updating:", { appId, newStatus, actualStatus });

      const res = await fetch(`${API_URL}/applications/${appId}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: actualStatus }),
      });

      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || err.message || "Failed to update", "error");
        return;
      }

      // Update applications list
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: actualStatus } : a))
      );

      // Update selected candidate modal if open
      if (selectedCandidate?._id === appId) {
        setSelectedCandidate((prev) => ({ ...prev, status: actualStatus }));
      }

      // Success message
      const msgs = {
        shortlisted: "⭐ Candidate shortlisted",
        selected: "✅ Candidate selected!",
        rejected: "❌ Candidate rejected",
        applied: "🔄 Reset to Under Review",
      };
      showToast(
        msgs[actualStatus] || `Status updated to ${formatStatus(actualStatus)}`,
        actualStatus === "rejected" ? "error" : "success"
      );
    } catch (err) {
      console.error("Update error:", err);
      showToast("Network error", "error");
    }
  }

  async function scheduleInterview() {
    if (!intForm.candidateName || !intForm.date) {
      showToast("Select candidate and date", "warning");
      return;
    }
    const app = applications.find((a) => a.name === intForm.candidateName);
    try {
      const res = await fetch(`${API_URL}/interviews`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...intForm, applicationId: app?._id }),
      });
      const newInt = await res.json();
      if (newInt._id) {
        setInterviews((prev) => [...prev, newInt]);
        if (app)
          setApplications((prev) =>
            prev.map((a) =>
              a._id === app._id ? { ...a, status: "shortlisted" } : a
            )
          );
        showToast(`Interview scheduled for ${intForm.candidateName}`, "success");
      } else {
        showToast(newInt.error || "Failed to schedule", "error");
      }
      setIntForm({
        candidateName: "",
        job: "",
        date: "",
        time: "",
        interviewer: "",
        mode: "Video Call",
        link: "",
      });
      setShowInterviewModal(false);
    } catch (err) {
      showToast("Network error", "error");
    }
  }

  async function toggleJobStatus(id) {
    try {
      const res = await fetch(`${API_URL}/jobs/${id}/toggle`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json();
        showToast(`Error: ${err.message || err.error}`, "error");
        return;
      }
      const updated = await res.json();
      if (updated._id) {
        setJobs((prev) => prev.map((j) => (j._id === id ? updated : j)));
        showToast(
          updated.status === "Open"
            ? `"${updated.title}" reopened`
            : `"${updated.title}" closed`,
          updated.status === "Open" ? "success" : "info"
        );
      }
    } catch (err) {
      showToast("Network error", "error");
    }
  }

  async function updateInterviewStatus(id, status) {
    try {
      await fetch(`${API_URL}/interviews/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      setInterviews((prev) =>
        prev.map((x) => (x._id === id ? { ...x, status } : x))
      );
      showToast(`Interview marked as ${status}`, "success");
    } catch (err) {
      showToast("Failed to update", "error");
    }
  }

  const filteredApps =
    filterStatus === "All"
      ? applications
      : applications.filter((a) => a.status === filterStatus);

  const shortlisted = applications.filter((a) =>
    ["shortlisted", "selected"].includes(a.status)
  );

  const unreadNotifs = notifications.filter((n) => !n.read);

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelCls = "block text-xs font-medium text-gray-600 mb-1";
  const btnPrimary =
    "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition";
  const btnSecondary =
    "bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition";

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* ═══════ SIDEBAR ═══════ */}
      <aside
        className={`${
          sidebarOpen ? "w-60" : "w-16"
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shrink-0`}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
            C
          </div>
          {sidebarOpen && <CompanyName />}
        </div>
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition relative ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-base shrink-0">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
              {item.id === "notifications" && unreadCount > 0 && (
                <span
                  className={`${
                    sidebarOpen ? "ml-auto" : "absolute -top-1 -right-1"
                  } min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1`}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          ))}
        </nav>
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="m-4 text-xs text-gray-400 hover:text-gray-600 text-left"
        >
          {sidebarOpen ? "◀ Collapse" : "▶"}
        </button>
      </aside>

      {/* ═══════ MAIN ═══════ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              {navItems.find((n) => n.id === activeTab)?.icon}{" "}
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === "jobs" && (
              <button onClick={() => setShowJobModal(true)} className={btnPrimary}>
                + Post Job
              </button>
            )}
            {activeTab === "interviews" && (
              <button
                onClick={() => setShowInterviewModal(true)}
                className={btnPrimary}
              >
                + Schedule Interview
              </button>
            )}

            <button
              onClick={() => setShowNotifPanel((p) => !p)}
              className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
            >
              <span className="text-lg">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
              HR
            </div>
          </div>
        </header>

        {/* ═══════ NOTIFICATION DROPDOWN ═══════ */}
        {showNotifPanel && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setShowNotifPanel(false)}
            />
            <div
              className="absolute top-[73px] right-6 z-40 w-[420px] max-h-[500px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              style={{ animation: "slideIn 0.2s ease-out" }}
            >
              <div className="px-4 py-3 border-b flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold text-white bg-red-500 rounded-full px-2 py-0.5">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-10">
                    <span className="text-3xl">📭</span>
                    <p className="text-sm text-gray-400 mt-2">
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <NotificationItem
                      key={n._id}
                      notif={n}
                      onMarkRead={markAsRead}
                      onViewDetail={setSelectedNotif}
                    />
                  ))
                )}
              </div>
              {notifications.length > 10 && (
                <div className="px-4 py-2.5 border-t text-center">
                  <button
                    onClick={() => {
                      setActiveTab("notifications");
                      setShowNotifPanel(false);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all {notifications.length} notifications →
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ═══════ CONTENT AREA ═══════ */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* ─── OVERVIEW ─── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className={`border rounded-2xl p-5 ${s.color} flex items-center gap-4`}
                  >
                    <div className="text-3xl">{s.icon}</div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">
                        {s.value}
                      </div>
                      <div className="text-xs text-gray-500">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h2 className="font-semibold text-gray-800 mb-1">
                    Application Status
                  </h2>
                  <p className="text-xs text-gray-400 mb-4">
                    Distribution by current status
                  </p>
                  <div className="flex items-center justify-center">
                    <canvas ref={donutRef} />
                  </div>
                  <div className="mt-4 space-y-2">
                    {[
                      {
                        label: "Applied",
                        color: "#eab308",
                        count: applications.filter((a) => a.status === "applied")
                          .length,
                      },
                      {
                        label: "Shortlisted",
                        color: "#3b82f6",
                        count: applications.filter(
                          (a) => a.status === "shortlisted"
                        ).length,
                      },
                      {
                        label: "Selected",
                        color: "#22c55e",
                        count: applications.filter((a) => a.status === "selected")
                          .length,
                      },
                      {
                        label: "Rejected",
                        color: "#ef4444",
                        count: applications.filter((a) => a.status === "rejected")
                          .length,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ background: item.color }}
                          />
                          <span className="text-gray-600">{item.label}</span>
                        </div>
                        <span className="font-bold text-gray-800">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h2 className="font-semibold text-gray-800 mb-1">
                    Job Postings
                  </h2>
                  <p className="text-xs text-gray-400 mb-4">
                    Open vs Closed vs Pending review
                  </p>
                  <div>
                    <canvas ref={barRef} />
                  </div>
                  <div className="mt-4 flex justify-center gap-5">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: "#22c55e" }}
                      />
                      <span className="text-gray-600">Open</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: "#94a3b8" }}
                      />
                      <span className="text-gray-600">Closed</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: "#eab308" }}
                      />
                      <span className="text-gray-600">Pending</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h2 className="font-semibold text-gray-800 mb-1">
                    Weekly Trend
                  </h2>
                  <p className="text-xs text-gray-400 mb-4">
                    Applications vs Selections (last 7 weeks)
                  </p>
                  <div>
                    <canvas ref={lineRef} />
                  </div>
                  <div className="mt-4 flex justify-center gap-5">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span
                        className="w-5 h-0.5 rounded"
                        style={{ background: "#3b82f6" }}
                      />
                      <span className="text-gray-600">Applied</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span
                        className="w-5 h-0.5 rounded"
                        style={{ background: "#22c55e" }}
                      />
                      <span className="text-gray-600">Selected</span>
                    </div>
                  </div>
                </div>
              </div>

              {unreadNotifs.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                      🔔 Recent Notifications
                      <span className="text-[10px] font-bold text-white bg-red-500 rounded-full px-2 py-0.5">
                        {unreadNotifs.length}
                      </span>
                    </h2>
                    <button
                      onClick={() => setActiveTab("notifications")}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View all →
                    </button>
                  </div>
                  <div className="space-y-2">
                    {unreadNotifs.slice(0, 3).map((n) => (
                      <NotificationItem
                        key={n._id}
                        notif={n}
                        onMarkRead={markAsRead}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h2 className="font-semibold text-gray-800 mb-4">
                    Recent Applications
                  </h2>
                  <div className="space-y-3">
                    {applications.slice(0, 4).map((a) => (
                      <div
                        key={a._id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {a.name}
                          </p>
                          <p className="text-xs text-gray-400">{a.job}</p>
                        </div>
                        <Badge status={a.status} />
                      </div>
                    ))}
                    {applications.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-4">
                        No applications yet
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h2 className="font-semibold text-gray-800 mb-4">
                    Upcoming Interviews
                  </h2>
                  <div className="space-y-3">
                    {interviews
                      .filter((i) => i.status === "Scheduled")
                      .map((i) => (
                        <div
                          key={i._id}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {i.candidateName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {i.date} at {i.time}
                            </p>
                          </div>
                          <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">
                            {i.mode}
                          </span>
                        </div>
                      ))}
                    {interviews.filter((i) => i.status === "Scheduled")
                      .length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-4">
                        No upcoming interviews
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── JOBS ─── */}
          {activeTab === "jobs" && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
                <span className="text-sm">ℹ️</span>
                <span className="text-xs text-blue-700">
                  Jobs posted here are sent for <strong>admin review</strong>.
                  You&apos;ll be notified once approved or rejected.
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((j) => (
                  <div
                    key={j._id}
                    className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">{j.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {j.department}
                        </p>
                      </div>
                      <Badge status={j.status} />
                    </div>
                    <div className="space-y-1 text-xs text-gray-500 mb-4">
                      <p>📍 {j.location}</p>
                      <p>📅 Posted: {formatDate(j.posted)}</p>
                      <p>👥 Applicants: {j.applicants || 0}</p>
                    </div>
                    <button
                      onClick={() => toggleJobStatus(j._id)}
                      className={`w-full text-xs py-1.5 rounded-lg font-medium transition ${
                        j.status === "Open"
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                    >
                      {j.status === "Open" ? "Close Position" : "Reopen Position"}
                    </button>
                  </div>
                ))}
                {jobs.length === 0 && (
                  <div className="col-span-full text-center py-16 bg-white rounded-2xl border">
                    <span className="text-4xl">💼</span>
                    <p className="text-gray-400 mt-3">No jobs posted yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── APPLICATIONS ─── */}
          {activeTab === "applications" && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">
                  All Applications ({filteredApps.length})
                </h2>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                >
                  {["All", "applied", "shortlisted", "selected", "rejected"].map(
                    (s) => (
                      <option key={s} value={s}>
                        {s === "All" ? "All" : formatStatus(s)}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                      <th className="px-5 py-3 text-left">Candidate</th>
                      <th className="px-5 py-3 text-left">Job</th>
                      <th className="px-5 py-3 text-left">Status</th>
                      <th className="px-5 py-3 text-left">Applied</th>
                      <th className="px-5 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredApps.map((a) => (
                      <tr key={a._id} className="hover:bg-gray-50">
                        <td className="px-5 py-3">
                          <div className="font-medium text-gray-800">{a.name}</div>
                          <div className="text-xs text-gray-400">{a.email}</div>
                        </td>
                        <td className="px-5 py-3 text-gray-600">{a.job}</td>
                        <td className="px-5 py-3">
                          <Badge status={a.status} />
                        </td>
                        <td className="px-5 py-3 text-xs text-gray-400">
                          {a.appliedAt
                            ? formatTimeAgo(a.appliedAt)
                            : a.createdAt
                            ? formatTimeAgo(a.createdAt)
                            : "N/A"}
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => setSelectedCandidate(a)}
                            className="text-blue-600 hover:underline text-xs font-medium"
                          >
                            View & Update
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredApps.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-5 py-12 text-center text-gray-400"
                        >
                          {applications.length === 0
                            ? "No applications received yet. Applications will appear here when students apply to your jobs."
                            : "No applications match this filter."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── SHORTLIST ─── */}
          {activeTab === "shortlist" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shortlisted.map((a) => (
                <div
                  key={a._id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">{a.name}</p>
                      <p className="text-xs text-gray-400">{a.email}</p>
                    </div>
                    <Badge status={a.status} />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Job: {a.job}</p>
                  {a.university && (
                    <p className="text-xs text-gray-400 mb-3">
                      🎓 {a.university}
                    </p>
                  )}
                  <div className="flex gap-2 mt-3">
                    {/* ✅ FIXED: Pass exact label without emoji */}
                    <button
                      onClick={() => updateStatus(a._id, "Selected")}
                      className="text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-100 font-medium"
                    >
                      ✅ Select
                    </button>
                    <button
                      onClick={() => updateStatus(a._id, "Rejected")}
                      className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 font-medium"
                    >
                      ❌ Reject
                    </button>
                    <button
                      onClick={() => setSelectedCandidate(a)}
                      className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium"
                    >
                      👁️ View
                    </button>
                  </div>
                </div>
              ))}
              {shortlisted.length === 0 && (
                <div className="col-span-full text-center py-16 bg-white rounded-2xl border">
                  <span className="text-4xl">⭐</span>
                  <p className="text-gray-400 mt-3">No shortlisted candidates</p>
                  <p className="text-gray-300 text-sm mt-1">
                    Go to Applications tab and mark candidates as Shortlisted
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ─── INTERVIEWS ─── */}
          {activeTab === "interviews" && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3 text-left">Candidate</th>
                    <th className="px-5 py-3 text-left">Job</th>
                    <th className="px-5 py-3 text-left">Date</th>
                    <th className="px-5 py-3 text-left">Mode</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {interviews.map((i) => (
                    <tr key={i._id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium">{i.candidateName}</td>
                      <td className="px-5 py-3 text-gray-500">{i.job}</td>
                      <td className="px-5 py-3 text-gray-500">
                        {i.date}
                        {i.time && ` at ${i.time}`}
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">
                          {i.mode}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <Badge status={i.status} />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          {i.status === "Scheduled" && (
                            <>
                              <button
                                onClick={() =>
                                  updateInterviewStatus(i._id, "Completed")
                                }
                                className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded font-medium"
                              >
                                ✅ Done
                              </button>
                              <button
                                onClick={() =>
                                  updateInterviewStatus(i._id, "Cancelled")
                                }
                                className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded font-medium"
                              >
                                ❌ Cancel
                              </button>
                            </>
                          )}
                          {i.link && (
                            <a
                              href={i.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-medium hover:bg-blue-100"
                            >
                              🔗 Join
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {interviews.length === 0 && (
                <div className="text-center py-16">
                  <span className="text-4xl">📅</span>
                  <p className="text-gray-400 mt-3">No interviews scheduled</p>
                  <p className="text-gray-300 text-sm mt-1">
                    Schedule interviews from shortlisted candidates
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ─── NOTIFICATIONS FULL PAGE ─── */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-semibold text-gray-800">
                    All Notifications
                  </h2>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold text-white bg-red-500 rounded-full px-2.5 py-1">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                {["all", "job_approved", "job_rejected"].map((f) => (
                  <button
                    key={f}
                    onClick={() => {}}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                      f === "all"
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {f === "all"
                      ? "All"
                      : f === "job_approved"
                      ? "✅ Approved"
                      : "❌ Rejected"}
                    {f === "all" && ` (${notifications.length})`}
                    {f === "job_approved" &&
                      ` (${notifications.filter((n) => n.type === "job_approved").length})`}
                    {f === "job_rejected" &&
                      ` (${notifications.filter((n) => n.type === "job_rejected").length})`}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="bg-white rounded-2xl border p-16 text-center">
                    <span className="text-5xl">📭</span>
                    <h3 className="text-gray-700 font-semibold mt-4">
                      No notifications
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      When admin approves or rejects your jobs, you&apos;ll see
                      updates here.
                    </p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <NotificationItem
                      key={n._id}
                      notif={n}
                      onMarkRead={markAsRead}
                      onViewDetail={setSelectedNotif}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ═══════ MODALS ═══════ */}

      {showJobModal && (
        <Modal
          title="Post New Job Opening"
          onClose={() => setShowJobModal(false)}
        >
          <div className="space-y-3">
            <div>
              <label className={labelCls}>Job Title *</label>
              <input
                className={inputCls}
                placeholder="e.g. Software Engineer"
                value={jobForm.title}
                onChange={(e) =>
                  setJobForm((p) => ({ ...p, title: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelCls}>Department *</label>
              <input
                className={inputCls}
                placeholder="e.g. Engineering"
                value={jobForm.department}
                onChange={(e) =>
                  setJobForm((p) => ({ ...p, department: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <input
                className={inputCls}
                placeholder="e.g. Remote, New York"
                value={jobForm.location}
                onChange={(e) =>
                  setJobForm((p) => ({ ...p, location: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelCls}>Employment Type</label>
              <select
                className={inputCls}
                value={jobForm.type}
                onChange={(e) =>
                  setJobForm((p) => ({ ...p, type: e.target.value }))
                }
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Job Description</label>
              <textarea
                className={`${inputCls} resize-none`}
                rows={3}
                placeholder="Describe responsibilities..."
                value={jobForm.description}
                onChange={(e) =>
                  setJobForm((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
              ⏳ Your job will be reviewed by admin before going live.
              You&apos;ll receive a notification once it&apos;s approved or
              rejected.
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={postJob} className={btnPrimary}>
                Post Job
              </button>
              <button
                onClick={() => setShowJobModal(false)}
                className={btnSecondary}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showInterviewModal && (
        <Modal
          title="Schedule Interview"
          onClose={() => setShowInterviewModal(false)}
        >
          <div className="space-y-3">
            <div>
              <label className={labelCls}>Candidate *</label>
              <select
                className={inputCls}
                value={intForm.candidateName}
                onChange={(e) =>
                  setIntForm((p) => ({
                    ...p,
                    candidateName: e.target.value,
                  }))
                }
              >
                <option value="">Select candidate</option>
                {applications.map((a) => (
                  <option key={a._id} value={a.name}>
                    {a.name} - {a.job}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Job Role</label>
              <input
                className={inputCls}
                placeholder="e.g. Frontend Developer"
                value={intForm.job}
                onChange={(e) =>
                  setIntForm((p) => ({ ...p, job: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Date *</label>
                <input
                  type="date"
                  className={inputCls}
                  value={intForm.date}
                  onChange={(e) =>
                    setIntForm((p) => ({ ...p, date: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className={labelCls}>Time</label>
                <input
                  type="time"
                  className={inputCls}
                  value={intForm.time}
                  onChange={(e) =>
                    setIntForm((p) => ({ ...p, time: e.target.value }))
                  }
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Interviewer</label>
              <input
                className={inputCls}
                placeholder="e.g. Jane Doe (HR)"
                value={intForm.interviewer}
                onChange={(e) =>
                  setIntForm((p) => ({ ...p, interviewer: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelCls}>Mode</label>
              <select
                className={inputCls}
                value={intForm.mode}
                onChange={(e) =>
                  setIntForm((p) => ({ ...p, mode: e.target.value }))
                }
              >
                <option value="Video Call">Video Call</option>
                <option value="In-Person">In-Person</option>
                <option value="Phone">Phone</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Meeting Link</label>
              <input
                className={inputCls}
                placeholder="https://meet.google.com/..."
                value={intForm.link}
                onChange={(e) =>
                  setIntForm((p) => ({ ...p, link: e.target.value }))
                }
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={scheduleInterview} className={btnPrimary}>
                Schedule
              </button>
              <button
                onClick={() => setShowInterviewModal(false)}
                className={btnSecondary}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ✅✅✅ FIXED: Candidate Detail Modal ✅✅✅ */}
      {selectedCandidate && (
        <Modal
          title="Candidate Details"
          onClose={() => setSelectedCandidate(null)}
          size="max-w-xl"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                👤
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">
                  {selectedCandidate.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedCandidate.email}
                </p>
                <div className="mt-2">
                  <Badge status={selectedCandidate.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl p-4">
              {selectedCandidate.university && (
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400">
                    University
                  </p>
                  <p className="text-sm text-gray-700">
                    {selectedCandidate.university}
                  </p>
                </div>
              )}
              {selectedCandidate.gpa && (
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400">
                    GPA
                  </p>
                  <p className="text-sm text-gray-700">
                    {selectedCandidate.gpa}
                  </p>
                </div>
              )}
              {selectedCandidate.phone && (
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400">
                    Phone
                  </p>
                  <p className="text-sm text-gray-700">
                    {selectedCandidate.phone}
                  </p>
                </div>
              )}
              {selectedCandidate.job && (
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400">
                    Applied For
                  </p>
                  <p className="text-sm text-gray-700">
                    {selectedCandidate.job}
                  </p>
                </div>
              )}
            </div>

            {selectedCandidate.skills && (
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">
                  Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.skills
                    .split(",")
                    .map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {selectedCandidate.appliedAt && (
              <p className="text-xs text-gray-400">
                Applied {formatTimeAgo(selectedCandidate.appliedAt)}
              </p>
            )}

            {/* ✅✅✅ FIXED: Buttons send clean labels without emojis ✅✅✅ */}
            <div>
              <p className="text-xs font-bold uppercase text-gray-400 mb-2">
                Update Status
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "applied", label: "Under Review", icon: "🔄" },
                  { value: "shortlisted", label: "Shortlisted", icon: "⭐" },
                  { value: "selected", label: "Selected", icon: "✅" },
                  { value: "rejected", label: "Rejected", icon: "❌" },
                ].map((s) => (
                  <button
                    key={s.value}
                    onClick={() => updateStatus(selectedCandidate._id, s.label)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${
                      selectedCandidate.status === s.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <span className="mr-1">{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {selectedNotif && (
        <Modal
          title="Notification Details"
          onClose={() => setSelectedNotif(null)}
          size="max-w-md"
        >
          <div className="space-y-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto ${
                selectedNotif.action === "approved"
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >
              {selectedNotif.action === "approved" ? "✅" : "❌"}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-800">
                {selectedNotif.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {selectedNotif.message}
              </p>
            </div>

            {selectedNotif.jobTitle && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                  Job Posting
                </p>
                <p className="font-semibold text-gray-800">
                  💼 {selectedNotif.jobTitle}
                </p>
              </div>
            )}

            {selectedNotif.action === "approved" && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-sm text-green-800">
                  🎉 Your job is now <strong>live</strong> on the placement
                  portal. Students can view and apply.
                </p>
              </div>
            )}

            {selectedNotif.action === "rejected" && selectedNotif.reason && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-red-500 mb-2">
                  Admin&apos;s Rejection Reason:
                </p>
                <p className="text-sm text-red-800 leading-relaxed italic">
                  &quot;{selectedNotif.reason}&quot;
                </p>
              </div>
            )}

            <div className="text-center text-xs text-gray-400">
              🕐 {formatTimeAgo(selectedNotif.createdAt)} &nbsp;·&nbsp; 📅{" "}
              {formatDate(selectedNotif.createdAt)}
            </div>
          </div>
        </Modal>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}