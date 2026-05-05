import { useState, useEffect } from "react";
import JobCard from "./JobCard";
import {
  Award,
  Briefcase,
  TrendingUp,
  CheckCircle,
  Star,
  Search,
  MapPin,
  DollarSign,
  Clock,
  Bookmark,
} from "lucide-react";
import JobDetailsModal from "./JobModal";

export default function DashboardContent({
  user,
  recommendedJobs = [],
  searchQuery,
  setSearchQuery,
  locationFilter,
  setLocationFilter,
  savedJobs = new Set(),
  handleSaveJob = () => {},
}) {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const fetchJobs = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const query = new URLSearchParams({
        search: searchQuery || "",
        location: locationFilter || "",
      });

      const res = await fetch(
        `http://localhost:8000/api/student/job-search/?${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      // console.log("API DATA oooooooooooo:", data);
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   const delay = setTimeout(fetchJobs, 500);
  //   return () => clearTimeout(delay);
  // }, [searchQuery, locationFilter]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = async (job, applicationData) => {
    try {
      console.log("Application submitted:", { job, applicationData });

      alert(`Application submitted for ${job.title}!`);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  return (
    <div className="dashboard-content">
      {/* HERO */}
      <div className="hero-section">
        <div>
          <h1>Hai, {user?.name?.split(" ")[0] || "User"}</h1>
          <p>Your next career opportunity is just around the corner</p>
        </div>

        <div className="profile-completion">
          <div className="completion-text">
            <Award size={16} />
            <span>Profile Strength: {user?.profileComplete || 0}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${user?.profileComplete || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#EEF2FF" }}>
            <Briefcase size={24} color="#4F46E5" />
          </div>
          <div>
            <h3>12</h3>
            <p>Jobs Applied</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#E0F2FE" }}>
            <TrendingUp size={24} color="#0284C7" />
          </div>
          <div>
            <h3>5</h3>
            <p>Interviews</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#DCFCE7" }}>
            <CheckCircle size={24} color="#16A34A" />
          </div>
          <div>
            <h3>2</h3>
            <p>Offers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#FEF3C7" }}>
            <Star size={24} color="#D97706" />
          </div>
          <div>
            <h3>89%</h3>
            <p>Match Rate</p>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="search-section">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Job title, skills, or company"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="search-input-wrapper">
          <MapPin size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="search-input"
          />
        </div>

        <button
          className="search-btn"
          onClick={() => {
            setIsSearching(true);
            fetchJobs();
          }}
        >
          {loading ? "Searching..." : "Find Jobs"}
        </button>
      </div>

      {/* JOBS */}
      <div className="jobs-section">
        {/* 🔥 DYNAMIC HEADER */}
        <div className="section-header">
          <h2>{isSearching ? "Search Results" : "Recommended for You"}</h2>

          {isSearching && (
            <button
              className="view-all"
              onClick={() => {
                setIsSearching(false);
                setSearchQuery("");
                setLocationFilter("");
              }}
            >
              Clear →
            </button>
          )}
        </div>

        <div className="jobs-grid">
          {loading ? (
            <p style={{ textAlign: "center", width: "100%" }}>
              Loading jobs...
            </p>
          ) : isSearching ? (
            jobs.length === 0 ? (
              <p style={{ textAlign: "center", width: "100%" }}>
                No jobs found
              </p>
            ) : (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  handleJobClick={handleJobClick}
                  handleSaveJob={handleSaveJob}
                  savedJobs={savedJobs}
                />
              ))
            )
          ) : recommendedJobs.length === 0 ? (
            <p style={{ textAlign: "center", width: "100%" }}>
              No recommended jobs found
            </p>
          ) : (
            recommendedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                handleJobClick={handleJobClick}
                handleSaveJob={handleSaveJob}
                savedJobs={savedJobs}
              />
            ))
          )}
        </div>
      </div>

      <JobDetailsModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedJob(null);
        }}
        onApply={handleApply}
      />
    </div>
  );
}
