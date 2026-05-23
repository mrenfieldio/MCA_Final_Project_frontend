import { useState, useEffect } from "react";
import {
  IconBriefcase,
  IconCalendar,
  IconCircleCheck,
  IconClockHour4,
  IconFileText,
  IconClipboardCheck,
  IconTrophy,
  IconUpload,
  IconChevronLeft,
  IconChevronDown,
  IconChevronUp,
  IconSparkles,
  IconRocket,
  IconConfetti,
  IconMapPin,
  IconCoin,
  IconExternalLink,
  IconAlertCircle,
} from "@tabler/icons-react";

import JobModal from "./JobModal";
import "../../styles/InternshipJourney.css";

// ─── Ring Progress ──────────────────────────────────────────────────
function RingProgress({ value = 0, size = 110, stroke = 9 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const filled = circ * (value / 100);
  return (
    <div className="ij-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#e2e8f0" strokeWidth={stroke}
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circ - filled}`}
          strokeDashoffset={0}
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4338ca" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="ij-ring-label">
        <span className="pct">{value}%</span>
        <span className="pct-sub">done</span>
      </div>
    </div>
  );
}

// ─── Status Month Icon ───────────────────────────────────────────────
function MonthIcon({ status }) {
  if (status === "completed") return <IconCircleCheck size={22} />;
  if (status === "submitted") return <IconClockHour4 size={22} />;
  return <IconFileText size={22} />;
}

// ─── Main Component ──────────────────────────────────────────────────
export default function InternshipJourneyPage() {
  const [openMonth, setOpenMonth]               = useState(null);
  const [selectedJobs, setSelectedJobs]         = useState([]);
  const [loadingSelected, setLoadingSelected]   = useState(false);
  const [activeJourneyJob, setActiveJourneyJob] = useState(null);
  const [showModal, setShowModal]               = useState(false);
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [timeline, setTimeline]                 = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [uploadFiles, setUploadFiles]           = useState({});
  const [uploading, setUploading]               = useState(false);

  useEffect(() => { fetchSelectedJobs(); }, []);

  const fetchSelectedJobs = async () => {
    try {
      setLoadingSelected(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/student/selected-jobs/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSelectedJobs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSelected(false);
    }
  };

  useEffect(() => {
    if (activeJourneyJob) fetchAssignments(activeJourneyJob.application_id);
  }, [activeJourneyJob]);

  const fetchAssignments = async (internshipId) => {
    try {
      setLoadingAssignments(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8000/api/student/internship-assignments/${internshipId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setTimeline(
        data.map((item) => ({
          id: item.id,
          month: item.month,
          assignment: item.title,
          description: item.description,
          deadline: item.deadline,
          file: item.file,
          score: item.marks,
          feedback: item.feedback,
          submitted_file: item.submitted_file,
          status:
            item.status === "completed"
              ? "completed"
              : item.status === "submitted"
              ? "submitted"
              : "pending",
        }))
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const handleUploadAssignment = async (assignmentId) => {
    const file = uploadFiles[assignmentId];
    if (!file) { alert("Please select a file"); return; }
    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(
        `http://localhost:8000/api/student/submit-assignment/${assignmentId}/`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Assignment submitted successfully!");
        fetchAssignments(activeJourneyJob.application_id);
        setUploadFiles((prev) => { const n = { ...prev }; delete n[assignmentId]; return n; });
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const internship = {
    company:    activeJourneyJob?.company    ?? "TechNova",
    role:       activeJourneyJob?.title      ?? "Frontend Developer Intern",
    duration:   activeJourneyJob?.duration   ?? 6,
    started_at: "May 2026",
    progress:   45,
    mentor:     "Rahul Menon",
  };

  const completedCount = timeline.filter((t) => t.status === "completed").length;

  // ─── OFFER LISTING PAGE ──────────────────────────────────────────
  if (!activeJourneyJob) {
    return (
      <div className="ij-page">
        <div className="ij-offers-header">
          <h2>My Internship Offers</h2>
          <p>You have been selected — start your journey when you're ready.</p>
        </div>

        {loadingSelected ? (
          <div className="ij-empty">
            <IconClockHour4 size={40} strokeWidth={1.2} />
            <span>Fetching your offers…</span>
          </div>
        ) : selectedJobs.length === 0 ? (
          <div className="ij-empty">
            <IconBriefcase size={40} strokeWidth={1.2} />
            <span>No internship offers yet. Check back soon.</span>
          </div>
        ) : (
          <div className="ij-offers-grid">
            {selectedJobs.map((item) => {
              const job = item.job || item;
              return (
                <div key={item.id} className="ij-offer-card">
                  {/* Card header / gradient */}
                  <div className="ij-offer-card-top">
                    <div className="ij-offer-tag">
                      <IconSparkles size={12} />
                      {item.status ?? "Selected"}
                    </div>
                    <h3>{job?.title}</h3>
                    <p className="company">{job?.company}</p>
                  </div>

                  {/* Card body */}
                  <div className="ij-offer-card-body">
                    <div className="ij-congrats-strip">
                      <IconConfetti size={16} />
                      Congratulations! You've been selected for this internship.
                    </div>

                    <div className="ij-offer-meta">
                      <div className="ij-meta-item">
                        <div className="label">Location</div>
                        <div className="value">
                          <IconMapPin size={13} style={{ verticalAlign: "-2px", marginRight: 4 }} />
                          {job.location}
                        </div>
                      </div>
                      <div className="ij-meta-item">
                        <div className="label">Stipend</div>
                        <div className="value">
                          <IconCoin size={13} style={{ verticalAlign: "-2px", marginRight: 4 }} />
                          {job.stipend}
                        </div>
                      </div>
                      <div className="ij-meta-item" style={{ gridColumn: "1 / -1" }}>
                        <div className="label">Duration</div>
                        <div className="value">{job.duration} Months</div>
                      </div>
                    </div>

                    <div className="ij-offer-actions">
                      <button
                        className="ij-btn-primary"
                        onClick={() => setActiveJourneyJob({ ...job, application_id: item.id })}
                      >
                        <IconRocket size={16} />
                        Start Internship Journey
                      </button>
                      <button
                        className="ij-btn-ghost"
                        onClick={() => { setSelectedJobForModal(job); setShowModal(true); }}
                      >
                        <IconExternalLink size={15} />
                        View Offer Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showModal && selectedJobForModal && (
          <JobModal
            job={selectedJobForModal}
            isOpen={true}
            onClose={() => { setSelectedJobForModal(null); setShowModal(false); }}
          />
        )}
      </div>
    );
  }

  // ─── INTERNSHIP JOURNEY PAGE ─────────────────────────────────────
  return (
    <div className="ij-page">
      {/* ── Hero header ── */}
      <div className="ij-journey-header">
        <div className="ij-hero-card">
          <button className="ij-back-btn" onClick={() => setActiveJourneyJob(null)}>
            <IconChevronLeft size={15} /> Back to Offers
          </button>
          <div className="ij-hero-label">
            <IconRocket size={13} />
            Internship Journey
          </div>
          <h1>{internship.role}</h1>
          <p className="company-name">{internship.company}</p>
        </div>

        <div className="ij-progress-card">
          <h4>Overall Progress</h4>
          <RingProgress value={internship.progress} />
          <p style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
            {completedCount} of {timeline.length} months done
          </p>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="ij-summary-row">
        <div className="ij-stat-card">
          <div className="ij-stat-icon purple">
            <IconBriefcase size={22} />
          </div>
          <div>
            <div className="ij-stat-label">Duration</div>
            <div className="ij-stat-value">{internship.duration} Months</div>
          </div>
        </div>
        <div className="ij-stat-card">
          <div className="ij-stat-icon emerald">
            <IconCalendar size={22} />
          </div>
          <div>
            <div className="ij-stat-label">Started On</div>
            <div className="ij-stat-value">{internship.started_at}</div>
          </div>
        </div>
        <div className="ij-stat-card">
          <div className="ij-stat-icon amber">
            <IconClipboardCheck size={22} />
          </div>
          <div>
            <div className="ij-stat-label">Mentor</div>
            <div className="ij-stat-value">{internship.mentor}</div>
          </div>
        </div>
      </div>

      {/* ── Timeline ── */}
      <div className="ij-timeline-header">
        <h2>Internship Timeline</h2>
        {timeline.length > 0 && (
          <div className="ij-progress-bar-wrap">
            <div className="ij-progress-bar-track">
              <div
                className="ij-progress-bar-fill"
                style={{ width: `${(completedCount / timeline.length) * 100}%` }}
              />
            </div>
            <span className="ij-progress-bar-text">
              {completedCount}/{timeline.length} completed
            </span>
          </div>
        )}
      </div>

      {loadingAssignments ? (
        <div className="ij-empty">
          <IconClockHour4 size={40} strokeWidth={1.2} />
          <span>Loading assignments…</span>
        </div>
      ) : timeline.length === 0 ? (
        <div className="ij-empty">
          <IconFileText size={40} strokeWidth={1.2} />
          <span>No assignments available yet. Check back soon.</span>
        </div>
      ) : (
        timeline.map((item) => (
          <div key={item.id} className={`ij-tcard ${item.status}`}>
            {/* ── Card top (always visible) ── */}
            <div
              className="ij-tcard-top"
              onClick={() => setOpenMonth(openMonth === item.month ? null : item.month)}
            >
              <div className="ij-tcard-left">
                <div className={`ij-month-dot ${item.status}`}>
                  <MonthIcon status={item.status} />
                </div>
                <div className="ij-tcard-meta">
                  <h3>Month {item.month}</h3>
                  <p className="sub">{item.assignment}</p>
                </div>
              </div>
              <div className="ij-tcard-right">
                <span className={`ij-status-pill ${item.status}`}>{item.status}</span>
                <button className="ij-chevron-btn" aria-label="toggle">
                  {openMonth === item.month
                    ? <IconChevronUp size={16} />
                    : <IconChevronDown size={16} />}
                </button>
              </div>
            </div>

            {/* ── Expanded body ── */}
            {openMonth === item.month && (
              <div className="ij-tcard-body">
                {/* Assignment details */}
                <div className="ij-assignment-block">
                  <h4>{item.assignment}</h4>
                  <p className="desc">{item.description}</p>
                  <span className="ij-deadline-tag">
                    <IconAlertCircle size={12} />
                    Deadline: {new Date(item.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>

                {/* Score + Feedback */}
                <div className="ij-score-row">
                  <div className="ij-mini">
                    <h5>Score</h5>
                    {item.score
                      ? <p className="score-big">{item.score}%</p>
                      : <p style={{ color: "#94a3b8" }}>Pending evaluation</p>}
                    {item.submitted_file && (
                      <a
                        href={`http://localhost:8000${item.submitted_file}`}
                        target="_blank"
                        rel="noreferrer"
                        className="ij-submitted-link"
                      >
                        <IconExternalLink size={13} />
                        View submission
                      </a>
                    )}
                  </div>
                  <div className="ij-mini">
                    <h5>Feedback</h5>
                    <p style={{ fontWeight: 400, color: item.feedback ? "#334155" : "#94a3b8" }}>
                      {item.feedback || "No feedback yet"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="ij-action-row">
                  {/* Download assignment file */}
                  {item.file && (
                    <a
                      href={`http://localhost:8000${item.file}`}
                      target="_blank"
                      rel="noreferrer"
                      className="ij-action-btn ghost"
                    >
                      <IconFileText size={15} />
                      Download Assignment
                    </a>
                  )}

                  {/* Upload group */}
                  <div className="ij-upload-group">
                    <input
                      type="file"
                      id={`upload-${item.id}`}
                      hidden
                      onChange={(e) =>
                        setUploadFiles((prev) => ({ ...prev, [item.id]: e.target.files[0] }))
                      }
                    />
                    <label htmlFor={`upload-${item.id}`} className="ij-file-label">
                      <IconUpload size={14} />
                      {uploadFiles[item.id] ? uploadFiles[item.id].name : "Choose file…"}
                    </label>
                    <button
                      className="ij-action-btn primary"
                      onClick={() => handleUploadAssignment(item.id)}
                      disabled={uploading || !uploadFiles[item.id]}
                    >
                      {uploading ? "Submitting…" : "Submit Assignment"}
                    </button>
                  </div>

                  {/* View test */}
                  <button className="ij-action-btn secondary">
                    <IconTrophy size={15} />
                    View Test
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}