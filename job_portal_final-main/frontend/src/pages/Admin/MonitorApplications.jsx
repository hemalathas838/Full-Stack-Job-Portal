// import { useState, useEffect, useCallback, useRef } from "react";
// import {
//   Inbox,
//   Filter,
//   XCircle,
//   Search,
//   Download,
//   RefreshCw,
//   ChevronLeft,
//   ChevronRight,
//   ArrowRightLeft,
//   Eye,
//   Trash2,
//   GraduationCap,
//   User,
//   Briefcase,
//   Building2,
//   Calendar,
//   FileText,
//   AlignLeft,
//   CheckCircle,
//   AlertCircle,
//   Info,
//   Layers,
//   Clock,
//   Star,
//   Video,
//   X,
// } from "lucide-react";

// const API = "http://localhost:5000/api";

// // ─── Helpers ───────────────────────────────────────────────
// function tok() {
//   return localStorage.getItem("adminToken") || localStorage.getItem("token");
// }
// function esc(s) {
//   if (!s) return "";
//   const d = document.createElement("div");
//   d.textContent = s;
//   return d.innerHTML;
// }
// function badgeCls(s) {
//   const m = {
//     "Under Review": "b-review",
//     Shortlisted: "b-short",
//     "Interview Scheduled": "b-interview",
//     Selected: "b-selected",
//     Rejected: "b-rejected",
//   };
//   return m[s] || "b-review";
// }
// function initials(n) {
//   if (!n || n === "Unknown") return "?";
//   return n
//     .split(" ")
//     .map((w) => w[0])
//     .join("")
//     .substring(0, 2)
//     .toUpperCase();
// }
// function avatarColor(n) {
//   if (!n || n === "Unknown") return "bg-white/10";
//   const c = [
//     "bg-blue-500/20",
//     "bg-purple-500/20",
//     "bg-orange-500/20",
//     "bg-green-500/20",
//     "bg-pink-500/20",
//     "bg-cyan-500/20",
//     "bg-yellow-500/20",
//     "bg-red-500/20",
//     "bg-indigo-500/20",
//   ];
//   let h = 0;
//   for (let i = 0; i < n.length; i++) h = n.charCodeAt(i) + ((h << 5) - h);
//   return c[Math.abs(h) % c.length];
// }
// function fdate(d) {
//   if (!d) return "—";
//   const now = new Date(),
//     diff = now - new Date(d),
//     days = Math.floor(diff / 864e5);
//   if (days === 0) return "Today";
//   if (days === 1) return "Yesterday";
//   if (days < 7) return days + "d ago";
//   if (days < 30) return Math.floor(days / 7) + "w ago";
//   return new Date(d).toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//   });
// }
// function pageNums(c, t) {
//   if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1);
//   if (c <= 3) return [1, 2, 3, 4, "...", t];
//   if (c >= t - 2) return [1, "...", t - 3, t - 2, t - 1, t];
//   return [1, "...", c - 1, c, c + 1, "...", t];
// }

// // ─── Toast Component ───────────────────────────────────────
// let toastId = 0;
// function ToastContainer({ toasts, removeToast }) {
//   return (
//     <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3">
//       {toasts.map((t) => {
//         const cl = {
//           success: {
//             bg: "rgba(34,197,94,0.15)",
//             bd: "rgba(34,197,94,0.3)",
//             tx: "#86EFAC",
//             Icon: CheckCircle,
//           },
//           error: {
//             bg: "rgba(239,68,68,0.15)",
//             bd: "rgba(239,68,68,0.3)",
//             tx: "#FCA5A5",
//             Icon: AlertCircle,
//           },
//           info: {
//             bg: "rgba(59,130,246,0.15)",
//             bd: "rgba(59,130,246,0.3)",
//             tx: "#93C5FD",
//             Icon: Info,
//           },
//         }[t.type];
//         const c = cl || {
//           bg: "rgba(59,130,246,0.15)",
//           bd: "rgba(59,130,246,0.3)",
//           tx: "#93C5FD",
//           Icon: Info,
//         };
//         const Icon = c.Icon;
//         return (
//           <div
//             key={t.id}
//             className="flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-xl min-w-[280px]"
//             style={{
//               background: c.bg,
//               border: `1px solid ${c.bd}`,
//               animation: "slideIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
//             }}
//           >
//             <Icon className="w-4 h-4 shrink-0" style={{ color: c.tx }} />
//             <p className="text-sm" style={{ color: c.tx }}>
//               {t.msg}
//             </p>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// // ─── Main Component ────────────────────────────────────────
// export default function MonitorApplications() {
//   const [apps, setApps] = useState([]);
//   const [stats, setStats] = useState({});
//   const [filterOpts, setFilterOpts] = useState({
//     companies: [],
//     jobs: [],
//     students: [],
//   });
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 0,
//     totalApplications: 0,
//     limit: 10,
//   });
//   const [loading, setLoading] = useState(true);
//   const [toasts, setToasts] = useState([]);

//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [fSearch, setFSearch] = useState("");
//   const [fCompany, setFCompany] = useState("all");
//   const [fJob, setFJob] = useState("all");
//   const [fStudent, setFStudent] = useState("all");
//   const [fStatus, setFStatus] = useState("all");

//   const [statusModal, setStatusModal] = useState({ open: false, id: "", name: "", job: "", cur: "" });
//   const [detailModal, setDetailModal] = useState({ open: false, data: null });
//   const [refreshing, setRefreshing] = useState(false);

//   const searchTimer = useRef(null);

//   // Toast helper
//   const toast = useCallback((msg, type = "info") => {
//     const id = ++toastId;
//     setToasts((p) => [...p, { id, msg, type }]);
//     setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
//   }, []);

//   // Fetch
//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     const t = tok();
//     if (!t) {
//       toast("Not authenticated", "error");
//       setLoading(false);
//       return;
//     }
//     const p = new URLSearchParams({
//       page,
//       limit,
//       company: fCompany,
//       job: fJob,
//       student: fStudent,
//       status: fStatus,
//       search: fSearch.trim(),
//     });
//     try {
//       const r = await fetch(`${API}/admin/applications?${p}`, {
//         headers: { Authorization: `Bearer ${t}` },
//       });
//       if (!r.ok) throw new Error();
//       const d = await r.json();
//       setApps(d.data || []);
//       setStats(d.stats || {});
//       setFilterOpts(d.filters || {});
//       setPagination(d.pagination || {});
//     } catch (e) {
//       toast("Failed to load applications", "error");
//     }
//     setLoading(false);
//   }, [page, limit, fCompany, fJob, fStudent, fStatus, fSearch, toast]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // Search debounce
//   const onSearch = (v) => {
//     setFSearch(v);
//     clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => setPage(1), 400);
//   };

//   const onFilter = (setter, val) => {
//     setter(val);
//     setPage(1);
//   };

//   const clearAll = () => {
//     setFSearch("");
//     setFCompany("all");
//     setFJob("all");
//     setFStudent("all");
//     setFStatus("all");
//     setPage(1);
//   };

//   // Active filter tags
//   const getTags = () => {
//     const tags = [];
//     if (fSearch.trim())
//       tags.push({ label: `Search: "${fSearch.trim()}"`, fn: () => setFSearch("") });
//     if (fCompany !== "all")
//       tags.push({
//         label: `Company: ${filterOpts.companies.find((c) => c._id === fCompany)?.companyName || ""}`,
//         fn: () => setFCompany("all"),
//       });
//     if (fJob !== "all")
//       tags.push({
//         label: `Job: ${filterOpts.jobs.find((j) => j._id === fJob)?.title || ""}`,
//         fn: () => setFJob("all"),
//       });
//     if (fStudent !== "all")
//       tags.push({
//         label: `Student: ${filterOpts.students.find((s) => s._id === fStudent)?.name || ""}`,
//         fn: () => setFStudent("all"),
//       });
//     if (fStatus !== "all")
//       tags.push({ label: `Status: ${fStatus}`, fn: () => setFStatus("all") });
//     return tags;
//   };

//   // Status update
//   const updateStatus = async (newStatus) => {
//     try {
//       const r = await fetch(`${API}/admin/applications/${statusModal.id}/status`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
//         body: JSON.stringify({ status: newStatus }),
//       });
//       if (!r.ok) throw new Error();
//       toast(`Status updated to "${newStatus}"`, "success");
//       setStatusModal({ open: false, id: "", name: "", job: "", cur: "" });
//       fetchData();
//     } catch (e) {
//       toast("Failed to update status", "error");
//     }
//   };

//   // Delete
//   const deleteApp = async (id) => {
//     if (!confirm("Delete this application?")) return;
//     try {
//       const r = await fetch(`${API}/admin/applications/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${tok()}` },
//       });
//       if (!r.ok) throw new Error();
//       toast("Application deleted", "success");
//       fetchData();
//     } catch (e) {
//       toast("Failed to delete", "error");
//     }
//   };

//   // View detail
//   const viewDetail = async (id) => {
//     const local = apps.find((a) => a._id === id);
//     if (!local) return;
//     try {
//       const r = await fetch(`${API}/admin/applications/${id}`, {
//         headers: { Authorization: `Bearer ${tok()}` },
//       });
//       if (r.ok) {
//         const d = await r.json();
//         setDetailModal({ open: true, data: d.data });
//         return;
//       }
//     } catch (e) {}
//     setDetailModal({ open: true, data: local });
//   };

//   // Export CSV
//   const exportCSV = async () => {
//     toast("Exporting...", "info");
//     try {
//       const p = new URLSearchParams({
//         export: "true",
//         company: fCompany,
//         job: fJob,
//         student: fStudent,
//         status: fStatus,
//         search: fSearch.trim(),
//       });
//       const r = await fetch(`${API}/admin/applications?${p}`, {
//         headers: { Authorization: `Bearer ${tok()}` },
//       });
//       const d = await r.json();
//       const list = d.data || [];
//       if (!list.length) {
//         toast("No data to export", "error");
//         return;
//       }
//       const h = ["Student", "Email", "University", "GPA", "Job", "Department", "Location", "Type", "Company", "Company Location", "Status", "Applied Date"];
//       let csv = h.join(",") + "\n";
//       list.forEach((a) => {
//         csv +=
//           [
//             a.student?.name || a.name || "",
//             a.student?.email || a.email || "",
//             a.student?.university || a.university || "",
//             a.gpa || "",
//             a.jobId?.title || a.job || "",
//             a.jobId?.department || "",
//             a.jobId?.location || "",
//             a.jobId?.type || "",
//             a.company?.companyName || "",
//             a.company?.location || "",
//             a.status,
//             a.appliedDate ? new Date(a.appliedDate).toLocaleDateString() : "",
//           ]
//             .map((c) => '"' + String(c).replace(/"/g, '""') + '"')
//             .join(",") + "\n";
//       });
//       const blob = new Blob([csv], { type: "text/csv" });
//       const url = URL.createObjectURL(blob);
//       const el = document.createElement("a");
//       el.href = url;
//       el.download = `applications_${new Date().toISOString().split("T")[0]}.csv`;
//       el.click();
//       URL.revokeObjectURL(url);
//       toast(`Exported ${list.length} rows`, "success");
//     } catch (e) {
//       toast("Export failed", "error");
//     }
//   };

//   // Refresh
//   const refresh = () => {
//     setRefreshing(true);
//     fetchData();
//     setTimeout(() => setRefreshing(false), 600);
//   };

//   // Keyboard
//   useEffect(() => {
//     const handler = (e) => {
//       if (e.key === "Escape") {
//         setStatusModal({ open: false, id: "", name: "", job: "", cur: "" });
//         setDetailModal({ open: false, data: null });
//       }
//       if ((e.ctrlKey || e.metaKey) && e.key === "k") {
//         e.preventDefault();
//         document.getElementById("fSearch")?.focus();
//       }
//     };
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, []);

//   const tags = getTags();
//   const statuses = ["Under Review", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"];

//   // ─── Skeleton Rows ───
//   const SkeletonRows = () => (
//     <>
//       {Array.from({ length: 5 }).map((_, i) => (
//         <tr key={i} className="border-b border-white/[0.04]">
//           <td className="px-5 py-4">
//             <div className="flex items-center gap-3">
//               <div className="skel w-8 h-8 rounded-full shrink-0" />
//               <div className="skel w-28 h-4" />
//             </div>
//           </td>
//           <td className="px-5 py-4 hidden lg:table-cell">
//             <div className="skel w-24 h-4" />
//           </td>
//           <td className="px-5 py-4">
//             <div className="skel w-32 h-4" />
//           </td>
//           <td className="px-5 py-4 hidden md:table-cell">
//             <div className="skel w-24 h-4" />
//           </td>
//           <td className="px-5 py-4 hidden xl:table-cell">
//             <div className="skel w-20 h-4" />
//           </td>
//           <td className="px-5 py-4">
//             <div className="skel w-24 h-6 rounded-full" />
//           </td>
//           <td className="px-5 py-4">
//             <div className="skel w-16 h-8 rounded-lg ml-auto" />
//           </td>
//         </tr>
//       ))}
//     </>
//   );

//   // ─── Detail Modal Content ───
//   const DetailContent = () => {
//     const d = detailModal.data;
//     if (!d) return null;
//     const st = d.student || {};
//     const co = d.company || {};
//     const jo = d.jobId || {};
//     const resumeFile = d.resume || st.resume;
//     return (
//       <>
//         <div className="flex items-center gap-4 mb-6 pb-5 border-b border-white/[0.06]">
//           <div className={`w-14 h-14 rounded-2xl ${avatarColor(d.studentName || st.name || d.name)} flex items-center justify-center text-lg font-semibold text-white`}>
//             {initials(d.studentName || st.name || d.name)}
//           </div>
//           <div className="min-w-0 flex-1">
//             <h4 className="text-lg font-medium text-white">{esc(d.studentName || st.name || d.name)}</h4>
//             <p className="text-sm text-white/40">{esc(d.studentEmail || st.email || d.email)}</p>
//             <div className="flex items-center gap-2 mt-1">
//               <span className={`badge ${badgeCls(d.status)}`}>
//                 <span className="w-1.5 h-1.5 rounded-full bg-current" />
//                 {esc(d.status)}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-4">
//           <DetailCard icon={<GraduationCap className="w-4 h-4 text-orange-400/60" />} title="Education" cols={2} rows={[
//             ["University", esc(d.studentUniversity || st.university || d.university || "N/A")],
//             ["GPA", esc(d.gpa || st.gpa || "N/A")],
//           ]} />

//           <DetailCard icon={<User className="w-4 h-4 text-orange-400/60" />} title="Contact" cols={2} rows={[
//             ["Phone", esc(d.studentPhone || st.phone || "N/A")],
//             ["Skills", esc(d.studentSkills || st.skills || "N/A")],
//           ]} />

//           <DetailCard icon={<Briefcase className="w-4 h-4 text-orange-400/60" />} title="Job Applied" cols={1} rows={[
//             ["Title", <span className="text-sm text-white/80 font-medium">{esc(d.jobTitle || jo.title || d.job || "N/A")}</span>],
//           ]}>
//             <div className="grid grid-cols-3 gap-3 mt-2">
//               {[["Department", d.jobDepartment || jo.department], ["Location", d.jobLocation || jo.location], ["Type", d.jobType || jo.type]].map(([l, v]) => (
//                 <div key={l}>
//                   <p className="text-[10px] text-white/20 mb-0.5">{l}</p>
//                   <p className="text-xs text-white/60">{esc(v || "N/A")}</p>
//                 </div>
//               ))}
//             </div>
//           </DetailCard>

//           <DetailCard icon={<Building2 className="w-4 h-4 text-orange-400/60" />} title="Company" cols={2} rows={[
//             ["Name", esc(d.companyName || co.companyName || "N/A")],
//             ["Location", esc(d.companyLocation || co.location || "N/A")],
//           ]} />

//           <DetailCard icon={<Calendar className="w-4 h-4 text-orange-400/60" />} title="Timeline" cols={1} rows={[
//             ["Applied on", d.appliedDate ? new Date(d.appliedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "N/A"],
//           ]} />

//           {resumeFile && (
//             <DetailCard icon={<FileText className="w-4 h-4 text-orange-400/60" />} title="Resume" cols={0} rows={[]}>
//               <a
//                 href={`${API.replace("/api", "")}/uploads/resumes/${resumeFile}`}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-sm text-orange-400 hover:bg-orange-500/20 transition-colors"
//               >
//                 <Download className="w-4 h-4" /> View Resume
//               </a>
//             </DetailCard>
//           )}

//           {st.bio && (
//             <DetailCard icon={<AlignLeft className="w-4 h-4 text-orange-400/60" />} title="Bio" cols={0} rows={[]}>
//               <p className="text-sm text-white/50 leading-relaxed">{esc(st.bio)}</p>
//             </DetailCard>
//           )}
//         </div>

//         <div className="flex gap-3 mt-6 pt-5 border-t border-white/[0.06]">
//           <button
//             onClick={() => {
//               setDetailModal({ open: false, data: null });
//               setStatusModal({ open: true, id: d._id, name: d.studentName || d.name, job: d.jobTitle || d.job, cur: d.status });
//             }}
//             className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
//           >
//             <ArrowRightLeft className="w-4 h-4" /> Change Status
//           </button>
//           <button
//             onClick={() => setDetailModal({ open: false, data: null })}
//             className="px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-white/60 hover:text-white hover:bg-white/[0.1] transition-all"
//           >
//             Close
//           </button>
//         </div>
//       </>
//     );
//   };

//   return (
//     <>
//       {/* Global Styles (inject once) */}
//       <style>{`
//         @keyframes fadeUp{from{opacity:0;transform:translateY(10px);filter:blur(4px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}
//         @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
//         @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
//         .anim{opacity:0;animation:fadeUp .8s cubic-bezier(.16,1,.3,1) forwards}
//         .d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.3s}.d4{animation-delay:.4s}
//         .skel{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:6px}
//         .badge{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:9999px;font-size:11px;font-weight:500;letter-spacing:.02em;white-space:nowrap}
//         .b-review{background:rgba(59,130,246,.15);color:#93C5FD;border:1px solid rgba(59,130,246,.2)}
//         .b-short{background:rgba(168,85,247,.15);color:#C4B5FD;border:1px solid rgba(168,85,247,.2)}
//         .b-interview{background:rgba(249,115,22,.15);color:#FDBA74;border:1px solid rgba(249,115,22,.2)}
//         .b-selected{background:rgba(34,197,94,.15);color:#86EFAC;border:1px solid rgba(34,197,94,.2)}
//         .b-rejected{background:rgba(239,68,68,.15);color:#FCA5A5;border:1px solid rgba(239,68,68,.2)}
//         .trow{transition:background .2s}.trow:hover{background:rgba(255,255,255,.03)}
//         select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:36px}
//       `}</style>

//       <ToastContainer toasts={toasts} />

//       {/* ─── Status Modal ─── */}
//       {statusModal.open && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setStatusModal({ open: false, id: "", name: "", job: "", cur: "" })}>
//           <div className="glass rounded-2xl p-6 w-full max-w-md mx-4 transform scale-100" onClick={(e) => e.stopPropagation()}>
//             <div className="flex items-center justify-between mb-5">
//               <h3 className="text-base font-medium text-white">Update Status</h3>
//               <button onClick={() => setStatusModal({ open: false, id: "", name: "", job: "", cur: "" })} className="text-white/40 hover:text-white transition-colors">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <p className="text-sm text-white/50 mb-1">{statusModal.name}</p>
//             <p className="text-xs text-white/30 mb-5">{statusModal.job}</p>
//             <div className="space-y-2">
//               {statuses.map((s) => (
//                 <button key={s} onClick={() => updateStatus(s)} className={`sopt ${s === statusModal.cur ? "bg-white/[0.06]" : ""}`}>
//                   <span className={`badge ${badgeCls(s)}`} style={{ pointerEvents: "none" }}>
//                     <span className="w-1.5 h-1.5 rounded-full bg-current" />
//                     {s}
//                   </span>
//                   {s === statusModal.cur && <CheckCircle className="w-3.5 h-3.5 text-orange-400 ml-auto" />}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ─── Detail Modal ─── */}
//       {detailModal.open && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setDetailModal({ open: false, data: null })}>
//           <div className="glass rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto transform scale-100" onClick={(e) => e.stopPropagation()}>
//             <div className="flex items-center justify-between mb-5">
//               <h3 className="text-base font-medium text-white">Application Details</h3>
//               <button onClick={() => setDetailModal({ open: false, data: null })} className="text-white/40 hover:text-white transition-colors">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <DetailContent />
//           </div>
//         </div>
//       )}

//       {/* ─── Main Content ─── */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="anim mb-8">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 flex items-center justify-center">
//                   <Inbox className="w-5 h-5 text-orange-400" />
//                 </div>
//                 <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">Monitor Applications</h1>
//               </div>
//               <p className="text-sm text-white/40 ml-[52px]">Track which student applied to which job — filter, inspect, update.</p>
//             </div>
//             <div className="flex items-center gap-3 ml-[52px] sm:ml-0">
//               <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.1] transition-all" style={{ boxShadow: "0 0 20px -5px rgba(255,255,255,0.15)" }}>
//                 <Download className="w-4 h-4" />
//                 <span className="hidden sm:inline">Export CSV</span>
//               </button>
//               <button onClick={refresh} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.1] transition-all">
//                 <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${refreshing ? "rotate-360" : ""}`} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
//           {[
//             { l: "Total", v: stats.totalApplications, I: Layers, cl: "text-white", sub: `${stats.thisWeek || 0} this week · ${stats.today || 0} today` },
//             { l: "Under Review", v: stats.underReview, I: Clock, cl: "text-blue-400" },
//             { l: "Shortlisted", v: stats.shortlisted, I: Star, cl: "text-purple-400" },
//             { l: "Interview", v: stats.interviewScheduled, I: Video, cl: "text-orange-400" },
//             { l: "Selected", v: stats.selected, I: CheckCircle, cl: "text-green-400" },
//             { l: "Rejected", v: stats.rejected, I: XCircle, cl: "text-red-400" },
//           ].map((x, i) => (
//             <div key={x.l} className="stat-card glass rounded-xl p-4 anim" style={{ animationDelay: `${(i + 1) * 0.1}s` }}>
//               <div className="flex items-center gap-2 mb-2">
//                 <x.I className={`w-3.5 h-3.5 ${x.cl} opacity-50`} />
//                 <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">{x.l}</span>
//               </div>
//               <p className={`text-2xl font-semibold ${x.cl}`}>{x.v ?? 0}</p>
//               {x.sub && <p className="text-[10px] text-white/20 mt-1">{x.sub}</p>}
//             </div>
//           ))}
//         </div>

//         {/* Filters */}
//         <div className="anim d2 glass rounded-2xl p-5 mb-6">
//           <div className="flex items-center gap-2 mb-4">
//             <Filter className="w-4 h-4 text-white/40" />
//             <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Filters</span>
//             {tags.length > 0 && (
//               <button onClick={clearAll} className="ml-auto text-xs text-white/30 hover:text-orange-400 transition-colors flex items-center gap-1">
//                 <XCircle className="w-3 h-3" /> Clear all
//               </button>
//             )}
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
//             <div className="relative">
//               <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
//               <input id="fSearch" type="text" value={fSearch} onChange={(e) => onSearch(e.target.value)} placeholder="Search name, email, job..." className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-orange-500/40 transition-colors" />
//             </div>
//             <select value={fCompany} onChange={(e) => onFilter(setFCompany, e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/70 focus:outline-none focus:border-orange-500/40 transition-colors cursor-pointer">
//               <option value="all">All Companies</option>
//               {filterOpts.companies.map((c) => (
//                 <option key={c._id} value={c._id}>{esc(c.companyName)}</option>
//               ))}
//             </select>
//             <select value={fJob} onChange={(e) => onFilter(setFJob, e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/70 focus:outline-none focus:border-orange-500/40 transition-colors cursor-pointer">
//               <option value="all">All Jobs</option>
//               {filterOpts.jobs.map((j) => (
//                 <option key={j._id} value={j._id}>{esc(j.title)}</option>
//               ))}
//             </select>
//             <select value={fStudent} onChange={(e) => onFilter(setFStudent, e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/70 focus:outline-none focus:border-orange-500/40 transition-colors cursor-pointer">
//               <option value="all">All Students</option>
//               {filterOpts.students.map((s) => (
//                 <option key={s._id} value={s._id}>{esc(s.name)} ({esc(s.email)})</option>
//               ))}
//             </select>
//             <select value={fStatus} onChange={(e) => onFilter(setFStatus, e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/70 focus:outline-none focus:border-orange-500/40 transition-colors cursor-pointer">
//               <option value="all">All Statuses</option>
//               {statuses.map((s) => (
//                 <option key={s} value={s}>{s}</option>
//               ))}
//             </select>
//           </div>
//           {tags.length > 0 && (
//             <div className="flex flex-wrap gap-2 mt-3">
//               {tags.map((t, i) => (
//                 <button key={i} onClick={t.fn} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[11px] text-orange-300 hover:bg-orange-500/20 transition-colors">
//                   {esc(t.label)} <X className="w-3 h-3" />
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Count + Limit */}
//         <div className="anim d3 flex items-center justify-between mb-4 px-1">
//           <p className="text-xs text-white/30">{pagination.totalApplications} application{pagination.totalApplications !== 1 ? "s" : ""} found</p>
//           <div className="flex items-center gap-2">
//             <span className="text-xs text-white/25">Per page:</span>
//             <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-2 py-1 text-xs text-white/60 focus:outline-none cursor-pointer">
//               {[10, 25, 50, 100].map((n) => (
//                 <option key={n} value={n}>{n}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="anim d4 glass rounded-2xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead>
//                 <tr className="border-b border-white/[0.06]">
//                   <th className="px-5 py-3.5 text-[11px] font-medium text-white/30 uppercase tracking-wider">Student</th>
//                   <th className="px-5 py-3.5 text-[11px] font-medium text-white/30 uppercase tracking-wider hidden lg:table-cell">University</th>
//                   <th className="px-5 py-3.5 text-[11px] font-medium text-white/30 uppercase tracking-wider">Job</th>
//                   <th className="px-5 py-3.5 text-[11px] font-medium text-white/30 uppercase tracking-wider hidden md:table-cell">Company</th>
//                   <th className="px-5 py-3.5 text-[11px] font-medium text-white/30 uppercase tracking-wider hidden xl:table-cell">Applied</th>
//                   <th className="px-5 py-3.5 text-[11px] font-medium text-white/30 uppercase tracking-wider">Status</th>
//                   <th className="px-5 py-3.5 text-[11px] font-medium text-white/30 uppercase tracking-wider text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <SkeletonRows />
//                 ) : !apps.length ? (
//                   <tr>
//                     <td colSpan={7}>
//                       <div className="py-20 text-center">
//                         <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
//                           <Inbox className="w-7 h-7 text-white/15" />
//                         </div>
//                         <p className="text-sm text-white/30 mb-1">No applications found</p>
//                         <p className="text-xs text-white/20">Try adjusting your filters</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   apps.map((a) => (
//                     <tr key={a._id} className="trow border-b border-white/[0.04] cursor-pointer" onClick={() => viewDetail(a._id)}>
//                       <td className="px-5 py-3.5">
//                         <div className="flex items-center gap-3">
//                           <div className={`w-8 h-8 rounded-full ${avatarColor(a.studentName)} flex items-center justify-center text-[11px] font-semibold text-white shrink-0`}>
//                             {initials(a.studentName)}
//                           </div>
//                           <div className="min-w-0">
//                             <p className="text-sm font-medium text-white truncate max-w-[180px]">{esc(a.studentName)}</p>
//                             <p className="text-[11px] text-white/30 truncate max-w-[180px]">{esc(a.studentEmail)}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-5 py-3.5 hidden lg:table-cell">
//                         <p className="text-xs text-white/50 truncate max-w-[150px]">{esc(a.studentUniversity)}</p>
//                       </td>
//                       <td className="px-5 py-3.5">
//                         <p className="text-sm text-white/80 truncate max-w-[180px]">{esc(a.jobTitle)}</p>
//                         <p className="text-[11px] text-white/25">{esc(a.jobType)} · {esc(a.jobLocation)}</p>
//                       </td>
//                       <td className="px-5 py-3.5 hidden md:table-cell">
//                         <p className="text-xs text-white/50 truncate max-w-[150px]">{esc(a.companyName)}</p>
//                       </td>
//                       <td className="px-5 py-3.5 hidden xl:table-cell">
//                         <p className="text-xs text-white/30">{fdate(a.appliedDate)}</p>
//                       </td>
//                       <td className="px-5 py-3.5">
//                         <span className={`badge ${badgeCls(a.status)}`} onClick={(e) => e.stopPropagation()}>
//                           <span className="w-1.5 h-1.5 rounded-full bg-current" />
//                           {esc(a.status)}
//                         </span>
//                       </td>
//                       <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
//                         <div className="flex items-center justify-end gap-1">
//                           <button onClick={() => setStatusModal({ open: true, id: a._id, name: a.studentName, job: a.jobTitle, cur: a.status })} className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/70 transition-all" title="Change status">
//                             <ArrowRightLeft className="w-3.5 h-3.5" />
//                           </button>
//                           <button onClick={() => viewDetail(a._id)} className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/70 transition-all" title="View">
//                             <Eye className="w-3.5 h-3.5" />
//                           </button>
//                           <button onClick={() => deleteApp(a._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all" title="Delete">
//                             <Trash2 className="w-3.5 h-3.5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {pagination.totalPages > 0 && (
//             <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06]">
//               <p className="text-xs text-white/25">
//                 {pagination.totalPages <= 1
//                   ? `Showing ${apps.length} of ${pagination.totalApplications}`
//                   : `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, pagination.totalApplications)} of ${pagination.totalApplications}`}
//               </p>
//               <div className="flex items-center gap-1">
//                 <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] disabled:opacity-20 disabled:cursor-not-allowed transition-all">
//                   <ChevronLeft className="w-4 h-4" />
//                 </button>
//                 {pageNums(page, pagination.totalPages).map((p, i) =>
//                   p === "..." ? (
//                     <span key={`d${i}`} className="px-2 text-white/20 text-xs">...</span>
//                   ) : (
//                     <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${p === page ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"}`}>
//                       {p}
//                     </button>
//                   )
//                 )}
//                 <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page >= pagination.totalPages} className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] disabled:opacity-20 disabled:cursor-not-allowed transition-all">
//                   <ChevronRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="h-16" />
//       </div>

//       {/* ─── Reusable Detail Card ─── */}
//       {/* (Defined here so it's inside the parent scope for detailModal data) */}
//     </>
//   );
// }

// // ─── DetailCard Sub-Component ──────────────────────────────
// function DetailCard({ icon, title, cols, rows, children }) {
//   return (
//     <div className="glass rounded-xl p-4">
//       <div className="flex items-center gap-2 mb-3">
//         {icon}
//         <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider">{title}</span>
//       </div>
//       {cols > 0 && (
//         <div className={`grid gap-3 ${cols === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
//           {rows.map(([label, value], i) => (
//             <div key={i}>
//               <p className="text-[10px] text-white/20 mb-0.5">{label}</p>
//               {typeof value === "string" ? <p className="text-sm text-white/70">{value}</p> : value}
//             </div>
//           ))}
//         </div>
//       )}
//       {children}
//     </div>
//   );
// }


import { useState, useEffect, useCallback, useRef } from "react";
import {
  Inbox,
  Filter,
  XCircle,
  Search,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
  Eye,
  Trash2,
  GraduationCap,
  User,
  Briefcase,
  Building2,
  Calendar,
  FileText,
  AlignLeft,
  CheckCircle,
  AlertCircle,
  Info,
  Layers,
  Clock,
  Star,
  Video,
  X,
  ChevronDown,
  TrendingUp,
  Users,
  BarChart3,
  CheckSquare,
  Square,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

const API = "http://localhost:5000/api";

// ─── Helper Functions ─────────────────────────────────────
function getToken() {
  return localStorage.getItem("adminToken") || localStorage.getItem("token");
}

function escapeHtml(s) {
  if (!s) return "";
  const d = document.createElement("div");
  d.textContent = String(s);
  return d.innerHTML;
}

function getBadgeClass(status) {
  const map = {
    "Under Review": "badge-review",
    Shortlisted: "badge-shortlisted",
    "Interview Scheduled": "badge-interview",
    Selected: "badge-selected",
    Rejected: "badge-rejected",
    Withdrawn: "badge-withdrawn",
  };
  return map[status] || "badge-review";
}

function getStatusIcon(status) {
  const map = {
    "Under Review": <Clock className="w-3 h-3" />,
    Shortlisted: <Star className="w-3 h-3" />,
    "Interview Scheduled": <Video className="w-3 h-3" />,
    Selected: <CheckCircle className="w-3 h-3" />,
    Rejected: <XCircle className="w-3 h-3" />,
    Withdrawn: <AlertCircle className="w-3 h-3" />,
  };
  return map[status] || <Clock className="w-3 h-3" />;
}

function getInitials(name) {
  if (!name || name === "Unknown" || name === "N/A") return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function getAvatarColor(name) {
  if (!name || name === "Unknown" || name === "N/A") return "bg-gray-500/20";
  const colors = [
    "bg-blue-500/20 text-blue-300",
    "bg-purple-500/20 text-purple-300",
    "bg-orange-500/20 text-orange-300",
    "bg-green-500/20 text-green-300",
    "bg-pink-500/20 text-pink-300",
    "bg-cyan-500/20 text-cyan-300",
    "bg-yellow-500/20 text-yellow-300",
    "bg-red-500/20 text-red-300",
    "bg-indigo-500/20 text-indigo-300",
    "bg-teal-500/20 text-teal-300",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function formatDate(date) {
  if (!date) return "—";
  const now = new Date();
  const diff = now - new Date(date);
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatFullDate(date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, "...", total];
  if (current >= total - 2) return [1, "...", total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

// ─── Toast System ─────────────────────────────────────────
let toastIdCounter = 0;

function ToastContainer({ toasts }) {
  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => {
        const config = {
          success: { bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.3)", text: "#86EFAC", Icon: CheckCircle },
          error: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.3)", text: "#FCA5A5", Icon: AlertCircle },
          info: { bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.3)", text: "#93C5FD", Icon: Info },
          warning: { bg: "rgba(249,115,22,0.15)", border: "rgba(249,115,22,0.3)", text: "#FDBA74", Icon: AlertCircle },
        }[t.type] || { bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.3)", text: "#93C5FD", Icon: Info };

        const Icon = config.Icon;
        return (
          <div
            key={t.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-xl min-w-[300px] pointer-events-auto"
            style={{
              background: config.bg,
              border: `1px solid ${config.border}`,
              animation: "toastSlideIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
            }}
          >
            <Icon className="w-4 h-4 shrink-0" style={{ color: config.text }} />
            <p className="text-sm font-medium" style={{ color: config.text }}>
              {t.msg}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Sub Components ───────────────────────────────────────

// Detail Card
function DetailSection({ icon, title, children }) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-orange-400/60">{icon}</span>
        <span className="text-[11px] font-semibold text-white/30 uppercase tracking-wider">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

// Stat Card
function StatCard({ icon: Icon, label, value, sub, color, delay }) {
  return (
    <div
      className="stat-card rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 hover:bg-white/[0.05] transition-all duration-300"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-3.5 h-3.5 ${color} opacity-60`} />
        <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value ?? 0}</p>
      {sub && <p className="text-[10px] text-white/20 mt-1">{sub}</p>}
    </div>
  );
}

// Empty State
function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="py-20 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
        <Icon className="w-7 h-7 text-white/15" />
      </div>
      <p className="text-sm text-white/30 mb-1">{title}</p>
      <p className="text-xs text-white/20">{subtitle}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────
export default function MonitorApplications() {
  // State
  const [apps, setApps] = useState([]);
  const [stats, setStats] = useState({});
  const [filterOpts, setFilterOpts] = useState({ companies: [], jobs: [], students: [] });
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 0, totalApplications: 0, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [fSearch, setFSearch] = useState("");
  const [fCompany, setFCompany] = useState("all");
  const [fJob, setFJob] = useState("all");
  const [fStudent, setFStudent] = useState("all");
  const [fStatus, setFStatus] = useState("all");
  const [sortBy, setSortBy] = useState("appliedDate");
  const [sortOrder, setSortOrder] = useState("desc");

  // Modals
  const [statusModal, setStatusModal] = useState({ open: false, id: "", name: "", job: "", cur: "" });
  const [detailModal, setDetailModal] = useState({ open: false, data: null, otherApps: [] });
  const [bulkModal, setBulkModal] = useState({ open: false, status: "" });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: "", name: "" });
  const [refreshing, setRefreshing] = useState(false);

  // Refs
  const searchTimer = useRef(null);

  // Toast helper
  const showToast = useCallback((msg, type = "info") => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    const token = getToken();
    if (!token) {
      showToast("Not authenticated. Please login.", "error");
      setLoading(false);
      return;
    }

    const params = new URLSearchParams({
      page,
      limit,
      company: fCompany,
      job: fJob,
      student: fStudent,
      status: fStatus,
      search: fSearch.trim(),
      sortBy,
      sortOrder,
    });

    try {
      const res = await fetch(`${API}/admin/applications?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setApps(data.data || []);
      setStats(data.stats || {});
      setFilterOpts(data.filters || { companies: [], jobs: [], students: [] });
      setPagination(data.pagination || { currentPage: 1, totalPages: 0, totalApplications: 0, limit: 10 });
      setSelectedIds([]);
      setSelectAll(false);
    } catch (err) {
      showToast("Failed to load applications", "error");
      console.error(err);
    }
    setLoading(false);
  }, [page, limit, fCompany, fJob, fStudent, fStatus, fSearch, sortBy, sortOrder, showToast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Search with debounce
  const handleSearch = (value) => {
    setFSearch(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setPage(1), 400);
  };

  // Filter change handler
  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(1);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFSearch("");
    setFCompany("all");
    setFJob("all");
    setFStudent("all");
    setFStatus("all");
    setPage(1);
  };

  // Get active filter tags
  const getActiveFilterTags = () => {
    const tags = [];
    if (fSearch.trim()) tags.push({ label: `Search: "${fSearch.trim()}"`, clear: () => setFSearch("") });
    if (fCompany !== "all") {
      const comp = filterOpts.companies.find((c) => c._id === fCompany);
      tags.push({ label: `Company: ${comp?.companyName || ""}`, clear: () => setFCompany("all") });
    }
    if (fJob !== "all") {
      const job = filterOpts.jobs.find((j) => j._id === fJob);
      tags.push({ label: `Job: ${job?.title || ""}`, clear: () => setFJob("all") });
    }
    if (fStudent !== "all") {
      const stu = filterOpts.students.find((s) => s._id === fStudent);
      tags.push({ label: `Student: ${stu?.name || ""}`, clear: () => setFStudent("all") });
    }
    if (fStatus !== "all") tags.push({ label: `Status: ${fStatus}`, clear: () => setFStatus("all") });
    return tags;
  };

  // Selection handlers
  const toggleSelect = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(apps.map((a) => a._id));
    }
    setSelectAll(!selectAll);
  };

  // Update status
  const updateStatus = async (newStatus) => {
    try {
      const res = await fetch(`${API}/admin/applications/${statusModal.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      showToast(`Status updated to "${newStatus}"`, "success");
      setStatusModal({ open: false, id: "", name: "", job: "", cur: "" });
      fetchApplications();
    } catch (err) {
      showToast("Failed to update status", "error");
    }
  };

  // Bulk status update
  const bulkUpdateStatus = async (status) => {
    if (selectedIds.length === 0) {
      showToast("No applications selected", "warning");
      return;
    }
    try {
      const res = await fetch(`${API}/admin/applications/bulk/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ ids: selectedIds, status }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      showToast(data.message, "success");
      setBulkModal({ open: false, status: "" });
      fetchApplications();
    } catch (err) {
      showToast("Bulk update failed", "error");
    }
  };

  // Delete application
  const deleteApplication = async () => {
    try {
      const res = await fetch(`${API}/admin/applications/${deleteModal.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      showToast("Application deleted", "success");
      setDeleteModal({ open: false, id: "", name: "" });
      fetchApplications();
    } catch (err) {
      showToast("Failed to delete application", "error");
    }
  };

  // Bulk delete
  const bulkDelete = async () => {
    if (selectedIds.length === 0) {
      showToast("No applications selected", "warning");
      return;
    }
    if (!window.confirm(`Delete ${selectedIds.length} applications?`)) return;
    try {
      const res = await fetch(`${API}/admin/applications/bulk/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      showToast(data.message, "success");
      fetchApplications();
    } catch (err) {
      showToast("Bulk delete failed", "error");
    }
  };

  // View detail
  const viewDetail = async (id) => {
    const localApp = apps.find((a) => a._id === id);
    if (!localApp) return;
    try {
      const res = await fetch(`${API}/admin/applications/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDetailModal({ open: true, data: data.data, otherApps: data.studentOtherApplications || [] });
        return;
      }
    } catch (err) {
      console.error(err);
    }
    setDetailModal({ open: true, data: localApp, otherApps: [] });
  };

  // Export CSV
  const exportCSV = async () => {
    showToast("Exporting data...", "info");
    try {
      const params = new URLSearchParams({
        export: "true",
        company: fCompany,
        job: fJob,
        student: fStudent,
        status: fStatus,
        search: fSearch.trim(),
      });

      const res = await fetch(`${API}/admin/applications?${params}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      const list = data.data || [];

      if (!list.length) {
        showToast("No data to export", "warning");
        return;
      }

      const headers = [
        "Student Name",
        "Student Email",
        "University",
        "Phone",
        "Skills",
        "GPA",
        "Job Title",
        "Department",
        "Job Location",
        "Job Type",
        "Salary",
        "Company",
        "Company Location",
        "Status",
        "Applied Date",
        "Resume",
      ];

      let csv = headers.join(",") + "\n";
      list.forEach((a) => {
        const row = [
          a.student?.name || a.studentName || "",
          a.student?.email || a.studentEmail || "",
          a.student?.university || a.studentUniversity || "",
          a.student?.phone || a.studentPhone || "",
          Array.isArray(a.student?.skills) ? a.student.skills.join("; ") : (a.studentSkills || ""),
          a.student?.gpa || a.gpa || "",
          a.jobId?.title || a.jobTitle || "",
          a.jobId?.department || a.jobDepartment || "",
          a.jobId?.location || a.jobLocation || "",
          a.jobId?.type || a.jobType || "",
          a.jobId?.salary || a.jobSalary || "",
          a.company?.companyName || a.companyName || "",
          a.company?.location || a.companyLocation || "",
          a.status,
          a.appliedDate ? new Date(a.appliedDate).toLocaleDateString() : "",
          a.resume || "",
        ];
        csv += row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",") + "\n";
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `applications_export_${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      showToast(`Exported ${list.length} applications`, "success");
    } catch (err) {
      showToast("Export failed", "error");
    }
  };

  // Refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchApplications();
    setTimeout(() => setRefreshing(false), 600);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        setStatusModal({ open: false, id: "", name: "", job: "", cur: "" });
        setDetailModal({ open: false, data: null, otherApps: [] });
        setBulkModal({ open: false, status: "" });
        setDeleteModal({ open: false, id: "", name: "" });
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("searchInput")?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const tags = getActiveFilterTags();
  const statuses = ["Under Review", "Shortlisted", "Interview Scheduled", "Selected", "Rejected", "Withdrawn"];

  // ─── Render ───────────────────────────────────────────────
  return (
    <>
      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        * { font-family: 'Inter', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes toastSlideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .anim { opacity: 0; animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.1s; }
        .d3 { animation-delay: 0.15s; }
        .d4 { animation-delay: 0.2s; }
        .d5 { animation-delay: 0.25s; }

        .stat-card { transition: all 0.3s ease; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px -10px rgba(0,0,0,0.3); }

        .skel {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 6px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .badge-review { background: rgba(59,130,246,0.12); color: #93C5FD; border: 1px solid rgba(59,130,246,0.2); }
        .badge-shortlisted { background: rgba(168,85,247,0.12); color: #C4B5FD; border: 1px solid rgba(168,85,247,0.2); }
        .badge-interview { background: rgba(249,115,22,0.12); color: #FDBA74; border: 1px solid rgba(249,115,22,0.2); }
        .badge-selected { background: rgba(34,197,94,0.12); color: #86EFAC; border: 1px solid rgba(34,197,94,0.2); }
        .badge-rejected { background: rgba(239,68,68,0.12); color: #FCA5A5; border: 1px solid rgba(239,68,68,0.2); }
        .badge-withdrawn { background: rgba(107,114,128,0.12); color: #D1D5DB; border: 1px solid rgba(107,114,128,0.2); }

        .table-row { transition: background 0.15s ease; }
        .table-row:hover { background: rgba(255,255,255,0.03); }
        .table-row.selected { background: rgba(249,115,22,0.06); }

        select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 36px;
        }

        .modal-overlay {
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-content {
          animation: modalSlide 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes modalSlide {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .spinning { animation: spin 0.8s linear infinite; }

        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

        option { background: #1a1a2e; color: #fff; }
      `}</style>

      <ToastContainer toasts={toasts} />

      {/* ═══════════ STATUS CHANGE MODAL ═══════════ */}
      {statusModal.open && (
        <div className="modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setStatusModal({ open: false, id: "", name: "", job: "", cur: "" })}>
          <div className="modal-content rounded-2xl bg-[#1a1a2e] border border-white/[0.08] p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-white">Update Application Status</h3>
              <button onClick={() => setStatusModal({ open: false, id: "", name: "", job: "", cur: "" })} className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.08] transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-sm font-medium text-white">{escapeHtml(statusModal.name)}</p>
              <p className="text-xs text-white/40 mt-0.5">{escapeHtml(statusModal.job)}</p>
            </div>

            <div className="space-y-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                    s === statusModal.cur
                      ? "bg-white/[0.06] border-white/[0.1]"
                      : "bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.08]"
                  }`}
                >
                  <span className={`badge ${getBadgeClass(s)}`} style={{ pointerEvents: "none" }}>
                    {getStatusIcon(s)}
                    {s}
                  </span>
                  {s === statusModal.cur && <CheckCircle className="w-4 h-4 text-orange-400 ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ DETAIL MODAL ═══════════ */}
      {detailModal.open && detailModal.data && (
        <div className="modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setDetailModal({ open: false, data: null, otherApps: [] })}>
          <div className="modal-content rounded-2xl bg-[#1a1a2e] border border-white/[0.08] w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
              <h3 className="text-base font-semibold text-white">Application Details</h3>
              <button onClick={() => setDetailModal({ open: false, data: null, otherApps: [] })} className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.08] transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6 scrollbar-thin">
              <DetailContent data={detailModal.data} otherApps={detailModal.otherApps} />
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-white/[0.06] shrink-0">
              <button
                onClick={() => {
                  const d = detailModal.data;
                  setDetailModal({ open: false, data: null, otherApps: [] });
                  setStatusModal({ open: true, id: d._id, name: d.studentName || d.student?.name, job: d.jobTitle || d.jobId?.title, cur: d.status });
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                <ArrowRightLeft className="w-4 h-4" /> Change Status
              </button>
              <button onClick={() => setDetailModal({ open: false, data: null, otherApps: [] })} className="px-6 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-white/60 hover:text-white hover:bg-white/[0.1] transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ BULK ACTION MODAL ═══════════ */}
      {bulkModal.open && (
        <div className="modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setBulkModal({ open: false, status: "" })}>
          <div className="modal-content rounded-2xl bg-[#1a1a2e] border border-white/[0.08] p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">Bulk Update Status</h3>
              <button onClick={() => setBulkModal({ open: false, status: "" })} className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.08] transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-white/50 mb-4">Update {selectedIds.length} selected application(s) to:</p>
            <div className="space-y-2">
              {statuses.map((s) => (
                <button key={s} onClick={() => bulkUpdateStatus(s)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.05] transition-all`}>
                  <span className={`badge ${getBadgeClass(s)}`} style={{ pointerEvents: "none" }}>
                    {getStatusIcon(s)}
                    {s}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ DELETE CONFIRM MODAL ═══════════ */}
      {deleteModal.open && (
        <div className="modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setDeleteModal({ open: false, id: "", name: "" })}>
          <div className="modal-content rounded-2xl bg-[#1a1a2e] border border-white/[0.08] p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-base font-semibold text-white text-center mb-2">Delete Application?</h3>
            <p className="text-sm text-white/40 text-center mb-6">
              This will permanently delete the application from <span className="text-white/60">{escapeHtml(deleteModal.name)}</span>.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal({ open: false, id: "", name: "" })} className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-white/60 hover:text-white hover:bg-white/[0.1] transition-all">
                Cancel
              </button>
              <button onClick={deleteApplication} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <div className="min-h-screen bg-[#0d0d1a]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="anim mb-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 flex items-center justify-center">
                    <Inbox className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Monitor Applications</h1>
                    <p className="text-sm text-white/40 mt-0.5">Track which student applied to which job</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-14 sm:ml-0">
                {selectedIds.length > 0 && (
                  <>
                    <button onClick={() => setBulkModal({ open: true, status: "" })} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-sm font-medium text-orange-400 hover:bg-orange-500/20 transition-all">
                      <ArrowRightLeft className="w-4 h-4" /> Update ({selectedIds.length})
                    </button>
                    <button onClick={bulkDelete} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </>
                )}
                <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.1] transition-all">
                  <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export CSV</span>
                </button>
                <button onClick={handleRefresh} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.1] transition-all">
                  <RefreshCw className={`w-4 h-4 ${refreshing ? "spinning" : ""}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            <StatCard icon={Layers} label="Total" value={stats.totalApplications} sub={`${stats.thisWeek || 0} this week · ${stats.today || 0} today`} color="text-white" delay={0.05} />
            <StatCard icon={Clock} label="Under Review" value={stats.underReview} color="text-blue-400" delay={0.1} />
            <StatCard icon={Star} label="Shortlisted" value={stats.shortlisted} color="text-purple-400" delay={0.15} />
            <StatCard icon={Video} label="Interview" value={stats.interviewScheduled} color="text-orange-400" delay={0.2} />
            <StatCard icon={CheckCircle} label="Selected" value={stats.selected} color="text-green-400" delay={0.25} />
            <StatCard icon={XCircle} label="Rejected" value={stats.rejected} color="text-red-400" delay={0.3} />
          </div>

          {/* Tracking Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <div className="anim d2 rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-blue-400/60" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">Companies</p>
                <p className="text-lg font-bold text-white">{stats.uniqueCompanies || 0}</p>
                <p className="text-[10px] text-white/20">with applications</p>
              </div>
            </div>
            <div className="anim d3 rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/15 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-purple-400/60" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">Job Postings</p>
                <p className="text-lg font-bold text-white">{stats.uniqueJobs || 0}</p>
                <p className="text-[10px] text-white/20">received applications</p>
              </div>
            </div>
            <div className="anim d4 rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/15 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-green-400/60" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">Students</p>
                <p className="text-lg font-bold text-white">{stats.uniqueStudents || 0}</p>
                <p className="text-[10px] text-white/20">applied for jobs</p>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="anim d3 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-white/40" />
              <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Filters</span>
              {tags.length > 0 && (
                <button onClick={clearAllFilters} className="ml-auto flex items-center gap-1 text-[11px] text-white/30 hover:text-orange-400 transition-colors">
                  <XCircle className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="searchInput"
                  type="text"
                  value={fSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search student, job, company... (Ctrl+K)"
                  className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all"
                />
              </div>

              {/* Company Filter */}
              <select
                value={fCompany}
                onChange={(e) => handleFilterChange(setFCompany, e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/60 focus:outline-none focus:border-orange-500/40 transition-all cursor-pointer"
              >
                <option value="all">All Companies</option>
                {filterOpts.companies.map((c) => (
                  <option key={c._id} value={c._id}>{escapeHtml(c.companyName)}{c.location ? ` — ${c.location}` : ""}</option>
                ))}
              </select>

              {/* Job Filter */}
              <select
                value={fJob}
                onChange={(e) => handleFilterChange(setFJob, e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/60 focus:outline-none focus:border-orange-500/40 transition-all cursor-pointer"
              >
                <option value="all">All Jobs</option>
                {filterOpts.jobs.map((j) => (
                  <option key={j._id} value={j._id}>{escapeHtml(j.title)}{j.department ? ` — ${j.department}` : ""}</option>
                ))}
              </select>

              {/* Student Filter */}
              <select
                value={fStudent}
                onChange={(e) => handleFilterChange(setFStudent, e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/60 focus:outline-none focus:border-orange-500/40 transition-all cursor-pointer"
              >
                <option value="all">All Students</option>
                {filterOpts.students.map((s) => (
                  <option key={s._id} value={s._id}>{escapeHtml(s.name)}{s.university ? ` (${s.university})` : ""}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={fStatus}
                onChange={(e) => handleFilterChange(setFStatus, e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/60 focus:outline-none focus:border-orange-500/40 transition-all cursor-pointer"
              >
                <option value="all">All Statuses</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Active Filter Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag, i) => (
                  <button key={i} onClick={tag.clear} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[11px] text-orange-300 hover:bg-orange-500/20 transition-colors">
                    {escapeHtml(tag.label)} <X className="w-3 h-3" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Table Header */}
          <div className="anim d4 flex items-center justify-between mb-4 px-1">
            <p className="text-xs text-white/30">
              {pagination.totalApplications} application{pagination.totalApplications !== 1 ? "s" : ""} found
              {selectedIds.length > 0 && <span className="text-orange-400 ml-2">({selectedIds.length} selected)</span>}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/25">Sort:</span>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-");
                    setSortBy(field);
                    setSortOrder(order);
                    setPage(1);
                  }}
                  className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-2 py-1 text-xs text-white/60 focus:outline-none cursor-pointer"
                >
                  <option value="appliedDate-desc">Newest First</option>
                  <option value="appliedDate-asc">Oldest First</option>
                  <option value="status-asc">Status A-Z</option>
                  <option value="status-desc">Status Z-A</option>
                  <option value="gpa-desc">Highest GPA</option>
                  <option value="gpa-asc">Lowest GPA</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/25">Per page:</span>
                <select
                  value={limit}
                  onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                  className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-2 py-1 text-xs text-white/60 focus:outline-none cursor-pointer"
                >
                  {[10, 25, 50, 100].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="anim d5 rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="px-4 py-3 w-10">
                      <button onClick={toggleSelectAll} className="text-white/30 hover:text-white/60 transition-colors">
                        {selectAll ? <CheckSquare className="w-4 h-4 text-orange-400" /> : <Square className="w-4 h-4" />}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-white/30 uppercase tracking-wider">Student</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-white/30 uppercase tracking-wider hidden lg:table-cell">University</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-white/30 uppercase tracking-wider">Job Applied</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-white/30 uppercase tracking-wider hidden md:table-cell">Company</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-white/30 uppercase tracking-wider hidden xl:table-cell">Applied</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-white/30 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <SkeletonRows />
                  ) : !apps.length ? (
                    <tr>
                      <td colSpan={8}>
                        <EmptyState icon={Inbox} title="No applications found" subtitle="Try adjusting your filters or search terms" />
                      </td>
                    </tr>
                  ) : (
                    apps.map((app) => (
                      <tr
                        key={app._id}
                        className={`table-row border-b border-white/[0.04] cursor-pointer ${selectedIds.includes(app._id) ? "selected" : ""}`}
                        onClick={() => viewDetail(app._id)}
                      >
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => toggleSelect(app._id)} className="text-white/20 hover:text-white/50 transition-colors">
                            {selectedIds.includes(app._id) ? <CheckSquare className="w-4 h-4 text-orange-400" /> : <Square className="w-4 h-4" />}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full ${getAvatarColor(app.studentName)} flex items-center justify-center text-[11px] font-semibold shrink-0`}>
                              {getInitials(app.studentName)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-white truncate max-w-[180px]">{escapeHtml(app.studentName)}</p>
                              <p className="text-[11px] text-white/30 truncate max-w-[180px]">{escapeHtml(app.studentEmail)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <p className="text-xs text-white/50 truncate max-w-[140px]">{escapeHtml(app.studentUniversity)}</p>
                          <p className="text-[10px] text-white/25">GPA: {app.studentGPA}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-white/80 truncate max-w-[180px] font-medium">{escapeHtml(app.jobTitle)}</p>
                          <div className="flex items-center gap-2 text-[11px] text-white/30">
                            <span>{escapeHtml(app.jobType)}</span>
                            {app.jobLocation && <span>· {escapeHtml(app.jobLocation)}</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <p className="text-xs text-white/50 truncate max-w-[140px]">{escapeHtml(app.companyName)}</p>
                          {app.companyLocation && <p className="text-[10px] text-white/25">{escapeHtml(app.companyLocation)}</p>}
                        </td>
                        <td className="px-4 py-3 hidden xl:table-cell">
                          <p className="text-xs text-white/30">{formatDate(app.appliedDate)}</p>
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <span className={`badge ${getBadgeClass(app.status)}`}>
                            {getStatusIcon(app.status)}
                            {escapeHtml(app.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-0.5">
                            <button onClick={() => setStatusModal({ open: true, id: app._id, name: app.studentName, job: app.jobTitle, cur: app.status })} className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-orange-400 transition-all" title="Change status">
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => viewDetail(app._id)} className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-blue-400 transition-all" title="View details">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setDeleteModal({ open: true, id: app._id, name: `${app.studentName} — ${app.jobTitle}` })} className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all" title="Delete">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06]">
                <p className="text-xs text-white/25">
                  Showing {(page - 1) * limit + 1}–{Math.min(page * limit, pagination.totalApplications)} of {pagination.totalApplications}
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] disabled:opacity-20 disabled:cursor-not-allowed transition-all">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {getPageNumbers(page, pagination.totalPages).map((p, i) =>
                    p === "..." ? (
                      <span key={`d${i}`} className="px-2 text-white/20 text-xs">…</span>
                    ) : (
                      <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${p === page ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"}`}>
                        {p}
                      </button>
                    )
                  )}
                  <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page >= pagination.totalPages} className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] disabled:opacity-20 disabled:cursor-not-allowed transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-12" />
        </div>
      </div>
    </>
  );
}

// ─── Detail Modal Content ─────────────────────────────────
function DetailContent({ data, otherApps }) {
  const st = data.student || {};
  const co = data.company || {};
  const jo = data.jobId || {};
  const resumeFile = data.resume || st.resume;

  return (
    <div className="space-y-4">
      {/* Student Header */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <div className={`w-14 h-14 rounded-2xl ${getAvatarColor(data.studentName || st.name)} flex items-center justify-center text-lg font-semibold`}>
          {getInitials(data.studentName || st.name)}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-lg font-semibold text-white">{escapeHtml(data.studentName || st.name)}</h4>
          <p className="text-sm text-white/40">{escapeHtml(data.studentEmail || st.email)}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`badge ${getBadgeClass(data.status)}`}>{getStatusIcon(data.status)}{escapeHtml(data.status)}</span>
            <span className="text-[11px] text-white/20">Applied {formatFullDate(data.appliedDate)}</span>
          </div>
        </div>
      </div>

      {/* Education */}
      <DetailSection icon={<GraduationCap className="w-4 h-4" />} title="Education">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-white/20 mb-1">University</p>
            <p className="text-sm text-white/70">{escapeHtml(data.studentUniversity || st.university || "N/A")}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/20 mb-1">GPA</p>
            <p className="text-sm text-white/70">{escapeHtml(data.studentGPA || data.gpa || st.gpa || "N/A")}</p>
          </div>
          {st.department && (
            <div>
              <p className="text-[10px] text-white/20 mb-1">Department</p>
              <p className="text-sm text-white/70">{escapeHtml(st.department)}</p>
            </div>
          )}
          {st.year && (
            <div>
              <p className="text-[10px] text-white/20 mb-1">Year</p>
              <p className="text-sm text-white/70">{escapeHtml(st.year)}</p>
            </div>
          )}
        </div>
      </DetailSection>

      {/* Contact */}
      <DetailSection icon={<User className="w-4 h-4" />} title="Contact">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-white/20 mb-1">Phone</p>
            <p className="text-sm text-white/70">{escapeHtml(data.studentPhone || st.phone || "N/A")}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/20 mb-1">Email</p>
            <p className="text-sm text-white/70">{escapeHtml(data.studentEmail || st.email || "N/A")}</p>
          </div>
        </div>
      </DetailSection>

      {/* Skills */}
      {(data.studentSkills || st.skills)?.length > 0 && (
        <DetailSection icon={<Star className="w-4 h-4" />} title="Skills">
          <div className="flex flex-wrap gap-1.5">
            {(data.studentSkills || st.skills).map((skill, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-white/50">
                {escapeHtml(typeof skill === "string" ? skill : skill.name || skill)}
              </span>
            ))}
          </div>
        </DetailSection>
      )}

      {/* Bio */}
      {st.bio && (
        <DetailSection icon={<AlignLeft className="w-4 h-4" />} title="Bio">
          <p className="text-sm text-white/50 leading-relaxed">{escapeHtml(st.bio)}</p>
        </DetailSection>
      )}

      {/* Job Applied */}
      <DetailSection icon={<Briefcase className="w-4 h-4" />} title="Job Applied For">
        <div className="mb-3">
          <p className="text-sm font-medium text-white">{escapeHtml(data.jobTitle || jo.title)}</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Department", data.jobDepartment || jo.department],
            ["Location", data.jobLocation || jo.location],
            ["Type", data.jobType || jo.type],
            ["Salary", data.jobSalary || jo.salary],
            ["Min CGPA", jo.minCGPA],
            ["Skills", jo.skills],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-[10px] text-white/20 mb-0.5">{label}</p>
              <p className="text-xs text-white/50">{value ? (Array.isArray(value) ? value.join(", ") : escapeHtml(value)) : "N/A"}</p>
            </div>
          ))}
        </div>
        {jo.description && (
          <div className="mt-3 pt-3 border-t border-white/[0.04]">
            <p className="text-[10px] text-white/20 mb-1">Description</p>
            <p className="text-xs text-white/40 leading-relaxed line-clamp-3">{escapeHtml(jo.description)}</p>
          </div>
        )}
      </DetailSection>

      {/* Company */}
      <DetailSection icon={<Building2 className="w-4 h-4" />} title="Company">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-white/20 mb-1">Name</p>
            <p className="text-sm text-white/70">{escapeHtml(data.companyName || co.companyName)}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/20 mb-1">Location</p>
            <p className="text-sm text-white/70">{escapeHtml(data.companyLocation || co.location)}</p>
          </div>
          {co.industry && (
            <div>
              <p className="text-[10px] text-white/20 mb-1">Industry</p>
              <p className="text-sm text-white/70">{escapeHtml(co.industry)}</p>
            </div>
          )}
          {co.website && (
            <div>
              <p className="text-[10px] text-white/20 mb-1">Website</p>
              <a href={co.website} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                Visit <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </DetailSection>

      {/* Resume */}
      {resumeFile && (
        <DetailSection icon={<FileText className="w-4 h-4" />} title="Resume">
          <a
            href={`${API.replace("/api", "")}/uploads/resumes/${resumeFile}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-sm text-orange-400 hover:bg-orange-500/20 transition-colors"
          >
            <Download className="w-4 h-4" /> View / Download Resume
          </a>
        </DetailSection>
      )}

      {/* Admin Notes */}
      {data.notes && (
        <DetailSection icon={<MessageSquare className="w-4 h-4" />} title="Admin Notes">
          <p className="text-sm text-white/50 leading-relaxed">{escapeHtml(data.notes)}</p>
        </DetailSection>
      )}

      {/* Interview Details */}
      {(data.status === "Interview Scheduled") && (
        <DetailSection icon={<Video className="w-4 h-4" />} title="Interview Details">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-white/20 mb-1">Date</p>
              <p className="text-sm text-white/70">{data.interviewDate ? formatFullDate(data.interviewDate) : "Not scheduled"}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/20 mb-1">Location</p>
              <p className="text-sm text-white/70">{escapeHtml(data.interviewLocation || "Not specified")}</p>
            </div>
          </div>
        </DetailSection>
      )}

      {/* Rejection Reason */}
      {data.status === "Rejected" && data.rejectionReason && (
        <DetailSection icon={<AlertCircle className="w-4 h-4" />} title="Rejection Reason">
          <p className="text-sm text-red-300/60">{escapeHtml(data.rejectionReason)}</p>
        </DetailSection>
      )}

      {/* Other Applications */}
      {otherApps.length > 0 && (
        <DetailSection icon={<Layers className="w-4 h-4" />} title={`Other Applications by this Student (${otherApps.length})`}>
          <div className="space-y-2">
            {otherApps.map((oa) => (
              <div key={oa._id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <div>
                  <p className="text-xs text-white/60 font-medium">{escapeHtml(oa.jobId?.title || "Unknown Job")}</p>
                  <p className="text-[10px] text-white/25">{escapeHtml(oa.company?.companyName || "")} · {formatDate(oa.appliedDate)}</p>
                </div>
                <span className={`badge text-[10px] ${getBadgeClass(oa.status)}`}>{escapeHtml(oa.status)}</span>
              </div>
            ))}
          </div>
        </DetailSection>
      )}
    </div>
  );
}

// ─── Skeleton Loading Rows ─────────────────────────────────
function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i} className="border-b border-white/[0.04]">
          <td className="px-4 py-3"><div className="skel w-5 h-5" /></td>
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="skel w-9 h-9 rounded-full shrink-0" />
              <div><div className="skel w-28 h-4 mb-1.5" /><div className="skel w-36 h-3" /></div>
            </div>
          </td>
          <td className="px-4 py-3 hidden lg:table-cell"><div className="skel w-24 h-4" /></td>
          <td className="px-4 py-3"><div className="skel w-32 h-4 mb-1.5" /><div className="skel w-20 h-3" /></td>
          <td className="px-4 py-3 hidden md:table-cell"><div className="skel w-28 h-4" /></td>
          <td className="px-4 py-3 hidden xl:table-cell"><div className="skel w-16 h-4" /></td>
          <td className="px-4 py-3"><div className="skel w-24 h-6 rounded-full" /></td>
          <td className="px-4 py-3"><div className="skel w-20 h-8 rounded-lg ml-auto" /></td>
        </tr>
      ))}
    </>
  );
}