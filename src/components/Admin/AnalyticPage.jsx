

import { SectionHeader } from "./AdminShared";

export default function AnalyticsPage() {
  const CHART_DATA = [
    { month: "Jan", jobs: 420, apps: 3200 },
    { month: "Feb", jobs: 510, apps: 4100 },
    { month: "Mar", jobs: 480, apps: 3800 },
    { month: "Apr", jobs: 630, apps: 5200 },
    { month: "May", jobs: 720, apps: 6100 },
    { month: "Jun", jobs: 680, apps: 5800 },
  ];

  const maxJobs = Math.max(...CHART_DATA.map(b => b.jobs));
  const maxApps = Math.max(...CHART_DATA.map(b => b.apps));

  return (
    <div>
      <SectionHeader title="Analytics" subtitle="Platform performance over the last 6 months" />

      <div className="analytics-charts">
        <div className="card p-card">
          <p className="card-title">Jobs Posted / Month</p>
          <div className="bar-chart-wrap">
            {CHART_DATA.map(b => (
              <div key={b.month} className="bar-col">
                <span className="bar-val">{b.jobs}</span>
                <div className="bar-fill" style={{ height: `${(b.jobs / maxJobs) * 90}px`, background: "#2563eb" }} />
                <span className="bar-month">{b.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-card">
          <p className="card-title">Applications / Month</p>
          <div className="bar-chart-wrap">
            {CHART_DATA.map(b => (
              <div key={b.month} className="bar-col">
                <span className="bar-val">{(b.apps / 1000).toFixed(1)}k</span>
                <div className="bar-fill" style={{ height: `${(b.apps / maxApps) * 90}px`, background: "#8b5cf6" }} />
                <span className="bar-month">{b.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="kpi-grid">
        {[
          { label: "Avg. Applications / Job", value: "64.2",       color: "#2563eb" },
          { label: "Company Approval Rate",   value: "78%",        color: "#f59e0b" },
          { label: "Student Placement Rate",  value: "43%",        color: "#8b5cf6" },
          { label: "Top Industry",            value: "IT Services",color: "#ec4899" },
          { label: "Top Skill Searched",      value: "Python",     color: "#f59e0b" },
          { label: "Freelance Jobs Share",    value: "28%",        color: "#22c55e" },
        ].map(m => (
          <div key={m.label} className="kpi-card">
            <p className="kpi-label">{m.label}</p>
            <p className="kpi-value" style={{ color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
