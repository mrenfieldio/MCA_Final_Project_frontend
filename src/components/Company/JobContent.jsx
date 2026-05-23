import React, { useEffect, useState } from "react";
import { IconPlus } from "./CompanyShared";

export default function JobContent({ setShowPostModal }) {
  const [jobs, setJobs] = useState([]);
  console.log("JobContent component rendered");

  // 🔥 EDIT STATE
  const [editJob, setEditJob] = useState(null);
  const [form, setForm] = useState({});

  const [loading, setLoading] = useState(false);

  const fetchCompanyJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      console.log("Fetching jobs with token:", token ? "present" : "missing");
      console.log("User role:", role);

      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await fetch(
        "http://localhost:8000/api/company/job_list/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("API response status:", response.status);

      if (!response.ok) {
        console.error(
          "API request failed:",
          response.status,
          response.statusText,
        );
        return;
      }

      const data = await response.json();
      console.log("API response data:", data);
      console.log("Setting jobs state with", data.length, "jobs");
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    console.log("JobContent mounted: fetching jobs");
    fetchCompanyJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const token = localStorage.getItem("token");

      await fetch("http://localhost:8000/api/company/job_list/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ job_id: jobId }),
      });

      fetchCompanyJobs(); // 🔥 refresh
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    console.log("Jobs state changed:", jobs.length, "jobs");
  }, [jobs]);

  // Initialize form when editJob changes
  useEffect(() => {
    if (editJob) {
      console.log("Initializing form for job:", editJob);

      // Format deadline for date input (YYYY-MM-DD)
      const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      const formData = {
        title: editJob.title || "",
        description: editJob.description || "",
        location: editJob.location || "",
        job_type: editJob.job_type || "",
        work_mode: editJob.work_mode || "",
        qualification: editJob.qualification || "",
        skills: editJob.skills || "",
        experience: editJob.experience || "",
        salary: editJob.salary || "",
        deadline: formatDate(editJob.deadline) || "",
      };

      console.log("Setting form data:", formData);
      setForm(formData);
    }
  }, [editJob]);

  const openEdit = (job) => {
    console.log("Opening edit for job:", job);
    setEditJob(job);
  };

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await fetch("http://localhost:8000/api/company/job_list/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          job_id: editJob.id,
          ...form,
        }),
      });

      setEditJob(null);
      fetchCompanyJobs();
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="section-header">
        <div>
          <h1>Manage Jobs</h1>
          <p>Post, edit, or pause job listings</p>
        </div>

        <button className="primary-btn" onClick={() => setShowPostModal(true)}>
          <IconPlus width={18} height={18} /> Create Job
        </button>
      </div>

      {/* TABLE */}
      <div className="table-container">
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
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No jobs posted yet
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.location}</td>
                  <td>{job.job_type}</td>
                  <td>{job.stipend}</td>
                  <td>{job.deadline}</td>

                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="action-btn"
                        onClick={() => openEdit(job)}
                      >
                        Edit
                      </button>

                      <button
                        className="action-btn"
                        style={{ color: "red" }}
                        onClick={() => handleDelete(job.id)}
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

      {editJob && (
        <div className="modal-overlay">
          <div className="modal modern-modal" key={editJob.id}>
            {/* HEADER */}
            <div className="modal-header">
              <div>
                <h3>Edit Opportunity</h3>
                <p className="modal-subtitle">
                  Update internship or freelance details
                </p>
              </div>

              <button className="modal-close" onClick={() => setEditJob(null)}>
                ×
              </button>
            </div>

            {/* BODY */}
            <div className="modal-body">
              {/* TITLE */}
              <div className="form-group">
                <label>Opportunity Title</label>

                <input
                  type="text"
                  className="modal-input"
                  placeholder="Frontend Developer Intern"
                  value={form.title || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              {/* DESCRIPTION */}
              <div className="form-group">
                <label>Description</label>

                <textarea
                  className="modal-textarea"
                  placeholder="Describe the opportunity..."
                  rows="4"
                  value={form.description || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              {/* LOCATION + TYPE */}
              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>

                  <input
                    type="text"
                    className="modal-input"
                    placeholder="Bengaluru"
                    value={form.location || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        location: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Opportunity Type</label>

                  <select
                    className="modal-input"
                    value={form.job_type || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        job_type: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Type</option>

                    <option value="internship">Internship</option>

                    <option value="freelance">Freelance</option>

                    <option value="part-time">Part Time</option>

                    <option value="full-time">Full Time</option>
                  </select>
                </div>
              </div>

              {/* WORK MODE + QUALIFICATION */}
              <div className="form-row">
                <div className="form-group">
                  <label>Work Mode</label>

                  <select
                    className="modal-input"
                    value={form.work_mode || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        work_mode: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Work Mode</option>

                    <option value="onsite">Onsite</option>

                    <option value="remote">Remote</option>

                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Qualification</label>

                  <input
                    type="text"
                    className="modal-input"
                    placeholder="B.Tech, MCA, MBA"
                    value={form.qualification || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        qualification: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* SKILLS */}
              <div className="form-group">
                <label>Required Skills</label>

                <input
                  type="text"
                  className="modal-input"
                  placeholder="Python, React, Django"
                  value={form.skills || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      skills: e.target.value,
                    })
                  }
                />
              </div>

              {/* DURATION + PAYMENT */}
              <div className="form-row">
                <div className="form-group">
                  <label>Duration</label>

                  <select
                    className="modal-input"
                    value={form.duration || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        duration: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Duration</option>

                    <option value="1">1 Month</option>

                    <option value="2">2 Months</option>

                    <option value="3">3 Months</option>

                    <option value="6">6 Months</option>

                    <option value="12">12 Months</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Payment Type</label>

                  <select
                    className="modal-input"
                    value={form.payment_type || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        payment_type: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Payment</option>

                    <option value="paid">Paid</option>

                    <option value="unpaid">Unpaid</option>

                    <option value="performance_based">Performance Based</option>

                    <option value="commission">Commission Based</option>
                  </select>
                </div>
              </div>

              {/* STIPEND */}
              {form.payment_type === "paid" && (
                <div className="form-group">
                  <label>Stipend Amount</label>

                  <input
                    type="text"
                    className="modal-input"
                    placeholder="₹15000 / month"
                    value={form.stipend || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        stipend: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              {/* DEADLINE */}
              <div className="form-group">
                <label>Application Deadline</label>

                <input
                  type="date"
                  className="modal-input"
                  value={form.deadline || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      deadline: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setEditJob(null)}>
                Cancel
              </button>

              <button
                className="modal-submit"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Opportunity"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
