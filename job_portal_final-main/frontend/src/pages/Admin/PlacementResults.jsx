// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import "./ManageStudents.css";

// const API_BASE = "http://localhost:5000/api/admin";

// const formatDate = (dateStr) => {
//   if (!dateStr) return "N/A";
//   return new Date(dateStr).toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// };

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
//       <button className="toast-close" onClick={onClose}>✕</button>
//     </div>
//   );
// }

// // ══════════════════════════════════════════
// // CONFIRM PUBLISH MODAL
// // ══════════════════════════════════════════
// function ConfirmPublishModal({ results, onClose, onConfirm, loading }) {
//   const selected = results.filter((r) => r.finalStatus === "Selected");
//   const rejected = results.filter((r) => r.finalStatus === "Rejected");

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal modal-sm" onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
//         <div className="modal-header" style={{ border: "none", paddingBottom: 0 }}>
//           <button className="modal-close" onClick={onClose}>✕</button>
//         </div>
//         <div className="modal-body" style={{ paddingTop: 0 }}>
//           <div
//             style={{
//               width: "72px",
//               height: "72px",
//               borderRadius: "50%",
//               background: "linear-gradient(135deg, #fefce8, #fef9c3)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: "32px",
//               margin: "0 auto 18px",
//             }}
//           >
//             🏆
//           </div>
//           <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", margin: "0 0 6px 0" }}>
//             Publish Placement Results
//           </h2>
//           <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 20px" }}>
//             This action will finalize and publish the placement results. Students will be notified.
//           </p>

//           <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "20px" }}>
//             <div
//               style={{
//                 background: "#ecfdf5",
//                 border: "1px solid #a7f3d0",
//                 borderRadius: "10px",
//                 padding: "12px 20px",
//                 textAlign: "center",
//               }}
//             >
//               <p style={{ fontSize: "22px", fontWeight: 700, color: "#065f46", margin: 0 }}>{selected.length}</p>
//               <p style={{ fontSize: "11px", color: "#065f46", margin: "2px 0 0 0", fontWeight: 600 }}>Selected</p>
//             </div>
//             <div
//               style={{
//                 background: "#fef2f2",
//                 border: "1px solid #fecaca",
//                 borderRadius: "10px",
//                 padding: "12px 20px",
//                 textAlign: "center",
//               }}
//             >
//               <p style={{ fontSize: "22px", fontWeight: 700, color: "#991b1b", margin: 0 }}>{rejected.length}</p>
//               <p style={{ fontSize: "11px", color: "#991b1b", margin: "2px 0 0 0", fontWeight: 600 }}>Rejected</p>
//             </div>
//           </div>

//           <div
//             style={{
//               background: "#fffbeb",
//               border: "1px solid #fde68a",
//               borderRadius: "8px",
//               padding: "10px 14px",
//               marginBottom: "16px",
//               display: "flex",
//               alignItems: "center",
//               gap: "8px",
//               textAlign: "left",
//             }}
//           >
//             <span style={{ fontSize: "14px" }}>⚠️</span>
//             <span style={{ fontSize: "12px", color: "#92400e", lineHeight: 1.4 }}>
//               <strong>Important:</strong> Published results cannot be undone. Please verify before confirming.
//             </span>
//           </div>
//         </div>
//         <div className="modal-footer" style={{ borderTop: "none", gap: "8px" }}>
//           <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
//           <button
//             className="btn btn-primary"
//             onClick={onConfirm}
//             disabled={loading || selected.length === 0}
//             style={{ flex: 2 }}
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
//                     animation: "prSpin 0.6s linear infinite",
//                   }}
//                 />{" "}
//                 Publishing...
//               </>
//             ) : (
//               "🏆 Publish Results"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════
// // SUCCESS MODAL
// // ══════════════════════════════════════════
// function PublishSuccessModal({ selectedCount, rejectedCount, onClose }) {
//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal modal-sm" onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
//         <div className="modal-header" style={{ border: "none", paddingBottom: 0 }}>
//           <button className="modal-close" onClick={onClose}>✕</button>
//         </div>
//         <div className="modal-body" style={{ paddingTop: 0 }}>
//           <div
//             style={{
//               width: "72px",
//               height: "72px",
//               borderRadius: "50%",
//               background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: "32px",
//               margin: "0 auto 18px",
//             }}
//           >
//             🎉
//           </div>
//           <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", margin: "0 0 6px 0" }}>
//             Results Published!
//           </h2>
//           <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px" }}>
//             Placement results have been finalized and published successfully.
//           </p>
//           <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "16px" }}>
//             <div
//               style={{
//                 background: "#ecfdf5",
//                 border: "1px solid #a7f3d0",
//                 borderRadius: "8px",
//                 padding: "8px 16px",
//                 fontSize: "12px",
//                 color: "#065f46",
//                 fontWeight: 600,
//               }}
//             >
//               ✓ {selectedCount} Selected
//             </div>
//             <div
//               style={{
//                 background: "#fef2f2",
//                 border: "1px solid #fecaca",
//                 borderRadius: "8px",
//                 padding: "8px 16px",
//                 fontSize: "12px",
//                 color: "#991b1b",
//                 fontWeight: 600,
//               }}
//             >
//               ✕ {rejectedCount} Rejected
//             </div>
//           </div>
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
//             <span>📧</span> Students have been notified
//           </div>
//         </div>
//         <div className="modal-footer" style={{ borderTop: "none" }}>
//           <button className="btn btn-primary" onClick={onClose} style={{ width: "100%" }}>
//             Done
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════
// // STUDENT RESULT CARD
// // ══════════════════════════════════════════
// function ResultCard({ item, index, onMarkSelected, onMarkRejected, loadingState }) {
//   const isLoading = loadingState === "selecting" || loadingState === "rejecting";
//   const student = item.student || {};
//   const job = item.job || {};
//   const company = job.company?.companyName || "Unknown";
//   const studentName = student.name || "Unknown Student";
//   const initials = studentName
//     .split(" ")
//     .map((w) => w[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();

//   const gradients = [
//     "linear-gradient(135deg, #0d9488, #14b8a6)",
//     "linear-gradient(135deg, #6366f1, #818cf8)",
//     "linear-gradient(135deg, #f59e0b, #fbbf24)",
//     "linear-gradient(135deg, #ef4444, #f87171)",
//     "linear-gradient(135deg, #0ea5e9, #38bdf8)",
//     "linear-gradient(135deg, #8b5cf6, #a78bfa)",
//     "linear-gradient(135deg, #ec4899, #f472b6)",
//   ];
//   const grad = gradients[index % gradients.length];

//   const isFinalized = item.finalStatus === "Selected" || item.finalStatus === "Rejected";

//   return (
//     <div
//       className="pr-card"
//       style={{
//         opacity: isLoading ? 0.5 : 1,
//         pointerEvents: isLoading ? "none" : "auto",
//         borderLeftColor:
//           item.finalStatus === "Selected"
//             ? "#10b981"
//             : item.finalStatus === "Rejected"
//             ? "#ef4444"
//             : "#e2e8f0",
//       }}
//     >
//       <div style={{ padding: "22px 24px 16px" }}>
//         {/* Header */}
//         <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
//           <div className="pr-avatar" style={{ background: grad }}>{initials}</div>
//           <div style={{ flex: 1, minWidth: 0 }}>
//             <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
//               <div style={{ minWidth: 0 }}>
//                 <h3 className="pr-student-name">{studentName}</h3>
//                 <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
//                   <span className="pr-meta-pill">
//                     🎓 {student.university || "N/A"}
//                   </span>
//                   {student.gpa && (
//                     <span className="pr-meta-pill pr-meta-pill-green">
//                       GPA: {student.gpa}
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
//                 <span className="pr-time">{formatTimeAgo(item.appliedAt || item.createdAt)}</span>
//                 {isFinalized ? (
//                   <span
//                     className="pr-badge"
//                     style={{
//                       background: item.finalStatus === "Selected" ? "#ecfdf5" : "#fef2f2",
//                       color: item.finalStatus === "Selected" ? "#065f46" : "#991b1b",
//                       borderColor: item.finalStatus === "Selected" ? "#a7f3d0" : "#fecaca",
//                     }}
//                   >
//                     {item.finalStatus === "Selected" ? "✓ Selected" : "✕ Rejected"}
//                   </span>
//                 ) : (
//                   <span className="pr-badge-pending">⏳ Pending</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Job Info */}
//         <div className="pr-job-box">
//           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//             <div className="pr-job-avatar">
//               {(company[0] || "U").toUpperCase()}
//             </div>
//             <div style={{ flex: 1, minWidth: 0 }}>
//               <p className="pr-job-title">{job.title || "Unknown Job"}</p>
//               <p className="pr-job-company">{company}</p>
//             </div>
//           </div>
//           {(job.location || job.type) && (
//             <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
//               {job.location && <span className="pr-job-pill">📍 {job.location}</span>}
//               {job.type && <span className="pr-job-pill">🕐 {job.type}</span>}
//             </div>
//           )}
//         </div>

//         {/* Skills */}
//         {student.skills && (
//           <div className="pr-skills-wrap">
//             {student.skills
//               .split(",")
//               .map((s) => s.trim())
//               .filter(Boolean)
//               .slice(0, 5)
//               .map((skill, i) => (
//                 <span key={i} className="pr-skill-tag">{skill}</span>
//               ))}
//             {student.skills.split(",").filter(Boolean).length > 5 && (
//               <span className="pr-skills-more">
//                 +{student.skills.split(",").filter(Boolean).length - 5} more
//               </span>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Footer Actions */}
//       <div className="pr-card-footer">
//         <span className="pr-footer-label">
//           Applied {formatDate(item.appliedAt || item.createdAt)}
//         </span>
//         <div className="pr-card-actions">
//           {loadingState === "selecting" ? (
//             <LoadingBtn text="Selecting..." color="#059669" />
//           ) : loadingState === "rejecting" ? (
//             <LoadingBtn text="Rejecting..." color="#dc2626" />
//           ) : (
//             <>
//               <button
//                 className="pr-btn-select"
//                 onClick={() => onMarkSelected(item._id)}
//                 disabled={isFinalized}
//                 style={item.finalStatus === "Selected" ? { background: "#059669", boxShadow: "0 0 0 0" } : {}}
//               >
//                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                   <polyline points="20 6 9 17 4 12" />
//                 </svg>
//                 Select
//               </button>
//               <button
//                 className="pr-btn-reject"
//                 onClick={() => onMarkRejected(item._id)}
//                 disabled={isFinalized}
//                 style={item.finalStatus === "Rejected" ? { background: "#dc2626", color: "#fff", border: "none" } : {}}
//               >
//                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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

// function LoadingBtn({ text, color }) {
//   return (
//     <button
//       className="pr-btn-loading"
//       disabled
//       style={{ border: `1px solid ${color}30` }}
//     >
//       <span className="pr-spinner-sm" style={{ borderColor: color }} />
//       {text}
//     </button>
//   );
// }

// // ══════════════════════════════════════════
// // STAT ITEMS
// // ══════════════════════════════════════════
// const statItems = [
//   {
//     label: "Company Selected",
//     valueKey: "companySelected",
//     accentColor: "#3b82f6",
//     icon: (
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
//         <circle cx="9" cy="7" r="4" />
//         <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
//         <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//       </svg>
//     ),
//   },
//   {
//     label: "Admin Selected",
//     valueKey: "adminSelected",
//     accentColor: "#10b981",
//     icon: (
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//         <polyline points="22 4 12 14.01 9 11.01" />
//       </svg>
//     ),
//   },
//   {
//     label: "Admin Rejected",
//     valueKey: "adminRejected",
//     accentColor: "#ef4444",
//     icon: (
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <circle cx="12" cy="12" r="10" />
//         <line x1="15" y1="9" x2="9" y2="15" />
//         <line x1="9" y1="9" x2="15" y2="15" />
//       </svg>
//     ),
//   },
//   {
//     label: "Pending Decision",
//     valueKey: "pending",
//     accentColor: "#f59e0b",
//     icon: (
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <circle cx="12" cy="12" r="10" />
//         <polyline points="12 6 12 12 16 14" />
//       </svg>
//     ),
//   },
// ];

// // ══════════════════════════════════════════
// // MAIN COMPONENT
// // ══════════════════════════════════════════
// export default function PlacementResults() {
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [refreshing, setRefreshing] = useState(false);
//   const [actionLoading, setActionLoading] = useState({});
//   const [toast, setToast] = useState(null);
//   const [confirmModal, setConfirmModal] = useState(null);
//   const [successModal, setSuccessModal] = useState(null);
//   const [stats, setStats] = useState({
//     companySelected: 0,
//     adminSelected: 0,
//     adminRejected: 0,
//     pending: 0,
//   });
//   const [filterStatus, setFilterStatus] = useState("all");

//   const getToken = () => localStorage.getItem("adminToken");

//   // const fetchResults = async () => {
//   //   try {
//   //     const res = await axios.get(`${API_BASE}/placement-results`, {
//   //       headers: { Authorization: `Bearer ${getToken()}` },
//   //     });
//   //     const data = Array.isArray(res.data?.results)
//   //       ? res.data.results
//   //       : Array.isArray(res.data)
//   //       ? res.data
//   //       : [];
//   //     setResults(data);
//   //     setError("");
//   //   } catch (err) {
//   //     setError("Failed to fetch placement results");
//   //   } finally {
//   //     setLoading(false);
//   //     setRefreshing(false);
//   //   }
//   // };

//   const fetchResults = async () => {
//   try {
//     const res = await axios.get(`${API_BASE}/placement-results`, {
//       headers: { Authorization: `Bearer ${getToken()}` },
//     });

//     const data = Array.isArray(res.data?.results)
//       ? res.data.results
//       : Array.isArray(res.data)
//         ? res.data
//         : [];

//     setResults(data);

//     // ✅ FIX: Use stats from backend response
//     if (res.data?.stats) {
//       setStats(res.data.stats);
//     } else {
//       // Fallback: compute locally if backend doesn't send stats
//       setStats({
//         companySelected: data.length,
//         adminSelected: data.filter((r) => r.finalStatus === "Selected").length,
//         adminRejected: data.filter((r) => r.finalStatus === "Rejected").length,
//         pending: data.filter(
//           (r) => r.finalStatus === "pending" || !r.finalStatus
//         ).length,
//       });
//     }

//     setError("");
//   } catch (err) {
//     console.error("Fetch error:", err);
//     setError("Failed to fetch placement results");
//   } finally {
//     setLoading(false);
//     setRefreshing(false);
//   }
// };
  
//   useEffect(() => {
//     fetchResults();
//   }, []);

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchResults();
//   };

//   const showToast = (message, type = "success") => setToast({ message, type });

//   const handleMarkSelected = async (id) => {
//     setActionLoading((prev) => ({ ...prev, [id]: "selecting" }));
//     try {
//       await axios({
//         method: "PATCH",
//         url: `${API_BASE}/placement-results/${id}`,
//         headers: { Authorization: `Bearer ${getToken()}` },
//         data: { finalStatus: "Selected" },
//       });
//       setResults((prev) =>
//         prev.map((r) =>
//           r._id === id ? { ...r, finalStatus: "Selected" } : r
//         )
//       );
//       setStats((prev) => ({
//         ...prev,
//         adminSelected: prev.adminSelected + 1,
//         pending: Math.max(0, prev.pending - 1),
//       }));
//       showToast("Student marked as Selected");
//     } catch (err) {
//       showToast(err.response?.data?.message || err.message, "error");
//     } finally {
//       setActionLoading((prev) => ({ ...prev, [id]: null }));
//     }
//   };

//   const handleMarkRejected = async (id) => {
//     setActionLoading((prev) => ({ ...prev, [id]: "rejecting" }));
//     try {
//       await axios({
//         method: "PATCH",
//         url: `${API_BASE}/placement-results/${id}`,
//         headers: { Authorization: `Bearer ${getToken()}` },
//         data: { finalStatus: "Rejected" },
//       });
//       setResults((prev) =>
//         prev.map((r) =>
//           r._id === id ? { ...r, finalStatus: "Rejected" } : r
//         )
//       );
//       setStats((prev) => ({
//         ...prev,
//         adminRejected: prev.adminRejected + 1,
//         pending: Math.max(0, prev.pending - 1),
//       }));
//       showToast("Student marked as Rejected");
//     } catch (err) {
//       showToast(err.response?.data?.message || err.message, "error");
//     } finally {
//       setActionLoading((prev) => ({ ...prev, [id]: null }));
//     }
//   };

//   const handlePublish = async () => {
//     const finalized = results.filter(
//       (r) => r.finalStatus === "Selected" || r.finalStatus === "Rejected"
//     );
//     if (finalized.length === 0) {
//       showToast("No results to publish. Select or reject students first.", "error");
//       return;
//     }
//     setConfirmModal(finalized);
//   };

//   const confirmPublish = async () => {
//     try {
//       await axios({
//         method: "POST",
//         url: `${API_BASE}/placement-results/publish`,
//         headers: { Authorization: `Bearer ${getToken()}` },
//         data: { results: confirmModal },
//       });
//       setConfirmModal(null);
//       setSuccessModal({
//         selectedCount: confirmModal.filter((r) => r.finalStatus === "Selected").length,
//         rejectedCount: confirmModal.filter((r) => r.finalStatus === "Rejected").length,
//       });
//       showToast("Placement results published successfully!");
//     } catch (err) {
//       showToast(err.response?.data?.message || err.message, "error");
//       setConfirmModal(null);
//     }
//   };

//   // Filter logic
//   const filteredResults = filterStatus === "all"
//     ? results
//     : results.filter((r) => r.finalStatus === filterStatus);

//   // const displayedResults = filterStatus === "all"
//   //   ? results
//   //   : filteredResults;
// // Replace the displayedResults line:
// const displayedResults = filterStatus === "all"
//   ? results
//   : filterStatus === "pending"
//     ? results.filter((r) => !r.finalStatus || r.finalStatus === "pending")
//     : results.filter((r) => r.finalStatus === filterStatus);
//   return (
//     <div className="dashboard-container">
//       <Toast toast={toast} onClose={() => setToast(null)} />

//       {/* ═══════ SIDEBAR ═══════ */}
//       <aside className="sidebar">
//         <h2>🎓 Admin</h2>
//         <ul>
//           <li><Link to="/admin/dashboard">📊 Dashboard</Link></li>
//           <li><Link to="/students">👨‍🎓 Students</Link></li>
//           <li><Link to="/recruiters">🏢 Recruiters</Link></li>
//           <li><Link to="/admin/approve-jobs">📄 Approve Jobs</Link></li>
//           <li><Link to="/admin/applications">📬 Applications</Link></li>
//           <li className="active"><span>🏆 Results</span></li>
//           <li><Link to="/admin/reports">📈 Reports</Link></li>
//         </ul>
//       </aside>

//       {/* ═══════ MAIN CONTENT ═══════ */}
//       <main className="main-content pr-main-content">
//         <header className="top-nav pr-top-nav">
//           <div>
//             <h1>
//               <b>🏆 Publish Final Placement Results</b>
//             </h1>
//             <p className="pr-subtitle">
//               Review company selections and publish final placement outcomes for students
//             </p>
//           </div>
//           <div className="pr-top-actions">
//             {results.length > 0 && (
//               <span className="pr-total-badge">{results.length} results</span>
//             )}
//             <button
//               className="pr-refresh-btn"
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
//                 style={refreshing ? { animation: "prSpin 0.8s linear infinite" } : {}}
//               >
//                 <polyline points="23 4 23 10 17 10" />
//                 <polyline points="1 20 1 14 7 14" />
//                 <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
//               </svg>
//               Refresh
//             </button>
//             <button
//               className="pr-publish-btn"
//               onClick={handlePublish}
//               disabled={results.filter((r) => r.finalStatus).length === 0}
//             >
//               🏆 Publish Results
//             </button>
//           </div>
//         </header>

//         <div className="pr-content-area">
//           {/* ═══════ STATS ═══════ */}
//           <div className="pr-stats-grid">
//             {statItems.map((s) => (
//               <div key={s.label} className="pr-stat-card-pro">
//                 <div
//                   className="pr-stat-icon-pro"
//                   style={{
//                     background: `${s.accentColor}0D`,
//                     border: `1px solid ${s.accentColor}1A`,
//                   }}
//                 >
//                   {s.icon}
//                 </div>
//                 <div className="pr-stat-content-pro">
//                   <span className="pr-stat-label-pro">{s.label}</span>
//                   <span className="pr-stat-value-pro">{stats[s.valueKey]}</span>
//                 </div>
//                 <div
//                   className="pr-stat-accent-line"
//                   style={{ background: `${s.accentColor}40` }}
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Info banner */}
//           <div className="pr-info-banner">
//             <span className="pr-info-icon">📋</span>
//             <div>
//               <strong className="pr-info-title">How It Works</strong>
//               <p className="pr-info-text">
//                 Companies select students via their dashboard → Those selections appear here →
//                 You review and mark as <strong>Selected</strong> or <strong>Rejected</strong> →
//                 Click <strong>"Publish Results"</strong> to finalize
//               </p>
//             </div>
//           </div>

//           {/* Filter tabs */}
//           {!loading && !error && results.length > 0 && (
//             <div className="pr-filter-tabs">
//               {[
//                 { key: "all", label: "All Results", count: results.length },
//                 // { key: "pending", label: "Pending", count: stats.pending },
//                 { key: "pending", label: "Pending", count: results.filter(r => !r.finalStatus || r.finalStatus === "pending").length },
//                 { key: "Selected", label: "Selected", count: stats.adminSelected },
//                 { key: "Rejected", label: "Rejected", count: stats.adminRejected },
//               ].map((tab) => (
//                 <button
//                   key={tab.key}
//                   className={`pr-filter-tab ${filterStatus === tab.key ? "pr-filter-active" : ""}`}
//                   onClick={() => setFilterStatus(tab.key)}
//                 >
//                   {tab.label}
//                   <span className="pr-tab-count">{tab.count}</span>
//                 </button>
//               ))}
//             </div>
//           )}

//           {/* Error */}
//           {error && !loading && (
//             <div className="ms-error">
//               <span>⚠️ {error}</span>
//               <button onClick={handleRefresh}>Retry</button>
//             </div>
//           )}

//           {/* Loading skeleton */}
//           {loading && !error && (
//             <div className="pr-loading-skeleton">
//               {[1, 2, 3].map((i) => (
//                 <div
//                   key={i}
//                   className="pr-skeleton-card"
//                   style={{ animation: `prPulse 1.5s ease-in-out infinite ${i * 0.2}s` }}
//                 >
//                   <div style={{ padding: "24px" }}>
//                     <div style={{ display: "flex", gap: "14px", marginBottom: "16px" }}>
//                       <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f1f5f9" }} />
//                       <div style={{ flex: 1 }}>
//                         <div className="pr-skeleton-line" style={{ width: "35%", marginBottom: "8px" }} />
//                         <div className="pr-skeleton-line" style={{ width: "20%" }} />
//                       </div>
//                     </div>
//                     <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "14px", marginBottom: "12px" }}>
//                       <div className="pr-skeleton-line" style={{ width: "50%", marginBottom: "6px" }} />
//                       <div className="pr-skeleton-line" style={{ width: "30%" }} />
//                     </div>
//                     <div style={{ display: "flex", gap: "6px" }}>
//                       {[1, 2, 3].map((j) => (
//                         <div key={j} style={{ height: "26px", width: "70px", background: "#f1f5f9", borderRadius: "100px" }} />
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Empty state */}
//           {!loading && !error && results.length === 0 && (
//             <div className="pr-empty-state">
//               <div className="pr-empty-icon">📋</div>
//               <h2 className="pr-empty-title">No results yet</h2>
//               <p className="pr-empty-text">
//                 Placement results will appear here once companies start selecting students.
//               </p>
//               <button className="pr-empty-btn" onClick={handleRefresh} disabled={refreshing}>
//                 {refreshing ? <span className="pr-spinner-sm" /> : "↻"} Check for new results
//               </button>
//             </div>
//           )}

//           {/* Empty filtered */}
//           {!loading && !error && results.length > 0 && displayedResults.length === 0 && (
//             <div className="pr-empty-state">
//               <div className="pr-empty-icon" style={{ background: "linear-gradient(135deg, #fefce8, #fef9c3)" }}>🔍</div>
//               <h2 className="pr-empty-title">No matches found</h2>
//               <p className="pr-empty-text">No results match this filter.</p>
//               <button className="pr-empty-btn" onClick={() => setFilterStatus("all")}>
//                 Clear filter
//               </button>
//             </div>
//           )}

//           {/* Result list */}
//           {!loading && !error && displayedResults.length > 0 && (
//             <div className="pr-result-list">
//               {displayedResults.map((item, i) => (
//                 <ResultCard
//                   key={item._id || i}
//                   item={item}
//                   index={i}
//                   onMarkSelected={handleMarkSelected}
//                   onMarkRejected={handleMarkRejected}
//                   loadingState={actionLoading[item._id]}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </main>

//       {/* Modals */}
//       {confirmModal && (
//         <ConfirmPublishModal
//           results={confirmModal}
//           onClose={() => setConfirmModal(null)}
//           onConfirm={confirmPublish}
//           loading={false}
//         />
//       )}
//       {successModal && (
//         <PublishSuccessModal
//           selectedCount={successModal.selectedCount}
//           rejectedCount={successModal.rejectedCount}
//           onClose={() => {
//             setSuccessModal(null);
//             fetchResults();
//           }}
//         />
//       )}

//       <style>{`
//         @keyframes prSpin { to { transform: rotate(360deg); } }
//         @keyframes prPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

//         .pr-main-content {
//           display: flex !important;
//           flex-direction: column;
//           overflow: hidden;
//         }
//         .pr-top-nav {
//           flex-wrap: wrap;
//           gap: 12px;
//         }
//         .pr-subtitle {
//           font-size: 12px;
//           color: #94a3b8;
//           margin: 3px 0 0 0;
//         }
//         .pr-top-actions {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//         }
//         .pr-total-badge {
//           font-size: 12px;
//           font-weight: 600;
//           color: #4338ca;
//           background: #eef2ff;
//           padding: 6px 14px;
//           border-radius: 100px;
//           border: 1px solid #c7d2fe;
//         }
//         .pr-refresh-btn {
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
//         .pr-refresh-btn:disabled { opacity: 0.5; cursor: wait; }
//         .pr-publish-btn {
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
//           box-shadow: 0 2px 10px rgba(16,185,129,0.3);
//           transition: all 0.15s;
//         }
//         .pr-publish-btn:hover:not(:disabled) {
//           box-shadow: 0 4px 16px rgba(16,185,129,0.4);
//           transform: translateY(-1px);
//         }
//         .pr-publish-btn:disabled { opacity: 0.5; cursor: not-allowed; }
//         .pr-content-area {
//           flex: 1;
//           overflow-y: auto;
//           padding: 28px 32px;
//         }

//         /* ═══ Stats ═══ */
//         .pr-stats-grid {
//           display: grid;
//           grid-template-columns: repeat(4, 1fr);
//           gap: 16px;
//           margin-bottom: 24px;
//         }
//         .pr-stat-card-pro {
//           position: relative;
//           background: #fff;
//           border-radius: 12px;
//           border: 1px solid #e8ecf1;
//           padding: 20px;
//           display: flex;
//           align-items: flex-start;
//           gap: 14px;
//           overflow: hidden;
//           transition: border-color 0.2s ease, box-shadow 0.2s ease;
//         }
//         .pr-stat-card-pro:hover {
//           border-color: #cbd5e1;
//           box-shadow: 0 4px 16px rgba(15,23,42,0.06);
//         }
//         .pr-stat-icon-pro {
//           width: 40px;
//           height: 40px;
//           border-radius: 10px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           flex-shrink: 0;
//         }
//         .pr-stat-content-pro {
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//         }
//         .pr-stat-label-pro {
//           font-size: 11px;
//           font-weight: 600;
//           color: #94a3b8;
//           letter-spacing: 0.04em;
//           text-transform: uppercase;
//           line-height: 1;
//         }
//         .pr-stat-value-pro {
//           font-size: 28px;
//           font-weight: 700;
//           color: #0f172a;
//           line-height: 1;
//           letter-spacing: -0.025em;
//         }
//         .pr-stat-accent-line {
//           position: absolute;
//           bottom: 0;
//           left: 0;
//           right: 0;
//           height: 2px;
//           opacity: 0;
//           transition: opacity 0.2s ease;
//         }
//         .pr-stat-card-pro:hover .pr-stat-accent-line { opacity: 1; }

//         /* ═══ Info Banner ═══ */
//         .pr-info-banner {
//           display: flex;
//           align-items: flex-start;
//           gap: 12px;
//           padding: 14px 18px;
//           border-radius: 10px;
//           background: #f0f9ff;
//           border: 1px solid #bae6fd;
//           margin-bottom: 24px;
//         }
//         .pr-info-icon {
//           font-size: 15px;
//           color: #0284c7;
//           flex-shrink: 0;
//           margin-top: 1px;
//         }
//         .pr-info-title {
//           font-size: 12px;
//           color: #0369a1;
//           display: block;
//           margin-bottom: 2px;
//         }
//         .pr-info-text {
//           font-size: 11px;
//           color: #0284c7;
//           margin: 0;
//           line-height: 1.5;
//         }

//         /* ═══ Filter Tabs ═══ */
//         .pr-filter-tabs {
//           display: flex;
//           gap: 6px;
//           margin-bottom: 20px;
//           background: #fff;
//           border-radius: 12px;
//           border: 1px solid #e8ecf1;
//           padding: 6px;
//         }
//         .pr-filter-tab {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           padding: 9px 16px;
//           border-radius: 8px;
//           border: 1px solid transparent;
//           background: transparent;
//           font-size: 12px;
//           font-weight: 600;
//           color: #64748b;
//           cursor: pointer;
//           transition: all 0.15s;
//         }
//         .pr-filter-tab:hover {
//           background: #f1f5f9;
//         }
//         .pr-filter-active {
//           background: #6366f1;
//           color: #fff;
//           border-color: #6366f1;
//         }
//         .pr-filter-active:hover {
//           background: #4f46e5;
//           color: #fff;
//         }
//         .pr-tab-count {
//           font-size: 10px;
//           font-weight: 700;
//           background: rgba(255,255,255,0.25);
//           padding: 1px 7px;
//           border-radius: 100px;
//           min-width: 22px;
//           text-align: center;
//         }

//         /* ═══ Loading ═══ */
//         .pr-loading-skeleton {
//           display: flex;
//           flex-direction: column;
//           gap: 16px;
//         }
//         .pr-skeleton-card {
//           background: #fff;
//           border-radius: 14px;
//           border: 1px solid #e8ecf1;
//         }
//         .pr-skeleton-line {
//           height: 12px;
//           background: #f1f5f9;
//           border-radius: 4px;
//         }

//         /* ═══ Empty ═══ */
//         .pr-empty-state {
//           background: #fff;
//           border-radius: 14px;
//           border: 1px solid #e8ecf1;
//           padding: 60px 24px;
//           text-align: center;
//         }
//         .pr-empty-icon {
//           width: 72px;
//           height: 72px;
//           border-radius: 50%;
//           background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin: 0 auto 20px;
//           font-size: 30px;
//         }
//         .pr-empty-title {
//           font-size: 20px;
//           font-weight: 700;
//           color: #0f172a;
//           margin: 0 0 6px 0;
//         }
//         .pr-empty-text {
//           font-size: 13px;
//           color: #94a3b8;
//           margin: 0 0 20px 0;
//         }
//         .pr-empty-btn {
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
//         .pr-empty-btn:disabled { opacity: 0.5; cursor: wait; }

//         /* ═══ Result List ═══ */
//         .pr-result-list {
//           display: flex;
//           flex-direction: column;
//           gap: 16px;
//         }

//         /* ═══ Result Card ═══ */
//         .pr-card {
//           background: #fff;
//           border-radius: 14px;
//           border: 1px solid #e8ecf1;
//           overflow: hidden;
//           transition: all 0.2s;
//           border-left: 4px solid #e2e8f0;
//         }
//         .pr-card:hover {
//           box-shadow: 0 4px 20px rgba(15,23,42,0.06);
//         }
//         .pr-avatar {
//           width: 48px;
//           height: 48px;
//           border-radius: 12px;
//           flex-shrink: 0;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 16px;
//           font-weight: 700;
//           color: #fff;
//           box-shadow: 0 2px 8px rgba(0,0,0,0.1);
//         }
//         .pr-student-name {
//           font-size: 15px;
//           font-weight: 600;
//           color: #0f172a;
//           margin: 0 0 2px 0;
//         }
//         .pr-meta-pill {
//           font-size: 11px;
//           color: #475569;
//           background: #f1f5f9;
//           padding: 3px 10px;
//           border-radius: 6px;
//           display: inline-flex;
//           align-items: center;
//           gap: 4px;
//         }
//         .pr-meta-pill-green {
//           color: #065f46;
//           background: #ecfdf5;
//           border: 1px solid #a7f3d0;
//         }
//         .pr-time {
//           font-size: 11px;
//           color: #94a3b8;
//           white-space: nowrap;
//         }
//         .pr-badge-pending {
//           font-size: 10px;
//           font-weight: 600;
//           color: #92400e;
//           background: #fef3c7;
//           padding: 3px 10px;
//           border-radius: 100px;
//           border: 1px solid #fde68a;
//           white-space: nowrap;
//           animation: prPulse 2s ease-in-out infinite;
//         }
//         .pr-badge {
//           font-size: 10px;
//           font-weight: 600;
//           padding: 3px 10px;
//           border-radius: 100px;
//           white-space: nowrap;
//         }

//         /* ═══ Job Box ═══ */
//         .pr-job-box {
//           margin-top: 14px;
//           background: #fafbfc;
//           border-radius: 10px;
//           border: 1px solid #f1f5f9;
//           padding: 12px 14px;
//         }
//         .pr-job-avatar {
//           width: 36px;
//           height: 36px;
//           border-radius: 8px;
//           background: linear-gradient(135deg, #eef2ff, #e0e7ff);
//           color: #4f46e5;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 14px;
//           font-weight: 700;
//           flex-shrink: 0;
//         }
//         .pr-job-title {
//           font-size: 13px;
//           font-weight: 600;
//           color: #0f172a;
//           margin: 0 0 2px 0;
//         }
//         .pr-job-company {
//           font-size: 11px;
//           color: #64748b;
//           margin: 0;
//         }
//         .pr-job-pill {
//           font-size: 10px;
//           color: #64748b;
//           background: #fff;
//           padding: 3px 10px;
//           border-radius: 100px;
//           border: 1px solid #e2e8f0;
//         }

//         /* ═══ Skills ═══ */
//         .pr-skills-wrap {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 5px;
//           margin-top: 12px;
//         }
//         .pr-skill-tag {
//           font-size: 11px;
//           color: #6366f1;
//           background: #eef2ff;
//           padding: 3px 10px;
//           border-radius: 100px;
//           border: 1px solid #e0e7ff;
//           font-weight: 500;
//         }
//         .pr-skills-more {
//           font-size: 11px;
//           color: #94a3b8;
//           padding: 3px 8px;
//         }

//         /* ═══ Card Footer ═══ */
//         .pr-card-footer {
//           padding: 14px 24px;
//           background: #fafbfc;
//           border-top: 1px solid #f1f5f9;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//         }
//         .pr-footer-label {
//           font-size: 11px;
//           color: #b0b8c4;
//         }
//         .pr-card-actions {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }
//         .pr-btn-select {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           padding: 9px 20px;
//           border-radius: 8px;
//           font-size: 13px;
//           font-weight: 600;
//           color: #fff;
//           background: #059669;
//           border: none;
//           cursor: pointer;
//           box-shadow: 0 2px 8px rgba(5,150,105,0.25);
//           transition: all 0.15s;
//         }
//         .pr-btn-select:hover:not(:disabled) {
//           box-shadow: 0 4px 12px rgba(5,150,105,0.35);
//           transform: translateY(-1px);
//         }
//         .pr-btn-select:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//           transform: none;
//         }
//         .pr-btn-reject {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           padding: 9px 20px;
//           border-radius: 8px;
//           font-size: 13px;
//           font-weight: 500;
//           color: #64748b;
//           background: #fff;
//           border: 1px solid #e2e8f0;
//           cursor: pointer;
//           transition: all 0.15s;
//         }
//         .pr-btn-reject:hover:not(:disabled) {
//           border-color: #fca5a5;
//           color: #dc2626;
//           background: #fef2f2;
//         }
//         .pr-btn-reject:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//           transform: none;
//         }
//         .pr-btn-loading {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           padding: 9px 20px;
//           border-radius: 8px;
//           font-size: 13px;
//           font-weight: 500;
//           cursor: wait;
//         }
//         .pr-spinner-sm {
//           width: 14px;
//           height: 14px;
//           border: 2px solid rgba(0,0,0,0.2);
//           border-top-color: currentColor;
//           border-radius: 50%;
//           display: inline-block;
//           animation: prSpin 0.6s linear infinite;
//         }

//         /* ═══ Responsive ═══ */
//         @media (max-width: 900px) {
//           .pr-content-area {
//             padding: 20px 16px !important;
//           }
//           .pr-stats-grid {
//             grid-template-columns: repeat(2, 1fr) !important;
//           }
//         }
//         @media (max-width: 600px) {
//           .pr-stats-grid {
//             grid-template-columns: 1fr !important;
//           }
//           .pr-card-footer {
//             flex-direction: column;
//             gap: 10px;
//             align-items: flex-start;
//           }
//           .pr-filter-tabs {
//             flex-wrap: wrap;
//           }
//           .pr-top-actions {
//             flex-wrap: wrap;
//           }
//           .pr-publish-btn {
//             width: 100%;
//             justify-content: center;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ManageStudents.css";

const API_BASE = "http://localhost:5000/api/admin";

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

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
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  );
}

// ══════════════════════════════════════════
// CONFIRM PUBLISH MODAL
// ══════════════════════════════════════════
function ConfirmPublishModal({ results, onClose, onConfirm, loading }) {
  const selected = results.filter((r) => r.finalStatus === "Selected");
  const rejected = results.filter((r) => r.finalStatus === "Rejected");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
        <div className="modal-header" style={{ border: "none", paddingBottom: 0 }}>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ paddingTop: 0 }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #fefce8, #fef9c3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              margin: "0 auto 18px",
            }}
          >
            🏆
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", margin: "0 0 6px 0" }}>
            Publish Placement Results
          </h2>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 20px" }}>
            This action will finalize and publish the placement results. Students will be notified.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "20px" }}>
            <div
              style={{
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                borderRadius: "10px",
                padding: "12px 20px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "22px", fontWeight: 700, color: "#065f46", margin: 0 }}>{selected.length}</p>
              <p style={{ fontSize: "11px", color: "#065f46", margin: "2px 0 0 0", fontWeight: 600 }}>Selected</p>
            </div>
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "10px",
                padding: "12px 20px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "22px", fontWeight: 700, color: "#991b1b", margin: 0 }}>{rejected.length}</p>
              <p style={{ fontSize: "11px", color: "#991b1b", margin: "2px 0 0 0", fontWeight: 600 }}>Rejected</p>
            </div>
          </div>

          <div
            style={{
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: "8px",
              padding: "10px 14px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: "14px" }}>⚠️</span>
            <span style={{ fontSize: "12px", color: "#92400e", lineHeight: 1.4 }}>
              <strong>Important:</strong> Published results cannot be undone. Please verify before confirming.
            </span>
          </div>
        </div>
        <div className="modal-footer" style={{ borderTop: "none", gap: "8px" }}>
          <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={loading || selected.length === 0}
            style={{ flex: 2 }}
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
                    animation: "prSpin 0.6s linear infinite",
                  }}
                />{" "}
                Publishing...
              </>
            ) : (
              "🏆 Publish Results"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// SUCCESS MODAL
// ══════════════════════════════════════════
function PublishSuccessModal({ selectedCount, rejectedCount, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
        <div className="modal-header" style={{ border: "none", paddingBottom: 0 }}>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ paddingTop: 0 }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              margin: "0 auto 18px",
            }}
          >
            🎉
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", margin: "0 0 6px 0" }}>
            Results Published!
          </h2>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px" }}>
            Placement results have been finalized and published successfully.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "16px" }}>
            <div
              style={{
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "12px",
                color: "#065f46",
                fontWeight: 600,
              }}
            >
              ✓ {selectedCount} Selected
            </div>
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "12px",
                color: "#991b1b",
                fontWeight: 600,
              }}
            >
              ✕ {rejectedCount} Rejected
            </div>
          </div>
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
            <span>📧</span> Students have been notified
          </div>
        </div>
        <div className="modal-footer" style={{ borderTop: "none" }}>
          <button className="btn btn-primary" onClick={onClose} style={{ width: "100%" }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// STUDENT RESULT CARD
// ══════════════════════════════════════════
function ResultCard({ item, index, onMarkSelected, onMarkRejected, loadingState }) {
  const isLoading = loadingState === "selecting" || loadingState === "rejecting";
  const student = item.student || {};
  const job = item.job || {};
  const company = job.company?.companyName || "Unknown";
  const studentName = student.name || "Unknown Student";
  const initials = studentName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const gradients = [
    "linear-gradient(135deg, #0d9488, #14b8a6)",
    "linear-gradient(135deg, #6366f1, #818cf8)",
    "linear-gradient(135deg, #f59e0b, #fbbf24)",
    "linear-gradient(135deg, #ef4444, #f87171)",
    "linear-gradient(135deg, #0ea5e9, #38bdf8)",
    "linear-gradient(135deg, #8b5cf6, #a78bfa)",
    "linear-gradient(135deg, #ec4899, #f472b6)",
  ];
  const grad = gradients[index % gradients.length];

  const isFinalized = item.finalStatus === "Selected" || item.finalStatus === "Rejected";

  return (
    <div
      className="pr-card"
      style={{
        opacity: isLoading ? 0.5 : 1,
        pointerEvents: isLoading ? "none" : "auto",
        borderLeftColor:
          item.finalStatus === "Selected"
            ? "#10b981"
            : item.finalStatus === "Rejected"
            ? "#ef4444"
            : "#e2e8f0",
      }}
    >
      <div style={{ padding: "22px 24px 16px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          <div className="pr-avatar" style={{ background: grad }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
              <div style={{ minWidth: 0 }}>
                <h3 className="pr-student-name">{studentName}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                  <span className="pr-meta-pill">
                    🎓 {student.university || "N/A"}
                  </span>
                  {student.gpa && (
                    <span className="pr-meta-pill pr-meta-pill-green">
                      GPA: {student.gpa}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
                <span className="pr-time">{formatTimeAgo(item.appliedAt || item.createdAt)}</span>
                {isFinalized ? (
                  <span
                    className="pr-badge"
                    style={{
                      background: item.finalStatus === "Selected" ? "#ecfdf5" : "#fef2f2",
                      color: item.finalStatus === "Selected" ? "#065f46" : "#991b1b",
                      borderColor: item.finalStatus === "Selected" ? "#a7f3d0" : "#fecaca",
                    }}
                  >
                    {item.finalStatus === "Selected" ? "✓ Selected" : "✕ Rejected"}
                  </span>
                ) : (
                  <span className="pr-badge-pending">⏳ Pending</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Job Info */}
        <div className="pr-job-box">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="pr-job-avatar">
              {(company[0] || "U").toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="pr-job-title">{job.title || "Unknown Job"}</p>
              <p className="pr-job-company">{company}</p>
            </div>
          </div>
          {(job.location || job.type) && (
            <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
              {job.location && <span className="pr-job-pill">📍 {job.location}</span>}
              {job.type && <span className="pr-job-pill">🕐 {job.type}</span>}
            </div>
          )}
        </div>

        {/* Skills */}
        {student.skills && (
          <div className="pr-skills-wrap">
            {student.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .slice(0, 5)
              .map((skill, i) => (
                <span key={i} className="pr-skill-tag">{skill}</span>
              ))}
            {student.skills.split(",").filter(Boolean).length > 5 && (
              <span className="pr-skills-more">
                +{student.skills.split(",").filter(Boolean).length - 5} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pr-card-footer">
        <span className="pr-footer-label">
          Applied {formatDate(item.appliedAt || item.createdAt)}
        </span>
        <div className="pr-card-actions">
          {loadingState === "selecting" ? (
            <LoadingBtn text="Selecting..." color="#059669" />
          ) : loadingState === "rejecting" ? (
            <LoadingBtn text="Rejecting..." color="#dc2626" />
          ) : (
            <>
              <button
                className="pr-btn-select"
                onClick={() => onMarkSelected(item._id)}
                disabled={isFinalized}
                style={item.finalStatus === "Selected" ? { background: "#059669", boxShadow: "0 0 0 0" } : {}}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Select
              </button>
              <button
                className="pr-btn-reject"
                onClick={() => onMarkRejected(item._id)}
                disabled={isFinalized}
                style={item.finalStatus === "Rejected" ? { background: "#dc2626", color: "#fff", border: "none" } : {}}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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

function LoadingBtn({ text, color }) {
  return (
    <button
      className="pr-btn-loading"
      disabled
      style={{ border: `1px solid ${color}30` }}
    >
      <span className="pr-spinner-sm" style={{ borderColor: color }} />
      {text}
    </button>
  );
}

// ══════════════════════════════════════════
// STAT ITEMS
// ══════════════════════════════════════════
const statItems = [
  {
    label: "Company Selected",
    valueKey: "companySelected",
    accentColor: "#3b82f6",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Admin Selected",
    valueKey: "adminSelected",
    accentColor: "#10b981",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    label: "Admin Rejected",
    valueKey: "adminRejected",
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
    label: "Pending Decision",
    valueKey: "pending",
    accentColor: "#f59e0b",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

// ══════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════
export default function PlacementResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [successModal, setSuccessModal] = useState(null);
  const [stats, setStats] = useState({
    companySelected: 0,
    adminSelected: 0,
    adminRejected: 0,
    pending: 0,
  });
  const [filterStatus, setFilterStatus] = useState("all");

  const getToken = () => localStorage.getItem("adminToken");

  const fetchResults = async () => {
    try {
      const res = await axios.get(`${API_BASE}/placement-results`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = Array.isArray(res.data?.results)
        ? res.data.results
        : Array.isArray(res.data)
          ? res.data
          : [];

      setResults(data);

      // Use stats from backend, or compute locally as fallback
      if (res.data?.stats) {
        setStats(res.data.stats);
      } else {
        setStats({
          companySelected: data.length,
          adminSelected: data.filter((r) => r.finalStatus === "Selected").length,
          adminRejected: data.filter((r) => r.finalStatus === "Rejected").length,
          pending: data.filter((r) => !r.finalStatus || r.finalStatus === "pending").length,
        });
      }

      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch placement results");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchResults();
  };

  const showToast = (message, type = "success") => setToast({ message, type });

  const handleMarkSelected = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: "selecting" }));
    try {
      await axios({
        method: "PATCH",
        url: `${API_BASE}/placement-results/${id}`,
        headers: { Authorization: `Bearer ${getToken()}` },
        data: { finalStatus: "Selected" },
      });
      setResults((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, finalStatus: "Selected" } : r
        )
      );
      setStats((prev) => ({
        ...prev,
        adminSelected: prev.adminSelected + 1,
        pending: Math.max(0, prev.pending - 1),
      }));
      showToast("Student marked as Selected");
    } catch (err) {
      showToast(err.response?.data?.error || err.response?.data?.message || err.message, "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleMarkRejected = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: "rejecting" }));
    try {
      await axios({
        method: "PATCH",
        url: `${API_BASE}/placement-results/${id}`,
        headers: { Authorization: `Bearer ${getToken()}` },
        data: { finalStatus: "Rejected" },
      });
      setResults((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, finalStatus: "Rejected" } : r
        )
      );
      setStats((prev) => ({
        ...prev,
        adminRejected: prev.adminRejected + 1,
        pending: Math.max(0, prev.pending - 1),
      }));
      showToast("Student marked as Rejected");
    } catch (err) {
      showToast(err.response?.data?.error || err.response?.data?.message || err.message, "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handlePublish = async () => {
    const finalized = results.filter(
      (r) => r.finalStatus === "Selected" || r.finalStatus === "Rejected"
    );
    if (finalized.length === 0) {
      showToast("No results to publish. Select or reject students first.", "error");
      return;
    }
    setConfirmModal(finalized);
  };

  const confirmPublish = async () => {
    try {
      await axios({
        method: "POST",
        url: `${API_BASE}/placement-results/publish`,
        headers: { Authorization: `Bearer ${getToken()}` },
        data: { results: confirmModal },
      });
      setConfirmModal(null);
      setSuccessModal({
        selectedCount: confirmModal.filter((r) => r.finalStatus === "Selected").length,
        rejectedCount: confirmModal.filter((r) => r.finalStatus === "Rejected").length,
      });
      showToast("Placement results published successfully!");
    } catch (err) {
      showToast(err.response?.data?.error || err.response?.data?.message || err.message, "error");
      setConfirmModal(null);
    }
  };

  // Computed: count of finalized results (for Publish button)
  const finalizedCount = results.filter(
    (r) => r.finalStatus === "Selected" || r.finalStatus === "Rejected"
  ).length;

  // Computed: pending count for filter tab
  const pendingCount = results.filter(
    (r) => !r.finalStatus || r.finalStatus === "pending"
  ).length;

  // Computed: filtered results for display
  const displayedResults = filterStatus === "all"
    ? results
    : filterStatus === "pending"
      ? results.filter((r) => !r.finalStatus || r.finalStatus === "pending")
      : results.filter((r) => r.finalStatus === filterStatus);

  return (
    <div className="dashboard-container">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* ═══════ SIDEBAR ═══════ */}
      <aside className="sidebar">
        <h2>🎓 Admin</h2>
        <ul>
          <li><Link to="/admin/dashboard">📊 Dashboard</Link></li>
          <li><Link to="/students">👨‍🎓 Students</Link></li>
          <li><Link to="/recruiters">🏢 Recruiters</Link></li>
          <li><Link to="/admin/approve-jobs">📄 Approve Jobs</Link></li>
          <li><Link to="/admin/applications">📬 Applications</Link></li>
          <li className="active"><span>✅ Results</span></li>
          {/* <li><Link to="/admin/reports">📈 Reports</Link></li> */}
        </ul>
      </aside>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <main className="main-content pr-main-content">
        <header className="top-nav pr-top-nav">
          <div>
            <h1>
              <b>🏆 Publish Final Placement Results</b>
            </h1>
            <p className="pr-subtitle">
              Review company selections and publish final placement outcomes for students
            </p>
          </div>
          <div className="pr-top-actions">
            {results.length > 0 && (
              <span className="pr-total-badge">{results.length} results</span>
            )}
            <button
              className="pr-refresh-btn"
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
                style={refreshing ? { animation: "prSpin 0.8s linear infinite" } : {}}
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Refresh
            </button>
            <button
              className="pr-publish-btn"
              onClick={handlePublish}
              disabled={finalizedCount === 0}
            >
              🏆 Publish Results
            </button>
          </div>
        </header>

        <div className="pr-content-area">
          {/* ═══════ STATS ═══════ */}
          <div className="pr-stats-grid">
            {statItems.map((s) => (
              <div key={s.label} className="pr-stat-card-pro">
                <div
                  className="pr-stat-icon-pro"
                  style={{
                    background: `${s.accentColor}0D`,
                    border: `1px solid ${s.accentColor}1A`,
                  }}
                >
                  {s.icon}
                </div>
                <div className="pr-stat-content-pro">
                  <span className="pr-stat-label-pro">{s.label}</span>
                  <span className="pr-stat-value-pro">{stats[s.valueKey]}</span>
                </div>
                <div
                  className="pr-stat-accent-line"
                  style={{ background: `${s.accentColor}40` }}
                />
              </div>
            ))}
          </div>

          {/* Info banner */}
          <div className="pr-info-banner">
            <span className="pr-info-icon">📋</span>
            <div>
              <strong className="pr-info-title">How It Works</strong>
              <p className="pr-info-text">
                Companies select students via their dashboard → Those selections appear here →
                You review and mark as <strong>Selected</strong> or <strong>Rejected</strong> →
                Click <strong>"Publish Results"</strong> to finalize
              </p>
            </div>
          </div>

          {/* Filter tabs */}
          {!loading && !error && results.length > 0 && (
            <div className="pr-filter-tabs">
              {[
                { key: "all", label: "All Results", count: results.length },
                { key: "pending", label: "Pending", count: pendingCount },
                { key: "Selected", label: "Selected", count: stats.adminSelected },
                { key: "Rejected", label: "Rejected", count: stats.adminRejected },
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`pr-filter-tab ${filterStatus === tab.key ? "pr-filter-active" : ""}`}
                  onClick={() => setFilterStatus(tab.key)}
                >
                  {tab.label}
                  <span className="pr-tab-count">{tab.count}</span>
                </button>
              ))}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="ms-error">
              <span>⚠️ {error}</span>
              <button onClick={handleRefresh}>Retry</button>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && !error && (
            <div className="pr-loading-skeleton">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="pr-skeleton-card"
                  style={{ animation: `prPulse 1.5s ease-in-out infinite ${i * 0.2}s` }}
                >
                  <div style={{ padding: "24px" }}>
                    <div style={{ display: "flex", gap: "14px", marginBottom: "16px" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f1f5f9" }} />
                      <div style={{ flex: 1 }}>
                        <div className="pr-skeleton-line" style={{ width: "35%", marginBottom: "8px" }} />
                        <div className="pr-skeleton-line" style={{ width: "20%" }} />
                      </div>
                    </div>
                    <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "14px", marginBottom: "12px" }}>
                      <div className="pr-skeleton-line" style={{ width: "50%", marginBottom: "6px" }} />
                      <div className="pr-skeleton-line" style={{ width: "30%" }} />
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {[1, 2, 3].map((j) => (
                        <div key={j} style={{ height: "26px", width: "70px", background: "#f1f5f9", borderRadius: "100px" }} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && results.length === 0 && (
            <div className="pr-empty-state">
              <div className="pr-empty-icon">📋</div>
              <h2 className="pr-empty-title">No results yet</h2>
              <p className="pr-empty-text">
                Placement results will appear here once companies start selecting students.
              </p>
              <button className="pr-empty-btn" onClick={handleRefresh} disabled={refreshing}>
                {refreshing ? <span className="pr-spinner-sm" /> : "↻"} Check for new results
              </button>
            </div>
          )}

          {/* Empty filtered */}
          {!loading && !error && results.length > 0 && displayedResults.length === 0 && (
            <div className="pr-empty-state">
              <div className="pr-empty-icon" style={{ background: "linear-gradient(135deg, #fefce8, #fef9c3)" }}>🔍</div>
              <h2 className="pr-empty-title">No matches found</h2>
              <p className="pr-empty-text">No results match this filter.</p>
              <button className="pr-empty-btn" onClick={() => setFilterStatus("all")}>
                Clear filter
              </button>
            </div>
          )}

          {/* Result list */}
          {!loading && !error && displayedResults.length > 0 && (
            <div className="pr-result-list">
              {displayedResults.map((item, i) => (
                <ResultCard
                  key={item._id || i}
                  item={item}
                  index={i}
                  onMarkSelected={handleMarkSelected}
                  onMarkRejected={handleMarkRejected}
                  loadingState={actionLoading[item._id]}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {confirmModal && (
        <ConfirmPublishModal
          results={confirmModal}
          onClose={() => setConfirmModal(null)}
          onConfirm={confirmPublish}
          loading={false}
        />
      )}
      {successModal && (
        <PublishSuccessModal
          selectedCount={successModal.selectedCount}
          rejectedCount={successModal.rejectedCount}
          onClose={() => {
            setSuccessModal(null);
            fetchResults();
          }}
        />
      )}

      <style>{`
        @keyframes prSpin { to { transform: rotate(360deg); } }
        @keyframes prPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

        .pr-main-content {
          display: flex !important;
          flex-direction: column;
          overflow: hidden;
        }
        .pr-top-nav {
          flex-wrap: wrap;
          gap: 12px;
        }
        .pr-subtitle {
          font-size: 12px;
          color: #94a3b8;
          margin: 3px 0 0 0;
        }
        .pr-top-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pr-total-badge {
          font-size: 12px;
          font-weight: 600;
          color: #4338ca;
          background: #eef2ff;
          padding: 6px 14px;
          border-radius: 100px;
          border: 1px solid #c7d2fe;
        }
        .pr-refresh-btn {
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
        .pr-refresh-btn:disabled { opacity: 0.5; cursor: wait; }
        .pr-publish-btn {
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
          box-shadow: 0 2px 10px rgba(16,185,129,0.3);
          transition: all 0.15s;
        }
        .pr-publish-btn:hover:not(:disabled) {
          box-shadow: 0 4px 16px rgba(16,185,129,0.4);
          transform: translateY(-1px);
        }
        .pr-publish-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .pr-content-area {
          flex: 1;
          overflow-y: auto;
          padding: 28px 32px;
        }

        /* ═══ Stats ═══ */
        .pr-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .pr-stat-card-pro {
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
        .pr-stat-card-pro:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 16px rgba(15,23,42,0.06);
        }
        .pr-stat-icon-pro {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .pr-stat-content-pro {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .pr-stat-label-pro {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          line-height: 1;
        }
        .pr-stat-value-pro {
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1;
          letter-spacing: -0.025em;
        }
        .pr-stat-accent-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .pr-stat-card-pro:hover .pr-stat-accent-line { opacity: 1; }

        /* ═══ Info Banner ═══ */
        .pr-info-banner {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 10px;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          margin-bottom: 24px;
        }
        .pr-info-icon {
          font-size: 15px;
          color: #0284c7;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .pr-info-title {
          font-size: 12px;
          color: #0369a1;
          display: block;
          margin-bottom: 2px;
        }
        .pr-info-text {
          font-size: 11px;
          color: #0284c7;
          margin: 0;
          line-height: 1.5;
        }

        /* ═══ Filter Tabs ═══ */
        .pr-filter-tabs {
          display: flex;
          gap: 6px;
          margin-bottom: 20px;
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e8ecf1;
          padding: 6px;
        }
        .pr-filter-tab {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          border-radius: 8px;
          border: 1px solid transparent;
          background: transparent;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s;
        }
        .pr-filter-tab:hover {
          background: #f1f5f9;
        }
        .pr-filter-active {
          background: #6366f1;
          color: #fff;
          border-color: #6366f1;
        }
        .pr-filter-active:hover {
          background: #4f46e5;
          color: #fff;
        }
        .pr-tab-count {
          font-size: 10px;
          font-weight: 700;
          background: rgba(255,255,255,0.25);
          padding: 1px 7px;
          border-radius: 100px;
          min-width: 22px;
          text-align: center;
        }

        /* ═══ Loading ═══ */
        .pr-loading-skeleton {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .pr-skeleton-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e8ecf1;
        }
        .pr-skeleton-line {
          height: 12px;
          background: #f1f5f9;
          border-radius: 4px;
        }

        /* ═══ Empty ═══ */
        .pr-empty-state {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e8ecf1;
          padding: 60px 24px;
          text-align: center;
        }
        .pr-empty-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          display: flex;
          align-items: center;
          justifyContent: center;
          margin: 0 auto 20px;
          font-size: 30px;
        }
        .pr-empty-title {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px 0;
        }
        .pr-empty-text {
          font-size: 13px;
          color: #94a3b8;
          margin: 0 0 20px 0;
        }
        .pr-empty-btn {
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
        .pr-empty-btn:disabled { opacity: 0.5; cursor: wait; }

        /* ═══ Result List ═══ */
        .pr-result-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ═══ Result Card ═══ */
        .pr-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e8ecf1;
          overflow: hidden;
          transition: all 0.2s;
          border-left: 4px solid #e2e8f0;
        }
        .pr-card:hover {
          box-shadow: 0 4px 20px rgba(15,23,42,0.06);
        }
        .pr-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .pr-student-name {
          font-size: 15px;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 2px 0;
        }
        .pr-meta-pill {
          font-size: 11px;
          color: #475569;
          background: #f1f5f9;
          padding: 3px 10px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .pr-meta-pill-green {
          color: #065f46;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
        }
        .pr-time {
          font-size: 11px;
          color: #94a3b8;
          white-space: nowrap;
        }
        .pr-badge-pending {
          font-size: 10px;
          font-weight: 600;
          color: #92400e;
          background: #fef3c7;
          padding: 3px 10px;
          border-radius: 100px;
          border: 1px solid #fde68a;
          white-space: nowrap;
          animation: prPulse 2s ease-in-out infinite;
        }
        .pr-badge {
          font-size: 10px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 100px;
          white-space: nowrap;
        }

        /* ═══ Job Box ═══ */
        .pr-job-box {
          margin-top: 14px;
          background: #fafbfc;
          border-radius: 10px;
          border: 1px solid #f1f5f9;
          padding: 12px 14px;
        }
        .pr-job-avatar {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: linear-gradient(135deg, #eef2ff, #e0e7ff);
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .pr-job-title {
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 2px 0;
        }
        .pr-job-company {
          font-size: 11px;
          color: #64748b;
          margin: 0;
        }
        .pr-job-pill {
          font-size: 10px;
          color: #64748b;
          background: #fff;
          padding: 3px 10px;
          border-radius: 100px;
          border: 1px solid #e2e8f0;
        }

        /* ═══ Skills ═══ */
        .pr-skills-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 12px;
        }
        .pr-skill-tag {
          font-size: 11px;
          color: #6366f1;
          background: #eef2ff;
          padding: 3px 10px;
          border-radius: 100px;
          border: 1px solid #e0e7ff;
          font-weight: 500;
        }
        .pr-skills-more {
          font-size: 11px;
          color: #94a3b8;
          padding: 3px 8px;
        }

        /* ═══ Card Footer ═══ */
        .pr-card-footer {
          padding: 14px 24px;
          background: #fafbfc;
          border-top: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .pr-footer-label {
          font-size: 11px;
          color: #b0b8c4;
        }
        .pr-card-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pr-btn-select {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          background: #059669;
          border: none;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(5,150,105,0.25);
          transition: all 0.15s;
        }
        .pr-btn-select:hover:not(:disabled) {
          box-shadow: 0 4px 12px rgba(5,150,105,0.35);
          transform: translateY(-1px);
        }
        .pr-btn-select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .pr-btn-reject {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
          background: #fff;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.15s;
        }
        .pr-btn-reject:hover:not(:disabled) {
          border-color: #fca5a5;
          color: #dc2626;
          background: #fef2f2;
        }
        .pr-btn-reject:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .pr-btn-loading {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: wait;
        }
        .pr-spinner-sm {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: currentColor;
          border-radius: 50%;
          display: inline-block;
          animation: prSpin 0.6s linear infinite;
        }

        /* ═══ Responsive ═══ */
        @media (max-width: 900px) {
          .pr-content-area {
            padding: 20px 16px !important;
          }
          .pr-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .pr-stats-grid {
            grid-template-columns: 1fr !important;
          }
          .pr-card-footer {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }
          .pr-filter-tabs {
            flex-wrap: wrap;
          }
          .pr-top-actions {
            flex-wrap: wrap;
          }
          .pr-publish-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}