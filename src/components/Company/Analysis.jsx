import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  ink:    "#0A0F1E",
  slate:  "#1E293B",
  muted:  "#64748B",
  faint:  "#94A3B8",
  border: "#E2E8F0",
  bg:     "#F8FAFC",
  card:   "#FFFFFF",
  blue:   "#2563EB",
  teal:   "#0D9488",
  violet: "#7C3AED",
  amber:  "#D97706",
  rose:   "#E11D48",
  green:  "#16A34A",
};

const STAGE_CONFIG = {
  applied:     { color: C.blue,   bg: "#EFF6FF", label: "Applied"     },
  shortlisted: { color: C.violet, bg: "#F5F3FF", label: "Shortlisted" },
  assessment:  { color: C.amber,  bg: "#FFFBEB", label: "Assessment"  },
  interview:   { color: C.teal,   bg: "#F0FDFA", label: "Interview"   },
  accepted:    { color: C.green,  bg: "#F0FDF4", label: "Accepted"    },
  rejected:    { color: C.rose,   bg: "#FFF1F2", label: "Rejected"    },
};

const PIPELINE_COLORS = Object.values(STAGE_CONFIG).map(s => s.color);

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimatedNumber({ target, duration = 1000, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p    = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return <>{val}{suffix}</>;
}

// ── Custom tooltip ────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.slate, borderRadius: 10, padding: "10px 14px",
      fontSize: 13, boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
      border: "1px solid rgba(255,255,255,0.08)",
    }}>
      <p style={{ margin: "0 0 6px", color: "#94A3B8", fontWeight: 600, fontSize: 12 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ margin: "3px 0", color: p.color, fontSize: 13 }}>
          {p.name}: <strong style={{ color: "#fff" }}>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, icon, suffix = "" }) {
  return (
    <div style={{
      background: C.card, borderRadius: 16, padding: "22px 24px",
      border: `1px solid ${C.border}`,
      position: "relative", overflow: "hidden",
      transition: "box-shadow 0.2s, transform 0.2s", cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color }} />
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: color, opacity: 0.07 }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {label}
        </span>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>
          {icon}
        </div>
      </div>

      <div style={{ fontSize: 34, fontWeight: 800, color: C.ink, letterSpacing: "-0.04em", lineHeight: 1, marginTop: 14 }}>
        <AnimatedNumber target={value} suffix={suffix} />
      </div>
      <p style={{ margin: "8px 0 0", fontSize: 12, color: C.faint }}>{sub}</p>
    </div>
  );
}

// ── Section card ──────────────────────────────────────────────────────────────
function Card({ title, subtitle, children, style = {} }) {
  return (
    <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: "22px 24px", ...style }}>
      {(title || subtitle) && (
        <div style={{ marginBottom: 20 }}>
          {title    && <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.ink }}>{title}</h3>}
          {subtitle && <p  style={{ margin: "4px 0 0", fontSize: 12, color: C.muted }}>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

// ── Funnel row ────────────────────────────────────────────────────────────────
function FunnelRow({ stage, value, total, idx }) {
  const cfg = STAGE_CONFIG[stage] || { color: C.blue, bg: "#EFF6FF", label: stage };
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
        background: cfg.bg, color: cfg.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 800,
      }}>
        {idx + 1}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.slate, textTransform: "capitalize" }}>
            {cfg.label}
          </span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{value}</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "1px 7px", borderRadius: 20, background: cfg.bg, color: cfg.color }}>
              {pct}%
            </span>
          </div>
        </div>
        <div style={{ height: 7, background: C.bg, borderRadius: 999, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: `linear-gradient(90deg, ${cfg.color}aa, ${cfg.color})`,
            borderRadius: 999, transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
          }} />
        </div>
      </div>
    </div>
  );
}

// ── Table cell style ──────────────────────────────────────────────────────────
const td = { padding: "13px 16px", verticalAlign: "middle" };

// ── Job table row ─────────────────────────────────────────────────────────────
function JobRow({ job, rank }) {
  const rate    = job.total > 0 ? Math.round((job.accepted / job.total) * 100) : 0;
  const barW    = Math.min((job.total / 60) * 100, 100);
  const rateColor = rate >= 20 ? C.green : rate >= 10 ? C.amber : C.rose;
  const rateBg    = rate >= 20 ? "#F0FDF4" : rate >= 10 ? "#FFFBEB" : "#FFF1F2";
  return (
    <tr style={{ borderBottom: `1px solid ${C.border}`, transition: "background 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.background = C.bg}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <td style={td}><span style={{ fontSize: 13, fontWeight: 600, color: C.faint }}>#{rank}</span></td>
      <td style={td}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
            background: C.bg, color: C.slate, border: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700,
          }}>
            {job.title?.charAt(0)}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.ink }}>{job.title}</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: C.faint }}>{job.type} · {job.location}</p>
          </div>
        </div>
      </td>
      <td style={td}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 5, background: C.bg, borderRadius: 99, overflow: "hidden", minWidth: 60 }}>
            <div style={{ height: "100%", width: `${barW}%`, background: C.blue, borderRadius: 99 }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{job.total}</span>
        </div>
      </td>
      <td style={td}><span style={{ fontSize: 13, fontWeight: 600, color: C.violet }}>{job.shortlisted}</span></td>
      <td style={td}><span style={{ fontSize: 13, fontWeight: 600, color: C.teal }}>{job.interviewed}</span></td>
      <td style={td}><span style={{ fontSize: 13, fontWeight: 600, color: C.green }}>{job.accepted}</span></td>
      <td style={td}>
        <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: rateBg, color: rateColor }}>
          {rate}%
        </span>
      </td>
      <td style={td}>
        <span style={{
          padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
          background: job.active ? "#F0FDF4" : C.bg,
          color: job.active ? C.green : C.faint,
        }}>
          {job.active ? "● Active" : "○ Closed"}
        </span>
      </td>
    </tr>
  );
}

// ── Skeleton loader ───────────────────────────────────────────────────────────
function Skeleton({ w = "100%", h = 20, r = 8 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
    }} />
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AnalyticsContent() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(false);

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(false);
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch("http://localhost:8000/api/company/analytics/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setAnalytics(await res.json());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ marginBottom: 28 }}>
        <Skeleton w={260} h={32} r={10} />
        <div style={{ marginTop: 8 }}><Skeleton w={340} h={16} r={6} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ background: C.card, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
            <Skeleton h={14} r={6} />
            <div style={{ marginTop: 14 }}><Skeleton h={36} r={8} /></div>
            <div style={{ marginTop: 10 }}><Skeleton w="60%" h={12} r={6} /></div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        {[240, 240].map((h, i) => (
          <div key={i} style={{ background: C.card, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
            <Skeleton w={180} h={18} r={6} />
            <div style={{ marginTop: 20 }}><Skeleton h={h} r={10} /></div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !analytics) return (
    <div style={{ textAlign: "center", padding: "80px 20px", background: C.card, borderRadius: 16, border: `1px dashed ${C.border}` }}>
      <div style={{ fontSize: 44, marginBottom: 14 }}>📊</div>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.ink }}>Could not load analytics</h3>
      <p style={{ margin: "8px 0 20px", fontSize: 14, color: C.muted }}>Check your connection or try again.</p>
      <button onClick={fetchAnalytics} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: C.blue, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
        Retry
      </button>
    </div>
  );

  // ── Derived values ────────────────────────────────────────────────────────
  const totalApps     = analytics.pipeline.reduce((s, p) => s + p.value, 0);
  const acceptedCount = analytics.pipeline.find(p => p.stage === "accepted")?.value || 0;
  const acceptRate    = totalApps > 0 ? parseFloat(((acceptedCount / totalApps) * 100).toFixed(1)) : 0;

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", color: C.ink }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: C.ink, letterSpacing: "-0.03em" }}>
            Analytics & Insights
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: C.muted }}>
            Hiring performance across all your job postings
          </p>
        </div>
        <button onClick={fetchAnalytics} style={{
          padding: "9px 18px", borderRadius: 10, border: `1px solid ${C.border}`,
          background: C.card, fontSize: 13, fontWeight: 600, color: C.slate, cursor: "pointer",
        }}
          onMouseEnter={e => e.currentTarget.style.background = C.bg}
          onMouseLeave={e => e.currentTarget.style.background = C.card}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
        <StatCard label="Total Applications" value={totalApps}                icon="📋" color={C.blue}   sub="Across all job postings" />
        <StatCard label="Active Jobs"         value={analytics.activeJobs}    icon="💼" color={C.teal}   sub={`${analytics.totalJobs} total posted`} />
        <StatCard label="Acceptance Rate"     value={acceptRate}              icon="✅" color={C.green}  sub={`${acceptedCount} candidates accepted`} suffix="%" />
        <StatCard label="Avg. Days to Hire"   value={analytics.avgDaysToHire} icon="⏱" color={C.violet} sub="From application to offer" />
      </div>

      {/* Line + Pie */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
        <Card title="Application Trend" subtitle="Daily applications & shortlists this month">
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={analytics.trend} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: C.faint }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: C.faint }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="applications" name="Applications" stroke={C.blue}   strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
              <Line type="monotone" dataKey="shortlisted"  name="Shortlisted"  stroke={C.violet} strokeWidth={2}   dot={false} strokeDasharray="5 3" activeDot={{ r: 4, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 20, marginTop: 12, justifyContent: "center" }}>
            {[{ color: C.blue, label: "Applications" }, { color: C.violet, label: "Shortlisted" }].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted }}>
                <div style={{ width: 24, height: 3, background: l.color, borderRadius: 2 }} />
                {l.label}
              </div>
            ))}
          </div>
        </Card>

        <Card title="Stage Distribution" subtitle="Where candidates are right now">
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={analytics.pipeline} dataKey="value" nameKey="stage"
                cx="50%" cy="45%" innerRadius={58} outerRadius={86}
                paddingAngle={3} strokeWidth={0}
              >
                {analytics.pipeline.map((_, i) => <Cell key={i} fill={PIPELINE_COLORS[i]} />)}
              </Pie>
              <Tooltip
                formatter={(v, n) => [v, n.charAt(0).toUpperCase() + n.slice(1)]}
                contentStyle={{ borderRadius: 10, fontSize: 12, border: `1px solid ${C.border}` }}
              />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: C.muted, paddingTop: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bar + Funnel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <Card title="Applications vs Accepted by Job" subtitle="Top 5 postings compared">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={analytics.byJob?.slice(0, 5)} margin={{ top: 4, right: 8, left: -24, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="title" tick={{ fontSize: 10, fill: C.faint }} axisLine={false} tickLine={false}
                tickFormatter={v => v.length > 12 ? v.slice(0, 12) + "…" : v} />
              <YAxis tick={{ fontSize: 11, fill: C.faint }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="total"    name="Applications" fill={C.blue}  radius={[5,5,0,0]} maxBarSize={28} />
              <Bar dataKey="accepted" name="Accepted"     fill={C.green} radius={[5,5,0,0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Hiring Funnel" subtitle="Drop-off at each pipeline stage">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {analytics.pipeline.map((p, i) => (
              <FunnelRow key={p.stage} stage={p.stage} value={p.value} total={totalApps} idx={i} />
            ))}
          </div>
        </Card>
      </div>

      {/* Job breakdown table */}
      <Card title="Job-wise Breakdown" subtitle="Full stats for every posting">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {["#", "Job Title", "Applications", "Shortlisted", "Interviewed", "Accepted", "Offer Rate", "Status"].map(h => (
                  <th key={h} style={{
                    padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700,
                    color: C.faint, textTransform: "uppercase", letterSpacing: "0.07em",
                    whiteSpace: "nowrap", borderBottom: `1px solid ${C.border}`,
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {analytics.byJob?.map((job, i) => <JobRow key={job.id} job={job} rank={i + 1} />)}
            </tbody>
          </table>
          {(!analytics.byJob || analytics.byJob.length === 0) && (
            <p style={{ textAlign: "center", padding: "32px 0", color: C.faint, fontSize: 14 }}>
              No job data available yet
            </p>
          )}
        </div>
      </Card>

    </div>
  );
}