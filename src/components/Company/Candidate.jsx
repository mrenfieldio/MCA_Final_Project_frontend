import React, { useEffect, useState, useRef } from "react";
import {
  IconSearch,
  IconUsers,
  IconStar,
  IconCalendar,
  StatCard,
  Badge,
} from "./CompanyShared";

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999,
    }}>
      <div style={{
        background: "#fff", borderRadius: "12px", padding: "28px 32px",
        width: "460px", maxWidth: "90vw", boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 600 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#888" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "6px", color: "#555" }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "9px 12px", borderRadius: "7px",
  border: "1px solid #d1d5db", fontSize: "14px",
  boxSizing: "border-box", outline: "none",
};

// ─── Assessment Modal ─────────────────────────────────────────────────────────
function AssessmentModal({ candidate, onClose, onSubmit }) {
  const [form, setForm] = useState({ title: "", type: "mcq", instructions: "", deadline: "", link: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError("");
    if (!form.title.trim()) return setError("Assessment title is required.");
    if (!form.deadline)     return setError("Deadline is required.");
    setLoading(true);
    try {
      await onSubmit(candidate.id, form);
      onClose();
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`Send Assessment — ${candidate.student_name}`} onClose={onClose}>
      <p style={{ fontSize: "13px", color: "#666", marginTop: -12, marginBottom: 16 }}>
        Job: <strong>{candidate.job_title}</strong>
      </p>

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "7px", padding: "10px 14px", marginBottom: "14px", color: "#b91c1c", fontSize: "13px" }}>
          {error}
        </div>
      )}

      <Field label="Assessment title">
        <input style={inputStyle} placeholder='e.g. "React skills test"' value={form.title} onChange={(e) => set("title", e.target.value)} />
      </Field>

      <Field label="Type">
        <select style={inputStyle} value={form.type} onChange={(e) => set("type", e.target.value)}>
          <option value="mcq">MCQ (auto-graded)</option>
          <option value="coding">Coding challenge</option>
          <option value="file">File / assignment upload</option>
        </select>
      </Field>

      <Field label="Instructions for candidate">
        <textarea style={{ ...inputStyle, height: "80px", resize: "vertical" }}
          placeholder="Describe what the candidate needs to do..."
          value={form.instructions} onChange={(e) => set("instructions", e.target.value)} />
      </Field>

      {form.type !== "file" && (
        <Field label="External test link (optional)">
          <input style={inputStyle} placeholder="https://hackerrank.com/..." value={form.link} onChange={(e) => set("link", e.target.value)} />
        </Field>
      )}

      <Field label="Submission deadline">
        <input type="datetime-local" style={inputStyle} value={form.deadline} onChange={(e) => set("deadline", e.target.value)} />
      </Field>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
        <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: "7px", border: "1px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: "14px" }}>Cancel</button>
        <button onClick={handleSubmit} disabled={loading} style={{ padding: "9px 22px", borderRadius: "7px", border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: 500, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Sending…" : "Send Assessment"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Interview Modal ──────────────────────────────────────────────────────────
function InterviewModal({ candidate, onClose, onSubmit }) {
  const [form, setForm] = useState({ date: "", mode: "video", meetingLink: "", notes: "", interviewerName: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError("");
    if (!form.date) return setError("Please pick a date and time.");
    if (form.mode === "video" && !form.meetingLink.trim()) return setError("Meeting link is required for video interviews.");
    setLoading(true);
    try {
      await onSubmit(candidate.id, form);
      onClose();
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`Schedule Interview — ${candidate.student_name}`} onClose={onClose}>
      <p style={{ fontSize: "13px", color: "#666", marginTop: -12, marginBottom: 16 }}>
        Job: <strong>{candidate.job_title}</strong>
      </p>

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "7px", padding: "10px 14px", marginBottom: "14px", color: "#b91c1c", fontSize: "13px" }}>
          {error}
        </div>
      )}

      <Field label="Date & Time">
        <input type="datetime-local" style={inputStyle} value={form.date} onChange={(e) => set("date", e.target.value)} />
      </Field>

      <Field label="Interview mode">
        <select style={inputStyle} value={form.mode} onChange={(e) => set("mode", e.target.value)}>
          <option value="video">Video call</option>
          <option value="phone">Phone call</option>
          <option value="in-person">In-person</option>
        </select>
      </Field>

      {form.mode === "video" && (
        <Field label="Meeting link">
          <input style={inputStyle} placeholder="https://meet.google.com/..." value={form.meetingLink} onChange={(e) => set("meetingLink", e.target.value)} />
        </Field>
      )}
      {form.mode === "in-person" && (
        <Field label="Location / address">
          <input style={inputStyle} placeholder="Office address or room number" value={form.meetingLink} onChange={(e) => set("meetingLink", e.target.value)} />
        </Field>
      )}

      <Field label="Interviewer name">
        <input style={inputStyle} placeholder="Who will conduct the interview?" value={form.interviewerName} onChange={(e) => set("interviewerName", e.target.value)} />
      </Field>

      <Field label="Notes for candidate (optional)">
        <textarea style={{ ...inputStyle, height: "70px", resize: "vertical" }}
          placeholder="Anything the candidate should prepare..."
          value={form.notes} onChange={(e) => set("notes", e.target.value)} />
      </Field>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
        <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: "7px", border: "1px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: "14px" }}>Cancel</button>
        <button onClick={handleSubmit} disabled={loading} style={{ padding: "9px 22px", borderRadius: "7px", border: "none", background: "#0f766e", color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: 500, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Scheduling…" : "Schedule Interview"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onClose, danger }) {
  return (
    <Modal title="Confirm Action" onClose={onClose}>
      <p style={{ fontSize: "15px", color: "#333", marginTop: 0 }}>{message}</p>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
        <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: "7px", border: "1px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: "14px" }}>Cancel</button>
        <button onClick={onConfirm} style={{ padding: "9px 22px", borderRadius: "7px", border: "none", background: danger ? "#ef4444" : "#16a34a", color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: 500 }}>
          Confirm
        </button>
      </div>
    </Modal>
  );
}

// ─── Action Dropdown ──────────────────────────────────────────────────────────
// Shows only the ONE next valid action + reject. Clean single column, no clutter.
function ActionDropdown({ candidate, onShortlist, onAssessment, onInterview, onAccept, onReject, loading }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const status = candidate.status;

  const actions = [];
  if (status === "applied")      actions.push({ label: "✓ Shortlist",          color: "#2563eb", onClick: onShortlist });
  if (status === "shortlisted")  actions.push({ label: "📋 Send Assessment",   color: "#7c3aed", onClick: onAssessment });
  if (status === "assessment")   actions.push({ label: "📅 Schedule Interview", color: "#0f766e", onClick: onInterview });
  if (status === "interview")    actions.push({ label: "✓ Accept",              color: "#16a34a", onClick: onAccept });

  // Reject at any active stage
  if (!["accepted", "rejected"].includes(status)) {
    if (actions.length > 0) {
      // divider placeholder — rendered as a line
      actions.push({ divider: true });
    }
    actions.push({ label: "✕ Reject", color: "#ef4444", onClick: onReject });
  }

  if (actions.length === 0) {
    // Terminal state — show nothing actionable
    return <span style={{ fontSize: "12px", color: "#aaa", fontStyle: "italic" }}>No actions</span>;
  }

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        style={{
          padding: "6px 14px", borderRadius: "7px",
          border: "1px solid #d1d5db", background: "#fff",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "13px", fontWeight: 500,
          display: "flex", alignItems: "center", gap: "6px",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Working…" : "Actions"} <span style={{ fontSize: "10px" }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 4px)",
          background: "#fff", border: "1px solid #e5e7eb",
          borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          zIndex: 100, minWidth: "185px", overflow: "hidden",
        }}>
          {actions.map((a, i) =>
            a.divider ? (
              <div key={i} style={{ height: "1px", background: "#f3f4f6", margin: "2px 0" }} />
            ) : (
              <button
                key={a.label}
                onClick={() => { setOpen(false); a.onClick(); }}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "10px 16px", border: "none", background: "none",
                  fontSize: "13px", color: a.color, cursor: "pointer", fontWeight: 500,
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                onMouseLeave={(e) => e.currentTarget.style.background = "none"}
              >
                {a.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CandidateContent() {
  const [candidates, setCandidates]           = useState([]);
  const [search, setSearch]                   = useState("");
  const [loadingId, setLoadingId]             = useState(null);
  const [assessmentModal, setAssessmentModal] = useState(null);
  const [interviewModal, setInterviewModal]   = useState(null);
  const [confirmModal, setConfirmModal]       = useState(null);

  // ── Central API helper — throws on non-2xx so modals can catch & show error ──
  const api = async (url, body) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8000${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  };

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/company/applicants/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCandidates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch candidates:", err);
    }
  };

  useEffect(() => { fetchCandidates(); }, []);

  const updateStatus = async (id, status) => {
    setLoadingId(id);
    try {
      await api("/api/company/update-status/", { application_id: id, status });
      await fetchCandidates();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  // These throw — modal catches and shows inline error
  const submitAssessment = async (applicationId, formData) => {
    await api("/api/company/send-assessment/", { application_id: applicationId, ...formData });
    await fetchCandidates();
  };

  const submitInterview = async (applicationId, formData) => {
    await api("/api/company/schedule-interview/", { application_id: applicationId, ...formData });
    await fetchCandidates();
  };

  const confirmReject = (c) => setConfirmModal({
    message: `Reject ${c.student_name}'s application for "${c.job_title}"? They will be notified by email.`,
    danger: true,
    onConfirm: () => { setConfirmModal(null); updateStatus(c.id, "rejected"); },
  });

  const confirmAccept = (c) => setConfirmModal({
    message: `Accept ${c.student_name} for "${c.job_title}"? An offer email will be sent.`,
    danger: false,
    onConfirm: () => { setConfirmModal(null); updateStatus(c.id, "accepted"); },
  });

  const filteredCandidates = candidates.filter((c) =>
    c.job_title?.toLowerCase().includes(search.toLowerCase()) ||
    c.student_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {assessmentModal && (
        <AssessmentModal candidate={assessmentModal} onClose={() => setAssessmentModal(null)} onSubmit={submitAssessment} />
      )}
      {interviewModal && (
        <InterviewModal candidate={interviewModal} onClose={() => setInterviewModal(null)} onSubmit={submitInterview} />
      )}
      {confirmModal && (
        <ConfirmModal message={confirmModal.message} danger={confirmModal.danger} onConfirm={confirmModal.onConfirm} onClose={() => setConfirmModal(null)} />
      )}

      <div className="section-header">
        <div>
          <h1>Applicants</h1>
          <p>Students who applied to your jobs</p>
        </div>
        <div className="search-wrapper">
          <IconSearch className="search-icon" width={18} height={18} />
          <input type="text" placeholder="Search candidates or jobs" className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="stats-row-small">
        <StatCard icon={IconUsers}    title="Total Applications" value={candidates.length} colorClass="blue" />
        <StatCard icon={IconStar}     title="Accepted"  value={candidates.filter((c) => c.status === "accepted").length} colorClass="emerald" />
        <StatCard icon={IconCalendar} title="Pending"   value={candidates.filter((c) => ["applied","shortlisted"].includes(c.status)).length} colorClass="amber" />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Job</th>
              <th>Email</th>
              <th>Resume</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
                  No applicants found
                </td>
              </tr>
            ) : (
              filteredCandidates.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                        background: "#e2e8f0", display: "flex", alignItems: "center",
                        justifyContent: "center", fontWeight: 600, fontSize: "13px", color: "#475569",
                      }}>
                        {c.student_name?.charAt(0).toUpperCase()}
                      </div>
                      {c.student_name}
                    </div>
                  </td>
                  <td>{c.job_title}</td>
                  <td style={{ fontSize: "13px", color: "#555" }}>{c.email}</td>
                  <td>
                    {c.resume
                      ? <a href={c.resume} target="_blank" rel="noreferrer" className="action-btn">View</a>
                      : <span style={{ color: "#ccc" }}>N/A</span>}
                  </td>
                  <td><Badge status={c.status} /></td>
                  <td>
                    <ActionDropdown
                      candidate={c}
                      loading={loadingId === c.id}
                      onShortlist={()  => updateStatus(c.id, "shortlisted")}
                      onAssessment={() => setAssessmentModal(c)}
                      onInterview={()  => setInterviewModal(c)}
                      onAccept={()    => confirmAccept(c)}
                      onReject={()    => confirmReject(c)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}