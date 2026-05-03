export const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-deep: #050c1a;
    --bg-card: #0b1628;
    --bg-card2: #0d1c35;
    --border: rgba(0,200,255,0.08);
    --cyan: #00d4ff;
    --cyan2: #00f0c0;
    --white: #e8f4ff;
    --muted: #6b8aaa;
    --gradient: linear-gradient(135deg, #00d4ff 0%, #00f0c0 100%);
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  body { background: var(--bg-deep); color: var(--white); font-family: var(--font-body); }

  .lp-root { min-height: 100vh; overflow-x: hidden; }

  /* ── NAV ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 6%; height: 64px;
    background: rgba(5,12,26,0.85);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo { display: flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; color: var(--white); }
  .nav-logo-icon { width: 32px; height: 32px; background: var(--gradient); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; font-weight: 800; color: #050c1a; }
  .nav-links { display: flex; gap: 32px; list-style: none; }
  .nav-links a { color: var(--muted); text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
  .nav-links a:hover { color: var(--white); }
  .nav-actions { display: flex; gap: 12px; align-items: center; }
  .btn-ghost { background: none; border: none; color: var(--muted); cursor: pointer; font-family: var(--font-body); font-size: 0.9rem; padding: 8px 16px; transition: color 0.2s; }
  .btn-ghost:hover { color: var(--white); }
  .btn-primary { background: var(--gradient); border: none; border-radius: 8px; color: #050c1a; cursor: pointer; font-family: var(--font-display); font-size: 0.85rem; font-weight: 700; padding: 9px 20px; transition: opacity 0.2s, transform 0.2s; }
  .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }

  /* ── HERO ── */
  .hero {
    min-height: 100vh; display: flex; align-items: center;
    padding: 80px 6% 60px;
    position: relative; overflow: hidden;
  }
  .hero-bg {
    position: absolute; inset: 0; z-index: 0;
    background: radial-gradient(ellipse 70% 60% at 70% 40%, rgba(0,212,255,0.07) 0%, transparent 65%),
                radial-gradient(ellipse 40% 40% at 20% 80%, rgba(0,240,192,0.05) 0%, transparent 60%);
  }
  .hero-grid {
    position: absolute; inset: 0; z-index: 0; opacity: 0.04;
    background-image: linear-gradient(var(--cyan) 1px, transparent 1px),
                      linear-gradient(90deg, var(--cyan) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .hero-inner { position: relative; z-index: 1; display: flex; align-items: center; gap: 60px; width: 100%; max-width: 1200px; margin: 0 auto; }
  .hero-text { flex: 1; animation: fadeUp 0.8s ease both; }
  .hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.2); border-radius: 100px; padding: 5px 14px; font-size: 0.78rem; color: var(--cyan); margin-bottom: 24px; }
  .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--cyan2); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
  .hero-h1 { font-family: var(--font-display); font-size: clamp(2.4rem, 5vw, 4rem); font-weight: 800; line-height: 1.1; margin-bottom: 20px; }
  .hero-h1 span { background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .hero-sub { color: var(--muted); font-size: 1.05rem; line-height: 1.7; max-width: 420px; margin-bottom: 36px; }
  .hero-btns { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 48px; }
  .btn-outline { background: none; border: 1px solid rgba(0,212,255,0.3); border-radius: 8px; color: var(--cyan); cursor: pointer; font-family: var(--font-display); font-size: 0.85rem; font-weight: 600; padding: 10px 24px; transition: all 0.2s; }
  .btn-outline:hover { background: rgba(0,212,255,0.08); }
  .hero-stats { display: flex; gap: 36px; }
  .stat-num { font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .stat-label { color: var(--muted); font-size: 0.8rem; margin-top: 2px; }

  /* hero visual */
  .hero-visual { flex: 0 0 420px; animation: fadeUp 0.8s 0.2s ease both; }
  .hero-card-wrap { position: relative; }
  .hero-card-main {
    background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px;
    padding: 24px; position: relative; overflow: hidden;
  }
  .hero-card-main::before { content:''; position:absolute; inset:0; background: radial-gradient(ellipse 80% 60% at 80% 20%, rgba(0,212,255,0.06) 0%, transparent 60%); }
  .card-browser-dots { display: flex; gap: 6px; margin-bottom: 16px; }
  .dot { width: 10px; height: 10px; border-radius: 50%; }
  .dot-r { background: #ff5f57; }
  .dot-y { background: #febc2e; }
  .dot-g { background: #28c840; }
  .card-screen { background: var(--bg-deep); border-radius: 10px; overflow: hidden; aspect-ratio: 16/10; display: flex; align-items: center; justify-content: center; position: relative; }
  .card-screen-inner { width: 100%; height: 100%; background: linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(0,240,192,0.05) 100%); display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 16px; }
  .iso-block { display: flex; gap: 12px; align-items: flex-end; }
  .iso-item { border-radius: 10px; }
  .iso-1 { width: 60px; height: 80px; background: linear-gradient(160deg, rgba(0,212,255,0.3), rgba(0,212,255,0.1)); border: 1px solid rgba(0,212,255,0.2); }
  .iso-2 { width: 80px; height: 100px; background: linear-gradient(160deg, rgba(0,240,192,0.3), rgba(0,240,192,0.1)); border: 1px solid rgba(0,240,192,0.2); }
  .iso-3 { width: 60px; height: 65px; background: linear-gradient(160deg, rgba(0,212,255,0.2), rgba(0,212,255,0.05)); border: 1px solid rgba(0,212,255,0.15); }
  .floating-tag {
    position: absolute; background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px;
    padding: 8px 14px; font-size: 0.75rem; display: flex; align-items: center; gap: 7px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }
  .ft-1 { bottom: -16px; left: -24px; animation: float1 4s ease-in-out infinite; }
  .ft-2 { top: -16px; right: -20px; animation: float2 3.5s ease-in-out infinite; }
  .ft-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--gradient); }
  @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }

  /* ── SECTION COMMON ── */
  .section { padding: 100px 6%; }
  .section-label { text-align: center; font-size: 0.75rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--cyan); font-weight: 600; margin-bottom: 12px; }
  .section-title { text-align: center; font-family: var(--font-display); font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 800; margin-bottom: 14px; }
  .section-sub { text-align: center; color: var(--muted); font-size: 1rem; max-width: 460px; margin: 0 auto 56px; line-height: 1.7; }

  /* ── WHY ── */
  .why { background: var(--bg-card); }
  .features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; max-width: 1100px; margin: 0 auto; }
  .feat-card {
    background: var(--bg-deep); border: 1px solid var(--border); border-radius: 16px;
    padding: 28px 24px; transition: border-color 0.25s, transform 0.25s;
  }
  .feat-card:hover { border-color: rgba(0,212,255,0.25); transform: translateY(-4px); }
  .feat-icon { width: 44px; height: 44px; border-radius: 10px; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; margin-bottom: 16px; }
  .feat-title { font-family: var(--font-display); font-weight: 700; font-size: 1rem; margin-bottom: 8px; }
  .feat-desc { color: var(--muted); font-size: 0.85rem; line-height: 1.65; }

  /* ── HOW IT WORKS ── */
  .steps-row { display: flex; align-items: flex-start; justify-content: center; gap: 0; max-width: 860px; margin: 0 auto; position: relative; }
  .step-connector { flex: 1; height: 2px; background: linear-gradient(90deg, var(--cyan), var(--cyan2)); margin-top: 32px; opacity: 0.25; }
  .step { text-align: center; flex: 0 0 220px; }
  .step-num { width: 64px; height: 64px; border-radius: 50%; background: rgba(0,212,255,0.1); border: 2px solid rgba(0,212,255,0.3); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 1.4rem; font-weight: 800; color: var(--cyan); margin: 0 auto 20px; position: relative; }
  .step-num::after { content:''; position:absolute; inset:-6px; border-radius:50%; border:1px solid rgba(0,212,255,0.1); }
  .step-icon { font-size: 1.4rem; }
  .step-title { font-family: var(--font-display); font-weight: 700; margin-bottom: 8px; }
  .step-desc { color: var(--muted); font-size: 0.85rem; line-height: 1.6; }

  /* ── CATEGORIES ── */
  .cats { background: var(--bg-card); }
  .cats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; max-width: 900px; margin: 0 auto; }
  .cat-card {
    background: var(--bg-deep); border: 1px solid var(--border); border-radius: 14px;
    padding: 22px 20px; cursor: pointer; transition: all 0.25s; display: flex; flex-direction: column; gap: 6px;
  }
  .cat-card:hover { border-color: rgba(0,212,255,0.3); background: rgba(0,212,255,0.04); transform: translateY(-3px); }
  .cat-icon { font-size: 1.3rem; margin-bottom: 4px; }
  .cat-name { font-family: var(--font-display); font-weight: 700; font-size: 0.95rem; }
  .cat-count { color: var(--muted); font-size: 0.8rem; }

  /* ── TESTIMONIALS ── */
  .testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 1000px; margin: 0 auto; }
  .testi-card {
    background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px;
    padding: 28px; transition: border-color 0.25s;
  }
  .testi-card:hover { border-color: rgba(0,212,255,0.2); }
  .stars { color: #fbbf24; font-size: 0.9rem; letter-spacing: 2px; margin-bottom: 14px; }
  .testi-text { color: #a8c0d6; font-size: 0.88rem; line-height: 1.7; margin-bottom: 20px; font-style: italic; }
  .testi-author { display: flex; align-items: center; gap: 10px; }
  .testi-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-weight: 700; font-size: 0.8rem; color: #050c1a; }
  .av-blue { background: var(--gradient); }
  .av-purple { background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; }
  .av-orange { background: linear-gradient(135deg, #f97316, #fbbf24); }
  .testi-name { font-family: var(--font-display); font-weight: 700; font-size: 0.9rem; }
  .testi-role { color: var(--muted); font-size: 0.78rem; }

  /* ── CTA ── */
  .cta-section {
    margin: 0 6% 80px; border-radius: 24px;
    background: linear-gradient(135deg, #0a1f3d 0%, #0d2848 50%, #0a1f3d 100%);
    border: 1px solid rgba(0,212,255,0.15);
    padding: 80px 40px; text-align: center; position: relative; overflow: hidden;
  }
  .cta-section::before { content:''; position:absolute; inset:0; background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,212,255,0.07) 0%, transparent 70%); }
  .cta-section > * { position: relative; z-index: 1; }
  .cta-h2 { font-family: var(--font-display); font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 800; margin-bottom: 14px; }
  .cta-sub { color: var(--muted); font-size: 1rem; margin-bottom: 36px; }
  .cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .btn-cta { background: var(--gradient); border: none; border-radius: 10px; color: #050c1a; cursor: pointer; font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; padding: 14px 30px; transition: opacity 0.2s, transform 0.2s; display: flex; align-items: center; gap: 8px; }
  .btn-cta:hover { opacity: 0.88; transform: translateY(-2px); }
  .btn-cta-outline { background: none; border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; color: var(--white); cursor: pointer; font-family: var(--font-display); font-size: 0.95rem; font-weight: 600; padding: 14px 30px; transition: all 0.2s; }
  .btn-cta-outline:hover { background: rgba(255,255,255,0.05); }

  /* ── FOOTER ── */
  .footer { background: var(--bg-card); border-top: 1px solid var(--border); padding: 60px 6% 28px; }
  .footer-inner { display: flex; gap: 48px; max-width: 1100px; margin: 0 auto 48px; flex-wrap: wrap; }
  .footer-brand { flex: 1; min-width: 200px; }
  .footer-tagline { color: var(--muted); font-size: 0.85rem; line-height: 1.65; max-width: 220px; margin: 12px 0 20px; }
  .footer-socials { display: flex; gap: 10px; }
  .social-btn { width: 34px; height: 34px; border-radius: 8px; background: rgba(255,255,255,0.04); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
  .social-btn:hover { background: rgba(0,212,255,0.1); border-color: rgba(0,212,255,0.3); }
  .footer-col { flex: 0 0 140px; }
  .footer-col-title { font-family: var(--font-display); font-weight: 700; font-size: 0.88rem; margin-bottom: 16px; }
  .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .footer-col a { color: var(--muted); text-decoration: none; font-size: 0.85rem; transition: color 0.2s; }
  .footer-col a:hover { color: var(--white); }
  .footer-bottom { border-top: 1px solid var(--border); padding-top: 24px; display: flex; align-items: center; justify-content: space-between; max-width: 1100px; margin: 0 auto; }
  .footer-copy { color: var(--muted); font-size: 0.8rem; }
  .footer-crafted { color: var(--muted); font-size: 0.8rem; }
  .footer-crafted span { color: var(--cyan); }

  @media (max-width: 900px) {
    .hero-inner { flex-direction: column; }
    .hero-visual { flex: unset; width: 100%; max-width: 400px; }
    .features-grid { grid-template-columns: repeat(2, 1fr); }
    .cats-grid { grid-template-columns: repeat(2, 1fr); }
    .testi-grid { grid-template-columns: 1fr; }
    .steps-row { flex-direction: column; align-items: center; gap: 32px; }
    .step-connector { display: none; }
  }
  @media (max-width: 600px) {
    .nav-links { display: none; }
    .features-grid { grid-template-columns: 1fr; }
    .cats-grid { grid-template-columns: repeat(2, 1fr); }
    .hero-stats { gap: 20px; }
  }
`;