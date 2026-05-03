export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="nav-logo">
            <div className="nav-logo-icon">L</div>
            LinkPro
          </div>
          <p className="footer-tagline">The modern platform connecting freelancers and companies worldwide.</p>
          <div className="footer-socials">
            {["𝕏", "in", "▶", "📸"].map((s, i) => (
              <button key={i} className="social-btn">{s}</button>
            ))}
          </div>
        </div>
        {[
          { title: "Company", links: ["About", "Careers", "Press", "Blog"] },
          { title: "Support", links: ["Help Center", "Contact", "Trust & Safety", "Community"] },
          { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility"] },
        ].map(col => (
          <div className="footer-col" key={col.title}>
            <div className="footer-col-title">{col.title}</div>
            <ul>
              {col.links.map(l => <li key={l}><a href="#">{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">© 2026 LinkPro. All rights reserved.</span>
        <span className="footer-crafted">Crafted with care for freelancers & teams worldwide. <span>♥</span></span>
      </div>
    </footer>
  );
}