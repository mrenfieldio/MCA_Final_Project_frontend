import React, { useEffect, useState } from "react";
import {
  IconPlus,
  IconBuilding,
  Badge,
} from "./CompanyShared";

export default function JobContent({ setShowPostModal }) {

  const [jobs, setJobs] = useState([]);

  // 🔥 FETCH COMPANY JOBS
  const fetchCompanyJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/company/job_list/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setJobs(data);
    //   console.log(data,"jello");
      
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // 🔥 LOAD DATA
  useEffect(() => {
    fetchCompanyJobs();
  }, []);

  return (
    <div>

      {/* HEADER */}
      <div className="section-header">
        <div>
          <h1>Manage Jobs</h1>
          <p>Post, edit, or pause job listings</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowPostModal(true)}
        >
          <IconPlus width={18} height={18} /> Create Job
        </button>
      </div>

      {/* TABLE */}
      <div className="table-container">
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">

            <thead>
              <tr>
                <th>Job Title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Salary</th>
                <th>Deadline</th>
                <th></th>
              </tr>
            </thead>

            <tbody>

              {jobs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                    No jobs posted yet
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <div>
                        <p style={{ fontWeight: 500 }}>{job.title}</p>
                        <p style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                          {job.skills}
                        </p>
                      </div>
                    </td>

                    <td>{job.location}</td>

                    <td>{job.job_type}</td>

                    <td>{job.salary}</td>

                    <td style={{ color: "#94a3b8" }}>
                      {job.deadline}
                    </td>

                    <td>
                      <div className="flex gap-2">
                        <button className="action-btn">Edit</button>
                        <button
                          className="action-btn"
                          style={{ color: "#64748b" }}
                        >
                          Delete
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

      {/* PROMO */}
      {/* <div className="promo-banner">
        <IconBuilding
          width={32}
          height={32}
          style={{ margin: "0 auto", color: "#4f46e5" }}
        />
        <h3>Reach top talent with sponsored jobs</h3>
        <button className="promo-btn">Boost visibility</button>
      </div> */}
    </div>
  );
}