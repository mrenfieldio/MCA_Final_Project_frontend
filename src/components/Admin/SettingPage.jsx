import { useState } from "react";
import { SectionHeader, InputField } from "./AdminShared";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName:          "JobSphere Portal",
    contactEmail:      "admin@jobsphere.in",
    maxJobsPerCompany: "50",
    allowFreelance:    true,
    requireApproval:   true,
    maintenanceMode:   false,
  });

  const toggle = key => setSettings(p => ({ ...p, [key]: !p[key] }));

  const FLAGS = [
    { key: "allowFreelance",  label: "Allow Freelance Listings",  color: "#22c55e" },
    { key: "requireApproval", label: "Require Company Approval",  color: "#f59e0b" },
    { key: "maintenanceMode", label: "Maintenance Mode",          color: "#f43f5e" },
  ];

  return (
    <div>
      <SectionHeader title="Settings" subtitle="Global platform configuration" />

      <div className="settings-grid">
        <div className="card p-card-lg">
          <p className="settings-section-title">General</p>
          <InputField label="Platform Name"        value={settings.siteName}          onChange={v => setSettings(p => ({ ...p, siteName: v }))}          />
          <InputField label="Contact Email" type="email" value={settings.contactEmail} onChange={v => setSettings(p => ({ ...p, contactEmail: v }))}   />
          <InputField label="Max Jobs per Company" type="number" value={settings.maxJobsPerCompany} onChange={v => setSettings(p => ({ ...p, maxJobsPerCompany: v }))} />
        </div>

        <div className="card p-card-lg">
          <p className="settings-section-title">Feature Flags</p>
          {FLAGS.map(f => (
            <div key={f.key} className="toggle-row">
              <div>
                <p className="toggle-label">{f.label}</p>
                <p className="toggle-sub">{settings[f.key] ? "Enabled" : "Disabled"}</p>
              </div>
              <div
                className="toggle-track"
                style={{ background: settings[f.key] ? f.color : "#e2e8f0" }}
                onClick={() => toggle(f.key)}
              >
                <div className="toggle-thumb" style={{ left: settings[f.key] ? 23 : 3 }} />
              </div>
            </div>
          ))}
        </div>

        <div className="span-full">
          <button className="btn-save">Save Settings</button>
        </div>
      </div>
    </div>
  );
}