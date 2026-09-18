import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

const API = "http://localhost:5000";

// ============================================================
// NAV ITEM
// ============================================================

function NavItem({
  icon,
  label,
  tab,
  activeTab,
  setActiveTab,
  theme,
}) {
  return (
    <button
      type="button"
      onClick={() => setActiveTab(tab)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "13px",
        padding: "13px 16px",
        marginBottom: "7px",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        textAlign: "left",
        fontSize: "14px",
        fontWeight: activeTab === tab ? "600" : "500",
        background:
          activeTab === tab ? "#2563eb" : "transparent",
        color:
          activeTab === tab ? "#ffffff" : theme.muted,
      }}
    >
      <span
        style={{
          fontSize: "18px",
          pointerEvents: "none",
        }}
      >
        {icon}
      </span>

      {label}
    </button>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  icon,
  title,
  value,
  description,
  theme,
  darkMode,
}) {
  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: "15px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        boxShadow: darkMode
          ? "none"
          : "0 4px 15px rgba(15,23,42,0.04)",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          background: "#eff6ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            color: theme.muted,
            fontSize: "12px",
            marginBottom: "4px",
          }}
        >
          {title}
        </div>

        <div
          style={{
            color: theme.text,
            fontSize: "26px",
            fontWeight: "750",
          }}
        >
          {value}
        </div>

        <div
          style={{
            color: theme.muted,
            fontSize: "11px",
            marginTop: "2px",
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// HEADER
// ============================================================

function Header({ title, subtitle, user, theme }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "28px",
        gap: "20px",
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            color: theme.text,
            fontSize: "28px",
            fontWeight: "750",
            letterSpacing: "-0.5px",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            margin: "7px 0 0",
            color: theme.muted,
            fontSize: "14px",
          }}
        >
          {subtitle}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              color: theme.text,
              fontSize: "14px",
              fontWeight: "650",
            }}
          >
            {user?.name || "Student"}
          </div>

          <div
            style={{
              color: theme.muted,
              fontSize: "12px",
            }}
          >
            Student
          </div>
        </div>

        {user?.profilePic ? (
          <img
            src={
              user.profilePic.startsWith("http")
                ? user.profilePic
                : `${API}${user.profilePic}`
            }
            alt="Profile"
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #2563eb",
            }}
          />
        ) : (
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#2563eb,#4f46e5)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            {user?.name
              ? user.name.charAt(0).toUpperCase()
              : "S"}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SIDEBAR
// ============================================================

function Sidebar({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  logout,
  theme,
}) {
  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "245px",
        height: "100vh",
        background: theme.card,
        borderRight: `1px solid ${theme.border}`,
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          padding: "25px 22px",
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "11px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "11px",
              background:
                "linear-gradient(135deg,#2563eb,#4f46e5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            J
          </div>

          <div>
            <div
              style={{
                fontWeight: "800",
                fontSize: "18px",
                color: theme.text,
              }}
            >
              JobPortal
            </div>

            <div
              style={{
                fontSize: "11px",
                color: theme.muted,
              }}
            >
              Student Panel
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "22px 14px",
          flex: 1,
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: "700",
            color: theme.muted,
            letterSpacing: "1px",
            padding: "0 12px",
            marginBottom: "12px",
          }}
        >
          MENU
        </p>

        <NavItem
          icon="⌂"
          label="Dashboard"
          tab="overview"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          theme={theme}
        />

        <NavItem
          icon="💼"
          label="Find Jobs"
          tab="jobs"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          theme={theme}
        />

        <NavItem
          icon="📄"
          label="My Applications"
          tab="applications"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          theme={theme}
        />

        <NavItem
          icon="📅"
          label="Interviews"
          tab="interviews"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          theme={theme}
        />

        <NavItem
          icon="👤"
          label="My Profile"
          tab="profile"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          theme={theme}
        />
      </div>

      <div
        style={{
          padding: "15px",
          borderTop: `1px solid ${theme.border}`,
        }}
      >
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "9px",
            background: darkMode ? "#334155" : "#f1f5f9",
            color: theme.text,
            cursor: "pointer",
            marginBottom: "7px",
            textAlign: "left",
          }}
        >
          {darkMode ? "☀️  Light Mode" : "🌙  Dark Mode"}
        </button>

        <button
          type="button"
          onClick={logout}
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "9px",
            background: "transparent",
            color: "#ef4444",
            cursor: "pointer",
            textAlign: "left",
            fontWeight: "600",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

// ============================================================
// OVERVIEW PAGE
// ============================================================

function Overview({
  user,
  jobs,
  applications,
  interviews,
  shortlistedCount,
  selectedCount,
  rejectedCount,
  setActiveTab,
  theme,
  darkMode,
  getCompanyName,
  getMatchPercentage,
}) {
  const barData = [
    {
      name: "Applied",
      count: applications.length,
    },
    {
      name: "Shortlisted",
      count: shortlistedCount,
    },
    {
      name: "Selected",
      count: selectedCount,
    },
    {
      name: "Rejected",
      count: rejectedCount,
    },
  ];

  const pieData = [
    {
      name: "Selected",
      value: selectedCount,
    },
    {
      name: "Shortlisted",
      value: shortlistedCount,
    },
    {
      name: "Rejected",
      value: rejectedCount,
    },
  ].filter((item) => item.value > 0);

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Track your job search and career progress"
        user={user}
        theme={theme}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0,1fr))",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <StatCard
          icon="💼"
          title="Available Jobs"
          value={jobs.length}
          description="Open opportunities"
          theme={theme}
          darkMode={darkMode}
        />

        <StatCard
          icon="📄"
          title="Applications"
          value={applications.length}
          description="Jobs applied"
          theme={theme}
          darkMode={darkMode}
        />

        <StatCard
          icon="⭐"
          title="Shortlisted"
          value={shortlistedCount}
          description="Applications shortlisted"
          theme={theme}
          darkMode={darkMode}
        />

        <StatCard
          icon="📅"
          title="Interviews"
          value={interviews.length}
          description="Scheduled interviews"
          theme={theme}
          darkMode={darkMode}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: "18px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: "15px",
            padding: "22px",
          }}
        >
          <h3
            style={{
              margin: 0,
              color: theme.text,
              fontSize: "16px",
            }}
          >
            Application Overview
          </h3>

          <p
            style={{
              margin: "5px 0 20px",
              color: theme.muted,
              fontSize: "12px",
            }}
          >
            Your application activity
          </p>

          <div
            style={{
              width: "100%",
              height: "270px",
            }}
          >
            <ResponsiveContainer>
              <BarChart data={barData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fill: theme.muted,
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: theme.muted,
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Bar
                  dataKey="count"
                  fill="#2563eb"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: "15px",
            padding: "22px",
          }}
        >
          <h3
            style={{
              margin: 0,
              color: theme.text,
              fontSize: "16px",
            }}
          >
            Application Status
          </h3>

          <p
            style={{
              margin: "5px 0 10px",
              color: theme.muted,
              fontSize: "12px",
            }}
          >
            Current application results
          </p>

          {pieData.length > 0 ? (
            <div
              style={{
                width: "100%",
                height: "250px",
              }}
            >
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={48}
                    paddingAngle={4}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          ["#22c55e", "#f59e0b", "#ef4444"][
                            index % 3
                          ]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div
              style={{
                height: "250px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.muted,
                fontSize: "13px",
              }}
            >
              No application data yet
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "15px",
              flexWrap: "wrap",
              fontSize: "11px",
              color: theme.muted,
            }}
          >
            <span>🟢 Selected</span>
            <span>🟠 Shortlisted</span>
            <span>🔴 Rejected</span>
          </div>
        </div>
      </div>

      <div
        style={{
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: "15px",
          padding: "22px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                color: theme.text,
                fontSize: "16px",
              }}
            >
              Latest Opportunities
            </h3>

            <p
              style={{
                margin: "5px 0 0",
                color: theme.muted,
                fontSize: "12px",
              }}
            >
              Recently available positions
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("jobs")}
            style={{
              border: "none",
              background: "#eff6ff",
              color: "#2563eb",
              padding: "8px 13px",
              borderRadius: "7px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "12px",
            }}
          >
            View All →
          </button>
        </div>

        {jobs.length === 0 ? (
          <div
            style={{
              padding: "30px",
              textAlign: "center",
              color: theme.muted,
            }}
          >
            No jobs available
          </div>
        ) : (
          jobs.slice(0, 4).map((job) => (
            <div
              key={job._id}
              style={{
                padding: "14px 0",
                borderBottom: `1px solid ${theme.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    color: theme.text,
                    fontWeight: "650",
                    fontSize: "14px",
                  }}
                >
                  {job.title || "Job Position"}
                </div>

                <div
                  style={{
                    color: theme.muted,
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {getCompanyName(job)} •{" "}
                  {job.location || "Location"}
                </div>
              </div>

              <span
                style={{
                  background: "#eff6ff",
                  color: "#2563eb",
                  padding: "6px 10px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "700",
                }}
              >
                {getMatchPercentage(job)}% Match
              </span>
            </div>
          ))
        )}
      </div>
    </>
  );
}

// ============================================================
// JOBS PAGE
// ============================================================

function Jobs({
  user,
  jobs,
  applications,
  search,
  setSearch,
  filterType,
  setFilterType,
  loadingJobs,
  applyJob,
  hasApplied,
  getCompanyName,
  getMatchPercentage,
  theme,
}) {
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const company = getCompanyName(job);

      const text =
        `${job.title || ""} ${company || ""} ${
          job.location || ""
        } ${job.department || ""}`.toLowerCase();

      const searchMatch = text.includes(
        search.toLowerCase()
      );

      const typeMatch =
        filterType === "All" ||
        String(job.type || "").toLowerCase() ===
          filterType.toLowerCase();

      return searchMatch && typeMatch;
    });
  }, [jobs, search, filterType, getCompanyName]);

  return (
    <>
      <Header
        title="Find Your Next Job"
        subtitle="Explore opportunities that match your skills"
        user={user}
        theme={theme}
      />

      <div
        style={{
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: "15px",
          padding: "18px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "12px",
          }}
        >
          <div
            style={{
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "16px",
                pointerEvents: "none",
                zIndex: 1,
              }}
            >
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by job title, company, location..."
              autoComplete="off"
              style={{
                width: "100%",
                padding: "12px 14px 12px 42px",
                borderRadius: "9px",
                border: `1px solid ${theme.border}`,
                background: theme.input,
                color: theme.text,
                outline: "none",
                boxSizing: "border-box",
                pointerEvents: "auto",
                userSelect: "text",
                cursor: "text",
              }}
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "9px",
              border: `1px solid ${theme.border}`,
              background: theme.input,
              color: theme.text,
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="All">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Full Time">Full Time</option>
            <option value="Part-time">Part-time</option>
            <option value="Part Time">Part Time</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
        </div>
      </div>

      <div
        style={{
          marginBottom: "15px",
          color: theme.muted,
          fontSize: "13px",
        }}
      >
        Showing{" "}
        <strong style={{ color: theme.text }}>
          {filteredJobs.length}
        </strong>{" "}
        job opportunities
      </div>

      {loadingJobs ? (
        <div
          style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: "15px",
            padding: "50px",
            textAlign: "center",
            color: theme.muted,
          }}
        >
          Loading jobs...
        </div>
      ) : filteredJobs.length === 0 ? (
        <div
          style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: "15px",
            padding: "55px 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "45px",
              marginBottom: "15px",
            }}
          >
            🔎
          </div>

          <h3
            style={{
              color: theme.text,
              margin: 0,
            }}
          >
            No jobs found
          </h3>

          <p
            style={{
              color: theme.muted,
              fontSize: "13px",
            }}
          >
            Try changing your search or filter.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2,minmax(0,1fr))",
            gap: "17px",
          }}
        >
          {filteredJobs.map((job) => {
            const company = getCompanyName(job);
            const applied = hasApplied(job._id);
            const match = getMatchPercentage(job);

            return (
              <div
                key={job._id}
                style={{
                  background: theme.card,
                  border: `1px solid ${theme.border}`,
                  borderRadius: "15px",
                  padding: "21px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "46px",
                        height: "46px",
                        borderRadius: "10px",
                        background: "#eff6ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                      }}
                    >
                      🏢
                    </div>

                    <div>
                      <h3
                        style={{
                          margin: "0 0 5px",
                          color: theme.text,
                          fontSize: "16px",
                        }}
                      >
                        {job.title || "Job Position"}
                      </h3>

                      <div
                        style={{
                          color: theme.muted,
                          fontSize: "12px",
                        }}
                      >
                        {company}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      height: "fit-content",
                      background:
                        match >= 80 ? "#dcfce7" : "#eff6ff",
                      color:
                        match >= 80 ? "#15803d" : "#2563eb",
                      padding: "6px 9px",
                      borderRadius: "20px",
                      fontSize: "10px",
                      fontWeight: "700",
                    }}
                  >
                    {match}% Match
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "7px",
                    margin: "17px 0",
                  }}
                >
                  <span
                    style={{
                      background: theme.input,
                      color: theme.muted,
                      padding: "6px 9px",
                      borderRadius: "6px",
                      fontSize: "11px",
                    }}
                  >
                    📍 {job.location || "Not specified"}
                  </span>

                  {job.type && (
                    <span
                      style={{
                        background: theme.input,
                        color: theme.muted,
                        padding: "6px 9px",
                        borderRadius: "6px",
                        fontSize: "11px",
                      }}
                    >
                      💼 {job.type}
                    </span>
                  )}

                  {job.department && (
                    <span
                      style={{
                        background: theme.input,
                        color: theme.muted,
                        padding: "6px 9px",
                        borderRadius: "6px",
                        fontSize: "11px",
                      }}
                    >
                      🎯 {job.department}
                    </span>
                  )}
                </div>

                <p
                  style={{
                    color: theme.muted,
                    fontSize: "12px",
                    lineHeight: "1.6",
                    minHeight: "38px",
                    margin: "0 0 18px",
                  }}
                >
                  {job.description
                    ? job.description.slice(0, 150) +
                      (job.description.length > 150
                        ? "..."
                        : "")
                    : "No job description available."}
                </p>

                <div
                  style={{
                    borderTop: `1px solid ${theme.border}`,
                    paddingTop: "15px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: theme.muted,
                      fontSize: "10px",
                    }}
                  >
                    {job.posted
                      ? new Date(
                          job.posted
                        ).toLocaleDateString()
                      : "Recently posted"}
                  </span>

                  {applied ? (
                    <button
                      type="button"
                      disabled
                      style={{
                        border: "none",
                        background: "#dcfce7",
                        color: "#15803d",
                        padding: "9px 15px",
                        borderRadius: "7px",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      ✓ Applied
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => applyJob(job._id)}
                      style={{
                        border: "none",
                        background: "#2563eb",
                        color: "#ffffff",
                        padding: "9px 17px",
                        borderRadius: "7px",
                        fontSize: "11px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      Apply Now →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ============================================================
// APPLICATIONS PAGE
// ============================================================

function Applications({
  user,
  applications,
  shortlistedCount,
  selectedCount,
  rejectedCount,
  theme,
  darkMode,
  setActiveTab,
}) {
  return (
    <>
      <Header
        title="My Applications"
        subtitle="Track the progress of your job applications"
        user={user}
        theme={theme}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "14px",
          marginBottom: "20px",
        }}
      >
        <StatCard
          icon="📤"
          title="Applied"
          value={applications.length}
          description="Total applications"
          theme={theme}
          darkMode={darkMode}
        />

        <StatCard
          icon="⭐"
          title="Shortlisted"
          value={shortlistedCount}
          description="Shortlisted"
          theme={theme}
          darkMode={darkMode}
        />

        <StatCard
          icon="✓"
          title="Selected"
          value={selectedCount}
          description="Selected"
          theme={theme}
          darkMode={darkMode}
        />

        <StatCard
          icon="✕"
          title="Rejected"
          value={rejectedCount}
          description="Rejected"
          theme={theme}
          darkMode={darkMode}
        />
      </div>

      {applications.length === 0 ? (
        <div
          style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: "15px",
            padding: "60px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "45px" }}>📄</div>

          <h3 style={{ color: theme.text }}>
            No applications yet
          </h3>

          <p
            style={{
              color: theme.muted,
              fontSize: "13px",
            }}
          >
            Start applying to jobs and track them here.
          </p>

          <button
            type="button"
            onClick={() => setActiveTab("jobs")}
            style={{
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              padding: "11px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        applications.map((app) => {
          const status = String(
            app.status || "applied"
          ).toLowerCase();

          let bg = "#eff6ff";
          let color = "#2563eb";

          if (status === "selected") {
            bg = "#dcfce7";
            color = "#15803d";
          }

          if (status === "rejected") {
            bg = "#fee2e2";
            color = "#dc2626";
          }

          return (
            <div
              key={app._id}
              style={{
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: "14px",
                padding: "20px",
                marginBottom: "13px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: "0 0 7px",
                    color: theme.text,
                    fontSize: "16px",
                  }}
                >
                  {app.job || "Unknown Job"}
                </h3>

                <p
                  style={{
                    margin: "4px 0",
                    color: theme.muted,
                    fontSize: "12px",
                  }}
                >
                  🏢 {app.companyName || "Company"}
                </p>

                <p
                  style={{
                    margin: "4px 0",
                    color: theme.muted,
                    fontSize: "12px",
                  }}
                >
                  📍 {app.location || "Location not specified"}
                </p>

                {app.appliedAt && (
                  <p
                    style={{
                      margin: "7px 0 0",
                      color: theme.muted,
                      fontSize: "11px",
                    }}
                  >
                    Applied on{" "}
                    {new Date(
                      app.appliedAt
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>

              <span
                style={{
                  padding: "7px 13px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "700",
                  background: bg,
                  color,
                }}
              >
                {app.status || "Applied"}
              </span>
            </div>
          );
        })
      )}
    </>
  );
}

// ============================================================
// INTERVIEWS PAGE
// ============================================================

function Interviews({ user, interviews, theme }) {
  return (
    <>
      <Header
        title="My Interviews"
        subtitle="Manage your upcoming interview schedules"
        user={user}
        theme={theme}
      />

      {interviews.length === 0 ? (
        <div
          style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: "15px",
            padding: "60px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "45px" }}>📅</div>

          <h3 style={{ color: theme.text }}>
            No interviews scheduled
          </h3>

          <p
            style={{
              color: theme.muted,
              fontSize: "13px",
            }}
          >
            Your interview details will appear here.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2,1fr)",
            gap: "16px",
          }}
        >
          {interviews.map((interview) => (
            <div
              key={interview._id}
              style={{
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: "15px",
                padding: "22px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: "0 0 7px",
                      color: theme.text,
                    }}
                  >
                    {interview.jobTitle || "Interview"}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: theme.muted,
                      fontSize: "12px",
                    }}
                  >
                    🏢{" "}
                    {interview.companyName || "Company"}
                  </p>
                </div>

                <span
                  style={{
                    background: "#dcfce7",
                    color: "#15803d",
                    padding: "6px 10px",
                    borderRadius: "20px",
                    fontSize: "10px",
                    fontWeight: "700",
                  }}
                >
                  {interview.status || "Scheduled"}
                </span>
              </div>

              <div
                style={{
                  marginTop: "20px",
                  background: theme.input,
                  borderRadius: "10px",
                  padding: "15px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 10px",
                    color: theme.text,
                    fontSize: "12px",
                  }}
                >
                  📅{" "}
                  {interview.date
                    ? new Date(
                        interview.date
                      ).toLocaleString()
                    : "Date not specified"}
                </p>

                <p
                  style={{
                    margin: "0 0 10px",
                    color: theme.muted,
                    fontSize: "12px",
                  }}
                >
                  👤 Interviewer:{" "}
                  {interview.interviewer || "Not specified"}
                </p>

                <p
                  style={{
                    margin: 0,
                    color: theme.muted,
                    fontSize: "12px",
                  }}
                >
                  💻 Mode:{" "}
                  {interview.mode || "Not specified"}
                </p>
              </div>

              {interview.link && (
                <a
                  href={interview.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "15px",
                    background: "#2563eb",
                    color: "#ffffff",
                    padding: "10px 16px",
                    borderRadius: "7px",
                    textDecoration: "none",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  Join Interview →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ============================================================
// PROFILE PAGE
// ============================================================

function Profile({
  user,
  profileForm,
  setProfileForm,
  loadingProfile,
  handleProfileUpdate,
  profilePic,
  setProfilePic,
  handleProfilePicUpload,
  resumeFile,
  setResumeFile,
  handleResumeUpload,
  theme,
}) {
  return (
    <>
      <Header
        title="My Profile"
        subtitle="Keep your profile updated for better opportunities"
        user={user}
        theme={theme}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 0.8fr",
          gap: "18px",
        }}
      >
        {/* ==================================================
            PERSONAL INFORMATION
        ================================================== */}

        <div
          style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: "15px",
            padding: "25px",
          }}
        >
          <h3
            style={{
              margin: "0 0 5px",
              color: theme.text,
            }}
          >
            Personal Information
          </h3>

          <p
            style={{
              color: theme.muted,
              fontSize: "12px",
              marginBottom: "22px",
            }}
          >
            Update your information
          </p>

          <form onSubmit={handleProfileUpdate}>
            {/* NAME + PHONE */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    color: theme.text,
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom: "7px",
                  }}
                >
                  Full Name
                </label>

                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  autoComplete="name"
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: "8px",
                    border: `1px solid ${theme.border}`,
                    background: theme.input,
                    color: theme.text,
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    color: theme.text,
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom: "7px",
                  }}
                >
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  autoComplete="tel"
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: "8px",
                    border: `1px solid ${theme.border}`,
                    background: theme.input,
                    color: theme.text,
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* UNIVERSITY */}

            <label
              style={{
                display: "block",
                marginTop: "15px",
                color: theme.text,
                fontSize: "12px",
                fontWeight: "600",
                marginBottom: "7px",
              }}
            >
              University
            </label>

            <input
              type="text"
              value={profileForm.university}
              onChange={(e) =>
                setProfileForm((prev) => ({
                  ...prev,
                  university: e.target.value,
                }))
              }
              autoComplete="organization"
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: "8px",
                border: `1px solid ${theme.border}`,
                background: theme.input,
                color: theme.text,
                boxSizing: "border-box",
                outline: "none",
              }}
            />

            {/* CGPA + SKILLS */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                marginTop: "15px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    color: theme.text,
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom: "7px",
                  }}
                >
                  CGPA
                </label>

                <input
                  type="text"
                  value={profileForm.gpa}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      gpa: e.target.value,
                    }))
                  }
                  placeholder="Example: 8.5"
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: "8px",
                    border: `1px solid ${theme.border}`,
                    background: theme.input,
                    color: theme.text,
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    color: theme.text,
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom: "7px",
                  }}
                >
                  Skills
                </label>

                <input
                  type="text"
                  value={profileForm.skills}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      skills: e.target.value,
                    }))
                  }
                  placeholder="Java, Python, React"
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: "8px",
                    border: `1px solid ${theme.border}`,
                    background: theme.input,
                    color: theme.text,
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* ABOUT ME */}

            <label
              style={{
                display: "block",
                marginTop: "15px",
                color: theme.text,
                fontSize: "12px",
                fontWeight: "600",
                marginBottom: "7px",
              }}
            >
              About Me
            </label>

            <textarea
              value={profileForm.bio}
              onChange={(e) =>
                setProfileForm((prev) => ({
                  ...prev,
                  bio: e.target.value,
                }))
              }
              rows={5}
              placeholder="Tell recruiters about yourself..."
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: "8px",
                border: `1px solid ${theme.border}`,
                background: theme.input,
                color: theme.text,
                resize: "vertical",
                boxSizing: "border-box",
                outline: "none",
                fontFamily:
                  "Inter, Arial, Helvetica, sans-serif",
              }}
            />

            <button
              type="submit"
              disabled={loadingProfile}
              style={{
                marginTop: "18px",
                border: "none",
                background: loadingProfile
                  ? "#93c5fd"
                  : "#2563eb",
                color: "#ffffff",
                padding: "11px 20px",
                borderRadius: "8px",
                cursor: loadingProfile
                  ? "not-allowed"
                  : "pointer",
                fontWeight: "700",
              }}
            >
              {loadingProfile
                ? "Saving..."
                : "Save Changes"}
            </button>
          </form>
        </div>

        {/* ==================================================
            RIGHT SIDE
        ================================================== */}

        <div>
          {/* PROFILE PHOTO */}

          <div
            style={{
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: "15px",
              padding: "25px",
              textAlign: "center",
              marginBottom: "18px",
            }}
          >
            <h3
              style={{
                color: theme.text,
                margin: "0 0 20px",
              }}
            >
              Profile Photo
            </h3>

            {user?.profilePic ? (
              <img
                src={
                  user.profilePic.startsWith("http")
                    ? user.profilePic
                    : `${API}${user.profilePic}`
                }
                alt="Profile"
                style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid #eff6ff",
                  marginBottom: "15px",
                }}
              />
            ) : (
              <div
                style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg,#2563eb,#4f46e5)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "40px",
                  fontWeight: "bold",
                  margin: "0 auto 15px",
                }}
              >
                {user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : "S"}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setProfilePic(
                  e.target.files?.[0] || null
                )
              }
              style={{
                width: "100%",
                fontSize: "11px",
                cursor: "pointer",
              }}
            />

            <button
              type="button"
              onClick={handleProfilePicUpload}
              style={{
                marginTop: "14px",
                width: "100%",
                border: "none",
                background: "#2563eb",
                color: "#ffffff",
                padding: "10px",
                borderRadius: "7px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Upload Photo
            </button>
          </div>

          {/* RESUME */}

          <div
            style={{
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: "15px",
              padding: "25px",
            }}
          >
            <h3
              style={{
                margin: "0 0 7px",
                color: theme.text,
              }}
            >
              Resume
            </h3>

            <p
              style={{
                color: theme.muted,
                fontSize: "12px",
              }}
            >
              Upload your latest resume in PDF format.
            </p>

            {user?.resume && (
              <a
                href={
                  user.resume.startsWith("http")
                    ? user.resume
                    : `${API}${user.resume}`
                }
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  background: "#eff6ff",
                  color: "#2563eb",
                  padding: "10px",
                  borderRadius: "7px",
                  textDecoration: "none",
                  fontSize: "12px",
                  fontWeight: "600",
                  margin: "15px 0",
                }}
              >
                📄 View Current Resume
              </a>
            )}

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) =>
                setResumeFile(
                  e.target.files?.[0] || null
                )
              }
              style={{
                width: "100%",
                fontSize: "11px",
                cursor: "pointer",
              }}
            />

            <button
              type="button"
              onClick={handleResumeUpload}
              style={{
                marginTop: "14px",
                width: "100%",
                border: "none",
                background: "#2563eb",
                color: "#ffffff",
                padding: "10px",
                borderRadius: "7px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Upload Resume
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================
// MAIN STUDENT DASHBOARD
// ============================================================

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [activeTab, setActiveTab] =
    useState("overview");

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] =
    useState([]);
  const [interviews, setInterviews] =
    useState([]);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] =
    useState("All");

  const [loadingJobs, setLoadingJobs] =
    useState(false);

  const [loadingProfile, setLoadingProfile] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(false);

  const [profilePic, setProfilePic] =
    useState(null);

  const [resumeFile, setResumeFile] =
    useState(null);

  const [profileForm, setProfileForm] =
    useState({
      name: "",
      university: "",
      gpa: "",
      phone: "",
      skills: "",
      bio: "",
    });

  // ==========================================================
  // AUTH HEADERS
  // ==========================================================

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // ==========================================================
  // FETCH USER
  // ==========================================================

  const fetchUser = async () => {
    try {
      const response =
        await axios.get(
          `${API}/api/student/me`,
          {
            headers: getAuthHeaders(),
          }
        );

      const data = response.data;

      setUser(data);

      setProfileForm({
        name: data.name || "",
        university:
          data.university || "",
        gpa: data.gpa || "",
        phone: data.phone || "",
        skills: Array.isArray(
          data.skills
        )
          ? data.skills.join(", ")
          : data.skills || "",
        bio: data.bio || "",
      });
    } catch (error) {
      console.error(
        "FETCH USER ERROR:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "token"
        );

        navigate("/login");
      }
    }
  };

  // ==========================================================
  // FETCH JOBS
  // ==========================================================

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);

      const response =
        await axios.get(
          `${API}/api/student/jobs`
        );

      setJobs(
        Array.isArray(
          response.data
        )
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "FETCH JOBS ERROR:",
        error
      );

      setJobs([]);
    } finally {
      setLoadingJobs(false);
    }
  };

  // ==========================================================
  // FETCH APPLICATIONS
  // ==========================================================

  const fetchApplications =
    async () => {
      try {
        const response =
          await axios.get(
            `${API}/api/student/applications/my`,
            {
              headers:
                getAuthHeaders(),
            }
          );

        setApplications(
          Array.isArray(
            response.data
          )
            ? response.data
            : []
        );
      } catch (error) {
        console.error(
          "FETCH APPLICATIONS ERROR:",
          error
        );

        setApplications([]);
      }
    };

  // ==========================================================
  // FETCH INTERVIEWS
  // ==========================================================

  const fetchInterviews =
    async () => {
      try {
        const response =
          await axios.get(
            `${API}/api/student/interviews/my`,
            {
              headers:
                getAuthHeaders(),
            }
          );

        setInterviews(
          Array.isArray(
            response.data
          )
            ? response.data
            : []
        );
      } catch (error) {
        console.error(
          "FETCH INTERVIEWS ERROR:",
          error
        );

        setInterviews([]);
      }
    };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      navigate("/login");
      return;
    }

    fetchUser();
    fetchJobs();
    fetchApplications();
    fetchInterviews();
  }, []);

  // ==========================================================
  // APPLY JOB
  // ==========================================================

  const applyJob = async (
    jobId
  ) => {
    try {
      const response =
        await axios.post(
          `${API}/api/student/applications`,
          {
            jobId,
          },
          {
            headers:
              getAuthHeaders(),
          }
        );

      alert(
        response.data.message ||
          "Application submitted successfully"
      );

      await fetchApplications();
    } catch (error) {
      console.error(
        "APPLY ERROR:",
        error
      );

      alert(
        error.response?.data
          ?.message ||
          "Unable to apply for this job"
      );
    }
  };

  // ==========================================================
  // HAS APPLIED
  // ==========================================================

  const hasApplied = (
    jobId
  ) => {
    return applications.some(
      (app) => {
        const applicationJobId =
          app.jobId?._id ||
          app.jobId ||
          app.job?._id ||
          app.job;

        return (
          String(
            applicationJobId
          ) ===
          String(jobId)
        );
      }
    );
  };

  // ==========================================================
  // PROFILE UPDATE
  // ==========================================================

  const handleProfileUpdate =
    async (e) => {
      e.preventDefault();

      try {
        setLoadingProfile(true);

        const response =
          await axios.put(
            `${API}/api/student/me`,
            {
              name:
                profileForm.name,
              university:
                profileForm.university,
              gpa:
                profileForm.gpa,
              phone:
                profileForm.phone,
              skills:
                profileForm.skills
                  .split(",")
                  .map(
                    (skill) =>
                      skill.trim()
                  )
                  .filter(Boolean),
              bio:
                profileForm.bio,
            },
            {
              headers:
                getAuthHeaders(),
            }
          );

        setUser(
          response.data
        );

        alert(
          "Profile updated successfully"
        );

        await fetchUser();
      } catch (error) {
        console.error(
          "PROFILE UPDATE ERROR:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Failed to update profile"
        );
      } finally {
        setLoadingProfile(
          false
        );
      }
    };

  // ==========================================================
  // PROFILE IMAGE UPLOAD
  // ==========================================================

  const handleProfilePicUpload =
    async () => {
      if (!profilePic) {
        alert(
          "Please select an image"
        );
        return;
      }

      try {
        const formData =
          new FormData();

        formData.append(
          "profilePic",
          profilePic
        );

        const response =
          await axios.post(
            `${API}/api/student/upload-profile-pic`,
            formData,
            {
              headers: {
                ...getAuthHeaders(),
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        alert(
          response.data.message ||
            "Profile picture uploaded successfully"
        );

        setProfilePic(null);

        fetchUser();
      } catch (error) {
        console.error(
          "PROFILE IMAGE ERROR:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Failed to upload image"
        );
      }
    };

  // ==========================================================
  // RESUME UPLOAD
  // ==========================================================

  const handleResumeUpload =
    async () => {
      if (!resumeFile) {
        alert(
          "Please select a PDF resume"
        );
        return;
      }

      try {
        const formData =
          new FormData();

        formData.append(
          "resume",
          resumeFile
        );

        const response =
          await axios.post(
            `${API}/api/student/upload-resume`,
            formData,
            {
              headers: {
                ...getAuthHeaders(),
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        alert(
          response.data.message ||
            "Resume uploaded successfully"
        );

        setResumeFile(null);

        fetchUser();
      } catch (error) {
        console.error(
          "RESUME ERROR:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Failed to upload resume"
        );
      }
    };

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/login");
  };

  // ==========================================================
  // COMPANY NAME
  // ==========================================================

  const getCompanyName = (
    job
  ) => {
    return (
      job.companyName ||
      job.company?.companyName ||
      job.company?.name ||
      job.company ||
      "Company"
    );
  };

  // ==========================================================
  // MATCH PERCENTAGE
  // ==========================================================

  const getMatchPercentage =
    (job) => {
      if (!user?.skills) {
        return 65;
      }

      const studentSkills =
        Array.isArray(
          user.skills
        )
          ? user.skills
          : String(
              user.skills
            )
              .split(",")
              .map(
                (s) =>
                  s.trim()
              );

      if (
        !studentSkills.length
      ) {
        return 65;
      }

      const jobText =
        `${job.title || ""} ${
          job.description || ""
        } ${
          job.department || ""
        }`.toLowerCase();

      let matches = 0;

      studentSkills.forEach(
        (skill) => {
          if (
            skill &&
            jobText.includes(
              skill.toLowerCase()
            )
          ) {
            matches++;
          }
        }
      );

      const percentage =
        Math.round(
          (matches /
            studentSkills.length) *
            100
        );

      return Math.min(
        100,
        Math.max(
          percentage,
          60
        )
      );
    };

  // ==========================================================
  // APPLICATION COUNTS
  // ==========================================================

  const selectedCount =
    applications.filter(
      (app) =>
        String(
          app.status || ""
        ).toLowerCase() ===
        "selected"
    ).length;

  const rejectedCount =
    applications.filter(
      (app) =>
        String(
          app.status || ""
        ).toLowerCase() ===
        "rejected"
    ).length;

  const shortlistedCount =
    applications.filter(
      (app) =>
        String(
          app.status || ""
        ).toLowerCase() ===
        "shortlisted"
    ).length;

  // ==========================================================
  // THEME
  // ==========================================================

  const theme = {
    bg: darkMode
      ? "#0f172a"
      : "#f5f7fb",

    card: darkMode
      ? "#1e293b"
      : "#ffffff",

    text: darkMode
      ? "#f8fafc"
      : "#172033",

    muted: darkMode
      ? "#94a3b8"
      : "#64748b",

    border: darkMode
      ? "#334155"
      : "#e5e7eb",

    input: darkMode
      ? "#0f172a"
      : "#ffffff",
  };

  // ==========================================================
  // MAIN RETURN
  // ==========================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        fontFamily:
          "Inter, Arial, Helvetica, sans-serif",
      }}
    >
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        logout={logout}
        theme={theme}
      />

      <main
        style={{
          marginLeft: "245px",
          minHeight: "100vh",
          padding: "32px",
          boxSizing: "border-box",
        }}
      >
        {activeTab ===
          "overview" && (
          <Overview
            user={user}
            jobs={jobs}
            applications={
              applications
            }
            interviews={
              interviews
            }
            shortlistedCount={
              shortlistedCount
            }
            selectedCount={
              selectedCount
            }
            rejectedCount={
              rejectedCount
            }
            setActiveTab={
              setActiveTab
            }
            theme={theme}
            darkMode={
              darkMode
            }
            getCompanyName={
              getCompanyName
            }
            getMatchPercentage={
              getMatchPercentage
            }
          />
        )}

        {activeTab === "jobs" && (
          <Jobs
            user={user}
            jobs={jobs}
            applications={
              applications
            }
            search={search}
            setSearch={
              setSearch
            }
            filterType={
              filterType
            }
            setFilterType={
              setFilterType
            }
            loadingJobs={
              loadingJobs
            }
            applyJob={
              applyJob
            }
            hasApplied={
              hasApplied
            }
            getCompanyName={
              getCompanyName
            }
            getMatchPercentage={
              getMatchPercentage
            }
            theme={theme}
          />
        )}

        {activeTab ===
          "applications" && (
          <Applications
            user={user}
            applications={
              applications
            }
            shortlistedCount={
              shortlistedCount
            }
            selectedCount={
              selectedCount
            }
            rejectedCount={
              rejectedCount
            }
            theme={theme}
            darkMode={
              darkMode
            }
            setActiveTab={
              setActiveTab
            }
          />
        )}

        {activeTab ===
          "interviews" && (
          <Interviews
            user={user}
            interviews={
              interviews
            }
            theme={theme}
          />
        )}

        {activeTab ===
          "profile" && (
          <Profile
            user={user}
            profileForm={
              profileForm
            }
            setProfileForm={
              setProfileForm
            }
            loadingProfile={
              loadingProfile
            }
            handleProfileUpdate={
              handleProfileUpdate
            }
            profilePic={
              profilePic
            }
            setProfilePic={
              setProfilePic
            }
            handleProfilePicUpload={
              handleProfilePicUpload
            }
            resumeFile={
              resumeFile
            }
            setResumeFile={
              setResumeFile
            }
            handleResumeUpload={
              handleResumeUpload
            }
            theme={theme}
          />
        )}
      </main>

      {/* =====================================================
          GLOBAL INPUT FIX
      ===================================================== */}

      <style>
        {`
          input,
          textarea,
          select {
            pointer-events: auto !important;
            user-select: text !important;
          }

          input:focus,
          textarea:focus,
          select:focus {
            outline: none !important;
            border-color: #2563eb !important;
            box-shadow:
              0 0 0 3px
              rgba(37, 99, 235, 0.12) !important;
          }

          input::placeholder,
          textarea::placeholder {
            color: #94a3b8;
            opacity: 1;
          }

          button {
            user-select: none;
          }

          @media (max-width: 1100px) {
            main {
              margin-left: 0 !important;
              padding: 20px !important;
            }

            aside {
              position: relative !important;
              width: 100% !important;
              height: auto !important;
            }
          }

          @media (max-width: 800px) {
            main {
              padding: 15px !important;
            }
          }
        `}
      </style>
    </div>
  );
}