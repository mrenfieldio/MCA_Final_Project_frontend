import React, { useState, useEffect } from "react";
import DashboardContent from "../components/Company/DashboardContent";
import JobContent from "../components/Company/JobContent";
import CandidateContent from "../components/Company/Candidate";
import AnalyticsContent from "../components/Company/Analysis";
import SettingsContent from "../components/Company/RenderSetting";
import SelectedStudentsContent from "../components/Company/SelectedCandidatesContent";
import InternshipDetailPage from "../components/Company/IntershipDetailPage";
import Payment from "../components/Company/Payment";
import CompanyMessagingPage from "../components/Company/CompanyMessagingPage";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/company.css";
import { ChevronDown, UserCheck, MessageCircle } from "lucide-react";
import {
  IconChartLine,
  IconUsers,
  IconChartPie,
  IconSettings,
  IconUserCircle,
  IconBriefcase,
} from "../components/Company/CompanyShared";
import { IconBellDollar, IconEyeDollar } from "@tabler/icons-react";

const CompanyDashboard = () => {
  const [candidatesOpen, setCandidatesOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: IconChartLine },
    { id: "jobs", label: "My Jobs", icon: IconBriefcase },
    {
      id: "candidates",
      label: "Candidates",
      icon: IconUsers,
      subItems: [
        { id: "candidates", label: "Applied students", icon: IconUsers },
        {
          id: "selected-students",
          label: "Selected students",
          icon: UserCheck,
        },
      ],
    },
    { id: "analytics", label: "Analytics", icon: IconChartPie },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "payment", label: "Payment", icon: IconBellDollar },
    { id: "settings", label: "Settings", icon: IconSettings },
  ];
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get("page");
  const validPages = [
    "dashboard",
    "jobs",
    "candidates",
    "analytics",
    "settings",
    "selected-students",
    "internship-detail",
    "messages",
    "payment",
  ];
  const activeTab = validPages.includes(page) ? page : "dashboard";

  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const fetchUnreadMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/company/unread-messages/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUnreadMessagesCount(data.unread_count);
      }
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  };

  const handleSetActiveTab = (newTab) => {
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
    fetchUnreadMessages();
    
    // Optional: Refresh count periodically or when tab changes
    const interval = setInterval(fetchUnreadMessages, 10000);
    return () => clearInterval(interval);
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
          {navItems.map((item) => (
            <div key={item.id} className="nav-item">
              <button
                className={`nav-button ${
                  activeTab === "candidates" ||
                  activeTab === "selected-students"
                    ? item.id === "candidates"
                      ? "active"
                      : ""
                    : activeTab === item.id
                      ? "active"
                      : ""
                }`}
                onClick={() => {
                  if (item.subItems) {
                    setCandidatesOpen((prev) => !prev); // only toggle, no tab change
                  } else {
                    handleSetActiveTab(item.id);
                  }
                }}
              >
                <item.icon />
                <span>{item.label}</span>
                {item.id === "messages" && unreadMessagesCount > 0 && (
                  <span className="unread-badge">{unreadMessagesCount}</span>
                )}
                {item.subItems && (
                  <ChevronDown
                    className={`submenu-chevron ${candidatesOpen ? "open" : ""}`}
                  />
                )}
              </button>

              {item.subItems && candidatesOpen && (
                <div className="sub-menu">
                  {item.subItems.map((sub) => (
                    <button
                      key={sub.id}
                      className={`sub-nav-button ${activeTab === sub.id ? "active" : ""}`}
                      onClick={() => handleSetActiveTab(sub.id)}
                    >
                      <sub.icon />
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

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

        {activeTab === "selected-students" && <SelectedStudentsContent />}

        {activeTab === "analytics" && <AnalyticsContent />}

        {activeTab === "payment" && <Payment />}

        {activeTab === "settings" && <SettingsContent company={company} />}

        {activeTab === "messages" && <CompanyMessagingPage />}

        {activeTab === "internship-detail" && <InternshipDetailPage />}
      </main>

      {/* MODAL */}
      {showPostModal && (
        <div className="modal-overlay" onClick={() => setShowPostModal(false)}>
          <div
            className="modal-content scrollable-modal"
            onClick={(e) => e.stopPropagation()}
          >
          

            <div className="modal-header">
              <div>
                <h2>Post New Opportunity</h2>

                {/* <p>Create internship or freelance opportunities</p> */}
              </div>

              <button
                className="close-modal-btn"
                onClick={() => setShowPostModal(false)}
              >
                ✕
              </button>
            </div>

          

            <form onSubmit={handlePostJob}>
              {/* JOB TITLE */}
              <div className="form-group">
                <label>Opportunity Title</label>

                <input
                  type="text"
                  placeholder="Frontend Developer Intern"
                  className="modal-input"
                  value={jobData.title}
                  onChange={(e) =>
                    setJobData({
                      ...jobData,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* LOCATION */}
              <div className="form-group">
                <label>Location</label>

                <input
                  type="text"
                  placeholder="Bengaluru"
                  className="modal-input"
                  value={jobData.location}
                  onChange={(e) =>
                    setJobData({
                      ...jobData,
                      location: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* QUALIFICATION */}
              <div className="form-group">
                <label>Qualification</label>

                <input
                  type="text"
                  placeholder="B.Tech, MCA, MBA, Any"
                  className="modal-input"
                  value={jobData.qualification}
                  onChange={(e) =>
                    setJobData({
                      ...jobData,
                      qualification: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* JOB TYPE */}
              <div className="form-group">
                <label>Opportunity Type</label>

                <select
                  className="modal-input"
                  value={jobData.job_type}
                  onChange={(e) =>
                    setJobData({
                      ...jobData,
                      job_type: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Type</option>

                  <option value="internship">Internship</option>

                  <option value="freelance">Freelance</option>

                  <option value="part-time">Part Time</option>

                  <option value="full-time">Full Time</option>
                </select>
              </div>

              {/* WORK MODE */}
              <div className="form-group">
                <label>Work Mode</label>

                <select
                  className="modal-input"
                  value={jobData.work_mode}
                  onChange={(e) =>
                    setJobData({
                      ...jobData,
                      work_mode: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Mode</option>

                  <option value="remote">Remote</option>

                  <option value="onsite">Onsite</option>

                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              {/* SKILLS */}
              <div className="form-group">
                <label>Required Skills</label>

                <input
                  type="text"
                  placeholder="Python, React, Django"
                  className="modal-input"
                  value={jobData.skills}
                  onChange={(e) =>
                    setJobData({
                      ...jobData,
                      skills: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* DURATION */}
              <div className="form-group">
                <label>Internship Duration</label>

                <select
                  className="modal-input"
                  value={jobData.duration}
                  onChange={(e) =>
                    setJobData({
                      ...jobData,
                      duration: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Duration</option>

                  <option value="1">1 Month</option>

                  <option value="2">2 Months</option>

                  <option value="3">3 Months</option>

                  <option value="6">6 Months</option>

                  <option value="12">12 Months</option>
                </select>
              </div>

              {/* PAYMENT TYPE */}
              <div className="form-group">
                <label>Payment Type</label>

                <select
                  className="modal-input"
                  value={jobData.payment_type}
                  onChange={(e) =>
                    setJobData({
                      ...jobData,
                      payment_type: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Payment Type</option>

                  <option value="paid">Paid</option>

                  <option value="unpaid">Unpaid</option>

                  <option value="performance_based">Performance Based</option>

                  <option value="commission">Commission Based</option>
                </select>
              </div>

              {/* STIPEND */}
              {jobData.payment_type === "paid" && (
                <div className="form-group">
                  <label>Stipend Amount</label>

                  <input
                    type="text"
                    placeholder="₹ 15000 / month"
                    className="modal-input"
                    value={jobData.stipend}
                    onChange={(e) =>
                      setJobData({
                        ...jobData,
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
                  value={jobData.deadline}
                  onChange={(e) =>
                    setJobData({
                      ...jobData,
                      deadline: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div className="form-group">
                <label>Opportunity Description</label>

                <textarea
                  placeholder="Describe internship responsibilities..."
                  rows="5"
                  className="modal-textarea"
                  value={jobData.description}
                  onChange={(e) =>
                    setJobData({
                      ...jobData,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>

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
                  Publish Opportunity
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
