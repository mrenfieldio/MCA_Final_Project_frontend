import React from "react";
import { MapPin, IndianRupee, Clock, Bookmark, BookmarkCheck } from "lucide-react";
import { getTimeAgo } from '../../utils/TimeFormat';

export default function JobCard({
  job,
  handleJobClick,
  handleSaveJob,
  savedJobs,
}) {
  const isSaved = savedJobs.has(job.id);

  return (
    <div
      className="job-card"
      onClick={() => handleJobClick(job)}
      style={{ cursor: "pointer", position: "relative" }}
    >
     
      <button
        className={`save-marker ${isSaved ? 'saved' : ''}`}
        onClick={(e) => {
          e.stopPropagation(); 
          handleSaveJob(job.id, e);
        }}
        title={isSaved ? "Remove from saved" : "Save job"}
      >
        {isSaved ? (
          <BookmarkCheck size={18} fill="#4F46E5" color="#4F46E5" />
        ) : (
          <Bookmark size={18} />
        )}
      </button>

      <h3 className="job-title">{job.title}</h3>
      <p className="company-name">{job.company}</p>

      {/* Upgraded to Pill Badges */}
      <div className="job-details">
        <span className="job-detail-badge">
          <MapPin size={14} color="#64748B" /> 
          {job.location || "Remote"}
        </span>
        <span className="job-detail-badge">
          <IndianRupee size={14} color="#64748B" /> 
          {job.salary || "Not Disclosed"}
        </span>
        <span className="job-detail-badge">
          <Clock size={14} color="#64748B" /> 
          {job.job_type || "Full-time"}
        </span>
      </div>

      <div className="job-footer">
        <span className="post-time">
          {job.created_at ? getTimeAgo(job.created_at) : "Recently"}
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
  );
}