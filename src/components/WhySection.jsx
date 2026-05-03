export default function WhySection() {
  const features = [
    { icon: "💼", title: "Easy Job Posting", desc: "Publish your opening in minutes with our streamlined posting flow and reach thousands of qualified candidates." },
    { icon: "🔒", title: "Secure Payments", desc: "Escrow-protected milestones ensure freelancers get paid and clients receive quality work — every time." },
    { icon: "✅", title: "Verified Freelancers", desc: "Every professional is identity-verified and skill-tested so you can hire with absolute confidence." },
    { icon: "✨", title: "Smart Matching", desc: "AI-powered recommendations connect you with the right jobs or talent based on skills, history, and goals." },
  ];
  return (
    <section className="section why">
      <p className="section-label">Why LinkPro</p>
      <h2 className="section-title">Built for modern work</h2>
      <p className="section-sub">Everything you need to find work or hire talent — without the friction.</p>
      <div className="features-grid">
        {features.map(f => (
          <div className="feat-card" key={f.title}>
            <div className="feat-icon">{f.icon}</div>
            <div className="feat-title">{f.title}</div>
            <p className="feat-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}