import React from 'react';
import { companyName, IconBuilding } from './CompanyShared';

export default function SettingsContent() {
  return (
    <div className="settings-panel">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>
        Company Settings
      </h1>

      <div className="settings-card">

        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            defaultValue={companyName}
            className="form-input"
          />
        </div>

        <div>
          <label>Email Notifications</label>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked /> New application alerts
            </label>
            <label className="checkbox-label">
              <input type="checkbox" /> Weekly summary report
            </label>
          </div>
        </div>

        <div>
          <label>Company Logo</label>
          <div className="logo-upload">
            <div className="logo-placeholder">
              <IconBuilding width={32} height={32} style={{ color: '#94a3b8' }} />
            </div>
            <button className="upload-btn">Upload new</button>
          </div>
        </div>

        <button className="save-btn">Save Changes</button>

      </div>
    </div>
  );
}