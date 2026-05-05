import { useState } from "react";
import JobModal from "./JobModal";
import { getTimeAgo } from "../../utils/TimeFormat";

export default function AppliedJobsContent({
  appliedJobs = [],
  savedJobs = [],
  handleJobClick,
}) {
  const [activeTab, setActiveTab] = useState("applied");

  const interviewJobs = appliedJobs.filter(
    (item) => item.status === "interview" || item.status === "shortlisted",
  );

  const getJobs = () => {
    if (activeTab === "applied") return appliedJobs;
    if (activeTab === "saved") return savedJobs;
    if (activeTab === "interview") return interviewJobs;
    return [];
  };
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const jobsToShow = getJobs();

  return (
    <div className="applied-jobs-content">
      <div className="section-header">
        <h2>My Jobs</h2>
      </div>

      <div className="tabs">
        <button
          className={activeTab === "applied" ? "active" : ""}
          onClick={() => setActiveTab("applied")}
        >
          Applied ({appliedJobs.length})
        </button>

        <button
          className={activeTab === "saved" ? "active" : ""}
          onClick={() => setActiveTab("saved")}
        >
          Saved ({savedJobs.length})
        </button>

        {/* <button
          className={activeTab === "interview" ? "active" : ""}
          onClick={() => setActiveTab("interview")}
        >
          Interviews ({interviewJobs.length})
        </button> */}
      </div>

      {jobsToShow.length === 0 ? (
        <div className="empty-state">
          <p>No jobs found in this section.</p>
        </div>
      ) : (
        <div className="applications-list">
          {jobsToShow.map((item) => {
            const job = item.job || item;

            return (
              <div key={item.id || job.id} className="application-card">
                {/* LOGO */}
                {/* <div className="application-logo">
                  {job?.title?.charAt(0) || "J"}
                </div> */}

                {/* INFO */}
                <div className="application-info">
                  <h3>{job?.title}</h3>
                  <p>{job?.company}</p>


                  <div className="application-meta">
                    {/* DATE */}
                    {(item.applied_at || item.saved_at || job.created_at) && (
                      <span className="applied-date">
                        {item.applied_at 
                          ? `Applied: ${getTimeAgo(item.applied_at)}` 
                          : item.saved_at 
                          ? `Saved: ${getTimeAgo(item.saved_at)}` 
                          : `Posted: ${getTimeAgo(job.created_at)}`}
                      </span>
                    )}

                    {/* STATUS */}
                    {item.status && (
                      <span className={`status-badge status-${item.status}`}>
                        {item.status}
                      </span>
                    )}
                  </div>

                  {item.status === "assessment" && item.assessment_link && (
                    <a
                      href={item.assessment_link}
                      target="_blank"
                      className="action-link"
                    >
                      Start Assessment
                    </a>
                  )}

                  {item.status === "interview" && item.interview_date && (
                    <p className="interview-date">
                      Interview:{" "}
                      {new Date(item.interview_date).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* ACTION */}
                <button
                  className="view-details-btn"
                  onClick={() => {
                    setSelectedJob(job);
                    setShowModal(true);
                  }}
                >
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      )}

      {showModal && selectedJob && (
        <JobModal 
          job={selectedJob} 
          isOpen={true}
          onClose={() => {
            setSelectedJob(null);
            setShowModal(false);
          }} 
        />
      )}
    </div>
  );
}
