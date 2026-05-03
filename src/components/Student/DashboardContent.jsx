import { useState } from "react";
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
import JobDetailsModal from "./JobModal"; // Make sure the import path is correct

export default function DashboardContent({
  user,
  recommendedJobs = [],
  searchQuery,
  setSearchQuery,
  locationFilter,
  setLocationFilter,
}) {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleApply = async (job, applicationData) => {
    try {
      // Here you would typically send this data to your backend
      console.log("Application submitted:", { job, applicationData });
      
      
      
      alert(`Application submitted for ${job.title}!`);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  const handleSaveJob = (jobId, e) => {
    e.stopPropagation();
    setSavedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  return (
    <div className="dashboard-content">
      {/* HERO */}
      <div className="hero-section">
        <div>
          <h1>Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋</h1>
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

        <button className="search-btn">Find Jobs</button>
      </div>

      {/* JOBS */}
      <div className="jobs-section">
        <div className="section-header">
          <h2>Recommended for You</h2>
          <button className="view-all">View all →</button>
        </div>

        <div className="jobs-grid">
          {recommendedJobs.length === 0 ? (
            <p style={{ textAlign: "center", width: "100%" }}>
              No recommended jobs found
            </p>
          ) : (
            recommendedJobs.map((job) => (
              <div
                key={job.id}
                className="job-card"
                onClick={() => handleJobClick(job)}
                style={{ cursor: "pointer" }}
              >
                {/* HEADER */}
                <div className="job-card-header">
                  <div className="company-logo">
                    {job.company?.charAt(0) || "C"}
                  </div>

                  <button
                    className="save-btn"
                    onClick={(e) => handleSaveJob(job.id, e)}
                  >
                    <Bookmark
                      size={18}
                      fill={savedJobs.has(job.id) ? "#4F46E5" : "none"}
                      color={savedJobs.has(job.id) ? "#4F46E5" : "currentColor"}
                    />
                  </button>
                </div>

                {/* TITLE */}
                <h3 className="job-title">{job.title}</h3>
                <p className="company-name">{job.company}</p>

                {/* DETAILS */}
                <div className="job-details">
                  <span className="job-detail">
                    <MapPin size={14} />
                    {job.location}
                  </span>

                  <span className="job-detail">
                    <DollarSign size={14} />
                    {job.salary || "Not Disclosed"}
                  </span>

                  <span className="job-detail">
                    <Clock size={14} />
                    {job.job_type || "N/A"}
                  </span>
                </div>

                {/* FOOTER */}
                <div className="job-footer">
                  <span className="posted-time">
                    {job.created_at
                      ? new Date(job.created_at).toLocaleDateString()
                      : "Recently"}
                  </span>

                  <button
                    className="apply-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJobClick(job);
                    }}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
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