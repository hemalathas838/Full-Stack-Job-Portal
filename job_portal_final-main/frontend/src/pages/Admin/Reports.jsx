// import { useEffect, useState, useMemo } from "react";
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
// // DONUT CHART (SVG)
// // ══════════════════════════════════════════
// function DonutChart({ segments, size = 150, strokeWidth = 22 }) {
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const total = segments.reduce((s, seg) => s + seg.value, 0);
//   if (total === 0) {
//     return (
//       <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
//         <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
//           <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
//         </svg>
//         <span style={{ fontSize: "11px", color: "#94a3b8" }}>No data</span>
//       </div>
//     );
//   }
//   let offset = 0;
//   const arcs = segments.map((seg) => {
//     const pct = seg.value / total;
//     const dashArray = `${pct * circumference} ${(1 - pct) * circumference}`;
//     const dashOffset = -offset * circumference;
//     offset += pct;
//     return { ...seg, dashArray, dashOffset, pct };
//   });
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
//       <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
//         <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
//         {arcs.map((arc, i) => (
//           <circle key={i} cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={arc.color} strokeWidth={strokeWidth} strokeDasharray={arc.dashArray} strokeDashoffset={arc.dashOffset} strokeLinecap="butt" style={{ transition: "stroke-dasharray 1s ease, stroke-dashoffset 1s ease" }} />
//         ))}
//       </svg>
//       <div>
//         <div style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", lineHeight: 1, letterSpacing: "-0.025em" }}>{total}</div>
//         <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, marginTop: "4px" }}>TOTAL PLACED</div>
//         <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "10px" }}>
//           {arcs.map((arc, i) => (
//             <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//               <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: arc.color, flexShrink: 0 }} />
//               <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 500 }}>{arc.label}</span>
//               <span style={{ fontSize: "11px", color: "#334155", fontWeight: 700, marginLeft: "auto" }}>{arc.value}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════
// // STAT RING
// // ══════════════════════════════════════════
// function StatRing({ value, label, color, size = 72, strokeWidth = 6 }) {
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const pct = Math.min(Number(value) || 0, 100);
//   const dashArray = `${(pct / 100) * circumference} ${circumference}`;
//   return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
//       <svg width={size} height={size} viewBox={`0 0 ${size} ${size`} style={{ transform: "rotate(-90deg)" }}>
//         <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
//         <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={dashArray} strokeLinecap="round" style={{ transition: "stroke-dasharray 1s ease" }} />
//       </svg>
//       <span style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", lineHeight: 1, marginTop: `-${size / 2 + 10}px` }}>{value}%</span>
//       <span style={{ fontSize: "10px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "10px", textAlign: "center", lineHeight: 1.2 }}>{label}</span>
//     </div>
//   );
// }

// // ══════════════════════════════════════════
// // HORIZONTAL BAR CHART
// // ══════════════════════════════════════════
// function HBarChart({ data, maxVal, colorFn }) {
//   if (!data.length) return <div style={{ textAlign: "center", padding: "30px", color: "#94a3b8", fontSize: "13px" }}>No data available</div>;
//   return (
//     <div>
//       {data.map((d, i) => {
//         const pct = maxVal > 0 ? Math.round((d.value / maxVal) * 100) : 0;
//         const color = colorFn ? colorFn(i) : "#6366f1";
//         return (
//           <div key={i} style={{ marginBottom: "14px" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
//               <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                 <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color, flexShrink: 0 }}>{d.label[0]}</div>
//                 <span style={{ fontSize: "12px", fontWeight: 600, color: "#334155", lineHeight: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" }}>{d.label}</span>
//               </div>
//               <span style={{ fontSize: "13px", fontWeight: 700, color, lineHeight: 1, flexShrink: 0 }}>{d.value}</span>
//             </div>
//             <div style={{ width: "100%", height: "10px", background: "#f1f5f9", borderRadius: "100px", overflow: "hidden" }}>
//               <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${color}, ${color}aa)`, borderRadius: "100px", transition: "width 1s cubic-bezier(0.22,1,0.36,1)", minWidth: d.value > 0 ? "4px" : "0" }} />
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// // ══════════════════════════════════════════
// // MINI BAR
// // ══════════════════════════════════════════
// function MiniBar({ value, max, color, label, count }) {
//   const pct = max > 0 ? Math.round((value / max) * 100) : 0;
//   return (
//     <div style={{ marginBottom: "12px" }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
//         <span style={{ fontSize: "12px", fontWeight: 600, color: "#334155", lineHeight: 1 }}>{label}</span>
//         <span style={{ fontSize: "11px", fontWeight: 700, color, lineHeight: 1 }}>{count}</span>
//       </div>
//       <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "100px", overflow: "hidden" }}>
//         <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "100px", transition: "width 0.8s ease" }} />
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════
// // COMPANY TABLE ROW
// // ══════════════════════════════════════════
// function CompanyRow({ company, index, maxPlaced, gradients }) {
//   const pct = maxPlaced > 0 ? Math.round((company.placed / maxPlaced) * 100) : 0;
//   const grad = gradients[index % gradients.length];
//   const avgPkg = company.totalPackage > 0 && company.placed > 0 ? (company.totalPackage / company.placed).toFixed(1) : "—";
//   return (
//     <div className="rpt-company-row">
//       <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "1.2", minWidth: 0 }}>
//         <div className="rpt-company-avatar" style={{ background: grad }}>{(company.name || "U")[0].toUpperCase()}</div>
//         <div style={{ minWidth: 0 }}>
//           <p className="rpt-company-name">{company.name}</p>
//           <p className="rpt-company-meta">{company.industry || "—"}</p>
//         </div>
//       </div>
//       <div className="rpt-company-stat">
//         <span className="rpt-company-stat-val">{company.placed}</span>
//         <span className="rpt-company-stat-label">Placed</span>
//       </div>
//       <div className="rpt-company-stat">
//         <span className="rpt-company-stat-val">₹{avgPkg}</span>
//         <span className="rpt-company-stat-label">Avg CTC (LPA)</span>
//       </div>
//       <div style={{ flex: 1.5, minWidth: "120px" }}>
//         <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "100px", overflow: "hidden" }}>
//           <div style={{ width: `${pct}%`, height: "100%", background: grad, borderRadius: "100px", transition: "width 0.8s ease" }} />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════
// // DEPARTMENT CARD
// // ══════════════════════════════════════════
// function DeptCard({ dept, index, colors }) {
//   const pct = dept.total > 0 ? ((dept.placed / dept.total) * 100).toFixed(1) : 0;
//   const color = colors[index % colors.length];
//   return (
//     <div className="rpt-dept-card">
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
//         <div>
//           <p className="rpt-dept-name">{dept.name}</p>
//           <p className="rpt-dept-total">{dept.total} students</p>
//         </div>
//         <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${color}10`, border: `1px solid ${color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 800, color, flexShrink: 0 }}>{dept.placed}</div>
//       </div>
//       <div style={{ width: "100%", height: "6px", background: "#f1f5f9", borderRadius: "100px", overflow: "hidden", marginBottom: "8px" }}>
//         <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "100px", transition: "width 1s ease" }} />
//       </div>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <span className="rpt-dept-pct" style={{ color }}>{pct}% placed</span>
//         <span className="rpt-dept-unplaced">{dept.total - dept.placed} unplaced</span>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════
// // EMPTY STATE
// // ══════════════════════════════════════════
// function EmptyState({ icon, title, text }) {
//   return (
//     <div className="rpt-empty-state">
//       <div className="rpt-empty-icon">{icon}</div>
//       <h2 className="rpt-empty-title">{title}</h2>
//       <p className="rpt-empty-text">{text}</p>
//     </div>
//   );
// }

// // ══════════════════════════════════════════
// // COLOR PALETTES (dynamic, not static)
// // ══════════════════════════════════════════
// const PALETTE = ["#6366f1", "#0d9488", "#f59e0b", "#ef4444", "#0ea5e9", "#8b5cf6", "#ec4899", "#10b981", "#f97316", "#14b8a6"];
// const GRADIENTS = [
//   "linear-gradient(135deg, #6366f1, #818cf8)",
//   "linear-gradient(135deg, #0d9488, #14b8a6)",
//   "linear-gradient(135deg, #f59e0b, #fbbf24)",
//   "linear-gradient(135deg, #ef4444, #f87171)",
//   "linear-gradient(135deg, #0ea5e9, #38bdf8)",
//   "linear-gradient(135deg, #8b5cf6, #a78bfa)",
//   "linear-gradient(135deg, #ec4899, #f472b6)",
//   "linear-gradient(135deg, #10b981, #34d399)",
// ];

// // ══════════════════════════════════════════
// // DYNAMIC PACKAGE RANGE COMPUTATION
// // ══════════════════════════════════════════
// function computePackageRanges(packages) {
//   if (!packages.length) return [];
//   const min = Math.min(...packages);
//   const max = Math.max(...packages);
//   if (min === max) return [{ label: `₹${min} LPA`, count: packages.length, value: packages.length }];
//   const range = max - min;
//   let bucketSize;
//   if (range <= 5) bucketSize = 1;
//   else if (range <= 15) bucketSize = 3;
//   else if (range <= 30) bucketSize = 5;
//   else bucketSize = 10;
//   const buckets = {};
//   packages.forEach((p) => {
//     const low = Math.floor(p / bucketSize) * bucketSize;
//     const high = low + bucketSize;
//     const key = `${low}-${high}`;
//     buckets[key] = (buckets[key] || 0) + 1;
//   });
//   return Object.entries(buckets)
//     .map(([range, count]) => ({ label: `₹${range} LPA`, count, value: count }))
//     .sort((a, b) => {
//       const aLow = parseInt(a.label.replace(/[^\d]/g, ""));
//       const bLow = parseInt(b.label.replace(/[^\d]/g, ""));
//       return aLow - bLow;
//     });
// }

// // ══════════════════════════════════════════
// // MAIN COMPONENT
// // ══════════════════════════════════════════
// export default function Reports() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [refreshing, setRefreshing] = useState(false);
//   const [toast, setToast] = useState(null);
//   const [activeTab, setActiveTab] = useState("overview");

//   // Raw data from API
//   const [rawData, setRawData] = useState({
//     students: [],
//     placementResults: [],
//     jobs: [],
//   });

//   const getToken = () => localStorage.getItem("adminToken");
//   const showToast = (message, type = "success") => setToast({ message, type });

//   // ═══ FETCH ═══
//   const fetchReports = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/reports`, {
//         headers: { Authorization: `Bearer ${getToken()}` },
//       });
//       const d = res.data || {};
//       setRawData({
//         students: Array.isArray(d.students) ? d.students : [],
//         placementResults: Array.isArray(d.placementResults) ? d.placementResults : [],
//         jobs: Array.isArray(d.jobs) ? d.jobs : [],
//       });
//       setError("");
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to load reports");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => { fetchReports(); }, []);
//   const handleRefresh = () => { setRefreshing(true); fetchReports(); };

//   // ═══ ALL COMPUTED DYNAMICALLY ═══
//   const computed = useMemo(() => {
//     const { students, placementResults, jobs } = rawData;

//     // --- Placed results only ---
//     const placed = placementResults.filter((r) => r.finalStatus === "Selected");
//     const placedStudentIds = new Set(placed.map((r) => r.student?._id?.toString() || r.student?.toString()).filter(Boolean));

//     // --- Total placed (unique students) ---
//     const totalPlaced = placedStudentIds.size;

//     // --- Total students ---
//     const totalStudents = students.length;

//     // --- Unique companies that hired ---
//     const companyIds = new Set();
//     placed.forEach((r) => {
//       const cid = r.job?.company?._id?.toString() || r.job?.company?.toString() || null;
//       if (cid) companyIds.add(cid);
//     });
//     const totalCompanies = companyIds.size;

//     // --- Packages ---
//     const packages = placed.map((r) => {
//       const p = r.job?.package || r.package || 0;
//       return typeof p === "string" ? parseFloat(p) : p;
//     }).filter((p) => p > 0);
//     const avgPackage = packages.length > 0 ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1) : "0";
//     const maxPackage = packages.length > 0 ? Math.max(...packages) : 0;
//     const minPackage = packages.length > 0 ? Math.min(...packages) : 0;

//     // --- Placement percentage ---
//     const placementPercentage = totalStudents > 0 ? ((totalPlaced / totalStudents) * 100).toFixed(1) : 0;

//     // --- Company-wise (dynamic) ---
//     const companyMap = {};
//     placed.forEach((r) => {
//       const c = r.job?.company || {};
//       const name = c.companyName || c.name || "Unknown";
//       const industry = c.industry || "—";
//       const pkg = r.job?.package || r.package || 0;
//       if (!companyMap[name]) companyMap[name] = { name, industry, placed: 0, totalPackage: 0 };
//       companyMap[name].placed++;
//       companyMap[name].totalPackage += typeof pkg === "string" ? parseFloat(pkg) || 0 : pkg || 0;
//     });
//     const companyWise = Object.values(companyMap).sort((a, b) => b.placed - a.placed);
//     const maxCompanyPlaced = companyWise.length > 0 ? Math.max(...companyWise.map((c) => c.placed)) : 0;

//     // --- Department-wise (dynamic from students collection) ---
//     const deptMap = {};
//     students.forEach((s) => {
//       const dept = s.department || "Unknown";
//       if (!deptMap[dept]) deptMap[dept] = { name: dept, total: 0, placed: 0 };
//       deptMap[dept].total++;
//     });
//     placed.forEach((r) => {
//       const sid = r.student?._id?.toString() || r.student?.toString();
//       if (!sid) return;
//       const student = students.find((s) => s._id?.toString() === sid);
//       const dept = student?.department || "Unknown";
//       if (deptMap[dept]) deptMap[dept].placed++;
//     });
//     const departmentWise = Object.values(deptMap).sort((a, b) => {
//       const aPct = a.total > 0 ? a.placed / a.total : 0;
//       const bPct = b.total > 0 ? b.placed / b.total : 0;
//       return bPct - aPct;
//     });
//     const maxDeptPlaced = departmentWise.length > 0 ? Math.max(...departmentWise.map((d) => d.placed)) : 0;

//     // --- Best / Lowest dept percentages ---
//     const deptPercentages = departmentWise.map((d) => d.total > 0 ? (d.placed / d.total) * 100 : 0);
//     const bestDeptPct = deptPercentages.length > 0 ? Math.max(...deptPercentages).toFixed(0) : 0;
//     const lowestDeptPct = deptPercentages.length > 0 ? Math.min(...deptPercentages).toFixed(0) : 0;

//     // --- Package ranges (dynamic buckets) ---
//     const packageRanges = computePackageRanges(packages);
//     const maxPkgRange = packageRanges.length > 0 ? Math.max(...packageRanges.map((r) => r.count)) : 0;

//     // --- Yearly trend (dynamic from actual data) ---
//     const yearMap = {};
//     placed.forEach((r) => {
//       const date = r.placedAt || r.createdAt || r.appliedAt;
//       if (!date) return;
//       const year = new Date(date).getFullYear();
//       if (!yearMap[year]) yearMap[year] = { year: String(year), total: 0, placed: 0 };
//       yearMap[year].placed++;
//     });
//     // Count total students per year dynamically
//     students.forEach((s) => {
//       const yr = s.passingYear || s.graduationYear || (s.createdAt ? new Date(s.createdAt).getFullYear() : null);
//       if (!yr) return;
//       const key = String(yr);
//       if (!yearMap[key]) yearMap[key] = { year: key, total: 0, placed: 0 };
//       yearMap[key].total++;
//     });
//     // For years where we have placed but no student count, set total >= placed
//     Object.values(yearMap).forEach((y) => { if (y.total < y.placed) y.total = y.placed; });
//     const yearlyTrend = Object.values(yearMap).sort((a, b) => a.year.localeCompare(b.year));
//     const maxYearlyPlaced = yearlyTrend.length > 0 ? Math.max(...yearlyTrend.map((y) => y.placed)) : 0;

//     // --- Recent placements (dynamic, last 20) ---
//     const recentPlacements = placed
//       .sort((a, b) => new Date(b.placedAt || b.createdAt || 0) - new Date(a.placedAt || a.createdAt || 0))
//       .slice(0, 20)
//       .map((r) => {
//         const s = r.student || {};
//         const j = r.job || {};
//         const c = j.company || {};
//         return {
//           studentName: s.name || "Unknown",
//           department: s.department || "—",
//           company: c.companyName || c.name || "—",
//           package: j.package || r.package || null,
//           date: r.placedAt || r.createdAt,
//         };
//       });

//     // --- Donut segments ---
//     const unplaced = totalStudents - totalPlaced;
//     const donutSegments = [
//       { label: "Placed", value: totalPlaced, color: "#10b981" },
//       { label: "Unplaced", value: unplaced > 0 ? unplaced : 0, color: "#e2e8f0" },
//     ];

//     return {
//       totalStudents,
//       totalPlaced,
//       totalCompanies,
//       avgPackage,
//       maxPackage,
//       minPackage,
//       placementPercentage,
//       companyWise,
//       maxCompanyPlaced,
//       departmentWise,
//       maxDeptPlaced,
//       bestDeptPct,
//       lowestDeptPct,
//       packageRanges,
//       maxPkgRange,
//       yearlyTrend,
//       maxYearlyPlaced,
//       recentPlacements,
//       donutSegments,
//       unplaced,
//     };
//   }, [rawData]);

//   // ═══ EXPORT CSV ═══
//   const handleExport = () => {
//     try {
//       let csv = "Placement Report\n";
//       csv += `Generated,${new Date().toLocaleString()}\n\n`;
//       csv += `Total Students,${computed.totalStudents}\n`;
//       csv += `Total Placed,${computed.totalPlaced}\n`;
//       csv += `Placement %,${computed.placementPercentage}%\n`;
//       csv += `Companies Participated,${computed.totalCompanies}\n`;
//       csv += `Average Package,${computed.avgPackage} LPA\n`;
//       csv += `Highest Package,${computed.maxPackage} LPA\n`;
//       csv += `Lowest Package,${computed.minPackage} LPA\n\n`;
//       csv += "Department,Total,Placed,Unplaced,Placement %\n";
//       computed.departmentWise.forEach((d) => {
//         const pct = d.total > 0 ? ((d.placed / d.total) * 100).toFixed(1) : 0;
//         csv += `${d.name},${d.total},${d.placed},${d.total - d.placed},${pct}%\n`;
//       });
//       csv += "\nCompany,Placed,Avg CTC (LPA)\n";
//       computed.companyWise.forEach((c) => {
//         const avg = c.totalPackage > 0 && c.placed > 0 ? (c.totalPackage / c.placed).toFixed(1) : "N/A";
//         csv += `${c.name},${c.placed},${avg}\n`;
//       });
//       if (computed.yearlyTrend.length) {
//         csv += "\nYear,Total Students,Placed,Placement %\n";
//         computed.yearlyTrend.forEach((y) => {
//           const pct = y.total > 0 ? ((y.placed / y.total) * 100).toFixed(1) : 0;
//           csv += `${y.year},${y.total},${y.placed},${pct}%\n`;
//         });
//       }
//       const blob = new Blob([csv], { type: "text/csv" });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `placement-report-${new Date().toISOString().split("T")[0]}.csv`;
//       a.click();
//       URL.revokeObjectURL(url);
//       showToast("Report exported successfully!");
//     } catch (err) {
//       showToast("Export failed", "error");
//     }
//   };

//   // ═══ Stat definitions (dynamic values, static icons) ═══
//   const topStats = [
//     {
//       label: "Total Students",
//       display: computed.totalStudents,
//       accentColor: "#6366f1",
//       icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
//     },
//     {
//       label: "Total Placed",
//       display: computed.totalPlaced,
//       accentColor: "#10b981",
//       icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
//     },
//     {
//       label: "Companies Visited",
//       display: computed.totalCompanies,
//       accentColor: "#f59e0b",
//       icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
//     },
//     {
//       label: "Avg Package",
//       display: `₹${computed.avgPackage} LPA`,
//       accentColor: "#0ea5e9",
//       icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
//     },
//   ];

//   return (
//     <div className="dashboard-container">
//       <Toast toast={toast} onClose={() => setToast(null)} />

//       <aside className="sidebar">
//         <h2>🎓 Admin</h2>
//         <ul>
//           <li><Link to="/admin/dashboard">📊 Dashboard</Link></li>
//           <li><Link to="/students">👨‍🎓 Students</Link></li>
//           <li><Link to="/recruiters">🏢 Recruiters</Link></li>
//           <li><Link to="/admin/approve-jobs">📄 Approve Jobs</Link></li>
//           <li><Link to="/admin/applications">📬 Applications</Link></li>
//           <li><Link to="/admin/placement-results">🏆 Results</Link></li>
//           <li className="active"><span>📈 Reports</span></li>
//         </ul>
//       </aside>

//       <main className="main-content rpt-main-content">
//         <header className="top-nav rpt-top-nav">
//           <div>
//             <h1><b>📈 Placement Reports</b></h1>
//             <p className="rpt-subtitle">Live analytics computed from {computed.totalStudents} students and {computed.totalPlaced} placements</p>
//           </div>
//           <div className="rpt-top-actions">
//             <button className="rpt-refresh-btn" onClick={handleRefresh} disabled={refreshing}>
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={refreshing ? { animation: "rptSpin 0.8s linear infinite" } : {}}>
//                 <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
//               </svg>
//               Refresh
//             </button>
//             <button className="rpt-export-btn" onClick={handleExport} disabled={computed.totalStudents === 0}>
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
//               Export CSV
//             </button>
//           </div>
//         </header>

//         <div className="rpt-content-area">
//           {/* ═══ Top Stats ═══ */}
//           <div className="rpt-stats-grid">
//             {topStats.map((s) => (
//               <div key={s.label} className="rpt-stat-card">
//                 <div className="rpt-stat-icon" style={{ background: `${s.accentColor}0D`, border: `1px solid ${s.accentColor}1A` }}>{s.icon}</div>
//                 <div className="rpt-stat-content">
//                   <span className="rpt-stat-label">{s.label}</span>
//                   <span className="rpt-stat-value">{s.display}</span>
//                 </div>
//                 <div className="rpt-stat-accent" style={{ background: `${s.accentColor}40` }} />
//               </div>
//             ))}
//           </div>

//           {loading ? (
//             <LoadingSkeleton />
//           ) : error ? (
//             <div className="ms-error"><span>⚠️ {error}</span><button onClick={handleRefresh}>Retry</button></div>
//           ) : computed.totalStudents === 0 ? (
//             <EmptyState icon="📭" title="No student data yet" text="Reports will be generated automatically as students register and get placed." />
//           ) : (
//             <>
//               {/* ═══ Donut + Package Distribution ═══ */}
//               <div className="rpt-dual-panel">
//                 <div className="rpt-panel">
//                   <div className="rpt-panel-header">
//                     <h3 className="rpt-panel-title">Placement Overview</h3>
//                     <span className="rpt-panel-badge" style={{ background: "#ecfdf5", color: "#065f46", borderColor: "#a7f3d0" }}>{computed.placementPercentage}%</span>
//                   </div>
//                   <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 0", gap: "32px" }}>
//                     <DonutChart segments={computed.donutSegments} size={150} strokeWidth={22} />
//                   </div>
//                   {computed.departmentWise.length > 1 && (
//                     <div style={{ display: "flex", justifyContent: "center", gap: "28px", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
//                       <StatRing value={computed.placementPercentage} label="Overall" color="#10b981" />
//                       <StatRing value={computed.bestDeptPct} label="Best Dept" color="#6366f1" />
//                       <StatRing value={computed.lowestDeptPct} label="Lowest Dept" color="#f59e0b" />
//                     </div>
//                   )}
//                 </div>

//                 <div className="rpt-panel">
//                   <div className="rpt-panel-header">
//                     <h3 className="rpt-panel-title">Package Distribution</h3>
//                     {computed.maxPackage > 0 && (
//                       <span style={{ fontSize: "11px", color: "#64748b" }}>
//                         ₹{computed.minPackage} – ₹{computed.maxPackage} LPA
//                       </span>
//                     )}
//                   </div>
//                   <div style={{ padding: "16px 0" }}>
//                     {computed.packageRanges.length > 0 ? (
//                       computed.packageRanges.map((range, i) => (
//                         <MiniBar key={i} value={range.count} max={computed.maxPkgRange} color={PALETTE[i % PALETTE.length]} label={range.label} count={range.count} />
//                       ))
//                     ) : (
//                       <div style={{ textAlign: "center", padding: "30px 0", color: "#94a3b8", fontSize: "13px" }}>No package data available</div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* ═══ Tab Navigation ═══ */}
//               <div className="rpt-filter-tabs">
//                 {[
//                   { key: "overview", label: "Overview", icon: "📊" },
//                   { key: "company", label: "Company-wise", icon: "🏢" },
//                   { key: "department", label: "Department-wise", icon: "🎓" },
//                   ...(computed.yearlyTrend.length > 0 ? [{ key: "trend", label: "Yearly Trend", icon: "📈" }] : []),
//                   ...(computed.recentPlacements.length > 0 ? [{ key: "recent", label: "Recent Placements", icon: "🕐" }] : []),
//                 ].map((tab) => (
//                   <button key={tab.key} className={`rpt-filter-tab ${activeTab === tab.key ? "rpt-filter-active" : ""}`} onClick={() => setActiveTab(tab.key)}>
//                     <span>{tab.icon}</span>{tab.label}
//                   </button>
//                 ))}
//               </div>

//               {/* ═══ TAB: Overview ═══ */}
//               {activeTab === "overview" && (
//                 <div className="rpt-tab-content">
//                   <div className="rpt-summary-row">
//                     <div className="rpt-summary-card" style={{ borderLeftColor: "#10b981" }}>
//                       <div className="rpt-summary-icon" style={{ background: "#ecfdf5", color: "#065f46" }}>✓</div>
//                       <div><p className="rpt-summary-val">{computed.totalPlaced}</p><p className="rpt-summary-label">Students Placed</p></div>
//                     </div>
//                     <div className="rpt-summary-card" style={{ borderLeftColor: "#ef4444" }}>
//                       <div className="rpt-summary-icon" style={{ background: "#fef2f2", color: "#991b1b" }}>✕</div>
//                       <div><p className="rpt-summary-val">{computed.unplaced}</p><p className="rpt-summary-label">Students Unplaced</p></div>
//                     </div>
//                     <div className="rpt-summary-card" style={{ borderLeftColor: "#6366f1" }}>
//                       <div className="rpt-summary-icon" style={{ background: "#eef2ff", color: "#4f46e5" }}>🏢</div>
//                       <div><p className="rpt-summary-val">{computed.totalCompanies}</p><p className="rpt-summary-label">Companies Participated</p></div>
//                     </div>
//                     <div className="rpt-summary-card" style={{ borderLeftColor: "#0ea5e9" }}>
//                       <div className="rpt-summary-icon" style={{ background: "#f0f9ff", color: "#0369a1" }}>💰</div>
//                       <div><p className="rpt-summary-val">₹{computed.avgPackage} LPA</p><p className="rpt-summary-label">Average Package</p></div>
//                     </div>
//                   </div>

//                   {computed.companyWise.length > 0 && (
//                     <div className="rpt-panel" style={{ marginTop: "20px" }}>
//                       <div className="rpt-panel-header">
//                         <h3 className="rpt-panel-title">Top Companies by Hiring</h3>
//                         <button className="rpt-view-all-btn" onClick={() => setActiveTab("company")}>View All →</button>
//                       </div>
//                       <div style={{ padding: "8px 0" }}>
//                         <HBarChart data={computed.companyWise.slice(0, 6).map((c) => ({ label: c.name, value: c.placed }))} maxVal={computed.maxCompanyPlaced} colorFn={(i) => PALETTE[i % PALETTE.length]} />
//                       </div>
//                     </div>
//                   )}

//                   {computed.departmentWise.length > 0 && (
//                     <div className="rpt-panel" style={{ marginTop: "20px" }}>
//                       <div className="rpt-panel-header">
//                         <h3 className="rpt-panel-title">Department Performance</h3>
//                         <button className="rpt-view-all-btn" onClick={() => setActiveTab("department")}>View All →</button>
//                       </div>
//                       <div style={{ padding: "8px 0" }}>
//                         <HBarChart data={computed.departmentWise.slice(0, 6).map((d) => ({ label: d.name, value: d.placed }))} maxVal={computed.maxDeptPlaced} colorFn={(i) => PALETTE[i % PALETTE.length]} />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* ═══ TAB: Company-wise ═══ */}
//               {activeTab === "company" && (
//                 <div className="rpt-tab-content">
//                   {computed.companyWise.length > 0 ? (
//                     <div className="rpt-company-table">
//                       <div className="rpt-company-header">
//                         <span style={{ flex: "1.2" }}>Company</span>
//                         <span style={{ width: "80px", textAlign: "center" }}>Placed</span>
//                         <span style={{ width: "120px", textAlign: "center" }}>Avg CTC</span>
//                         <span style={{ flex: "1.5" }}>Hiring Share</span>
//                       </div>
//                       {computed.companyWise.map((company, i) => (
//                         <CompanyRow key={company.name} company={company} index={i} maxPlaced={computed.maxCompanyPlaced} gradients={GRADIENTS} />
//                       ))}
//                     </div>
//                   ) : (
//                     <EmptyState icon="🏢" title="No company data yet" text="Company data will appear once students start getting placed." />
//                   )}
//                 </div>
//               )}

//               {/* ═══ TAB: Department-wise ═══ */}
//               {activeTab === "department" && (
//                 <div className="rpt-tab-content">
//                   {computed.departmentWise.length > 0 ? (
//                     <div className="rpt-dept-grid">
//                       {computed.departmentWise.map((dept, i) => (
//                         <DeptCard key={dept.name} dept={dept} index={i} colors={PALETTE} />
//                       ))}
//                     </div>
//                   ) : (
//                     <EmptyState icon="🎓" title="No department data yet" text="Students need to have department info for this report." />
//                   )}
//                 </div>
//               )}

//               {/* ═══ TAB: Yearly Trend ═══ */}
//               {activeTab === "trend" && (
//                 <div className="rpt-tab-content">
//                   {computed.yearlyTrend.length > 0 ? (
//                     <div className="rpt-panel">
//                       <div className="rpt-panel-header">
//                         <h3 className="rpt-panel-title">Year-wise Placement Trend</h3>
//                       </div>
//                       <div style={{ padding: "20px 0" }}>
//                         <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "200px", marginBottom: "12px" }}>
//                           {computed.yearlyTrend.map((y, i) => {
//                             const pct = computed.maxYearlyPlaced > 0 ? (y.placed / computed.maxYearlyPlaced) * 100 : 0;
//                             const placementPct = y.total > 0 ? ((y.placed / y.total) * 100).toFixed(0) : 0;
//                             const color = PALETTE[i % PALETTE.length];
//                             return (
//                               <div key={y.year} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%", justifyContent: "flex-end" }}>
//                                 <span style={{ fontSize: "11px", fontWeight: 700, color: "#0f172a" }}>{y.placed}</span>
//                                 <span style={{ fontSize: "9px", color: "#64748b" }}>({placementPct}%)</span>
//                                 <div style={{ width: "100%", maxWidth: "52px", height: `${pct}%`, minHeight: "4px", background: `linear-gradient(180deg, ${color}, ${color}88)`, borderRadius: "6px 6px 2px 2px", transition: "height 1s ease" }} />
//                               </div>
//                             );
//                           })}
//                         </div>
//                         <div style={{ display: "flex", gap: "8px" }}>
//                           {computed.yearlyTrend.map((y) => (
//                             <div key={y.year} style={{ flex: 1, textAlign: "center" }}>
//                               <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748b" }}>{y.year}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                       <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "16px", marginTop: "8px" }}>
//                         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0", fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.04em", paddingBottom: "10px", borderBottom: "1px solid #f1f5f9" }}>
//                           <span>Year</span><span style={{ textAlign: "center" }}>Total</span><span style={{ textAlign: "center" }}>Placed</span><span style={{ textAlign: "center" }}>%</span>
//                         </div>
//                         {computed.yearlyTrend.map((y) => {
//                           const pct = y.total > 0 ? (y.placed / y.total) : 0;
//                           return (
//                             <div key={y.year} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", fontSize: "13px", padding: "10px 0", borderBottom: "1px solid #f8fafc" }}>
//                               <span style={{ fontWeight: 600, color: "#0f172a" }}>{y.year}</span>
//                               <span style={{ textAlign: "center", color: "#64748b" }}>{y.total}</span>
//                               <span style={{ textAlign: "center", fontWeight: 600, color: "#10b981" }}>{y.placed}</span>
//                               <span style={{ textAlign: "center" }}>
//                                 <span style={{ padding: "2px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 700, background: pct >= 0.8 ? "#ecfdf5" : pct >= 0.5 ? "#fffbeb" : "#fef2f2", color: pct >= 0.8 ? "#065f46" : pct >= 0.5 ? "#92400e" : "#991b1b" }}>{(pct * 100).toFixed(1)}%</span>
//                               </span>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   ) : (
//                     <EmptyState icon="📈" title="No yearly data" text="Yearly trends will appear as placement data accumulates over time." />
//                   )}
//                 </div>
//               )}

//               {/* ═══ TAB: Recent Placements ═══ */}
//               {activeTab === "recent" && (
//                 <div className="rpt-tab-content">
//                   {computed.recentPlacements.length > 0 ? (
//                     <div className="rpt-recent-list">
//                       {computed.recentPlacements.map((p, i) => {
//                         const grad = GRADIENTS[i % GRADIENTS.length];
//                         const name = p.studentName || "Unknown";
//                         const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
//                         return (
//                           <div key={i} className="rpt-recent-card">
//                             <div className="rpt-recent-avatar" style={{ background: grad }}>{initials}</div>
//                             <div style={{ flex: 1, minWidth: 0 }}>
//                               <p className="rpt-recent-name">{name}</p>
//                               <p className="rpt-recent-detail">{p.department} • {p.company}</p>
//                             </div>
//                             <div style={{ textAlign: "right", flexShrink: 0 }}>
//                               <p className="rpt-recent-package">{p.package ? `₹${p.package} LPA` : "—"}</p>
//                               <p className="rpt-recent-date">{formatDate(p.date)}</p>
//                             </div>
//                             <span className="rpt-recent-badge">Placed</span>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   ) : (
//                     <EmptyState icon="🕐" title="No recent placements" text="Recently placed students will appear here." />
//                   )}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </main>

//       <style>{`
//         @keyframes rptSpin { to { transform: rotate(360deg); } }
//         @keyframes rptPulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
//         @keyframes rptFadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
//         .rpt-main-content { display:flex!important; flex-direction:column; overflow:hidden; }
//         .rpt-top-nav { flex-wrap:wrap; gap:12px; }
//         .rpt-subtitle { font-size:12px; color:#94a3b8; margin:3px 0 0 0; }
//         .rpt-top-actions { display:flex; align-items:center; gap:10px; }
//         .rpt-refresh-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:8px; font-size:13px; font-weight:500; color:#475569; background:#f1f5f9; border:1px solid #e2e8f0; cursor:pointer; }
//         .rpt-refresh-btn:disabled { opacity:0.5; cursor:wait; }
//         .rpt-export-btn { display:inline-flex; align-items:center; gap:6px; padding:9px 22px; border-radius:8px; font-size:13px; font-weight:600; color:#fff; background:linear-gradient(135deg,#6366f1,#818cf8); border:none; cursor:pointer; box-shadow:0 2px 10px rgba(99,102,241,0.3); transition:all 0.15s; }
//         .rpt-export-btn:hover:not(:disabled) { box-shadow:0 4px 16px rgba(99,102,241,0.4); transform:translateY(-1px); }
//         .rpt-export-btn:disabled { opacity:0.4; cursor:not-allowed; }
//         .rpt-content-area { flex:1; overflow-y:auto; padding:28px 32px; }
//         .rpt-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; }
//         .rpt-stat-card { position:relative; background:#fff; border-radius:12px; border:1px solid #e8ecf1; padding:20px; display:flex; align-items:flex-start; gap:14px; overflow:hidden; transition:border-color 0.2s,box-shadow 0.2s; }
//         .rpt-stat-card:hover { border-color:#cbd5e1; box-shadow:0 4px 16px rgba(15,23,42,0.06); }
//         .rpt-stat-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
//         .rpt-stat-content { flex:1; display:flex; flex-direction:column; gap:6px; }
//         .rpt-stat-label { font-size:11px; font-weight:600; color:#94a3b8; letter-spacing:0.04em; text-transform:uppercase; line-height:1; }
//         .rpt-stat-value { font-size:28px; font-weight:700; color:#0f172a; line-height:1; letter-spacing:-0.025em; }
//         .rpt-stat-accent { position:absolute; bottom:0; left:0; right:0; height:2px; opacity:0; transition:opacity 0.2s; }
//         .rpt-stat-card:hover .rpt-stat-accent { opacity:1; }
//         .rpt-dual-panel { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; }
//         .rpt-panel { background:#fff; border-radius:14px; border:1px solid #e8ecf1; padding:22px 24px; }
//         .rpt-panel-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
//         .rpt-panel-title { font-size:15px; font-weight:700; color:#0f172a; margin:0; }
//         .rpt-panel-badge { font-size:12px; font-weight:700; padding:4px 14px; border-radius:100px; border:1px solid; }
//         .rpt-view-all-btn { font-size:12px; font-weight:600; color:#6366f1; background:none; border:none; cursor:pointer; padding:4px 0; }
//         .rpt-view-all-btn:hover { color:#4f46e5; }
//         .rpt-filter-tabs { display:flex; gap:6px; margin-bottom:20px; background:#fff; border-radius:12px; border:1px solid #e8ecf1; padding:6px; }
//         .rpt-filter-tab { display:inline-flex; align-items:center; gap:6px; padding:9px 16px; border-radius:8px; border:1px solid transparent; background:transparent; font-size:12px; font-weight:600; color:#64748b; cursor:pointer; transition:all 0.15s; }
//         .rpt-filter-tab:hover { background:#f1f5f9; }
//         .rpt-filter-active { background:#6366f1; color:#fff; border-color:#6366f1; }
//         .rpt-filter-active:hover { background:#4f46e5; color:#fff; }
//         .rpt-tab-content { animation:rptFadeIn 0.3s ease; }
//         .rpt-summary-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
//         .rpt-summary-card { background:#fff; border-radius:12px; border:1px solid #e8ecf1; border-left:4px solid #e2e8f0; padding:18px 20px; display:flex; align-items:center; gap:14px; transition:box-shadow 0.2s; }
//         .rpt-summary-card:hover { box-shadow:0 4px 16px rgba(15,23,42,0.06); }
//         .rpt-summary-icon { width:42px; height:42px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:700; flex-shrink:0; }
//         .rpt-summary-val { font-size:22px; font-weight:800; color:#0f172a; margin:0; line-height:1; }
//         .rpt-summary-label { font-size:11px; font-weight:600; color:#94a3b8; margin:3px 0 0 0; }
//         .rpt-company-table { background:#fff; border-radius:14px; border:1px solid #e8ecf1; overflow:hidden; }
//         .rpt-company-header { display:flex; align-items:center; padding:14px 24px; background:#fafbfc; border-bottom:1px solid #f1f5f9; font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.04em; }
//         .rpt-company-row { display:flex; align-items:center; padding:14px 24px; border-bottom:1px solid #f8fafc; transition:background 0.15s; }
//         .rpt-company-row:hover { background:#fafbfc; }
//         .rpt-company-row:last-child { border-bottom:none; }
//         .rpt-company-avatar { width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; color:#fff; flex-shrink:0; }
//         .rpt-company-name { font-size:13px; font-weight:600; color:#0f172a; margin:0; }
//         .rpt-company-meta { font-size:11px; color:#94a3b8; margin:2px 0 0 0; }
//         .rpt-company-stat { display:flex; flex-direction:column; align-items:center; gap:2px; }
//         .rpt-company-stat-val { font-size:14px; font-weight:700; color:#0f172a; line-height:1; }
//         .rpt-company-stat-label { font-size:10px; color:#94a3b8; font-weight:500; }
//         .rpt-dept-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:14px; }
//         .rpt-dept-card { background:#fff; border-radius:12px; border:1px solid #e8ecf1; padding:20px; transition:box-shadow 0.2s; }
//         .rpt-dept-card:hover { box-shadow:0 4px 16px rgba(15,23,42,0.06); }
//         .rpt-dept-name { font-size:14px; font-weight:700; color:#0f172a; margin:0; }
//         .rpt-dept-total { font-size:11px; color:#94a3b8; margin:2px 0 0 0; }
//         .rpt-dept-pct { font-size:12px; font-weight:700; }
//         .rpt-dept-unplaced { font-size:11px; color:#94a3b8; }
//         .rpt-recent-list { display:flex; flex-direction:column; gap:8px; }
//         .rpt-recent-card { background:#fff; border-radius:12px; border:1px solid #e8ecf1; padding:14px 20px; display:flex; align-items:center; gap:14px; transition:box-shadow 0.2s; }
//         .rpt-recent-card:hover { box-shadow:0 4px 16px rgba(15,23,42,0.06); }
//         .rpt-recent-avatar { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; color:#fff; flex-shrink:0; }
//         .rpt-recent-name { font-size:13px; font-weight:600; color:#0f172a; margin:0; }
//         .rpt-recent-detail { font-size:11px; color:#94a3b8; margin:2px 0 0 0; }
//         .rpt-recent-package { font-size:14px; font-weight:700; color:#065f46; margin:0; }
//         .rpt-recent-date { font-size:11px; color:#94a3b8; margin:2px 0 0 0; }
//         .rpt-recent-badge { font-size:10px; font-weight:700; color:#065f46; background:#ecfdf5; padding:4px 12px; border-radius:100px; border:1px solid #a7f3d0; white-space:nowrap; flex-shrink:0; }
//         .rpt-empty-state { background:#fff; border-radius:14px; border:1px solid #e8ecf1; padding:60px 24px; text-align:center; }
//         .rpt-empty-icon { width:72px; height:72px; border-radius:50%; background:linear-gradient(135deg,#f1f5f9,#e2e8f0); display:flex; align-items:center; justify-content:center; margin:0 auto 20px; font-size:30px; }
//         .rpt-empty-title { font-size:20px; font-weight:700; color:#0f172a; margin:0 0 6px 0; }
//         .rpt-empty-text { font-size:13px; color:#94a3b8; margin:0; }
//         .rpt-loading-skeleton { display:flex; flex-direction:column; gap:20px; }
//         .rpt-skeleton-block { background:#fff; border-radius:14px; border:1px solid #e8ecf1; padding:24px; }
//         .rpt-skeleton-line { height:14px; background:#f1f5f9; border-radius:4px; }
//         @media (max-width:900px) {
//           .rpt-content-area { padding:20px 16px!important; }
//           .rpt-stats-grid,.rpt-dual-panel,.rpt-summary-row { grid-template-columns:repeat(2,1fr)!important; }
//           .rpt-dept-grid { grid-template-columns:1fr!important; }
//         }
//         @media (max-width:600px) {
//           .rpt-stats-grid,.rpt-summary-row { grid-template-columns:1fr!important; }
//           .rpt-filter-tabs { flex-wrap:wrap; }
//           .rpt-top-actions { flex-wrap:wrap; }
//           .rpt-export-btn { width:100%; justify-content:center; }
//           .rpt-company-row { flex-wrap:wrap; gap:10px; }
//         }
//       `}</style>
//     </div>
//   );
// }

// // ══════════════════════════════════════════
// // LOADING SKELETON
// // ══════════════════════════════════════════
// function LoadingSkeleton() {
//   return (
//     <div className="rpt-loading-skeleton">
//       {[1, 2, 3, 4].map((i) => (
//         <div key={i} className="rpt-skeleton-block" style={{ animation: `rptPulse 1.5s ease-in-out infinite ${i * 0.15}s` }}>
//           <div className="rpt-skeleton-line" style={{ width: "40%", marginBottom: "16px" }} />
//           <div style={{ display: "flex", gap: "12px" }}>
//             {[1, 2, 3].map((j) => (
//               <div key={j} style={{ flex: 1, height: "120px", background: "#f1f5f9", borderRadius: "10px" }} />
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


import { useEffect, useState, useMemo } from "react";
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
      <span className="toast-icon">
        {toast.type === "success" ? "✓" : "✕"}
      </span>
      <span className="toast-msg">{toast.message}</span>
      <button className="toast-close" onClick={onClose}>
        ✕
      </button>
    </div>
  );
}

// ══════════════════════════════════════════
// DONUT CHART (SVG)
// ══════════════════════════════════════════
function DonutChart({ segments, size = 150, strokeWidth = 22 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  if (total === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
        </svg>
        <span style={{ fontSize: "11px", color: "#94a3b8" }}>No data</span>
      </div>
    );
  }

  let offset = 0;
  const arcs = segments.map((seg) => {
    const pct = seg.value / total;
    const dashArray = `${pct * circumference} ${(1 - pct) * circumference}`;
    const dashOffset = -offset * circumference;
    offset += pct;
    return { ...seg, dashArray, dashOffset, pct };
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "24px",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          transform: "rotate(-90deg)",
          flexShrink: 0,
        }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeDasharray={arc.dashArray}
            strokeDashoffset={arc.dashOffset}
            strokeLinecap="butt"
            style={{
              transition: "stroke-dasharray 1s ease, stroke-dashoffset 1s ease",
            }}
          />
        ))}
      </svg>
      <div>
        <div
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1,
            letterSpacing: "-0.025em",
          }}
        >
          {total}
        </div>
        <div
          style={{
            fontSize: "11px",
            color: "#94a3b8",
            fontWeight: 600,
            marginTop: "4px",
          }}
        >
          TOTAL PLACED
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            marginTop: "10px",
          }}
        >
          {arcs.map((arc, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "2px",
                  background: arc.color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                  fontWeight: 500,
                }}
              >
                {arc.label}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "#334155",
                  fontWeight: 700,
                  marginLeft: "auto",
                }}
              >
                {arc.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// STAT RING
// ══════════════════════════════════════════
function StatRing({
  value,
  label,
  color,
  size = 72,
  strokeWidth = 6,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Number(value) || 0, 100);
  const dashArray = `${(pct / 100) * circumference} ${circumference}`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <span
        style={{
          fontSize: "16px",
          fontWeight: 800,
          color: "#0f172a",
          lineHeight: 1,
          marginTop: `-${size / 2 + 10}px`,
        }}
      >
        {value}%
      </span>
      <span
        style={{
          fontSize: "10px",
          fontWeight: 600,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginTop: "10px",
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ══════════════════════════════════════════
// HORIZONTAL BAR CHART
// ══════════════════════════════════════════
function HBarChart({ data, maxVal, colorFn }) {
  if (!data.length)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "30px",
          color: "#94a3b8",
          fontSize: "13px",
        }}
      >
        No data available
      </div>
    );

  return (
    <div>
      {data.map((d, i) => {
        const pct = maxVal > 0 ? Math.round((d.value / maxVal) * 100) : 0;
        const color = colorFn ? colorFn(i) : "#6366f1";
        return (
          <div key={i} style={{ marginBottom: "14px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "7px",
                    background: `${color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: 700,
                    color,
                    flexShrink: 0,
                  }}
                >
                  {d.label[0]}
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#334155",
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "180px",
                  }}
                >
                  {d.label}
                </span>
              </div>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color,
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                {d.value}
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: "10px",
                background: "#f1f5f9",
                borderRadius: "100px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${color}, ${color}aa)`,
                  borderRadius: "100px",
                  transition: "width 1s cubic-bezier(0.22,1,0.36,1)",
                  minWidth: d.value > 0 ? "4px" : "0",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════
// MINI BAR
// ══════════════════════════════════════════
function MiniBar({ value, max, color, label, count }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: "12px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "5px",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#334155",
            lineHeight: 1,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color,
            lineHeight: 1,
          }}
        >
          {count}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: "8px",
          background: "#f1f5f9",
          borderRadius: "100px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: "100px",
            transition: "width 0.8s ease",
          }}
        />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// COMPANY TABLE ROW
// ══════════════════════════════════════════
function CompanyRow({ company, index, maxPlaced, gradients }) {
  const pct =
    maxPlaced > 0 ? Math.round((company.placed / maxPlaced) * 100) : 0;
  const grad = gradients[index % gradients.length];
  const avgPkg =
    company.totalPackage > 0 && company.placed > 0
      ? (company.totalPackage / company.placed).toFixed(1)
      : "—";

  return (
    <div className="rpt-company-row">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flex: "1.2",
          minWidth: 0,
        }}
      >
        <div
          className="rpt-company-avatar"
          style={{ background: grad }}
        >
          {(company.name || "U")[0].toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <p className="rpt-company-name">{company.name}</p>
          <p className="rpt-company-meta">{company.industry || "—"}</p>
        </div>
      </div>
      <div className="rpt-company-stat">
        <span className="rpt-company-stat-val">{company.placed}</span>
        <span className="rpt-company-stat-label">Placed</span>
      </div>
      <div className="rpt-company-stat">
        <span className="rpt-company-stat-val">₹{avgPkg}</span>
        <span className="rpt-company-stat-label">Avg CTC (LPA)</span>
      </div>
      <div style={{ flex: 1.5, minWidth: "120px" }}>
        <div
          style={{
            width: "100%",
            height: "8px",
            background: "#f1f5f9",
            borderRadius: "100px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              background: grad,
              borderRadius: "100px",
              transition: "width 0.8s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// DEPARTMENT CARD
// ══════════════════════════════════════════
function DeptCard({ dept, index, colors }) {
  const pct =
    dept.total > 0 ? ((dept.placed / dept.total) * 100).toFixed(1) : 0;
  const color = colors[index % colors.length];

  return (
    <div className="rpt-dept-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "12px",
        }}
      >
        <div>
          <p className="rpt-dept-name">{dept.name}</p>
          <p className="rpt-dept-total">{dept.total} students</p>
        </div>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: `${color}10`,
            border: `1px solid ${color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            fontWeight: 800,
            color,
            flexShrink: 0,
          }}
        >
          {dept.placed}
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "6px",
          background: "#f1f5f9",
          borderRadius: "100px",
          overflow: "hidden",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: "100px",
            transition: "width 1s ease",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span className="rpt-dept-pct" style={{ color }}>
          {pct}% placed
        </span>
        <span className="rpt-dept-unplaced">
          {dept.total - dept.placed} unplaced
        </span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// EMPTY STATE
// ══════════════════════════════════════════
function EmptyState({ icon, title, text }) {
  return (
    <div className="rpt-empty-state">
      <div className="rpt-empty-icon">{icon}</div>
      <h2 className="rpt-empty-title">{title}</h2>
      <p className="rpt-empty-text">{text}</p>
    </div>
  );
}

// ══════════════════════════════════════════
// LOADING SKELETON
// ══════════════════════════════════════════
function LoadingSkeleton() {
  return (
    <div className="rpt-loading-skeleton">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rpt-skeleton-block"
          style={{
            animation: `rptPulse 1.5s ease-in-out infinite ${i * 0.15}s`,
          }}
        >
          <div
            className="rpt-skeleton-line"
            style={{ width: "40%", marginBottom: "16px" }}
          />
          <div style={{ display: "flex", gap: "12px" }}>
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                style={{
                  flex: 1,
                  height: "120px",
                  background: "#f1f5f9",
                  borderRadius: "10px",
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════
// COLOR PALETTES
// ══════════════════════════════════════════
const PALETTE = [
  "#6366f1",
  "#0d9488",
  "#f59e0b",
  "#ef4444",
  "#0ea5e9",
  "#8b5cf6",
  "#ec4899",
  "#10b981",
  "#f97316",
  "#14b8a6",
];
const GRADIENTS = [
  "linear-gradient(135deg, #6366f1, #818cf8)",
  "linear-gradient(135deg, #0d9488, #14b8a6)",
  "linear-gradient(135deg, #f59e0b, #fbbf24)",
  "linear-gradient(135deg, #ef4444, #f87171)",
  "linear-gradient(135deg, #0ea5e9, #38bdf8)",
  "linear-gradient(135deg, #8b5cf6, #a78bfa)",
  "linear-gradient(135deg, #ec4899, #f472b6)",
  "linear-gradient(135deg, #10b981, #34d399)",
];

// ══════════════════════════════════════════
// DYNAMIC PACKAGE RANGE COMPUTATION
// ══════════════════════════════════════════
function computePackageRanges(packages) {
  if (!packages.length) return [];
  const min = Math.min(...packages);
  const max = Math.max(...packages);
  if (min === max)
    return [{ label: `₹${min} LPA`, count: packages.length, value: packages.length }];
  const range = max - min;
  let bucketSize;
  if (range <= 5) bucketSize = 1;
  else if (range <= 15) bucketSize = 3;
  else if (range <= 30) bucketSize = 5;
  else bucketSize = 10;
  const buckets = {};
  packages.forEach((p) => {
    const low = Math.floor(p / bucketSize) * bucketSize;
    const high = low + bucketSize;
    const key = `${low}-${high}`;
    buckets[key] = (buckets[key] || 0) + 1;
  });
  return Object.entries(buckets)
    .map(([range, count]) => ({ label: `₹${range} LPA`, count, value: count }))
    .sort((a, b) => {
      const aLow = parseInt(a.label.replace(/[^\d]/g, ""));
      const bLow = parseInt(b.label.replace(/[^\d]/g, ""));
      return aLow - bLow;
    });
}

// ══════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════
export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [rawData, setRawData] = useState({
    students: [],
    placementResults: [],
    jobs: [],
  });

  const getToken = () => localStorage.getItem("adminToken");
  const showToast = (message, type = "success") =>
    setToast({ message, type });

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_BASE}/reports`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const d = res.data || {};
      setRawData({
        students: Array.isArray(d.students) ? d.students : [],
        placementResults: Array.isArray(d.placementResults)
          ? d.placementResults
          : [],
        jobs: Array.isArray(d.jobs) ? d.jobs : [],
      });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reports");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  // ═══ ALL COMPUTED DYNAMICALLY ═══
  const computed = useMemo(() => {
    const { students, placementResults } = rawData;

    const placed = placementResults.filter(
      (r) => r.finalStatus === "Selected"
    );
    const placedStudentIds = new Set(
      placed
        .map(
          (r) => r.student?._id?.toString() || r.student?.toString()
        )
        .filter(Boolean)
    );
    const totalPlaced = placedStudentIds.size;
    const totalStudents = students.length;

    const companyIds = new Set();
    placed.forEach((r) => {
      const cid =
        r.job?.company?._id?.toString() ||
        r.job?.company?.toString() ||
        null;
      if (cid) companyIds.add(cid);
    });
    const totalCompanies = companyIds.size;

    const packages = placed
      .map((r) => {
        const p = r.job?.package || r.package || 0;
        return typeof p === "string" ? parseFloat(p) : p;
      })
      .filter((p) => p > 0);
    const avgPackage =
      packages.length > 0
        ? (
            packages.reduce((a, b) => a + b, 0) / packages.length
          ).toFixed(1)
        : "0";
    const maxPackage =
      packages.length > 0 ? Math.max(...packages) : 0;
    const minPackage =
      packages.length > 0 ? Math.min(...packages) : 0;

    const placementPercentage =
      totalStudents > 0
        ? ((totalPlaced / totalStudents) * 100).toFixed(1)
        : 0;

    // Company-wise
    const companyMap = {};
    placed.forEach((r) => {
      const c = r.job?.company || {};
      const name = c.companyName || c.name || "Unknown";
      const industry = c.industry || "—";
      const pkg = r.job?.package || r.package || 0;
      if (!companyMap[name])
        companyMap[name] = {
          name,
          industry,
          placed: 0,
          totalPackage: 0,
        };
      companyMap[name].placed++;
      companyMap[name].totalPackage +=
        typeof pkg === "string" ? parseFloat(pkg) || 0 : pkg || 0;
    });
    const companyWise = Object.values(companyMap).sort(
      (a, b) => b.placed - a.placed
    );
    const maxCompanyPlaced =
      companyWise.length > 0
        ? Math.max(...companyWise.map((c) => c.placed))
        : 0;

    // Department-wise
    const deptMap = {};
    students.forEach((s) => {
      const dept = s.department || "Unknown";
      if (!deptMap[dept])
        deptMap[dept] = { name: dept, total: 0, placed: 0 };
      deptMap[dept].total++;
    });
    placed.forEach((r) => {
      const sid =
        r.student?._id?.toString() || r.student?.toString();
      if (!sid) return;
      const student = students.find(
        (s) => s._id?.toString() === sid
      );
      const dept = student?.department || "Unknown";
      if (deptMap[dept]) deptMap[dept].placed++;
    });
    const departmentWise = Object.values(deptMap).sort((a, b) => {
      const aPct = a.total > 0 ? a.placed / a.total : 0;
      const bPct = b.total > 0 ? b.placed / b.total : 0;
      return bPct - aPct;
    });
    const maxDeptPlaced =
      departmentWise.length > 0
        ? Math.max(...departmentWise.map((d) => d.placed))
        : 0;

    const deptPercentages = departmentWise.map(
      (d) => (d.total > 0 ? (d.placed / d.total) * 100 : 0)
    );
    const bestDeptPct =
      deptPercentages.length > 0
        ? Math.max(...deptPercentages).toFixed(0)
        : 0;
    const lowestDeptPct =
      deptPercentages.length > 0
        ? Math.min(...deptPercentages).toFixed(0)
        : 0;

    // Package ranges
    const packageRanges = computePackageRanges(packages);
    const maxPkgRange =
      packageRanges.length > 0
        ? Math.max(...packageRanges.map((r) => r.count))
        : 0;

    // Yearly trend
    const yearMap = {};
    placed.forEach((r) => {
      const date = r.placedAt || r.createdAt || r.appliedAt;
      if (!date) return;
      const year = new Date(date).getFullYear();
      if (!yearMap[year])
        yearMap[year] = { year: String(year), total: 0, placed: 0 };
      yearMap[year].placed++;
    });
    students.forEach((s) => {
      const yr =
        s.passingYear ||
        s.graduationYear ||
        (s.createdAt
          ? new Date(s.createdAt).getFullYear()
          : null);
      if (!yr) return;
      const key = String(yr);
      if (!yearMap[key])
        yearMap[key] = { year: key, total: 0, placed: 0 };
      yearMap[key].total++;
    });
    Object.values(yearMap).forEach(
      (y) => {
        if (y.total < y.placed) y.total = y.placed;
      }
    );
    const yearlyTrend = Object.values(yearMap).sort((a, b) =>
      a.year.localeCompare(b.year)
    );
    const maxYearlyPlaced =
      yearlyTrend.length > 0
        ? Math.max(...yearlyTrend.map((y) => y.placed))
        : 0;

    // Recent placements
    const recentPlacements = placed
      .sort(
        (a, b) =>
          new Date(b.placedAt || b.createdAt || 0) -
          new Date(a.placedAt || a.createdAt || 0)
      )
      .slice(0, 20)
      .map((r) => {
        const s = r.student || {};
        const j = r.job || {};
        const c = j.company || {};
        return {
          studentName: s.name || "Unknown",
          department: s.department || "—",
          company: c.companyName || c.name || "—",
          package: j.package || r.package || null,
          date: r.placedAt || r.createdAt,
        };
      });

    const unplaced = totalStudents - totalPlaced;
    const donutSegments = [
      { label: "Placed", value: totalPlaced, color: "#10b981" },
      {
        label: "Unplaced",
        value: unplaced > 0 ? unplaced : 0,
        color: "#e2e8f0",
      },
    ];

    return {
      totalStudents,
      totalPlaced,
      totalCompanies,
      avgPackage,
      maxPackage,
      minPackage,
      placementPercentage,
      companyWise,
      maxCompanyPlaced,
      departmentWise,
      maxDeptPlaced,
      bestDeptPct,
      lowestDeptPct,
      packageRanges,
      maxPkgRange,
      yearlyTrend,
      maxYearlyPlaced,
      recentPlacements,
      donutSegments,
      unplaced,
    };
  }, [rawData]);

  // ═══ EXPORT CSV ═══
  const handleExport = () => {
    try {
      let csv = "Placement Report\n";
      csv += `Generated,${new Date().toLocaleString()}\n\n`;
      csv += `Total Students,${computed.totalStudents}\n`;
      csv += `Total Placed,${computed.totalPlaced}\n`;
      csv += `Placement %,${computed.placementPercentage}%\n`;
      csv += `Companies Participated,${computed.totalCompanies}\n`;
      csv += `Average Package,${computed.avgPackage} LPA\n`;
      csv += `Highest Package,${computed.maxPackage} LPA\n`;
      csv += `Lowest Package,${computed.minPackage} LPA\n\n`;
      csv +=
        "Department,Total,Placed,Unplaced,Placement %\n";
      computed.departmentWise.forEach((d) => {
        const pct =
          d.total > 0
            ? ((d.placed / d.total) * 100).toFixed(1)
            : 0;
        csv += `${d.name},${d.total},${d.placed},${
          d.total - d.placed
        },${pct}%\n`;
      });
      csv += "\nCompany,Placed,Avg CTC (LPA)\n";
      computed.companyWise.forEach((c) => {
        const avg =
          c.totalPackage > 0 && c.placed > 0
            ? (c.totalPackage / c.placed).toFixed(1)
            : "N/A";
        csv += `${c.name},${c.placed},${avg}\n`;
      });
      if (computed.yearlyTrend.length) {
        csv += "\nYear,Total Students,Placed,Placement %\n";
        computed.yearlyTrend.forEach((y) => {
          const pct =
            y.total > 0
              ? ((y.placed / y.total) * 100).toFixed(1)
              : 0;
          csv += `${y.year},${y.total},${y.placed},${pct}%\n`;
        });
      }
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `placement-report-${new Date()
        .toISOString()
        .split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Report exported successfully!");
    } catch (err) {
      showToast("Export failed", "error");
    }
  };

  const topStats = [
    {
      label: "Total Students",
      display: computed.totalStudents,
      accentColor: "#6366f1",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6366f1"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "Total Placed",
      display: computed.totalPlaced,
      accentColor: "#10b981",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: "Companies Visited",
      display: computed.totalCompanies,
      accentColor: "#f59e0b",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
    },
    {
      label: "Avg Package",
      display: `₹${computed.avgPackage} LPA`,
      accentColor: "#0ea5e9",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="dashboard-container">
      <Toast toast={toast} onClose={() => setToast(null)} />

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
          <li>
            <Link to="/admin/approve-jobs">📄 Approve Jobs</Link>
          </li>
          <li>
            <Link to="/admin/applications">📬 Applications</Link>
          </li>
          <li>
            <Link to="/admin/placement-results">
              🏆 Results
            </Link>
          </li>
          <li className="active">
            <span>📈 Reports</span>
          </li>
        </ul>
      </aside>

      <main className="main-content rpt-main-content">
        <header className="top-nav rpt-top-nav">
          <div>
            <h1>
              <b>📈 Placement Reports</b>
            </h1>
            <p className="rpt-subtitle">
              Live analytics from {computed.totalStudents}{" "}
              students and {computed.totalPlaced} placements
            </p>
          </div>
          <div className="rpt-top-actions">
            <button
              className="rpt-refresh-btn"
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
                  refreshing
                    ? {
                        animation:
                          "rptSpin 0.8s linear infinite",
                      }
                    : {}
                }
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Refresh
            </button>
            <button
              className="rpt-export-btn"
              onClick={handleExport}
              disabled={computed.totalStudents === 0}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export CSV
            </button>
          </div>
        </header>

        <div className="rpt-content-area">
          {/* Stats */}
          <div className="rpt-stats-grid">
            {topStats.map((s) => (
              <div key={s.label} className="rpt-stat-card">
                <div
                  className="rpt-stat-icon"
                  style={{
                    background: `${s.accentColor}0D`,
                    border: `1px solid ${s.accentColor}1A`,
                  }}
                >
                  {s.icon}
                </div>
                <div className="rpt-stat-content">
                  <span className="rpt-stat-label">
                    {s.label}
                  </span>
                  <span className="rpt-stat-value">
                    {s.display}
                  </span>
                </div>
                <div
                  className="rpt-stat-accent"
                  style={{
                    background: `${s.accentColor}40`,
                  }}
                />
              </div>
            ))}
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="ms-error">
              <span>⚠️ {error}</span>
              <button onClick={handleRefresh}>Retry</button>
            </div>
          ) : computed.totalStudents === 0 ? (
            <EmptyState
              icon="📭"
              title="No student data yet"
              text="Reports will generate automatically as students register and get placed."
            />
          ) : (
            <>
              {/* Donut + Package */}
              <div className="rpt-dual-panel">
                <div className="rpt-panel">
                  <div className="rpt-panel-header">
                    <h3 className="rpt-panel-title">
                      Placement Overview
                    </h3>
                    <span
                      className="rpt-panel-badge"
                      style={{
                        background: "#ecfdf5",
                        color: "#065f46",
                        borderColor: "#a7f3d0",
                      }}
                    >
                      {computed.placementPercentage}%
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "20px 0",
                      gap: "32px",
                    }}
                  >
                    <DonutChart
                      segments={computed.donutSegments}
                      size={150}
                      strokeWidth={22}
                    />
                  </div>
                  {computed.departmentWise.length > 1 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "28px",
                        paddingTop: "12px",
                        borderTop: "1px solid #f1f5f9",
                      }}
                    >
                      <StatRing
                        value={computed.placementPercentage}
                        label="Overall"
                        color="#10b981"
                      />
                      <StatRing
                        value={computed.bestDeptPct}
                        label="Best Dept"
                        color="#6366f1"
                      />
                      <StatRing
                        value={computed.lowestDeptPct}
                        label="Lowest Dept"
                        color="#f59e0b"
                      />
                    </div>
                  )}
                </div>

                <div className="rpt-panel">
                  <div className="rpt-panel-header">
                    <h3 className="rpt-panel-title">
                      Package Distribution
                    </h3>
                    {computed.maxPackage > 0 && (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#64748b",
                        }}
                      >
                        ₹{computed.minPackage} – ₹
                        {computed.maxPackage} LPA
                      </span>
                    )}
                  </div>
                  <div style={{ padding: "16px 0" }}>
                    {computed.packageRanges.length > 0 ? (
                      computed.packageRanges.map((range, i) => (
                        <MiniBar
                          key={i}
                          value={range.count}
                          max={computed.maxPkgRange}
                          color={PALETTE[i % PALETTE.length]}
                          label={range.label}
                          count={range.count}
                        />
                      ))
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "30px 0",
                          color: "#94a3b8",
                          fontSize: "13px",
                        }}
                      >
                        No package data available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="rpt-filter-tabs">
                {[
                  {
                    key: "overview",
                    label: "Overview",
                    icon: "📊",
                  },
                  {
                    key: "company",
                    label: "Company-wise",
                    icon: "🏢",
                  },
                  {
                    key: "department",
                    label: "Department-wise",
                    icon: "🎓",
                  },
                  ...(computed.yearlyTrend.length > 0
                    ? [
                        {
                          key: "trend",
                          label: "Yearly Trend",
                          icon: "📈",
                        },
                      ]
                    : []),
                  ...(computed.recentPlacements.length > 0
                    ? [
                        {
                          key: "recent",
                          label: "Recent Placements",
                          icon: "🕐",
                        },
                      ]
                    : []),
                ].map((tab) => (
                  <button
                    key={tab.key}
                    className={`rpt-filter-tab ${
                      activeTab === tab.key
                        ? "rpt-filter-active"
                        : ""
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB: Overview */}
              {activeTab === "overview" && (
                <div className="rpt-tab-content">
                  <div className="rpt-summary-row">
                    <div
                      className="rpt-summary-card"
                      style={{
                        borderLeftColor: "#10b981",
                      }}
                    >
                      <div
                        className="rpt-summary-icon"
                        style={{
                          background: "#ecfdf5",
                          color: "#065f46",
                        }}
                      >
                        ✓
                      </div>
                      <div>
                        <p className="rpt-summary-val">
                          {computed.totalPlaced}
                        </p>
                        <p className="rpt-summary-label">
                          Students Placed
                        </p>
                      </div>
                    </div>
                    <div
                      className="rpt-summary-card"
                      style={{
                        borderLeftColor: "#ef4444",
                      }}
                    >
                      <div
                        className="rpt-summary-icon"
                        style={{
                          background: "#fef2f2",
                          color: "#991b1b",
                        }}
                      >
                        ✕
                      </div>
                      <div>
                        <p className="rpt-summary-val">
                          {computed.unplaced}
                        </p>
                        <p className="rpt-summary-label">
                          Students Unplaced
                        </p>
                      </div>
                    </div>
                    <div
                      className="rpt-summary-card"
                      style={{
                        borderLeftColor: "#6366f1",
                      }}
                    >
                      <div
                        className="rpt-summary-icon"
                        style={{
                          background: "#eef2ff",
                          color: "#4f46e5",
                        }}
                      >
                        🏢
                      </div>
                      <div>
                        <p className="rpt-summary-val">
                          {computed.totalCompanies}
                        </p>
                        <p className="rpt-summary-label">
                          Companies Participated
                        </p>
                      </div>
                    </div>
                    <div
                      className="rpt-summary-card"
                      style={{
                        borderLeftColor: "#0ea5e9",
                      }}
                    >
                      <div
                        className="rpt-summary-icon"
                        style={{
                          background: "#f0f9ff",
                          color: "#0369a1",
                        }}
                      >
                        💰
                      </div>
                      <div>
                        <p className="rpt-summary-val">
                          ₹{computed.avgPackage} LPA
                        </p>
                        <p className="rpt-summary-label">
                          Average Package
                        </p>
                      </div>
                    </div>
                  </div>

                  {computed.companyWise.length > 0 && (
                    <div
                      className="rpt-panel"
                      style={{ marginTop: "20px" }}
                    >
                      <div className="rpt-panel-header">
                        <h3 className="rpt-panel-title">
                          Top Companies by Hiring
                        </h3>
                        <button
                          className="rpt-view-all-btn"
                          onClick={() =>
                            setActiveTab("company")
                          }
                        >
                          View All →
                        </button>
                      </div>
                      <div style={{ padding: "8px 0" }}>
                        <HBarChart
                          data={computed.companyWise
                            .slice(0, 6)
                            .map((c) => ({
                              label: c.name,
                              value: c.placed,
                            }))}
                          maxVal={computed.maxCompanyPlaced}
                          colorFn={(i) =>
                            PALETTE[i % PALETTE.length]
                          }
                        />
                      </div>
                    </div>
                  )}

                  {computed.departmentWise.length > 0 && (
                    <div
                      className="rpt-panel"
                      style={{ marginTop: "20px" }}
                    >
                      <div className="rpt-panel-header">
                        <h3 className="rpt-panel-title">
                          Department Performance
                        </h3>
                        <button
                          className="rpt-view-all-btn"
                          onClick={() =>
                            setActiveTab("department")
                          }
                        >
                          View All →
                        </button>
                      </div>
                      <div style={{ padding: "8px 0" }}>
                        <HBarChart
                          data={computed.departmentWise
                            .slice(0, 6)
                            .map((d) => ({
                              label: d.name,
                              value: d.placed,
                            }))}
                          maxVal={computed.maxDeptPlaced}
                          colorFn={(i) =>
                            PALETTE[i % PALETTE.length]
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: Company-wise */}
              {activeTab === "company" && (
                <div className="rpt-tab-content">
                  {computed.companyWise.length > 0 ? (
                    <div className="rpt-company-table">
                      <div className="rpt-company-header">
                        <span style={{ flex: "1.2" }}>
                          Company
                        </span>
                        <span
                          style={{
                            width: "80px",
                            textAlign: "center",
                          }}
                        >
                          Placed
                        </span>
                        <span
                          style={{
                            width: "120px",
                            textAlign: "center",
                          }}
                        >
                          Avg CTC
                        </span>
                        <span style={{ flex: "1.5" }}>
                          Hiring Share
                        </span>
                      </div>
                      {computed.companyWise.map(
                        (company, i) => (
                          <CompanyRow
                            key={company.name}
                            company={company}
                            index={i}
                            maxPlaced={
                              computed.maxCompanyPlaced
                            }
                            gradients={GRADIENTS}
                          />
                        )
                      )}
                    </div>
                  ) : (
                    <EmptyState
                      icon="🏢"
                      title="No company data yet"
                      text="Company data will appear once students start getting placed."
                    />
                  )}
                </div>
              )}

              {/* TAB: Department-wise */}
              {activeTab === "department" && (
                <div className="rpt-tab-content">
                  {computed.departmentWise.length > 0 ? (
                    <div className="rpt-dept-grid">
                      {computed.departmentWise.map(
                        (dept, i) => (
                          <DeptCard
                            key={dept.name}
                            dept={dept}
                            index={i}
                            colors={PALETTE}
                          />
                        )
                      )}
                    </div>
                  ) : (
                    <EmptyState
                      icon="🎓"
                      title="No department data yet"
                      text="Students need department info for this report."
                    />
                  )}
                </div>
              )}

              {/* TAB: Yearly Trend */}
              {activeTab === "trend" && (
                <div className="rpt-tab-content">
                  {computed.yearlyTrend.length > 0 ? (
                    <div className="rpt-panel">
                      <div className="rpt-panel-header">
                        <h3 className="rpt-panel-title">
                          Year-wise Placement Trend
                        </h3>
                      </div>
                      <div style={{ padding: "20px 0" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-end",
                            gap: "8px",
                            height: "200px",
                            marginBottom: "12px",
                          }}
                        >
                          {computed.yearlyTrend.map((y, i) => {
                            const pct =
                              computed.maxYearlyPlaced > 0
                                ? (y.placed /
                                    computed
                                      .maxYearlyPlaced) *
                                  100
                                : 0;
                            const placementPct =
                              y.total > 0
                                ? (
                                    (y.placed / y.total) *
                                    100
                                  ).toFixed(0)
                                : 0;
                            const color =
                              PALETTE[i % PALETTE.length];
                            return (
                              <div
                                key={y.year}
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: "6px",
                                  height: "100%",
                                  justifyContent:
                                    "flex-end",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    color: "#0f172a",
                                  }}
                                >
                                  {y.placed}
                                </span>
                                <span
                                  style={{
                                    fontSize: "9px",
                                    color: "#64748b",
                                  }}
                                >
                                  ({placementPct}%)
                                </span>
                                <div
                                  style={{
                                    width: "100%",
                                    maxWidth: "52px",
                                    height: `${pct}%`,
                                    minHeight: "4px",
                                    background: `linear-gradient(180deg, ${color}, ${color}88)`,
                                    borderRadius:
                                      "6px 6px 2px 2px",
                                    transition:
                                      "height 1s ease",
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                          }}
                        >
                          {computed.yearlyTrend.map((y) => (
                            <div
                              key={y.year}
                              style={{
                                flex: 1,
                                textAlign: "center",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  color: "#64748b",
                                }}
                              >
                                {y.year}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div
                        style={{
                          borderTop: "1px solid #f1f5f9",
                          paddingTop: "16px",
                          marginTop: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "1fr 1fr 1fr 1fr",
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#94a3b8",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            paddingBottom: "10px",
                            borderBottom:
                              "1px solid #f1f5f9",
                          }}
                        >
                          <span>Year</span>
                          <span
                            style={{ textAlign: "center" }}
                          >
                            Total
                          </span>
                          <span
                            style={{ textAlign: "center" }}
                          >
                            Placed
                          </span>
                          <span
                            style={{ textAlign: "center" }}
                          >
                            %
                          </span>
                        </div>
                        {computed.yearlyTrend.map((y) => {
                          const pct =
                            y.total > 0
                              ? y.placed / y.total
                              : 0;
                          return (
                            <div
                              key={y.year}
                              style={{
                                display: "grid",
                                gridTemplateColumns:
                                  "1fr 1fr 1fr 1fr",
                                fontSize: "13px",
                                padding: "10px 0",
                                borderBottom:
                                  "1px solid #f8fafc",
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: 600,
                                  color: "#0f172a",
                                }}
                              >
                                {y.year}
                              </span>
                              <span
                                style={{
                                  textAlign: "center",
                                  color: "#64748b",
                                }}
                              >
                                {y.total}
                              </span>
                              <span
                                style={{
                                  textAlign: "center",
                                  fontWeight: 600,
                                  color: "#10b981",
                                }}
                              >
                                {y.placed}
                              </span>
                              <span
                                style={{
                                  textAlign: "center",
                                }}
                              >
                                <span
                                  style={{
                                    padding:
                                      "2px 10px",
                                    borderRadius:
                                      "100px",
                                    fontSize:
                                      "11px",
                                    fontWeight: 700,
                                    background:
                                      pct >= 0.8
                                        ? "#ecfdf5"
                                        : pct >=
                                          0.5
                                          ? "#fffbeb"
                                          : "#fef2f2",
                                    color:
                                      pct >= 0.8
                                        ? "#065f46"
                                        : pct >=
                                          0.5
                                          ? "#92400e"
                                          : "#991b1b",
                                  }}
                                >
                                  {(pct * 100).toFixed(
                                    1
                                  )}
                                  %
                                </span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <EmptyState
                      icon="📈"
                      title="No yearly data"
                      text="Yearly trends appear as placement data accumulates over time."
                    />
                  )}
                </div>
              )}

              {/* TAB: Recent Placements */}
              {activeTab === "recent" && (
                <div className="rpt-tab-content">
                  {computed.recentPlacements.length > 0 ? (
                    <div className="rpt-recent-list">
                      {computed.recentPlacements.map(
                        (p, i) => {
                          const grad =
                            GRADIENTS[i % GRADIENTS.length];
                          const name =
                            p.studentName || "Unknown";
                          const initials = name
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();
                          return (
                            <div
                              key={i}
                              className="rpt-recent-card"
                            >
                              <div
                                className="rpt-recent-avatar"
                                style={{
                                  background: grad,
                                }}
                              >
                                {initials}
                              </div>
                              <div
                                style={{
                                  flex: 1,
                                  minWidth: 0,
                                }}
                              >
                                <p className="rpt-recent-name">
                                  {name}
                                </p>
                                <p className="rpt-recent-detail">
                                  {p.department} •{" "}
                                  {p.company}
                                </p>
                              </div>
                              <div
                                style={{
                                  textAlign: "right",
                                  flexShrink: 0,
                                }}
                              >
                                <p className="rpt-recent-package">
                                  {p.package
                                    ? `₹${p.package} LPA`
                                    : "—"}
                                </p>
                                <p className="rpt-recent-date">
                                  {formatDate(p.date)}
                                </p>
                              </div>
                              <span className="rpt-recent-badge">
                                Placed
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <EmptyState
                      icon="🕐"
                      title="No recent placements"
                      text="Recently placed students will appear here."
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <style>{`
        @keyframes rptSpin { to { transform: rotate(360deg); } }
        @keyframes rptPulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes rptFadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

        .rpt-main-content { display:flex!important; flex-direction:column; overflow:hidden; }
        .rpt-top-nav { flex-wrap:wrap; gap:12px; }
        .rpt-subtitle { font-size:12px; color:#94a3b8; margin:3px 0 0 0; }
        .rpt-top-actions { display:flex; align-items:center; gap:10px; }
        .rpt-refresh-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:8px; font-size:13px; font-weight:500; color:#475569; background:#f1f5f9; border:1px solid #e2e8f0; cursor:pointer; }
        .rpt-refresh-btn:disabled { opacity:0.5; cursor:wait; }
        .rpt-export-btn { display:inline-flex; align-items:center; gap:6px; padding:9px 22px; border-radius:8px; font-size:13px; font-weight:600; color:#fff; background:linear-gradient(135deg,#6366f1,#818cf8); border:none; cursor:pointer; box-shadow:0 2px 10px rgba(99,102,241,0.3); transition:all 0.15s; }
        .rpt-export-btn:hover:not(:disabled) { box-shadow:0 4px 16px rgba(99,102,241,0.4); transform:translateY(-1px); }
        .rpt-export-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .rpt-content-area { flex:1; overflow-y:auto; padding:28px 32px; }

        .rpt-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; }
        .rpt-stat-card { position:relative; background:#fff; border-radius:12px; border:1px solid #e8ecf1; padding:20px; display:flex; align-items:flex-start; gap:14px; overflow:hidden; transition:border-color 0.2s,box-shadow 0.2s; }
        .rpt-stat-card:hover { border-color:#cbd5e1; box-shadow:0 4px 16px rgba(15,23,42,0.06); }
        .rpt-stat-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .rpt-stat-content { flex:1; display:flex; flex-direction:column; gap:6px; }
        .rpt-stat-label { font-size:11px; font-weight:600; color:#94a3b8; letter-spacing:0.04em; text-transform:uppercase; line-height:1; }
        .rpt-stat-value { font-size:28px; font-weight:700; color:#0f172a; line-height:1; letter-spacing:-0.025em; }
        .rpt-stat-accent { position:absolute; bottom:0; left:0; right:0; height:2px; opacity:0; transition:opacity 0.2s; }
        .rpt-stat-card:hover .rpt-stat-accent { opacity:1; }

        .rpt-dual-panel { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; }
        .rpt-panel { background:#fff; border-radius:14px; border:1px solid #e8ecf1; padding:22px 24px; }
        .rpt-panel-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
        .rpt-panel-title { font-size:15px; font-weight:700; color:#0f172a; margin:0; }
        .rpt-panel-badge { font-size:12px; font-weight:700; padding:4px 14px; border-radius:100px; border:1px solid; }
        .rpt-view-all-btn { font-size:12px; font-weight:600; color:#6366f1; background:none; border:none; cursor:pointer; padding:4px 0; }
        .rpt-view-all-btn:hover { color:#4f46e5; }

        .rpt-filter-tabs { display:flex; gap:6px; margin-bottom:20px; background:#fff; border-radius:12px; border:1px solid #e8ecf1; padding:6px; }
        .rpt-filter-tab { display:inline-flex; align-items:center; gap:6px; padding:9px 16px; border-radius:8px; border:1px solid transparent; background:transparent; font-size:12px; font-weight:600; color:#64748b; cursor:pointer; transition:all 0.15s; }
        .rpt-filter-tab:hover { background:#f1f5f9; }
        .rpt-filter-active { background:#6366f1; color:#fff; border-color:#6366f1; }
        .rpt-filter-active:hover { background:#4f46e5; color:#fff; }
        .rpt-tab-content { animation:rptFadeIn 0.3s ease; }

        .rpt-summary-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
        .rpt-summary-card { background:#fff; border-radius:12px; border:1px solid #e8ecf1; border-left:4px solid #e2e8f0; padding:18px 20px; display:flex; align-items:center; gap:14px; transition:box-shadow 0.2s; }
        .rpt-summary-card:hover { box-shadow:0 4px 16px rgba(15,23,42,0.06); }
        .rpt-summary-icon { width:42px; height:42px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:700; flex-shrink:0; }
        .rpt-summary-val { font-size:22px; font-weight:800; color:#0f172a; margin:0; line-height:1; }
        .rpt-summary-label { font-size:11px; font-weight:600; color:#94a3b8; margin:3px 0 0 0; }

        .rpt-company-table { background:#fff; border-radius:14px; border:1px solid #e8ecf1; overflow:hidden; }
        .rpt-company-header { display:flex; align-items:center; padding:14px 24px; background:#fafbfc; border-bottom:1px solid #f1f5f9; font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.04em; }
        .rpt-company-row { display:flex; align-items:center; padding:14px 24px; border-bottom:1px solid #f8fafc; transition:background 0.15s; }
        .rpt-company-row:hover { background:#fafbfc; }
        .rpt-company-row:last-child { border-bottom:none; }
        .rpt-company-avatar { width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; color:#fff; flex-shrink:0; }
        .rpt-company-name { font-size:13px; font-weight:600; color:#0f172a; margin:0; }
        .rpt-company-meta { font-size:11px; color:#94a3b8; margin:2px 0 0 0; }
        .rpt-company-stat { display:flex; flex-direction:column; align-items:center; gap:2px; }
        .rpt-company-stat-val { font-size:14px; font-weight:700; color:#0f172a; line-height:1; }
        .rpt-company-stat-label { font-size:10px; color:#94a3b8; font-weight:500; }

        .rpt-dept-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:14px; }
        .rpt-dept-card { background:#fff; border-radius:12px; border:1px solid #e8ecf1; padding:20px; transition:box-shadow 0.2s; }
        .rpt-dept-card:hover { box-shadow:0 4px 16px rgba(15,23,42,0.06); }
        .rpt-dept-name { font-size:14px; font-weight:700; color:#0f172a; margin:0; }
        .rpt-dept-total { font-size:11px; color:#94a3b8; margin:2px 0 0 0; }
        .rpt-dept-pct { font-size:12px; font-weight:700; }
        .rpt-dept-unplaced { font-size:11px; color:#94a3b8; }

        .rpt-recent-list { display:flex; flex-direction:column; gap:8px; }
        .rpt-recent-card { background:#fff; border-radius:12px; border:1px solid #e8ecf1; padding:14px 20px; display:flex; align-items:center; gap:14px; transition:box-shadow 0.2s; }
        .rpt-recent-card:hover { box-shadow:0 4px 16px rgba(15,23,42,0.06); }
        .rpt-recent-avatar { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; color:#fff; flex-shrink:0; }
        .rpt-recent-name { font-size:13px; font-weight:600; color:#0f172a; margin:0; }
        .rpt-recent-detail { font-size:11px; color:#94a3b8; margin:2px 0 0 0; }
        .rpt-recent-package { font-size:14px; font-weight:700; color:#065f46; margin:0; }
        .rpt-recent-date { font-size:11px; color:#94a3b8; margin:2px 0 0 0; }
        .rpt-recent-badge { font-size:10px; font-weight:700; color:#065f46; background:#ecfdf5; padding:4px 12px; border-radius:100px; border:1px solid #a7f3d0; white-space:nowrap; flex-shrink:0; }

        .rpt-empty-state { background:#fff; border-radius:14px; border:1px solid #e8ecf1; padding:60px 24px; text-align:center; }
        .rpt-empty-icon { width:72px; height:72px; border-radius:50%; background:linear-gradient(135deg,#f1f5f9,#e2e8f0); display:flex; align-items:center; justify-content:center; margin:0 auto 20px; font-size:30px; }
        .rpt-empty-title { font-size:20px; font-weight:700; color:#0f172a; margin:0 0 6px 0; }
        .rpt-empty-text { font-size:13px; color:#94a3b8; margin:0; }

        .rpt-loading-skeleton { display:flex; flex-direction:column; gap:20px; }
        .rpt-skeleton-block { background:#fff; border-radius:14px; border:1px solid #e8ecf1; padding:24px; }
        .rpt-skeleton-line { height:14px; background:#f1f5f9; border-radius:4px; }

        @media (max-width:900px) {
          .rpt-content-area { padding:20px 16px!important; }
          .rpt-stats-grid,.rpt-dual-panel,.rpt-summary-row { grid-template-columns:repeat(2,1fr)!important; }
          .rpt-dept-grid { grid-template-columns:1fr!important; }
        }
        @media (max-width:600px) {
          .rpt-stats-grid,.rpt-summary-row { grid-template-columns:1fr!important; }
          .rpt-filter-tabs { flex-wrap:wrap; }
          .rpt-top-actions { flex-wrap:wrap; }
          .rpt-export-btn { width:100%; justify-content:center; }
          .rpt-company-row { flex-wrap:wrap; gap:10px; }
        }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// COMPANY REPORTS PAGE
// File: CompanyReports.jsx
// ══════════════════════════════════════════════════════
// import { useState, useEffect, useRef, useMemo } from "react";

// const formatTimeAgo = (dateStr) => {
//   if (!dateStr) return "N/A";
//   const now = new Date();
//   const date = new Date(dateStr);
//   const seconds = Math.floor((now - date) / 1000);
//   if (seconds < 60) return "Just now";
//   const minutes = Math.floor(seconds / 60);
//   if (minutes < 60) return `${minutes}m ago`;
//   const hours = Math.floor(minutes / 60);
//   if (hours < 24) return `${hours}h ago`;
//   const days = Math.floor(hours / 24);
//   if (days < 7) return `${days}d ago`;
//   return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
// };

// // ═══ CHART DRAWING (reuse from CompanyDashboard) ═══
// function drawDonut(canvas, data, colors, total, progress) {
//   if (!canvas) return;
//   const ctx = canvas.getContext("2d");
//   const dpr = window.devicePixelRatio || 1;
//   const size = 170;
//   canvas.width = size * dpr; canvas.height = size * dpr;
//   canvas.style.width = size + "px"; canvas.style.height = size + "px";
//   ctx.scale(dpr, dpr); ctx.clearRect(0, 0, size, size);
//   const cx = size / 2, cy = size / 2, outerR = 74, innerR = 50, spacing = 0.05;
//   let startAngle = -Math.PI / 2, accumulated = 0;
//   const maxAngle = Math.PI * 2 * progress;
//   data.forEach((val, i) => {
//     if (val === 0) { accumulated += spacing; return; }
//     const sweep = (val / total) * Math.PI * 2 - spacing;
//     const clamped = Math.max(0, Math.min(sweep, maxAngle - accumulated));
//     if (clamped <= 0) { accumulated += sweep + spacing; return; }
//     ctx.beginPath();
//     ctx.arc(cx, cy, outerR, startAngle, startAngle + clamped);
//     ctx.arc(cx, cy, innerR, startAngle + clamped, startAngle, true);
//     ctx.closePath(); ctx.fillStyle = colors[i]; ctx.fill();
//     startAngle += clamped + spacing; accumulated += sweep + spacing;
//   });
//   ctx.fillStyle = "#0f172a"; ctx.font = "bold 24px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
//   ctx.fillText(Math.round(total * progress), cx, cy - 4);
//   ctx.fillStyle = "#94a3b8"; ctx.font = "10px system-ui"; ctx.fillText("Total", cx, cy + 14);
// }

// function drawBar(canvas, labels, values, colors, progress) {
//   if (!canvas) return;
//   const ctx = canvas.getContext("2d");
//   const dpr = window.devicePixelRatio || 1;
//   const rect = canvas.parentElement.getBoundingClientRect();
//   const w = rect.width, h = 190;
//   canvas.width = w * dpr; canvas.height = h * dpr;
//   canvas.style.width = w + "px"; canvas.style.height = h + "px";
//   ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h);
//   const pad = { top: 16, right: 12, bottom: 36, left: 12 };
//   const cw = w - pad.left - pad.right, ch = h - pad.top - pad.bottom;
//   const maxVal = Math.max(...values, 1);
//   const n = labels.length;
//   const barW = Math.min(44, (cw / n) * 0.55);
//   const gap = (cw - barW * n) / (n + 1);
//   for (let i = 0; i <= 4; i++) {
//     const y = pad.top + (i / 4) * ch;
//     ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y);
//     ctx.strokeStyle = "rgba(0,0,0,0.04)"; ctx.lineWidth = 1; ctx.stroke();
//   }
//   labels.forEach((label, i) => {
//     const x = pad.left + gap * (i + 1) + barW * i;
//     const barH = (values[i] / maxVal) * ch * progress;
//     const y = pad.top + ch - barH;
//     const r = Math.min(5, barW / 2);
//     if (barH > r) {
//       ctx.beginPath(); ctx.moveTo(x, y + r);
//       ctx.arcTo(x, y, x + r, y, r); ctx.arcTo(x + barW, y, x + barW, y + r, r);
//       ctx.lineTo(x + barW, pad.top + ch); ctx.lineTo(x, pad.top + ch); ctx.closePath();
//     } else if (barH > 0) { ctx.beginPath(); ctx.rect(x, y, barW, barH); }
//     const grad = ctx.createLinearGradient(x, y, x, pad.top + ch);
//     grad.addColorStop(0, colors[i]); grad.addColorStop(1, colors[i] + "30");
//     ctx.fillStyle = grad; ctx.fill();
//     if (progress > 0.5) {
//       ctx.globalAlpha = Math.min(1, (progress - 0.5) * 4);
//       ctx.fillStyle = "#334155"; ctx.font = "bold 11px system-ui"; ctx.textAlign = "center";
//       ctx.fillText(values[i], x + barW / 2, y - 6); ctx.globalAlpha = 1;
//     }
//     ctx.fillStyle = "#94a3b8"; ctx.font = "9px system-ui"; ctx.textAlign = "center";
//     ctx.fillText(label, x + barW / 2, pad.top + ch + 18);
//   });
// }

// function drawLine(canvas, labels, datasets, progress) {
//   if (!canvas) return;
//   const ctx = canvas.getContext("2d");
//   const dpr = window.devicePixelRatio || 1;
//   const rect = canvas.parentElement.getBoundingClientRect();
//   const w = rect.width, h = 190;
//   canvas.width = w * dpr; canvas.height = h * dpr;
//   canvas.style.width = w + "px"; canvas.style.height = h + "px";
//   ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h);
//   const pad = { top: 14, right: 12, bottom: 28, left: 32 };
//   const cw = w - pad.left - pad.right, ch = h - pad.top - pad.bottom;
//   const n = labels.length;
//   const allVals = datasets.flatMap((d) => d.values);
//   const maxVal = Math.max(...allVals, 1);
//   for (let i = 0; i <= 4; i++) {
//     const y = pad.top + (i / 4) * ch;
//     ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y);
//     ctx.strokeStyle = "rgba(0,0,0,0.04)"; ctx.lineWidth = 1; ctx.stroke();
//     ctx.fillStyle = "#94a3b8"; ctx.font = "9px system-ui"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
//     ctx.fillText(Math.round(maxVal - (i / 4) * maxVal), pad.left - 6, y);
//   }
//   ctx.textAlign = "center"; ctx.textBaseline = "top";
//   labels.forEach((label, i) => {
//     const x = pad.left + (i / Math.max(n - 1, 1)) * cw;
//     ctx.fillStyle = "#94a3b8"; ctx.font = "9px system-ui"; ctx.fillText(label, x, pad.top + ch + 8);
//   });
//   datasets.forEach((ds) => {
//     const pts = ds.values.map((v, i) => ({
//       x: pad.left + (i / Math.max(n - 1, 1)) * cw,
//       y: pad.top + (1 - v / maxVal) * ch,
//     }));
//     const clipX = pad.left + cw * progress;
//     ctx.save(); ctx.beginPath(); ctx.rect(0, 0, clipX, h); ctx.clip();
//     const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
//     grad.addColorStop(0, ds.color + "15"); grad.addColorStop(1, ds.color + "00");
//     ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
//     for (let i = 1; i < pts.length; i++) {
//       const mx = (pts[i - 1].x + pts[i].x) / 2;
//       ctx.bezierCurveTo(mx, pts[i - 1].y, mx, pts[i].y, pts[i].x, pts[i].y);
//     }
//     ctx.lineTo(pts[pts.length - 1].x, pad.top + ch); ctx.lineTo(pts[0].x, pad.top + ch);
//     ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
//     ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
//     for (let i = 1; i < pts.length; i++) {
//       const mx = (pts[i - 1].x + pts[i].x) / 2;
//       ctx.bezierCurveTo(mx, pts[i - 1].y, mx, pts[i].y, pts[i].x, pts[i].y);
//     }
//     ctx.strokeStyle = ds.color; ctx.lineWidth = 2.5; ctx.stroke();
//     pts.forEach((p) => {
//       ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fillStyle = ds.color; ctx.fill();
//       ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2); ctx.fillStyle = "#fff"; ctx.fill();
//     });
//     ctx.restore();
//   });
// }

// // ═══ TOAST ═══
// function Toast({ toast, onClose }) {
//   useEffect(() => {
//     if (toast) { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }
//   }, [toast, onClose]);
//   if (!toast) return null;
//   const colors = { success: "bg-green-600", error: "bg-red-600", info: "bg-blue-600" };
//   const icons = { success: "✓", error: "✕", info: "ℹ" };
//   return (
//     <div className="fixed top-5 right-5 z-[999]" style={{ animation: "slideIn 0.3s ease-out" }}>
//       <div className={`${colors[toast.type] || colors.success} text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-[280px]`}>
//         <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">{icons[toast.type]}</span>
//         <span className="text-sm font-medium flex-1">{toast.message}</span>
//         <button onClick={onClose} className="text-white/70 hover:text-white text-lg leading-none">&times;</button>
//       </div>
//     </div>
//   );
// }

// // ═══ MAIN COMPONENT ═══
// export default function CompanyReports({ jobs, applications, interviews, showToast: externalToast }) {
//   const [toast, setToast] = useState(null);
//   const [filterJob, setFilterJob] = useState("All");
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [activeSection, setActiveSection] = useState("overview");

//   const donutRef = useRef(null);
//   const barRef = useRef(null);
//   const lineRef = useRef(null);
//   const animDone = useRef(false);

//   const showToast = externalToast || ((message, type = "success") => setToast({ message, type }));

//   // ═══ FILTERED DATA ═══
//   const filtered = useMemo(() => {
//     let apps = [...applications];
//     if (filterJob !== "All") apps = apps.filter((a) => a.job === filterJob);
//     if (filterStatus !== "All") apps = apps.filter((a) => a.status === filterStatus);
//     return apps;
//   }, [applications, filterJob, filterStatus]);

//   // ═══ COMPUTED STATS ═══
//   const stats = useMemo(() => {
//     const total = filtered.length;
//     const applied = filtered.filter((a) => a.status === "applied").length;
//     const shortlisted = filtered.filter((a) => a.status === "shortlisted").length;
//     const selected = filtered.filter((a) => a.status === "selected").length;
//     const rejected = filtered.filter((a) => a.status === "rejected").length;
//     const openJobs = jobs.filter((j) => j.status === "Open").length;
//     const closedJobs = jobs.filter((j) => j.status === "Closed").length;
//     const scheduledInts = interviews.filter((i) => i.status === "Scheduled").length;
//     const completedInts = interviews.filter((i) => i.status === "Completed").length;
//     const conversionRate = applied > 0 ? ((selected / applied) * 100).toFixed(1) : 0;
//     const interviewRate = shortlisted > 0 ? ((selected / shortlisted) * 100).toFixed(1) : 0;
//     return { total, applied, shortlisted, selected, rejected, openJobs, closedJobs, scheduledInts, completedInts, conversionRate, interviewRate };
//   }, [filtered, jobs, interviews]);

//   // ═══ CHART DATA ═══
//   const chartData = useMemo(() => {
//     const donutVals = [stats.applied, stats.shortlisted, stats.selected, stats.rejected];
//     const donutColors = ["#eab308", "#3b82f6", "#22c55e", "#ef4444"];
//     const donutTotal = donutVals.reduce((a, b) => a + b, 0) || 1;

//     // Job-wise applications
//     const jobMap = {};
//     filtered.forEach((a) => {
//       jobMap[a.job] = (jobMap[a.job] || 0) + 1;
//     });
//     const jobLabels = Object.keys(jobMap).map((l) => l.length > 18 ? l.slice(0, 16) + "…" : l);
//     const jobValues = Object.values(jobMap);
//     const jobColors = ["#6366f1", "#0d9488", "#f59e0b", "#ef4444", "#0ea5e9", "#8b5cf6", "#ec4899", "#10b981"];

//     // Weekly trend
//     const now = new Date();
//     const weekLabels = [], appliedPerWeek = [], selectedPerWeek = [];
//     for (let i = 5; i >= 0; i--) {
//       const start = new Date(now); start.setDate(start.getDate() - i * 7);
//       const end = new Date(start); end.setDate(end.getDate() + 7);
//       weekLabels.push(start.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
//       appliedPerWeek.push(filtered.filter((a) => {
//         const d = new Date(a.appliedAt || a.createdAt || 0);
//         return d >= start && d < end;
//       }).length);
//       selectedPerWeek.push(filtered.filter((a) => {
//         const d = new Date(a.appliedAt || a.createdAt || 0);
//         return d >= start && d < end && a.status === "selected";
//       }).length);
//     }

//     return { donutVals, donutColors, donutTotal, jobLabels, jobValues, jobColors, weekLabels, appliedPerWeek, selectedPerWeek };
//   }, [filtered, stats]);

//   // ═══ ANIMATE ═══
//   useEffect(() => {
//     if (filtered.length === 0) return;
//     if (animDone.current) return;
//     animDone.current = true;
//     let start = null;
//     function animate(ts) {
//       if (!start) start = ts;
//       const p = Math.min((ts - start) / 1200, 1);
//       const e = 1 - Math.pow(1 - p, 3);
//       drawDonut(donutRef.current, chartData.donutVals, chartData.donutColors, chartData.donutTotal, e);
//       drawBar(barRef.current, chartData.jobLabels, chartData.jobValues, chartData.jobColors, e);
//       drawLine(lineRef.current, chartData.weekLabels, [
//         { values: chartData.appliedPerWeek, color: "#3b82f6" },
//         { values: chartData.selectedPerWeek, color: "#22c55e" },
//       ], e);
//       if (p < 1) requestAnimationFrame(animate);
//     }
//     const timer = setTimeout(() => requestAnimationFrame(animate), 100);
//     const onResize = () => {
//       drawDonut(donutRef.current, chartData.donutVals, chartData.donutColors, chartData.donutTotal, 1);
//       drawBar(barRef.current, chartData.jobLabels, chartData.jobValues, chartData.jobColors, 1);
//       drawLine(lineRef.current, chartData.weekLabels, [
//         { values: chartData.appliedPerWeek, color: "#3b82f6" },
//         { values: chartData.selectedPerWeek, color: "#22c55e" },
//       ], 1);
//     };
//     window.addEventListener("resize", onResize);
//     return () => { clearTimeout(timer); window.removeEventListener("resize", onResize); animDone.current = false; };
//   }, [chartData, filtered.length]);

//   // ═══ JOB OPTIONS ═══
//   const jobOptions = useMemo(() => {
//     const uniqueJobs = [...new Set(applications.map((a) => a.job))].sort();
//     return ["All", ...uniqueJobs];
//   }, [applications]);

//   // ═══ EXPORT CSV ═══
//   const handleExport = () => {
//     try {
//       let csv = "Company Hiring Report\n";
//       csv += `Generated,${new Date().toLocaleString()}\n\n`;
//       csv += `Open Jobs,${stats.openJobs}\n`;
//       csv += `Closed Jobs,${stats.closedJobs}\n`;
//       csv += `Total Applications,${stats.total}\n`;
//       csv += `Shortlisted,${stats.shortlisted}\n`;
//       csv += `Selected,${stats.selected}\n`;
//       csv += `Rejected,${stats.rejected}\n`;
//       csv += `Scheduled Interviews,${stats.scheduledInts}\n`;
//       csv += `Completed Interviews,${stats.completedInts}\n`;
//       csv += `Conversion Rate,${stats.conversionRate}%\n`;
//       csv += `Interview-to-Selection,${stats.interviewRate}%\n\n`;
//       csv += "Candidate,Job,Status,Applied Date\n";
//       filtered.forEach((a) => {
//         csv += `"${a.name}","${a.job}","${a.status}","${a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : "N/A"}"\n`;
//       });
//       const blob = new Blob([csv], { type: "text/csv" });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `hiring-report-${new Date().toISOString().split("T")[0]}.csv`;
//       link.click();
//       URL.revokeObjectURL(url);
//       showToast("Report exported!");
//     } catch { showToast("Export failed", "error"); }
//   };

//   const statCards = [
//     { label: "Open Jobs", value: stats.openJobs, icon: "💼", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
//     { label: "Applications", value: stats.total, icon: "📋", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
//     { label: "Shortlisted", value: stats.shortlisted, icon: "⭐", bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700" },
//     { label: "Selected", value: stats.selected, icon: "✅", bg: "bg-green-50", border: "border-green-200", text: "text-green-700" },
//     { label: "Interviews", value: stats.scheduledInts, icon: "📅", bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700" },
//     { label: "Conversion", value: `${stats.conversionRate}%`, icon: "📈", bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-700" },
//   ];

//   const legendItems = [
//     { label: "Applied", color: "#eab308", count: stats.applied },
//     { label: "Shortlisted", color: "#3b82f6", count: stats.shortlisted },
//     { label: "Selected", color: "#22c55e", count: stats.selected },
//     { label: "Rejected", color: "#ef4444", count: stats.rejected },
//   ];

//   const sections = [
//     { key: "overview", label: "Overview", icon: "📊" },
//     { key: "jobs", label: "Job-wise", icon: "💼" },
//     { key: "trends", label: "Trends", icon: "📈" },
//     { key: "log", label: "Application Log", icon: "📋" },
//   ];

//   return (
//     <div className="text-black">
//       <Toast toast={toast} onClose={() => setToast(null)} />

//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">📊 Hiring Reports</h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Track your hiring pipeline, conversion rates, and job performance
//           </p>
//         </div>
//         <button
//           onClick={handleExport}
//           disabled={stats.total === 0}
//           className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:opacity-90 disabled:opacity-40 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition flex items-center gap-2"
//         >
//           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
//           Export CSV
//         </button>
//       </div>

//       {/* ═══ FILTERS ═══ */}
//       <div className="flex flex-wrap items-center gap-3 mb-5 p-4 rounded-xl border bg-white border-gray-200">
//         <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
//           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
//           Filters
//         </div>
//         <select
//           value={filterJob}
//           onChange={(e) => setFilterJob(e.target.value)}
//           className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
//         >
//           {jobOptions.map((j) => (
//             <option key={j} value={j}>{j === "All" ? "All Jobs" : j}</option>
//           ))}
//         </select>
//         <select
//           value={filterStatus}
//           onChange={(e) => setFilterStatus(e.target.value)}
//           className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
//         >
//           {["All", "applied", "shortlisted", "selected", "rejected"].map((s) => (
//             <option key={s} value={s}>{s === "All" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
//           ))}
//         </select>
//         {(filterJob !== "All" || filterStatus !== "All") && (
//           <button onClick={() => { setFilterJob("All"); setFilterStatus("All"); }} className="text-xs text-red-500 hover:underline font-medium">
//             Clear filters
//           </button>
//         )}
//       </div>

//       {/* ═══ STAT CARDS ═══ */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
//         {statCards.map((s) => (
//           <div key={s.label} className={`border rounded-xl p-4 transition hover:shadow-md ${s.bg} ${s.border} ${s.text}`}>
//             <div className="text-2xl mb-1">{s.icon}</div>
//             <div className="text-xl font-bold">{s.value}</div>
//             <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">{s.label}</div>
//           </div>
//         ))}
//       </div>

//       {stats.total === 0 ? (
//         <div className="text-center py-20 rounded-2xl border bg-white border-gray-200">
//           <div className="text-5xl mb-4">📭</div>
//           <h3 className="text-lg font-semibold text-gray-800 mb-1">No application data yet</h3>
//           <p className="text-sm text-gray-500">Reports will appear once students apply to your jobs.</p>
//         </div>
//       ) : (
//         <>
//           {/* ═══ SECTION TABS ═══ */}
//           <div className="flex gap-2 mb-5 p-1.5 rounded-xl border bg-white border-gray-200">
//             {sections.map((s) => (
//               <button
//                 key={s.key}
//                 onClick={() => setActiveSection(s.key)}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
//                   activeSection === s.key
//                     ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow"
//                     : "text-gray-500 hover:bg-gray-100"
//                 }`}
//               >
//                 <span>{s.icon}</span>{s.label}
//               </button>
//             ))}
//           </div>

//           {/* ═══ OVERVIEW ═══ */}
//           {activeSection === "overview" && (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="p-5 rounded-2xl border bg-white border-gray-200">
//                 <h2 className="font-semibold text-gray-800 mb-1">Application Pipeline</h2>
//                 <p className="text-xs text-gray-400 mb-4">Status distribution of all applications</p>
//                 <div className="flex justify-center"><canvas ref={donutRef} /></div>
//                 <div className="mt-4 space-y-2">
//                   {legendItems.map((item) => (
//                     <div key={item.label} className="flex items-center justify-between text-xs">
//                       <div className="flex items-center gap-2">
//                         <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
//                         <span className="text-gray-600">{item.label}</span>
//                       </div>
//                       <span className="font-bold text-gray-800">{item.count}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Funnel */}
//               <div className="p-5 rounded-2xl border bg-white border-gray-200">
//                 <h2 className="font-semibold text-gray-800 mb-1">Hiring Funnel</h2>
//                 <p className="text-xs text-gray-400 mb-4">Conversion at each stage</p>
//                 <div className="space-y-3">
//                   {[
//                     { label: "Applied", count: stats.applied, color: "#eab308", bg: "bg-yellow-50" },
//                     { label: "Shortlisted", count: stats.shortlisted, color: "#3b82f6", bg: "bg-blue-50" },
//                     { label: "Interviewed", count: stats.scheduledInts, color: "#8b5cf6", bg: "bg-purple-50" },
//                     { label: "Selected", count: stats.selected, color: "#22c55e", bg: "bg-green-50" },
//                   ].map((stage, i) => {
//                     const prevCount = i === 0 ? stats.applied : [stats.applied, stats.shortlisted, stats.scheduledInts][i - 1];
//                     const rate = prevCount > 0 ? ((stage.count / prevCount) * 100).toFixed(0) : 0;
//                     const widthPct = stats.applied > 0 ? (stage.count / stats.applied) * 100 : 0;
//                     return (
//                       <div key={stage.label}>
//                         <div className="flex items-center justify-between text-xs mb-1">
//                           <span className="font-medium text-gray-700">{stage.label}</span>
//                           <div className="flex items-center gap-2">
//                             <span className="font-bold text-gray-800">{stage.count}</span>
//                             <span className="text-gray-400">{i > 0 ? `${rate}%` : "100%"}</span>
//                           </div>
//                         </div>
//                         <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
//                           <div
//                             className={`h-8 ${stage.bg} rounded-lg flex items-center justify-end pr-3 transition-all duration-1000`}
//                             style={{ width: `${Math.max(widthPct, 8)}%` }}
//                           >
//                             <span className="text-[10px] font-bold" style={{ color: stage.color }}>{stage.count}</span>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//                 <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between text-xs">
//                   <span className="text-gray-500 font-medium">Overall Conversion Rate</span>
//                   <span className="font-bold text-gray-800 text-sm">{stats.conversionRate}%</span>
//                 </div>
//                 <div className="mt-2 p-3 bg-gray-50 rounded-lg flex items-center justify-between text-xs">
//                   <span className="text-gray-500 font-medium">Interview → Selection</span>
//                   <span className="font-bold text-gray-800 text-sm">{stats.interviewRate}%</span>
//                 </div>
//               </div>

//               {/* Quick stats row */}
//               <div className="lg:col-span-2 grid grid-cols-3 gap-4">
//                 <div className="p-4 rounded-xl border bg-white border-gray-200 text-center">
//                   <div className="text-3xl mb-2">💼</div>
//                   <div className="text-2xl font-bold text-gray-800">{stats.openJobs}</div>
//                   <div className="text-xs text-gray-500 font-medium">Open Positions</div>
//                 </div>
//                 <div className="p-4 rounded-xl border bg-white border-gray-200 text-center">
//                   <div className="text-3xl mb-2">📅</div>
//                   <div className="text-2xl font-bold text-gray-800">{stats.completedInts}</div>
//                   <div className="text-xs text-gray-500 font-medium">Interviews Done</div>
//                 </div>
//                 <div className="p-4 rounded-xl border bg-white border-gray-200 text-center">
//                   <div className="text-3xl mb-2">🚫</div>
//                   <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
//                   <div className="text-xs text-gray-500 font-medium">Rejections</div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ═══ JOB-WISE ═══ */}
//           {activeSection === "jobs" && (
//             <div className="p-5 rounded-2xl border bg-white border-gray-200">
//               <h2 className="font-semibold text-gray-800 mb-1">Applications by Job</h2>
//               <p className="text-xs text-gray-400 mb-4">Distribution across your job postings</p>
//               <div><canvas ref={barRef} /></div>
//               <div className="mt-4 flex justify-center gap-4 flex-wrap">
//                 {chartData.jobLabels.map((label, i) => (
//                   <div key={label} className="flex items-center gap-1.5 text-xs">
//                     <span className="w-2.5 h-2.5 rounded-full" style={{ background: chartData.jobColors[i] }} />
//                     <span className="text-gray-600">{label}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* ═══ TRENDS ═══ */}
//           {activeSection === "trends" && (
//             <div className="p-5 rounded-2xl border bg-white border-gray-200">
//               <h2 className="font-semibold text-gray-800 mb-1">Weekly Trend</h2>
//               <p className="text-xs text-gray-400 mb-4">Applications vs Selections over last 6 weeks</p>
//               <div><canvas ref={lineRef} /></div>
//               <div className="mt-4 flex justify-center gap-5">
//                 <div className="flex items-center gap-1.5 text-xs">
//                   <span className="w-5 h-0.5 rounded" style={{ background: "#3b82f6" }} />
//                   <span className="text-gray-600">Applied</span>
//                 </div>
//                 <div className="flex items-center gap-1.5 text-xs">
//                   <span className="w-5 h-0.5 rounded" style={{ background: "#22c55e" }} />
//                   <span className="text-gray-600">Selected</span>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ═══ APPLICATION LOG ═══ */}
//           {activeSection === "log" && (
//             <div className="rounded-2xl border overflow-hidden bg-white border-gray-200">
//               <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
//                 <span className="font-semibold text-sm text-gray-800">Application Log ({filtered.length})</span>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead className="bg-gray-50 text-gray-500">
//                     <tr>
//                       <th className="px-5 py-2.5 text-left text-xs uppercase">Candidate</th>
//                       <th className="px-5 py-2.5 text-left text-xs uppercase">Job</th>
//                       <th className="px-5 py-2.5 text-left text-xs uppercase">Status</th>
//                       <th className="px-5 py-2.5 text-left text-xs uppercase">Applied</th>
//                       <th className="px-5 py-2.5 text-left text-xs uppercase">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {filtered.map((a) => {
//                       const sc = a.status === "selected" ? "bg-green-100 text-green-800" :
//                                  a.status === "shortlisted" ? "bg-blue-100 text-blue-800" :
//                                  a.status === "rejected" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800";
//                       const sl = a.status === "selected" ? "Selected" :
//                                  a.status === "shortlisted" ? "Shortlisted" :
//                                  a.status === "rejected" ? "Rejected" : "Applied";
//                       return (
//                         <tr key={a._id} className="hover:bg-gray-50">
//                           <td className="px-5 py-3">
//                             <div className="font-medium text-gray-800">{a.name}</div>
//                             <div className="text-xs text-gray-400">{a.email}</div>
//                           </td>
//                           <td className="px-5 py-3 text-gray-600">{a.job}</td>
//                           <td className="px-5 py-3">
//                             <span className={`px-2 py-1 rounded-full text-xs font-semibold ${sc}`}>{sl}</span>
//                           </td>
//                           <td className="px-5 py-3 text-xs text-gray-400">{a.appliedAt ? formatTimeAgo(a.appliedAt) : "N/A"}</td>
//                           <td className="px-5 py-3">
//                             <span className="text-xs text-blue-600 hover:underline font-medium cursor-pointer">View</span>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
//     </div>
//   );
// }