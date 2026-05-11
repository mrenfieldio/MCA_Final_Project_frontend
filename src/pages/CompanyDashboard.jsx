import React, { useState, useEffect } from "react";
import DashboardContent from "../components/Company/DashboardContent";
import JobContent from "../components/Company/JobContent";
import CandidateContent from "../components/Company/Candidate";
import AnalyticsContent from "../components/Company/Analysis";
import SettingsContent from "../components/Company/RenderSetting";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/company.css";

import {
  IconChartLine,
  IconUsers,
  IconChartPie,
  IconSettings,
  IconUserCircle,
  IconBriefcase,
} from "../components/Company/CompanyShared";

const CompanyDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const page = searchParams.get('page');
    const validPages = ["dashboard", "jobs", "candidates", "analytics", "settings"];
    return validPages.includes(page) ? page : 'dashboard';
  });

  const handleSetActiveTab = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ page: newTab });
  };

  const [showPostModal, setShowPostModal] = useState(false);
  const [company, setCompany] = useState(null);
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    title: "",
    location: "",
    job_type: "",
    work_mode: "",
    skills: "",
    experience: "",
    qualification: "",
    salary: "",
    deadline: "",
    description: "",
  });
  // console.log(jobData, "jobdata");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/auth", { replace: true });
  };

  const fetchCompanyDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/company/profile/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch company data");
      }

      const data = await response.json();
      setCompany(data);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };
  const handlePostJob = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/company/create_jobs/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(jobData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("Job posted successfully!");

        setShowPostModal(false);

        // reset form
        setJobData({
          title: "",
          location: "",
          job_type: "",
          work_mode: "",
          skills: "",
          experience: "",
          qualification: "",
          salary: "",
          deadline: "",
          description: "",
        });
      } else {
        console.error(data);
        alert("Error posting job");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-wrapper">
            <div className="logo-icon">
              <IconBriefcase width={22} height={22} />
            </div>

            <div className="logo-text">
              {/* 🔥 DYNAMIC COMPANY NAME */}
              <h1>Link Pro</h1>
              <p>for enterprises</p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="nav-menu">
          {[
            { id: "dashboard", label: "Dashboard", icon: IconChartLine },
            { id: "jobs", label: "My Jobs", icon: IconBriefcase },
            { id: "candidates", label: "Candidates", icon: IconUsers },
            { id: "analytics", label: "Analytics", icon: IconChartPie },
            { id: "settings", label: "Settings", icon: IconSettings },
          ].map((item) => (
            <div key={item.id} className="nav-item">
              <button
                className={`nav-button ${
                  activeTab === item.id ? "active" : ""
                }`}
                onClick={() => handleSetActiveTab(item.id)}
              >
                <item.icon />
                <span>{item.label}</span>
              </button>
            </div>
          ))}

          {/* 🔥 LOGOUT BUTTON */}
          <div className="nav-item">
            <button className="nav-button logout-btn" onClick={handleLogout}>
              <IconUserCircle />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        {/* SUPPORT */}
        <div className="support-card">
          <IconUserCircle width={32} height={32} />
          <div className="support-text">
            <p>Support</p>
            <p>Need help?</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {activeTab === "dashboard" && (
          <DashboardContent
            setShowPostModal={setShowPostModal}
            setActiveTab={handleSetActiveTab}
            company={company}
          />
        )}

        {activeTab === "jobs" && (
          <JobContent setShowPostModal={setShowPostModal} />
        )}

        {activeTab === "candidates" && <CandidateContent />}

        {activeTab === "analytics" && <AnalyticsContent />}

        {activeTab === "settings" && <SettingsContent company={company} />}
      </main>

      {/* MODAL */}
      {showPostModal && (
        <div className="modal-overlay" onClick={() => setShowPostModal(false)}>
          <div
            className="modal-content scrollable-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Post a New Job</h2>

            {/* 🔥 FORM */}
            <form onSubmit={handlePostJob}>
              <input
                type="text"
                placeholder="Job Title"
                className="modal-input"
                value={jobData.title}
                onChange={(e) =>
                  setJobData({ ...jobData, title: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Location"
                className="modal-input"
                value={jobData.location}
                onChange={(e) =>
                  setJobData({ ...jobData, location: e.target.value })
                }
                required
              />

              {/* Qualification */}
              {/* Qualification */}
              <input
                type="text"
                placeholder="Required Qualification (e.g. B.Tech, MBA, Any)"
                className="modal-input"
                value={jobData.qualification}
                onChange={(e) =>
                  setJobData({ ...jobData, qualification: e.target.value })
                }
                required
              />

              {/* Job Type */}
              <select
                className="modal-input"
                value={jobData.job_type}
                onChange={(e) =>
                  setJobData({ ...jobData, job_type: e.target.value })
                }
                required
              >
                <option value="">Select Job Type</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="internship">Internship</option>
              </select>

              {/* Work Mode */}
              <select
                className="modal-input"
                value={jobData.work_mode}
                onChange={(e) =>
                  setJobData({ ...jobData, work_mode: e.target.value })
                }
                required
              >
                <option value="">Work Mode</option>
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
              </select>

              <input
                type="text"
                placeholder="Skills (e.g. Python, React)"
                className="modal-input"
                value={jobData.skills}
                onChange={(e) =>
                  setJobData({ ...jobData, skills: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Experience (e.g. 2+ years)"
                className="modal-input"
                value={jobData.experience}
                onChange={(e) =>
                  setJobData({ ...jobData, experience: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Salary / Stipend"
                className="modal-input"
                value={jobData.salary}
                onChange={(e) =>
                  setJobData({ ...jobData, salary: e.target.value })
                }
              />

              <input
                type="date"
                className="modal-input"
                value={jobData.deadline}
                onChange={(e) =>
                  setJobData({ ...jobData, deadline: e.target.value })
                }
                required
              />

              <textarea
                placeholder="Job Description"
                rows="4"
                className="modal-textarea"
                value={jobData.description}
                onChange={(e) =>
                  setJobData({ ...jobData, description: e.target.value })
                }
                required
              ></textarea>

              {/* ACTIONS */}
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="modal-cancel"
                >
                  Cancel
                </button>

                <button type="submit" className="modal-submit">
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;
