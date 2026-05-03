import { Fragment } from 'react';

export default function HowItWorksSection() {
  const steps = [
    { num: "1", icon: "👤", title: "Create Account", desc: "Sign up free and build a profile that showcases your skills or company." },
    { num: "2", icon: "📋", title: "Post or Apply", desc: "Post a job in minutes or browse thousands of curated opportunities." },
    { num: "3", icon: "🎉", title: "Get Hired", desc: "Collaborate, deliver work, and grow with secure payments and reviews." },
  ];
  return (
    <section className="section">
      <p className="section-label">How It Works</p>
      <h2 className="section-title">Three steps to success</h2>
      <p className="section-sub">A simple, powerful workflow that gets you results fast.</p>
      <div className="steps-row">
        {steps.map((s, i) => (
          <Fragment key={s.num}>
            <div className="step">
              <div className="step-num">{s.icon}</div>
              <div className="step-title">{s.title}</div>
              <p className="step-desc">{s.desc}</p>
            </div>
            {i < steps.length - 1 && <div className="step-connector" key={`c-${i}`} />}
          </Fragment>
        ))}
      </div>
    </section>
  );
}