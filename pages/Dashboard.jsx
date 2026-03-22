import { useState, useEffect, useRef } from "react";
import { EmailAnalysis } from "../api/entities";

export default function Dashboard() {
  const canvasRef = useRef(null);
  const [session, setSession] = useState(null);
  const [stats, setStats] = useState({ total: 0, phishing: 0, suspicious: 0, safe: 0 });
  const [recent, setRecent] = useState([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const s = localStorage.getItem("phishguard_session");
    if (s) setSession(JSON.parse(s));
    // Load stats
    EmailAnalysis.list().then(records => {
      const t = records.length;
      const p = records.filter(r => r.risk_level === "PHISHING").length;
      const su = records.filter(r => r.risk_level === "SUSPICIOUS").length;
      const sa = records.filter(r => r.risk_level === "SAFE").length;
      setStats({ total: t, phishing: p, suspicious: su, safe: sa });
      setRecent(records.slice(-5).reverse());
    }).catch(() => {});

    const ticker = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(ticker);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5, alpha: Math.random() * 0.3 + 0.05,
    }));
    let animId;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(0,200,255,0.03)";
      for (let x = 0; x < canvas.width; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
      for (let y = 0; y < canvas.height; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,200,255,${p.alpha})`; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  const logout = () => {
    localStorage.removeItem("phishguard_session");
    window.location.href = "/";
  };

  const nav = (p) => window.location.href = `/${p}`;

  const statCards = [
    { label: "Total Analyzed", value: stats.total, icon: "📧", color: "#00c8ff", bg: "rgba(0,200,255,0.1)", border: "rgba(0,200,255,0.3)" },
    { label: "Phishing Detected", value: stats.phishing, icon: "🎣", color: "#ff4444", bg: "rgba(255,68,68,0.1)", border: "rgba(255,68,68,0.3)" },
    { label: "Suspicious Emails", value: stats.suspicious, icon: "⚠️", color: "#ffaa00", bg: "rgba(255,170,0,0.1)", border: "rgba(255,170,0,0.3)" },
    { label: "Safe Emails", value: stats.safe, icon: "✅", color: "#00ff88", bg: "rgba(0,255,136,0.1)", border: "rgba(0,255,136,0.3)" },
  ];

  const riskColors = { PHISHING: { color: "#ff4444", bg: "rgba(255,68,68,0.15)", border: "rgba(255,68,68,0.4)" }, SUSPICIOUS: { color: "#ffaa00", bg: "rgba(255,170,0,0.15)", border: "rgba(255,170,0,0.4)" }, SAFE: { color: "#00ff88", bg: "rgba(0,255,136,0.15)", border: "rgba(0,255,136,0.4)" } };

  return (
    <div style={styles.root}>
      <canvas ref={canvasRef} style={styles.canvas} />
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}>🛡️<span style={styles.sideTitle}>PhishGuard</span></div>
        <div style={styles.sideUser}>
          <div style={styles.avatar}>{session?.name?.[0]?.toUpperCase() || "U"}</div>
          <div>
            <div style={styles.userName}>{session?.name || "Analyst"}</div>
            <div style={styles.userRole}>Security Analyst</div>
          </div>
        </div>
        <nav style={styles.sideNav}>
          {[
            { icon: "📊", label: "Dashboard", page: "Dashboard", active: true },
            { icon: "🔍", label: "Email Analyzer", page: "Analyzer" },
            { icon: "📋", label: "Reports", page: "Report" },
            { icon: "🎓", label: "Awareness", page: "Awareness" },
            { icon: "📋", label: "Guidelines", page: "Guidelines" },
          ].map(item => (
            <button key={item.page} style={item.active ? styles.sideItemActive : styles.sideItem} onClick={() => nav(item.page)}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button style={styles.logoutBtn} onClick={logout}>🚪 Logout</button>
      </div>

      {/* Main content */}
      <div style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>Security Dashboard</h1>
            <p style={styles.pageSubtitle}>Welcome back, {session?.name || "Analyst"}. Monitor your email security status.</p>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.threatLevel}>
              <div style={styles.tlDot} />
              <span style={styles.tlText}>System Online</span>
            </div>
            <div style={styles.clock}>{time.toLocaleTimeString()}</div>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={styles.statsGrid}>
          {statCards.map((s, i) => (
            <div key={i} style={{ ...styles.statCard, background: s.bg, border: `1px solid ${s.border}` }}>
              <div style={styles.statTop}>
                <div style={styles.statIconWrap}>{s.icon}</div>
                <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
              </div>
              <div style={styles.statLabel}>{s.label}</div>
              <div style={{ ...styles.statBar, background: `rgba(255,255,255,0.05)` }}>
                <div style={{ height: "100%", width: stats.total > 0 ? `${(s.value / stats.total) * 100}%` : "0%", background: s.color, borderRadius: 2, transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>⚡ Quick Actions</h2>
          <div style={styles.actionsGrid}>
            {[
              { icon: "🔍", label: "Analyze Email", desc: "Check an email for phishing", page: "Analyzer", color: "#00c8ff" },
              { icon: "📋", label: "View Reports", desc: "Browse analysis history", page: "Report", color: "#a78bfa" },
              { icon: "🎓", label: "Phishing Awareness", desc: "Learn about threats", page: "Awareness", color: "#00ff88" },
              { icon: "📋", label: "Security Guidelines", desc: "Best practices & rules", page: "Guidelines", color: "#ffaa00" },
            ].map((a, i) => (
              <button key={i} style={{ ...styles.actionCard, borderColor: `${a.color}40` }} onClick={() => nav(a.page)}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{a.icon}</div>
                <div style={{ ...styles.actionLabel, color: a.color }}>{a.label}</div>
                <div style={styles.actionDesc}>{a.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Analyses */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>🕐 Recent Analyses</h2>
            <button style={styles.viewAllBtn} onClick={() => nav("Report")}>View All →</button>
          </div>
          {recent.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <p style={{ color: "#506080", fontSize: 16 }}>No emails analyzed yet.</p>
              <button style={styles.analyzeNowBtn} onClick={() => nav("Analyzer")}>Analyze Your First Email →</button>
            </div>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {["Sender", "Subject", "Risk Level", "Date"].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r, i) => {
                    const rc = riskColors[r.risk_level] || riskColors.SAFE;
                    return (
                      <tr key={i} style={styles.tr}>
                        <td style={styles.td}>{r.sender?.substring(0, 30) || "-"}</td>
                        <td style={styles.td}>{r.subject?.substring(0, 35) || "-"}</td>
                        <td style={styles.td}>
                          <span style={{ ...styles.badge, background: rc.bg, border: `1px solid ${rc.border}`, color: rc.color }}>{r.risk_level}</span>
                        </td>
                        <td style={styles.td}>{r.created_date ? new Date(r.created_date).toLocaleDateString() : "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@300;400;600;700&display=swap'); * { box-sizing: border-box; } button:hover { opacity: 0.85; } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}

const styles = {
  root: { minHeight: "100vh", background: "linear-gradient(135deg, #050510 0%, #080820 100%)", fontFamily: "'Rajdhani', sans-serif", color: "#e0e8ff", display: "flex" },
  canvas: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" },
  sidebar: { position: "fixed", left: 0, top: 0, bottom: 0, width: 240, background: "rgba(5,5,20,0.95)", borderRight: "1px solid rgba(0,200,255,0.15)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", padding: 20, zIndex: 50 },
  sidebarLogo: { display: "flex", alignItems: "center", gap: 10, marginBottom: 30, fontSize: 20 },
  sideTitle: { fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 16, background: "linear-gradient(90deg, #00c8ff, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  sideUser: { display: "flex", alignItems: "center", gap: 12, background: "rgba(0,200,255,0.06)", border: "1px solid rgba(0,200,255,0.15)", borderRadius: 10, padding: "12px", marginBottom: 24 },
  avatar: { width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #00c8ff, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", flexShrink: 0 },
  userName: { fontSize: 14, fontWeight: 700, color: "#e0e8ff" },
  userRole: { fontSize: 11, color: "#506080" },
  sideNav: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  sideItem: { display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 8, background: "transparent", border: "none", color: "#7090c0", cursor: "pointer", fontSize: 14, fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, textAlign: "left", transition: "all 0.2s" },
  sideItemActive: { display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 8, background: "rgba(0,200,255,0.1)", border: "1px solid rgba(0,200,255,0.25)", color: "#00c8ff", cursor: "pointer", fontSize: 14, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, textAlign: "left" },
  logoutBtn: { background: "rgba(255,68,68,0.1)", border: "1px solid rgba(255,68,68,0.3)", color: "#ff8080", padding: "10px 14px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, marginTop: 16 },
  main: { marginLeft: 240, flex: 1, padding: 32, position: "relative", zIndex: 10 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 },
  pageTitle: { fontSize: 28, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: "#e0e8ff", marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: "#506080" },
  headerRight: { display: "flex", alignItems: "center", gap: 16 },
  threatLevel: { display: "flex", alignItems: "center", gap: 8, background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 20, padding: "6px 14px" },
  tlDot: { width: 8, height: 8, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 8px #00ff88", animation: "pulse 2s infinite" },
  tlText: { fontSize: 13, color: "#00ff88", fontWeight: 600 },
  clock: { fontSize: 18, fontFamily: "'Orbitron', sans-serif", color: "#00c8ff", fontWeight: 700 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 },
  statCard: { borderRadius: 12, padding: "20px", backdropFilter: "blur(10px)" },
  statTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  statIconWrap: { fontSize: 28 },
  statValue: { fontSize: 36, fontFamily: "'Orbitron', sans-serif", fontWeight: 700 },
  statLabel: { fontSize: 13, color: "#7090c0", marginBottom: 10, fontWeight: 600 },
  statBar: { height: 4, borderRadius: 2, overflow: "hidden" },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: "#e0e8ff", marginBottom: 16 },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  viewAllBtn: { background: "transparent", border: "1px solid rgba(0,200,255,0.3)", color: "#00c8ff", padding: "6px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 },
  actionsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 },
  actionCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,200,255,0.1)", borderRadius: 12, padding: "24px 20px", cursor: "pointer", textAlign: "center", transition: "all 0.3s", fontFamily: "'Rajdhani', sans-serif" },
  actionLabel: { fontSize: 16, fontWeight: 700, marginBottom: 6, fontFamily: "'Orbitron', sans-serif", fontSize: 13 },
  actionDesc: { fontSize: 13, color: "#506080" },
  emptyState: { textAlign: "center", padding: "48px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(0,200,255,0.1)" },
  analyzeNowBtn: { background: "linear-gradient(135deg, #00c8ff, #7c3aed)", border: "none", color: "#fff", padding: "12px 24px", borderRadius: 8, cursor: "pointer", fontSize: 15, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, marginTop: 16 },
  tableWrap: { overflowX: "auto", borderRadius: 12, border: "1px solid rgba(0,200,255,0.15)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "14px 16px", textAlign: "left", fontSize: 12, color: "#506080", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(0,200,255,0.1)" },
  tr: { borderBottom: "1px solid rgba(0,200,255,0.06)" },
  td: { padding: "14px 16px", fontSize: 14, color: "#a0b8d0" },
  badge: { padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: 1 },
};
