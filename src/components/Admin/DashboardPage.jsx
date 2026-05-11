
import { SectionHeader } from "./AdminShared";

export default function DashboardPage({ stats, activity }) {
  return (
    <div>
      <SectionHeader title="Overview" subtitle="Platform health at a glance — today" />

      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-glow" style={{ background: s.accent }} />
            <p className="stat-label">{s.label}</p>
            <p className="stat-value" style={{ color: s.accent }}>{s.value}</p>
            <span className={`stat-change ${s.up ? "up" : "down"}`}>
              {s.up ? "↑" : "↓"} {s.change} this month
            </span>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div className="card p-card">
          <p className="card-title">Recent Activity</p>
          <div className="activity-list">
            {activity.map((a, i) => (
              <div key={i} className="activity-item">
                <span className="activity-dot" style={{ background: a.color }} />
                <div className="activity-body">
                  <p className="activity-action">{a.action}</p>
                  <p className="activity-detail">{a.detail}</p>
                </div>
                <span className="activity-time">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-right">
          <div className="card p-card">
            <p className="card-title">Quick Actions</p>
            {[
              { label: "Post a New Job",           emoji: "💼" },
              { label: "Add Skill to Catalog",     emoji: "🛠" },
              { label: "Review Pending Companies", emoji: "🏢" },
              { label: "Export User Report",       emoji: "📊" },
            ].map(a => (
              <button key={a.label} className="quick-action-btn">
                <span className="quick-action-icon">{a.emoji}</span>
                {a.label}
              </button>
            ))}
          </div>

          <div className="card p-card">
            <p className="card-title">Job Type Mix</p>
            {[
              { label: "Full-time", pct: 62, color: "#2563eb" },
              { label: "Freelance", pct: 28, color: "#f59e0b" },
              { label: "Intern",    pct: 10, color: "#9333ea" },
            ].map(m => (
              <div key={m.label} className="mix-row">
                <div className="mix-label-row">
                  <span className="mix-label">{m.label}</span>
                  <span className="mix-pct" style={{ color: m.color }}>{m.pct}%</span>
                </div>
                <div className="mix-track">
                  <div className="mix-fill" style={{ width: `${m.pct}%`, background: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}