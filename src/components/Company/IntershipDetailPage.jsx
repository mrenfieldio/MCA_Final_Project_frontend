import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../../styles/company.css";
import {
  IconArrowLeft,
  IconTrendingUp,
  IconStar,
  IconCheckSquare,
  IconCalendar,
  IconBriefcase,
  IconClock,
  IconClipboard,
  IconZap,
  IconMessageSquare,
  IconPlus,
  IconSave,
} from "../Company/CompanyShared";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function isTestMonth(index, duration) {
  return index === 2 || index === duration - 1;
}

/* ── Main Component ── */
export default function InternshipDetailPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState({});
  const [openMonth, setOpenMonth] = useState(0);

  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [assignmentTitle, setAssignmentTitle] = useState("");

  const [assignmentDescription, setAssignmentDescription] = useState("");

  const [deadline, setDeadline] = useState("");

  const [assignmentFile, setAssignmentFile] = useState(null);

  const [creatingAssignment, setCreatingAssignment] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  const [reviewMarks, setReviewMarks] = useState({});

  const [reviewFeedback, setReviewFeedback] = useState({});

  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    fetchInternship();
    fetchSubmissions();
  }, []);

  const fetchInternship = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/company/internship/${id}/`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await response.json();
      setStudent(data);

      // init review state per month
      const init = {};
      for (let i = 0; i < data.internship_duration; i++) init[i] = "";
      setReviews(init);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8000/api/company/internship-submissions/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      setSubmissions(data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleReviewSubmission = async (submissionId) => {
    try {
      setReviewing(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8000/api/company/review-assignment/${submissionId}/`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            marks: reviewMarks[submissionId],

            feedback: reviewFeedback[submissionId],
          }),
        },
      );

      if (response.ok) {
        alert("Assignment reviewed successfully");

        fetchSubmissions();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setReviewing(false);
    }
  };

  const handleCreateAssignment = async () => {
    try {
      setCreatingAssignment(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("internship_id", student.id);

      formData.append("month", selectedMonth);

      formData.append("title", assignmentTitle);

      formData.append("description", assignmentDescription);

      formData.append("deadline", deadline);

      if (assignmentFile) {
        formData.append("file", assignmentFile);
      }

      const response = await fetch(
        "http://localhost:8000/api/company/create-assignment/",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        },
      );

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        alert("Assignment created successfully");

        setShowAssignmentModal(false);

        setAssignmentTitle("");

        setAssignmentDescription("");

        setDeadline("");

        setAssignmentFile(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCreatingAssignment(false);
    }
  };

  if (loading) {
    return (
      <div className="internship-page">
        <div className="loading-shell">
          <div className="spinner" />
          <p className="loading-text">Loading internship details…</p>
        </div>
      </div>
    );
  }

  const progress = student.progress ?? 0;

  const getTestMonths = (duration) => {
    duration = Number(duration);

    if (duration <= 2) {
      return [duration];
    }

    if (duration === 3) {
      return [3];
    }

    if (duration === 6) {
      return [3, 6];
    }

    if (duration === 12) {
      return [3, 6, 9, 12];
    }

    // fallback
    return [duration];
  };

  return (
    <div className="internship-page">
      {/* BACK */}
      <button
        className="back-btn"
        onClick={() => setSearchParams({ page: "selected-students" })}
      >
        <IconArrowLeft />
        Back to selected students
      </button>

      {/* ── HEADER ── */}
      <div className="internship-header">
        <div className="header-left">
          {/* <div className="header-avatar">{getInitials(student.student_name)}</div> */}
          <div className="header-meta">
            <h1>{student.student_name}</h1>
            <p className="job-title">{student.job_title}</p>
            <div className="header-tags">
              <span className="tag tag-brand">
                <IconBriefcase
                  style={{ width: 11, height: 11, strokeWidth: 2.5 }}
                />
                {student.internship_duration} month internship
              </span>
              <span className="tag tag-success">
                <IconClock
                  style={{ width: 11, height: 11, strokeWidth: 2.5 }}
                />
                Full-time
              </span>
              {student.is_paid && <span className="tag tag-warning">Paid</span>}
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="status-badge">
            <span className="status-dot" />
            Active internship
          </div>
          <span className="date-range">Started {student.joined_at ?? "—"}</span>
        </div>
      </div>

      {/* ── SUMMARY CARDS ── */}
      <div className="internship-summary-grid">
        <div className="summary-card accent-brand">
          <div className="summary-icon brand">
            <IconTrendingUp />
          </div>
          <h3>{progress}%</h3>
          <p>Overall progress</p>
          <div className="progress-bar-wrap">
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="summary-card accent-success">
          <div className="summary-icon success">
            <IconStar />
          </div>
          <h3>{student.score ?? 0}%</h3>
          <p>Performance score</p>
        </div>

        <div className="summary-card accent-warning">
          <div className="summary-icon warning">
            <IconCheckSquare />
          </div>
          <h3>{student.assignments_completed ?? 0}</h3>
          <p>Assignments completed</p>
        </div>

        <div className="summary-card accent-purple">
          <div className="summary-icon purple">
            <IconCalendar />
          </div>
          <h3>{student.internship_duration}</h3>
          <p>Total months</p>
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div className="timeline-section">
        <div className="section-heading">
          <h2>
            Internship timeline
            <span className="pill">{student.internship_duration} months</span>
          </h2>
          <span className="section-note">
            Assignments · assessments · reviews
          </span>
        </div>

        <div className="timeline-grid">
          {Array.from({ length: student.internship_duration }).map(
            (_, index) => {
              const isActive = index === 0;
              const currentMonth = index + 1;

              const testMonths = getTestMonths(student.internship_duration);

              const showTest = testMonths.includes(currentMonth);
              const hasAssignment = submissions.some(
                (sub) => sub.month === index + 1,
              );

              return (
                <div className="month-card" key={index}>
                  {/* Month header */}
                  <div
                    className="month-header"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setOpenMonth(openMonth === index ? null : index)
                    }
                  >
                    <div className="month-header-left">
                      <div className="month-number">{index + 1}</div>
                      <div>
                        <h3>Month {index + 1}</h3>
                        <div className="month-sub">
                          Week {index * 4 + 1} – {(index + 1) * 4}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`month-status ${isActive ? "active" : "upcoming"}`}
                    >
                      {isActive ? "Active" : "Upcoming"}
                    </span>
                  </div>

                  {/* Month body */}
                  {openMonth === index && (
                    <div className="month-body">
                      {/* Assignment block */}
                      {!hasAssignment && (
                        <div className="timeline-block assign-block">
                          <div className="block-header">
                            <div className="block-title">
                              <div className="block-icon assignment">
                                <IconClipboard />
                              </div>
                              <h4>Assignment</h4>
                            </div>
                            <span className="block-label assignment">Task</span>
                          </div>
                          <p className="block-desc">
                            Create and assign a task for this month. Students
                            will submit via the portal.
                          </p>
                          <div className="block-actions">
                            <button
                              className="btn btn-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMonth(index + 1);

                                setShowAssignmentModal(true);
                              }}
                            >
                              <IconPlus />
                              Create assignment
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Test block — shown at mid-point and final month */}
                      {showTest && (
                        <div className="timeline-block test-block">
                          <div className="block-header">
                            <div className="block-title">
                              <div className="block-icon test">
                                <IconZap />
                              </div>

                              <h4>
                                {currentMonth === student.internship_duration
                                  ? "Final Assessment"
                                  : "Mid-term Assessment"}
                              </h4>
                            </div>

                            <span className="block-label test">
                              {currentMonth === student.internship_duration
                                ? "Final"
                                : "Mid-term"}
                            </span>
                          </div>

                          <p className="block-desc">
                            {currentMonth === student.internship_duration
                              ? "Conduct the final evaluation. Score determines permanent hire eligibility."
                              : "Mid-internship evaluation to track learning and performance."}
                          </p>

                          <div className="block-actions">
                            <button className="btn btn-warning">
                              <IconZap />
                              Conduct Test
                            </button>

                            <button className="btn btn-outline">
                              View Results
                            </button>
                          </div>
                        </div>
                      )}
                      {/* Review block */}
                      {/* <div className="timeline-block review-block">
                        <div className="block-header">
                          <div className="block-title">
                            <div className="block-icon review">
                              <IconMessageSquare />
                            </div>
                            <h4>Monthly review</h4>
                          </div>
                          <span className="block-label review">Feedback</span>
                        </div>
                        <textarea
                          placeholder="Write mentor feedback for this month…"
                          value={reviews[index] || ""}
                          onChange={(e) =>
                            setReviews((prev) => ({
                              ...prev,
                              [index]: e.target.value,
                            }))
                          }
                        />
                        <div className="block-actions">
                          <button className="btn btn-primary">
                            <IconSave /> Save review
                          </button>
                        </div>
                      </div> */}
                    </div>
                  )}
                  {/* ================================= */}
                  {/* SUBMISSIONS */}
                  {/* ================================= */}

                  {submissions
                    .filter(
                      (submission) =>
                        submission.month === index + 1 &&
                        submission.submission_id,
                    )
                    .map((submission) => (
                      <div
                        className="timeline-block submission-block"
                        key={submission.submission_id}
                      >
                        {/* HEADER */}
                        <div className="block-header">
                          <div className="block-title">
                            <div className="block-icon review">
                              <IconCheckSquare />
                            </div>

                            <h4>Student Submission</h4>
                          </div>

                          <span className={`block-label ${submission.status}`}>
                            {submission.status}
                          </span>
                        </div>

                        {/* STUDENT */}
                        <p className="submission-student">
                          Submitted by: <strong>{submission.student}</strong>
                        </p>

                        {/* DATE */}
                        <p className="submission-date">
                          Submitted at:{" "}
                          {new Date(submission.submitted_at).toLocaleString()}
                        </p>

                        {/* FILE */}
                        {submission.file && (
                          <a
                            href={`http://localhost:8000${submission.file}`}
                            target="_blank"
                            rel="noreferrer"
                            className="submission-link"
                          >
                            Download Submission
                          </a>
                        )}

                        {/* REVIEW FORM */}
                        {!submission.marks && (
                          <div className="review-section">
                            {/* MARKS */}
                            <input
                              type="number"
                              placeholder="Enter marks"
                              value={
                                reviewMarks[submission.submission_id] || ""
                              }
                              onChange={(e) =>
                                setReviewMarks((prev) => ({
                                  ...prev,

                                  [submission.submission_id]: e.target.value,
                                }))
                              }
                            />

                            {/* FEEDBACK */}
                            <textarea
                              placeholder="Write feedback"
                              value={
                                reviewFeedback[submission.submission_id] || ""
                              }
                              onChange={(e) =>
                                setReviewFeedback((prev) => ({
                                  ...prev,

                                  [submission.submission_id]: e.target.value,
                                }))
                              }
                            />

                            {/* BUTTON */}
                            <button
                              className="btn btn-success"
                              onClick={() =>
                                handleReviewSubmission(submission.submission_id)
                              }
                              disabled={reviewing}
                            >
                              {reviewing ? "Saving..." : "Submit Review"}
                            </button>
                          </div>
                        )}

                        {/* EXISTING SCORE */}
                        {submission.marks && (
                          <div className="existing-review">
                            <p>
                              <strong>Score:</strong> {submission.marks}%
                            </p>

                            <p>
                              <strong>Feedback:</strong> {submission.feedback}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              );
            },
          )}
        </div>
      </div>
      {showAssignmentModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="modal-top">
              <h2>Create Assignment</h2>

              <button
                className="close-btn"
                onClick={() => setShowAssignmentModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Assignment Title</label>

                <input
                  type="text"
                  placeholder="Enter assignment title"
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  placeholder="Assignment instructions..."
                  value={assignmentDescription}
                  onChange={(e) => setAssignmentDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Deadline</label>

                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Upload PDF</label>

                <input
                  type="file"
                  onChange={(e) => setAssignmentFile(e.target.files[0])}
                />
              </div>

              <button
                className="submit-btn"
                onClick={handleCreateAssignment}
                disabled={creatingAssignment}
              >
                {creatingAssignment
                  ? "Creating..."
                  : `Create Assignment for Month ${selectedMonth}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
