
// import React, { useState, useEffect, useCallback } from "react";
// import { Link } from "react-router-dom";
// import "./ManageStudents.css";

// const API = "http://localhost:5000/api/admin/students";
// const RESUME_BASE = "http://localhost:5000/uploads/resumes";
// const PIC_BASE = "http://localhost:5000/uploads/profile";

// const getToken = () => {
//   return localStorage.getItem("adminToken") || localStorage.getItem("token");
// };

// const apiFetch = async (url, options = {}) => {
//   const token = getToken();
//   const headers = {};
//   if (options.body) {
//     headers["Content-Type"] = "application/json";
//   }
//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//   }
//   return fetch(url, { ...options, headers });
// };

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

// function StatsCard({ icon, label, value, color }) {
//   return (
//     <div className="stats-card" style={{ borderTopColor: color }}>
//       <div className="stats-icon" style={{ color, background: `${color}15` }}>{icon}</div>
//       <div className="stats-info">
//         <span className="stats-value">{value}</span>
//         <span className="stats-label">{label}</span>
//       </div>
//     </div>
//   );
// }

// function CompletenessBar({ pct }) {
//   const color = pct === 100 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444";
//   return (
//     <div className="completeness-wrap">
//       <div className="completeness-bar-bg">
//         <div className="completeness-bar-fill" style={{ width: `${pct}%`, background: color }} />
//       </div>
//       <span className="completeness-pct" style={{ color }}>{pct}%</span>
//     </div>
//   );
// }

// function Badge({ text, variant }) {
//   return <span className={`badge badge-${variant}`}>{text}</span>;
// }

// function statusBadge(status) {
//   const map = { Pending: "warning", Approved: "success", Rejected: "danger", Notified: "info", "Under Review": "warning", Shortlisted: "info", Selected: "success", Scheduled: "info", Completed: "success", Cancelled: "danger" };
//   return <Badge text={status} variant={map[status] || "default"} />;
// }

// export default function ManageStudents() {
//   const [students, setStudents] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [pagination, setPagination] = useState(null);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [toast, setToast] = useState(null);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [resumeFilter, setResumeFilter] = useState("all");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(3);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [showNotifyModal, setShowNotifyModal] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [editForm, setEditForm] = useState({});
//   const [rejectReason, setRejectReason] = useState("");
//   const [notifyMsg, setNotifyMsg] = useState("");

//   const fetchStudents = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const params = new URLSearchParams({ search, status: statusFilter, resume: resumeFilter, page, limit });
//       const res = await apiFetch(`${API}?${params}`);
//       const text = await res.text();
//       if (!text.trim()) throw new Error("Empty response from server");
//       let json;
//       try {
//         json = JSON.parse(text);
//       } catch (parseErr) {
//         throw new Error(`Server returned non-JSON (Status ${res.status}): ${text.substring(0, 100)}`);
//       }
//       if (!json.success) throw new Error(json.error || "Failed to fetch");
//       setStudents(json.data);
//       setPagination(json.pagination);
//       setStats(json.stats);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [search, statusFilter, resumeFilter, page, limit]);

//   useEffect(() => { fetchStudents(); }, [fetchStudents]);
//   useEffect(() => { setPage(1); }, [search, statusFilter, resumeFilter, limit]);

//   const fetchDetail = async (id) => {
//     try {
//       const res = await apiFetch(`${API}/${id}`);
//       const text = await res.text();
//       const json = JSON.parse(text);
//       if (!json.success) throw new Error(json.error);
//       return json.data;
//     } catch (err) {
//       setToast({ type: "error", message: err.message });
//       return null;
//     }
//   };

//   const handleView = async (s) => { const d = await fetchDetail(s._id); if (d) { setSelectedStudent(d); setShowViewModal(true); } };

//   const handleEditClick = (s) => {
//     setSelectedStudent(s);
//     setEditForm({ name: s.name || "", email: s.email || "", university: s.university || "", gpa: s.gpa || "", phone: s.phone || "", skills: s.skills || "", bio: s.bio || "", approvalStatus: s.approvalStatus || "Pending" });
//     setShowEditModal(true);
//   };

//   const handleEditSubmit = async () => {
//     setActionLoading(true);
//     try {
//       const res = await apiFetch(`${API}/${selectedStudent._id}`, { method: "PUT", body: JSON.stringify(editForm) });
//       const json = await res.json();
//       if (!json.success) throw new Error(json.error);
//       setToast({ type: "success", message: "Updated" });
//       setShowEditModal(false);
//       fetchStudents();
//     } catch (err) { setToast({ type: "error", message: err.message }); }
//     finally { setActionLoading(false); }
//   };

//   const handleDeleteClick = (s) => { setSelectedStudent(s); setShowDeleteModal(true); };

//   const handleDeleteConfirm = async () => {
//     setActionLoading(true);
//     try {
//       const res = await apiFetch(`${API}/${selectedStudent._id}`, { method: "DELETE" });
//       const json = await res.json();
//       if (!json.success) throw new Error(json.error);
//       setToast({ type: "success", message: "Deleted" });
//       setShowDeleteModal(false);
//       fetchStudents();
//     } catch (err) { setToast({ type: "error", message: err.message }); }
//     finally { setActionLoading(false); }
//   };

//   const handleApprove = async (s) => {
//     try {
//       const res = await apiFetch(`${API}/${s._id}/approve`, { method: "PUT" });
//       const json = await res.json();
//       if (!json.success) throw new Error(json.error);
//       setToast({ type: "success", message: `${s.name} approved` });
//       fetchStudents();
//     } catch (err) { setToast({ type: "error", message: err.message }); }
//   };

//   const handleRejectClick = (s) => { setSelectedStudent(s); setRejectReason(""); setShowRejectModal(true); };

//   const handleRejectSubmit = async () => {
//     if (!rejectReason.trim()) { setToast({ type: "error", message: "Provide reason" }); return; }
//     setActionLoading(true);
//     try {
//       const res = await apiFetch(`${API}/${selectedStudent._id}/reject`, { method: "PUT", body: JSON.stringify({ reason: rejectReason }) });
//       const json = await res.json();
//       if (!json.success) throw new Error(json.error);
//       setToast({ type: "success", message: "Rejected" });
//       setShowRejectModal(false);
//       fetchStudents();
//     } catch (err) { setToast({ type: "error", message: err.message }); }
//     finally { setActionLoading(false); }
//   };

//   const handleNotifyClick = (s) => {
//     setSelectedStudent(s);
//     const m = [];
//     if (!s.university) m.push("university");
//     if (!s.gpa) m.push("GPA");
//     if (!s.resume) m.push("resume");
//     if (!s.phone) m.push("phone");
//     if (!s.skills) m.push("skills");
//     setNotifyMsg(`Your profile is incomplete. Please complete: ${m.join(", ")}.`);
//     setShowNotifyModal(true);
//   };

//   const handleNotifySubmit = async () => {
//     if (!notifyMsg.trim()) { setToast({ type: "error", message: "Provide message" }); return; }
//     setActionLoading(true);
//     try {
//       const res = await apiFetch(`${API}/${selectedStudent._id}/notify`, { method: "PUT", body: JSON.stringify({ message: notifyMsg }) });
//       const json = await res.json();
//       if (!json.success) throw new Error(json.error);
//       setToast({ type: "success", message: "Notified" });
//       setShowNotifyModal(false);
//       fetchStudents();
//     } catch (err) { setToast({ type: "error", message: err.message }); }
//     finally { setActionLoading(false); }
//   };

//   let searchTimer;
//   const handleSearchChange = (e) => { clearTimeout(searchTimer); searchTimer = setTimeout(() => setSearch(e.target.value), 400); };

//   const closeAll = () => { setShowViewModal(false); setShowEditModal(false); setShowDeleteModal(false); setShowRejectModal(false); setShowNotifyModal(false); setSelectedStudent(null); };

//   const getPageNumbers = () => {
//     if (!pagination) return [];
//     const total = pagination.totalPages;
//     const current = page;
//     if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
//     const pages = [];
//     pages.push(1);
//     if (current > 3) pages.push("...");
//     const start = Math.max(2, current - 1);
//     const end = Math.min(total - 1, current + 1);
//     for (let i = start; i <= end; i++) pages.push(i);
//     if (current < total - 2) pages.push("...");
//     pages.push(total);
//     return pages;
//   };

//   const pageNumbers = getPageNumbers();
//   const showingFrom = pagination ? (page - 1) * limit + 1 : 0;
//   const showingTo = pagination ? Math.min(page * limit, pagination.totalStudents) : 0;

//   return (
//     <div className="dashboard-container">
//       <Toast toast={toast} onClose={() => setToast(null)} />

//       {/* ═══════ SIDEBAR — Same as AdminDashboard ═══════ */}
//       <aside className="sidebar">
//         <h2>🎓 Admin</h2>
//         <ul>
//           <li>
//             <Link to="/admin/dashboard">📊 Dashboard</Link>
//           </li>
//           <li className="active">👨‍🎓 Students</li>
//           <li>
//             <Link to="/recruiters">🏢 Recruiters</Link>
//           </li>
//           <li>
//             <Link to="/admin/approve-jobs">📄 Approve Jobs</Link>
//           </li>
//           <li>📬 Applications</li>
//         </ul>
//       </aside>

//       {/* ═══════ MAIN CONTENT ═══════ */}
//       <main className="main-content">
//         <header className="top-nav">
//           <h1><b>👨‍🎓 Manage Students</b></h1>
//         </header>

//         {/* Stats Cards */}
//         {/* {stats && (
//           <div className="ms-stats-grid">
//             <StatsCard icon="👥" label="Total" value={stats.totalStudents} color="#6366f1" />
//             <StatsCard icon="✅" label="Approved" value={stats.approved} color="#10b981" />
//             <StatsCard icon="⏳" label="Pending" value={stats.pending} color="#f59e0b" />
//             <StatsCard icon="❌" label="Rejected" value={stats.rejected} color="#ef4444" />
//             <StatsCard icon="📄" label="Resume" value={stats.withResume} color="#3b82f6" />
//             <StatsCard icon="⚠️" label="Incomplete" value={stats.incompleteProfiles} color="#f97316" />
//           </div>
//         )} */}

//         {/* Filters */}
//         <div className="ms-filters">
//           <div className="ms-search-box">
//             <span className="ms-search-icon">🔍</span>
//             <input type="text" placeholder="Search name, email, university..." onChange={handleSearchChange} className="ms-search-input" />
//           </div>
//           <select className="ms-filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
//             <option value="all">All Status</option>
//             <option value="Pending">Pending</option>
//             <option value="Approved">Approved</option>
//             <option value="Rejected">Rejected</option>
//             <option value="Notified">Notified</option>
//           </select>
//           <select className="ms-filter-select" value={resumeFilter} onChange={(e) => setResumeFilter(e.target.value)}>
//             <option value="all">All Resume</option>
//             <option value="uploaded">Uploaded</option>
//             <option value="not-uploaded">No Resume</option>
//           </select>
//           <select className="ms-filter-select" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
//             <option value={3}>3 per page</option>
//             <option value={5}>5 per page</option>
//             <option value={10}>10 per page</option>
//             <option value={25}>25 per page</option>
//           </select>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="ms-error">
//             <span>⚠️ {error}</span>
//             <button onClick={fetchStudents}>Retry</button>
//           </div>
//         )}

//         {/* Loading */}
//         {loading && !error && (
//           <div className="ms-loading"><div className="ms-spinner" /><p>Loading...</p></div>
//         )}

//         {/* Table */}
//         {!loading && !error && (
//           <>
//             {students.length === 0 ? (
//               <div className="ms-empty"><span className="ms-empty-icon">📭</span><h3>No students found</h3></div>
//             ) : (
//               <div className="ms-table-wrap">
//                 <table className="ms-table">
//                   <thead>
//                     <tr>
//                       <th>Student</th>
//                       <th>University</th>
//                       <th>GPA</th>
//                       <th>Resume</th>
//                       <th>Complete</th>
//                       <th>Status</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {students.map((s) => (
//                       <tr key={s._id} className="ms-table-row">
//                         <td>
//                           <div className="ms-student-cell">
//                             <img
//                               src={s.profilePic ? `${PIC_BASE}/${s.profilePic}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=6366f1&color=fff&size=40`}
//                               alt={s.name} className="ms-avatar"
//                               onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=6366f1&color=fff&size=40`; }}
//                             />
//                             <div>
//                               <span className="ms-student-name">{s.name}</span>
//                               <span className="ms-student-email">{s.email}</span>
//                             </div>
//                           </div>
//                         </td>
//                         <td><span className={s.university ? "" : "text-muted"}>{s.university || "—"}</span></td>
//                         <td><span className={s.gpa ? "" : "text-muted"}>{s.gpa || "—"}</span></td>
//                         <td>
//                           {s.resume ? (
//                             <a href={`${RESUME_BASE}/${s.resume}`} target="_blank" rel="noreferrer" className="resume-link">📄 View</a>
//                           ) : (
//                             <Badge text="No resume" variant="danger" />
//                           )}
//                         </td>
//                         <td><CompletenessBar pct={s.profileCompleteness} /></td>
//                         <td>{statusBadge(s.approvalStatus || "Pending")}</td>
//                         <td>
//                           <div className="ms-actions">
//                             <button className="act-btn act-view" title="View" onClick={() => handleView(s)}>👁</button>
//                             <button className="act-btn act-edit" title="Edit" onClick={() => handleEditClick(s)}>✏️</button>
//                             {s.approvalStatus !== "Approved" && <button className="act-btn act-approve" title="Approve" onClick={() => handleApprove(s)}>✅</button>}
//                             {!s.isProfileComplete && s.approvalStatus !== "Rejected" && (
//                               <>
//                                 <button className="act-btn act-notify" title="Notify" onClick={() => handleNotifyClick(s)}>🔔</button>
//                                 <button className="act-btn act-reject" title="Reject" onClick={() => handleRejectClick(s)}>❌</button>
//                               </>
//                             )}
//                             <button className="act-btn act-delete" title="Delete" onClick={() => handleDeleteClick(s)}>🗑</button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             {/* Pagination */}
//             {pagination && students.length > 0 && (
//               <div className="ms-pagination-wrapper">
//                 <div className="ms-pagination-info">
//                   <span>Showing <strong>{showingFrom}</strong>–<strong>{showingTo}</strong> of <strong>{pagination.totalStudents}</strong> students</span>
//                   <span className="ms-pagination-pages">Page <strong>{page}</strong> of <strong>{pagination.totalPages}</strong></span>
//                 </div>
//                 <div className="ms-pagination">
//                   <button className="page-btn" disabled={page === 1} onClick={() => setPage(1)} title="First">««</button>
//                   <button className="page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹ Prev</button>
//                   {pageNumbers.map((n, idx) =>
//                     n === "..." ? (
//                       <span key={`ellipsis-${idx}`} className="page-ellipsis">…</span>
//                     ) : (
//                       <button key={n} className={`page-btn ${n === page ? "page-active" : ""}`} onClick={() => setPage(n)}>{n}</button>
//                     )
//                   )}
//                   <button className="page-btn" disabled={page === pagination.totalPages} onClick={() => setPage((p) => p + 1)}>Next ›</button>
//                   <button className="page-btn" disabled={page === pagination.totalPages} onClick={() => setPage(pagination.totalPages)}>»»</button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </main>

//       {/* ═══════ MODALS ═══════ */}

//       {/* VIEW */}
//       {showViewModal && selectedStudent && (
//         <div className="modal-overlay" onClick={closeAll}>
//           <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header"><h2>Student Details</h2><button className="modal-close" onClick={closeAll}>✕</button></div>
//             <div className="modal-body">
//               <div className="detail-profile">
//                 <img src={selectedStudent.profilePic ? `${PIC_BASE}/${selectedStudent.profilePic}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.name)}&background=6366f1&color=fff&size=100`} alt={selectedStudent.name} className="detail-avatar" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.name)}&background=6366f1&color=fff&size=100`; }} />
//                 <div className="detail-name-wrap">
//                   <h3>{selectedStudent.name}</h3>
//                   <p className="detail-email">{selectedStudent.email}</p>
//                   <div className="detail-badges">
//                     {statusBadge(selectedStudent.approvalStatus || "Pending")}
//                     {selectedStudent.resume ? <a href={`${RESUME_BASE}/${selectedStudent.resume}`} target="_blank" rel="noreferrer" className="badge badge-resume">📄 Resume</a> : <Badge text="No Resume" variant="danger" />}
//                   </div>
//                 </div>
//               </div>
//               <div className="detail-section">
//                 <h4>Completeness</h4>
//                 <CompletenessBar pct={selectedStudent.profileCompleteness} />
//                 {selectedStudent.missingFields?.length > 0 && (
//                   <div className="missing-fields"><span className="missing-label">Missing:</span>{selectedStudent.missingFields.map((f) => <span key={f} className="missing-tag">{f}</span>)}</div>
//                 )}
//               </div>
//               <div className="detail-grid">
//                 <div className="detail-field"><label>University</label><span>{selectedStudent.university || "—"}</span></div>
//                 <div className="detail-field"><label>GPA</label><span>{selectedStudent.gpa || "—"}</span></div>
//                 <div className="detail-field"><label>Phone</label><span>{selectedStudent.phone || "—"}</span></div>
//                 <div className="detail-field"><label>Skills</label><span>{selectedStudent.skills || "—"}</span></div>
//                 <div className="detail-field full-width"><label>Bio</label><span>{selectedStudent.bio || "—"}</span></div>
//                 {selectedStudent.adminNotes && <div className="detail-field full-width admin-note"><label>Admin Notes</label><span>{selectedStudent.adminNotes}</span></div>}
//               </div>
//             </div>
//             <div className="modal-footer">
//               {selectedStudent.approvalStatus !== "Approved" && <button className="btn btn-success" onClick={() => { handleApprove(selectedStudent); closeAll(); }}>✅ Approve</button>}
//               {!selectedStudent.isProfileComplete && <><button className="btn btn-warning" onClick={() => { handleNotifyClick(selectedStudent); setShowViewModal(false); }}>🔔 Notify</button><button className="btn btn-danger" onClick={() => { handleRejectClick(selectedStudent); setShowViewModal(false); }}>❌ Reject</button></>}
//               <button className="btn btn-ghost" onClick={closeAll}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* EDIT */}
//       {showEditModal && selectedStudent && (
//         <div className="modal-overlay" onClick={closeAll}>
//           <div className="modal" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header"><h2>Edit Student</h2><button className="modal-close" onClick={closeAll}>✕</button></div>
//             <div className="modal-body">
//               <div className="form-grid">
//                 <div className="form-group"><label>Name</label><input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></div>
//                 <div className="form-group"><label>Email</label><input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} /></div>
//                 <div className="form-group"><label>University</label><input type="text" value={editForm.university} onChange={(e) => setEditForm({ ...editForm, university: e.target.value })} /></div>
//                 <div className="form-group"><label>GPA</label><input type="text" value={editForm.gpa} onChange={(e) => setEditForm({ ...editForm, gpa: e.target.value })} /></div>
//                 <div className="form-group"><label>Phone</label><input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} /></div>
//                 <div className="form-group"><label>Skills</label><input type="text" value={editForm.skills} onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })} /></div>
//                 <div className="form-group full-width"><label>Bio</label><textarea rows={3} value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} /></div>
//                 <div className="form-group"><label>Status</label><select value={editForm.approvalStatus} onChange={(e) => setEditForm({ ...editForm, approvalStatus: e.target.value })}><option value="Pending">Pending</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option><option value="Notified">Notified</option></select></div>
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button className="btn btn-primary" onClick={handleEditSubmit} disabled={actionLoading}>{actionLoading ? "Saving..." : "💾 Save"}</button>
//               <button className="btn btn-ghost" onClick={closeAll}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* DELETE */}
//       {showDeleteModal && selectedStudent && (
//         <div className="modal-overlay" onClick={closeAll}>
//           <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header modal-header-danger"><h2>🗑 Delete</h2><button className="modal-close" onClick={closeAll}>✕</button></div>
//             <div className="modal-body">
//               <div className="delete-warning"><span className="delete-icon">⚠️</span><p>Delete <strong>{selectedStudent.name}</strong>? This cannot be undone.</p></div>
//             </div>
//             <div className="modal-footer">
//               <button className="btn btn-danger" onClick={handleDeleteConfirm} disabled={actionLoading}>{actionLoading ? "..." : "🗑 Delete"}</button>
//               <button className="btn btn-ghost" onClick={closeAll}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* REJECT */}
//       {showRejectModal && selectedStudent && (
//         <div className="modal-overlay" onClick={closeAll}>
//           <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header modal-header-danger"><h2>❌ Reject</h2><button className="modal-close" onClick={closeAll}>✕</button></div>
//             <div className="modal-body">
//               <p className="reject-info">Rejecting <strong>{selectedStudent.name}</strong></p>
//               <div className="form-group"><label>Reason</label><textarea rows={4} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} /></div>
//               <div className="reject-quick-reasons"><span className="quick-label">Quick:</span>{["Incomplete profile", "No resume", "Invalid info", "Duplicate"].map((r) => (<button key={r} className="quick-btn" onClick={() => setRejectReason(r)}>{r}</button>))}</div>
//             </div>
//             <div className="modal-footer">
//               <button className="btn btn-danger" onClick={handleRejectSubmit} disabled={actionLoading}>❌ Reject</button>
//               <button className="btn btn-ghost" onClick={closeAll}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* NOTIFY */}
//       {showNotifyModal && selectedStudent && (
//         <div className="modal-overlay" onClick={closeAll}>
//           <div className="modal" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header modal-header-info"><h2>🔔 Notify</h2><button className="modal-close" onClick={closeAll}>✕</button></div>
//             <div className="modal-body">
//               <p className="reject-info">Notify <strong>{selectedStudent.name}</strong> ({selectedStudent.email})</p>
//               <div className="form-group"><label>Message</label><textarea rows={5} value={notifyMsg} onChange={(e) => setNotifyMsg(e.target.value)} /></div>
//             </div>
//             <div className="modal-footer">
//               <button className="btn btn-warning" onClick={handleNotifySubmit} disabled={actionLoading}>🔔 Send</button>
//               <button className="btn btn-ghost" onClick={closeAll}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import "./ManageStudents.css";

const API = "http://localhost:5000/api/admin/students";
const RESUME_BASE = "http://localhost:5000/uploads/resumes";
const PIC_BASE = "http://localhost:5000/uploads/profile";

const getToken = () => {
  return localStorage.getItem("adminToken") || localStorage.getItem("token");
};

const apiFetch = async (url, options = {}) => {
  const token = getToken();
  const headers = {};
  if (options.body) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(url, { ...options, headers });
};

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }
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

function CompletenessBar({ pct }) {
  const color = pct === 100 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div className="completeness-wrap">
      <div className="completeness-bar-bg">
        <div className="completeness-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="completeness-pct" style={{ color }}>{pct}%</span>
    </div>
  );
}

function Badge({ text, variant }) {
  return <span className={`badge badge-${variant}`}>{text}</span>;
}

function statusBadge(status) {
  const map = { Pending: "warning", Approved: "success", Rejected: "danger", Notified: "info", "Under Review": "warning", Shortlisted: "info", Selected: "success", Scheduled: "info", Completed: "success", Cancelled: "danger" };
  return <Badge text={status} variant={map[status] || "default"} />;
}

// ═══════════════════════════════════════════
// PROFESSIONAL DROPDOWN MENU
// ═══════════════════════════════════════════
function ActionMenu({ student, onView, onEdit, onApprove, onReject, onNotify, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const status = student.approvalStatus || "Pending";
  const isIncomplete = !student.isProfileComplete;

  return (
    <div className="action-menu" ref={menuRef}>
      {/* <button className="act-btn act-view" title="View details" onClick={() => onView(student)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      </button> */}
      <button className={`act-btn act-more ${open ? "act-more-open" : ""}`} title="More actions" onClick={() => setOpen(!open)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
      </button>

      {open && (
        <div className="dropdown-menu">
          {/* ── EDIT (always available) ── */}
          <button className="dropdown-item" onClick={() => { setOpen(false); onEdit(student); }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit Profile
          </button>

          <div className="dropdown-divider" />

          {/* ── STATUS ACTIONS ── */}
          <div className="dropdown-label">Status Actions</div>

          {status !== "Approved" && (
            <button className="dropdown-item item-success" onClick={() => { setOpen(false); onApprove(student); }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Approve Student
            </button>
          )}

          {isIncomplete && status !== "Rejected" && (
            <button className="dropdown-item item-warning" onClick={() => { setOpen(false); onNotify(student); }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              Notify Incomplete
            </button>
          )}

          {status !== "Rejected" && isIncomplete && (
            <button className="dropdown-item item-danger" onClick={() => { setOpen(false); onReject(student); }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              Reject Student
            </button>
          )}

          {status === "Rejected" && (
            <button className="dropdown-item item-success" onClick={() => { setOpen(false); onApprove(student); }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
              Revert to Approved
            </button>
          )}

          {status === "Notified" && (
            <button className="dropdown-item item-danger" onClick={() => { setOpen(false); onReject(student); }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              Reject Student
            </button>
          )}

          <div className="dropdown-divider" />

          {/* ── DANGER ZONE ── */}
          <button className="dropdown-item item-delete" onClick={() => { setOpen(false); onDelete(student); }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            Delete Student
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// VIEW MODAL FOOTER ACTIONS
// ═══════════════════════════════════════════
function DetailActions({ student, onApprove, onReject, onNotify, onClose }) {
  const status = student.approvalStatus || "Pending";
  const isIncomplete = !student.isProfileComplete;

  return (
    <div className="detail-actions">
      <div className="detail-actions-left">
        {status !== "Approved" && (
          <button className="btn btn-success" onClick={() => onApprove(student)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Approve
          </button>
        )}
        {isIncomplete && status !== "Rejected" && (
          <button className="btn btn-warning" onClick={() => onNotify(student)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            Notify
          </button>
        )}
        {status !== "Rejected" && isIncomplete && (
          <button className="btn btn-outline-danger" onClick={() => onReject(student)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            Reject
          </button>
        )}
        {status === "Rejected" && (
          <button className="btn btn-outline-success" onClick={() => onApprove(student)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
            Revert Approval
          </button>
        )}
      </div>
      <button className="btn btn-ghost" onClick={onClose}>Close</button>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════
export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [resumeFilter, setResumeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [rejectReason, setRejectReason] = useState("");
  const [notifyMsg, setNotifyMsg] = useState("");

  const fetchStudents = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams({ search, status: statusFilter, resume: resumeFilter, page, limit });
      const res = await apiFetch(`${API}?${params}`);
      const text = await res.text();
      if (!text.trim()) throw new Error("Empty response from server");
      let json;
      try { json = JSON.parse(text); } catch { throw new Error(`Non-JSON response: ${text.substring(0, 100)}`); }
      if (!json.success) throw new Error(json.error || "Failed to fetch");
      setStudents(json.data); setPagination(json.pagination); setStats(json.stats);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }, [search, statusFilter, resumeFilter, page, limit]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);
  useEffect(() => { setPage(1); }, [search, statusFilter, resumeFilter, limit]);

  const fetchDetail = async (id) => {
    try {
      const res = await apiFetch(`${API}/${id}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    } catch (err) { setToast({ type: "error", message: err.message }); return null; }
  };

  const handleView = async (s) => { const d = await fetchDetail(s._id); if (d) { setSelectedStudent(d); setShowViewModal(true); } };

  const handleEditClick = (s) => {
    setSelectedStudent(s);
    setEditForm({ name: s.name || "", email: s.email || "", university: s.university || "", gpa: s.gpa || "", phone: s.phone || "", skills: s.skills || "", bio: s.bio || "", approvalStatus: s.approvalStatus || "Pending" });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    setActionLoading(true);
    try {
      const res = await apiFetch(`${API}/${selectedStudent._id}`, { method: "PUT", body: JSON.stringify(editForm) });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setToast({ type: "success", message: "Student updated successfully" }); setShowEditModal(false); fetchStudents();
    } catch (err) { setToast({ type: "error", message: err.message }); } finally { setActionLoading(false); }
  };

  const handleDeleteClick = (s) => { setSelectedStudent(s); setShowDeleteModal(true); };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      const res = await apiFetch(`${API}/${selectedStudent._id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setToast({ type: "success", message: `${selectedStudent.name} deleted` }); setShowDeleteModal(false); fetchStudents();
    } catch (err) { setToast({ type: "error", message: err.message }); } finally { setActionLoading(false); }
  };

  const handleApprove = async (s) => {
    try {
      const res = await apiFetch(`${API}/${s._id}/approve`, { method: "PUT" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setToast({ type: "success", message: `${s.name} approved` }); fetchStudents();
    } catch (err) { setToast({ type: "error", message: err.message }); }
  };

  const handleRejectClick = (s) => { setSelectedStudent(s); setRejectReason(""); setShowRejectModal(true); };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) { setToast({ type: "error", message: "Provide a reason" }); return; }
    setActionLoading(true);
    try {
      const res = await apiFetch(`${API}/${selectedStudent._id}/reject`, { method: "PUT", body: JSON.stringify({ reason: rejectReason }) });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setToast({ type: "success", message: `${selectedStudent.name} rejected` }); setShowRejectModal(false); fetchStudents();
    } catch (err) { setToast({ type: "error", message: err.message }); } finally { setActionLoading(false); }
  };

  const handleNotifyClick = (s) => {
    setSelectedStudent(s);
    const m = [];
    if (!s.university) m.push("university"); if (!s.gpa) m.push("GPA");
    if (!s.resume) m.push("resume"); if (!s.phone) m.push("phone"); if (!s.skills) m.push("skills");
    setNotifyMsg(`Your profile is incomplete. Please complete: ${m.join(", ")}. A complete profile increases your placement chances.`);
    setShowNotifyModal(true);
  };

  const handleNotifySubmit = async () => {
    if (!notifyMsg.trim()) { setToast({ type: "error", message: "Provide a message" }); return; }
    setActionLoading(true);
    try {
      const res = await apiFetch(`${API}/${selectedStudent._id}/notify`, { method: "PUT", body: JSON.stringify({ message: notifyMsg }) });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setToast({ type: "success", message: `${selectedStudent.name} notified` }); setShowNotifyModal(false); fetchStudents();
    } catch (err) { setToast({ type: "error", message: err.message }); } finally { setActionLoading(false); }
  };

  let searchTimer;
  const handleSearchChange = (e) => { clearTimeout(searchTimer); searchTimer = setTimeout(() => setSearch(e.target.value), 400); };
  const closeAll = () => { setShowViewModal(false); setShowEditModal(false); setShowDeleteModal(false); setShowRejectModal(false); setShowNotifyModal(false); setSelectedStudent(null); };

  const getPageNumbers = () => {
    if (!pagination) return [];
    const { totalPages: t, } = pagination;
    if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1);
    const p = [1]; if (page > 3) p.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(t - 1, page + 1); i++) p.push(i);
    if (page < t - 2) p.push("..."); p.push(t); return p;
  };

  const pageNumbers = getPageNumbers();
  const showingFrom = pagination ? (page - 1) * limit + 1 : 0;
  const showingTo = pagination ? Math.min(page * limit, pagination.totalStudents) : 0;

  return (
    <div className="dashboard-container">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <aside className="sidebar">
        <h2>🎓 Admin</h2>
        <ul>
          <li><Link to="/admin/dashboard">📊 Dashboard</Link></li>
          <li className="active">👨‍🎓 Students</li>
          <li><Link to="/recruiters">🏢 Recruiters</Link></li>
          <li><Link to="/admin/approve-jobs">📄 Approve Jobs</Link></li>
            <li><Link to="/admin/applications">📬 Applications</Link></li>
 <li>
            <Link to="/admin/results">✅ Results</Link>
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="top-nav">
          <h1><b>👨‍🎓 Manage Students</b></h1>
        </header>

        <div className="ms-filters">
          <div className="ms-search-box">
            <span className="ms-search-icon">🔍</span>
            <input type="text" placeholder="Search name, email, university..." onChange={handleSearchChange} className="ms-search-input" />
          </div>
          <select className="ms-filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Notified">Notified</option>
          </select>
          <select className="ms-filter-select" value={resumeFilter} onChange={(e) => setResumeFilter(e.target.value)}>
            <option value="all">All Resume</option>
            <option value="uploaded">Uploaded</option>
            <option value="not-uploaded">No Resume</option>
          </select>
          <select className="ms-filter-select" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
            <option value={3}>3 per page</option>
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
          </select>
        </div>

        {error && (
          <div className="ms-error"><span>⚠️ {error}</span><button onClick={fetchStudents}>Retry</button></div>
        )}

        {loading && !error && (
          <div className="ms-loading"><div className="ms-spinner" /><p>Loading students...</p></div>
        )}

        {!loading && !error && (
          <>
            {students.length === 0 ? (
              <div className="ms-empty"><span className="ms-empty-icon">📭</span><h3>No students found</h3></div>
            ) : (
              <div className="ms-table-wrap">
                <table className="ms-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>University</th>
                      <th>GPA</th>
                      <th>Resume</th>
                      <th>Complete</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right", paddingRight: "16px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s._id} className="ms-table-row">
                        <td>
                          <div className="ms-student-cell">
                            <img
                              src={s.profilePic ? `${PIC_BASE}/${s.profilePic}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=6366f1&color=fff&size=40`}
                              alt={s.name} className="ms-avatar"
                              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=6366f1&color=fff&size=40`; }}
                            />
                            <div>
                              <span className="ms-student-name">{s.name}</span>
                              <span className="ms-student-email">{s.email}</span>
                            </div>
                          </div>
                        </td>
                        <td><span className={s.university ? "" : "text-muted"}>{s.university || "—"}</span></td>
                        <td><span className={s.gpa ? "" : "text-muted"}>{s.gpa || "—"}</span></td>
                        <td>
                          {s.resume ? (
                            <a href={`${RESUME_BASE}/${s.resume}`} target="_blank" rel="noreferrer" className="resume-link">📄 View</a>
                          ) : (
                            <Badge text="No resume" variant="danger" />
                          )}
                        </td>
                        <td><CompletenessBar pct={s.profileCompleteness} /></td>
                        <td>{statusBadge(s.approvalStatus || "Pending")}</td>
                        <td>
                          <ActionMenu
                            student={s}
                            onView={handleView}
                            onEdit={handleEditClick}
                            onApprove={handleApprove}
                            onReject={handleRejectClick}
                            onNotify={handleNotifyClick}
                            onDelete={handleDeleteClick}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {pagination && students.length > 0 && (
              <div className="ms-pagination-wrapper">
                <div className="ms-pagination-info">
                  <span>Showing <strong>{showingFrom}</strong>–<strong>{showingTo}</strong> of <strong>{pagination.totalStudents}</strong></span>
                  <span>Page <strong>{page}</strong> of <strong>{pagination.totalPages}</strong></span>
                </div>
                <div className="ms-pagination">
                  <button className="page-btn" disabled={page === 1} onClick={() => setPage(1)}>««</button>
                  <button className="page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹ Prev</button>
                  {pageNumbers.map((n, idx) =>
                    n === "..." ? <span key={`e${idx}`} className="page-ellipsis">…</span> : (
                      <button key={n} className={`page-btn ${n === page ? "page-active" : ""}`} onClick={() => setPage(n)}>{n}</button>
                    )
                  )}
                  <button className="page-btn" disabled={page === pagination.totalPages} onClick={() => setPage((p) => p + 1)}>Next ›</button>
                  <button className="page-btn" disabled={page === pagination.totalPages} onClick={() => setPage(pagination.totalPages)}>»»</button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ═══════ VIEW MODAL ═══════ */}
      {showViewModal && selectedStudent && (
        <div className="modal-overlay" onClick={closeAll}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>Student Details</h2><button className="modal-close" onClick={closeAll}>✕</button></div>
            <div className="modal-body">
              <div className="detail-profile">
                <img src={selectedStudent.profilePic ? `${PIC_BASE}/${selectedStudent.profilePic}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.name)}&background=6366f1&color=fff&size=100`} alt={selectedStudent.name} className="detail-avatar" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.name)}&background=6366f1&color=fff&size=100`; }} />
                <div className="detail-name-wrap">
                  <h3>{selectedStudent.name}</h3>
                  <p className="detail-email">{selectedStudent.email}</p>
                  <div className="detail-badges">
                    {statusBadge(selectedStudent.approvalStatus || "Pending")}
                    {selectedStudent.resume ? <a href={`${RESUME_BASE}/${selectedStudent.resume}`} target="_blank" rel="noreferrer" className="badge badge-resume">📄 Resume</a> : <Badge text="No Resume" variant="danger" />}
                  </div>
                </div>
              </div>
              <div className="detail-section">
                <h4>Profile Completeness</h4>
                <CompletenessBar pct={selectedStudent.profileCompleteness} />
                {selectedStudent.missingFields?.length > 0 && (
                  <div className="missing-fields"><span className="missing-label">Missing:</span>{selectedStudent.missingFields.map((f) => <span key={f} className="missing-tag">{f}</span>)}</div>
                )}
              </div>
              <div className="detail-grid">
                <div className="detail-field"><label>University</label><span>{selectedStudent.university || "—"}</span></div>
                <div className="detail-field"><label>GPA</label><span>{selectedStudent.gpa || "—"}</span></div>
                <div className="detail-field"><label>Phone</label><span>{selectedStudent.phone || "—"}</span></div>
                <div className="detail-field"><label>Skills</label><span>{selectedStudent.skills || "—"}</span></div>
                <div className="detail-field full-width"><label>Bio</label><span>{selectedStudent.bio || "—"}</span></div>
                {selectedStudent.adminNotes && <div className="detail-field full-width admin-note"><label>Admin Notes</label><span>{selectedStudent.adminNotes}</span></div>}
              </div>
              {selectedStudent.applications?.length > 0 && (
                <div className="detail-section">
                  <h4>Applications ({selectedStudent.applications.length})</h4>
                  <div className="detail-list">
                    {selectedStudent.applications.map((app) => (
                      <div key={app._id} className="detail-list-item">
                        <div><span className="app-job-title">{app.job || "Unknown"}</span><span className="app-company">{app.company?.companyName || "N/A"}</span></div>
                        <div>{statusBadge(app.status)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <DetailActions
                student={selectedStudent}
                onApprove={(s) => { handleApprove(s); closeAll(); }}
                onReject={(s) => { handleRejectClick(s); setShowViewModal(false); }}
                onNotify={(s) => { handleNotifyClick(s); setShowViewModal(false); }}
                onClose={closeAll}
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══════ EDIT MODAL ═══════ */}
      {showEditModal && selectedStudent && (
        <div className="modal-overlay" onClick={closeAll}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>Edit Student</h2><button className="modal-close" onClick={closeAll}>✕</button></div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group"><label>Name</label><input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></div>
                <div className="form-group"><label>Email</label><input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} /></div>
                <div className="form-group"><label>University</label><input type="text" value={editForm.university} onChange={(e) => setEditForm({ ...editForm, university: e.target.value })} /></div>
                <div className="form-group"><label>GPA</label><input type="text" value={editForm.gpa} onChange={(e) => setEditForm({ ...editForm, gpa: e.target.value })} /></div>
                <div className="form-group"><label>Phone</label><input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} /></div>
                <div className="form-group"><label>Skills</label><input type="text" value={editForm.skills} onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })} /></div>
                <div className="form-group full-width"><label>Bio</label><textarea rows={3} value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} /></div>
                <div className="form-group"><label>Status</label><select value={editForm.approvalStatus} onChange={(e) => setEditForm({ ...editForm, approvalStatus: e.target.value })}><option value="Pending">Pending</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option><option value="Notified">Notified</option></select></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleEditSubmit} disabled={actionLoading}>{actionLoading ? "Saving..." : "💾 Save Changes"}</button>
              <button className="btn btn-ghost" onClick={closeAll}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ DELETE MODAL ═══════ */}
      {showDeleteModal && selectedStudent && (
        <div className="modal-overlay" onClick={closeAll}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header modal-header-danger"><h2>Delete Student</h2><button className="modal-close" onClick={closeAll}>✕</button></div>
            <div className="modal-body">
              <div className="delete-warning">
                <span className="delete-icon">⚠️</span>
                <p>Are you sure you want to permanently delete <strong>{selectedStudent.name}</strong>?</p>
                <p className="delete-sub">This will also remove all their applications and interview records. This action cannot be undone.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger" onClick={handleDeleteConfirm} disabled={actionLoading}>{actionLoading ? "Deleting..." : "🗑 Delete Permanently"}</button>
              <button className="btn btn-ghost" onClick={closeAll}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ REJECT MODAL ═══════ */}
      {showRejectModal && selectedStudent && (
        <div className="modal-overlay" onClick={closeAll}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header modal-header-danger"><h2>Reject Student</h2><button className="modal-close" onClick={closeAll}>✕</button></div>
            <div className="modal-body">
              <p className="reject-info">You are rejecting <strong>{selectedStudent.name}</strong>. This will notify the student about the rejection.</p>
              <div className="form-group"><label>Rejection Reason</label><textarea rows={4} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="e.g. Profile is incomplete, missing critical information..." /></div>
              <div className="reject-quick-reasons"><span className="quick-label">Quick reasons:</span>{["Incomplete profile", "No resume uploaded", "Invalid information", "Duplicate account"].map((r) => (<button key={r} className="quick-btn" onClick={() => setRejectReason(r)}>{r}</button>))}</div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger" onClick={handleRejectSubmit} disabled={actionLoading}>{actionLoading ? "Rejecting..." : "❌ Confirm Rejection"}</button>
              <button className="btn btn-ghost" onClick={closeAll}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ NOTIFY MODAL ═══════ */}
      {showNotifyModal && selectedStudent && (
        <div className="modal-overlay" onClick={closeAll}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header modal-header-info"><h2>Send Notification</h2><button className="modal-close" onClick={closeAll}>✕</button></div>
            <div className="modal-body">
              <div className="notify-header">
                <div>
                  <p className="reject-info">Sending notification to <strong>{selectedStudent.name}</strong></p>
                  <p className="notify-email">{selectedStudent.email}</p>
                </div>
                <Badge text={selectedStudent.approvalStatus || "Pending"} variant={selectedStudent.approvalStatus === "Approved" ? "success" : selectedStudent.approvalStatus === "Rejected" ? "danger" : "warning"} />
              </div>
              <div className="form-group"><label>Notification Message</label><textarea rows={5} value={notifyMsg} onChange={(e) => setNotifyMsg(e.target.value)} /></div>
              <p className="notify-note">💡 Student status will be set to "Notified". Integrate email/SMS service for actual delivery.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-warning" onClick={handleNotifySubmit} disabled={actionLoading}>{actionLoading ? "Sending..." : "🔔 Send Notification"}</button>
              <button className="btn btn-ghost" onClick={closeAll}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}