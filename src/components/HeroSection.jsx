import Main from "../assets/images/Main.jpg";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-grid" />
      <div className="hero-inner">
        <div className="hero-text">
          {/* <div className="hero-badge">
            <span className="badge-dot" />
            Trusted by 50,000+ professionals worldwide
          </div> */}
          <h1 className="hero-h1">
            Find the Right Job
            <br />
            or <span>Hire the Best Talent</span>
          </h1>
          <p className="hero-sub">
            Connect employers and freelancers in one powerful platform. Post
            jobs, discover top talent, and grow your career — all in one place.
          </p>
          <div className="hero-btns">
            <button
              className="btn-primary"
              style={{
                padding: "12px 28px",
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              🔍 Find Jobs →
            </button>
            <button className="btn-outline">Hire Talent</button>
          </div>
          <div className="hero-stats">
            {[
              ["12K+", "Active Jobs"],
              ["50K+", "Freelancers"],
              ["98%", "Satisfaction"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="stat-num">{n}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card-wrap">
            <div className="hero-card-main">
              <div className="card-browser-dots">
                <span className="dot dot-r" />
                <span className="dot dot-y" />
                <span className="dot dot-g" />
              </div>
              <div className="card-screen">
                <img
                  src={Main}
                  alt="Job opportunities illustration"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
