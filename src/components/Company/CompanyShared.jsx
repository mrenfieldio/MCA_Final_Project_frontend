import React from 'react';

export const IconBriefcase = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);
export const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);
export const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
export const IconStar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);
export const IconChartLine = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3"></path>
    <path d="M3 3v18"></path>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <polyline points="15 6 18 9 21 6"></polyline>
    <polyline points="3 9 6 12 9 9"></polyline>
  </svg>
);
export const IconChartPie = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
  </svg>
);
export const IconSettings = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);
export const IconPlus = (props) => (
  <svg width={props.width || "16"} height={props.height || "16"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
export const IconTrendingUp = (props) => (
  <svg width={props.width || "12"} height={props.height || "12"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);
export const IconSearch = (props) => (
  <svg width={props.width || "18"} height={props.height || "18"} className={props.className || ""} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
export const IconEdit = (props) => (
  <svg width={props.width || "16"} height={props.height || "16"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 3l4 4-7 7H10v-4l7-7z"></path>
    <path d="M4 20h16"></path>
  </svg>
);
export const IconEye = (props) => (
  <svg width={props.width || "14"} height={props.height || "14"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);
export const IconMapPin = (props) => (
  <svg width={props.width || "12"} height={props.height || "12"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);
export const IconClock = (props) => (
  <svg width={props.width || "14"} height={props.height || "14"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
export const IconBuilding = (props) => (
  <svg width={props.width || "32"} height={props.height || "32"} style={props.style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <line x1="9" y1="6" x2="15" y2="6"></line>
    <line x1="9" y1="10" x2="15" y2="10"></line>
    <line x1="9" y1="14" x2="15" y2="14"></line>
  </svg>
);
export const IconUserCircle = (props) => (
  <svg width={props.width || "32"} height={props.height || "32"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4"></circle>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
  </svg>
);
export const IconGlobe = (props) => (
  <svg width={props.width || "28"} height={props.height || "28"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);
export const IconHeartHandshake = (props) => (
  <svg width={props.width || "28"} height={props.height || "28"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2a10 10 0 0 1 10 10c0 3.5-2 6.5-5 8l-5 3-5-3c-3-1.5-5-4.5-5-8a10 10 0 0 1 10-10z"></path>
    <path d="M8 12h8"></path>
    <path d="M12 8v8"></path>
  </svg>
);

export const companyName = "TechNova Solutions";
export const statsData = {
  activeJobs: 12,
  totalApplicants: 847,
  interviewsScheduled: 34,
  shortlisted: 128,
};

export const jobsList = [
  { id: 1, title: "Senior Frontend Engineer", dept: "Engineering", location: "Remote", applicants: 142, status: "active", posted: "2d ago" },
  { id: 2, title: "Product Manager", dept: "Product", location: "New York", applicants: 89, status: "active", posted: "5d ago" },
  { id: 3, title: "Backend Developer (Node.js)", dept: "Engineering", location: "Austin", applicants: 203, status: "active", posted: "1w ago" },
  { id: 4, title: "UX/UI Designer", dept: "Design", location: "Remote", applicants: 76, status: "paused", posted: "3d ago" },
  { id: 5, title: "DevOps Engineer", dept: "Infra", location: "San Francisco", applicants: 54, status: "active", posted: "Just now" },
];

export const applicantsRecent = [
  { name: "Alisha Mehta", role: "Senior Frontend Engineer", score: 92, avatar: "AM", experience: "5 yrs", status: "shortlist" },
  { name: "Rahul Verma", role: "Product Manager", score: 88, avatar: "RV", experience: "7 yrs", status: "review" },
  { name: "Sofia Chen", role: "Backend Developer", score: 94, avatar: "SC", experience: "4 yrs", status: "interview" },
  { name: "Michael Okafor", role: "UX/UI Designer", score: 79, avatar: "MO", experience: "3 yrs", status: "review" },
];

export const StatCard = ({ icon: Icon, title, value, trend, colorClass }) => (
  <div className="stat-card">
    {/* Removed stat-card-header wrapper completely */}
    <div>
      <p className="stat-title">{title}</p>
      <p className="stat-value">{value}</p>
      {trend && (
        <p className="stat-trend">
          <IconTrendingUp width={12} height={12} /> {trend}
        </p>
      )}
    </div>
    <div className={`stat-icon ${colorClass}`}>
      <Icon />
    </div>
  </div>
);

export const Badge = ({ status }) => {
  const getBadgeClass = () => {
    switch (status) {
      case "active": return "badge-active";
      case "paused": return "badge-paused";
      case "shortlist": return "badge-shortlist";
      case "review": return "badge-review";
      case "interview": return "badge-interview";
      default: return "badge-active";
    }
  };
  return (
    <span className={`badge ${getBadgeClass()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
