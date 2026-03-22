import { useState, useEffect, useRef } from "react";

export default function Login() {
  const canvasRef = useRef(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5, alpha: Math.random() * 0.4 + 0.1,
    }));
    let animId;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(0,200,255,0.03)";
      for (let x = 0; x < canvas.width; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
      for (let y = 0; y < canvas.height; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Store user session in localStorage
      const users = JSON.parse(localStorage.getItem("phishguard_users") || "[]");
      const user = users.find(u => u.email === form.email && u.password === btoa(form.password));
      if (user) {
        localStorage.setItem("phishguard_session", JSON.stringify({ name: user.name, email: user.email }));
        window.location.href = "/Dashboard";
      } else {
        setError("Invalid email or password. Please try again.");
      }
    }, 1500);
  };

  return (
    <div style={styles.root}>
      <canvas ref={canvasRef} style={styles.canvas} />
      <nav style={styles.nav}>
        <div style={styles.navLogo} onClick={() => window.location.href = "/"}>
          <span>🛡️</span>
          <span style={styles.navTitle}>PhishGuard</span>
        </div>
      </nav>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.cardGlow} />
          <div style={styles.iconWrap}><span style={styles.lockIcon}>🔐</span></div>
          <h1 style={styles.title}>Secure Login</h1>
          <p style={styles.subtitle}>Access your security dashboard</p>

          {error && <div style={styles.error}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>📧 Email Address</label>
              <input
                style={styles.input}
                type="email"
                placeholder="analyst@company.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>🔑 Password</label>
              <input
                style={styles.input}
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button style={loading ? styles.btnLoading : styles.btn} type="submit" disabled={loading}>
              {loading ? <><span style={styles.spinner} />Authenticating...</> : "🚀 Login to Dashboard"}
            </button>
          </form>

          <div style={styles.divider}><span style={styles.dividerText}>or</span></div>
          <p style={styles.registerText}>
            Don't have an account?{" "}
            <span style={styles.link} onClick={() => window.location.href = "/Register"}>Create Account →</span>
          </p>
          <button style={styles.backBtn} onClick={() => window.location.href = "/"}>← Back to Home</button>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@400;600;700&display=swap'); * { box-sizing: border-box; } input:focus { outline: none; border-color: rgba(0,200,255,0.6) !important; box-shadow: 0 0 20px rgba(0,200,255,0.2) !important; } @keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }`}</style>
    </div>
  );
}

const styles = {
  root: { minHeight: "100vh", background: "linear-gradient(135deg, #050510 0%, #0a0a2e 50%, #050515 100%)", fontFamily: "'Rajdhani', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  canvas: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" },
  nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", padding: "15px 40px", background: "rgba(5,5,20,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,200,255,0.2)" },
  navLogo: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  navTitle: { fontSize: 20, fontWeight: 700, fontFamily: "'Orbitron', sans-serif", background: "linear-gradient(90deg, #00c8ff, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  container: { position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "100px 20px 40px" },
  card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,200,255,0.2)", borderRadius: 20, padding: "48px 40px", width: "100%", maxWidth: 440, backdropFilter: "blur(20px)", position: "relative", overflow: "hidden", boxShadow: "0 0 60px rgba(0,200,255,0.1)" },
  cardGlow: { position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)", pointerEvents: "none" },
  iconWrap: { textAlign: "center", marginBottom: 16 },
  lockIcon: { fontSize: 56 },
  title: { fontSize: 28, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, textAlign: "center", color: "#e0e8ff", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#7090c0", textAlign: "center", marginBottom: 32 },
  error: { background: "rgba(255,50,50,0.1)", border: "1px solid rgba(255,50,50,0.3)", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#ff8080", marginBottom: 20 },
  form: { display: "flex", flexDirection: "column", gap: 20 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 13, fontWeight: 600, color: "#7090c0", letterSpacing: 1, textTransform: "uppercase" },
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,200,255,0.2)", borderRadius: 8, padding: "14px 16px", fontSize: 15, color: "#e0e8ff", fontFamily: "'Rajdhani', sans-serif", transition: "all 0.2s" },
  btn: { background: "linear-gradient(135deg, #00c8ff, #7c3aed)", border: "none", borderRadius: 8, padding: "15px", fontSize: 16, fontWeight: 700, color: "#fff", cursor: "pointer", letterSpacing: 1, fontFamily: "'Rajdhani', sans-serif", boxShadow: "0 0 30px rgba(0,200,255,0.3)", transition: "all 0.2s", marginTop: 4 },
  btnLoading: { background: "rgba(0,200,255,0.2)", border: "1px solid rgba(0,200,255,0.3)", borderRadius: 8, padding: "15px", fontSize: 16, fontWeight: 700, color: "#00c8ff", cursor: "not-allowed", letterSpacing: 1, fontFamily: "'Rajdhani', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 4, animation: "pulse 1.5s infinite" },
  spinner: { width: 16, height: 16, border: "2px solid rgba(0,200,255,0.3)", borderTop: "2px solid #00c8ff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" },
  divider: { textAlign: "center", margin: "24px 0", position: "relative", borderTop: "1px solid rgba(0,200,255,0.1)" },
  dividerText: { position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "transparent", padding: "0 12px", color: "#506080", fontSize: 13 },
  registerText: { textAlign: "center", fontSize: 15, color: "#7090c0" },
  link: { color: "#00c8ff", cursor: "pointer", fontWeight: 700 },
  backBtn: { width: "100%", marginTop: 16, background: "transparent", border: "none", color: "#506080", cursor: "pointer", fontSize: 14, fontFamily: "'Rajdhani', sans-serif", padding: 8 },
};
