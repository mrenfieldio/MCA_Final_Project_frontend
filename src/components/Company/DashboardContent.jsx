import React from "react";
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
  return (
    <>
      <div className="welcome-header">
        <div className="welcome-title">
          <h1>Welcome back, {company?.company_name || "Loading..."}</h1>
          <p>
            <IconClock width={14} height={14} />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
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
          value={statsData.activeJobs}
          trend="+2 vs last month"
          colorClass="blue"
        />
        <StatCard
          icon={IconUsers}
          title="Total Applicants"
          value={statsData.totalApplicants.toLocaleString()}
          trend="+12% increase"
          colorClass="emerald"
        />
        <StatCard
          icon={IconCalendar}
          title="Interviews"
          value={statsData.interviewsScheduled}
          trend="scheduled this week"
          colorClass="amber"
        />
        <StatCard
          icon={IconStar}
          title="Shortlisted"
          value={statsData.shortlisted}
          trend="awaiting feedback"
          colorClass="purple"
        />
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Active Openings</h2>
          <button
            className="primary-btn"
            onClick={() => setShowPostModal(true)}
          >
            <IconPlus width={16} height={16} /> Post new job
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Department</th>
                <th>Location</th>
                <th>Applicants</th>
                <th>Status</th>
                <th>Posted</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {jobsList
                .filter((job) => job.status === "active")
                .map((job) => (
                  <tr key={job.id}>
                    <td style={{ fontWeight: 500 }}>{job.title}</td>
                    <td>{job.dept}</td>
                    <td>
                      <IconMapPin width={12} height={12} /> {job.location}
                    </td>
                    <td>{job.applicants}</td>
                    <td>
                      <Badge status={job.status} />
                    </td>
                    <td style={{ color: "#94a3b8" }}>{job.posted}</td>
                    <td>
                      <button className="action-btn">
                        <IconEye width={14} height={14} /> View
                      </button>
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
          {applicantsRecent.map((app, idx) => (
            <div key={idx} className="candidate-card">
              <div className="candidate-avatar">{app.avatar}</div>
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
