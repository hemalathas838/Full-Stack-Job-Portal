// import { useEffect, useState, useMemo, useCallback } from "react";
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
//   return formatDate(dateStr);
// };

// const statusConfig = {
//   applied: {
//     label: "Applied",
//     bg: "#eff6ff",
//     border: "#bfdbfe",
//     color: "#1d4ed8",
//     icon: (
//       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//         <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
//       </svg>
//     ),
//   },
//   shortlisted: {
//     label: "Shortlisted",
//     bg: "#fefce8",
//     border: "#fde68a",
//     color: "#a16207",
//     icon: (
//       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//       </svg>
//     ),
//   },
//   selected: {
//     label: "Selected",
//     bg: "#ecfdf5",
//     border: "#a7f3d0",
//     color: "#065f46",
//     icon: (
//       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
//       </svg>
//     ),
//   },
//   rejected: {
//     label: "Rejected",
//     bg: "#fef2f2",
//     border: "#fecaca",
//     color: "#991b1b",
//     icon: (
//       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//         <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
//       </svg>
//     ),
//   },
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
//   const cls = toast.type === "success" ? "toast-success" : toast.type === "error" ? "toast-error" : "toast-info";
//   return (
//     <div className={`toast-container ${cls}`}>
//       <span className="toast-icon">{toast.type === "success" ? "✓" : "✕"}</span>
//       <span className="toast-msg">{toast.message}</span>
//       <button className="toast-close" onClick={onClose}>✕</button>
//     </div>
//   );
// }

// // ══════════════════════════════════════════
// // STAT ICONS
// // ══════════════════════════════════════════
// const statDefs = [
//   {
//     label: "Total Applications",
//     key: "total",
//     accent: "#6366f1",
//     icon: (
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
//       </svg>
//     ),
//   },
//   {
//     label: "Unique Students",
//     key: "students",
//     accent: "#0d9488",
//     icon: (
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
//       </svg>
//     ),
//   },
//   {
//     label: "Companies",
//     key: "companies",
//     accent: "#f59e0b",
//     icon: (
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
//       </svg>
//     ),
//   },
//   {
//     label: "Open Positions",
//     key: "jobs",
//     accent: "#10b981",
//     icon: (
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
//       </svg>
//     ),
//   },
// ];

// // ══════════════════════════════════════════
// // APPLICATION ROW
// // ══════════════════════════════════════════
// function AppRow({ app, index }) {
//   const student = app.student || {};
//   const job = app.job || {};
//   const company = job.company?.companyName || job.companyName || "Unknown";
//   const status = app.status || "applied";
//   const sc = statusConfig[status] || statusConfig.applied;
//   const studentName = student.name || student.fullName || "Unknown Student";
//   const dept = student.department || student.branch || "";
//   const cgpa = student.cgpa || "";
//   const initials = studentName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

//   const gradients = [
//     "linear-gradient(135deg,#0d9488,#14b8a6)",
//     "linear-gradient(135deg,#6366f1,#818cf8)",
//     "linear-gradient(135deg,#f59e0b,#fbbf24)",
//     "linear-gradient(135deg,#ef4444,#f87171)",
//     "linear-gradient(135deg,#0ea5e9,#38bdf8)",
//     "linear-gradient(135deg,#8b5cf6,#a78bfa)",
//     "linear-gradient(135deg,#ec4899,#f472b6)",
//   ];
//   const grad = gradients[index % gradients.length];

//   return (
//     <div className="am-row">
//       {/* Index */}
//       <div className="am-row-idx">{index + 1}</div>

//       {/* Student */}
//       <div className="am-row-student">
//         <div className="am-avatar" style={{ background: grad }}>{initials}</div>
//         <div className="am-student-info">
//           <span className="am-student-name">{studentName}</span>
//           <span className="am-student-meta">
//             {dept}{dept && cgpa ? " · " : ""}{cgpa ? `CGPA ${cgpa}` : ""}
//           </span>
//         </div>
//       </div>

//       {/* Arrow */}
//       <div className="am-arrow-wrap">
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
//         </svg>
//       </div>

//       {/* Job */}
//       <div className="am-row-job">
//         <div className="am-job-avatar">
//           {(company[0] || "U").toUpperCase()}
//         </div>
//         <div className="am-job-info">
//           <span className="am-job-title">{job.title || "Unknown Job"}</span>
//           <span className="am-job-company">{company}</span>
//         </div>
//       </div>

//       {/* Date */}
//       <div className="am-row-date">
//         <span className="am-date-primary">{formatDate(app.appliedAt || app.createdAt)}</span>
//         <span className="am-date-secondary">{formatTimeAgo(app.appliedAt || app.createdAt)}</span>
//       </div>

//       {/* Status */}
//       <div className="am-row-status">
//         <span
//           className="am-status-badge"
//           style={{ background: sc.bg, borderColor: sc.border, color: sc.color }}
//         >
//           {sc.icon} {sc.label}
//         </span>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════
// // MAIN COMPONENT
// // ══════════════════════════════════════════
// export default function AdminApplications() {
//   const [apps, setApps] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [refreshing, setRefreshing] = useState(false);
//   const [toast, setToast] = useState(null);

//   // Filters
//   const [filterCompany, setFilterCompany] = useState("");
//   const [filterJob, setFilterJob] = useState("");
//   const [filterStudent, setFilterStudent] = useState("");
//   const [filterStatus, setFilterStatus] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [viewMode, setViewMode] = useState("list"); // list | compact

//   const getToken = () => localStorage.getItem("adminToken");

//   const fetchApps = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/applications`, {
//         headers: { Authorization: `Bearer ${getToken()}` },
//       });
//       const data = Array.isArray(res.data?.applications) ? res.data.applications : Array.isArray(res.data) ? res.data : [];
//       setApps(data);
//       setError("");
//     } catch (err) {
//       setError("Failed to fetch applications");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => { fetchApps(); }, []);

//   const handleRefresh = () => { setRefreshing(true); fetchApps(); };
//   const showToast = (msg, type = "success") => setToast({ message: msg, type });

//   // ── Derived filter options ──
//   const companies = useMemo(() => {
//     const set = new Set();
//     apps.forEach((a) => {
//       const c = a.job?.company?.companyName || a.job?.companyName || "";
//       if (c) set.add(c);
//     });
//     return [...set].sort();
//   }, [apps]);

//   const jobs = useMemo(() => {
//     const set = new Set();
//     apps.forEach((a) => {
//       const t = a.job?.title || "";
//       if (t) set.add(t);
//     });
//     return [...set].sort();
//   }, [apps]);

//   const students = useMemo(() => {
//     const set = new Set();
//     apps.forEach((a) => {
//       const n = a.student?.name || a.student?.fullName || "";
//       if (n) set.add(n);
//     });
//     return [...set].sort();
//   }, [apps]);

//   // ── Filtered + searched ──
//   const filtered = useMemo(() => {
//     let result = apps;
//     if (filterCompany) result = result.filter((a) => (a.job?.company?.companyName || a.job?.companyName || "") === filterCompany);
//     if (filterJob) result = result.filter((a) => (a.job?.title || "") === filterJob);
//     if (filterStudent) result = result.filter((a) => (a.student?.name || a.student?.fullName || "") === filterStudent);
//     if (filterStatus) result = result.filter((a) => (a.status || "applied") === filterStatus);
//     if (searchQuery.trim()) {
//       const q = searchQuery.toLowerCase();
//       result = result.filter((a) => {
//         const sn = (a.student?.name || a.student?.fullName || "").toLowerCase();
//         const jt = (a.job?.title || "").toLowerCase();
//         const cn = (a.job?.company?.companyName || a.job?.companyName || "").toLowerCase();
//         return sn.includes(q) || jt.includes(q) || cn.includes(q);
//       });
//     }
//     return result;
//   }, [apps, filterCompany, filterJob, filterStudent, filterStatus, searchQuery]);

//   // ── Stats ──
//   const stats = useMemo(() => ({
//     total: apps.length,
//     students: new Set(apps.map((a) => a.student?._id || a.student?.name).filter(Boolean)).size,
//     companies: new Set(apps.map((a) => a.job?.company?._id || a.job?.company?.companyName).filter(Boolean)).size,
//     jobs: new Set(apps.map((a) => a.job?._id || a.job?.title).filter(Boolean)).size,
//   }), [apps]);

//   const clearFilters = () => {
//     setFilterCompany("");
//     setFilterJob("");
//     setFilterStudent("");
//     setFilterStatus("");
//     setSearchQuery("");
//   };

//   const hasActiveFilter = filterCompany || filterJob || filterStudent || filterStatus || searchQuery;

//   const selectCls = "am-select";
//   const selectCommon = {
//     display: "block",
//     width: "100%",
//     padding: "9px 32px 9px 12px",
//     borderRadius: "8px",
//     border: "1px solid #e2e8f0",
//     fontSize: "13px",
//     fontWeight: 500,
//     color: "#334155",
//     background: "#fff",
//     appearance: "none",
//     WebkitAppearance: "none",
//     fontFamily: "inherit",
//     cursor: "pointer",
//     outline: "none",
//     transition: "border-color 0.15s",
//   };

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
//           <li className="active">📬 Applications</li>
//           <li><Link to="/admin/results">✅ Results</Link></li>
//           <li><Link to="/admin/reports">📈 Reports</Link></li>
//         </ul>
//       </aside>

//       {/* ═══════ MAIN ═══════ */}
//       <main className="main-content am-main-content">
//         <header className="top-nav am-top-nav">
//           <div>
//             <h1><b>📬 Application Monitor</b></h1>
//             <p className="am-subtitle">
//               Track which students applied to which jobs — filter by company, job, or student
//             </p>
//           </div>
//           <div className="am-top-actions">
//             {apps.length > 0 && (
//               <span className="am-count-badge">
//                 {filtered.length} of {apps.length} applications
//               </span>
//             )}
//             <button className="am-refresh-btn" onClick={handleRefresh} disabled={refreshing}>
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={refreshing ? { animation: "amSpin 0.8s linear infinite" } : {}}>
//                 <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
//                 <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
//               </svg>
//               Refresh
//             </button>
//           </div>
//         </header>

//         <div className="am-content-area">
//           {/* ── Stats ── */}
//           <div className="am-stats-grid">
//             {statDefs.map((s) => (
//               <div key={s.key} className="am-stat-card">
//                 <div className="am-stat-icon" style={{ background: `${s.accent}0D`, border: `1px solid ${s.accent}1A` }}>
//                   {s.icon}
//                 </div>
//                 <div className="am-stat-content">
//                   <span className="am-stat-label">{s.label}</span>
//                   <span className="am-stat-value">{stats[s.key]}</span>
//                 </div>
//                 <div className="am-stat-line" style={{ background: `${s.accent}40` }} />
//               </div>
//             ))}
//           </div>

//           {/* ── Filter Bar ── */}
//           <div className="am-filter-bar">
//             <div className="am-filter-row">
//               {/* Search */}
//               <div className="am-search-wrap">
//                 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
//                 </svg>
//                 <input
//                   type="text"
//                   className="am-search-input"
//                   placeholder="Search student, job, or company..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//                 {searchQuery && (
//                   <button className="am-search-clear" onClick={() => setSearchQuery("")}>✕</button>
//                 )}
//               </div>

//               {/* Dropdowns */}
//               <div className="am-filter-selects">
//                 <div className="am-select-wrap">
//                   <select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)} style={selectCommon}>
//                     <option value="">All Companies</option>
//                     {companies.map((c) => <option key={c} value={c}>{c}</option>)}
//                   </select>
//                   <svg className="am-select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
//                 </div>

//                 <div className="am-select-wrap">
//                   <select value={filterJob} onChange={(e) => setFilterJob(e.target.value)} style={selectCommon}>
//                     <option value="">All Jobs</option>
//                     {jobs.map((j) => <option key={j} value={j}>{j}</option>)}
//                   </select>
//                   <svg className="am-select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
//                 </div>

//                 <div className="am-select-wrap">
//                   <select value={filterStudent} onChange={(e) => setFilterStudent(e.target.value)} style={selectCommon}>
//                     <option value="">All Students</option>
//                     {students.map((s) => <option key={s} value={s}>{s}</option>)}
//                   </select>
//                   <svg className="am-select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
//                 </div>

//                 <div className="am-select-wrap">
//                   <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={selectCommon}>
//                     <option value="">All Statuses</option>
//                     {Object.entries(statusConfig).map(([k, v]) => (
//                       <option key={k} value={k}>{v.label}</option>
//                     ))}
//                   </select>
//                   <svg className="am-select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
//                 </div>
//               </div>

//               {/* Clear + View toggle */}
//               <div className="am-filter-actions">
//                 {hasActiveFilter && (
//                   <button className="am-clear-btn" onClick={clearFilters}>
//                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
//                     Clear filters
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Active filter pills */}
//             {hasActiveFilter && (
//               <div className="am-active-pills">
//                 {filterCompany && <FilterPill label={filterCompany} onRemove={() => setFilterCompany("")} />}
//                 {filterJob && <FilterPill label={filterJob} onRemove={() => setFilterJob("")} />}
//                 {filterStudent && <FilterPill label={filterStudent} onRemove={() => setFilterStudent("")} />}
//                 {filterStatus && <FilterPill label={statusConfig[filterStatus]?.label || filterStatus} onRemove={() => setFilterStatus("")} />}
//                 {searchQuery && <FilterPill label={`Search: "${searchQuery}"`} onRemove={() => setSearchQuery("")} />}
//               </div>
//             )}
//           </div>

//           {/* ── Error ── */}
//           {error && !loading && (
//             <div className="ms-error">
//               <span>⚠️ {error}</span>
//               <button onClick={handleRefresh}>Retry</button>
//             </div>
//           )}

//           {/* ── Loading Skeleton ── */}
//           {loading && !error && (
//             <div className="am-skeleton-list">
//               {[1, 2, 3, 4, 5].map((i) => (
//                 <div key={i} className="am-skeleton-row" style={{ animation: `amPulse 1.5s ease-in-out infinite ${i * 0.12}s` }}>
//                   <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f1f5f9" }} />
//                   <div style={{ flex: 1, display: "flex", gap: "16px", alignItems: "center" }}>
//                     <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "#f1f5f9", flexShrink: 0 }} />
//                     <div style={{ flex: 1 }}>
//                       <div className="am-skel-line" style={{ width: "30%", marginBottom: "6px" }} />
//                       <div className="am-skel-line" style={{ width: "18%" }} />
//                     </div>
//                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
//                     <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "#f1f5f9", flexShrink: 0 }} />
//                     <div style={{ flex: 1 }}>
//                       <div className="am-skel-line" style={{ width: "35%", marginBottom: "6px" }} />
//                       <div className="am-skel-line" style={{ width: "22%" }} />
//                     </div>
//                   </div>
//                   <div style={{ width: "70px" }}>
//                     <div className="am-skel-line" style={{ width: "100%", marginBottom: "4px" }} />
//                     <div className="am-skel-line" style={{ width: "60%" }} />
//                   </div>
//                   <div style={{ width: "90px", height: "28px", borderRadius: "6px", background: "#f1f5f9" }} />
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* ── Empty (no data at all) ── */}
//           {!loading && !error && apps.length === 0 && (
//             <div className="am-empty-state">
//               <div className="am-empty-icon">
//                 <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
//                 </svg>
//               </div>
//               <h2 className="am-empty-title">No applications yet</h2>
//               <p className="am-empty-text">Applications will appear here once students start applying to jobs.</p>
//               <button className="am-empty-btn" onClick={handleRefresh} disabled={refreshing}>
//                 {refreshing ? <span className="am-spinner-sm" /> : "↻"} Check again
//               </button>
//             </div>
//           )}

//           {/* ── Empty (filtered) ── */}
//           {!loading && !error && apps.length > 0 && filtered.length === 0 && (
//             <div className="am-empty-state">
//               <div className="am-empty-icon" style={{ background: "linear-gradient(135deg, #fefce8, #fef9c3)" }}>
//                 <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#a16207" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//                   <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" />
//                 </svg>
//               </div>
//               <h2 className="am-empty-title">No matches found</h2>
//               <p className="am-empty-text">Try adjusting your filters or search query.</p>
//               <button className="am-empty-btn" onClick={clearFilters}>Clear all filters</button>
//             </div>
//           )}

//           {/* ── List Header ── */}
//           {!loading && !error && filtered.length > 0 && (
//             <>
//               <div className="am-list-header">
//                 <div className="am-hdr-idx">#</div>
//                 <div className="am-hdr-student">Student</div>
//                 <div className="am-hdr-arrow" />
//                 <div className="am-hdr-job">Applied To</div>
//                 <div className="am-hdr-date">Applied On</div>
//                 <div className="am-hdr-status">Status</div>
//               </div>

//               <div className="am-list-body">
//                 {filtered.map((app, i) => (
//                   <AppRow key={app._id || i} app={app} index={i} />
//                 ))}
//               </div>

//               {/* Footer summary */}
//               <div className="am-list-footer">
//                 <span className="am-footer-text">
//                   Showing <strong>{filtered.length}</strong> of <strong>{apps.length}</strong> applications
//                 </span>
//                 <div className="am-footer-statuses">
//                   {Object.entries(statusConfig).map(([key, sc]) => {
//                     const count = apps.filter((a) => (a.status || "applied") === key).length;
//                     return (
//                       <span key={key} className="am-footer-chip" style={{ background: sc.bg, borderColor: sc.border, color: sc.color }}>
//                         {sc.icon} {sc.label}: {count}
//                       </span>
//                     );
//                   })}
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </main>

//       <style>{`
//         @keyframes amSpin { to { transform: rotate(360deg); } }
//         @keyframes amPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

//         .am-main-content {
//           display: flex !important;
//           flex-direction: column;
//           overflow: hidden;
//         }
//         .am-top-nav {
//           flex-wrap: wrap;
//           gap: 12px;
//         }
//         .am-subtitle {
//           font-size: 12px;
//           color: #94a3b8;
//           margin: 3px 0 0 0;
//         }
//         .am-top-actions {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//         }
//         .am-count-badge {
//           font-size: 12px;
//           font-weight: 600;
//           color: #4338ca;
//           background: #eef2ff;
//           padding: 6px 14px;
//           border-radius: 100px;
//           border: 1px solid #c7d2fe;
//         }
//         .am-refresh-btn {
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
//           transition: all 0.15s;
//         }
//         .am-refresh-btn:hover { background: #e2e8f0; }
//         .am-refresh-btn:disabled { opacity: 0.5; cursor: wait; }
//         .am-content-area {
//           flex: 1;
//           overflow-y: auto;
//           padding: 28px 32px;
//         }

//         /* ══ Stats ══ */
//         .am-stats-grid {
//           display: grid;
//           grid-template-columns: repeat(4, 1fr);
//           gap: 16px;
//           margin-bottom: 24px;
//         }
//         .am-stat-card {
//           position: relative;
//           background: #fff;
//           border-radius: 12px;
//           border: 1px solid #e8ecf1;
//           padding: 20px;
//           display: flex;
//           align-items: flex-start;
//           gap: 14px;
//           overflow: hidden;
//           transition: border-color 0.2s, box-shadow 0.2s;
//         }
//         .am-stat-card:hover {
//           border-color: #cbd5e1;
//           box-shadow: 0 4px 16px rgba(15,23,42,0.06);
//         }
//         .am-stat-icon {
//           width: 40px;
//           height: 40px;
//           border-radius: 10px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           flex-shrink: 0;
//         }
//         .am-stat-content {
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//           gap: 4px;
//         }
//         .am-stat-label {
//           font-size: 11px;
//           font-weight: 600;
//           color: #94a3b8;
//           text-transform: uppercase;
//           letter-spacing: 0.04em;
//           line-height: 1;
//         }
//         .am-stat-value {
//           font-size: 28px;
//           font-weight: 700;
//           color: #0f172a;
//           line-height: 1;
//           letter-spacing: -0.025em;
//         }
//         .am-stat-line {
//           position: absolute;
//           bottom: 0;
//           left: 0;
//           right: 0;
//           height: 2px;
//           opacity: 0;
//           transition: opacity 0.2s;
//         }
//         .am-stat-card:hover .am-stat-line { opacity: 1; }

//         /* ══ Filter Bar ══ */
//         .am-filter-bar {
//           background: #fff;
//           border-radius: 12px;
//           border: 1px solid #e8ecf1;
//           padding: 16px 18px;
//           margin-bottom: 20px;
//         }
//         .am-filter-row {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           flex-wrap: wrap;
//         }
//         .am-search-wrap {
//           position: relative;
//           flex: 1;
//           min-width: 220px;
//         }
//         .am-search-wrap > svg:first-child {
//           position: absolute;
//           left: 12px;
//           top: 50%;
//           transform: translateY(-50%);
//           pointer-events: none;
//         }
//         .am-search-input {
//           width: 100%;
//           padding: 9px 36px 9px 38px;
//           border-radius: 8px;
//           border: 1px solid #e2e8f0;
//           font-size: 13px;
//           font-weight: 500;
//           color: #334155;
//           background: #f8fafc;
//           outline: none;
//           font-family: inherit;
//           transition: border-color 0.15s, background 0.15s;
//         }
//         .am-search-input:focus {
//           border-color: #6366f1;
//           background: #fff;
//           box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
//         }
//         .am-search-input::placeholder { color: #94a3b8; }
//         .am-search-clear {
//           position: absolute;
//           right: 8px;
//           top: 50%;
//           transform: translateY(-50%);
//           background: #e2e8f0;
//           border: none;
//           width: 20px;
//           height: 20px;
//           border-radius: 50%;
//           font-size: 10px;
//           color: #64748b;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transition: background 0.15s;
//         }
//         .am-search-clear:hover { background: #cbd5e1; }

//         .am-filter-selects {
//           display: flex;
//           gap: 10px;
//           flex-wrap: wrap;
//         }
//         .am-select-wrap {
//           position: relative;
//           min-width: 150px;
//         }
//         .am-select-chevron {
//           position: absolute;
//           right: 10px;
//           top: 50%;
//           transform: translateY(-50%);
//           pointer-events: none;
//         }
//         .am-select-wrap select:focus {
//           border-color: #6366f1;
//           box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
//         }

//         .am-filter-actions {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }
//         .am-clear-btn {
//           display: inline-flex;
//           align-items: center;
//           gap: 5px;
//           padding: 8px 14px;
//           border-radius: 8px;
//           font-size: 12px;
//           font-weight: 600;
//           color: #64748b;
//           background: #f1f5f9;
//           border: 1px solid #e2e8f0;
//           cursor: pointer;
//           transition: all 0.15s;
//           white-space: nowrap;
//         }
//         .am-clear-btn:hover { background: #e2e8f0; color: #334155; }

//         .am-active-pills {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 6px;
//           margin-top: 12px;
//           padding-top: 12px;
//           border-top: 1px solid #f1f5f9;
//         }

//         /* ══ List Header ══ */
//         .am-list-header {
//           display: flex;
//           align-items: center;
//           gap: 0;
//           padding: 0 18px;
//           margin-bottom: 6px;
//         }
//         .am-hdr-idx { width: 36px; flex-shrink: 0; }
//         .am-hdr-student { flex: 1.2; min-width: 0; }
//         .am-hdr-arrow { width: 40px; flex-shrink: 0; text-align: center; }
//         .am-hdr-job { flex: 1.2; min-width: 0; }
//         .am-hdr-date { width: 120px; flex-shrink: 0; }
//         .am-hdr-status { width: 130px; flex-shrink: 0; text-align: right; }
//         .am-list-header > div {
//           font-size: 10px;
//           font-weight: 700;
//           color: #94a3b8;
//           text-transform: uppercase;
//           letter-spacing: 0.08em;
//           padding: 8px 0;
//         }

//         /* ══ List Body ══ */
//         .am-list-body {
//           display: flex;
//           flex-direction: column;
//           gap: 4px;
//           background: #fff;
//           border-radius: 12px;
//           border: 1px solid #e8ecf1;
//           padding: 8px 0;
//           overflow: hidden;
//         }

//         /* ══ Row ══ */
//         .am-row {
//           display: flex;
//           align-items: center;
//           gap: 0;
//           padding: 12px 18px;
//           transition: background 0.12s;
//           border-bottom: 1px solid #f8fafc;
//         }
//         .am-row:last-child { border-bottom: none; }
//         .am-row:hover { background: #f8fafc; }
//         .am-row-idx {
//           width: 36px;
//           flex-shrink: 0;
//           font-size: 11px;
//           font-weight: 600;
//           color: #cbd5e1;
//         }
//         .am-row-student {
//           flex: 1.2;
//           min-width: 0;
//           display: flex;
//           align-items: center;
//           gap: 12px;
//         }
//         .am-avatar {
//           width: 40px;
//           height: 40px;
//           border-radius: 10px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 12px;
//           font-weight: 700;
//           color: #fff;
//           flex-shrink: 0;
//           box-shadow: 0 2px 8px rgba(0,0,0,0.08);
//         }
//         .am-student-info {
//           display: flex;
//           flex-direction: column;
//           gap: 2px;
//           min-width: 0;
//         }
//         .am-student-name {
//           font-size: 13px;
//           font-weight: 600;
//           color: #0f172a;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }
//         .am-student-meta {
//           font-size: 11px;
//           color: #94a3b8;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }
//         .am-arrow-wrap {
//           width: 40px;
//           flex-shrink: 0;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }
//         .am-row-job {
//           flex: 1.2;
//           min-width: 0;
//           display: flex;
//           align-items: center;
//           gap: 12px;
//         }
//         .am-job-avatar {
//           width: 40px;
//           height: 40px;
//           border-radius: 10px;
//           background: linear-gradient(135deg, #eef2ff, #e0e7ff);
//           color: #4f46e5;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 14px;
//           font-weight: 700;
//           flex-shrink: 0;
//         }
//         .am-job-info {
//           display: flex;
//           flex-direction: column;
//           gap: 2px;
//           min-width: 0;
//         }
//         .am-job-title {
//           font-size: 13px;
//           font-weight: 600;
//           color: #0f172a;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }
//         .am-job-company {
//           font-size: 11px;
//           color: #64748b;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }
//         .am-row-date {
//           width: 120px;
//           flex-shrink: 0;
//           display: flex;
//           flex-direction: column;
//           gap: 2px;
//         }
//         .am-date-primary {
//           font-size: 12px;
//           font-weight: 500;
//           color: #334155;
//         }
//         .am-date-secondary {
//           font-size: 10px;
//           color: #94a3b8;
//         }
//         .am-row-status {
//           width: 130px;
//           flex-shrink: 0;
//           display: flex;
//           justify-content: flex-end;
//         }
//         .am-status-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 5px;
//           padding: 5px 12px;
//           border-radius: 6px;
//           font-size: 11px;
//           font-weight: 600;
//           border: 1px solid;
//           white-space: nowrap;
//         }

//         /* ══ List Footer ══ */
//         .am-list-footer {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 14px 4px 0;
//           gap: 12px;
//           flex-wrap: wrap;
//         }
//         .am-footer-text {
//           font-size: 12px;
//           color: #94a3b8;
//         }
//         .am-footer-text strong { color: #475569; }
//         .am-footer-statuses {
//           display: flex;
//           gap: 8px;
//           flex-wrap: wrap;
//         }
//         .am-footer-chip {
//           display: inline-flex;
//           align-items: center;
//           gap: 4px;
//           padding: 4px 10px;
//           border-radius: 6px;
//           font-size: 11px;
//           font-weight: 600;
//           border: 1px solid;
//         }

//         /* ══ Skeleton ══ */
//         .am-skeleton-list {
//           display: flex;
//           flex-direction: column;
//           gap: 0;
//           background: #fff;
//           border-radius: 12px;
//           border: 1px solid #e8ecf1;
//           padding: 16px 18px;
//           overflow: hidden;
//         }
//         .am-skeleton-row {
//           display: flex;
//           align-items: center;
//           gap: 14px;
//           padding: 10px 0;
//           border-bottom: 1px solid #f8fafc;
//         }
//         .am-skeleton-row:last-child { border-bottom: none; }
//         .am-skel-line {
//           height: 12px;
//           background: #f1f5f9;
//           border-radius: 4px;
//         }

//         /* ══ Empty ══ */
//         .am-empty-state {
//           background: #fff;
//           border-radius: 14px;
//           border: 1px solid #e8ecf1;
//           padding: 60px 24px;
//           text-align: center;
//         }
//         .am-empty-icon {
//           width: 72px;
//           height: 72px;
//           border-radius: 50%;
//           background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin: 0 auto 20px;
//         }
//         .am-empty-title {
//           font-size: 20px;
//           font-weight: 700;
//           color: #0f172a;
//           margin: 0 0 6px;
//         }
//         .am-empty-text {
//           font-size: 13px;
//           color: #94a3b8;
//           margin: 0 0 20px;
//         }
//         .am-empty-btn {
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
//           transition: opacity 0.15s;
//         }
//         .am-empty-btn:hover { opacity: 0.9; }
//         .am-empty-btn:disabled { opacity: 0.5; cursor: wait; }
//         .am-spinner-sm {
//           width: 14px;
//           height: 14px;
//           border: 2px solid rgba(255,255,255,0.3);
//           border-top-color: #fff;
//           border-radius: 50%;
//           display: inline-block;
//           animation: amSpin 0.6s linear infinite;
//         }

//         /* ══ Responsive ══ */
//         @media (max-width: 1100px) {
//           .am-stats-grid { grid-template-columns: repeat(2, 1fr); }
//           .am-hdr-date, .am-row-date { width: 100px; }
//           .am-hdr-status, .am-row-status { width: 110px; }
//         }
//         @media (max-width: 900px) {
//           .am-content-area { padding: 20px 16px !important; }
//           .am-filter-selects { width: 100%; }
//           .am-select-wrap { flex: 1; min-width: 120px; }
//           .am-search-wrap { min-width: 100%; }

//           /* Hide columns on tablet */
//           .am-hdr-idx, .am-row-idx,
//           .am-hdr-arrow, .am-arrow-wrap,
//           .am-hdr-date, .am-row-date { display: none; }
//           .am-hdr-student, .am-row-student { flex: 1; }
//           .am-hdr-job, .am-row-job { flex: 1; }
//           .am-hdr-status, .am-row-status { width: auto; flex-shrink: 0; }
//         }
//         @media (max-width: 600px) {
//           .am-stats-grid { grid-template-columns: 1fr; }
//           .am-filter-selects { flex-direction: column; }
//           .am-select-wrap { min-width: 100%; }
//           .am-row { flex-wrap: wrap; gap: 10px; padding: 14px 16px; }
//           .am-row-student { flex: 1 1 100%; }
//           .am-row-job { flex: 1 1 100%; }
//           .am-row-status { flex: 1 1 100%; justify-content: flex-start; }
//           .am-list-footer { flex-direction: column; align-items: flex-start; }
//         }
//       `}</style>
//     </div>
//   );
// }

// // ══════════════════════════════════════════
// // FILTER PILL
// // ══════════════════════════════════════════
// function FilterPill({ label, onRemove }) {
//   return (
//     <span style={{
//       display: "inline-flex",
//       alignItems: "center",
//       gap: "6px",
//       padding: "4px 10px 4px 12px",
//       borderRadius: "100px",
//       background: "#eef2ff",
//       border: "1px solid #c7d2fe",
//       fontSize: "11px",
//       fontWeight: 600,
//       color: "#4338ca",
//     }}>
//       {label}
//       <button
//         onClick={onRemove}
//         style={{
//           background: "#c7d2fe",
//           border: "none",
//           width: "16px",
//           height: "16px",
//           borderRadius: "50%",
//           fontSize: "9px",
//           color: "#4338ca",
//           cursor: "pointer",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: 0,
//           lineHeight: 1,
//         }}
//       >
//         ✕
//       </button>
//     </span>
//   );
// }

import { useEffect, useState, useMemo, useCallback } from "react";
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
  return formatDate(dateStr);
};

const statusConfig = {
  applied: {
    label: "Applied",
    bg: "#eff6ff",
    border: "#bfdbfe",
    color: "#1d4ed8",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    ),
  },
  shortlisted: {
    label: "Shortlisted",
    bg: "#fefce8",
    border: "#fde68a",
    color: "#a16207",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  selected: {
    label: "Selected",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    color: "#065f46",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  rejected: {
    label: "Rejected",
    bg: "#fef2f2",
    border: "#fecaca",
    color: "#991b1b",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
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
  const cls = toast.type === "success" ? "toast-success" : toast.type === "error" ? "toast-error" : "toast-info";
  return (
    <div className={`toast-container ${cls}`}>
      <span className="toast-icon">{toast.type === "success" ? "✓" : "✕"}</span>
      <span className="toast-msg">{toast.message}</span>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  );
}

// ══════════════════════════════════════════
// STAT ICONS
// ══════════════════════════════════════════
const statDefs = [
  {
    label: "Total Applications",
    key: "total",
    accent: "#6366f1",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    label: "Unique Students",
    key: "students",
    accent: "#0d9488",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Companies",
    key: "companies",
    accent: "#f59e0b",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    label: "Open Positions",
    key: "jobs",
    accent: "#10b981",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
];

// ══════════════════════════════════════════
// APPLICATION ROW
// ══════════════════════════════════════════
function AppRow({ app, index }) {
  const student = app.student || {};
  const job = app.job || {};
  const company = job.company?.companyName || job.companyName || "Unknown";
  const status = app.status || "applied";
  const sc = statusConfig[status] || statusConfig.applied;
  const studentName = student.name || student.fullName || "Unknown Student";
  const dept = student.department || student.branch || "";
  const cgpa = student.cgpa || "";
  const initials = studentName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const gradients = [
    "linear-gradient(135deg,#0d9488,#14b8a6)",
    "linear-gradient(135deg,#6366f1,#818cf8)",
    "linear-gradient(135deg,#f59e0b,#fbbf24)",
    "linear-gradient(135deg,#ef4444,#f87171)",
    "linear-gradient(135deg,#0ea5e9,#38bdf8)",
    "linear-gradient(135deg,#8b5cf6,#a78bfa)",
    "linear-gradient(135deg,#ec4899,#f472b6)",
  ];
  const grad = gradients[index % gradients.length];

  return (
    <div className="am-row">
      {/* Index */}
      <div className="am-row-idx">{index + 1}</div>

      {/* Student */}
      <div className="am-row-student">
        <div className="am-avatar" style={{ background: grad }}>{initials}</div>
        <div className="am-student-info">
          <span className="am-student-name">{studentName}</span>
          <span className="am-student-meta">
            {dept}{dept && cgpa ? " · " : ""}{cgpa ? `CGPA ${cgpa}` : ""}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <div className="am-arrow-wrap">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
        </svg>
      </div>

      {/* Job */}
      <div className="am-row-job">
        <div className="am-job-avatar">
          {(company[0] || "U").toUpperCase()}
        </div>
        <div className="am-job-info">
          <span className="am-job-title">{job.title || "Unknown Job"}</span>
          <span className="am-job-company">{company}</span>
        </div>
      </div>

      {/* Date */}
      <div className="am-row-date">
        <span className="am-date-primary">{formatDate(app.appliedAt || app.createdAt)}</span>
        <span className="am-date-secondary">{formatTimeAgo(app.appliedAt || app.createdAt)}</span>
      </div>

      {/* Status */}
      <div className="am-row-status">
        <span
          className="am-status-badge"
          style={{ background: sc.bg, borderColor: sc.border, color: sc.color }}
        >
          {sc.icon} {sc.label}
        </span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// PAGINATION COMPONENT
// ══════════════════════════════════════════
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="am-pagination">
      <button
        className="am-page-btn"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        title="First page"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" />
        </svg>
      </button>

      <button
        className="am-page-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="Previous page"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {pages[0] > 1 && (
        <>
          <button className="am-page-btn" onClick={() => onPageChange(1)}>1</button>
          {pages[0] > 2 && <span className="am-page-dots">···</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          className={`am-page-btn ${page === currentPage ? "am-page-active" : ""}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="am-page-dots">···</span>}
          <button className="am-page-btn" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </>
      )}

      <button
        className="am-page-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="Next page"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <button
        className="am-page-btn"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        title="Last page"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" />
        </svg>
      </button>
    </div>
  );
}

// ══════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════
export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);

  // ✅ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filters
  const [filterCompany, setFilterCompany] = useState("");
  const [filterJob, setFilterJob] = useState("");
  const [filterStudent, setFilterStudent] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list");

  const getToken = () => localStorage.getItem("adminToken");

  const fetchApps = async () => {
    try {
      const res = await axios.get(`${API_BASE}/applications`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = Array.isArray(res.data?.applications) ? res.data.applications : Array.isArray(res.data) ? res.data : [];
      setApps(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch applications");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchApps(); }, []);

  const handleRefresh = () => { setRefreshing(true); fetchApps(); };
  const showToast = (msg, type = "success") => setToast({ message: msg, type });

  // ✅ RESET PAGE WHEN FILTERS CHANGE
  useEffect(() => {
    setCurrentPage(1);
  }, [filterCompany, filterJob, filterStudent, filterStatus, searchQuery]);

  // ── Derived filter options ──
  const companies = useMemo(() => {
    const set = new Set();
    apps.forEach((a) => {
      const c = a.job?.company?.companyName || a.job?.companyName || "";
      if (c) set.add(c);
    });
    return [...set].sort();
  }, [apps]);

  const jobs = useMemo(() => {
    const set = new Set();
    apps.forEach((a) => {
      const t = a.job?.title || "";
      if (t) set.add(t);
    });
    return [...set].sort();
  }, [apps]);

  const students = useMemo(() => {
    const set = new Set();
    apps.forEach((a) => {
      const n = a.student?.name || a.student?.fullName || "";
      if (n) set.add(n);
    });
    return [...set].sort();
  }, [apps]);

  // ── Filtered ──
  const filtered = useMemo(() => {
    let result = apps;
    if (filterCompany) result = result.filter((a) => (a.job?.company?.companyName || a.job?.companyName || "") === filterCompany);
    if (filterJob) result = result.filter((a) => (a.job?.title || "") === filterJob);
    if (filterStudent) result = result.filter((a) => (a.student?.name || a.student?.fullName || "") === filterStudent);
    if (filterStatus) result = result.filter((a) => (a.status || "applied") === filterStatus);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((a) => {
        const sn = (a.student?.name || a.student?.fullName || "").toLowerCase();
        const jt = (a.job?.title || "").toLowerCase();
        const cn = (a.job?.company?.companyName || a.job?.companyName || "").toLowerCase();
        return sn.includes(q) || jt.includes(q) || cn.includes(q);
      });
    }
    return result;
  }, [apps, filterCompany, filterJob, filterStudent, filterStatus, searchQuery]);

  // ✅ PAGINATION LOGIC
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedApps = filtered.slice(startIndex, endIndex);

  // ── Stats ──
  const stats = useMemo(() => ({
    total: apps.length,
    students: new Set(apps.map((a) => a.student?._id || a.student?.name).filter(Boolean)).size,
    companies: new Set(apps.map((a) => a.job?.company?._id || a.job?.company?.companyName).filter(Boolean)).size,
    jobs: new Set(apps.map((a) => a.job?._id || a.job?.title).filter(Boolean)).size,
  }), [apps]);

  const clearFilters = () => {
    setFilterCompany("");
    setFilterJob("");
    setFilterStudent("");
    setFilterStatus("");
    setSearchQuery("");
  };

  const hasActiveFilter = filterCompany || filterJob || filterStudent || filterStatus || searchQuery;

  const selectCls = "am-select";
  const selectCommon = {
    display: "block",
    width: "100%",
    padding: "9px 32px 9px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "13px",
    fontWeight: 500,
    color: "#334155",
    background: "#fff",
    appearance: "none",
    WebkitAppearance: "none",
    fontFamily: "inherit",
    cursor: "pointer",
    outline: "none",
    transition: "border-color 0.15s",
  };

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
          <li className="active">📬 Applications</li>
          <li><Link to="/admin/results">✅ Results</Link></li>
          {/* <li><Link to="/admin/reports">📈 Reports</Link></li> */}
        </ul>
      </aside>

      {/* ═══════ MAIN ═══════ */}
      <main className="main-content am-main-content">
        <header className="top-nav am-top-nav">
          <div>
            <h1><b>📬 Application Monitor</b></h1>
            <p className="am-subtitle">
              Track which students applied to which jobs — filter by company, job, or student
            </p>
          </div>
          <div className="am-top-actions">
            {apps.length > 0 && (
              <span className="am-count-badge">
                {filtered.length} of {apps.length} applications
              </span>
            )}
            <button className="am-refresh-btn" onClick={handleRefresh} disabled={refreshing}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={refreshing ? { animation: "amSpin 0.8s linear infinite" } : {}}>
                <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Refresh
            </button>
          </div>
        </header>

        <div className="am-content-area">
          {/* ── Stats ── */}
          <div className="am-stats-grid">
            {statDefs.map((s) => (
              <div key={s.key} className="am-stat-card">
                <div className="am-stat-icon" style={{ background: `${s.accent}0D`, border: `1px solid ${s.accent}1A` }}>
                  {s.icon}
                </div>
                <div className="am-stat-content">
                  <span className="am-stat-label">{s.label}</span>
                  <span className="am-stat-value">{stats[s.key]}</span>
                </div>
                <div className="am-stat-line" style={{ background: `${s.accent}40` }} />
              </div>
            ))}
          </div>

          {/* ── Filter Bar ── */}
          <div className="am-filter-bar">
            <div className="am-filter-row">
              {/* Search */}
              <div className="am-search-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  className="am-search-input"
                  placeholder="Search student, job, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="am-search-clear" onClick={() => setSearchQuery("")}>✕</button>
                )}
              </div>

              {/* Dropdowns */}
              <div className="am-filter-selects">
                <div className="am-select-wrap">
                  <select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)} style={selectCommon}>
                    <option value="">All Companies</option>
                    {companies.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <svg className="am-select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                </div>

                <div className="am-select-wrap">
                  <select value={filterJob} onChange={(e) => setFilterJob(e.target.value)} style={selectCommon}>
                    <option value="">All Jobs</option>
                    {jobs.map((j) => <option key={j} value={j}>{j}</option>)}
                  </select>
                  <svg className="am-select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                </div>

                <div className="am-select-wrap">
                  <select value={filterStudent} onChange={(e) => setFilterStudent(e.target.value)} style={selectCommon}>
                    <option value="">All Students</option>
                    {students.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <svg className="am-select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                </div>

                <div className="am-select-wrap">
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={selectCommon}>
                    <option value="">All Statuses</option>
                    {Object.entries(statusConfig).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                  <svg className="am-select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                </div>
              </div>

              {/* Clear + View toggle */}
              <div className="am-filter-actions">
                {hasActiveFilter && (
                  <button className="am-clear-btn" onClick={clearFilters}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* Active filter pills */}
            {hasActiveFilter && (
              <div className="am-active-pills">
                {filterCompany && <FilterPill label={filterCompany} onRemove={() => setFilterCompany("")} />}
                {filterJob && <FilterPill label={filterJob} onRemove={() => setFilterJob("")} />}
                {filterStudent && <FilterPill label={filterStudent} onRemove={() => setFilterStudent("")} />}
                {filterStatus && <FilterPill label={statusConfig[filterStatus]?.label || filterStatus} onRemove={() => setFilterStatus("")} />}
                {searchQuery && <FilterPill label={`Search: "${searchQuery}"`} onRemove={() => setSearchQuery("")} />}
              </div>
            )}
          </div>

          {/* ── Error ── */}
          {error && !loading && (
            <div className="ms-error">
              <span>⚠️ {error}</span>
              <button onClick={handleRefresh}>Retry</button>
            </div>
          )}

          {/* ── Loading Skeleton ── */}
          {loading && !error && (
            <div className="am-skeleton-list">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="am-skeleton-row" style={{ animation: `amPulse 1.5s ease-in-out infinite ${i * 0.12}s` }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f1f5f9" }} />
                  <div style={{ flex: 1, display: "flex", gap: "16px", alignItems: "center" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "#f1f5f9", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div className="am-skel-line" style={{ width: "30%", marginBottom: "6px" }} />
                      <div className="am-skel-line" style={{ width: "18%" }} />
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "#f1f5f9", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div className="am-skel-line" style={{ width: "35%", marginBottom: "6px" }} />
                      <div className="am-skel-line" style={{ width: "22%" }} />
                    </div>
                  </div>
                  <div style={{ width: "70px" }}>
                    <div className="am-skel-line" style={{ width: "100%", marginBottom: "4px" }} />
                    <div className="am-skel-line" style={{ width: "60%" }} />
                  </div>
                  <div style={{ width: "90px", height: "28px", borderRadius: "6px", background: "#f1f5f9" }} />
                </div>
              ))}
            </div>
          )}

          {/* ── Empty (no data at all) ── */}
          {!loading && !error && apps.length === 0 && (
            <div className="am-empty-state">
              <div className="am-empty-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <h2 className="am-empty-title">No applications yet</h2>
              <p className="am-empty-text">Applications will appear here once students start applying to jobs.</p>
              <button className="am-empty-btn" onClick={handleRefresh} disabled={refreshing}>
                {refreshing ? <span className="am-spinner-sm" /> : "↻"} Check again
              </button>
            </div>
          )}

          {/* ── Empty (filtered) ── */}
          {!loading && !error && apps.length > 0 && filtered.length === 0 && (
            <div className="am-empty-state">
              <div className="am-empty-icon" style={{ background: "linear-gradient(135deg, #fefce8, #fef9c3)" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#a16207" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h2 className="am-empty-title">No matches found</h2>
              <p className="am-empty-text">Try adjusting your filters or search query.</p>
              <button className="am-empty-btn" onClick={clearFilters}>Clear all filters</button>
            </div>
          )}

          {/* ── List Header ── */}
          {!loading && !error && filtered.length > 0 && (
            <>
              <div className="am-list-header">
                <div className="am-hdr-idx">#</div>
                <div className="am-hdr-student">Student</div>
                <div className="am-hdr-arrow" />
                <div className="am-hdr-job">Applied To</div>
                <div className="am-hdr-date">Applied On</div>
                <div className="am-hdr-status">Status</div>
              </div>

              <div className="am-list-body">
                {paginatedApps.map((app, i) => (
                  <AppRow key={app._id || i} app={app} index={startIndex + i} />
                ))}
              </div>

              {/* ✅ PAGINATION */}
              <div className="am-pagination-wrapper">
                <div className="am-pagination-info">
                  Showing <strong>{startIndex + 1}–{Math.min(endIndex, filtered.length)}</strong> of <strong>{filtered.length}</strong> applications
                </div>
                <div className="am-pagination-per-page">
                  <span className="am-pp-label">Rows:</span>
                  {[10, 25, 50, 100].map((size) => (
                    <button
                      key={size}
                      className={`am-pp-btn ${rowsPerPage === size ? "am-pp-active" : ""}`}
                      onClick={() => setRowsPerPage(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>

              {/* Footer summary */}
              <div className="am-list-footer">
                <span className="am-footer-text">
                  Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                </span>
                <div className="am-footer-statuses">
                  {Object.entries(statusConfig).map(([key, sc]) => {
                    const count = apps.filter((a) => (a.status || "applied") === key).length;
                    return (
                      <span key={key} className="am-footer-chip" style={{ background: sc.bg, borderColor: sc.border, color: sc.color }}>
                        {sc.icon} {sc.label}: {count}
                      </span>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <style>{`
        @keyframes amSpin { to { transform: rotate(360deg); } }
        @keyframes amPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

        .am-main-content {
          display: flex !important;
          flex-direction: column;
          overflow: hidden;
        }
        .am-top-nav {
          flex-wrap: wrap;
          gap: 12px;
        }
        .am-subtitle {
          font-size: 12px;
          color: #94a3b8;
          margin: 3px 0 0 0;
        }
        .am-top-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .am-count-badge {
          font-size: 12px;
          font-weight: 600;
          color: #4338ca;
          background: #eef2ff;
          padding: 6px 14px;
          border-radius: 100px;
          border: 1px solid #c7d2fe;
        }
        .am-refresh-btn {
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
          transition: all 0.15s;
        }
        .am-refresh-btn:hover { background: #e2e8f0; }
        .am-refresh-btn:disabled { opacity: 0.5; cursor: wait; }
        .am-content-area {
          flex: 1;
          overflow-y: auto;
          padding: 28px 32px;
        }

        /* ══ Stats ══ */
        .am-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .am-stat-card {
          position: relative;
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e8ecf1;
          padding: 20px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .am-stat-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 16px rgba(15,23,42,0.06);
        }
        .am-stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .am-stat-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .am-stat-label {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          line-height: 1;
        }
        .am-stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1;
          letter-spacing: -0.025em;
        }
        .am-stat-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .am-stat-card:hover .am-stat-line { opacity: 1; }

        /* ══ Filter Bar ══ */
        .am-filter-bar {
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e8ecf1;
          padding: 16px 18px;
          margin-bottom: 20px;
        }
        .am-filter-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .am-search-wrap {
          position: relative;
          flex: 1;
          min-width: 220px;
        }
        .am-search-wrap > svg:first-child {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }
        .am-search-input {
          width: 100%;
          padding: 9px 36px 9px 38px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-size: 13px;
          font-weight: 500;
          color: #334155;
          background: #f8fafc;
          outline: none;
          font-family: inherit;
          transition: border-color 0.15s, background 0.15s;
        }
        .am-search-input:focus {
          border-color: #6366f1;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
        }
        .am-search-input::placeholder { color: #94a3b8; }
        .am-search-clear {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: #e2e8f0;
          border: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          font-size: 10px;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }
        .am-search-clear:hover { background: #cbd5e1; }

        .am-filter-selects {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .am-select-wrap {
          position: relative;
          min-width: 150px;
        }
        .am-select-chevron {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }
        .am-select-wrap select:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
        }

        .am-filter-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .am-clear-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .am-clear-btn:hover { background: #e2e8f0; color: #334155; }

        .am-active-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
        }

        /* ══ List Header ══ */
        .am-list-header {
          display: flex;
          align-items: center;
          gap: 0;
          padding: 0 18px;
          margin-bottom: 6px;
        }
        .am-hdr-idx { width: 36px; flex-shrink: 0; }
        .am-hdr-student { flex: 1.2; min-width: 0; }
        .am-hdr-arrow { width: 40px; flex-shrink: 0; text-align: center; }
        .am-hdr-job { flex: 1.2; min-width: 0; }
        .am-hdr-date { width: 120px; flex-shrink: 0; }
        .am-hdr-status { width: 130px; flex-shrink: 0; text-align: right; }
        .am-list-header > div {
          font-size: 10px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 8px 0;
        }

        /* ══ List Body ══ */
        .am-list-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e8ecf1;
          padding: 8px 0;
          overflow: hidden;
        }

        /* ══ Row ══ */
        .am-row {
          display: flex;
          align-items: center;
          gap: 0;
          padding: 12px 18px;
          transition: background 0.12s;
          border-bottom: 1px solid #f8fafc;
        }
        .am-row:last-child { border-bottom: none; }
        .am-row:hover { background: #f8fafc; }
        .am-row-idx {
          width: 36px;
          flex-shrink: 0;
          font-size: 11px;
          font-weight: 600;
          color: #cbd5e1;
        }
        .am-row-student {
          flex: 1.2;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .am-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .am-student-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .am-student-name {
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .am-student-meta {
          font-size: 11px;
          color: #94a3b8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .am-arrow-wrap {
          width: 40px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .am-row-job {
          flex: 1.2;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .am-job-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #eef2ff, #e0e7ff);
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .am-job-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .am-job-title {
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .am-job-company {
          font-size: 11px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .am-row-date {
          width: 120px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .am-date-primary {
          font-size: 12px;
          font-weight: 500;
          color: #334155;
        }
        .am-date-secondary {
          font-size: 10px;
          color: #94a3b8;
        }
        .am-row-status {
          width: 130px;
          flex-shrink: 0;
          display: flex;
          justify-content: flex-end;
        }
        .am-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          border: 1px solid;
          white-space: nowrap;
        }

        /* ══ List Footer ══ */
        .am-list-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 4px 0;
          gap: 12px;
          flex-wrap: wrap;
        }
        .am-footer-text {
          font-size: 12px;
          color: #94a3b8;
        }
        .am-footer-text strong { color: #475569; }
        .am-footer-statuses {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .am-footer-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          border: 1px solid;
        }

        /* ══ Skeleton ══ */
        .am-skeleton-list {
          display: flex;
          flex-direction: column;
          gap: 0;
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e8ecf1;
          padding: 16px 18px;
          overflow: hidden;
        }
        .am-skeleton-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 0;
          border-bottom: 1px solid #f8fafc;
        }
        .am-skeleton-row:last-child { border-bottom: none; }
        .am-skel-line {
          height: 12px;
          background: #f1f5f9;
          border-radius: 4px;
        }

        /* ══ Empty ══ */
        .am-empty-state {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e8ecf1;
          padding: 60px 24px;
          text-align: center;
        }
        .am-empty-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        .am-empty-title {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px;
        }
        .am-empty-text {
          font-size: 13px;
          color: #94a3b8;
          margin: 0 0 20px;
        }
        .am-empty-btn {
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
          transition: opacity 0.15s;
        }
        .am-empty-btn:hover { opacity: 0.9; }
        .am-empty-btn:disabled { opacity: 0.5; cursor: wait; }
        .am-spinner-sm {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          display: inline-block;
          animation: amSpin 0.6s linear infinite;
        }

        /* ══════════════════════════════════════
           ✅ PAGINATION STYLES
           ══════════════════════════════════════ */
        .am-pagination-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 4px;
          gap: 12px;
          flex-wrap: wrap;
        }
        .am-pagination-info {
          font-size: 12px;
          color: #94a3b8;
        }
        .am-pagination-info strong {
          color: #475569;
        }
        .am-pagination-per-page {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .am-pp-label {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          margin-right: 4px;
        }
        .am-pp-btn {
          width: 32px;
          height: 28px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          background: #fff;
          color: #64748b;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }
        .am-pp-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }
        .am-pp-active {
          background: #6366f1;
          border-color: #6366f1;
          color: #fff;
        }
        .am-pp-active:hover {
          background: #4f46e5;
          border-color: #4f46e5;
          color: #fff;
        }
        .am-pagination {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .am-page-btn {
          min-width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #fff;
          color: #475569;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 8px;
          transition: all 0.15s;
        }
        .am-page-btn:hover:not(:disabled) {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }
        .am-page-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .am-page-active {
          background: #6366f1;
          border-color: #6366f1;
          color: #fff;
          box-shadow: 0 2px 8px rgba(99,102,241,0.3);
        }
        .am-page-active:hover {
          background: #4f46e5;
          border-color: #4f46e5;
          color: #fff;
        }
        .am-page-dots {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 1px;
        }

        /* ══ Responsive ══ */
        @media (max-width: 1100px) {
          .am-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .am-hdr-date, .am-row-date { width: 100px; }
          .am-hdr-status, .am-row-status { width: 110px; }
        }
        @media (max-width: 900px) {
          .am-content-area { padding: 20px 16px !important; }
          .am-filter-selects { width: 100%; }
          .am-select-wrap { flex: 1; min-width: 120px; }
          .am-search-wrap { min-width: 100%; }

          .am-hdr-idx, .am-row-idx,
          .am-hdr-arrow, .am-arrow-wrap,
          .am-hdr-date, .am-row-date { display: none; }
          .am-hdr-student, .am-row-student { flex: 1; }
          .am-hdr-job, .am-row-job { flex: 1; }
          .am-hdr-status, .am-row-status { width: auto; flex-shrink: 0; }
        }
        @media (max-width: 600px) {
          .am-stats-grid { grid-template-columns: 1fr; }
          .am-filter-selects { flex-direction: column; }
          .am-select-wrap { min-width: 100%; }
          .am-row { flex-wrap: wrap; gap: 10px; padding: 14px 16px; }
          .am-row-student { flex: 1 1 100%; }
          .am-row-job { flex: 1 1 100%; }
          .am-row-status { flex: 1 1 100%; justify-content: flex-start; }
          .am-list-footer { flex-direction: column; align-items: flex-start; }

          .am-pagination-wrapper {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
          .am-pagination-info,
          .am-pagination-per-page {
            justify-content: center;
          }
          .am-pagination {
            justify-content: center;
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════════
// FILTER PILL
// ══════════════════════════════════════════
function FilterPill({ label, onRemove }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "4px 10px 4px 12px",
      borderRadius: "100px",
      background: "#eef2ff",
      border: "1px solid #c7d2fe",
      fontSize: "11px",
      fontWeight: 600,
      color: "#4338ca",
    }}>
      {label}
      <button
        onClick={onRemove}
        style={{
          background: "#c7d2fe",
          border: "none",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          fontSize: "9px",
          color: "#4338ca",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          lineHeight: 1,
        }}
      >
        ✕
      </button>
    </span>
  );
}