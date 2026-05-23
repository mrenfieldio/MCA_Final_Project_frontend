import { useState, useEffect, navigate } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Briefcase,
  Bell,
  LogOut,
  Menu,
  X,
  User,
  CheckCircle,
  MessageCircle,
} from "lucide-react";

export default function Navbar({
  activeTab,
  setActiveTab,
  user,
  notifications,
  setNotifications,
  showNotifications,
  setShowNotifications,
  mobileMenuOpen,
  setMobileMenuOpen,
  handleLogout,
}) {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/api/student/unread-messages/",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      setUnreadCount(data.unread_count);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:8000/api/student/notifications/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();
    setNotifications(data);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <>
      <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
        {/* Logo */}
        <div
          className="nav-logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <div className="nav-logo-icon">L</div>
          LinkPro
        </div>

        {/* Desktop Navigation Links */}
        <ul className="nav-links desktop-nav">
          <li>
            <button
              className={`nav-link ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Profile Management
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeTab === "applied" ? "active" : ""}`}
              onClick={() => setActiveTab("applied")}
            >
              My Jobs
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeTab === "internship" ? "active" : ""}`}
              onClick={() => setActiveTab("internship")}
            >
              Internship Journey
            </button>
          </li>
        </ul>

        {/* Actions */}
        <div className="nav-actions">
          {/* Notifications */}
          {/* MESSAGE */}
          <button
            className="icon-btn message-icon-btn"
            onClick={() => {
              setActiveTab("messages");

              navigate("/student-dashboard?tab=messages");
            }}
          >
            <MessageCircle size={20} />

            {/* UNREAD BADGE */}
            {unreadCount > 0 && (
              <span className="message-count-badge">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
          <div className="notification-wrapper">
            <button
              className="icon-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="notification-badge">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="dropdown-header">
                  <h4>Notifications</h4>
                  <button
                    className="text-btn"
                    onClick={async () => {
                      for (let n of notifications) {
                        if (!n.read) {
                          await fetch(
                            "http://localhost:8000/api/student/notifications/read/",
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                              },
                              body: JSON.stringify({ id: n.id }),
                            },
                          );
                        }
                      }
                      fetchNotifications();
                    }}
                  >
                    Mark all as read
                  </button>
                </div>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`notification-item ${!notif.read ? "unread" : ""}`}
                  >
                    <p>{notif.message}</p>
                    <span>{notif.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="user-menu">
            {/* <div className="user-avatar">
              {user?.avatar || <User size={16} />}
            </div> */}
            <span className="user-name desktop-user">
              {user?.name?.split(" ")[0] || "Student"}
            </span>
          </div>

          {/* Logout Button */}
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span className="desktop-logout">Logout</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <button
            className="mobile-nav-link"
            onClick={() => {
              setActiveTab("dashboard");
              setMobileMenuOpen(false);
            }}
          >
            Dashboard
          </button>
          <button
            className="mobile-nav-link"
            onClick={() => {
              setActiveTab("applied");
              setMobileMenuOpen(false);
            }}
          >
            Applied Jobs
          </button>
          <button
            className="mobile-nav-link"
            onClick={() => {
              setActiveTab("profile");
              setMobileMenuOpen(false);
            }}
          >
            Profile Management
          </button>
          <button
            className="mobile-nav-link"
            onClick={() => {
              setActiveTab("internship");
              setMobileMenuOpen(false);
            }}
          >
            Internship Journey
          </button>
          <button
            className="mobile-nav-link logout-mobile"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}
