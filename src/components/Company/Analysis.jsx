import React, { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts";

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  ink:     "#0D0D0D",
  slate:   "#1E293B",
  muted:   "#64748B",
  border:  "#E8EBF0",
  bg:      "#F7F8FA",
  white:   "#FFFFFF",
  blue:    "#2563EB",
  teal:    "#0D9488",
  violet:  "#7C3AED",
  amber:   "#D97706",
  rose:    "#E11D48",
  green:   "#16A34A",
};

const PIPELINE_COLORS = [C.blue, C.violet, C.amber, C.teal, C.green, C.rose];
const PIPELINE_STAGES = ["applied", "shortlisted", "assessment", "interview", "accepted", "rejected"];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : n;

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.slate, color: "#fff", borderRadius: 8,
      padding: "10px 14px", fontSize: 13, boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    }}>
      <p style={{ margin: "0 0 4px", fontWeight: 600, color: "#94A3B8" }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ margin: "2px 0", color: p.color }}>
          {p.name}: <strong style={{ color: "#fff" }}>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimatedNumber({ target, duration = 1200 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return <>{fmt(val)}</>;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, icon }) {
  return (
    <div style={{
      background: C.white, borderRadius: 14, padding: "22px 24px",
      border: `1px solid ${C.border}`,
      borderTop: `3px solid ${color}`,
      display: "flex", flexDirection: "column", gap: 8,
      transition: "box-shadow 0.2s, transform 0.2s",
      cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 28px rgba(0,0,0,0.09)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</span>
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: C.ink, letterSpacing: "-0.03em", lineHeight: 1 }}>
        <AnimatedNumber target={value} />
      </div>
      <p style={{ margin: 0, fontSize: 12, color: C.muted }}>{sub}</p>
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Card({ title, subtitle, children, style }) {
  return (
    <div style={{
      background: C.white, borderRadius: 14, border: `1px solid ${C.border}`,
      padding: "22px 24px", ...style,
    }}>
      {title && (
        <div style={{ marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.ink }}>{title}</h3>
          {subtitle && <p style={{ margin: "4px 0 0", fontSize: 12, color: C.muted }}>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

// ── Funnel bar ────────────────────────────────────────────────────────────────
function FunnelBar({ label, value, total, color, idx }) {
  const pct = Math.round((value / total) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: color + "18", color: color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 800, flexShrink: 0,
      }}>
        {idx + 1}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.slate, textTransform: "capitalize" }}>{label}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: color }}>{value} <span style={{ fontSize: 11, fontWeight: 400, color: C.muted }}>({pct}%)</span></span>
        </div>
        <div style={{ height: 8, background: C.bg, borderRadius: 999, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`, background: color,
            borderRadius: 999, transition: "width 1s ease",
          }} />
        </div>
      </div>
    </div>
  );
}

// ── Job row in table ──────────────────────────────────────────────────────────
function JobRow({ job, rank }) {
  const acceptance = job.total > 0 ? Math.round((job.accepted / job.total) * 100) : 0;
  const barPct = Math.min((job.total / 60) * 100, 100);
  return (
    <tr style={{ borderBottom: `1px solid ${C.border}` }}
      onMouseEnter={e => e.currentTarget.style.background = C.bg}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <td style={{ padding: "12px 16px", fontSize: 13, color: C.muted, fontWeight: 600 }}>#{rank}</td>
      <td style={{ padding: "12px 16px" }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.ink }}>{job.title}</p>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: C.muted }}>{job.type} · {job.location}</p>
      </td>
      <td style={{ padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 6, background: C.bg, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${barPct}%`, background: C.blue, borderRadius: 99 }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.ink, minWidth: 24 }}>{job.total}</span>
        </div>
      </td>
      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: C.violet }}>{job.shortlisted}</td>
      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: C.teal }}>{job.interviewed}</td>
      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: C.green }}>{job.accepted}</td>
      <td style={{ padding: "12px 16px" }}>
        <span style={{
          padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700,
          background: acceptance >= 20 ? "#F0FDF4" : acceptance >= 10 ? "#FFFBEB" : "#FEF2F2",
          color: acceptance >= 20 ? C.green : acceptance >= 10 ? C.amber : C.rose,
        }}>
          {acceptance}%
        </span>
      </td>
      <td style={{ padding: "12px 16px" }}>
        <span style={{
          padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
          background: job.active ? "#F0FDF4" : "#F1F5F9",
          color: job.active ? C.green : C.muted,
        }}>
          {job.active ? "Active" : "Closed"}
        </span>
      </td>
    </tr>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AnalyticsContent({ data }) {
  // ── Use real data from props or fall back to sample data ──────────────────
  const d = data || SAMPLE_DATA;

  const totalApps    = d.pipeline.reduce((s, p) => s + p.value, 0);
  const acceptedCount = d.pipeline.find(p => p.stage === "accepted")?.value || 0;
  const rejectedCount = d.pipeline.find(p => p.stage === "rejected")?.value || 0;
  const acceptRate   = totalApps > 0 ? ((acceptedCount / totalApps) * 100).toFixed(1) : 0;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: C.ink }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: C.ink, letterSpacing: "-0.03em" }}>
          Analytics & Insights
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 14, color: C.muted }}>
          Hiring performance across all your job postings
        </p>
      </div>

      {/* ── Row 1: Stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
        <StatCard label="Total Applications" value={totalApps}         icon="📋" color={C.blue}   sub="Across all jobs" />
        <StatCard label="Active Jobs"         value={d.activeJobs}     icon="💼" color={C.teal}   sub={`${d.totalJobs} total posted`} />
        <StatCard label="Acceptance Rate"     value={parseFloat(acceptRate)} icon="✅" color={C.green}  sub={`${acceptedCount} candidates hired`} />
        <StatCard label="Avg. Time to Hire"   value={d.avgDaysToHire}  icon="⏱" color={C.violet} sub="Days from apply to accept" />
      </div>

      {/* ── Row 2: Line chart + Pie chart ── */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>

        {/* Applications over time */}
        <Card title="Application Trend" subtitle="Daily applications received this month">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={d.trend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: C.muted }} />
              <YAxis tick={{ fontSize: 11, fill: C.muted }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="applications" name="Applications" stroke={C.blue} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="shortlisted"  name="Shortlisted"  stroke={C.violet} strokeWidth={2} dot={false} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Stage distribution donut */}
        <Card title="Stage Distribution" subtitle="Where candidates are right now">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={d.pipeline.filter(p => p.stage !== "rejected")}
                dataKey="value" nameKey="stage"
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={85}
                paddingAngle={3}
              >
                {d.pipeline.filter(p => p.stage !== "rejected").map((_, i) => (
                  <Cell key={i} fill={PIPELINE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

      </div>

      {/* ── Row 3: Bar chart + Funnel ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>

        {/* Applications by job */}
        <Card title="Applications by Job" subtitle="Top performing job postings">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={d.byJob.slice(0, 5)} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: C.muted }} />
              <YAxis type="category" dataKey="title" tick={{ fontSize: 11, fill: C.muted }} width={110} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total" name="Applications" fill={C.blue} radius={[0, 6, 6, 0]} barSize={18} />
              <Bar dataKey="accepted" name="Accepted" fill={C.green} radius={[0, 6, 6, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Hiring funnel */}
        <Card title="Hiring Funnel" subtitle="Drop-off at each pipeline stage">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {d.pipeline.map((p, i) => (
              <FunnelBar
                key={p.stage}
                label={p.stage}
                value={p.value}
                total={totalApps}
                color={PIPELINE_COLORS[i]}
                idx={i}
              />
            ))}
          </div>
        </Card>

      </div>

      {/* ── Row 4: Job breakdown table ── */}
      <Card title="Job-wise Breakdown" subtitle="Detailed stats for every posting">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {["#", "Job Title", "Applications", "Shortlisted", "Interviewed", "Accepted", "Rate", "Status"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.byJob.map((job, i) => <JobRow key={job.id} job={job} rank={i + 1} />)}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}

// ── Sample data — replace with real API data ──────────────────────────────────
const SAMPLE_DATA = {
  totalJobs:     12,
  activeJobs:     7,
  avgDaysToHire: 18,

  pipeline: [
    { stage: "applied",     value: 247 },
    { stage: "shortlisted", value: 148 },
    { stage: "assessment",  value:  94 },
    { stage: "interview",   value:  51 },
    { stage: "accepted",    value:  23 },
    { stage: "rejected",    value:  80 },
  ],

  trend: [
    { day: "1 May",  applications: 12, shortlisted: 4 },
    { day: "5 May",  applications: 19, shortlisted: 7 },
    { day: "10 May", applications: 31, shortlisted: 12 },
    { day: "15 May", applications: 24, shortlisted: 9 },
    { day: "20 May", applications: 38, shortlisted: 15 },
    { day: "25 May", applications: 27, shortlisted: 10 },
    { day: "30 May", applications: 42, shortlisted: 18 },
  ],

  byJob: [
    { id: 1, title: "Frontend Developer",   type: "Full-time", location: "Remote",    total: 54, shortlisted: 20, interviewed: 10, accepted: 4,  active: true  },
    { id: 2, title: "Backend Engineer",     type: "Full-time", location: "Bangalore", total: 47, shortlisted: 18, interviewed:  8, accepted: 3,  active: true  },
    { id: 3, title: "UI/UX Designer",       type: "Contract",  location: "Remote",    total: 38, shortlisted: 14, interviewed:  6, accepted: 2,  active: true  },
    { id: 4, title: "Data Analyst",         type: "Full-time", location: "Mumbai",    total: 32, shortlisted: 10, interviewed:  5, accepted: 2,  active: false },
    { id: 5, title: "DevOps Engineer",      type: "Full-time", location: "Hyderabad", total: 29, shortlisted:  9, interviewed:  4, accepted: 1,  active: true  },
    { id: 6, title: "Product Manager",      type: "Full-time", location: "Delhi",     total: 25, shortlisted:  8, interviewed:  4, accepted: 3,  active: false },
    { id: 7, title: "React Native Dev",     type: "Full-time", location: "Remote",    total: 22, shortlisted:  7, interviewed:  3, accepted: 1,  active: true  },
  ],
};