import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    recruiters: 0,
    jobs: 0,
    applications: 0,
    selected: 0,
  });

  const [animatedStats, setAnimatedStats] = useState({
    students: 0,
    recruiters: 0,
    jobs: 0,
    applications: 0,
    selected: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/dashboard/stats",
        );
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  // Animate numbers
  useEffect(() => {
    const duration = 1000; // 1 second
    const steps = 50;
    const intervalTime = duration / steps;

    const animate = (key) => {
      let start = 0;
      const end = stats[key];
      const increment = end / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(timer);
        }

        setAnimatedStats((prev) => ({
          ...prev,
          [key]: Math.floor(start),
        }));
      }, intervalTime);
    };

    Object.keys(stats).forEach((key) => animate(key));
  }, [stats]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>🎓 Admin</h2>
        <ul>
          <li className="active">📊 Dashboard</li>
          <li>
            <Link to="/students">👨‍🎓 Students</Link>
          </li>
          <li>
            <Link to="/recruiters">🏢 Recruiters</Link>
          </li>
          {/* <li>🏢 Recruiters</li> */}
          {/* <li>📄 Jobs</li> */}
          <li>
            <Link to="/admin/approve-jobs">📄 Approve Jobs</Link>
          </li>
          {/* <li onClick={() => navigate("/admin/approve-jobs")}>
  📄 Approve Jobs
</li> */}
          {/* <li to="/admin/applications">📬 Applications</li> */}
          <li>
            <Link to="/admin/applications">📬 Applications</Link>
          </li>
 <li>
            <Link to="/admin/results">✅ Results</Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-nav">
          <h1>
            <b>🎯 Placement Officer Panel</b>
          </h1>
        </header>

        {/* ✅ Dynamic Stats Cards
        <div className="stats">
          <div className="stat-card">👨‍🎓 {stats.students} Students</div>
          <div className="stat-card">🏢 {stats.recruiters} Recruiters</div>
          <div className="stat-card">📄 {stats.jobs} Jobs</div>
          <div className="stat-card">📬 {stats.applications} Applications</div>
          <div className="stat-card">✅ {stats.selected} Selected</div>
        </div> */}

        {/* 🔥 Animated Cards */}
        <div className="stats">
          <div className="stat-card">👨‍🎓 {animatedStats.students} Students</div>
          <div className="stat-card">
            🏢 {animatedStats.recruiters} Recruiters
          </div>
          <div className="stat-card">📄 {animatedStats.jobs} Jobs</div>
          <div className="stat-card">
            📬 {animatedStats.applications} Applications
          </div>
          <div className="stat-card">✅ {animatedStats.selected} Selected</div>
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>👨‍🎓 Manage Students</h3>
            <p>Add, update, delete student records</p>
          </div>

          <div className="dashboard-card">
            <h3>🏢 Manage Recruiters</h3>
            <p>Handle company registrations</p>
          </div>

          <div className="dashboard-card">
            <h3>📄 Approve Jobs</h3>
            <p>Approve or reject job postings</p>
          </div>

          <div className="dashboard-card">
            <h3>📬 Applications</h3>
            <p>Track student applications</p>
          </div>

          <div className="dashboard-card">
            <h3>✅ Results</h3>
            <p>Publish final placement results</p>
          </div>

          <div className="dashboard-card">
            <h3>📊 Reports</h3>
            <p>Generate placement reports</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
