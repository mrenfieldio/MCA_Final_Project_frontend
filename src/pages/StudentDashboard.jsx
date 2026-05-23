import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Student/Student_Navbar";
import DashboardContent from "../components/Student/DashboardContent";
import AppliedJobsContent from "../components/Student/AppliedJobs";
import ProfileContent from "../components/Student/ProfileContent";
import InternshipJourneyPage from "../components/Student/InternshipJourneyPage";
import MessagingPage from "../components/Student/MessagingPage";
import "../styles/student.css";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get('tab');
    const validTabs = ["dashboard", "applied", "profile", "internship", "messages"];
    return validTabs.includes(tab) ? tab : 'dashboard';
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [savedJobsList, setSavedJobsList] = useState([]);

  const handleSetActiveTab = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  // State for user data
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
    profileComplete: 0,
    skills: [],
    university: "",
    phone: "",
    bio: "",
    graduation_year: null,
    major: "",
    profile_picture: null,
    resume: null,
  });

  // Mock job recommendations (replace with API call)
  const [recommendedJobs, setRecommendedJobs] = useState([]);

  // Mock applied jobs (replace with API call)
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/student/apply-job/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      console.log("API DATA:", data); // 🔍 debug
      setAppliedJobs(data);
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    }
  };

  const fetchSavedJobs = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/api/student/saved-jobs/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    setSavedJobsList(data);

    // 🔥 store only IDs for icon state
    setSavedJobs(new Set(data.map((item) => item.job.id)));
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleSaveJob = async (jobId) => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/api/student/save-job/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ job_id: jobId }),
    });

    const data = await res.json();

    
    setSavedJobs((prev) => {
      const newSet = new Set(prev);

      if (data.saved) {
        newSet.add(jobId);
      } else {
        newSet.delete(jobId);
      }

      return newSet;
    });

    
    fetchSavedJobs();
  };

  // Mock notifications (replace with API call)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message:
        "Your application for Frontend Developer Intern at TechCorp has been viewed",
      time: "2 hours ago",
      read: false,
    },
    // ... more notifications
  ]);

  // Get CSRF token
  const getCSRFToken = () => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
    return cookieValue;
  };

  // Fetch student profile
  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        "http://localhost:8000/api/student/profile/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const userData = await response.json();

      // Generate avatar from name
      const getInitials = (name) => {
        return name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
      };

      setUser({
        name: userData.name,
        email: userData.email,
        avatar: getInitials(userData.name),
        profileComplete: userData.profile_complete_percentage || 0,
        skills: userData.skills || [],
        university: userData.university || "",
        phone: userData.phone || "",
        bio: userData.bio || "",
        graduation_year: userData.graduation_year || null,
        major: userData.major || "",
        profile_picture: userData.profile_picture || null,
        resume: userData.resume || null,
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching student profile:", err);
      setError(err.response?.data?.error || "Failed to load profile data");

      // If unauthorized, redirect to login
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/auth");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/student/recommended-jobs/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      setRecommendedJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchRecommendedJobs();
  }, []);

  // Route protection and data fetching
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "student") {
      navigate("/auth");
    } else {
      fetchStudentProfile();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
        <style>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid #E2E8F0;
            border-top-color: #4F46E5;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
        <style>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            text-align: center;
            background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
          }
          .error-container h2 {
            color: #DC2626;
            margin-bottom: 1rem;
          }
          .error-container button {
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background: #4F46E5;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        user={user}
        notifications={notifications}
        showNotifications={showNotifications}
        setNotifications={setNotifications}
        setShowNotifications={setShowNotifications}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        handleLogout={handleLogout}
      />
      <main className="main-content">
        {activeTab === "dashboard" && (
          <DashboardContent
            user={user}
            recommendedJobs={recommendedJobs}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            savedJobs={savedJobs}
            handleSaveJob={handleSaveJob}
          />
        )}
        {activeTab === "applied" && (
          <AppliedJobsContent
            appliedJobs={appliedJobs}
            savedJobs={savedJobsList}
          />
        )}
        {activeTab === "profile" && (
          <ProfileContent
            user={user}
            token={localStorage.getItem("token")}
            refreshProfile={fetchStudentProfile}
          />
        )}
        {activeTab === "internship" && (
          <InternshipJourneyPage />
        )}
        {activeTab === "messages" && (
          <MessagingPage />
        )}
      </main>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
        }

        .dashboard-container {
          min-height: 100vh;
          background: transparent;
        }

        .main-content {
          max-width: 1280px;
          margin: 0 auto;
          padding: 90px 24px 32px 24px;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
