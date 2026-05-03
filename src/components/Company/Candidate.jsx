import React, { useEffect, useState } from "react";
import {
  IconSearch,
  IconUsers,
  IconStar,
  IconCalendar,
  StatCard,
  Badge,
} from "./CompanyShared";

export default function CandidateContent() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  // const [loadingId, setLoadingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCandidates = async () => {
    // setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/api/company/applicants/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setCandidates(data);
    } catch (err) {
      console.error(err);
    } 
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

 
  const updateStatus = async (id, status) => {
  setLoadingId(id);   // 🔥 START LOADING

  try {
    const token = localStorage.getItem("token");

    await fetch("http://localhost:8000/api/company/update-status/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        application_id: id,
        status: status,
      }),
    });

    fetchCandidates();
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingId(null);  
  }
};
  // 🔍 FILTER SEARCH
  const filteredCandidates = candidates.filter((c) =>
    c.job_title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      {/* HEADER */}
      <div className="section-header">
        <div>
          <h1>Applicants</h1>
          <p>Students who applied to your jobs</p>
        </div>

        <div className="search-wrapper">
          <IconSearch className="search-icon" width={18} height={18} />
          <input
            type="text"
            placeholder="Search candidates/Jobs"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* STATS */}
      <div className="stats-row-small">
        <StatCard
          icon={IconUsers}
          title="Total Applications"
          value={candidates.length}
          colorClass="blue"
        />
        <StatCard
          icon={IconStar}
          title="Accepted"
          value={candidates.filter((c) => c.status === "accepted").length}
          colorClass="emerald"
        />
        <StatCard
          icon={IconCalendar}
          title="Pending"
          value={candidates.filter((c) => c.status === "pending").length}
          colorClass="amber"
        />
      </div>

      {/* TABLE */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Job</th>
              <th>Email</th>
              <th>Resume</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCandidates.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No applicants found
                </td>
              </tr>
            ) : (
              filteredCandidates.map((c) => (
                <tr key={c.id}>
                  {/* NAME */}
                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "#e2e8f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {c.student_name?.charAt(0)}
                      </div>
                      {c.student_name}
                    </div>
                  </td>

                  {/* JOB */}
                  <td>{c.job_title}</td>

                  {/* EMAIL */}
                  <td>{c.email}</td>

                  {/* RESUME */}
                  <td>
                    {c.resume ? (
                      <a
                        href={c.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="action-btn"
                      >
                        View
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>

                  {/* STATUS */}
                  <td>
                    <Badge status={c.status} />
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="action-btn"
                        onClick={() => updateStatus(c.id, "accepted")}
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="spinner"></span>
                        ) : (
                          "Accept"
                        )}
                      </button>

                      <button
                        className="action-btn"
                        style={{ color: "#ef4444" }}
                        onClick={() => updateStatus(c.id, "rejected")}
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="spinner"></span>
                        ) : (
                          "Reject"
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
