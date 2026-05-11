import { useState, useEffect } from "react";

import {
  SectionHeader,
  StatusBadge,
} from "./AdminShared";

const JOB_TYPE_CLASS = {

  "full-time": "fulltime",

  "freelance": "freelance",

  "intern": "intern",
};

export default function JobsPage() {

  const [jobs, setJobs] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

 
  useEffect(() => {

    fetchJobs();

  }, []);

  const fetchJobs = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/administrator/jobs/",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setJobs(data);

    } catch (error) {

      console.error(
        "Error fetching jobs:",
        error
      );

    } finally {

      setLoading(false);
    }
  };


  const filtered = jobs.filter((j) =>

    j.title
      .toLowerCase()
      .includes(search.toLowerCase())

    ||

    j.company
      .toLowerCase()
      .includes(search.toLowerCase())
  );

 
  const toggleStatus = async (
    id,
    currentStatus
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      const newStatus =
        currentStatus === "active"
          ? "closed"
          : "active";

      await fetch(
        `http://localhost:8000/api/administrator/jobs/${id}/status/`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      setJobs((prev) =>
        prev.map((j) =>
          j.id === id
            ? {
                ...j,
                status: newStatus,
              }
            : j
        )
      );

    } catch (error) {

      console.error(
        "Status update failed:",
        error
      );
    }
  };


  const removeJob = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this job?"
      );

    if (!confirmDelete) return;

    try {

      const token =
        localStorage.getItem("token");

      await fetch(
        `http://localhost:8000/api/administrator/jobs/${id}/`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setJobs((prev) =>
        prev.filter((j) => j.id !== id)
      );

    } catch (error) {

      console.error(
        "Delete failed:",
        error
      );
    }
  };

  return (
    <div>

      <SectionHeader
        title="Jobs"
        subtitle={`${jobs.length} listings · ${
          jobs.filter(
            (j) => j.status === "active"
          ).length
        } active`}
      />

      {/* 🔥 SEARCH */}
      <div className="filter-bar">

        <input
          className="search-input"
          placeholder="Search jobs or companies..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* 🔥 JOB GRID */}
      <div className="jobs-grid">

        {loading ? (

          <p>Loading jobs...</p>

        ) : filtered.length === 0 ? (

          <p>No jobs found</p>

        ) : (

          filtered.map((j) => (

            <div
              key={j.id}
              className="job-card"
            >

              {/* 🔥 TOP */}
              <div className="job-card-top">

                <span
                  className={`type-badge ${
                    JOB_TYPE_CLASS[j.type]
                  }`}
                >
                  {j.type}
                </span>

                <StatusBadge
                  status={j.status}
                />

              </div>

              {/* 🔥 TITLE */}
              <p className="job-title">
                {j.title}
              </p>

              {/* 🔥 COMPANY */}
              <p className="job-company">
                {j.company}
              </p>

              {/* 🔥 META */}
              <div className="job-meta">

                <span className="job-meta-item">
                  📍 {j.location}
                </span>

                <span className="job-meta-item">
                  🕐 {j.posted}
                </span>

              </div>

              {/* 🔥 BOTTOM */}
              <div className="job-card-bottom">

                <span className="job-applicants">
                  {j.apps} applicants
                </span>

                <div className="action-row">

                  <button
                    className={`action-btn ${
                      j.status === "active"
                        ? "close"
                        : "reopen"
                    }`}
                    onClick={() =>
                      toggleStatus(
                        j.id,
                        j.status
                      )
                    }
                  >
                    {j.status === "active"
                      ? "Close"
                      : "Reopen"}
                  </button>

                  <button
                    className="action-btn delete"
                    onClick={() =>
                      removeJob(j.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))
        )}

      </div>

    </div>
  );
}