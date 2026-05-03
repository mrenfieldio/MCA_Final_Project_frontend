import React from 'react';
import { jobsList } from './CompanyShared';

const funnelData = [
  { label: 'Applications', value: 847, width: '100%' },
  { label: 'Screening',    value: 490, width: '58%'  },
  { label: 'Interview',    value: 210, width: '25%'  },
];

export default function AnalyticsContent() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>
        Analytics & Insights
      </h1>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>
        Performance metrics & hiring funnels
      </p>

      <div className="charts-row">

        <div className="chart-card">
          <h3 className="chart-title">Applications by Job</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {jobsList.slice(0, 3).map(job => (
              <div key={job.id}>
                <div className="flex-between">
                  <span>{job.title}</span>
                  <span>{job.applicants}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill blue"
                    style={{ width: `${(job.applicants / 250) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Hiring Funnel</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {funnelData.map((item) => (
              <div key={item.label}>
                <div className="flex-between">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill emerald"
                    style={{ width: item.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}