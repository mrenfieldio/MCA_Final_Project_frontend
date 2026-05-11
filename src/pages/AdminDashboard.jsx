import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/admindashboard.css";
import DashboardPage from "../components/Admin/DashboardPage";
import CompanyPage from "../components/Admin/CompanyPage";
import JobPage from "../components/Admin/JobPage";
import SkillPage from "../components/Admin/SkillPage";
import AnalyticsPage from "../components/Admin/AnalyticPage";
import StudentsPage from "../components/Admin/StudentPage";
import SettingsPage from "../components/Admin/SettingPage";

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV = [
  { id: "dashboard", icon: "⬡", label: "Dashboard" },
  { id: "companies", icon: "◈", label: "Companies" },
  { id: "students",  icon: "◉", label: "Students"  },
  { id: "jobs",      icon: "◫", label: "Jobs"      },
  { id: "skills",    icon: "◆", label: "Skills"    },
  { id: "analytics", icon: "◐", label: "Analytics" },
  { id: "settings",  icon: "◎", label: "Settings"  },
];

const MOCK = {
  stats: [
    { label: "Total Companies", value: "1,248", change: "+12%", up: true,  accent: "#2563eb" },
    { label: "Active Students", value: "38,402",change: "+8%",  up: true,  accent: "#8b5cf6" },
    { label: "Live Jobs",       value: "5,917", change: "+24%", up: true,  accent: "#f59e0b" },
    { label: "Pending Review",  value: "143",   change: "-3%",  up: false, accent: "#ec4899" },
  ],
  companies: [
    { id: 1, name: "Infosys Ltd.",   industry: "IT Services", email: "hr@infosys.com",     jobs: 34, status: "approved"  },
    { id: 2, name: "Zomato",         industry: "Food Tech",   email: "talent@zomato.com",  jobs: 18, status: "approved"  },
    { id: 3, name: "StartupXYZ",     industry: "SaaS",        email: "ceo@startupxyz.in",  jobs: 5,  status: "pending"   },
    { id: 4, name: "TCS Global",     industry: "IT Services", email: "jobs@tcs.com",       jobs: 67, status: "approved"  },
    { id: 5, name: "GreenTech Pvt.", industry: "CleanTech",   email: "hr@greentech.in",    jobs: 9,  status: "suspended" },
    { id: 6, name: "DevHouse Inc.",  industry: "Product",     email: "hello@devhouse.io",  jobs: 12, status: "pending"   },
  ],
  students: [
    { id: 1, name: "Aditya Nair",   email: "aditya@gmail.com", course: "MCA",    skills: ["React","Django"],      apps: 8,  status: "active"   },
    { id: 2, name: "Priya Menon",   email: "priya@gmail.com",  course: "BCA",    skills: ["Python","ML"],         apps: 14, status: "active"   },
    { id: 3, name: "Rahul Sharma",  email: "rahul@gmail.com",  course: "B.Tech", skills: ["Java","Spring"],       apps: 3,  status: "active"   },
    { id: 4, name: "Sneha Das",     email: "sneha@gmail.com",  course: "MCA",    skills: ["Flutter","Firebase"],  apps: 6,  status: "inactive" },
    { id: 5, name: "Kiran Raj",     email: "kiran@gmail.com",  course: "B.Tech", skills: ["Node.js","MongoDB"],   apps: 11, status: "active"   },
    { id: 6, name: "Anjali Pillai", email: "anjali@gmail.com", course: "BCA",    skills: ["React","TypeScript"],  apps: 2,  status: "inactive" },
  ],
  jobs: [
    { id: 1, title: "Frontend Developer", company: "Infosys Ltd.",   type: "Full-time", location: "Bengaluru", apps: 102, posted: "2 days ago",  status: "active" },
    { id: 2, title: "UI/UX Designer",     company: "Zomato",         type: "Freelance", location: "Remote",    apps: 74,  posted: "5 days ago",  status: "active" },
    { id: 3, title: "ML Engineer",        company: "TCS Global",     type: "Full-time", location: "Hyderabad", apps: 58,  posted: "1 day ago",   status: "active" },
    { id: 4, title: "Android Dev",        company: "StartupXYZ",     type: "Intern",    location: "Pune",      apps: 33,  posted: "1 week ago",  status: "closed" },
    { id: 5, title: "DevOps Engineer",    company: "GreenTech Pvt.", type: "Full-time", location: "Chennai",   apps: 45,  posted: "3 days ago",  status: "active" },
    { id: 6, title: "Data Analyst",       company: "DevHouse Inc.",  type: "Freelance", location: "Remote",    apps: 61,  posted: "4 days ago",  status: "active" },
  ],
  skills: [
    { id: 1,  name: "React.js",         category: "Frontend",  count: 4820 },
    { id: 2,  name: "Python",           category: "Backend",   count: 6231 },
    { id: 3,  name: "Django",           category: "Backend",   count: 3104 },
    { id: 4,  name: "Machine Learning", category: "AI/ML",     count: 2893 },
    { id: 5,  name: "Flutter",          category: "Mobile",    count: 1742 },
    { id: 6,  name: "Node.js",          category: "Backend",   count: 3988 },
    { id: 7,  name: "TypeScript",       category: "Frontend",  count: 2540 },
    { id: 8,  name: "Kubernetes",       category: "DevOps",    count: 1120 },
    { id: 9,  name: "PostgreSQL",       category: "Database",  count: 2760 },
    { id: 10, name: "GraphQL",          category: "API",       count: 980  },
  ],
  activity: [
    { action: "Company approved",       detail: "Infosys Ltd. verified",       time: "2 min ago",  color: "#22c55e" },
    { action: "New student registered", detail: "Anjali Pillai — BCA",         time: "11 min ago", color: "#3b82f6" },
    { action: "Job flagged",            detail: "'Android Dev' at StartupXYZ", time: "34 min ago", color: "#f43f5e" },
    { action: "Skill added",            detail: "Kubernetes added to catalog",  time: "1 hr ago",   color: "#f59e0b" },
    { action: "Company suspended",      detail: "GreenTech Pvt. suspended",    time: "2 hr ago",   color: "#f43f5e" },
    { action: "Job posted",             detail: "ML Engineer at TCS Global",   time: "3 hr ago",   color: "#22c55e" },
  ],
};

const SKILL_CATEGORIES = ["All","Frontend","Backend","AI/ML","Mobile","DevOps","Database","API"];

const JOB_TYPE_CLASS = {
  "Full-time": "fulltime",
  "Freelance": "freelance",
  "Intern":    "intern",
};

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [active, setActive] = useState(() => {
    const page = searchParams.get('page');
    const validPages = NAV.map(n => n.id);
    return validPages.includes(page) ? page : 'dashboard';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSetActive = (newActive) => {
    setActive(newActive);
    setSearchParams({ page: newActive });
  };

  const renderPage = () => {
    const pageProps = {
      dashboard: <DashboardPage stats={MOCK.stats} activity={MOCK.activity} />,
      companies: <CompanyPage companies={MOCK.companies} />,
      students: <StudentsPage students={MOCK.students} />,
      jobs: <JobPage jobs={MOCK.jobs} jobTypeClass={JOB_TYPE_CLASS} />,
      skills: <SkillPage skills={MOCK.skills} skillCategories={SKILL_CATEGORIES} />,
      analytics: <AnalyticsPage />,
      settings: <SettingsPage />,
    };
    return pageProps[active];
  };

  return (
    <div className="admin-shell">

      <aside className={`sidebar ${isSidebarOpen ? "sidebar-mobile-open" : ""}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-inner">
            <div className="sidebar-logo-icon">L</div>
            <div>
              <p className="sidebar-logo-name">LinkPro</p>
              <p className="sidebar-logo-role">Admin Panel</p>
            </div>
          </div>
          <button 
            className="sidebar-close-btn"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-nav-label">Navigation</p>
          {NAV.map(n => (
            <button
              key={n.id}
              className={`nav-btn ${active === n.id ? "active" : ""}`}
              onClick={() => {
                handleSetActive(n.id);
                setIsSidebarOpen(false);
              }}
            >
              <span className="nav-btn-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-profile">
          <div className="sidebar-avatar">A</div>
          <div>
            <p className="sidebar-profile-name">Ashish</p>
            <p className="sidebar-profile-role">Super Admin</p>
          </div>
        </div>
      </aside>

      <main className="main-area">

  <div className="topbar">

    <div className="topbar-left">
      <button 
        className="mobile-menu-btn" 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>
      <div className="topbar-breadcrumb">
        <span className="topbar-root">
          LinkPro
        </span>

        <span className="topbar-sep">
          /
        </span>

        <span className="topbar-active">
          {active}
        </span>
      </div>
    </div>

    <div className="topbar-right">

      

      {/* 🔥 LOGOUT BUTTON */}
      <button
        className="logout-btn"
        onClick={() => {

          localStorage.clear();

          window.location.href = "/auth";
        }}
      >
        Logout
      </button>

    </div>

  </div>

  <div className="page-content">
    {renderPage()}
  </div>

</main>

    </div>
  );
}