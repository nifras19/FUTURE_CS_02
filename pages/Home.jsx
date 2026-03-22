import { useState, useEffect, useRef } from "react";

export default function Home() {
  const canvasRef = useRef(null);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    let animId;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Grid
      ctx.strokeStyle = "rgba(0,240,255,0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,200,255,${p.alpha})`;
        ctx.fill();
      });
      // Lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(120,80,255,${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }
    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", handleResize); };
  }, []);

  const navigate = (page) => {
    window.location.href = `/${page}`;
  };

  return (
    <div style={styles.root}>
      <canvas ref={canvasRef} style={styles.canvas} />

      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <span style={styles.shieldIcon}>🛡️</span>
          <span style={styles.navTitle}>PhishGuard</span>
        </div>
        <div style={styles.navLinks}>
          {["Analyzer", "Awareness", "Guidelines", "Report"].map(p => (
            <button key={p} style={styles.navBtn} onClick={() => navigate(p)}>{p}</button>
          ))}
          <button style={styles.loginBtn} onClick={() => navigate("Login")}>Login</button>
          <button style={styles.registerBtn} onClick={() => navigate("Register")}>Register</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroBadge}>🔒 AI-Powered Threat Detection</div>
        <h1 style={styles.heroTitle}>
          Phishing Email<br />
          <span style={styles.heroGlow}>Detection & Awareness</span><br />
          System
        </h1>
        <p style={styles.heroSub}>
          Protecting users from phishing attacks through intelligent email analysis and security awareness.
        </p>
        <div style={styles.heroBtns}>
          <button style={styles.primaryBtn} onClick={() => navigate("Analyzer")}>
            ⚡ Start Email Analysis
          </button>
          <button style={styles.secondaryBtn} onClick={() => navigate("Awareness")}>
            📚 Learn About Phishing
          </button>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          {[
            { label: "Emails Analyzed", value: "2.4M+", icon: "📧" },
            { label: "Threats Blocked", value: "847K+", icon: "🚫" },
            { label: "Users Protected", value: "150K+", icon: "👥" },
            { label: "Accuracy Rate", value: "99.2%", icon: "✅" },
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={styles.statIcon}>{s.icon}</div>
              <div style={styles.statVal}>{s.value}</div>
              <div style={styles.statLbl}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🔍 Platform Capabilities</h2>
        <div style={styles.featureGrid}>
          {[
            { icon: "📧", title: "Email Analyzer", desc: "Paste any suspicious email and get instant risk classification with detailed indicator breakdown.", page: "Analyzer" },
            { icon: "🔬", title: "Header Inspector", desc: "Analyze email headers for SPF, DKIM, and DMARC authentication status and IP reputation.", page: "Analyzer" },
            { icon: "📊", title: "Analysis Reports", desc: "View historical analysis logs with risk levels, detected indicators, and timestamps.", page: "Report" },
            { icon: "🎓", title: "Phishing Awareness", desc: "Learn about phishing tactics, real-world examples, and how to protect yourself.", page: "Awareness" },
            { icon: "📋", title: "Security Guidelines", desc: "Clear DO and DON'T guidelines for handling emails safely in corporate environments.", page: "Guidelines" },
            { icon: "⚡", title: "Real-Time Detection", desc: "Instant analysis using AI-powered detection algorithms trained on millions of phishing samples.", page: "Analyzer" },
          ].map((f, i) => (
            <div key={i} style={styles.featureCard} onClick={() => navigate(f.page)}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
              <div style={styles.featureArrow}>→</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}>🛡️ PhishGuard</div>
          <div style={styles.footerTip}>💡 Security Tip: Never click links in unexpected emails. Always verify the sender's domain carefully.</div>
          <div style={styles.footerCopy}>© 2025 PhishGuard Cybersecurity Platform. All rights reserved.</div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a1a; }
        ::-webkit-scrollbar-thumb { background: #00c8ff; border-radius: 3px; }
        button:hover { transform: translateY(-2px); transition: all 0.2s ease; }
      `}</style>
    </div>
  );
}

const styles = {
  root: { minHeight: "100vh", background: "linear-gradient(135deg, #050510 0%, #0a0a2e 40%, #050515 100%)", fontFamily: "'Rajdhani', sans-serif", color: "#e0e8ff", position: "relative" },
  canvas: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" },
  nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 40px", background: "rgba(5,5,20,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,200,255,0.2)" },
  navLogo: { display: "flex", alignItems: "center", gap: 10 },
  shieldIcon: { fontSize: 28 },
  navTitle: { fontSize: 22, fontWeight: 700, fontFamily: "'Orbitron', sans-serif", background: "linear-gradient(90deg, #00c8ff, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  navLinks: { display: "flex", alignItems: "center", gap: 8 },
  navBtn: { background: "transparent", border: "none", color: "#a0c0ff", cursor: "pointer", padding: "8px 16px", fontSize: 14, fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, letterSpacing: 1, transition: "color 0.2s" },
  loginBtn: { background: "rgba(0,200,255,0.1)", border: "1px solid rgba(0,200,255,0.4)", color: "#00c8ff", padding: "8px 20px", borderRadius: 6, cursor: "pointer", fontSize: 14, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, transition: "all 0.2s" },
  registerBtn: { background: "linear-gradient(135deg, #7c3aed, #00c8ff)", border: "none", color: "#fff", padding: "8px 20px", borderRadius: 6, cursor: "pointer", fontSize: 14, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, transition: "all 0.2s" },
  hero: { position: "relative", zIndex: 10, paddingTop: 140, paddingBottom: 80, textAlign: "center", padding: "140px 40px 80px" },
  heroBadge: { display: "inline-block", background: "rgba(0,200,255,0.1)", border: "1px solid rgba(0,200,255,0.3)", color: "#00c8ff", padding: "6px 20px", borderRadius: 20, fontSize: 13, letterSpacing: 2, marginBottom: 24, fontWeight: 600 },
  heroTitle: { fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 900, fontFamily: "'Orbitron', sans-serif", lineHeight: 1.1, marginBottom: 24, color: "#e0e8ff" },
  heroGlow: { background: "linear-gradient(90deg, #00c8ff, #7c3aed, #00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 20px rgba(0,200,255,0.5))" },
  heroSub: { fontSize: 18, color: "#7090c0", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.6, fontWeight: 400 },
  heroBtns: { display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 },
  primaryBtn: { background: "linear-gradient(135deg, #00c8ff, #7c3aed)", border: "none", color: "#fff", padding: "14px 32px", borderRadius: 8, cursor: "pointer", fontSize: 16, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: 1, boxShadow: "0 0 30px rgba(0,200,255,0.4)", transition: "all 0.2s" },
  secondaryBtn: { background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.5)", color: "#a78bfa", padding: "14px 32px", borderRadius: 8, cursor: "pointer", fontSize: 16, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: 1, transition: "all 0.2s" },
  statsRow: { display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", marginTop: 20 },
  statCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,200,255,0.2)", borderRadius: 12, padding: "20px 30px", textAlign: "center", backdropFilter: "blur(10px)" },
  statIcon: { fontSize: 28, marginBottom: 8 },
  statVal: { fontSize: 28, fontWeight: 700, fontFamily: "'Orbitron', sans-serif", color: "#00c8ff" },
  statLbl: { fontSize: 13, color: "#7090c0", marginTop: 4, letterSpacing: 1 },
  section: { position: "relative", zIndex: 10, padding: "60px 40px", maxWidth: 1200, margin: "0 auto" },
  sectionTitle: { fontSize: 32, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, textAlign: "center", marginBottom: 40, color: "#e0e8ff" },
  featureGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 },
  featureCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,200,255,0.15)", borderRadius: 16, padding: 28, cursor: "pointer", transition: "all 0.3s", backdropFilter: "blur(10px)", position: "relative", overflow: "hidden" },
  featureIcon: { fontSize: 40, marginBottom: 16 },
  featureTitle: { fontSize: 20, fontWeight: 700, fontFamily: "'Orbitron', sans-serif", marginBottom: 10, color: "#00c8ff", fontSize: 16 },
  featureDesc: { fontSize: 15, color: "#7090c0", lineHeight: 1.6, marginBottom: 16 },
  featureArrow: { color: "#7c3aed", fontSize: 20, fontWeight: 700 },
  footer: { position: "relative", zIndex: 10, borderTop: "1px solid rgba(0,200,255,0.1)", padding: "30px 40px", textAlign: "center" },
  footerContent: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10 },
  footerLogo: { fontSize: 20, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: "#00c8ff" },
  footerTip: { fontSize: 13, color: "#506080", maxWidth: 600 },
  footerCopy: { fontSize: 12, color: "#304060" },
};
