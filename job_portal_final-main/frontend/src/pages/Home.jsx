import { useState } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("All Job Types");

  const jobs = [
    {
      title: "Software Developer",
      company: "Tech Solutions",
      location: "Bangalore",
      type: "Full Time",
      salary: "₹5 - 8 LPA",
      icon: "💻",
    },
    {
      title: "Frontend Developer",
      company: "Digital Technologies",
      location: "Bangalore",
      type: "Full Time",
      salary: "₹4 - 7 LPA",
      icon: "🎨",
    },
    {
      title: "Python Developer",
      company: "Innovate Systems",
      location: "Hyderabad",
      type: "Full Time",
      salary: "₹5 - 9 LPA",
      icon: "🐍",
    },
    {
      title: "Data Analyst",
      company: "Business Analytics",
      location: "Mumbai",
      type: "Full Time",
      salary: "₹4 - 6 LPA",
      icon: "📊",
    },
    {
      title: "Web Development Intern",
      company: "StartUp India",
      location: "Remote",
      type: "Internship",
      salary: "₹15K - 25K",
      icon: "🚀",
    },
    {
      title: "Java Developer",
      company: "Global Technologies",
      location: "Chennai",
      type: "Full Time",
      salary: "₹5 - 8 LPA",
      icon: "☕",
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    const titleMatch =
      jobTitle === "" ||
      job.title.toLowerCase().includes(jobTitle.toLowerCase()) ||
      job.company.toLowerCase().includes(jobTitle.toLowerCase());

    const locationMatch =
      location === "" ||
      job.location.toLowerCase().includes(location.toLowerCase());

    const typeMatch =
      jobType === "All Job Types" || job.type === jobType;

    return titleMatch && locationMatch && typeMatch;
  });

  const scrollToJobs = () => {
    document
      .getElementById("featured-jobs")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-20 flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                J
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Job<span className="text-purple-600">Portal</span>
                </h1>
                <p className="text-[10px] text-gray-400 tracking-widest uppercase">
                  Find Your Future
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#home"
                className="text-sm font-semibold text-purple-600"
              >
                Home
              </a>

              <a
                href="#featured-jobs"
                className="text-sm font-medium text-gray-600 hover:text-purple-600"
              >
                Jobs
              </a>

              <a
                href="#categories"
                className="text-sm font-medium text-gray-600 hover:text-purple-600"
              >
                Categories
              </a>

              <a
                href="#companies"
                className="text-sm font-medium text-gray-600 hover:text-purple-600"
              >
                Companies
              </a>

              <Link
                to="/login"
                className="px-6 py-2.5 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition"
              >
                Login
              </Link>
            </div>

            {/* Mobile button */}
            <Link
              to="/login"
              className="md:hidden px-4 py-2 bg-purple-600 text-white rounded-lg text-sm"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Hero text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">
                ✨ Find your next opportunity
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Find Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  Dream Job
                </span>
              </h1>

              <p className="mt-6 text-lg text-gray-500 max-w-xl leading-relaxed">
                Discover thousands of job opportunities from top companies.
                Build your career and find the perfect job that matches your
                skills and ambitions.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={scrollToJobs}
                  className="px-7 py-3.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 shadow-lg shadow-purple-200 transition"
                >
                  Browse Jobs →
                </button>

                <Link
                  to="/login"
                  className="px-7 py-3.5 bg-white text-purple-600 border border-purple-200 rounded-lg font-semibold hover:bg-purple-50 transition"
                >
                  Create Account
                </Link>
              </div>
            </div>

            {/* Hero illustration */}
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-50"></div>

              <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">

                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-sm text-gray-400">
                      Job opportunities
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Find your match
                    </h3>
                  </div>

                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                    💼
                  </div>
                </div>

                <div className="space-y-4">

                  <div className="p-4 rounded-xl bg-purple-50 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">
                      💻
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">
                        Software Developer
                      </p>
                      <p className="text-xs text-gray-500">
                        Bangalore • Full Time
                      </p>
                    </div>
                    <span className="text-purple-600">→</span>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">
                      📊
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">
                        Data Analyst
                      </p>
                      <p className="text-xs text-gray-500">
                        Mumbai • Full Time
                      </p>
                    </div>
                    <span className="text-blue-600">→</span>
                  </div>

                  <div className="p-4 rounded-xl bg-pink-50 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">
                      🎨
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">
                        Frontend Developer
                      </p>
                      <p className="text-xs text-gray-500">
                        Bangalore • Full Time
                      </p>
                    </div>
                    <span className="text-pink-600">→</span>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= SEARCH ================= */}
      <section className="relative -mt-8 z-20 px-6">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-5">

          <div className="grid md:grid-cols-4 gap-3">

            {/* Job */}
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3">
              <span className="text-purple-600 text-xl">🔍</span>

              <div className="flex-1">
                <p className="text-xs text-gray-400">
                  Job title or keyword
                </p>

                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Developer"
                  className="w-full outline-none text-sm text-gray-700 mt-1"
                />
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3">
              <span className="text-purple-600 text-xl">📍</span>

              <div className="flex-1">
                <p className="text-xs text-gray-400">
                  Location
                </p>

                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bangalore"
                  className="w-full outline-none text-sm text-gray-700 mt-1"
                />
              </div>
            </div>

            {/* Job type */}
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3">
              <span className="text-purple-600 text-xl">💼</span>

              <div className="flex-1">
                <p className="text-xs text-gray-400">
                  Job Type
                </p>

                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full outline-none text-sm text-gray-700 mt-1 bg-white"
                >
                  <option>All Job Types</option>
                  <option>Full Time</option>
                  <option>Internship</option>
                </select>
              </div>
            </div>

            {/* Search button */}
            <button
              onClick={scrollToJobs}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition"
            >
              Search Jobs
            </button>

          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

            <div>
              <h2 className="text-3xl font-bold text-purple-600">
                10K+
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Active Jobs
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-purple-600">
                5K+
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Companies
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-purple-600">
                50K+
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Job Seekers
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-purple-600">
                25K+
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Successful Placements
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FEATURED JOBS ================= */}
      <section
        id="featured-jobs"
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-6">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <p className="text-purple-600 font-bold text-sm uppercase tracking-wider">
                Opportunities
              </p>

              <h2 className="text-4xl font-bold text-gray-900 mt-2">
                Featured Jobs
              </h2>

              <p className="text-gray-500 mt-3">
                Explore the latest opportunities from top companies.
              </p>
            </div>

            <span className="mt-5 md:mt-0 text-sm text-purple-600 font-semibold">
              {filteredJobs.length} Jobs Found
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredJobs.map((job, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >

                <div className="flex items-start justify-between">

                  <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center text-2xl">
                    {job.icon}
                  </div>

                  <button className="text-gray-400 hover:text-purple-600 text-xl">
                    ♡
                  </button>

                </div>

                <h3 className="text-lg font-bold text-gray-900 mt-5">
                  {job.title}
                </h3>

                <p className="text-purple-600 text-sm font-medium mt-1">
                  {job.company}
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    📍 {job.location}
                  </span>

                  <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs">
                    {job.type}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400">
                      Salary
                    </p>
                    <p className="font-bold text-gray-800">
                      {job.salary}
                    </p>
                  </div>

                  <Link
                    to="/login"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700"
                  >
                    Apply
                  </Link>
                </div>

              </div>
            ))}

          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800">
                No jobs found
              </h3>
              <p className="text-gray-500 mt-2">
                Try a different job title, location or job type.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section
        id="categories"
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">
            <p className="text-purple-600 font-bold text-sm uppercase tracking-wider">
              Explore Opportunities
            </p>

            <h2 className="text-4xl font-bold text-gray-900 mt-2">
              Popular Categories
            </h2>

            <p className="text-gray-500 mt-3">
              Find jobs according to your skills and interests.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

            {[
              ["💻", "IT & Software", "2,500+ Jobs"],
              ["📊", "Data Science", "1,200+ Jobs"],
              ["🎨", "Design", "800+ Jobs"],
              ["📱", "Marketing", "950+ Jobs"],
              ["💼", "Business", "1,100+ Jobs"],
              ["🔧", "Engineering", "750+ Jobs"],
              ["🏦", "Finance", "600+ Jobs"],
              ["🎓", "Internships", "1,500+ Jobs"],
            ].map((category, index) => (
              <div
                key={index}
                className="group p-6 border border-gray-100 rounded-2xl hover:border-purple-200 hover:shadow-lg transition cursor-pointer"
              >
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-purple-100 transition">
                  {category[0]}
                </div>

                <h3 className="font-bold text-gray-800 mt-5">
                  {category[1]}
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  {category[2]}
                </p>

                <p className="text-purple-600 text-sm font-semibold mt-4">
                  Explore →
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= COMPANIES ================= */}
      <section
        id="companies"
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">
            <p className="text-purple-600 font-bold text-sm uppercase tracking-wider">
              Top Employers
            </p>

            <h2 className="text-4xl font-bold text-gray-900 mt-2">
              Top Companies Hiring
            </h2>

            <p className="text-gray-500 mt-3">
              Connect with leading organizations looking for talented people.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

            {[
              ["G", "Google"],
              ["M", "Microsoft"],
              ["A", "Amazon"],
              ["T", "TCS"],
              ["I", "Infosys"],
              ["S", "Samsung"],
              ["IBM", "IBM"],
              ["A", "Accenture"],
            ].map((company, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 p-7 flex flex-col items-center justify-center hover:shadow-lg transition"
              >

                <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center text-xl font-bold text-purple-600">
                  {company[0]}
                </div>

                <h3 className="font-bold text-gray-700 mt-4">
                  {company[1]}
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  Hiring now
                </p>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-6">

          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to Find Your Dream Job?
          </h2>

          <p className="text-purple-100 text-lg mt-5">
            Create your profile today and start exploring thousands of
            opportunities.
          </p>

          <div className="flex justify-center gap-4 mt-8">

            <Link
              to="/login"
              className="px-8 py-3.5 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              Get Started
            </Link>

            <Link
              to="/company/login"
              className="px-8 py-3.5 border border-white/50 text-white rounded-lg font-bold hover:bg-white/10 transition"
            >
              Hire Talent
            </Link>

          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-6 py-12">

          <div className="grid md:grid-cols-4 gap-10">

            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold">
                  J
                </div>

                <span className="text-xl font-bold text-white">
                  JobPortal
                </span>
              </div>

              <p className="text-sm mt-4 leading-relaxed">
                Connecting talented people with the right opportunities.
                Build your future with JobPortal.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">
                For Job Seekers
              </h3>

              <p className="text-sm mb-2">
                Browse Jobs
              </p>

              <p className="text-sm mb-2">
                Career Opportunities
              </p>

              <p className="text-sm">
                Job Alerts
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">
                For Employers
              </h3>

              <p className="text-sm mb-2">
                Post a Job
              </p>

              <p className="text-sm mb-2">
                Find Candidates
              </p>

              <p className="text-sm">
                Recruitment
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">
                Contact
              </h3>

              <p className="text-sm mb-2">
                📧 support@jobportal.com
              </p>

              <p className="text-sm">
                📞 +91 9876543210
              </p>
            </div>

          </div>

          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm">
            © {new Date().getFullYear()} JobPortal. All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
}