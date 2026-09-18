
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./ManageRecruiters.css";

// const ManageRecruiters = () => {
//   const [recruiters, setRecruiters] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("All");

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const recruitersPerPage = 5;

//   const navigate = useNavigate();

//   const fetchRecruiters = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/recruiters");
//       setRecruiters(res.data);
//     } catch (error) {
//       console.error("Error fetching recruiters:", error);
//     }
//   };

//   useEffect(() => {
//     fetchRecruiters();
//   }, []);

//   // Navigate
//   const handleVerify = (id) => {
//     navigate(`/verify-recruiter/${id}`);
//   };

//   const handleApprove = async (id) => {
//     await axios.put(`http://localhost:5000/api/recruiters/approve/${id}`);
//     fetchRecruiters();
//   };

//   const handleReject = async (id) => {
//     await axios.put(`http://localhost:5000/api/recruiters/reject/${id}`);
//     fetchRecruiters();
//   };

//   const handleDelete = async (id) => {
//     await axios.delete(`http://localhost:5000/api/recruiters/${id}`);
//     fetchRecruiters();
//   };

//   // ✅ FILTER + SEARCH LOGIC
//   const filteredRecruiters = recruiters.filter((rec) => {
//     const matchSearch =
//       rec.companyName.toLowerCase().includes(search.toLowerCase()) ||
//       rec.email.toLowerCase().includes(search.toLowerCase());

//     const matchFilter = filter === "All" || rec.status === filter;

//     return matchSearch && matchFilter;
//   });

//   // ✅ PAGINATION LOGIC
//   const indexOfLast = currentPage * recruitersPerPage;
//   const indexOfFirst = indexOfLast - recruitersPerPage;
//   const currentRecruiters = filteredRecruiters.slice(indexOfFirst, indexOfLast);

//   const totalPages = Math.ceil(filteredRecruiters.length / recruitersPerPage);

//   return (
//     <div className="manage-recruiters">
//       <h1>
//         <b>🏢 Manage Recruiters / Companies</b>
//       </h1>
//       <br></br>
//       {/* 🔍 SEARCH + FILTER */}
//       <div className="top-bar">
//         <input
//           type="text"
//           placeholder="Search by name or email..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <select onChange={(e) => setFilter(e.target.value)}>
//           <option value="All">All</option>
//           <option value="Approved">Approved</option>
//           <option value="Pending">Pending</option>
//           <option value="Rejected">Rejected</option>
//         </select>
//       </div>

//       <table>
//         <thead>
//           <tr>
//             <th>Company Name</th>
//             <th>Email</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {currentRecruiters.map((rec) => (
//             <tr key={rec._id}>
//               <td>{rec.companyName}</td>
//               <td>{rec.email}</td>

//               <td>
//                 <span className={`status ${rec.status?.toLowerCase()}`}>
//                   {rec.status}
//                 </span>
//               </td>

//               <td>
//                 <button
//                   onClick={() => handleVerify(rec._id)}
//                   style={{ color: "black" }}
//                 >
//                   Verify ||  View
//                 </button>

//                 {/* <button
//                   onClick={() => handleApprove(rec._id)}
//                   // style={{ background: "green", color: "white" }}
//                 >
//                   Approve
//                 </button>

//                 <button
//                   onClick={() => handleReject(rec._id)} //background: "orange",
//                   style={{ color: "black" }}
//                 >
//                   Reject
//                 </button>

//                 <button
//                   onClick={() => handleDelete(rec._id)} //background: "red",
//                   style={{ color: "black  " }}
//                 >
//                   Delete
//                 </button> */}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* 📄 PAGINATION */}
//       <div className="pagination">
//         <button
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage(currentPage - 1)}
//         >
//           Prev
//         </button>

//         <span>
//           {" "}
//           Page {currentPage} of {totalPages}{" "}
//         </span>

//         <button
//           disabled={currentPage === totalPages}
//           onClick={() => setCurrentPage(currentPage + 1)}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ManageRecruiters;
// ManageRecruiters.jsx
// ManageRecruiters.jsx
import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ManageStudents.css"; // ← USE THE EXACT SAME CSS FILE

const API = "http://localhost:5000/api/recruiters";

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

function Badge({ text, variant }) {
  return <span className={`badge badge-${variant}`}>{text}</span>;
}

function statusBadge(status) {
  const map = { Pending: "warning", Approved: "success", Rejected: "danger", Verified: "info", Active: "success", Inactive: "default", Suspended: "danger" };
  return <Badge text={status || "Pending"} variant={map[status] || "default"} />;
}

function ActionMenu({ recruiter, onView, onApprove, onReject, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    const handleClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false); };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);
  const status = recruiter.status || "Pending";
  return (
    <div className="action-menu" ref={menuRef}>
      <button className="act-btn act-view" title="View details" onClick={() => onView(recruiter)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      </button>
      <button className={`act-btn act-more ${open ? "act-more-open" : ""}`} title="More actions" onClick={() => setOpen(!open)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
      </button>
      {open && (
        <div className="dropdown-menu">
          <div className="dropdown-label">Status Actions</div>
          {status === "Pending" && (
            <>
              <button className="dropdown-item item-success" onClick={() => { setOpen(false); onApprove(recruiter); }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Approve Recruiter
              </button>
              <button className="dropdown-item item-danger" onClick={() => { setOpen(false); onReject(recruiter); }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Reject Recruiter
              </button>
            </>
          )}
          {status === "Approved" && (
            <button className="dropdown-item item-warning" onClick={() => { setOpen(false); onReject(recruiter); }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              Suspend / Revoke
            </button>
          )}
          {status === "Rejected" && (
            <button className="dropdown-item item-success" onClick={() => { setOpen(false); onApprove(recruiter); }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
              Re-approve
            </button>
          )}
          <div className="dropdown-divider" />
          <button className="dropdown-item item-delete" onClick={() => { setOpen(false); onDelete(recruiter); }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            Delete Recruiter
          </button>
        </div>
      )}
    </div>
  );
}

function DetailActions({ recruiter, onApprove, onReject, onClose }) {
  const status = recruiter.status || "Pending";
  return (
    <div className="detail-actions">
      <div className="detail-actions-left">
        {status === "Pending" && (
          <>
            <button className="btn btn-success" onClick={() => onApprove(recruiter)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Approve
            </button>
            <button className="btn btn-outline-danger" onClick={() => onReject(recruiter)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              Reject
            </button>
          </>
        )}
        {status === "Approved" && (
          <button className="btn btn-outline-danger" onClick={() => onReject(recruiter)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            Suspend
          </button>
        )}
        {status === "Rejected" && (
          <button className="btn btn-outline-success" onClick={() => onApprove(recruiter)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
            Re-approve
          </button>
        )}
      </div>
      <button className="btn btn-ghost" onClick={onClose}>Close</button>
    </div>
  );
}

const ManageRecruiters = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const fetchRecruiters = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await axios.get(API);
      setRecruiters(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch recruiters");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchRecruiters(); }, [fetchRecruiters]);
  useEffect(() => { setCurrentPage(1); }, [search, statusFilter, limit]);

  const stats = {
    total: recruiters.length,
    approved: recruiters.filter((r) => r.status === "Approved").length,
    pending: recruiters.filter((r) => r.status === "Pending").length,
    rejected: recruiters.filter((r) => r.status === "Rejected").length,
  };

  const filteredRecruiters = recruiters.filter((rec) => {
    const matchSearch = rec.companyName?.toLowerCase().includes(search.toLowerCase()) || rec.email?.toLowerCase().includes(search.toLowerCase()) || rec.contactPerson?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = statusFilter === "all" || rec.status === statusFilter;
    return matchSearch && matchFilter;
  });

  const indexOfLast = currentPage * limit;
  const indexOfFirst = indexOfLast - limit;
  const currentRecruiters = filteredRecruiters.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRecruiters.length / limit);

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const p = [1]; if (currentPage > 3) p.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) p.push(i);
    if (currentPage < totalPages - 2) p.push("..."); p.push(totalPages); return p;
  };
  const pageNumbers = getPageNumbers();
  const showingFrom = filteredRecruiters.length > 0 ? indexOfFirst + 1 : 0;
  const showingTo = Math.min(indexOfLast, filteredRecruiters.length);

  const handleView = (rec) => { setSelectedRecruiter(rec); setShowViewModal(true); };

  const handleApprove = async (rec) => {
    try {
      setActionLoading(true);
      await axios.put(`${API}/approve/${rec._id}`);
      setToast({ type: "success", message: `${rec.companyName} approved` });
      fetchRecruiters();
    } catch (err) { setToast({ type: "error", message: err.response?.data?.message || "Failed to approve" }); }
    finally { setActionLoading(false); }
  };

  const handleRejectClick = (rec) => { setSelectedRecruiter(rec); setRejectReason(""); setShowRejectModal(true); };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) { setToast({ type: "error", message: "Provide a reason" }); return; }
    try {
      setActionLoading(true);
      await axios.put(`${API}/reject/${selectedRecruiter._id}`, { reason: rejectReason });
      setToast({ type: "success", message: `${selectedRecruiter.companyName} rejected` });
      setShowRejectModal(false); fetchRecruiters();
    } catch (err) { setToast({ type: "error", message: err.response?.data?.message || "Failed to reject" }); }
    finally { setActionLoading(false); }
  };

  const handleDeleteClick = (rec) => { setSelectedRecruiter(rec); setShowDeleteModal(true); };

  const handleDeleteConfirm = async () => {
    try {
      setActionLoading(true);
      await axios.delete(`${API}/${selectedRecruiter._id}`);
      setToast({ type: "success", message: `${selectedRecruiter.companyName} deleted` });
      setShowDeleteModal(false); fetchRecruiters();
    } catch (err) { setToast({ type: "error", message: err.response?.data?.message || "Failed to delete" }); }
    finally { setActionLoading(false); }
  };

  const closeAll = () => { setShowViewModal(false); setShowDeleteModal(false); setShowRejectModal(false); setSelectedRecruiter(null); };

  let searchTimer;
  const handleSearchChange = (e) => { clearTimeout(searchTimer); searchTimer = setTimeout(() => setSearch(e.target.value), 400); };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="dashboard-container">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* ═══════ SIDEBAR — SAME AS STUDENTS ═══════ */}
      <aside className="sidebar">
        <h2>🎓 Admin</h2>
        <ul>
          <li><Link to="/admin/dashboard">📊 Dashboard</Link></li>
          <li><Link to="/students">👨‍🎓 Students</Link></li>
          <li className="active">🏢 Recruiters</li>
          <li><Link to="/admin/approve-jobs">📄 Approve Jobs</Link></li>
            <li><Link to="/admin/applications">📬 Applications</Link></li>
           <li>
                      <Link to="/admin/results">✅ Results</Link>
                    </li>
        </ul>
      </aside>

      {/* ═══════ MAIN CONTENT — SAME STRUCTURE ═══════ */}
      <main className="main-content">
        <header className="top-nav">
          <h1><b>🏢 Manage Recruiters</b></h1>
        </header>

        {/* Stats Cards — SAME STYLE */}
        <div className="ms-stats-grid">
          <div className="stats-card" style={{ borderTopColor: "#6366f1" }}>
            <div className="stats-icon" style={{ color: "#6366f1", background: "rgba(99,102,241,0.08)" }}>🏢</div>
            <div className="stats-info"><span className="stats-value">{stats.total}</span><span className="stats-label">Total</span></div>
          </div>
          <div className="stats-card" style={{ borderTopColor: "#10b981" }}>
            <div className="stats-icon" style={{ color: "#10b981", background: "rgba(16,185,129,0.08)" }}>✅</div>
            <div className="stats-info"><span className="stats-value">{stats.approved}</span><span className="stats-label">Approved</span></div>
          </div>
          <div className="stats-card" style={{ borderTopColor: "#f59e0b" }}>
            <div className="stats-icon" style={{ color: "#f59e0b", background: "rgba(245,158,11,0.08)" }}>⏳</div>
            <div className="stats-info"><span className="stats-value">{stats.pending}</span><span className="stats-label">Pending</span></div>
          </div>
          <div className="stats-card" style={{ borderTopColor: "#ef4444" }}>
            <div className="stats-icon" style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)" }}>❌</div>
            <div className="stats-info"><span className="stats-value">{stats.rejected}</span><span className="stats-label">Rejected</span></div>
          </div>
        </div>

        {/* Filters — SAME STYLE */}
        <div className="ms-filters">
          <div className="ms-search-box">
            <span className="ms-search-icon">🔍</span>
            <input type="text" placeholder="Search company, email, contact person..." onChange={handleSearchChange} className="ms-search-input" />
          </div>
          <select className="ms-filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select className="ms-filter-select" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
            <option value={3}>3 per page</option>
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
          </select>
        </div>

        {/* Error — SAME STYLE */}
        {error && (
          <div className="ms-error"><span>⚠️ {error}</span><button onClick={fetchRecruiters}>Retry</button></div>
        )}

        {/* Loading — SAME STYLE */}
        {loading && !error && (
          <div className="ms-loading"><div className="ms-spinner" /><p>Loading recruiters...</p></div>
        )}

        {/* Table — SAME STYLE */}
        {!loading && !error && (
          <>
            {currentRecruiters.length === 0 ? (
              <div className="ms-empty"><span className="ms-empty-icon">📭</span><h3>No recruiters found</h3></div>
            ) : (
              <div className="ms-table-wrap">
                <table className="ms-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Contact Person</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Joined</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right", paddingRight: "16px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecruiters.map((rec) => (
                      <tr key={rec._id} className="ms-table-row">
                        <td>
                          <div className="ms-student-cell">
                            <div className="ms-avatar" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "14px", border: "none" }}>
                              {rec.companyName?.charAt(0)?.toUpperCase() || "C"}
                            </div>
                            <div>
                              <span className="ms-student-name">{rec.companyName}</span>
                              <span className="ms-student-email">{rec.website || rec.industry || "—"}</span>
                            </div>
                          </div>
                        </td>
                        <td><span className={rec.contactPerson ? "" : "text-muted"}>{rec.contactPerson || "—"}</span></td>
                        <td><span className="ms-student-email">{rec.email}</span></td>
                        <td><span className={rec.phone ? "" : "text-muted"}>{rec.phone || "—"}</span></td>
                        <td><span className="ms-student-email">{formatDate(rec.createdAt)}</span></td>
                        <td>{statusBadge(rec.status)}</td>
                        <td>
                          <ActionMenu
                            recruiter={rec}
                            onView={handleView}
                            onApprove={handleApprove}
                            onReject={handleRejectClick}
                            onDelete={handleDeleteClick}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination — SAME STYLE */}
            {filteredRecruiters.length > 0 && (
              <div className="ms-pagination-wrapper">
                <div className="ms-pagination-info">
                  <span>Showing <strong>{showingFrom}</strong>–<strong>{showingTo}</strong> of <strong>{filteredRecruiters.length}</strong> recruiters</span>
                  <span>Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong></span>
                </div>
                <div className="ms-pagination">
                  <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>««</button>
                  <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>‹ Prev</button>
                  {pageNumbers.map((n, idx) =>
                    n === "..." ? <span key={`e${idx}`} className="page-ellipsis">…</span> : (
                      <button key={n} className={`page-btn ${n === currentPage ? "page-active" : ""}`} onClick={() => setCurrentPage(n)}>{n}</button>
                    )
                  )}
                  <button className="page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next ›</button>
                  <button className="page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>»»</button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ═══════ VIEW MODAL — SAME STYLE ═══════ */}
      {showViewModal && selectedRecruiter && (
        <div className="modal-overlay" onClick={closeAll}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>Recruiter Details</h2><button className="modal-close" onClick={closeAll}>✕</button></div>
            <div className="modal-body">
              <div className="detail-profile">
                <div className="detail-avatar" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "16px" }}>
                  {selectedRecruiter.companyName?.charAt(0)?.toUpperCase() || "C"}
                </div>
                <div className="detail-name-wrap">
                  <h3>{selectedRecruiter.companyName}</h3>
                  <p className="detail-email">{selectedRecruiter.email}</p>
                  <div className="detail-badges">
                    {statusBadge(selectedRecruiter.status)}
                    {selectedRecruiter.website && (
                      <a href={selectedRecruiter.website.startsWith("http") ? selectedRecruiter.website : `https://${selectedRecruiter.website}`} target="_blank" rel="noreferrer" className="badge badge-resume">🌐 Website</a>
                    )}
                  </div>
                </div>
              </div>
              <div className="detail-grid">
                <div className="detail-field"><label>Contact Person</label><span>{selectedRecruiter.contactPerson || "—"}</span></div>
                <div className="detail-field"><label>Phone</label><span>{selectedRecruiter.phone || "—"}</span></div>
                <div className="detail-field"><label>Industry</label><span>{selectedRecruiter.industry || "—"}</span></div>
                <div className="detail-field"><label>Company Size</label><span>{selectedRecruiter.companySize || "—"}</span></div>
                <div className="detail-field"><label>Location</label><span>{selectedRecruiter.location || "—"}</span></div>
                <div className="detail-field"><label>Joined</label><span>{formatDate(selectedRecruiter.createdAt)}</span></div>
                <div className="detail-field full-width"><label>Description</label><span>{selectedRecruiter.description || "—"}</span></div>
                {selectedRecruiter.rejectReason && (
                  <div className="detail-field full-width admin-note"><label>Rejection Reason</label><span>{selectedRecruiter.rejectReason}</span></div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <DetailActions
                recruiter={selectedRecruiter}
                onApprove={(r) => { handleApprove(r); closeAll(); }}
                onReject={(r) => { handleRejectClick(r); setShowViewModal(false); }}
                onClose={closeAll}
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══════ DELETE MODAL — SAME STYLE ═══════ */}
      {showDeleteModal && selectedRecruiter && (
        <div className="modal-overlay" onClick={closeAll}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header modal-header-danger"><h2>Delete Recruiter</h2><button className="modal-close" onClick={closeAll}>✕</button></div>
            <div className="modal-body">
              <div className="delete-warning">
                <span className="delete-icon">⚠️</span>
                <p>Are you sure you want to permanently delete <strong>{selectedRecruiter.companyName}</strong>?</p>
                <p className="delete-sub">This will also remove all their posted jobs and applications. This action cannot be undone.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger" onClick={handleDeleteConfirm} disabled={actionLoading}>{actionLoading ? "Deleting..." : "🗑 Delete Permanently"}</button>
              <button className="btn btn-ghost" onClick={closeAll}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ REJECT MODAL — SAME STYLE ═══════ */}
      {showRejectModal && selectedRecruiter && (
        <div className="modal-overlay" onClick={closeAll}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header modal-header-danger"><h2>Reject Recruiter</h2><button className="modal-close" onClick={closeAll}>✕</button></div>
            <div className="modal-body">
              <p className="reject-info">You are rejecting <strong>{selectedRecruiter.companyName}</strong>. This will notify the recruiter about the rejection.</p>
              <div className="form-group"><label>Rejection Reason</label><textarea rows={4} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="e.g. Company verification failed, invalid documents..." /></div>
              <div className="reject-quick-reasons"><span className="quick-label">Quick reasons:</span>{["Verification failed", "Invalid documents", "Fake company", "Duplicate account"].map((r) => (<button key={r} className="quick-btn" onClick={() => setRejectReason(r)}>{r}</button>))}</div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger" onClick={handleRejectSubmit} disabled={actionLoading}>{actionLoading ? "Rejecting..." : "❌ Confirm Rejection"}</button>
              <button className="btn btn-ghost" onClick={closeAll}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRecruiters;