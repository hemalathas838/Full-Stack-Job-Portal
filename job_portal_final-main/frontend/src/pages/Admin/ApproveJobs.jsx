
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Link, useLocation } from "react-router-dom";
// import "./ManageStudents.css";

// const API_BASE = "http://localhost:5000/api/admin";

// const formatTimeAgo = (dateStr) => {
//   if (!dateStr) return "Unknown";
//   const now = new Date();
//   const date = new Date(dateStr);
//   const seconds = Math.floor((now - date) / 1000);
//   if (seconds < 60) return "Just now";
//   const minutes = Math.floor(seconds / 60);
//   if (minutes < 60)
//     return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
//   const hours = Math.floor(minutes / 60);
//   if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
//   const days = Math.floor(hours / 24);
//   if (days === 1) return "Yesterday";
//   if (days < 7) return `${days} days ago`;
//   return date.toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// };

// const formatDate = (dateStr) => {
//   if (!dateStr) return "N/A";
//   return new Date(dateStr).toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// };

// // ══════════════════════════════════════════
// // TOAST
// // ══════════════════════════════════════════
// function Toast({ toast, onClose }) {
//   useEffect(() => {
//     if (toast) {
//       const t = setTimeout(onClose, 3500);
//       return () => clearTimeout(t);
//     }
//   }, [toast, onClose]);
//   if (!toast) return null;
//   const cls =
//     toast.type === "success"
//       ? "toast-success"
//       : toast.type === "error"
//         ? "toast-error"
//         : "toast-info";
//   return (
//     <div className={`toast-container ${cls}`}>
//       <span className="toast-icon">{toast.type === "success" ? "✓" : "✕"}</span>
//       <span className="toast-msg">{toast.message}</span>
//       <button className="toast-close" onClick={onClose}>
//         ✕
//       </button>
//     </div>
//   );
// }

// // ══════════════════════════════════════════
// // REJECT MODAL
// // ══════════════════════════════════════════
// function RejectModal({ job, onClose, onConfirm, loading }) {
//   const [reason, setReason] = useState("");
//   const [selectedReason, setSelectedReason] = useState("");
//   const presetReasons = [
//     "Job description is incomplete or unclear",
//     "Salary/compensation details are missing",
//     "Company verification required",
//     "Duplicate job posting detected",
//     "Job requirements are unrealistic",
//     "Contains inappropriate or misleading content",
//     "Other (specify below)",
//   ];
//   const handleSubmit = () => {
//     const finalReason =
//       selectedReason === "Other (specify below)" ? reason : selectedReason;
//     if (!finalReason.trim()) return;
//     onConfirm(job._id, job.title, finalReason);
//   };
//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
//         <div className="modal-header modal-header-danger">
//           <h2>⚠ Reject Job Posting</h2>
//           <button className="modal-close" onClick={onClose}>
//             ✕
//           </button>
//         </div>
//         <div className="modal-body">
//           <div
//             style={{
//               background: "#f8fafc",
//               borderRadius: "10px",
//               padding: "14px 16px",
//               marginBottom: "18px",
//               display: "flex",
//               alignItems: "center",
//               gap: "12px",
//             }}
//           >
//             <div
//               style={{
//                 width: "40px",
//                 height: "40px",
//                 borderRadius: "8px",
//                 background: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
//                 color: "#4f46e5",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "16px",
//                 fontWeight: 700,
//                 flexShrink: 0,
//               }}
//             >
//               {(job.company?.companyName || "U")[0]?.toUpperCase()}
//             </div>
//             <div style={{ flex: 1, minWidth: 0 }}>
//               <p
//                 style={{
//                   fontSize: "14px",
//                   fontWeight: 600,
//                   color: "#0f172a",
//                   margin: 0,
//                 }}
//               >
//                 {job.title}
//               </p>
//               <p
//                 style={{
//                   fontSize: "12px",
//                   color: "#94a3b8",
//                   margin: "2px 0 0 0",
//                 }}
//               >
//                 {job.company?.companyName || "Unknown Company"}
//               </p>
//             </div>
//           </div>
//           <label
//             style={{
//               display: "block",
//               fontSize: "12px",
//               fontWeight: 600,
//               color: "#475569",
//               marginBottom: "10px",
//             }}
//           >
//             Select a rejection reason *
//           </label>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               gap: "6px",
//               marginBottom: "4px",
//             }}
//           >
//             {presetReasons.map((r) => (
//               <label
//                 key={r}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "10px",
//                   padding: "10px 12px",
//                   borderRadius: "8px",
//                   cursor: "pointer",
//                   fontSize: "13px",
//                   color: selectedReason === r ? "#0f172a" : "#64748b",
//                   background: selectedReason === r ? "#f0f4ff" : "transparent",
//                   border:
//                     selectedReason === r
//                       ? "1px solid #c7d2fe"
//                       : "1px solid transparent",
//                   transition: "all 0.15s",
//                 }}
//               >
//                 <input
//                   type="radio"
//                   name="rjReason"
//                   value={r}
//                   checked={selectedReason === r}
//                   onChange={() => setSelectedReason(r)}
//                   style={{ accentColor: "#dc2626" }}
//                 />
//                 {r}
//               </label>
//             ))}
//           </div>
//           {selectedReason === "Other (specify below)" && (
//             <textarea
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//               placeholder="Describe the issue with this job posting..."
//               rows={3}
//               className="form-textarea"
//               style={{
//                 width: "100%",
//                 marginTop: "10px",
//                 padding: "10px 14px",
//                 borderRadius: "8px",
//                 border: "1px solid #e2e8f0",
//                 fontSize: "13px",
//                 resize: "none",
//                 outline: "none",
//                 fontFamily: "inherit",
//               }}
//             />
//           )}
//         </div>
//         <div className="modal-footer">
//           <button
//             className="btn btn-danger"
//             onClick={handleSubmit}
//             disabled={
//               loading ||
//               !selectedReason ||
//               (selectedReason === "Other (specify below)" && !reason.trim())
//             }
//           >
//             {loading ? (
//               <>
//                 <span
//                   style={{
//                     width: "14px",
//                     height: "14px",
//                     border: "2px solid rgba(255,255,255,0.3)",
//                     borderTopColor: "#fff",
//                     borderRadius: "50%",
//                     display: "inline-block",
//                     animation: "ajSpin 0.6s linear infinite",
//                   }}
//                 />{" "}
//                 Rejecting...
//               </>
//             ) : (
//               "❌ Reject & Notify"
//             )}
//           </button>
//           <button className="btn btn-ghost" onClick={onClose}>
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════
// // SUCCESS MODAL
// // ══════════════════════════════════════════
// function SuccessModal({ job, action, onClose }) {
//   const ok = action === "approved";
//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div
//         className="modal modal-sm"
//         onClick={(e) => e.stopPropagation()}
//         style={{ textAlign: "center" }}
//       >
//         <div
//           className="modal-header"
//           style={{ border: "none", paddingBottom: 0 }}
//         >
//           <button className="modal-close" onClick={onClose}>
//             ✕
//           </button>
//         </div>
//         <div className="modal-body" style={{ paddingTop: 0 }}>
//           <div
//             style={{
//               width: "64px",
//               height: "64px",
//               borderRadius: "50%",
//               background: ok
//                 ? "linear-gradient(135deg,#ecfdf5,#d1fae5)"
//                 : "linear-gradient(135deg,#fef2f2,#fee2e2)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: "28px",
//               margin: "0 auto 18px",
//             }}
//           >
//             {ok ? "✓" : "✕"}
//           </div>
//           <h2
//             style={{
//               fontSize: "18px",
//               fontWeight: 700,
//               color: "#0f172a",
//               margin: "0 0 6px 0",
//             }}
//           >
//             Job {ok ? "Approved" : "Rejected"}
//           </h2>
//           <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px" }}>
//             "{job.title}" — {job.company?.companyName || "Unknown"}
//           </p>
//           <div
//             style={{
//               display: "inline-flex",
//               alignItems: "center",
//               gap: "6px",
//               background: "#f0f9ff",
//               padding: "8px 16px",
//               borderRadius: "8px",
//               fontSize: "12px",
//               color: "#0369a1",
//             }}
//           >
//             <span>✉</span> Company has been notified via email
//           </div>
//         </div>
//         <div className="modal-footer" style={{ borderTop: "none" }}>
//           <button
//             className="btn btn-primary"
//             onClick={onClose}
//             style={{ width: "100%" }}
//           >
//             Done
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════
// // JOB CARD
// // ══════════════════════════════════════════
// function JobCard({ job, onApprove, onReject, loadingState }) {
//   const isLoading =
//     loadingState === "approving" || loadingState === "rejecting";
//   const company = job.company?.companyName || "Unknown Company";
//   const email = job.company?.email || job.postedBy?.email || "";
//   const department = job.department || "";
//   const location = job.location || "";
//   const salary = job.salary || job.package || "";
//   const type = job.type || job.employmentType || "";
//   const description = job.description || "";
//   const skills = job.skills || job.requirements || "";
//   const deadline = job.deadline || job.lastDate || "";

//   const [expanded, setExpanded] = useState(false);

//   return (
//     <div
//       className="aj-job-card"
//       style={{
//         opacity: isLoading ? 0.5 : 1,
//         pointerEvents: isLoading ? "none" : "auto",
//       }}
//     >
//       {/* Top accent line */}
//       <div className="aj-card-accent" />

//       <div style={{ padding: "22px 24px 18px" }}>
//         {/* Row 1: Avatar + Info + Badge */}
//         <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
//           <div className="aj-card-avatar">{company[0]?.toUpperCase()}</div>

//           <div style={{ flex: 1, minWidth: 0 }}>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "flex-start",
//                 justifyContent: "space-between",
//                 gap: "12px",
//               }}
//             >
//               <div style={{ minWidth: 0 }}>
//                 <h3 className="aj-card-title">{job.title}</h3>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "6px",
//                     flexWrap: "wrap",
//                   }}
//                 >
//                   <span className="aj-card-company">{company}</span>
//                   {email && <span className="aj-card-email">✉ {email}</span>}
//                 </div>
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "flex-end",
//                   gap: "6px",
//                   flexShrink: 0,
//                 }}
//               >
//                 <span className="aj-card-time">
//                   {formatTimeAgo(job.postedAt || job.createdAt)}
//                 </span>
//                 <span className="aj-badge-pending">⏳ Pending Review</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Row 2: Meta pills */}
//         <div className="aj-meta-pills">
//           {department && <MetaPill icon="🏢" text={department} />}
//           {location && <MetaPill icon="📍" text={location} />}
//           {type && <MetaPill icon="🕐" text={type} />}
//           {salary && <MetaPill icon="💰" text={salary} highlight />}
//           {deadline && (
//             <MetaPill
//               icon="📅"
//               text={`Apply by ${formatDate(deadline)}`}
//               warning
//             />
//           )}
//         </div>

//         {/* Row 3: Description preview */}
//         {description && (
//           <div className="aj-desc-wrap">
//             <p
//               className="aj-desc-text"
//               style={{
//                 display: expanded ? "block" : "-webkit-box",
//                 WebkitLineClamp: expanded ? "unset" : 2,
//                 WebkitBoxOrient: "vertical",
//                 overflow: expanded ? "visible" : "hidden",
//               }}
//             >
//               {description}
//             </p>
//             {description.length > 120 && (
//               <button
//                 className="aj-read-more"
//                 onClick={() => setExpanded(!expanded)}
//               >
//                 {expanded ? "Show less" : "Read more"}
//               </button>
//             )}
//           </div>
//         )}

//         {/* Row 4: Skills tags */}
//         {skills && (
//           <div className="aj-skills-wrap">
//             {(typeof skills === "string"
//               ? skills.split(",").map((s) => s.trim())
//               : skills
//             )
//               .filter(Boolean)
//               .slice(0, 6)
//               .map((skill, i) => (
//                 <span key={i} className="aj-skill-tag">
//                   {skill}
//                 </span>
//               ))}
//             {(typeof skills === "string"
//               ? skills.split(",").length
//               : skills.length) > 6 && (
//               <span className="aj-skills-more">
//                 +
//                 {(typeof skills === "string"
//                   ? skills.split(",").length
//                   : skills.length) - 6}{" "}
//                 more
//               </span>
//             )}
//           </div>
//         )}

//         {/* Notification preview */}
//         <div className="aj-notify-box">
//           <span style={{ fontSize: "12px" }}>📧</span>
//           <span className="aj-notify-text">
//             <strong>Auto-notify:</strong>{" "}
//             {email
//               ? `Approval/rejection email will be sent to ${email}`
//               : "No company email on file for notifications"}
//           </span>
//         </div>
//       </div>

//       {/* Footer actions */}
//       <div className="aj-card-footer">
//         <span className="aj-footer-date">
//           Posted {formatDate(job.postedAt || job.createdAt)}
//         </span>
//         <div className="aj-card-actions">
//           {loadingState === "approving" ? (
//             <LoadingBtn text="Approving..." green />
//           ) : loadingState === "rejecting" ? (
//             <LoadingBtn text="Rejecting..." />
//           ) : (
//             <>
//               <button
//                 className="aj-btn-approve"
//                 onClick={() => onApprove(job._id)}
//               >
//                 <svg
//                   width="14"
//                   height="14"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2.5"
//                 >
//                   <polyline points="20 6 9 17 4 12" />
//                 </svg>
//                 Approve
//               </button>
//               <button className="aj-btn-reject" onClick={() => onReject(job)}>
//                 <svg
//                   width="14"
//                   height="14"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <line x1="18" y1="6" x2="6" y2="18" />
//                   <line x1="6" y1="6" x2="18" y2="18" />
//                 </svg>
//                 Reject
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function MetaPill({ icon, text, highlight, warning }) {
//   let cls = "aj-meta-pill";
//   if (highlight) cls += " aj-meta-pill-green";
//   if (warning) cls += " aj-meta-pill-amber";
//   return (
//     <span className={cls}>
//       <span>{icon}</span> {text}
//     </span>
//   );
// }

// function LoadingBtn({ text, green }) {
//   return (
//     <button
//       className={green ? "aj-btn-loading-green" : "aj-btn-loading"}
//       disabled
//     >
//       <span className="aj-spinner-sm" />
//       {text}
//     </button>
//   );
// }

// // ══════════════════════════════════════════
// // MAIN COMPONENT
// // ══════════════════════════════════════════
// export default function ApproveJobs() {
//   const location = useLocation();
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [refreshing, setRefreshing] = useState(false);
//   const [actionLoading, setActionLoading] = useState({});
//   const [toast, setToast] = useState(null);
//   const [rejectModal, setRejectModal] = useState(null);
//   const [successModal, setSuccessModal] = useState(null);
//   const [stats, setStats] = useState({
//     pending: 0,
//     approvedToday: 0,
//     rejectedToday: 0,
//     totalReviewed: 0,
//   });

//   const getToken = () => localStorage.getItem("adminToken");

//   const fetchJobs = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/pending-jobs`, {
//         headers: { Authorization: `Bearer ${getToken()}` },
//       });
//       setJobs(Array.isArray(res.data) ? res.data : []);
//       setStats((prev) => ({
//         ...prev,
//         pending: Array.isArray(res.data) ? res.data.length : 0,
//       }));
//       setError("");
//     } catch (err) {
//       setError("Failed to fetch jobs");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchJobs();
//   }, []);
//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchJobs();
//   };
//   const showToast = (message, type = "success") => {
//     setToast({ message, type });
//   };

//   const handleApprove = async (id) => {
//     setActionLoading((prev) => ({ ...prev, [id]: "approving" }));
//     try {
//       await axios({
//         method: "POST",
//         url: `${API_BASE}/approve/${id}`,
//         headers: { Authorization: `Bearer ${getToken()}` },
//         data: {},
//       });
//       // try {
//       //   await axios({
//       //     method: "POST",
//       //     url: `${API_BASE}/notify-approval/${id}`,
//       //     headers: { Authorization: `Bearer ${getToken()}` },
//       //     data: { action: "approved" },
//       //   });
//       // } catch (e) {
//       //   console.warn("Notify fail:", e);
//       // }
//       try {
//   const notifyRes = await axios({
//     method: "POST",
//     url: `${API_BASE}/notify-approval/${id}`,
//     headers: { Authorization: `Bearer ${getToken()}` },
//     data: { action: "approved" }
//   });
//   console.log("✅ Notify OK:", notifyRes.data);
// } catch (e) {
//   console.error("❌ Notify FAIL:", e.response?.data || e.message);
// }
//       const approvedJob = jobs.find((j) => j._id === id);
//       setJobs((prev) => prev.filter((j) => j._id !== id));
//       setStats((prev) => ({
//         ...prev,
//         pending: prev.pending - 1,
//         approvedToday: prev.approvedToday + 1,
//         totalReviewed: prev.totalReviewed + 1,
//       }));
//       setSuccessModal({ job: approvedJob, action: "approved" });
//     } catch (err) {
//       showToast(err.response?.data?.message || err.message, "error");
//     } finally {
//       setActionLoading((prev) => ({ ...prev, [id]: null }));
//     }
//   };

//   const handleReject = async (id, jobTitle, reason) => {
//     setActionLoading((prev) => ({ ...prev, [id]: "rejecting" }));
//     try {
//       await axios({
//         method: "POST",
//         url: `${API_BASE}/reject/${id}`,
//         headers: { Authorization: `Bearer ${getToken()}` },
//         data: { reason },
//       });
//       // try {
//       //   await axios({
//       //     method: "POST",
//       //     url: `${API_BASE}/notify-approval/${id}`,
//       //     headers: { Authorization: `Bearer ${getToken()}` },
//       //     data: { action: "rejected", reason },
//       //   });
//       // } catch (e) {
//       //   console.warn("Notify fail:", e);
//       // }

//       try {
//   const notifyRes = await axios({
//     method: "POST",
//     url: `${API_BASE}/notify-approval/${id}`,
//     headers: { Authorization: `Bearer ${getToken()}` },
//     data: { action: "rejected", reason }
//   });
//   console.log("✅ Notify OK:", notifyRes.data);
// } catch (e) {
//   console.error("❌ Notify FAIL:", e.response?.data || e.message);
// }
//       const rejectedJob = jobs.find((j) => j._id === id);
//       setJobs((prev) => prev.filter((j) => j._id !== id));
//       setStats((prev) => ({
//         ...prev,
//         pending: prev.pending - 1,
//         rejectedToday: prev.rejectedToday + 1,
//         totalReviewed: prev.totalReviewed + 1,
//       }));
//       setRejectModal(null);
//       setSuccessModal({ job: rejectedJob, action: "rejected" });
//     } catch (err) {
//       showToast(err.response?.data?.message || err.message, "error");
//       setActionLoading((prev) => ({ ...prev, [id]: null }));
//     }
//   };

//   const statItems = [
//     {
//       label: "Pending Review",
//       value: stats.pending,
//       icon: "⏳",
//       bg: "#fffbeb",
//       border: "#fde68a",
//       iconBg: "#fef3c7",
//     },
//     {
//       label: "Approved Today",
//       value: stats.approvedToday,
//       icon: "✓",
//       bg: "#ecfdf5",
//       border: "#a7f3d0",
//       iconBg: "#d1fae5",
//     },
//     {
//       label: "Rejected Today",
//       value: stats.rejectedToday,
//       icon: "✕",
//       bg: "#fef2f2",
//       border: "#fecaca",
//       iconBg: "#fee2e2",
//     },
//     {
//       label: "Total Reviewed",
//       value: stats.totalReviewed,
//       icon: "📊",
//       bg: "#eff6ff",
//       border: "#bfdbfe",
//       iconBg: "#dbeafe",
//     },
//   ];

//   return (
//     <div className="dashboard-container">
//       <Toast toast={toast} onClose={() => setToast(null)} />

//       {/* ═══════ SIDEBAR — matching ManageStudents ═══════ */}
//       <aside className="sidebar">
//         <h2>🎓 Admin</h2>
//         <ul>
//           <li>
//             <Link to="/admin/dashboard">📊 Dashboard</Link>
//           </li>
//           <li>
//             <Link to="/students">👨‍🎓 Students</Link>
//           </li>
//           <li>
//             <Link to="/recruiters">🏢 Recruiters</Link>
//           </li>
//           <li className="active">📄 Approve Jobs</li>
//           <li>
//             <Link to="/admin/applications">📬 Applications</Link>
//           </li>
//           <li>
//             <Link to="/admin/results">✅ Results</Link>
//           </li>
//           <li>
//             <Link to="/admin/reports">📈 Reports</Link>
//           </li>
//         </ul>
//       </aside>

//       {/* ═══════ MAIN CONTENT ═══════ */}
//       <main className="main-content aj-main-content">
//         <header className="top-nav aj-top-nav">
//           <div>
//             <h1>
//               <b>📄 Job Approval Queue</b>
//             </h1>
//             <p className="aj-subtitle">
//               Review and moderate company job postings before they go live
//             </p>
//           </div>
//           <div className="aj-top-actions">
//             {jobs.length > 0 && (
//               <span className="aj-pending-badge">{jobs.length} pending</span>
//             )}
//             <button
//               className="aj-refresh-btn"
//               onClick={handleRefresh}
//               disabled={refreshing}
//             >
//               <svg
//                 width="14"
//                 height="14"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 style={
//                   refreshing ? { animation: "ajSpin 0.8s linear infinite" } : {}
//                 }
//               >
//                 <polyline points="23 4 23 10 17 10" />
//                 <polyline points="1 20 1 14 7 14" />
//                 <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
//               </svg>
//               Refresh
//             </button>
//           </div>
//         </header>

//         <div className="aj-content-area">
//           {/* Stats */}
//           <div className="aj-stats-grid">
//             {statItems.map((s) => (
//               <div
//                 key={s.label}
//                 className="aj-stat-card"
//                 style={{ background: s.bg, borderColor: s.border }}
//               >
//                 <div className="aj-stat-icon" style={{ background: s.iconBg }}>
//                   {s.icon}
//                 </div>
//                 <div className="aj-stat-info">
//                   <div className="aj-stat-value">{s.value}</div>
//                   <div className="aj-stat-label">{s.label}</div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Guidelines banner */}
//           <div className="aj-guidelines">
//             <span className="aj-guidelines-icon">ℹ</span>
//             <div>
//               <strong className="aj-guidelines-title">
//                 Moderation Guidelines
//               </strong>
//               <p className="aj-guidelines-text">
//                 Verify company details, check job description quality, ensure
//                 salary info is present. Companies receive automatic email
//                 notifications on approval or rejection with your reason.
//               </p>
//             </div>
//           </div>

//           {/* Error */}
//           {error && !loading && (
//             <div className="ms-error">
//               <span>⚠️ {error}</span>
//               <button onClick={handleRefresh}>Retry</button>
//             </div>
//           )}

//           {/* Loading skeleton */}
//           {loading && !error && (
//             <div className="aj-loading-skeleton">
//               {[1, 2, 3].map((i) => (
//                 <div
//                   key={i}
//                   className="aj-skeleton-card"
//                   style={{
//                     animation: `ajPulse 1.5s ease-in-out infinite ${i * 0.2}s`,
//                   }}
//                 >
//                   <div className="aj-skeleton-accent" />
//                   <div style={{ padding: "24px" }}>
//                     <div
//                       style={{
//                         display: "flex",
//                         gap: "14px",
//                         marginBottom: "16px",
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: "48px",
//                           height: "48px",
//                           borderRadius: "12px",
//                           background: "#f1f5f9",
//                         }}
//                       />
//                       <div style={{ flex: 1 }}>
//                         <div
//                           className="aj-skeleton-line"
//                           style={{ width: "40%", marginBottom: "8px" }}
//                         />
//                         <div
//                           className="aj-skeleton-line"
//                           style={{ width: "25%" }}
//                         />
//                       </div>
//                     </div>
//                     <div
//                       style={{
//                         display: "flex",
//                         gap: "6px",
//                         marginBottom: "14px",
//                       }}
//                     >
//                       {[1, 2, 3].map((j) => (
//                         <div
//                           key={j}
//                           style={{
//                             height: "28px",
//                             width: "90px",
//                             background: "#f1f5f9",
//                             borderRadius: "6px",
//                           }}
//                         />
//                       ))}
//                     </div>
//                     <div
//                       className="aj-skeleton-line"
//                       style={{ width: "100%", marginBottom: "6px" }}
//                     />
//                     <div
//                       className="aj-skeleton-line"
//                       style={{ width: "60%" }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Empty state */}
//           {!loading && !error && jobs.length === 0 && (
//             <div className="aj-empty-state">
//               <div className="aj-empty-icon">✓</div>
//               <h2 className="aj-empty-title">All caught up</h2>
//               <p className="aj-empty-text">
//                 No job postings are waiting for your review.
//               </p>
//               <button
//                 className="aj-empty-btn"
//                 onClick={handleRefresh}
//                 disabled={refreshing}
//               >
//                 {refreshing ? <span className="aj-spinner-sm" /> : "↻"}
//                 Check for new jobs
//               </button>
//             </div>
//           )}

//           {/* Job list */}
//           {!loading && !error && jobs.length > 0 && (
//             <div className="aj-job-list">
//               {jobs.map((job) => (
//                 <JobCard
//                   key={job._id}
//                   job={job}
//                   onApprove={handleApprove}
//                   onReject={setRejectModal}
//                   loadingState={actionLoading[job._id]}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </main>

//       {/* Modals */}
//       {rejectModal && (
//         <RejectModal
//           job={rejectModal}
//           onClose={() => setRejectModal(null)}
//           onConfirm={handleReject}
//           loading={actionLoading[rejectModal._id] === "rejecting"}
//         />
//       )}
//       {successModal && (
//         <SuccessModal
//           job={successModal.job}
//           action={successModal.action}
//           onClose={() => setSuccessModal(null)}
//         />
//       )}

//       <style>{`
//         @keyframes ajSpin { to { transform: rotate(360deg); } }
//         @keyframes ajPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

//         /* ── Main content override for this page ── */
//         .aj-main-content {
//           display: flex !important;
//           flex-direction: column;
//           overflow: hidden;
//         }
//         .aj-top-nav {
//           flex-wrap: wrap;
//           gap: 12px;
//         }
//         .aj-subtitle {
//           font-size: 12px;
//           color: #94a3b8;
//           margin: 3px 0 0 0;
//         }
//         .aj-top-actions {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//         }
//         .aj-pending-badge {
//           font-size: 12px;
//           font-weight: 600;
//           color: #92400e;
//           background: #fef3c7;
//           padding: 6px 14px;
//           border-radius: 100px;
//           border: 1px solid #fde68a;
//         }
//         .aj-refresh-btn {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           padding: 8px 16px;
//           border-radius: 8px;
//           font-size: 13px;
//           font-weight: 500;
//           color: #475569;
//           background: #f1f5f9;
//           border: 1px solid #e2e8f0;
//           cursor: pointer;
//         }
//         .aj-refresh-btn:disabled {
//           opacity: 0.5;
//           cursor: wait;
//         }
//         .aj-content-area {
//           flex: 1;
//           overflow-y: auto;
//           padding: 28px 32px;
//         }

//         /* ── Stats grid ── */
//         .aj-stats-grid {
//           display: grid;
//           grid-template-columns: repeat(4, 1fr);
//           gap: 14px;
//           margin-bottom: 24px;
//         }
//         .aj-stat-card {
//           padding: 16px 18px;
//           border-radius: 12px;
//           border: 1px solid;
//           display: flex;
//           align-items: center;
//           gap: 14px;
//         }
//         .aj-stat-icon {
//           width: 42px;
//           height: 42px;
//           border-radius: 10px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 18px;
//           flex-shrink: 0;
//         }
//         .aj-stat-value {
//           font-size: 22px;
//           font-weight: 700;
//           color: #0f172a;
//           line-height: 1.2;
//         }
//         .aj-stat-label {
//           font-size: 11px;
//           color: #94a3b8;
//           margin-top: 2px;
//         }

//         /* ── Guidelines ── */
//         .aj-guidelines {
//           display: flex;
//           align-items: flex-start;
//           gap: 12px;
//           padding: 14px 18px;
//           border-radius: 10px;
//           background: #f0f9ff;
//           border: 1px solid #bae6fd;
//           margin-bottom: 24px;
//         }
//         .aj-guidelines-icon {
//           font-size: 15px;
//           color: #0284c7;
//           flex-shrink: 0;
//           margin-top: 1px;
//         }
//         .aj-guidelines-title {
//           font-size: 12px;
//           color: #0369a1;
//           display: block;
//           margin-bottom: 2px;
//         }
//         .aj-guidelines-text {
//           font-size: 11px;
//           color: #0284c7;
//           margin: 0;
//           line-height: 1.5;
//         }

//         /* ── Loading skeleton ── */
//         .aj-loading-skeleton {
//           display: flex;
//           flex-direction: column;
//           gap: 16px;
//         }
//         .aj-skeleton-card {
//           background: #fff;
//           border-radius: 14px;
//           border: 1px solid #e8ecf1;
//           overflow: hidden;
//         }
//         .aj-skeleton-accent {
//           height: 3px;
//           background: linear-gradient(90deg, #f59e0b, #f97316);
//         }
//         .aj-skeleton-line {
//           height: 12px;
//           background: #f1f5f9;
//           border-radius: 4px;
//         }

//         /* ── Empty state ── */
//         .aj-empty-state {
//           background: #fff;
//           border-radius: 14px;
//           border: 1px solid #e8ecf1;
//           padding: 60px 24px;
//           text-align: center;
//         }
//         .aj-empty-icon {
//           width: 72px;
//           height: 72px;
//           border-radius: 50%;
//           background: linear-gradient(135deg, #ecfdf5, #d1fae5);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin: 0 auto 20px;
//           font-size: 30px;
//         }
//         .aj-empty-title {
//           font-size: 20px;
//           font-weight: 700;
//           color: #0f172a;
//           margin: 0 0 6px 0;
//         }
//         .aj-empty-text {
//           font-size: 13px;
//           color: #94a3b8;
//           margin: 0 0 20px 0;
//         }
//         .aj-empty-btn {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           padding: 10px 24px;
//           border-radius: 8px;
//           font-size: 13px;
//           font-weight: 600;
//           color: #fff;
//           background: #0f172a;
//           border: none;
//           cursor: pointer;
//         }
//         .aj-empty-btn:disabled {
//           opacity: 0.5;
//           cursor: wait;
//         }

//         /* ── Job list ── */
//         .aj-job-list {
//           display: flex;
//           flex-direction: column;
//           gap: 16px;
//         }

//         /* ── Job card ── */
//         .aj-job-card {
//           background: #fff;
//           border-radius: 14px;
//           border: 1px solid #e8ecf1;
//           overflow: hidden;
//           transition: all 0.2s;
//         }
//         .aj-card-accent {
//           height: 3px;
//           background: linear-gradient(90deg, #f59e0b, #f97316);
//         }
//         .aj-card-avatar {
//           width: 48px;
//           height: 48px;
//           border-radius: 12px;
//           flex-shrink: 0;
//           background: linear-gradient(135deg, #eef2ff, #e0e7ff);
//           color: #4f46e5;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 18px;
//           font-weight: 700;
//           box-shadow: 0 2px 8px rgba(79,70,229,0.15);
//         }
//         .aj-card-title {
//           font-size: 16px;
//           font-weight: 700;
//           color: #0f172a;
//           margin: 0 0 3px 0;
//           line-height: 1.3;
//         }
//         .aj-card-company {
//           font-size: 13px;
//           color: #64748b;
//         }
//         .aj-card-email {
//           font-size: 11px;
//           color: #94a3b8;
//           background: #f8fafc;
//           padding: 1px 8px;
//           border-radius: 4px;
//         }
//         .aj-card-time {
//           font-size: 11px;
//           color: #94a3b8;
//           white-space: nowrap;
//         }
//         .aj-badge-pending {
//           font-size: 10px;
//           font-weight: 600;
//           color: #92400e;
//           background: #fef3c7;
//           padding: 3px 10px;
//           border-radius: 100px;
//           border: 1px solid #fde68a;
//           white-space: nowrap;
//         }

//         /* ── Meta pills ── */
//         .aj-meta-pills {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 6px;
//           margin-top: 16px;
//         }
//         .aj-meta-pill {
//           font-size: 11px;
//           font-weight: 500;
//           display: inline-flex;
//           align-items: center;
//           gap: 4px;
//           padding: 4px 10px;
//           border-radius: 6px;
//           color: #475569;
//           background: #f1f5f9;
//         }
//         .aj-meta-pill-green {
//           color: #065f46;
//           background: #ecfdf5;
//           border: 1px solid #a7f3d0;
//         }
//         .aj-meta-pill-amber {
//           color: #92400e;
//           background: #fffbeb;
//           border: 1px solid #fde68a;
//         }

//         /* ── Description ── */
//         .aj-desc-wrap {
//           margin-top: 14px;
//         }
//         .aj-desc-text {
//           font-size: 13px;
//           color: #64748b;
//           line-height: 1.65;
//           margin: 0;
//         }
//         .aj-read-more {
//           background: none;
//           border: none;
//           color: #3b82f6;
//           font-size: 12px;
//           font-weight: 500;
//           cursor: pointer;
//           padding: 4px 0 0 0;
//         }

//         /* ── Skills ── */
//         .aj-skills-wrap {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 5px;
//           margin-top: 12px;
//         }
//         .aj-skill-tag {
//           font-size: 11px;
//           color: #6366f1;
//           background: #eef2ff;
//           padding: 3px 10px;
//           border-radius: 100px;
//           border: 1px solid #e0e7ff;
//           font-weight: 500;
//         }
//         .aj-skills-more {
//           font-size: 11px;
//           color: #94a3b8;
//           padding: 3px 8px;
//         }

//         /* ── Notify box ── */
//         .aj-notify-box {
//           margin-top: 14px;
//           padding: 10px 14px;
//           background: #f0fdf4;
//           border-radius: 8px;
//           border: 1px solid #bbf7d0;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }
//         .aj-notify-text {
//           font-size: 11px;
//           color: #166534;
//           line-height: 1.4;
//         }

//         /* ── Card footer ── */
//         .aj-card-footer {
//           padding: 14px 24px;
//           background: #fafbfc;
//           border-top: 1px solid #f1f5f9;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//         }
//         .aj-footer-date {
//           font-size: 11px;
//           color: #b0b8c4;
//         }
//         .aj-card-actions {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }
//         .aj-btn-approve {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           padding: 9px 22px;
//           border-radius: 8px;
//           font-size: 13px;
//           font-weight: 600;
//           color: #fff;
//           background: linear-gradient(135deg, #059669, #10b981);
//           border: none;
//           cursor: pointer;
//           box-shadow: 0 2px 8px rgba(16,185,129,0.3);
//           transition: all 0.15s;
//         }
//         .aj-btn-approve:hover {
//           box-shadow: 0 4px 14px rgba(16,185,129,0.4);
//           transform: translateY(-1px);
//         }
//         .aj-btn-reject {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           padding: 9px 22px;
//           border-radius: 8px;
//           font-size: 13px;
//           font-weight: 500;
//           color: #64748b;
//           background: #fff;
//           border: 1px solid #e2e8f0;
//           cursor: pointer;
//           transition: all 0.15s;
//         }
//         .aj-btn-reject:hover {
//           border-color: #fca5a5;
//           color: #dc2626;
//           background: #fef2f2;
//         }
//         .aj-btn-loading,
//         .aj-btn-loading-green {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           padding: 9px 22px;
//           border-radius: 8px;
//           font-size: 13px;
//           font-weight: 500;
//           cursor: wait;
//           opacity: 0.7;
//         }
//         .aj-btn-loading {
//           color: #64748b;
//           background: #fff;
//           border: 1px solid #e2e8f0;
//         }
//         .aj-btn-loading-green {
//           color: #fff;
//           background: #10b981;
//           border: none;
//         }
//         .aj-spinner-sm {
//           width: 14px;
//           height: 14px;
//           border: 2px solid rgba(255,255,255,0.3);
//           border-top-color: #fff;
//           border-radius: 50%;
//           display: inline-block;
//           animation: ajSpin 0.6s linear infinite;
//         }
//         .aj-btn-loading .aj-spinner-sm {
//           border-color: #e2e8f0;
//           border-top-color: #64748b;
//         }

//         /* ── Responsive ── */
//         @media (max-width: 900px) {
//           .aj-content-area {
//             padding: 20px 16px !important;
//           }
//           .aj-stats-grid {
//             grid-template-columns: repeat(2, 1fr) !important;
//           }
//         }
//         @media (max-width: 600px) {
//           .aj-stats-grid {
//             grid-template-columns: 1fr !important;
//           }
//           .aj-card-footer {
//             flex-direction: column;
//             gap: 10px;
//             align-items: flex-start;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "./ManageStudents.css";

const API_BASE = "http://localhost:5000/api/admin";

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "Unknown";
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// ══════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const t = setTimeout(onClose, 3500);
      return () => clearTimeout(t);
    }
  }, [toast, onClose]);
  if (!toast) return null;
  const cls =
    toast.type === "success"
      ? "toast-success"
      : toast.type === "error"
        ? "toast-error"
        : "toast-info";
  return (
    <div className={`toast-container ${cls}`}>
      <span className="toast-icon">{toast.type === "success" ? "✓" : "✕"}</span>
      <span className="toast-msg">{toast.message}</span>
      <button className="toast-close" onClick={onClose}>
        ✕
      </button>
    </div>
  );
}

// ══════════════════════════════════════════
// REJECT MODAL
// ══════════════════════════════════════════
function RejectModal({ job, onClose, onConfirm, loading }) {
  const [reason, setReason] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const presetReasons = [
    "Job description is incomplete or unclear",
    "Salary/compensation details are missing",
    "Company verification required",
    "Duplicate job posting detected",
    "Job requirements are unrealistic",
    "Contains inappropriate or misleading content",
    "Other (specify below)",
  ];
  const handleSubmit = () => {
    const finalReason =
      selectedReason === "Other (specify below)" ? reason : selectedReason;
    if (!finalReason.trim()) return;
    onConfirm(job._id, job.title, finalReason);
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header modal-header-danger">
          <h2>⚠ Reject Job Posting</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div
            style={{
              background: "#f8fafc",
              borderRadius: "10px",
              padding: "14px 16px",
              marginBottom: "18px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
                color: "#4f46e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {(job.company?.companyName || "U")[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                {job.title}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  margin: "2px 0 0 0",
                }}
              >
                {job.company?.companyName || "Unknown Company"}
              </p>
            </div>
          </div>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#475569",
              marginBottom: "10px",
            }}
          >
            Select a rejection reason *
          </label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              marginBottom: "4px",
            }}
          >
            {presetReasons.map((r) => (
              <label
                key={r}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: selectedReason === r ? "#0f172a" : "#64748b",
                  background: selectedReason === r ? "#f0f4ff" : "transparent",
                  border:
                    selectedReason === r
                      ? "1px solid #c7d2fe"
                      : "1px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <input
                  type="radio"
                  name="rjReason"
                  value={r}
                  checked={selectedReason === r}
                  onChange={() => setSelectedReason(r)}
                  style={{ accentColor: "#dc2626" }}
                />
                {r}
              </label>
            ))}
          </div>
          {selectedReason === "Other (specify below)" && (
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe the issue with this job posting..."
              rows={3}
              className="form-textarea"
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "13px",
                resize: "none",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          )}
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-danger"
            onClick={handleSubmit}
            disabled={
              loading ||
              !selectedReason ||
              (selectedReason === "Other (specify below)" && !reason.trim())
            }
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: "14px",
                    height: "14px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "ajSpin 0.6s linear infinite",
                  }}
                />{" "}
                Rejecting...
              </>
            ) : (
              "❌ Reject & Notify"
            )}
          </button>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// SUCCESS MODAL
// ══════════════════════════════════════════
function SuccessModal({ job, action, onClose }) {
  const ok = action === "approved";
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal-sm"
        onClick={(e) => e.stopPropagation()}
        style={{ textAlign: "center" }}
      >
        <div
          className="modal-header"
          style={{ border: "none", paddingBottom: 0 }}
        >
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body" style={{ paddingTop: 0 }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: ok
                ? "linear-gradient(135deg,#ecfdf5,#d1fae5)"
                : "linear-gradient(135deg,#fef2f2,#fee2e2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              margin: "0 auto 18px",
            }}
          >
            {ok ? "✓" : "✕"}
          </div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 6px 0",
            }}
          >
            Job {ok ? "Approved" : "Rejected"}
          </h2>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px" }}>
            "{job.title}" — {job.company?.companyName || "Unknown"}
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#f0f9ff",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#0369a1",
            }}
          >
            <span>✉</span> Company has been notified via email
          </div>
        </div>
        <div className="modal-footer" style={{ borderTop: "none" }}>
          <button
            className="btn btn-primary"
            onClick={onClose}
            style={{ width: "100%" }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// JOB CARD
// ══════════════════════════════════════════
function JobCard({ job, onApprove, onReject, loadingState }) {
  const isLoading =
    loadingState === "approving" || loadingState === "rejecting";
  const company = job.company?.companyName || "Unknown Company";
  const email = job.company?.email || job.postedBy?.email || "";
  const department = job.department || "";
  const location = job.location || "";
  const salary = job.salary || job.package || "";
  const type = job.type || job.employmentType || "";
  const description = job.description || "";
  const skills = job.skills || job.requirements || "";
  const deadline = job.deadline || job.lastDate || "";

  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="aj-job-card"
      style={{
        opacity: isLoading ? 0.5 : 1,
        pointerEvents: isLoading ? "none" : "auto",
      }}
    >
      <div className="aj-card-accent" />

      <div style={{ padding: "22px 24px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          <div className="aj-card-avatar">{company[0]?.toUpperCase()}</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <h3 className="aj-card-title">{job.title}</h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    flexWrap: "wrap",
                  }}
                >
                  <span className="aj-card-company">{company}</span>
                  {email && <span className="aj-card-email">✉ {email}</span>}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "6px",
                  flexShrink: 0,
                }}
              >
                <span className="aj-card-time">
                  {formatTimeAgo(job.postedAt || job.createdAt)}
                </span>
                <span className="aj-badge-pending">⏳ Pending Review</span>
              </div>
            </div>
          </div>
        </div>

        <div className="aj-meta-pills">
          {department && <MetaPill icon="🏢" text={department} />}
          {location && <MetaPill icon="📍" text={location} />}
          {type && <MetaPill icon="🕐" text={type} />}
          {salary && <MetaPill icon="💰" text={salary} highlight />}
          {deadline && (
            <MetaPill
              icon="📅"
              text={`Apply by ${formatDate(deadline)}`}
              warning
            />
          )}
        </div>

        {description && (
          <div className="aj-desc-wrap">
            <p
              className="aj-desc-text"
              style={{
                display: expanded ? "block" : "-webkit-box",
                WebkitLineClamp: expanded ? "unset" : 2,
                WebkitBoxOrient: "vertical",
                overflow: expanded ? "visible" : "hidden",
              }}
            >
              {description}
            </p>
            {description.length > 120 && (
              <button
                className="aj-read-more"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}

        {skills && (
          <div className="aj-skills-wrap">
            {(typeof skills === "string"
              ? skills.split(",").map((s) => s.trim())
              : skills
            )
              .filter(Boolean)
              .slice(0, 6)
              .map((skill, i) => (
                <span key={i} className="aj-skill-tag">
                  {skill}
                </span>
              ))}
            {(typeof skills === "string"
              ? skills.split(",").length
              : skills.length) > 6 && (
              <span className="aj-skills-more">
                +
                {(typeof skills === "string"
                  ? skills.split(",").length
                  : skills.length) - 6}{" "}
                more
              </span>
            )}
          </div>
        )}

        <div className="aj-notify-box">
          <span style={{ fontSize: "12px" }}>📧</span>
          <span className="aj-notify-text">
            <strong>Auto-notify:</strong>{" "}
            {email
              ? `Approval/rejection email will be sent to ${email}`
              : "No company email on file for notifications"}
          </span>
        </div>
      </div>

      <div className="aj-card-footer">
        <span className="aj-footer-date">
          Posted {formatDate(job.postedAt || job.createdAt)}
        </span>
        <div className="aj-card-actions">
          {loadingState === "approving" ? (
            <LoadingBtn text="Approving..." green />
          ) : loadingState === "rejecting" ? (
            <LoadingBtn text="Rejecting..." />
          ) : (
            <>
              <button
                className="aj-btn-approve"
                onClick={() => onApprove(job._id)}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Approve
              </button>
              <button className="aj-btn-reject" onClick={() => onReject(job)}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MetaPill({ icon, text, highlight, warning }) {
  let cls = "aj-meta-pill";
  if (highlight) cls += " aj-meta-pill-green";
  if (warning) cls += " aj-meta-pill-amber";
  return (
    <span className={cls}>
      <span>{icon}</span> {text}
    </span>
  );
}

function LoadingBtn({ text, green }) {
  return (
    <button
      className={green ? "aj-btn-loading-green" : "aj-btn-loading"}
      disabled
    >
      <span className="aj-spinner-sm" />
      {text}
    </button>
  );
}

// ══════════════════════════════════════════
// STAT ITEMS — Professional Design
// ══════════════════════════════════════════
const statItems = [
  {
    label: "Pending Review",
    valueKey: "pending",
    accentColor: "#f59e0b",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: "Approved Today",
    valueKey: "approvedToday",
    accentColor: "#10b981",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    label: "Rejected Today",
    valueKey: "rejectedToday",
    accentColor: "#ef4444",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
  {
    label: "Total Reviewed",
    valueKey: "totalReviewed",
    accentColor: "#6366f1",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-6" />
      </svg>
    ),
  },
];

// ══════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════
export default function ApproveJobs() {
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [toast, setToast] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [successModal, setSuccessModal] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    approvedToday: 0,
    rejectedToday: 0,
    totalReviewed: 0,
  });

  const getToken = () => localStorage.getItem("adminToken");

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/pending-jobs`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setJobs(Array.isArray(res.data) ? res.data : []);
      setStats((prev) => ({
        ...prev,
        pending: Array.isArray(res.data) ? res.data.length : 0,
      }));
      setError("");
    } catch (err) {
      setError("Failed to fetch jobs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleApprove = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: "approving" }));
    try {
      await axios({
        method: "POST",
        url: `${API_BASE}/approve/${id}`,
        headers: { Authorization: `Bearer ${getToken()}` },
        data: {},
      });
      try {
        const notifyRes = await axios({
          method: "POST",
          url: `${API_BASE}/notify-approval/${id}`,
          headers: { Authorization: `Bearer ${getToken()}` },
          data: { action: "approved" },
        });
        console.log("✅ Notify OK:", notifyRes.data);
      } catch (e) {
        console.error("❌ Notify FAIL:", e.response?.data || e.message);
      }
      const approvedJob = jobs.find((j) => j._id === id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      setStats((prev) => ({
        ...prev,
        pending: prev.pending - 1,
        approvedToday: prev.approvedToday + 1,
        totalReviewed: prev.totalReviewed + 1,
      }));
      setSuccessModal({ job: approvedJob, action: "approved" });
    } catch (err) {
      showToast(err.response?.data?.message || err.message, "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleReject = async (id, jobTitle, reason) => {
    setActionLoading((prev) => ({ ...prev, [id]: "rejecting" }));
    try {
      await axios({
        method: "POST",
        url: `${API_BASE}/reject/${id}`,
        headers: { Authorization: `Bearer ${getToken()}` },
        data: { reason },
      });
      try {
        const notifyRes = await axios({
          method: "POST",
          url: `${API_BASE}/notify-approval/${id}`,
          headers: { Authorization: `Bearer ${getToken()}` },
          data: { action: "rejected", reason },
        });
        console.log("✅ Notify OK:", notifyRes.data);
      } catch (e) {
        console.error("❌ Notify FAIL:", e.response?.data || e.message);
      }
      const rejectedJob = jobs.find((j) => j._id === id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      setStats((prev) => ({
        ...prev,
        pending: prev.pending - 1,
        rejectedToday: prev.rejectedToday + 1,
        totalReviewed: prev.totalReviewed + 1,
      }));
      setRejectModal(null);
      setSuccessModal({ job: rejectedJob, action: "rejected" });
    } catch (err) {
      showToast(err.response?.data?.message || err.message, "error");
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  return (
    <div className="dashboard-container">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* ═══════ SIDEBAR ═══════ */}
      <aside className="sidebar">
        <h2>🎓 Admin</h2>
        <ul>
          <li>
            <Link to="/admin/dashboard">📊 Dashboard</Link>
          </li>
          <li>
            <Link to="/students">👨‍🎓 Students</Link>
          </li>
          <li>
            <Link to="/recruiters">🏢 Recruiters</Link>
          </li>
          <li className="active">📄 Approve Jobs</li>
          <li>
            <Link to="/admin/applications">📬 Applications</Link>
          </li>
          <li>
            <Link to="/admin/results">✅ Results</Link>
          </li>
          <li>
            {/* <Link to="/admin/reports">📈 Reports</Link> */}
          </li>
        </ul>
      </aside>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <main className="main-content aj-main-content">
        <header className="top-nav aj-top-nav">
          <div>
            <h1>
              <b>📄 Job Approval Queue</b>
            </h1>
            <p className="aj-subtitle">
              Review and moderate company job postings before they go live
            </p>
          </div>
          <div className="aj-top-actions">
            {jobs.length > 0 && (
              <span className="aj-pending-badge">{jobs.length} pending</span>
            )}
            <button
              className="aj-refresh-btn"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={
                  refreshing ? { animation: "ajSpin 0.8s linear infinite" } : {}
                }
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Refresh
            </button>
          </div>
        </header>

        <div className="aj-content-area">
          {/* ═══════ STATS — Professional ═══════ */}
          <div className="aj-stats-grid">
            {statItems.map((s, idx) => (
              <div key={s.label} className="aj-stat-card-pro">
                <div
                  className="aj-stat-icon-pro"
                  style={{
                    background: `${s.accentColor}0D`,
                    border: `1px solid ${s.accentColor}1A`,
                  }}
                >
                  {s.icon}
                </div>

                <div className="aj-stat-content-pro">
                  <span className="aj-stat-label-pro">{s.label}</span>
                  <div className="aj-stat-value-row">
                    <span className="aj-stat-value-pro">
                      {stats[s.valueKey]}
                    </span>
                    {idx === 0 && stats.pending > 0 && (
                      <span
                        className="aj-stat-pulse-dot"
                        style={{ background: s.accentColor }}
                      />
                    )}
                  </div>
                </div>

                <div
                  className="aj-stat-accent-line"
                  style={{ background: `${s.accentColor}40` }}
                />
              </div>
            ))}
          </div>

          {/* Guidelines banner */}
          <div className="aj-guidelines">
            <span className="aj-guidelines-icon">ℹ</span>
            <div>
              <strong className="aj-guidelines-title">
                Moderation Guidelines
              </strong>
              <p className="aj-guidelines-text">
                Verify company details, check job description quality, ensure
                salary info is present. Companies receive automatic email
                notifications on approval or rejection with your reason.
              </p>
            </div>
          </div>

          {/* Error */}
          {error && !loading && (
            <div className="ms-error">
              <span>⚠️ {error}</span>
              <button onClick={handleRefresh}>Retry</button>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && !error && (
            <div className="aj-loading-skeleton">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aj-skeleton-card"
                  style={{
                    animation: `ajPulse 1.5s ease-in-out infinite ${i * 0.2}s`,
                  }}
                >
                  <div className="aj-skeleton-accent" />
                  <div style={{ padding: "24px" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "14px",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "12px",
                          background: "#f1f5f9",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          className="aj-skeleton-line"
                          style={{ width: "40%", marginBottom: "8px" }}
                        />
                        <div
                          className="aj-skeleton-line"
                          style={{ width: "25%" }}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        marginBottom: "14px",
                      }}
                    >
                      {[1, 2, 3].map((j) => (
                        <div
                          key={j}
                          style={{
                            height: "28px",
                            width: "90px",
                            background: "#f1f5f9",
                            borderRadius: "6px",
                          }}
                        />
                      ))}
                    </div>
                    <div
                      className="aj-skeleton-line"
                      style={{ width: "100%", marginBottom: "6px" }}
                    />
                    <div
                      className="aj-skeleton-line"
                      style={{ width: "60%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && jobs.length === 0 && (
            <div className="aj-empty-state">
              <div className="aj-empty-icon">✓</div>
              <h2 className="aj-empty-title">All caught up</h2>
              <p className="aj-empty-text">
                No job postings are waiting for your review.
              </p>
              <button
                className="aj-empty-btn"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? <span className="aj-spinner-sm" /> : "↻"}
                Check for new jobs
              </button>
            </div>
          )}

          {/* Job list */}
          {!loading && !error && jobs.length > 0 && (
            <div className="aj-job-list">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onApprove={handleApprove}
                  onReject={setRejectModal}
                  loadingState={actionLoading[job._id]}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {rejectModal && (
        <RejectModal
          job={rejectModal}
          onClose={() => setRejectModal(null)}
          onConfirm={handleReject}
          loading={actionLoading[rejectModal._id] === "rejecting"}
        />
      )}
      {successModal && (
        <SuccessModal
          job={successModal.job}
          action={successModal.action}
          onClose={() => setSuccessModal(null)}
        />
      )}

      <style>{`
        @keyframes ajSpin { to { transform: rotate(360deg); } }
        @keyframes ajPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes ajPulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        /* ── Main content override ── */
        .aj-main-content {
          display: flex !important;
          flex-direction: column;
          overflow: hidden;
        }
        .aj-top-nav {
          flex-wrap: wrap;
          gap: 12px;
        }
        .aj-subtitle {
          font-size: 12px;
          color: #94a3b8;
          margin: 3px 0 0 0;
        }
        .aj-top-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .aj-pending-badge {
          font-size: 12px;
          font-weight: 600;
          color: #92400e;
          background: #fef3c7;
          padding: 6px 14px;
          border-radius: 100px;
          border: 1px solid #fde68a;
        }
        .aj-refresh-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #475569;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          cursor: pointer;
        }
        .aj-refresh-btn:disabled {
          opacity: 0.5;
          cursor: wait;
        }
        .aj-content-area {
          flex: 1;
          overflow-y: auto;
          padding: 28px 32px;
        }

        /* ══════════════════════════════════════
           STATS — Professional White Cards
           ══════════════════════════════════════ */
        .aj-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .aj-stat-card-pro {
          position: relative;
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e8ecf1;
          padding: 20px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          overflow: hidden;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .aj-stat-card-pro:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
        }
        .aj-stat-icon-pro {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .aj-stat-content-pro {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .aj-stat-label-pro {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          line-height: 1;
        }
        .aj-stat-value-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .aj-stat-value-pro {
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1;
          letter-spacing: -0.025em;
        }
        .aj-stat-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: ajPulseDot 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        .aj-stat-accent-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .aj-stat-card-pro:hover .aj-stat-accent-line {
          opacity: 1;
        }

        /* ── Guidelines ── */
        .aj-guidelines {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 10px;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          margin-bottom: 24px;
        }
        .aj-guidelines-icon {
          font-size: 15px;
          color: #0284c7;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .aj-guidelines-title {
          font-size: 12px;
          color: #0369a1;
          display: block;
          margin-bottom: 2px;
        }
        .aj-guidelines-text {
          font-size: 11px;
          color: #0284c7;
          margin: 0;
          line-height: 1.5;
        }

        /* ── Loading skeleton ── */
        .aj-loading-skeleton {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .aj-skeleton-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e8ecf1;
          overflow: hidden;
        }
        .aj-skeleton-accent {
          height: 3px;
          background: linear-gradient(90deg, #f59e0b, #f97316);
        }
        .aj-skeleton-line {
          height: 12px;
          background: #f1f5f9;
          borderRadius: 4px;
        }

        /* ── Empty state ── */
        .aj-empty-state {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e8ecf1;
          padding: 60px 24px;
          text-align: center;
        }
        .aj-empty-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 30px;
        }
        .aj-empty-title {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px 0;
        }
        .aj-empty-text {
          font-size: 13px;
          color: #94a3b8;
          margin: 0 0 20px 0;
        }
        .aj-empty-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 24px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          background: #0f172a;
          border: none;
          cursor: pointer;
        }
        .aj-empty-btn:disabled {
          opacity: 0.5;
          cursor: wait;
        }

        /* ── Job list ── */
        .aj-job-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── Job card ── */
        .aj-job-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e8ecf1;
          overflow: hidden;
          transition: all 0.2s;
        }
        .aj-card-accent {
          height: 3px;
          background: linear-gradient(90deg, #f59e0b, #f97316);
        }
        .aj-card-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          flex-shrink: 0;
          background: linear-gradient(135deg, #eef2ff, #e0e7ff);
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(79,70,229,0.15);
        }
        .aj-card-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 3px 0;
          line-height: 1.3;
        }
        .aj-card-company {
          font-size: 13px;
          color: #64748b;
        }
        .aj-card-email {
          font-size: 11px;
          color: #94a3b8;
          background: #f8fafc;
          padding: 1px 8px;
          border-radius: 4px;
        }
        .aj-card-time {
          font-size: 11px;
          color: #94a3b8;
          white-space: nowrap;
        }
        .aj-badge-pending {
          font-size: 10px;
          font-weight: 600;
          color: #92400e;
          background: #fef3c7;
          padding: 3px 10px;
          border-radius: 100px;
          border: 1px solid #fde68a;
          white-space: nowrap;
        }

        /* ── Meta pills ── */
        .aj-meta-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 16px;
        }
        .aj-meta-pill {
          font-size: 11px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 6px;
          color: #475569;
          background: #f1f5f9;
        }
        .aj-meta-pill-green {
          color: #065f46;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
        }
        .aj-meta-pill-amber {
          color: #92400e;
          background: #fffbeb;
          border: 1px solid #fde68a;
        }

        /* ── Description ── */
        .aj-desc-wrap {
          margin-top: 14px;
        }
        .aj-desc-text {
          font-size: 13px;
          color: #64748b;
          line-height: 1.65;
          margin: 0;
        }
        .aj-read-more {
          background: none;
          border: none;
          color: #3b82f6;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          padding: 4px 0 0 0;
        }

        /* ── Skills ── */
        .aj-skills-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 12px;
        }
        .aj-skill-tag {
          font-size: 11px;
          color: #6366f1;
          background: #eef2ff;
          padding: 3px 10px;
          border-radius: 100px;
          border: 1px solid #e0e7ff;
          font-weight: 500;
        }
        .aj-skills-more {
          font-size: 11px;
          color: #94a3b8;
          padding: 3px 8px;
        }

        /* ── Notify box ── */
        .aj-notify-box {
          margin-top: 14px;
          padding: 10px 14px;
          background: #f0fdf4;
          border-radius: 8px;
          border: 1px solid #bbf7d0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .aj-notify-text {
          font-size: 11px;
          color: #166534;
          line-height: 1.4;
        }

        /* ── Card footer ── */
        .aj-card-footer {
          padding: 14px 24px;
          background: #fafbfc;
          border-top: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .aj-footer-date {
          font-size: 11px;
          color: #b0b8c4;
        }
        .aj-card-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .aj-btn-approve {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 22px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #059669, #10b981);
          border: none;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(16,185,129,0.3);
          transition: all 0.15s;
        }
        .aj-btn-approve:hover {
          box-shadow: 0 4px 14px rgba(16,185,129,0.4);
          transform: translateY(-1px);
        }
        .aj-btn-reject {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 22px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
          background: #fff;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.15s;
        }
        .aj-btn-reject:hover {
          border-color: #fca5a5;
          color: #dc2626;
          background: #fef2f2;
        }
        .aj-btn-loading,
        .aj-btn-loading-green {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 22px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: wait;
          opacity: 0.7;
        }
        .aj-btn-loading {
          color: #64748b;
          background: #fff;
          border: 1px solid #e2e8f0;
        }
        .aj-btn-loading-green {
          color: #fff;
          background: #10b981;
          border: none;
        }
        .aj-spinner-sm {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          display: inline-block;
          animation: ajSpin 0.6s linear infinite;
        }
        .aj-btn-loading .aj-spinner-sm {
          border-color: #e2e8f0;
          border-top-color: #64748b;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .aj-content-area {
            padding: 20px 16px !important;
          }
          .aj-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .aj-stats-grid {
            grid-template-columns: 1fr !important;
          }
          .aj-card-footer {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}