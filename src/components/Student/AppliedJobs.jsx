export default function AppliedJobsContent({ appliedJobs }) {
  return (
    <div className="applied-jobs-content">

      <div className="section-header">
        <h2>Your Applications</h2>
        {/* <p>Track the status of all jobs you've applied to</p> */}
      </div>

      {/* ✅ Empty state */}
      {appliedJobs.length === 0 ? (
        <p>No jobs applied yet.</p>
      ) : (
        <div className="applications-list">
          {appliedJobs.map((item) => {
            const job = item.job;

            return (
              <div key={item.id} className="application-card">

                {/* Logo (first letter fallback) */}
                <div className="application-logo">
                  {job?.title?.charAt(0) || "J"}
                </div>

                <div className="application-info">
                  <h3>{job?.title}</h3>
                  <p>{job?.company}</p>

                  <div className="application-meta">
                    <span className="applied-date">
                      Applied: {item.applied_at}
                    </span>

                    <span
                      className={`status-badge status-${item.status
                        ?.toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                <button className="view-details-btn">
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}