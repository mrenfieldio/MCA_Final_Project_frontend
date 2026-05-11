import React from "react";
import { useEffect, useState } from "react";
import PaymentButton from "../../components/PaymentButton";
import {
  IconClock,
  IconBriefcase,
  IconUsers,
  IconCalendar,
  IconStar,
  IconPlus,
  IconMapPin,
  IconEye,
  IconEdit,
  StatCard,
  Badge,
  companyName,
  statsData,
  jobsList,
  applicantsRecent,
} from "./CompanyShared";

export default function DashboardContent({
  setShowPostModal,
  setActiveTab,
  company,
}) {
  const [stats, setStats] = useState({});
  const [jobs, setJobs] = useState([]);
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/api/company/dashboard/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setStats(data.stats);
      setJobs(data.jobs);
      setRecentCandidates(data.recent_candidates);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="welcome-header">
        <div className="welcome-title">
          <h1>Welcome, {company?.company_name || "Loading..."}</h1>
          {/* <p>
            <IconClock width={14} height={14} />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p> */}
        </div>
        <div className="company-badge">
          <div className="company-avatar">
            {company?.company_name
              ? company.company_name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "?"}
          </div>
          <div className="company-info">
            <p>{company?.company_name || "Loading..."}</p>
            <p>Premium Plan</p>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={IconBriefcase}
          title="Active Jobs"
          value={stats.active_jobs || 0}
          colorClass="blue"
        />

        <StatCard
          icon={IconUsers}
          title="Total Applicants"
          value={stats.total_applicants || 0}
          colorClass="emerald"
        />

        <StatCard
          icon={IconCalendar}
          title="Interviews"
          value={stats.interviews || 0}
          colorClass="amber"
        />

        <StatCard
          icon={IconStar}
          title="Shortlisted"
          value={stats.shortlisted || 0}
          colorClass="purple"
        />
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Active Openings</h2>
          <PaymentButton setShowPostModal={setShowPostModal} />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Title</th>
                {/* <th>Department</th> */}
                <th>Location</th>
                <th>Applicants</th>
                <th>Status</th>
                <th>Posted</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td style={{ fontWeight: 500 }}>{job.title}</td>
                  {/* <td>{job.dept}</td> */}
                    <td>
                      {job.location}
                    </td>
                    <td>{job.applicants}</td>
                    <td>
                      <Badge status={job.status} />
                    </td>
                    <td style={{ color: "#94a3b8" }}>{job.posted}</td>
                    <td>
                      {/* <button className="action-btn">
                        <IconEye width={14} height={14} /> View
                      </button> */}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="table-container" style={{ padding: "20px" }}>
        <h3 style={{ fontWeight: "bold", marginBottom: "16px" }}>
          Recent Top Candidates
        </h3>
        <div className="candidates-grid">
          {recentCandidates.map((app, idx) => (
            <div key={idx} className="candidate-card">
              {/* <div className="candidate-avatar">{app.avatar}</div> */}
              <div className="candidate-info">
                <p className="candidate-name">{app.name}</p>
                <p className="candidate-role">
                  {app.role} • {app.experience} exp
                </p>
                <div className="candidate-meta">
                  <Badge status={app.status} />
                  <span className="match-score">Match {app.score}%</span>
                </div>
              </div>
              <button className="edit-btn">
                <IconEdit width={16} height={16} />
              </button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            onClick={() => setActiveTab("candidates")}
            className="text-link"
          >
            View all candidates →
          </button>
        </div>
      </div>
    </>
  );
}
